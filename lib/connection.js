// Made with ❤ by AlienAlfa
// Performance optimized imports
const path = require("path");
const fs = require("fs");
const logger = require("./logger");
const messageGuard = require("./messageGuard");
const consoleGuard = require("./consoleGuard");

// Lazy load heavy dependencies
let plugins, makeWASocket, useMultiFileAuthState, fetchLatestBaileysVersion;
let Browsers, delay, makeCacheableSignalKeyStore, DisconnectReason, WAMessageStubType;
let PausedChats, config, serialize, Greetings;
let Image, Message, Sticker, Video, AllMessage;
let io, getcall, loadMessage, saveMessage, saveChat, getName, flushMessageQueue, saveDeletedMessage, getQueueStats;
let QRCode, qrTerminal;

// Logger handed to Baileys. pino 'silent' still prints RAW OBJECT DUMPS
// (SessionEntry / Buffer contents) that libsignal passes as message objects -
// pino serialises the object straight to stdout, bypassing BOTH our logger and
// the console guard (the "perkey bundle things" / session spam from #3).
// This child logger swallows any record whose text matches the known session-
// dump signatures, so only real Baileys errors surface.
const SESSION_DUMP_RES = [
  /Closing session:/,
  /Removing old closed session/,
  /SessionEntry/,
  /ephemeralKeyPair/,
  /lastRemoteEphemeralKey/,
  /remoteIdentityKey/,
  /pendingPreKey/,
  /registrationId:/,
  /currentRatchet:/,
  /previousCounter:/,
  /rootKey:/,
  /indexInfo:/,
  /baseKey/,
  /baseKeyType:/,
  /chainKey/,
  /chainType:/,
  /messageKeys/,
  /<Buffer /,
];
const pinoHasSessionDump = (args) => {
  try {
    const utilLocal = require('util');
    const text = (args || [])
      .map((a) => {
        if (typeof a === 'string') return a;
        if (a instanceof Error) return `${a.message} ${a.stack || ''}`;
        if (a && typeof a === 'object') {
          // Same reason as consoleGuard.textOf: util.inspect keeps class
          // names + <Buffer> markers that JSON.stringify drops (issue #3).
          try {
            return `${a.constructor && a.constructor.name !== 'Object' ? a.constructor.name + ' ' : ''}${utilLocal.inspect(a, { depth: 4, breakLength: 120 })}`;
          } catch { return ''; }
        }
        return '';
      })
      .join(' ');
    return SESSION_DUMP_RES.some((re) => re.test(text));
  } catch {
    return false;
  }
};
const pinoLogger = {
  level: 'silent',
  trace: () => {},
  debug: (...a) => { if (!pinoHasSessionDump(a)) logger.trace(a[0], a[1]); },
  info: (...a) => { if (!pinoHasSessionDump(a)) logger.debug(a[0], a[1]); },
  warn: (...a) => { if (!pinoHasSessionDump(a)) consoleGuard.swallowOrAggregate(a); },
  error: (...a) => { if (!pinoHasSessionDump(a)) consoleGuard.swallowOrAggregate(a); },
  fatal: (...a) => { if (!pinoHasSessionDump(a)) consoleGuard.swallowOrAggregate(a); },
  child: () => pinoLogger,
};

// Global flag to track if connection should be stopped
let connectionStopped = false;
let currentConnection = null; // Store current connection instance
let connectionStarting = false;
let connectionAttempts = 0; // consecutive failures (resets on successful open)
// Reconnect policy: transient closes (440 replaced / 515 restart-required /
// 428 closed / 408 lost) retry FOREVER with exponential backoff. Only a real
// 401 logout stops retrying. A hard attempt cap used to leave the bot silently
// dead after a few rapid 440s (issue #4 follow-up).

// ---- Runtime statistics (surfaced on the web dashboard via IPC) ----
const stats = {
  startTime: Date.now(),
  processed: 0,        // messages that reached the handler pipeline
  suppressedDup: 0,    // replayed messages skipped (memory / command log / DB)
  suppressedStale: 0,  // old messages dropped by the age cutoff
  suppressedHistory: 0,// history/offline ('append') upserts ignored
  decryptFailed: 0,    // undecryptable msgs left for Baileys' retry flow
  pausedBlocked: 0,    // messages blocked by paused chats
  // ---- Liveness / self-healing telemetry (issue: "connected but deaf") ----
  lastInboundAt: 0,    // last time ANY frame arrived from WhatsApp
  lastPongAt: 0,       // last successful liveness ping
  zombieKills: 0,      // dead-but-"open" sockets force-closed by watchdog
  sessionHeals: 0,     // automatic signal-session rebuilds (no rescan needed)
  watchdogKicks: 0     // supervisor-initiated connect() kicks
};

// ---- Liveness watchdog configuration ----
const PING_INTERVAL_MS = 30000;        // probe the socket every 30s
const PING_TIMEOUT_MS = 10000;         // a ping that takes >10s = dead socket
const PING_FAILS_TO_KILL = 2;          // 2 consecutive failed pings -> reconnect
const SESSION_HEAL_THRESHOLD = 15;     // decrypt failures within window...
const SESSION_HEAL_WINDOW_MS = 5 * 60 * 1000; // ...in 5 minutes -> heal
const SESSION_HEAL_COOLDOWN_MS = 10 * 60 * 1000; // at most one heal / 10 min

/**
 * Race a promise against a timeout. On timeout the underlying operation is
 * NOT cancelled (JS can't cancel promises) but the caller unblocks - this is
 * what keeps a hung DB read/write from freezing the whole message pipeline.
 */
