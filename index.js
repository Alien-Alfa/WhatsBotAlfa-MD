const {
  default: makeWASocket,
  useMultiFileAuthState,
  Browsers,
  makeInMemoryStore,
} = require("@whiskeysockets/baileys");
const fs = require("fs");
const { serialize } = require("./lib/serialize");
const { Message, Image, Sticker } = require("./lib/Base");
const pino = require("pino");
const path = require("path");
const events = require("./lib/event");
const got = require("got");
const express = require("express");
const app = express();
const port = process.env.PORT || 8000;
const config = require("./config");
const package = require("./package.json");
const { PluginDB } = require("./lib/database/plugins");
const Greetings = require("./lib/Greetings");
const { MakeSession } = require("./lib/session");
const { PausedChats } = require("./database");
const store = makeInMemoryStore({
  logger: pino().child({ level: "silent", stream: "store" }),
});


     async function auth(){
if (!fs.existsSync("./session/creds.json")) {
  await MakeSession(config.SESSION_ID, "./session/creds.json").then(
    console.log("Vesrion : " + require("./package.json").version)
  );
}
}auth()
fs.readdirSync("./lib/database/").forEach((plugin) => {
  if (path.extname(plugin).toLowerCase() == ".js") {
    require("./lib/database/" + plugin);
  }
});


async function Tsp() {
	
  
      console.log("Syncing Database");
      await config.DATABASE.sync();
  const { state, saveCreds } = await useMultiFileAuthState(__dirname +"/session/");
  let conn = makeWASocket({
    logger: pino({ level: "silent" }),
    auth: state,
    printQRInTerminal: false,

    browser: Browsers.macOS("Desktop"),
    downloadHistory: false,
    syncFullHistory: false,
  });
    store.bind(conn.ev);
  //store.readFromFile("./database/store.json");
  setInterval(() => {
    store.writeToFile("./database/store.json");
    console.log("saved store");
  }, 30 * 60 * 1000);

  conn.ev.on("connection.update", async (s) => {
    const { connection, lastDisconnect } = s;
    if (connection === "connecting") {
      console.log("Aurora");
      console.log("ℹ️ Connecting to WhatsApp... Please Wait.");
    }

    if (
      connection === "close" &&
      lastDisconnect &&
      lastDisconnect.error &&
      lastDisconnect.error.output.statusCode != 401
    ) {
      console.log(lastDisconnect.error.output.payload);
      Tshephang();
    }

    if (connection === "open") {

      //conn.sendMessage(conn.user.id, { text: "connected✔︎✔︎" });
      let creds = require("./session/creds.json")
      await conn.sendMessage(conn.user.id, { text: "```----- 𝞓𝙇𝞘𝞢𝞜-𝞓𝙇𝙁𝞓-𝞛𝘿 -----\n\nVersion : "+package.version+"\nStatus  : Connected!\nNumber  : "+conn.user.id.split(":")[0]+"\nPlatform: "+creds.platform+"\n\n----- 𝞓𝙇𝞘𝞢𝞜-𝞓𝙇𝙁𝞓-𝞛𝘿 -----```" });

      console.log("✅ Login Successful!");
      console.log("⬇️ Installing External Plugins...");

      let plugins = await PluginDB.findAll();
      plugins.map(async (plugin) => {
        if (!fs.existsSync("./plugins/" + plugin.dataValues.name + ".js")) {
          console.log(plugin.dataValues.name);
          var response = await got(plugin.dataValues.url);
          if (response.statusCode == 200) {
            fs.writeFileSync(
              "./plugins/" + plugin.dataValues.name + ".js",
              response.body
            );
            require("./plugins/" + plugin.dataValues.name + ".js");
          }
        }
      });

      console.log("⬇️  Installing Plugins...");

      fs.readdirSync("./plugins").forEach((plugin) => {
        if (path.extname(plugin).toLowerCase() == ".js") {
          require("./plugins/" + plugin);
        }
      });
      console.log("✅ Plugins Installed!");

      try {
        conn.ev.on("creds.update", saveCreds);

        conn.ev.on("group-participants.update", async (data) => {
          Greetings(data, conn);
        });
        conn.ev.on("messages.upsert", async (m) => {
          if (m.type !== "notify") return;
          let msg = await serialize(
            JSON.parse(JSON.stringify(m.messages[0])),
            conn
          );
          let text_msg = msg.body;
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
          if (text_msg) {
            const from = msg.from.endsWith("@g.us") ? `[ ${(await conn.groupMetadata(msg.from)).subject} ] : ${msg.pushName}` : msg.pushName;
            const sender = msg.sender;
            console.log(`-------------\n${await from} : ${await text_msg}`);
      
        }
	
          events.commands.map(async (command) => {
            if (
              msg.key.fromMe === false && command.fromMe === true  &&
              !config.SUDO.split(",").includes(
                msg.sender.split("@")[0] || msg.isSelf
              )
            )
              return;
            let comman;

            try {
              comman = text_msg.split(" ")[0];
	      
	  } catch {
              comman = false;
            }
            if (text_msg)
		/*if(!text_msg.startsWith(config.HANDLERS) && !text_msg.startsWith(">") && !text_msg.startsWith(command.pattern)) return*/
              if (
                command.pattern &&
                command.pattern.test(comman.toLowerCase())
              ) {
                var match = text_msg.trim().split(/ +/).slice(1).join(" ");
		whats = new Message(conn, msg, ms);

                command.function(whats, match, msg, conn);
              } else if (text_msg && command.on === "text") {
               
              msg.prefix = "^";
                whats = new Message(conn, msg, ms);
                command.function(whats, text_msg, msg, conn, m);
              } else if (
                (command.on === "image" || command.on === "photo") &&
                msg.type === "imageMessage"
              ) {
                whats = new Image(conn, msg, ms);
                command.function(whats, text_msg, msg, conn, m, ms);
              } else if (
                command.on === "sticker" &&
                msg.type === "stickerMessage"
              ) {
		
                whats = new Sticker(conn, msg, ms);
                command.function(whats, msg, conn, m, ms);
              }
          });
        });
      } catch (e) {
        console.log(e + "\n\n\n\n\n" + JSON.stringify(msg));
      }
    }
  });
  process.on("uncaughtException", async (err) => {
    // Extract the error message
    let error = err.message;
  
    // Send an error report message to a user
    await conn.sendMessage(conn.user.id, { text: "```---ERROR REPORT---\n\nVersion : "+package.version+"\nMessage : \nError   : "+error+"\nJid     : "+conn.user.id+"\ncommand : \nPlatform: "+creds.platform+"\n\n----- 𝞓𝙇𝞘𝞢𝞜-𝞓𝙇𝙁𝞓-𝞛𝘿 -----```" });
  
    // Log the error details to the console
    await console.log("\n\n\n\n"+err+"\n\n\n\n");
  });
}
//app.get("/", (req, res) => {res.send("code: 200! (>.<)");});
//app.listen(port, () => console.log(`cortana Server listening on port http://localhost:${port}`));

setTimeout(() => {
  Tsp();
}, 500); 