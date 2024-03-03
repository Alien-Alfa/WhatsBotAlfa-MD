const axios = require("axios");
const path =  require("path");
const { jidDecode, delay } = require("@whiskeysockets/baileys");
const { spawn } = require("child_process");
const FormData = require("form-data");
const fetch = require("node-fetch");
const { command } = require("./event");
let { JSDOM } = require("jsdom");
const config = require("../config");
const Jimp = require("jimp");
/*const ff = require("fluent-ffmpeg")*/
/*const {cmdDB , setcmd} = require("./functions")*/
const fse = require("fs-extra")
const _ = require("lodash");
const { Readable } = require('stream');
const ft = require("fluent-ffmpeg");
const NodeID3 = require('node-id3');
const { fromBuffer } = require("file-type");
/*const scrape = require("scraper-x0");
const scraper = new scrape("nxrj@123456");
const { ytIdRegex, yt, ytv, yta } = require("./yotube")
const {cmdDB , setcmd} = require("./cmds")*/
const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  apiKey: "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",
});
const openai = new OpenAIApi(configuration);
//const id3 = require("browser-id3-writer");
/*
const Spotify = require('spotifydl-core').default*/
const {
  listall,
  strikeThrough,
  wingdings,
  vaporwave,
  typewriter,
  fancy10,
  analucia,
  tildeStrikeThrough,
  underline,
  doubleUnderline,
  slashThrough,
  sparrow,
  heartsBetween,
  arrowBelow,
  crossAboveBelow,
  creepify,
  bubbles,
  mirror,
  squares,
  roundsquares,
  flip,
  tiny,
  createMap,
  serif_I,
  manga,
  ladybug,
  runes,
  serif_B,
  serif_BI,
} = require("./fancy_font/fancy");
const {
  imageToWebp,
  videoToWebp,
  writeExifImg,
  writeExifVid,
  writeExifWebp,
} = require("./sticker");
const {
  toAudio,
  toPTT,
  toVideo,
  ffmpeg,
  webp2mp4,
  webp2png,
} = require("./media");
const fs = require("node-webpmux/io");
const { readFile, unlink } = require("fs/promises");
const acrcloud = require("acrcloud")


async function getBuffer(url, options) {
  try {
    options ? options : {};
    const res = await require("axios")({
      method: "get",
      url,
      headers: {
        DNT: 1,
        "Upgrade-Insecure-Request": 1,
      },
      ...options,
      responseType: "arraybuffer",
    });
    return res.data;
  } catch (e) {
    console.log(`Error : ${e}`);
  }
}

async function Writer(title , image, dls){

let dd = await NodeID3.write({

    title: title || "𝑑𝑢𝑐𝑘𝑦-𝑚𝑑",

    artist: "𝑇𝑆𝐻𝐸𝑃𝐻𝐴𝑁𝐺",

    album: "𝐷𝑈𝐶𝐾¥-𝑀𝐷",

    APIC: image,

    TRCK: "27"

},

    dls

)

return dd

}