function withTimeout(promise, ms, label = "operation") {
  let timer = null;
  const timeout = new Promise((_, reject) => {
    timer = setTimeout(
      () => reject(new Error(`${label} timed out after ${ms}ms`)),
      ms
    );
  });
  return Promise.race([
    Promise.resolve(promise).finally(() => { if (timer) clearTimeout(timer); }),
    timeout
  ]);
}

// Decrypt-failure tracking for signal-session self-heal
const decryptWindow = { start: 0, count: 0, lastHealAt: 0 };

// Process-level handlers are installed EXACTLY ONCE. They used to be
// registered inside Aurora(), accumulating on every reconnect.
let processHandlersInstalled = false;
const installProcessHandlers = () => {
  if (processHandlersInstalled) return;
  processHandlersInstalled = true;
  process.on("uncaughtException", (err) => {
    logger.error("Uncaught exception", { error: err });
  });
  process.on("unhandledRejection", (err) => {
    logger.warn("Unhandled rejection", {
      error: err instanceof Error ? err : String(err)
    });
  });
};

// ===========================================================================
// LIVENESS ENGINE - makes "connected but permanently deaf" impossible.
// Layer 1: per-socket ping watchdog (below). Layer 2: signal-session
// self-heal on decrypt storms. Layer 3: global supervisor kicks connect().
// ===========================================================================

let pingWatchdogTimer = null;
let supervisorTimer = null;
let sessionHealInProgress = false;

/** Record inbound traffic (called from the frame-level hook + key events). */
function markInbound() {
  stats.lastInboundAt = Date.now();
}

/**
 * Force-close a socket we believe is dead. conn.end() emits the close event
 * -> handleConnectionUpdate -> backoff reconnect. If that somehow doesn't
 * fire, the supervisor interval kicks connect() anyway within 30s.
 */
function forceReconnect(conn, reason) {
  logger.whatsapp("Forcing reconnect", { reason });
  try {
    if (conn) conn.end();
  } catch (error) {
    logger.warn("forceReconnect: conn.end() threw", { error: error.message });
  }
}

/** Stop the per-socket ping watchdog (called when a socket dies). */
function stopPingWatchdog() {
  if (pingWatchdogTimer) {
    clearInterval(pingWatchdogTimer);
    pingWatchdogTimer = null;
  }
}

/**
 * Start the per-socket liveness watchdog. Called once per live socket from
 * Aurora(). Pings every 30s; PING_FAILS_TO_KILL consecutive failures =
 * zombie socket -> force reconnect.
 */
function startPingWatchdog(conn) {
  stopPingWatchdog(); // never two watchdogs for different sockets
  let consecutiveFails = 0;

  pingWatchdogTimer = setInterval(async () => {
    try {
      if (connectionStopped || currentConnection !== conn) {
        stopPingWatchdog();
        return;
      }

      // Layer 1a: cheap local check - WS itself says it's not open
      if (conn.ws && (conn.ws.isClosed || conn.ws.isClosing)) {
        consecutiveFails++;
        logger.warn("Ping watchdog: socket reports closed/closing", {
          consecutiveFails
        });
      } else {
        // Layer 1b: active probe - can we still get a pong from WhatsApp?
        // NOTE: the xmlns 'w:p' is REQUIRED - without it WhatsApp never
        // answers the ping and the watchdog would false-positive into a
        // reconnect loop (matches Baileys' own keepalive format exactly).
        try {
          await withTimeout(
            conn.query(
              { tag: "iq", attrs: { to: "s.whatsapp.net", type: "get", xmlns: "w:p", id: conn.generateMessageTag() }, content: [{ tag: "ping", attrs: {} }] },
              PING_TIMEOUT_MS
            ),
            PING_TIMEOUT_MS + 2000,
            "liveness ping"
          );
          consecutiveFails = 0;
          stats.lastPongAt = Date.now();
          return;
        } catch (error) {
          consecutiveFails++;
          logger.warn("Ping watchdog: liveness ping failed", {
            consecutiveFails,
            error: error.message
          });
        }
      }

      if (consecutiveFails >= PING_FAILS_TO_KILL) {
        stats.zombieKills++;
        stopPingWatchdog();
        forceReconnect(conn, `liveness ping failed ${consecutiveFails}x (zombie socket)`);
      }
    } catch (error) {
      logger.warn("Ping watchdog error", { error: error.message });
    }
  }, PING_INTERVAL_MS);

  if (pingWatchdogTimer.unref) pingWatchdogTimer.unref();
  stats.lastPongAt = Date.now(); // assume alive until first failed probe
}

/**
 * Automatic signal-session rebuild (fixes "rescan was the only cure").
 * When signal sessions go permanently stale, WhatsApp delivers every message
 * as undecryptable CIPHERTEXT - bot looks connected but is 100% deaf. We
 * detect that storm (trackDecryptFailure below) and purge only the ratchet
 * state (session-*, sender-key-*). creds.json, pre-keys and app-state keys
 * stay untouched, so NO rescan is required - the next message establishes a
 * fresh session automatically.
 */
