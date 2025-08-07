// Made with ❤ by AlienAlfa
// Performance optimized imports
const pino = require("pino");
const path = require("path");
const fs = require("fs");

// Lazy load heavy dependencies
let plugins, makeWASocket, useMultiFileAuthState, fetchLatestBaileysVersion;
let Browsers, delay, makeCacheableSignalKeyStore, DisconnectReason;
let PausedChats, config, serialize, Greetings;
let Image, Message, Sticker, Video, AllMessage;
let io, getcall, loadMessage, saveMessage, saveChat, getName;
let QRCode;

// Initialize logger once
const logger = pino({ level: "silent" });

// Global flag to track if connection should be stopped
let connectionStopped = false;

// Listen for messages from parent process
process.on('message', (message) => {
  if (message === 'stop_whatsapp') {
    connectionStopped = true;
    console.log("🛑 WhatsApp connection marked for stop");
  } else if (message === 'start_whatsapp') {
    connectionStopped = false;
    console.log("🚀 WhatsApp connection marked for start");
  }
});

// Lazy loading function for performance
const initializeDependencies = async () => {
  if (!plugins) {
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
    
    // Use universal database operations
    if (config.USE_MONGODB && config.MONGODB_URI) {
      const mongoStoreDb = require("../assets/database/MongoStoreDb");
      const universalPausedChat = require("../assets/database/UniversalPausedChat");
      ({ PausedChats } = universalPausedChat);
      ({ loadMessage, saveMessage, saveChat, getName } = mongoStoreDb);
    } else {
      ({ PausedChats } = require("../assets/database"));
      ({ loadMessage, saveMessage, saveChat, getName } = require("../assets/database/StoreDb"));
    }
    
    ({ serialize, Greetings } = require("./index"));
    ({ Image, Message, Sticker, Video, AllMessage } = require("./Messages"));
    io = require("socket.io-client");
    ({ getcall } = require("../assets/database/callAction"));
    QRCode = require("qrcode");
  }
};

const connect = async () => {
  // Initialize dependencies only when needed
  await initializeDependencies();

const Aurora = async () => {
  // Check if connection is stopped before proceeding
  if (connectionStopped) {
    console.log("⏸️ WhatsApp connection is stopped");
    return null;
  }
  
  const sessionDir = "./session";
  
  // Performance: Use synchronous check only if needed
  try {
    await fs.promises.access(sessionDir);
  } catch {
    await fs.promises.mkdir(sessionDir, { recursive: true });
  }

  // Parallel execution for better performance
  const [{ state, saveCreds }, { version }] = await Promise.all([
    useMultiFileAuthState(path.join(__basedir, sessionDir)),
    fetchLatestBaileysVersion()
  ]);

  const conn = makeWASocket({
    auth: {
      creds: state.creds,
      keys: makeCacheableSignalKeyStore(state.keys, logger),
    },
    logger,
    browser: Browsers.macOS("Desktop"),
    downloadHistory: false,
    syncFullHistory: false,
    markOnlineOnConnect: true,
    emitOwnEvents: true,
    version,
    // Performance: Cache messages to reduce database calls
    getMessage: async (key) => {
      try {
        const message = await loadMessage(key.id);
        return message?.message || { conversation: null };
      } catch (error) {
        console.warn(`Failed to load message ${key.id}:`, error);
        return { conversation: null };
      }
    },
  });

  // Performance: Initialize socket connection with error handling
  let ws;
  try {
    ws = io("https://socket.xasena.me/", { 
      reconnection: true,
      timeout: 5000,
      forceNew: true
    });
    ws.on("connect", () => console.log("Connected to server"));
    ws.on("disconnect", () => console.log("Disconnected from server"));
    ws.on("error", (err) => console.warn("Socket error:", err));
  } catch (error) {
    console.warn("Failed to initialize socket:", error);
  }


  // Performance: Optimize event listeners
  conn.ev.on("connection.update", handleConnectionUpdate(conn, ws));
  conn.ev.on("creds.update", saveCreds);
  conn.ev.on("group-participants.update", async (data) => {
    try {
      await Greetings(data, conn);
    } catch (error) {
      console.warn("Greetings error:", error);
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
        console.warn("Batch chat update error:", error);
      }
    }, 100); // Batch updates every 100ms
  });
  
  conn.ev.on("messages.upsert", handleMessages(conn, ws));

  process.on("uncaughtException", async (err) => {
    //await conn.sendMessage(conn.user.id, { text: err.message });
    console.log(err);
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
      
      console.log(`[Call from: ${frmid}]`);
      
      if (status === "offer" && !isAllowed) {
        await Promise.all([
          conn.rejectCall(id, from),
          conn.sendMessage(from, {
            text: "Sorry no calls. Please use Text or Voice Message\n> Automated System"
          })
        ]);
      }
    } catch (error) {
      console.warn("Call handling error:", error);
    }
  });

  // Performance: Centralized error handling
  const handleError = (source, error) => {
    console.warn(`[${source}] Error:`, error.message);
  };

  process.on("uncaughtException", (err) => handleError("UncaughtException", err));
  process.on("unhandledRejection", (err) => handleError("UnhandledRejection", err));
  
  return conn;
};

