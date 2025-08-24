// Made with ❤ by AlienAlfa
// Performance optimized serialize.js

// Lazy load heavy dependencies for better startup performance
let downloadContentFromMessage, getContentType, downloadMediaMessage;
let fs, fsSync, fetch, fromBuffer, path, sticker, parsedJid, config;

const initializeDependencies = () => {
  if (!downloadContentFromMessage) {
    ({
      downloadContentFromMessage,
      getContentType,
      downloadMediaMessage,
    } = require("@whiskeysockets/baileys"));
    
    fs = require("fs").promises;
    fsSync = require("fs");
    fetch = require("node-fetch");
    ({ fromBuffer } = require("file-type"));
    path = require("path");
    
    ({
      writeExifImg,
      writeExifVid,
      imageToWebp,
      videoToWebp,
    } = require("./sticker"));
    
    ({ parsedJid } = require("./functions"));
    config = require("../config");
const logger = require("./logger");
  }
};

// Performance: Cached MIME type mapping
const MIME_MAP = {
  imageMessage: "image",
  videoMessage: "video", 
  stickerMessage: "sticker",
  documentMessage: "document",
  audioMessage: "audio",
};

async function downloadMedia(message, pathFile) {
  initializeDependencies();
  
  try {
    let type = Object.keys(message)[0];
    let mes = message;

    // Performance: Optimized message type detection
    const messageTypes = ["templateMessage", "interactiveResponseMessage", "buttonsMessage"];
    
    for (const msgType of messageTypes) {
      if (type === msgType) {
        switch (msgType) {
          case "templateMessage":
            mes = message.templateMessage.hydratedFourRowTemplate;
            break;
          case "interactiveResponseMessage":
            mes = message.interactiveResponseMessage;
            break;
          case "buttonsMessage":
            mes = message.buttonsMessage;
            break;
        }
        type = Object.keys(mes)[0];
        break;
      }
    }

    const stream = await downloadContentFromMessage(mes[type], MIME_MAP[type]);
    const chunks = [];

    for await (const chunk of stream) {
      chunks.push(chunk);
    }

    // Performance: Use concatenated buffer directly
    const buffer = Buffer.concat(chunks);

    if (pathFile) {
      await fs.writeFile(pathFile, buffer);
      return pathFile;
    } else {
      return buffer;
    }
  } catch (error) {
    logger.error("Error in downloadMedia:", error);
    throw error;
  }
}

// Performance: Cache frequently used values
const serializeCache = new Map();