module.exports = {
  command,
  addCommand: command,
  t: command,
  Module: command,
  Function: command,
  isPrivate: config.WORK_TYPE.toLowerCase() === "private",
  isPublic: config.WORK_TYPE.toLowerCase() === "public",
  store: require("./store"),
  decodeJid: (jid) => {
    if (/:\d+@/gi.test(jid)) {
      const decode = jidDecode(jid) || {};
      return (
        (decode.user && decode.server && decode.user + "@" + decode.server) ||
        jid
      ).trim();
    } else return jid;
  },
  parseJid(text = "") {
    return [...text.matchAll(/@([0-9]{5,16}|0)/g)].map(
      (v) => v[1] + "@s.whatsapp.net"
    );
  },
  parsedJid(text = "") {
    return [...text.matchAll(/([0-9]{5,16}|0)/g)].map(
      (v) => v[1] + "@s.whatsapp.net"
    );
  },
  getJson: async function getJson(url, options) {
    try {
      options ? options : {};
      const res = await axios({
        method: "GET",
        url: url,
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36",
        },
        ...options,
      });
      return res.data;
    } catch (err) {
      return err;
    }
  },
  isUrl: (isUrl = (url) => {
    return new RegExp(
      /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/,
      "gi"
    ).test(url);
  }),
  getUrl: (getUrl = (url) => {
    return url.match(
      new RegExp(
        /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/,
        "gi"
      )
    );
  }),
  getBuffer,
  isAdmin: async (jid, user, client) => {
    const decodeJid = (jid) => {
      if (!jid) return jid;
      if (/:\d+@/gi.test(jid)) {
        let decode = jidDecode(jid) || {};
        return (
          (decode.user && decode.server && decode.user + "@" + decode.server) ||
          jid
        );
      } else return jid;
    };
    let groupMetadata = await client.groupMetadata(jid);
    const groupAdmins = groupMetadata.participants
      .filter((v) => v.admin !== null)
      .map((v) => v.id);
    return groupAdmins.includes(decodeJid(user));
  },
  qrcode: async (string) => {
    const { toBuffer } = require("qrcode");
    let buff = await toBuffer(string);
    return buff;
  },
  secondsToDHMS: async (seconds) => {
    seconds = Number(seconds);
    var d = Math.floor(seconds / (3600 * 24));
    var h = Math.floor((seconds % (3600 * 24)) / 3600);
    var m = Math.floor((seconds % 3600) / 60);
    var s = Math.floor(seconds % 60);
    var dDisplay = d > 0 ? d + (d == 1 ? " D, " : " D, ") : "";
    var hDisplay = h > 0 ? h + (h == 1 ? " H, " : " H, ") : "";
    var mDisplay = m > 0 ? m + (m == 1 ? " M, " : " M, ") : "";
    var sDisplay = s > 0 ? s + (s == 1 ? " S" : " S") : "";
    return dDisplay + hDisplay + mDisplay + sDisplay;
  },
  fromBuffer: fromBuffer,
  formatBytes: (bytes, decimals = 2) => {
    if (!+bytes) return "0 Bytes";

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
  },
  sleep: delay,
  clockString: (duration) => {
    (seconds = Math.floor((duration / 1000) % 60)),
      (minutes = Math.floor((duration / (1000 * 60)) % 60)),
      (hours = Math.floor((duration / (1000 * 60 * 60)) % 24));

    hours = hours < 10 ? "0" + hours : hours;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;

    return hours + ":" + minutes + ":" + seconds;
  },
  runtime: () => {
    var duration = process.uptime();
    var milliseconds = Math.floor((duration % 1000) / 100),
      seconds = Math.floor((duration / 1000) % 60),
      minutes = Math.floor((duration / (1000 * 60)) % 60),
      hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

    hours = hours < 10 ? "0" + hours : hours;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;

    return hours + ":" + minutes + ":" + seconds + "." + milliseconds;
  },
  
  styletext: (text, index) => {
    index = index - 1;
    return listall(text)[index];
  },
  Mp3Cutter: async (buffer, start, end) => {
    return new Promise(async (resolve, reject) => {
      const MP3Cutter = require("./Audio/cutter");
      let src = "mp3cut";
      fse.writeFileSync(src, buffer);
      let target = `mp3cutf`;
      var q = parseInt(start);
      if (q === 0) q = 1;
      MP3Cutter.cut({
        src: src,
        target: target,
        start: q,
        end: end,
      });
      let buff = await readFile(target);
      resolve(buff);
      await unlink(target);
      return await unlink(src);
    });
  },
  Bitly: async (url) => {
    return new Promise((resolve, reject) => {
      const BitlyClient = require("bitly").BitlyClient;
      const bitly = new BitlyClient("6e7f70590d87253af9359ed38ef81b1e26af70fd");
      bitly
        .shorten(url)
        .then((a) => {
          resolve(a);
        })
        .catch((A) => reject(A));
      return;
    });
  },
  isNumber: function isNumber() {
    const int = parseInt(this);
    return typeof int === "number" && !isNaN(int);
  },
  getRandom: function getRandom() {
    if (Array.isArray(this) || this instanceof String)
      return this[Math.floor(Math.random() * this.length)];
    return Math.floor(Math.random() * this);
  },