const handleConnectionUpdate = (conn, ws) => async (s) => {
  const { connection, lastDisconnect, qr } = s;
  
  try {
    if (qr) {
      const qrString = await QRCode.toString(qr, { type: 'terminal' });
      console.log(qrString);
    } else if (connection === "open") {
      console.log("✅ Login Successful!");
      
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
      
      const str = `\`\`\`----- 𝞓𝙇𝞘𝞢𝞜-𝞓𝙇𝙁𝞓-𝞛𝘿 -----\n\nVersion: ${packageVersion}\nNumber: ${num}\nTotal Plugins: ${totalPlugins}\nWorktype: ${workType}\n\n----- 𝞓𝙇𝞘𝞢𝞜-𝞓𝙇𝙁𝞓-𝞛𝘿 -----\`\`\``;
      return conn.sendMessage(conn.user.id, { text: str });
    } else if (connection === "close") {
      // Notify parent process about disconnection
      if (process.send) {
        process.send('whatsapp_disconnected');
      }
      
      const statusCode = lastDisconnect.error?.output?.statusCode;
      
      if (statusCode !== DisconnectReason.loggedOut) {
        await delay(300);
        const reason = DisconnectReason[statusCode] || statusCode;
        console.log("Disconnection Reason:", reason);
        
        // Check if connection is stopped before reconnecting
        if (!connectionStopped) {
          console.log("Reconnecting...");
          return Aurora();
        } else {
          console.log("🛑 Reconnection skipped - connection is stopped");
          return null;
        }
      } else {
        console.log("Connection closed. Device logged out.");
        await delay(1000);
        return process.send('shutdown');
      }
    }
  } catch (error) {
    console.warn("Connection update error:", error);
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
    await Promise.all([
      saveMessage(m.messages[0], msg.sender),
      config.AUTO_READ ? conn.readMessages(msg.key) : Promise.resolve(),
      (config.AUTO_STATUS_READ && msg.from === "status@broadcast") ? 
        conn.readMessages(msg.key) : Promise.resolve()
    ]);

    const text_msg = msg.body;
    if (!msg || !text_msg) return;

    // Performance: Cached pause check with expiry
    const now = Date.now();
    if (!pausedChatsCache || now > pausedCacheExpiry) {
      pausedChatsCache = await PausedChats.getPausedChats();
      pausedCacheExpiry = now + 10000; // Cache for 10 seconds
    }

    const regex = new RegExp(`${config.HANDLERS}( ?resume)`, "is");
    const isResume = regex.test(text_msg);
    const chatId = msg.from;

    if (pausedChatsCache.some((pausedChat) => pausedChat.chatId === chatId && !isResume)) {
      return;
    }

    // Performance: Optimized logging
    if (config.LOGS) {
      try {
        const namo = typeof msg.pushName === 'string' 
          ? msg.pushName.replaceAll("\n", " ") 
          : "";
        
        const from = msg.from.endsWith("@g.us") 
          ? `[ ${(await conn.groupMetadata(msg.from)).subject} ] : ${namo}` 
          : namo;
        
        console.log(`-------------\n${from} : ${text_msg}`);
      } catch (error) {
        console.warn("Logging error:", error);
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
        console.warn(`Command error [${command.pattern || command.on}]:`, error);
      }
    }
  } catch (error) {
    console.warn("Message handling error:", error);
  }
};

try {
  return Aurora();
} catch (error) {
  console.error("Aurora function error:", error);
  throw error;
}
};

process.on("SIGINT", async () => {
  console.log("Received SIGINT. Exiting...");
  process.exit(0);
});

module.exports = connect;