function healSignalSessions(reason) {
  if (sessionHealInProgress) return;
  const now = Date.now();
  if (now - decryptWindow.lastHealAt < SESSION_HEAL_COOLDOWN_MS) return;

  sessionHealInProgress = true;
  decryptWindow.lastHealAt = now;
  stats.sessionHeals++;

  try {
    const sessionDir = path.join(global.__basedir || process.cwd(), "session");
    const backupDir = path.join(sessionDir, `signal-backup-${now}`);
    fs.mkdirSync(backupDir, { recursive: true });

    let moved = 0;
    for (const file of fs.readdirSync(sessionDir)) {
      // Only purge signal ratchet state. KEEP: creds.json (login),
      // pre-key-* (our identity keys), app-state-sync-key-* (settings),
      // config-overrides.json, lid-map.json, previous backups.
      if (/^(session-|sender-key-)/.test(file) && file.endsWith(".json")) {
        try {
          fs.renameSync(path.join(sessionDir, file), path.join(backupDir, file));
          moved++;
        } catch { /* best effort - a locked file just stays */ }
      }
    }

    // Keep only the 3 most recent backups to avoid disk creep
    const backups = fs.readdirSync(sessionDir)
      .filter((f) => f.startsWith("signal-backup-"))
      .sort();
    while (backups.length > 3) {
      const oldest = backups.shift();
      try { fs.rmSync(path.join(sessionDir, oldest), { recursive: true, force: true }); } catch { /* ignore */ }
    }

    logger.whatsapp("Signal sessions auto-rebuilt (no rescan needed)", {
      reason,
      sessionsPurged: moved,
      backupDir: path.relative(process.cwd(), backupDir)
    });
  } catch (error) {
    logger.error("Signal session heal failed", { error: error.message });
  } finally {
    sessionHealInProgress = false;
  }
}

/** Called from the decryptFailed path - tracks the storm and heals if needed. */
function trackDecryptFailure(conn) {
  const now = Date.now();
  if (now - decryptWindow.start > SESSION_HEAL_WINDOW_MS) {
    decryptWindow.start = now;
    decryptWindow.count = 0;
  }
  decryptWindow.count++;

  if (decryptWindow.count >= SESSION_HEAL_THRESHOLD) {
    healSignalSessions(`${decryptWindow.count} decrypt failures in ${SESSION_HEAL_WINDOW_MS / 60000}min`);
    decryptWindow.count = 0;
    decryptWindow.start = now;
    // Reconnect so the rebuilt sessions take effect immediately
    forceReconnect(conn, "signal sessions rebuilt - reconnecting to apply");
  }
}

/**
 * Global supervisor: last line of defense. If no socket is live and we're
 * not starting one, kick connect(). Also unsticks connectionStarting if it
 * hung mid-flight. With this running, the bot ALWAYS comes back on its own -
 * the "reconnect chain died, bot dead forever" failure mode is eliminated.
 */
function startSupervisor() {
  if (supervisorTimer) return;
  supervisorTimer = setInterval(() => {
    try {
      if (connectionStopped) return;

      const connAlive = !!(currentConnection &&
        currentConnection.ws &&
        !currentConnection.ws.isClosed &&
        !currentConnection.ws.isClosing);

      // Recover a stuck "starting" flag (>90s with no socket = connect()
      // hung mid-flight; without this the bot would never try again).
      if (connectionStarting && !connAlive && !currentConnection) {
        if (!supervisorStartingSince) supervisorStartingSince = Date.now();
        if (Date.now() - supervisorStartingSince > 90000) {
          logger.warn("Supervisor: connectionStarting stuck true for >90s - resetting");
          connectionStarting = false;
          supervisorStartingSince = null;
        }
      } else {
        supervisorStartingSince = null;
      }

      if (!connAlive && !connectionStarting) {
        stats.watchdogKicks++;
        logger.whatsapp("Supervisor: no live socket - kicking connect()", {
          kicks: stats.watchdogKicks,
          connectionAttempts
        });
        connect().catch((error) => {
          connectionStarting = false;
          logger.error("Supervisor connect() kick failed", { error: error.message });
        });
      }
    } catch (error) {
      logger.warn("Supervisor error", { error: error.message });
    }
  }, 30000);
  if (supervisorTimer.unref) supervisorTimer.unref();
}
let supervisorStartingSince = null;

// NOTE: 'stop_whatsapp' / 'start_whatsapp' IPC is handled by index.js which
// calls connect.stop() / connect.resume(). This module must be required
// exactly once - re-requiring it (old approach) leaked listeners AND sockets,
// which is one of the causes of multiplying "Bad MAC" errors (issue #4).

// Lazy loading function for performance
const initializeDependencies = async () => {
  if (!plugins) {
    logger.debug('Initializing WhatsApp connection dependencies');
    
    plugins = require("./plugins");
    const baileys = require("@whiskeysockets/baileys");
    ({ 
      default: makeWASocket,
      useMultiFileAuthState,
      fetchLatestBaileysVersion,
      Browsers,
      delay,
      makeCacheableSignalKeyStore,
      DisconnectReason,
      WAMessageStubType,
    } = baileys);
    
    config = require("../config");
    
    // Always use local database operations as primary
    ({ PausedChats } = require("../assets/database"));
    ({ loadMessage, saveMessage, saveChat, getName, flushMessageQueue, saveDeletedMessage, getQueueStats } = require("../assets/database/StoreDb"));
    
    ({ serialize, Greetings } = require("./index"));
    ({ Image, Message, Sticker, Video, AllMessage } = require("./Messages"));
    io = require("socket.io-client");
    ({ getcall } = require("../assets/database/callAction"));
    QRCode = require("qrcode");
    qrTerminal = require("qrcode-terminal");
    
    logger.debug('WhatsApp dependencies initialized successfully');
  }
};