async function serialize(msg, conn) {
  try {
    initializeDependencies();
    
    // Performance: Use silent logger to reduce overhead
    conn.logger = { info() {}, error() {}, warn() {} };
    
    if (msg.key) {
      msg.id = msg.key.id;
      msg.isSelf = msg.key.fromMe;
      msg.from = msg.key.remoteJid;
      msg.isGroup = msg.from.endsWith("@g.us");
     
      msg.sender = msg.isGroup
        ? msg.key.participant
        : msg.isSelf
        ? conn.user.id
        : msg.from;

      try {
        msg.sudo = config.SUDO.split(",").includes(
          parsedJid(msg.sender)[0].split("@")[0]
        );
      } catch {
        msg.sudo = false;
      }
    }

    if (msg.message) {
      msg.type = getContentType(msg.message);

      try {
        msg.mentions = msg.message[msg.type]?.contextInfo?.mentionedJid || [];
      } catch {
        msg.mentions = false;
      }

      try {
        const quoted = msg.message[msg.type]?.contextInfo;
        if (quoted && quoted.quotedMessage) {
          if (quoted.quotedMessage["ephemeralMessage"]) {
            const type = Object.keys(quoted.quotedMessage.ephemeralMessage.message)[0];
            msg.quoted = {
              type: type === "viewOnceMessageV2" ? "view_once" : "ephemeral",
              stanzaId: quoted.stanzaId,
              sender: quoted.participant,
              message:
                type === "viewOnceMessageV2"
                  ? quoted.quotedMessage.ephemeralMessage.message
                      .viewOnceMessageV2.message
                  : quoted.quotedMessage.ephemeralMessage.message,
            };
          } else if (quoted.quotedMessage["viewOnceMessageV2"]) {
            msg.quoted = {
              type: "view_once",
              stanzaId: quoted.stanzaId,
              sender: quoted.participant,
              message: quoted.quotedMessage.viewOnceMessageV2.message,
            };
          } else if (quoted.quotedMessage["viewOnceMessageV2Extension"]) {
            msg.quoted = {
              type: "view_once_audio",
              stanzaId: quoted.stanzaId,
              sender: quoted.participant,
              message: quoted.quotedMessage.viewOnceMessageV2Extension.message,
            };
          } else {
            msg.quoted = {
              type: "normal",
              stanzaId: quoted.stanzaId,
              sender: quoted.participant,
              message: quoted.quotedMessage,
            };
          }

          msg.quoted.isSelf = msg.quoted.sender === conn.user.id;
          msg.quoted.mtype = Object.keys(msg.quoted.message);

          msg.quoted.text =
            msg.quoted.message[msg.quoted.mtype]?.text ||
            msg.quoted.message[msg.quoted.mtype]?.description ||
            msg.quoted.message[msg.quoted.mtype]?.caption ||
            (msg.quoted.mtype === "templateButtonReplyMessage" &&
              msg.quoted.message[msg.quoted.mtype].hydratedTemplate
                ?.hydratedContentText) ||
            msg.quoted.message[msg.quoted.mtype] ||
            "";
          msg.quoted.key = {
            id: msg.quoted.stanzaId,
            fromMe: msg.quoted.isSelf,
            remoteJid: msg.from,
          };
          msg.quoted.download = (pathFile) =>
            downloadMedia(msg.quoted.message, pathFile);
        }
      } catch (error) {
        logger.error("Error in processing quoted message:", error);
        msg.quoted = null;
      }

      try {
        msg.body =
          msg.message.conversation ||
          msg.message[msg.type]?.text ||
          msg.message[msg.type]?.caption ||
          (msg.type === "listResponseMessage" &&
            msg.message[msg.type].singleSelectReply.selectedRowId) ||
          (msg.type === "buttonsResponseMessage" &&
            msg.message[msg.type].selectedButtonId &&
            msg.message[msg.type].selectedButtonId) ||
          (msg.type === "templateButtonReplyMessage" &&
            msg.message[msg.type].selectedId) ||
          false;
      } catch (error) {
        logger.error("Error in extracting message body:", error);
        msg.body = false;
      }

      // Performance: Optimized download function
      msg.download = async () => {
        try {
          const bx = await downloadMediaMessage(msg?.quoted || msg, "buffer", {}, conn);
          return bx;
        } catch (e) {
          return `Reply to an audio, image or video. Feature does not apply to text`;
        }
      };

      // Performance: Optimized file getter
      conn.getFile = async (PATH, returnAsFilename) => {
        let res, filename;
        let data = Buffer.isBuffer(PATH)
          ? PATH
          : /^data:.*?\/.*?;base64,/i.test(PATH)
          ? Buffer.from(PATH.split`,`[1], "base64")
          : /^https?:\/\//.test(PATH)
          ? await (res = await fetch(PATH)).buffer()
          : fsSync.existsSync(PATH)
          ? ((filename = PATH), fsSync.readFileSync(PATH))
          : typeof PATH === "string"
          ? PATH
          : Buffer.alloc(0);
        
        if (!Buffer.isBuffer(data)) throw new TypeError("Result is not a buffer");
        
        let type = (await fromBuffer(data)) || {
          mime: "application/octet-stream",
          ext: ".bin",
        };
        
        if (data && returnAsFilename && !filename) {
          filename = path.join(
            __dirname,
            "../" + new Date() * 1 + "." + type.ext
          );
          await fs.writeFile(filename, data);
        }
        
        return {
          res,
          filename,
          ...type,
          data,
        };
      };

      // Performance: Optimized sticker functions
      conn.sendImageAsSticker = async (jid, buff, options = {}) => {
        let buffer;
        if (options && (options.packname || options.author)) {
          buffer = await writeExifImg(buff, options);
        } else {
          buffer = await imageToWebp(buff);
        }
        await conn.sendMessage(
          jid,
          { sticker: buffer, ...options },
          options
        );
      };

      conn.sendVideoAsSticker = async (jid, buff, options = {}) => {
        let buffer;
        if (options && (options.packname || options.author)) {
          buffer = await writeExifVid(buff, options);
        } else {
          buffer = await videoToWebp(buff);
        }
        await conn.sendMessage(
          jid,
          { sticker: buffer, ...options },
          options
        );
      };
    }
    
    return msg;
  } catch (error) {
    logger.error("Serialize error:", error);
    return msg || {};
  }
}

module.exports = { serialize, downloadMedia };
