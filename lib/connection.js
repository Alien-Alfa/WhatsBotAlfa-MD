const fs = require("fs").promises;
const pino = require("pino");
const path = require("path");
const axios = require("axios");
const {
  default: makeWASocket,
  useMultiFileAuthState,
  Browsers,
  delay,
  DisconnectReason,
  makeInMemoryStore,
  makeCacheableSignalKeyStore,
  fetchLatestBaileysVersion,
} = require("@whiskeysockets/baileys");
const { PausedChats } = require("../assets/database");
const config = require("../config");
const plugins = require("./plugins");
const { serialize, Greetings } = require("./index");
const { Image, Message, Sticker, Video,AllMessage } = require("./Messages");
const io = require("socket.io-client");
const {
  getcall
} = require("../assets/database/callAction");
const {
  loadMessage,
  saveMessage,
  saveChat,
} = require("../assets/database/StoreDb");
const { parsedJid } = require("./functions");
async function deleteSession(){
  fs.readdir('session/', (err, files) => {
      if (err) {
        console.error('Error reading directory:', err);
        return;
      }
    
      files.forEach(file => {
        if (file !== 'Aurora.txt') {
          fs.unlink(path.join('session/', file), err => {
            if (err) {
              console.error('Error deleting file:', err);
              return;
            }
            console.log(`${file} has been deleted.`);
          });
        }
        console.log(`Restarting...`);
        return process.send("reset")
      });
    });
  }
// Set up logging
const logger = pino({ level: "silent" });