const connect = async () => {
  // Initialize dependencies only when needed
  await initializeDependencies();

  // Install process-level error handlers exactly once
  installProcessHandlers();

  // Global supervisor: guarantees the bot always comes back even if the
  // reconnect chain dies on an exception (the "bot dead until manual
  // restart" failure mode).
  startSupervisor();

  // SINGLE-SOCKET GUARD: never open a second socket while one is alive.
  // Two live sockets sharing one signal session is a classic cause of
  // multiplying "Bad MAC" errors (issue #4).
  if (currentConnection) {
    logger.whatsapp('connect() called while a connection is already active - reusing it');
    return currentConnection;
  }
  if (connectionStarting) {
    logger.whatsapp('connect() ignored while a socket is already being created');
    return null;
  }
  connectionStarting = true;

  // Monitor connection stop status
  const connectionMonitor = setInterval(() => {
    if (connectionStopped && currentConnection) {
      logger.whatsapp('Connection monitor detected stop request, closing connection');
      try {
        currentConnection.end();
        currentConnection = null;
      } catch (error) {
        logger.warn('Error in connection monitor cleanup', { error: error.message });
      }
      clearInterval(connectionMonitor);
    }
  }, 1000); // Check every second

const Aurora = async () => {
  // Check if connection is stopped before proceeding
  if (connectionStopped) {
    logger.whatsapp('Connection attempt blocked - service is stopped');
    connectionStarting = false;
    clearInterval(connectionMonitor);
    return null;
  }

  // NOTE: connectionAttempts is incremented ONLY in the close handler before
  // backing off, and reset on 'open'. Incrementing here too would
  // double-count every retry and skew the backoff (1s -> 4s -> 16s...).
  logger.whatsapp('Starting connection attempt', { attempt: connectionAttempts + 1 });
  
  const sessionDir = "./session";
  
  // Performance: Use synchronous check only if needed
  try {
    await fs.promises.access(sessionDir);
  } catch {
    await fs.promises.mkdir(sessionDir, { recursive: true });
    logger.debug('Session directory created');
  }

  // Parallel execution for better performance (version fetch has an internal
  // fallback + now a 5s timeout so a bad network can't delay startup)
  logger.debug('Loading authentication state and fetching latest version');
  const [{ state, saveCreds }, { version }] = await Promise.all([
    useMultiFileAuthState(path.join(__basedir, sessionDir)),
    fetchLatestBaileysVersion({ timeout: 5000 })
  ]);
  
  logger.whatsapp('Authentication loaded', { version });

  if (connectionStopped) {
    connectionStarting = false;
    clearInterval(connectionMonitor);
    return null;
  }

  const conn = makeWASocket({
    auth: {
      creds: state.creds,
      keys: makeCacheableSignalKeyStore(state.keys, pinoLogger),
    },
    logger: pinoLogger,
    browser: Browsers.macOS("Desktop"),
    downloadHistory: false,
    syncFullHistory: false,
    markOnlineOnConnect: true,
    emitOwnEvents: true,
    version,
    // Suppress verbose session messages
    printQRInTerminal: false,
    // Performance: Cache messages to reduce database calls
    getMessage: async (key) => {
      try {
        const message = await loadMessage(key.id);
        return message?.message || { conversation: null };
      } catch (error) {
        logger.warn('Error loading message', { keyId: key.id, error: error.message });
        return { conversation: null };
      }
    }
  });

  // Store the connection instance globally
  currentConnection = conn;
  connectionStarting = false;

  // ---- Liveness layer 1: ping watchdog for THIS socket. Probes every 30s;
  // a dead-but-"open" zombie socket is force-closed after 2 failed pings and
  // the normal reconnect path takes over. ----
  startPingWatchdog(conn);

  // Track ANY inbound frame as proof of life (used by the supervisor to
  // distinguish "quiet chat" from "dead connection").
  try {
    conn.ws.on("frame", markInbound);
  } catch { /* older Baileys without frame events - ping watchdog still works */ }
  conn.ev.on("messages.upsert", markInbound);

  // Performance: Initialize socket connection with error handling
  let ws;
  try {
    ws = io("https://socket.xasena.me/", { 
      reconnection: true,
      timeout: 5000,
      forceNew: true
    });
    ws.on("connect", () => logger.debug("WebSocket connected to server"));
    ws.on("disconnect", () => logger.debug("WebSocket disconnected from server"));
    ws.on("error", (err) => logger.warn("WebSocket error", { error: err.message }));
  } catch (error) {
    logger.warn("Failed to initialize WebSocket", { error: error.message });
  }


  // Performance: Optimize event listeners
  conn.ev.on("connection.update", handleConnectionUpdate(conn, ws));
  conn.ev.on("creds.update", saveCreds);
  conn.ev.on("group-participants.update", async (data) => {
    try {
      await Greetings(data, conn);
    } catch (error) {
      logger.warn("Greetings error:", error);
    }
  });

  // Performance: Batch chat updates
  const chatUpdateQueue = [];
  let chatUpdateTimer = null;
  
  conn.ev.on("chats.update", async (chats) => {
    chatUpdateQueue.push(...chats);
    
    if (chatUpdateTimer) clearTimeout(chatUpdateTimer);
    chatUpdateTimer = setTimeout(async () => {
      const batchChats = [...chatUpdateQueue];
      chatUpdateQueue.length = 0;
      
      try {
        await Promise.allSettled(
          batchChats.map(chat => saveChat(chat))
        );
      } catch (error) {
        logger.warn("Batch chat update error:", error);
      }
    }, 100); // Batch updates every 100ms
  });
  
  conn.ev.on("messages.upsert", handleMessages(conn, ws));
  conn.ev.on("messages.update", async (updates) => {
    for (const { key, update } of updates || []) {
      if (update?.messageStubType !== WAMessageStubType.REVOKE) continue;
      const revokeKey = update.key;
      if (!key?.id || !revokeKey?.id || !revokeKey.remoteJid) continue;
      await saveDeletedMessage({
        id: revokeKey.id,
        jid: revokeKey.remoteJid,
        originalMessageId: key.id,
        deletedAt: new Date(),
      });
    }
  });

  // Process-level uncaughtException / unhandledRejection handlers are
  // installed once at module level (see installProcessHandlers) - they must
  // NOT be registered here anymore, or they accumulate on every reconnect.

  // Performance: Optimized call handling with caching
  let callListCache = null;
  let callCacheExpiry = 0;
  
  conn.ev.on("call", async (c) => {
    try {
      const now = Date.now();
      if (!callListCache || now > callCacheExpiry) {
        callListCache = await getcall();
        callCacheExpiry = now + 30000; // Cache for 30 seconds
      }
      
      const call = Array.isArray(c) ? c[0] : c;
      const { status, from, id } = call;
      
      const frmid = from.includes(":") ? from.split(":")[0] : from.split("@")[0];
      const isAllowed = config.ALLOW_ALL_CALLS || callListCache.some(item =>
        item.dataValues?.chatId.split("@")[0] === frmid
      );
      
      logger.info(`[Call from: ${frmid}]`);
      
      if (status === "offer" && !isAllowed) {
        await Promise.all([
          conn.rejectCall(id, from),
          conn.sendMessage(from, {
            text: "Sorry no calls. Please use Text or Voice Message\n> Automated System"
          })
        ]);
      }
    } catch (error) {
      logger.warn("Call handling error:", error);
    }
  });

  // Centralized process error handling (installed once - see installProcessHandlers)

  return conn;
};

const handleConnectionUpdate = (conn, ws) => async (s) => {
  const { connection, lastDisconnect, qr } = s;
  
  try {
    if (qr) {
      // Don't show QR if connection is stopped
      if (connectionStopped) {
        logger.whatsapp('QR generation skipped - service is stopped');
        return;
      }
      
      // Use qrcode-terminal for better terminal display with small size
      logger.info('\n' + '═'.repeat(50));
      logger.info('SCAN QR CODE WITH WHATSAPP:');
      logger.info('═'.repeat(50));
      qrTerminal.generate(qr, { small: true });
      logger.info('═'.repeat(50) + '\n');
      logger.whatsapp('QR code generated for authentication (scan with WhatsApp mobile app)');
    } else if (connection === "open") {
      // Don't process connection open if stopped
      if (connectionStopped) {
        logger.whatsapp('Connection open ignored - service is stopped');
        conn.end();
        return;
      }

      // Successful (re)connect: reset the consecutive-failure counter so the
      // backoff starts fresh on the NEXT failure sequence.
      connectionAttempts = 0;
      if (config.SIMPLE_LOGS) {
        console.log("Login Successful!");
      } else {
        logger.whatsapp('WhatsApp connected successfully');
      }
      
      // Notify parent process about successful connection
      if (process.send) {
        process.send('whatsapp_connected');
      }
      
      // Performance: Parallel data gathering
      const [totalPlugins, workType, packageVersion, num] = await Promise.all([
        Promise.resolve(plugins.commands.length),
        Promise.resolve(config.WORK_TYPE),
        Promise.resolve(require("../package.json").version),
        Promise.resolve(conn.user.id.split(":")[0])
      ]);
      
      if (config.SIMPLE_LOGS) {
        // X-Asena style status message
        const statusMessage = `\`\`\`Aurora-MD connected\nVersion: ${packageVersion}\nTotal Plugins: ${totalPlugins}\nWorktype: ${workType}\`\`\``;
        console.log(statusMessage);
      } else {
        logger.system('Aurora-MD ready', {
          number: num,
          plugins: totalPlugins,
          workType,
          version: packageVersion
        });
      }
    } else if (connection === "close") {
      // This socket is dead - stop its liveness watchdog so it can't fire
      // against a corpse (the next Aurora() starts a fresh one).
      stopPingWatchdog();

      // Clear the current connection reference
      if (currentConnection === conn) {
        currentConnection = null;
      }
      
      // Notify parent process about disconnection (but not when we stopped
      // on purpose - otherwise the dashboard status flips after 'stopped')
      if (!connectionStopped && process.send) {
        process.send('whatsapp_disconnected');
      }
      
      const statusCode = lastDisconnect.error?.output?.statusCode;

      if (statusCode !== DisconnectReason.loggedOut) {
        const reason = DisconnectReason[statusCode] || statusCode;
        logger.whatsapp('Connection closed', {
          reason,
          statusCode,
          willReconnect: !connectionStopped
        });

        // Check if connection is stopped before reconnecting
        if (connectionStopped) {
          logger.whatsapp('Reconnection skipped - service is stopped');
          connectionStarting = false;
          return null;
        }
        // Transient closes (440 connectionReplaced after a reconnect burst,
        // 515 restartRequired, 428/408 network drops) retry FOREVER with
        // exponential backoff: 1s -> 2s -> 4s ... capped at 60s. Only 401
        // (loggedOut) above gives up. The old 5-attempt cap silently left the
        // bot dead in exactly this 440 loop.
        connectionAttempts++;
        connectionStarting = true;
        const backoffMs = Math.min(1000 * Math.pow(2, connectionAttempts - 1), 60000);
        if (config.SIMPLE_LOGS) {
          console.log(`Reconnecting in ${Math.round(backoffMs / 1000)}s... (attempt ${connectionAttempts})`);
        } else {
          logger.whatsapp('Reconnecting with backoff', {
            attempt: connectionAttempts,
            backoffMs,
            reason
          });
        }
        await delay(backoffMs);
        if (connectionStopped) {
          logger.whatsapp('Reconnection skipped - service stopped during backoff');
          connectionStarting = false;
          return null;
        }
        // HARDENED: if Aurora() throws here (auth load, version fetch,
        // socket create), the old code let the exception bubble to the catch
        // below, which just logged it - the reconnect chain died permanently
        // and the bot stayed dead until a manual restart. Now: log + reset
        // the flag so the supervisor kicks a fresh connect() within 30s.
        // The bot can no longer end up permanently unrecoverable.
        try {
          return await Aurora();
        } catch (reconnectError) {
          connectionStarting = false;
          logger.error('Reconnect attempt failed - supervisor will retry', {
            error: reconnectError.message,
            attempt: connectionAttempts
          });
          return null;
        }
      } else {
        if (config.SIMPLE_LOGS) {
          console.log("Connection closed. Device logged out.");
        } else {
          logger.whatsapp('Connection closed - Device logged out');
        }
        await delay(1000);
        return process.send('shutdown');
      }
    }
  } catch (error) {
    connectionStarting = false;
    logger.error('Connection update error', { error: error.message, stack: error.stack });
  }
};

// Performance: Cache frequently accessed data
let pausedChatsCache = null;
let pausedCacheExpiry = 0;

// Performance: groupMetadata() is an UNBAILED WebSocket round-trip per call.
// The old code called it for EVERY incoming group message just to print the
// group name - a major source of startup lag (issue #1). Cache it for 60s.
const groupSubjectCache = new Map(); // jid -> { subject, ts }
const GROUP_META_TTL = 60 * 1000;
async function getGroupSubject(conn, jid) {
  const hit = groupSubjectCache.get(jid);
  if (hit && Date.now() - hit.ts < GROUP_META_TTL) return hit.subject;
  const meta = await conn.groupMetadata(jid);
  const subject = (meta && meta.subject) || jid;
  groupSubjectCache.set(jid, { subject, ts: Date.now() });
  if (groupSubjectCache.size > 200) {
    const oldest = groupSubjectCache.keys().next().value;
    groupSubjectCache.delete(oldest);
  }
  return subject;
}

const handleMessages = (conn, ws) => async (m) => {
  if (m.type !== "notify" || m.requestId) {
    stats.suppressedHistory++;
    logger.trace("Non-live message batch ignored", {
      type: m.type,
      requestId: !!m.requestId,
      count: m.messages?.length || 0
    });
    return;
  }

  for (const raw of m.messages || []) {
    await handleSingleMessage(conn, ws, raw, m);
  }
};

const handleSingleMessage = async (conn, ws, raw, event) => {
  try {
    if (!raw || !raw.key || !raw.key.id) return;
    const msgId = raw.key.id;

    // ---- Never persist / mark messages whose decryption FAILED ----
    // (stub CIPHERTEXT = 2, or explicit stub parameters / missing content).
    // WhatsApp resends these after a retry request WITH THE SAME ID once keys
    // are fetched - that decrypted copy must still be processed normally,
    // otherwise dedup would swallow it forever.
    const decryptFailed =
      raw.messageStubType === 2 ||
      !raw.message ||
      (Array.isArray(raw.messageStubParameters) && raw.messageStubParameters.length > 0);
    if (decryptFailed) {
      stats.decryptFailed++;
      // Liveness layer 2: a sustained storm of undecryptable messages means
      // the signal sessions are permanently stale - the bot would look
      // "connected" but be 100% deaf, and only a rescan used to fix that.
      // trackDecryptFailure heals automatically after SESSION_HEAL_THRESHOLD
      // failures inside a 5-minute window (with a 10-minute cooldown).
      trackDecryptFailure(conn);
      logger.trace("Undecryptable message left unpersisted (awaiting retry)", { id: msgId });
      return;
    }

    // ---- Issue #1: age cutoff - stale messages are dropped, not replayed ----
    const staleGrace = config.STALE_MESSAGE_GRACE || 60000;
    if (raw.messageTimestamp) {
      const ageMs = Date.now() - raw.messageTimestamp * 1000;
      if (ageMs > staleGrace) {
        stats.suppressedStale++;
        messageGuard.stats.stale++;
        logger.trace("Stale message dropped", { id: msgId, ageMs });
        return;
      }
    }

    // ---- Issue #2: replay protection: memory LRU -> persistent command log -> DB ----
    if (messageGuard.seen(msgId)) {
      stats.suppressedDup++;
      messageGuard.stats.dupMemory++;
      return;
    }
    if (messageGuard.isKnownCommand(msgId)) {
      stats.suppressedDup++;
      messageGuard.stats.dupCommand++;
      messageGuard.mark(msgId);
      logger.trace("Replayed command skipped (already executed)", { id: msgId });
      return;
    }
    let existing = null;
    // DB reads in the hot path get a hard timeout: a hung SQLite query must
    // never freeze message processing (the "connected but deaf" wedge).
    try { existing = await withTimeout(loadMessage(msgId), 5000, "loadMessage"); } catch { existing = null; }
    if (existing) {
      stats.suppressedDup++;
      messageGuard.stats.dupDb++;
      messageGuard.mark(msgId);
      logger.trace("Replayed message skipped (already in store)", { id: msgId });
      return;
    }
    messageGuard.mark(msgId);

    stats.processed++;

    const msg = await serialize(JSON.parse(JSON.stringify(raw)), conn);
    if (!msg || !msg.key) return;
    const text_msg = msg.body || "";
    const logText = text_msg || `[${msg.type || "message"}]`;

    // Log before pause checks and storage so incoming messages remain visible
    // even when a later processing step rejects them.
    if (config.LOGS) {
      try {
        let name = await getName(msg.sender);
        if (!name || name === msg.sender) {
          name = msg.pushName || msg.sender.split("@")[0];
        }

        if (config.SIMPLE_LOGS) {
          const groupName = msg.from.endsWith("@g.us")
            ? await getGroupSubject(conn, msg.from)
            : name;
          console.log(`At : ${groupName}\nFrom : ${name}\nMessage: ${logText}`);
        } else {
          const from = msg.from.endsWith("@g.us")
            ? `[ ${await getGroupSubject(conn, msg.from)} ] : ${name}`
            : name;
          logger.info(`${from} » ${logText}`);
        }
      } catch (error) {
        logger.warn("Incoming message logging failed", { error: error.message });
      }
    }

    // ---- Persist IMMEDIATELY (awaited). The old 100ms batch could lose the
    // message when a restart command killed the process, letting the same
    // command replay after boot - the restart loop from issue #2. ----
    // Persistence also gets a timeout: if the DB is wedged the message still
    // gets processed and answered - losing one store row is better than a
    // frozen bot (the DB queue has its own 10s per-op timeout too).
    const messageOperations = [
      withTimeout(saveMessage(raw, msg.sender, { immediate: true }), 8000, "saveMessage")
    ];

    if (config.AUTO_READ) {
      messageOperations.push(conn.readMessages([msg.key]));
    }

    if (config.AUTO_STATUS_READ && msg.from === "status@broadcast") {
      messageOperations.push(conn.readMessages([msg.key]));
    }

    const operationResults = await Promise.allSettled(messageOperations);
    for (const result of operationResults) {
      if (result.status === "rejected") {
        logger.warn("Optional message operation failed", { error: result.reason?.message || String(result.reason) });
      }
    }

    // Performance: Cached pause check with expiry
    const now = Date.now();
    if (!pausedChatsCache || now > pausedCacheExpiry) {
      pausedChatsCache = await withTimeout(PausedChats.getPausedChats(), 5000, "getPausedChats");
      pausedCacheExpiry = now + 10000; // Cache for 10 seconds
      logger.trace('Updated paused chats cache', { 
        count: pausedChatsCache.length,
        chats: pausedChatsCache.length > 0 ? pausedChatsCache.map(chat => chat.jid || chat.chatId) : []
      });
    }

    const regex = plugins.buildCommandPattern("resume");
    const isResume = regex.test(text_msg);
    const chatId = msg.from;

    // Check for admin restart commands that should work even when stopped
    const restartRegex = plugins.buildCommandPattern("restart|reboot");
    const isRestart = restartRegex.test(text_msg);
    
    // Block all messages when connection is stopped, except specific admin commands
    if (connectionStopped) {
      if (isResume) {
        logger.info("Processing resume command while bot is stopped");
        // Allow resume to continue processing
      } else if (isRestart && msg.sudo) {
        logger.info("Processing admin restart command while bot is stopped");
        // Allow admin restart to continue processing
      } else {
        logger.trace("Message processing blocked - bot is stopped", { chatId });
        return;
      }
    }

    const pausedChat = pausedChatsCache.find((pausedChat) => {
      const pausedChatId = pausedChat.chatId || pausedChat.jid;
      const isPausedStatus = pausedChat.isPaused !== false; // Default to true if not explicitly false
      return pausedChatId === chatId && isPausedStatus && !isResume;
    });
    if (pausedChat) {
      stats.pausedBlocked++;
      logger.trace("Message blocked - chat is paused", { chatId });
      return;
    }

    // ---- Optional readable dump of the processed (serialized) message ----
    // Prints the full `msg` object (sender, chat, type, body, quoted summary,
    // mentions, media info, ...) via util.inspect so it stays indented and
    // colourised in the terminal. Functions/Buffers are collapsed safely, so it
    // never reintroduces the raw session dumps the console guard suppresses.
    // Off by default - enable with LOG_MESSAGE=true to debug plugin payloads.
    if (config.LOG_MESSAGE) {
      try {
        const util = require("util");
        const dump = util.inspect(msg, {
          depth: 5,
          colors: process.env.NODE_ENV !== "production",
          breakLength: 100,
          maxArrayLength: 20,
        });
        const title = " PROCESSED MESSAGE ";
        const side = 21;
        console.log(
          `\n╔${"═".repeat(side)}${title}${"═".repeat(side)}\n` +
          `${dump}\n` +
          `╚${"═".repeat(side * 2 + title.length)}╝\n`
        );
      } catch (error) {
        logger.warn("Failed to dump processed message", { error: error.message });
      }
    }

    // Performance: Process commands efficiently
    let whats;
    logger.info("Dispatching incoming message", {
      id: msg.id,
      body: text_msg,
      sender: msg.sender,
      sudo: !!msg.sudo,
      commandCount: plugins.commands.length
    });
    
    // Performance: Use for...of for better async handling
    for (const command of plugins.commands) {
      try {
        if (command.fromMe && !msg.sudo) {
          // Type-safe check: only a real RegExp can be .test()ed. A command
          // whose pattern got corrupted to a string/object at runtime used to
          // throw here on EVERY non-sudo message (log spam). Now we skip it
          // and log WHICH command is broken so it can be traced.
          const cmdPattern = command.pattern;
          if (text_msg && cmdPattern instanceof RegExp && cmdPattern.test(text_msg)) {
            logger.warn("Owner-only command ignored for non-sudo sender", {
              command: command.patternSource,
              sender: msg.sender
            });
          } else if (text_msg && cmdPattern && !(cmdPattern instanceof RegExp)) {
            logger.warn("Command has non-RegExp pattern - skipped", {
              command: command.patternSource || String(cmdPattern).slice(0, 40),
              patternType: typeof cmdPattern
            });
          }
          continue;
        }

        const handleCommand = async (Instance, args) => {
          whats = new Instance(conn, msg);
          await command.function(whats, ...args, msg, conn, event);
        };

        if (text_msg && command.pattern) {
          const iscommand = text_msg.match(command.pattern);
          if (iscommand) {
            const [, prefix, , match] = iscommand;
            msg.prefix = prefix;
            msg.command = [prefix, iscommand[2]].join("");
            logger.info("Command matched", { command: command.patternSource, sender: msg.sender });
            // ---- Issue #2: record + flush BEFORE executing. Restart/reboot
            // commands kill this process immediately - without this the id was
            // never persisted and the same command replayed after boot. ----
            messageGuard.markCommand(msg.id);
            await withTimeout(flushMessageQueue(), 8000, "flushMessageQueue");
            await handleCommand(Message, [match || false]);
            continue;
          }
        }

        // Performance: Optimized switch for message types
        switch (command.on) {
          case "text":
            if (text_msg) await handleCommand(Message, [text_msg]);
            break;
          case "image":
            if (msg.type === "imageMessage") await handleCommand(Image, [text_msg]);
            break;
          case "sticker":
            if (msg.type === "stickerMessage") await handleCommand(Sticker, []);
            break;
          case "video":
            if (msg.type === "videoMessage") await handleCommand(Video, []);
            break;
          case "delete":
            if (msg.type === "protocolMessage") {
              whats = new Message(conn, msg);
              whats.messageId = msg.message.protocolMessage.key?.id;
              await command.function(whats, msg, conn, event);
            }
            break;
          case "message":
            await handleCommand(AllMessage, []);
            break;
        }
      } catch (error) {
        if (config.SIMPLE_LOGS) {
          // X-Asena style simple error logging
          console.error("Command error:", error.message);
        } else {
          // WhatsBotAlfa-MD advanced error logging
          logger.warn('Command execution error', { 
            command: command.pattern || command.on,
            error: error.message 
          });
        }
      }
    }
  } catch (error) {
    if (config.SIMPLE_LOGS) {
      // X-Asena style simple error logging
      console.error("Message handling error:", error.message);
    } else {
      // WhatsBotAlfa-MD advanced error logging
      logger.warn('Message handling error', { error: error.message });
    }
  }
};

try {
  const result = await Aurora();
  // Clear monitor if Aurora completes normally
  if (typeof connectionMonitor !== 'undefined') {
    clearInterval(connectionMonitor);
  }
  return result;
} catch (error) {
  connectionStarting = false;
  logger.error('Aurora function error', { 
    error: error.message,
    stack: error.stack 
  });
  // Clear monitor on error
  if (typeof connectionMonitor !== 'undefined') {
    clearInterval(connectionMonitor);
  }
  throw error;
}
};

