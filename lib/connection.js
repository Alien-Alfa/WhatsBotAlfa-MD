// Made with ❤ by AlienAlfa
// Performance optimized imports
const path = require("path");
const fs = require("fs");
const logger = require("./logger");
const messageGuard = require("./messageGuard");
const consoleGuard = require("./consoleGuard");

// Lazy load heavy dependencies
let plugins, makeWASocket, useMultiFileAuthState, fetchLatestBaileysVersion;
let Browsers, delay, makeCacheableSignalKeyStore, DisconnectReason;
let PausedChats, config, serialize, Greetings;
let Image, Message, Sticker, Video, AllMessage;
let io, getcall, loadMessage, saveMessage, saveChat, getName, flushMessageQueue;
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
  pausedBlocked: 0     // messages blocked by paused chats
};

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
    } = baileys);
    
    config = require("../config");
    
    // Always use local database operations as primary
    ({ PausedChats } = require("../assets/database"));
    ({ loadMessage, saveMessage, saveChat, getName, flushMessageQueue } = require("../assets/database/StoreDb"));
    
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

  // SINGLE-SOCKET GUARD: never open a second socket while one is alive.
  // Two live sockets sharing one signal session is a classic cause of
  // multiplying "Bad MAC" errors (issue #4).
  if (currentConnection) {
    logger.whatsapp('connect() called while a connection is already active - reusing it');
    return currentConnection;
  }

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
      const isAllowed = callListCache.some(item => 
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
          return null;
        }
        // Transient closes (440 connectionReplaced after a reconnect burst,
        // 515 restartRequired, 428/408 network drops) retry FOREVER with
        // exponential backoff: 1s -> 2s -> 4s ... capped at 60s. Only 401
        // (loggedOut) above gives up. The old 5-attempt cap silently left the
        // bot dead in exactly this 440 loop.
        connectionAttempts++;
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
          return null;
        }
        return Aurora();
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
  try {
    // ---- Issues #1/#2: only real-time messages, never history batches ----
    // Offline/history sync arrives with type 'append' - those must never
    // trigger commands (promote/demote/restart loops on bot start).
    if (m.type !== "notify") {
      stats.suppressedHistory++;
      return;
    }

    const raw = m.messages && m.messages[0];
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
      logger.trace("Undecryptable message left unpersisted (awaiting retry)", { id: msgId });
      return;
    }

    // ---- Issue #1: age cutoff - stale messages are dropped, not replayed ----
    const staleGrace = parseInt(process.env.STALE_MESSAGE_GRACE, 10) || 60000;
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
    try { existing = await loadMessage(msgId); } catch { existing = null; }
    if (existing) {
      stats.suppressedDup++;
      messageGuard.stats.dupDb++;
      messageGuard.mark(msgId);
      logger.trace("Replayed message skipped (already in store)", { id: msgId });
      return;
    }
    messageGuard.mark(msgId);

    stats.processed++;

    // Performance: Parallel processing of message serialization and saving
    const msg = await serialize(JSON.parse(JSON.stringify(raw)), conn);

    // ---- Persist IMMEDIATELY (awaited). The old 100ms batch could lose the
    // message when a restart command killed the process, letting the same
    // command replay after boot - the restart loop from issue #2. ----
    const messageOperations = [saveMessage(raw, msg.sender, { immediate: true })];

    if (config.AUTO_READ) {
      messageOperations.push(conn.readMessages(msg.key));
    }

    if (config.AUTO_STATUS_READ && msg.from === "status@broadcast") {
      messageOperations.push(conn.readMessages(msg.key));
    }

    await Promise.all(messageOperations);

    const text_msg = msg.body;
    if (!msg || !text_msg) return;

    // Performance: Cached pause check with expiry
    const now = Date.now();
    if (!pausedChatsCache || now > pausedCacheExpiry) {
      pausedChatsCache = await PausedChats.getPausedChats();
      pausedCacheExpiry = now + 10000; // Cache for 10 seconds
      logger.trace('Updated paused chats cache', { 
        count: pausedChatsCache.length,
        chats: pausedChatsCache.length > 0 ? pausedChatsCache.map(chat => chat.jid || chat.chatId) : []
      });
    }

    const regex = new RegExp(`${config.HANDLERS}( ?resume)`, "is");
    const isResume = regex.test(text_msg);
    const chatId = msg.from;

    // Check for admin restart commands that should work even when stopped
    const restartRegex = new RegExp(`${config.HANDLERS}( ?restart| ?reboot)`, "is");
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

    // Performance: X-Asena style message logging with advanced option
    if (config.LOGS) {
      try {
        // Get saved contact name, fallback to sender number if no name saved
        let name = await getName(msg.sender);
        if (!name || name === msg.sender) {
          // If no saved name, try to get push name from message or use number
          name = msg.pushName || msg.sender.split("@")[0];
        }
        
        if (config.SIMPLE_LOGS) {
          // X-Asena simple style logging
          const groupName = msg.from.endsWith("@g.us")
            ? await getGroupSubject(conn, msg.from)
            : name; // Use contact name for DM instead of JID
          console.log(`At : ${groupName}\nFrom : ${name}\nMessage: ${text_msg}`);
        } else {
          // WhatsBotAlfa-MD advanced style logging  
          const from = msg.from.endsWith("@g.us") 
            ? `[ ${await getGroupSubject(conn, msg.from)} ] : ${name}` 
            : name;
          logger.info(`${from} » ${text_msg}`);
        }
      } catch (error) {
        if (config.SIMPLE_LOGS) {
          console.error("Logging error:", error);
        } else {
          logger.warn("Logging error:", error);
        }
      }
    }

    // Performance: Process commands efficiently
    let whats;
    
    // Performance: Use for...of for better async handling
    for (const command of plugins.commands) {
      try {
        if (command.fromMe && !msg.sudo) continue;

        const handleCommand = (Instance, args) => {
          whats = new Instance(conn, msg);
          command.function(whats, ...args, msg, conn, m);
        };

        if (text_msg && command.pattern) {
          const iscommand = text_msg.match(command.pattern);
          if (iscommand) {
            const [, prefix, , match] = iscommand;
            msg.prefix = prefix;
            msg.command = [prefix, iscommand[2]].join("");
            // ---- Issue #2: record + flush BEFORE executing. Restart/reboot
            // commands kill this process immediately - without this the id was
            // never persisted and the same command replayed after boot. ----
            messageGuard.markCommand(msg.id);
            await flushMessageQueue();
            handleCommand(Message, [match || false]);
            continue;
          }
        }

        // Performance: Optimized switch for message types
        switch (command.on) {
          case "text":
            if (text_msg) handleCommand(Message, [text_msg]);
            break;
          case "image":
            if (msg.type === "imageMessage") handleCommand(Image, [text_msg]);
            break;
          case "sticker":
            if (msg.type === "stickerMessage") handleCommand(Sticker, []);
            break;
          case "video":
            if (msg.type === "videoMessage") handleCommand(Video, []);
            break;
          case "delete":
            if (msg.type === "protocolMessage") {
              whats = new Message(conn, msg);
              whats.messageId = msg.message.protocolMessage.key?.id;
              command.function(whats, msg, conn, m);
            }
            break;
          case "message":
            handleCommand(AllMessage, []);
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
  signal: consoleGuard.getStats()
});

module.exports = connect;



