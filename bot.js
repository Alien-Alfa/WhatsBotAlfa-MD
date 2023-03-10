
const {
  default: makeWASocket,
  Browsers,
  makeInMemoryStore,
  useMultiFileAuthState,
} = require("@adiwajshing/baileys");
const singleToMulti = require("./lib/singleToMulti");
const fs = require("fs");
const { writeFile, readFile } = require("fs");
const { serialize } = require("./lib/serialize");
const { Message, Image, Sticker } = require("./lib/Base");
const pino = require("pino");
const path = require("path");
const events = require("./lib/event");
const got = require("got");
const { PluginDB } = require("./lib/database/plugins");
const Greetings = require("./lib/Greetings");
let { toBuffer } = require("qrcode");
const { HANDLERS, WORK_TYPE, SUDO, DATABASE, LOGS } = require("./database/settings");
let jsox = require("./database/settings.js")

const port = process.env.PORT||3030
const express = require("express");
const app = express();



const store = makeInMemoryStore({
  logger: pino().child({ level: "silent", stream: "store" }),
});

async function Singmulti() {
  const { state } = await useMultiFileAuthState(__dirname + "/session");
  await singleToMulti("session.json", __dirname + "/session", state);
}
Singmulti()




require("events").EventEmitter.defaultMaxListeners = 0;


fs.readdirSync(__dirname + "/lib/database/").forEach((plugin) => {
  if (path.extname(plugin).toLowerCase() == ".js") {
    require(__dirname + "/lib/database/" + plugin);
  }
});
async function AlienAlfa() {
  const { state ,saveCreds} = await useMultiFileAuthState(__dirname + "/session");
  console.log("Syncing Database");
  await DATABASE.sync();
  let conn = makeWASocket({
    logger: pino({ level: "silent" }),
    auth: state,
    printQRInTerminal: true,
    generateHighQualityLinkPreview: true,
    browser: Browsers.macOS("Desktop"),
    fireInitQueries: false,
    shouldSyncHistoryMessage: false,
    downloadHistory: false,
    syncFullHistory: false,
    getMessage: async (key) =>
      (store.loadMessage(key.id) || {}).message || {
        conversation: null,
      },
  });
  store.bind(conn.ev);
  setInterval(() => {
    store.writeToFile("./database/store.json"); 
    cloudspace()
  }, 30 * 60 * 1000);

  conn.ev.on("creds.update", saveCreds);

  conn.ev.on("connection.update", async (s) => {
    if (s.qr) {
     // res.end(await toBuffer(s.qr));
    }

    const { connection, lastDisconnect } = s;
    if (connection === "connecting") {
      console.log("Alien-Alfa");
      console.log("⭕ Starting Connection to WhatsApp...");
    }
    if (connection === "open") {
      console.log("😼 Connection Successful!");
      console.log("🐿️ Refreshing External Plugins...");

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
            require(__dirname + "/plugins/" + plugin.dataValues.name + ".js");
          }
        }
      });

      console.log("♻️ Loading Plugins...");
      
      try{

      fs.readdirSync(__dirname + "/plugins").forEach((plugin) => {
        if (path.extname(plugin).toLowerCase() == ".js") {
          require(__dirname + "/plugins/" + plugin);
        }
      });

    } catch(err) { console.log(err) }

      

      console.log("🟢 Connection Up!");
      console.log(`✅Bot Running in ${WORK_TYPE} Mode`);
      const {regnewuser, sudoBan, cloudspace, registeruser} = require("./lib/alfabase");

      regnewuser(conn)
      cloudspace()
      console.log("Sudo: " +SUDO)
      console.log("Handler: "+HANDLERS)

      try {
        conn.ev.on("group-participants.update", async (data) => {
          Greetings(data, conn);
          sudoBan(data, conn);
        });

        conn.ev.on("messages.upsert", async (m) => {
          if (m.type !== "notify") return;
          const ms = m.messages[0];
          let msg = await serialize(JSON.parse(JSON.stringify(ms)), conn);
          if (!msg.message) return;
          if (msg.body[1] && msg.body[1] == " ")
            msg.body = msg.body[0] + msg.body.slice(2);
          let text_msg = msg.body;
          if (text_msg && LOGS)
            console.log(
              `At : ${
                msg.from.endsWith("@g.us")
                  ? (await conn.groupMetadata(msg.from)).subject
                  : msg.from
              }\nFrom : ${msg.sender}\nMessage:${text_msg}`
            );

          events.commands.map(async (command) => {
            if (
              command.fromMe &&
              !SUDO.split(",").includes(
                msg.sender.split("@")[0] || !msg.isSelf
              )
            )
              return;
            let comman;
            if (text_msg) {
              comman = text_msg
                ? text_msg[0] +
                  text_msg.slice(1).trim().split(" ")[0].toLowerCase()
                : "";
              msg.prefix = new RegExp(HANDLERS).test(text_msg) ? text_msg.split("").shift() : "^";
            }
            if (command.pattern && command.pattern.test(comman)) {
              var match;
              try {
                match = text_msg.replace(new RegExp(comman, "i"), "").trim();
              } catch {
                match = false;
              }
              whats = new Message(conn, msg, ms);
              command.function(whats, match, msg, conn);
            } else if (text_msg && command.on === "text") {
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
    if (connection === "close") {
      console.log(s)
      console.log(
        "Connection closed with bot. Please put New Session ID again."
      );
      AlienAlfa().catch((err) => console.log(err));
    } else {
      /*
       */
    }
  });

  
  process.on("uncaughtException", (err) => {
    let error = err.message;
   // conn.sendMessage(conn.user.id, { text: error });
    console.log(err);
  });
} module.exports = AlienAlfa

global.prefix;
if(HANDLERS === "^" || "false" ){ prefix = '' }
else { prefix = HANDLERS }

const html = fs.readFileSync("./Alien/check.html")
app.get("/", (req, res) => res.type('html').send(html));
app.listen(port, () => console.log(`AlienAlfa Server listening on port http://localhost:${port}!`));

setTimeout(() => {
  AlienAlfa().catch((err) => console.log(err));
}, 1500)