// ---- Graceful shutdown (SIGINT from terminal, SIGTERM from server.js) ----
const gracefulShutdown = async (signal) => {
  logger.system(`${signal} received - Graceful shutdown initiated`);

  // Mark as intentionally stopped so the close event doesn't report a
  // misleading 'whatsapp_disconnected' before the process exits
  connectionStopped = true;

  // Flush any pending batched message writes so nothing replays on next boot
  if (typeof flushMessageQueue === "function") {
    try { await flushMessageQueue(); } catch { /* ignore */ }
  }

  // Close current connection gracefully
  if (currentConnection) {
    try {
      logger.whatsapp('Closing WhatsApp connection on exit');
      currentConnection.end();
      currentConnection = null;
    } catch (error) {
      logger.warn('Error closing connection on exit', { error: error.message });
    }
  }

  process.exit(0);
};

process.on("SIGINT", () => gracefulShutdown("SIGINT"));
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));

// ---- Lifecycle API (owned by index.js - see note at top of file) ----

/**
 * Stop the WhatsApp connection and message processing.
 * Unlike the old implementation this ACTUALLY closes the socket and
 * reports 'whatsapp_stopped' without racing a 'whatsapp_disconnected'.
 */
connect.stop = async () => {
  connectionStopped = true;
  // Stop the liveness watchdog - a stopped bot must not keep probing (or
  // worse, force-reconnect) the socket we just closed on purpose.
  stopPingWatchdog();
  logger.whatsapp('Connection and message processing stopped by server request');

  if (currentConnection) {
    try {
      logger.whatsapp('Closing active WhatsApp connection');
      const conn = currentConnection;
      currentConnection = null;
      conn.end();
      logger.whatsapp('WhatsApp connection closed successfully');
    } catch (error) {
      logger.warn('Error closing connection', { error: error.message });
    }
  }

  if (process.send) process.send('whatsapp_stopped');
};

