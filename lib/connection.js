// Made with ❤ by AlienAlfa
// Performance optimized imports
const pino = require("pino");
const path = require("path");
const fs = require("fs");
const logger = require("./logger");

// Lazy load heavy dependencies
let plugins, makeWASocket, useMultiFileAuthState, fetchLatestBaileysVersion;
let Browsers, delay, makeCacheableSignalKeyStore, DisconnectReason;
let PausedChats, config, serialize, Greetings;
let Image, Message, Sticker, Video, AllMessage;
let io, getcall, loadMessage, saveMessage, saveChat, getName;
let QRCode, qrTerminal;

// Initialize logger once
const pinoLogger = pino({ level: "silent" });

// Global flag to track if connection should be stopped
let connectionStopped = false;
let currentConnection = null; // Store current connection instance
let connectionAttempts = 0;
let maxConnectionAttempts = 5;

// Listen for messages from parent process
process.on('message', (message) => {
  if (message === 'stop_whatsapp') {
    connectionStopped = true;
    logger.whatsapp('Connection and message processing stopped by server request');
    
    // Close current connection if it exists
    if (currentConnection) {
      try {
        logger.whatsapp('Closing active WhatsApp connection');
        currentConnection.end();
        currentConnection = null;
        logger.whatsapp('WhatsApp connection closed successfully');
      } catch (error) {
        logger.warn('Error closing connection', { error: error.message });
      }
    }
    
    // Notify parent process about status change
    if (process.send) {
      process.send('whatsapp_stopped');
    }
  } else if (message === 'start_whatsapp') {
    connectionStopped = false;
    logger.whatsapp('Connection and message processing started by server request');
    // Notify parent process about status change
    if (process.send) {
      process.send('whatsapp_started');
    }
  }
});

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
    ({ loadMessage, saveMessage, saveChat, getName } = require("../assets/database/StoreDb"));
    
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

  // Reset connection attempts on successful dependency loading
  connectionAttempts = 0;

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
  
  connectionAttempts++;
  logger.whatsapp('Starting connection attempt', { attempt: connectionAttempts });
  
  const sessionDir = "./session";
  
  // Performance: Use synchronous check only if needed
  try {
    await fs.promises.access(sessionDir);
  } catch {
    await fs.promises.mkdir(sessionDir, { recursive: true });
    logger.debug('Session directory created');
  }

  // Parallel execution for better performance
  logger.debug('Loading authentication state and fetching latest version');
  const [{ state, saveCreds }, { version }] = await Promise.all([
    useMultiFileAuthState(path.join(__basedir, sessionDir)),
    fetchLatestBaileysVersion()
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

  process.on("uncaughtException", async (err) => {
    //await conn.sendMessage(conn.user.id, { text: err.message });
    logger.info(err);
  });
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

  // Performance: Centralized error handling
  const handleError = (source, error) => {
    logger.warn(`[${source}] Error:`, error.message);
  };

  process.on("uncaughtException", (err) => handleError("UncaughtException", err));
  process.on("unhandledRejection", (err) => handleError("UnhandledRejection", err));
  
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
      
      // Notify parent process about disconnection
      if (process.send) {
        process.send('whatsapp_disconnected');
      }
      
      const statusCode = lastDisconnect.error?.output?.statusCode;
      
      if (statusCode !== DisconnectReason.loggedOut) {
        await delay(300);
        const reason = DisconnectReason[statusCode] || statusCode;
        logger.whatsapp('Connection closed', { 
          reason, 
          statusCode,
          willReconnect: !connectionStopped 
        });
        
        // Check if connection is stopped before reconnecting
        if (!connectionStopped && connectionAttempts < maxConnectionAttempts) {
          if (config.SIMPLE_LOGS) {
            console.log("Reconnecting...");
          } else {
            logger.whatsapp('Attempting to reconnect', { attempt: connectionAttempts + 1 });
          }
          return Aurora();
        } else if (connectionAttempts >= maxConnectionAttempts) {
          logger.error('Maximum connection attempts reached', { attempts: connectionAttempts });
          return null;
        } else {
          logger.whatsapp('Reconnection skipped - service is stopped');
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
    logger.error('Connection update error', { error: error.message, stack: error.stack });
  }
};

// Performance: Cache frequently accessed data
let pausedChatsCache = null;
let pausedCacheExpiry = 0;

const handleMessages = (conn, ws) => async (m) => {
  try {
    if (m.type !== "notify") return;
    
    // Performance: Parallel processing of message serialization and saving
    const msg = await serialize(JSON.parse(JSON.stringify(m.messages[0])), conn);
    
    // Performance: Parallel message operations
    const messageOperations = [
      saveMessage(m.messages[0], msg.sender)
    ];
    
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

    // Debug: Log pause check details
    logger.info(`🔍 Pause check for chat: ${chatId}`);
    logger.info(`🔍 Cached paused chats: ${JSON.stringify(pausedChatsCache.map(chat => ({ 
      jid: chat.jid, 
      chatId: chat.chatId,
      mongoId: chat._id,
      isPaused: chat.isPaused 
    })))}`);
    logger.info(`🔍 Is resume command: ${isResume}`);

    // Check for admin restart commands that should work even when stopped
    const restartRegex = new RegExp(`${config.HANDLERS}( ?restart| ?reboot)`, "is");
    const isRestart = restartRegex.test(text_msg);
    
    // Block all messages when connection is stopped, except specific admin commands
    if (connectionStopped) {
      if (isResume) {
        logger.info("� Processing resume command while bot is stopped");
        // Allow resume to continue processing
      } else if (isRestart && msg.sudo) {
        logger.info("🔄 Processing admin restart command while bot is stopped");
        // Allow admin restart to continue processing
      } else {
        logger.info("🛑 Message processing blocked - bot is stopped");
        return;
      }
    }

    if (pausedChatsCache.some((pausedChat) => {
      const pausedChatId = pausedChat.chatId || pausedChat.jid;
      const isPausedStatus = pausedChat.isPaused !== false; // Default to true if not explicitly false
      const isMatch = pausedChatId === chatId;
      
      logger.info(`🔍 Checking pause: ${pausedChatId} === ${chatId} = ${isMatch}, isPaused: ${isPausedStatus}`);
      
      return isMatch && isPausedStatus && !isResume;
    })) {
      logger.info("⏸️ Message blocked - chat is paused:", chatId);
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
            ? (await conn.groupMetadata(msg.from)).subject
            : name; // Use contact name for DM instead of JID
          console.log(`At : ${groupName}\nFrom : ${name}\nMessage: ${text_msg}`);
        } else {
          // WhatsBotAlfa-MD advanced style logging  
          const from = msg.from.endsWith("@g.us") 
            ? `[ ${(await conn.groupMetadata(msg.from)).subject} ] : ${name}` 
            : name;
          logger.info(`-------------\n${from} : ${text_msg}`);
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

process.on("SIGINT", async () => {
  logger.system('SIGINT received - Graceful shutdown initiated');
  
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
});

module.exports = connect;