Gpt: async function Gpt(res){
const completion = await openai.createCompletion({
  model: "gpt-3.5-turbo",
  prompt: res,
  max_tokens: 2023
})
return completion.data.choices[0].text
},
SetFullPP: async function SetFullPP(jid, imag, message){

  async function updateProfilePicture(jid, imag, message) {
    const { query } = message.client;
    const { img } = await generateProfilePicture(imag);
    await query({
      tag: "iq",
      attrs: {
        to: jid,
        type: "set",
        xmlns: "w:profile:picture",
      },
      content: [
        {
          tag: "picture",
          attrs: { type: "image" },
          content: img,
        },
      ],
    });
  }

 await  updateProfilePicture(jid, imag, message)

  async function generateProfilePicture(buffer) {
    const jimp = await Jimp.read(buffer);
    const min = jimp.getWidth();
    const max = jimp.getHeight();
    const cropped = jimp.crop(0, 0, min, max);
    return {
      img: await cropped.scaleToFit(324, 720).getBufferAsync(Jimp.MIME_JPEG),
      preview: await cropped.normalize().getBufferAsync(Jimp.MIME_JPEG),
    };
  }
},
PluginDLevel: async function PluginDLevel(body) {
  var DEG = { level: 5 }
  if (body.includes('fs.')) DEG.level = DEG.level + 8
  if (body.includes('message.client.user.name')) DEG.level = DEG.level + 6
  if (body.includes('Buffer')) DEG.level = DEG.level + 14
  if (body.includes("require('fs')")) DEG.level = DEG.level + 9
  if (body.includes('quotedMessage')) DEG.level = DEG.level + 5
  if (body.includes('fs.unlinkSync')) DEG.level = DEG.level + 16
  if (body.includes('findAll')) DEG.level = DEG.level + 20
  if (body.includes('MessageType.location')) DEG.level = DEG.level + 9
  if (body.includes('message.client.user.jid')) DEG.level = DEG.level + 8
  if (body.includes('exec')) DEG.level = DEG.level + 14
  if (body.includes('setMessage')) DEG.level = DEG.level + 22
  if (body.includes('/sql/notes') || body.includes('/sql/lydia') || body.includes('/sql/plugin') || body.includes('/sql/greetings') || body.includes('/sql/filters')) DEG.level = DEG.level + 33
  if (body.includes('neofetch')) DEG.level = DEG.level + 12
  if (body.includes('groupMetadata')) DEG.level = DEG.level + 29
  if (body.includes('similarity')) DEG.level = DEG.level + 18
  if (body.includes('format')) DEG.level = DEG.level + 26
  return DEG.level
},

stickban: async function stickban(msg) {
  let ChatId = await msg.key.remoteJid
  var filtreler = await stickban.getStickBan(ChatId);
  if (!filtreler) return;
  filtreler.map(async (filter) => {
    pattern = new RegExp(
      filter.dataValues.regex
        ? filter.dataValues.pattern
        : "\\b(" + filter.dataValues.pattern + ")\\b",
      "gm"
    );
    const StickId = msg.key.id;
    const zjid = msg.key.participant
    if (pattern.test(StickId)) {
      await conn.groupParticipantsUpdate(ChatId, zjid, "remove")
      await conn.sendMessage(ChatId, {text: "_Banned Sticker_",});
    }
  });    
},

Imagine:async function Imagine(magic) {
const response = await openai.createImage({
  prompt:  magic,
  n: 1,
  size: "1024x1024",
});
return image_url = response.data.data[0].url;

},
  
/*spotify: async function spotify(media){

const spotify = new Spotify({

    clientId: 'c6373de795f54827bacb48680bb4c8ac', 

    clientSecret: '528b185ce1c44d0aa06ac7e1294cc083', 

})

const data = await spotify.getTrack(media) 

let {cover_url , name } = data 

cover_url = await getBuffer(cover_url)

 const song = await spotify.downloadTrack(media)

 let bb = fse.writeFileSync('song.mp3', song)

 let songDl = await Writer(name, cover_url , song)

 return songDl

},*/
  prefix: require("../database/database.json").prefix,
  /*scraper,*/
 /* ytv,
  yta,
  ytIdRegex,
  yt,*/
  imageToWebp,
  videoToWebp,
  writeExifImg,
  writeExifVid,
  writeExifWebp,
  toAudio,
  toPTT,
  toVideo,
  ffmpeg,
  webp2mp4,
  webp2png,
  listall,
  /*cmdDB,
  setcmd,*/
  strikeThrough,
  wingdings,
  vaporwave,
  typewriter,
  fancy10,
  analucia,
  tildeStrikeThrough,
  underline,
  doubleUnderline,
  slashThrough,
  sparrow,
  heartsBetween,
  arrowBelow,
  crossAboveBelow,
  creepify,
  Writer,
  bubbles,
  mirror,
  squares,
  roundsquares,
  flip,
  tiny,
  createMap,
  serif_I,
  manga,
  ladybug,
  runes,
  serif_B,
  serif_BI,
  serif_I,
};