/** Resume a stopped connection (reconnecting if the socket was closed). */
connect.resume = async () => {
  const wasStopped = connectionStopped;
  connectionStopped = false;

  if (wasStopped) {
    logger.whatsapp('Connection and message processing started by server request');
    if (process.send) process.send('whatsapp_started');
  }

  if (!currentConnection) {
    // Socket was ended by stop() - open a fresh one (connect() is guarded
    // against double-connections, so this can never create two sockets)
    return connect();
  }

  return currentConnection;
};

/** Runtime counters for the dashboard. */
connect.getStats = () => ({
  ...stats,
  uptime: Date.now() - stats.startTime,
  connectionActive: !!currentConnection,
  connectionStopped,
  connectionAttempts,
  messageGuard: messageGuard.getStats(),
  signal: consoleGuard.getStats(),
  // Liveness engine visibility for the dashboard
  liveness: {
    lastInboundAgoMs: stats.lastInboundAt ? Date.now() - stats.lastInboundAt : null,
    lastPongAgoMs: stats.lastPongAt ? Date.now() - stats.lastPongAt : null,
    zombieKills: stats.zombieKills,
    sessionHeals: stats.sessionHeals,
    watchdogKicks: stats.watchdogKicks
  },
  db: (typeof getQueueStats === "function") ? getQueueStats() : null
});

module.exports = connect;