const connect = async () => {
  const Aurora = async () => {
    try {
      const { state, saveCreds } = await useMultiFileAuthState(
        path.join(__basedir, "session")
      );
      let {
        version
    } = await fetchLatestBaileysVersion()
//===================================================================
let conn = makeWASocket({
  logger: pino({
      level: 'silent'
  }),
  printQRInTerminal: true,
  browser: Browsers.macOS("Desktop"),
  version,
  downloadHistory: false,
  syncFullHistory: false,
  auth: {
      creds: state.creds,
      keys: makeCacheableSignalKeyStore(state.keys, logger),
      generateHighQualityLinkPreview: true,
      shouldIgnoreJid: (jid) => isJidBroadcast(jid),
  },
  getMessage: async (key) => {
      let jid = jidNormalizedUser(key.remoteJid)
      let msg = await store.loadMessage(jid, key.id)
      return msg.message || ""
  }
})
//===================================================================

      conn.ev.on("connection.update", async (s) => {
        if(s.qr){return await deleteSession() }
        const { connection, lastDisconnect } = s;
        if (connection === "connecting") {
          console.log("ℹ Connectinon: "+ connection);
        }
        if (connection === "open") {

          const ws = io("https://socket.xasena.me/");
          ws.on("connect", () => {
            console.log("Connected to server");
            ws.emit("add", conn.user.jid);
          });

          console.log("✅ Login Successful!");
          const totalPlugins = plugins.commands.length;
          const workType = config.WORK_TYPE;
          const packageVersion = require("../package.json").version;
          const num = conn.user.id.split(":")[0]
          const str = `\`\`\`----- 𝞓𝙇𝞘𝞢𝞜-𝞓𝙇𝙁𝞓-𝞛𝘿 -----\n\nVersion: ${packageVersion}\nNumber: ${num}\nTotal Plugins: ${totalPlugins}\nWorktype: ${workType}\n\n----- 𝞓𝙇𝞘𝞢𝞜-𝞓𝙇𝙁𝞓-𝞛𝘿 -----\`\`\``;
          return conn.sendMessage(conn.user.id, { text: str });
        }

        if (connection === "close") {
          if (
            lastDisconnect.error?.output?.statusCode !== DisconnectReason.loggedOut
            
          ) {
            const statusCode = await lastDisconnect.error?.output?.statusCode
            await delay(300);
            console.log("Disconnection Reason: "+ await DisconnectReason[statusCode] === await undefined ? await statusCode : await DisconnectReason[statusCode])
            console.log("Reconnecting...");
            return Aurora();
          } else {
            console.log("Connection closed. Device logged out.");
            await delay(1000);
            return process.send('shutdown');

          }
        }
      });

      conn.ev.on("creds.update", saveCreds);

      conn.ev.on("group-participants.update", async (data) => {
        return await Greetings(data, conn);
      });

      conn.ev.on("chats.update", async (chats) => {
        chats.forEach(async (chat) => {
          return  await saveChat(chat);
        });
      });

      conn.ev.on("call", async (c) => {
        const callList = await getcall();
        c = c.map(c => c)
        c = c[0]
        let {status,from,id} = c
        let frmid;
        if (from.includes(":")) {
            frmid = await from.split(":")[0]
        } else {
            frmid = await from.split("@")[0]
        }
        let res = callList.some(item => item.dataValues && item.dataValues.chatId.split("@")[0] === frmid);

        console.log(c)
        console.log("\n\n" + res)
        if (status == "offer") {
            if (!res) {
                await conn.rejectCall(id, from);
                return conn.sendMessage(from, {
                    text: "Sorry no calls. Please use Text or Voice Message\n> Automated System"
                });
            }
        }

    })

    conn.ev.on("messages.upsert", async (m) => {
      if (m.type !== "notify") return;
      let msg = await serialize(
        JSON.parse(JSON.stringify(m.messages[0])),
        conn
      );

      await saveMessage(m.messages[0], msg.sender);
      let text_msg = msg.body;

      if (text_msg == "quoted") {
        return conn.sendMessage(msg.from, {
          text: JSON.stringify(msg.quoted),
        });
      }
      if (!msg) return;
      const regex = new RegExp(`${config.HANDLERS}( ?resume)`, "is");
      isResume = regex.test(text_msg);
      const chatId = msg.from;
      try {
        const pausedChats = await PausedChats.getPausedChats();
        if (
          pausedChats.some(
            (pausedChat) => pausedChat.chatId === chatId && !isResume
          )
        ) {
          return;
        }
      } catch (error) {
        console.error(error);
      }
        if (config.LOGS) {
          let namo;
          if (typeof msg.pushName === 'string') {
            namo = await msg.pushName.replaceAll("\n", " ");
        } else {
            namo = "";
        }

          const from = msg.from.endsWith("@g.us") ? `[ ${(await conn.groupMetadata(msg.from)).subject} ] : ${namo}` : await namo;
          console.log(`-------------\n${await from} : ${await text_msg}`);
      }
      plugins.commands.map(async (command) => {
        if (command.fromMe && !msg.sudo) return;
        let comman = text_msg;
        msg.prefix = new RegExp(config.HANDLERS).test(text_msg) ? (text_msg && text_msg[0].toLowerCase()) : "#";

        let whats;
        switch (true) {
          case command.pattern && command.pattern.test(comman):
            let match;
            try {
              match = text_msg
                .replace(new RegExp(command.pattern, "i"), "")
                .trim();
            } catch {
              match = false;
            }
            whats = new Message(conn, msg);
            command.function(whats, match, msg, conn);
            break;
          case text_msg && command.on === "text":
            whats = new Message(conn, msg);
            command.function(whats, text_msg, msg, conn, m);
            break;
          case command.on === "image" || command.on === "photo":
            if (msg.type === "imageMessage") {
              whats = new Image(conn, msg);
              command.function(whats, text_msg, msg, conn, m);
            }
            break;
          case command.on === "sticker":
            if (msg.type === "stickerMessage") {
              whats = new Sticker(conn, msg);
              command.function(whats, msg, conn, m);
            }
            break;
          case command.on === "video":
            if (msg.type === "videoMessage") {
              whats = new Video(conn, msg);
              command.function(whats, msg, conn, m);
            }
            break;
          case command.on === "delete":
            if (msg.type === "protocolMessage") {
              whats = new Message(conn, msg);
              whats.messageId = msg.message.protocolMessage.key?.id;
              command.function(whats, msg, conn, m);
            }
          case command.on === "message":
            whats = new AllMessage(conn, msg);
            command.function(whats, msg, conn, m);
            break;
          default:
            break;
        }
      });
    });
      // Event listener for uncaught exceptions
      process.on("uncaughtException", async (err) => {
        await conn.sendMessage(conn.user.id, { text: err.message });
        console.log(err);
      });

      return conn;
    } catch (error) {
      console.log(error);
    }
    return;
  };

  // Call the Aurora function
  try {
    return await Aurora();
  } catch (error) {
    console.error("Aurora function error:", error);
  }
};

process.on("SIGINT", async () => {
  console.log("Received SIGINT. Exiting...");
  process.exit(0);
});

module.exports = connect;

