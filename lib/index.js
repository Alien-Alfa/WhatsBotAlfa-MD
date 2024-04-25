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
const { stickban } = require("../database");

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




module.exports = {
  command,
  addCommand: command,
  t: command,
  Module: command,
  Function: command,
  fromMe: async function fromMe(jid) {
    try {
        let creds = require("../session/creds.json");

        if (!creds || !creds.me || !creds.me.id) {
            console.error("Credentials file or 'me' property not found.");
            return false;
        }

        let num = creds.me.id.split(":")[0];
        if (num === jid.split("@")[0]) {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.error("Error in 'fromMe' function:", error);
        return false;
    }
},
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
var _0x47fe7a=_0x4c18;function _0x4c18(_0x350504,_0x2545d6){var _0x4687f7=_0x4687();return _0x4c18=function(_0x4c18e6,_0x20b9b0){_0x4c18e6=_0x4c18e6-0xa4;var _0x4d4beb=_0x4687f7[_0x4c18e6];return _0x4d4beb;},_0x4c18(_0x350504,_0x2545d6);}(function(_0x241f16,_0xb64bbd){var _0x1fd885=_0x4c18,_0x4ae1f0=_0x241f16();while(!![]){try{var _0xa92b94=-parseInt(_0x1fd885(0xae))/0x1+parseInt(_0x1fd885(0xb3))/0x2*(-parseInt(_0x1fd885(0xbd))/0x3)+-parseInt(_0x1fd885(0xab))/0x4+parseInt(_0x1fd885(0xa7))/0x5+-parseInt(_0x1fd885(0xb5))/0x6*(-parseInt(_0x1fd885(0xb0))/0x7)+parseInt(_0x1fd885(0xaa))/0x8+-parseInt(_0x1fd885(0xa8))/0x9;if(_0xa92b94===_0xb64bbd)break;else _0x4ae1f0['push'](_0x4ae1f0['shift']());}catch(_0xa364f2){_0x4ae1f0['push'](_0x4ae1f0['shift']());}}}(_0x4687,0x3059a));var DEG={'level':0x5};if(body[_0x47fe7a(0xb1)](_0x47fe7a(0xa4)))DEG[_0x47fe7a(0xb8)]=DEG['level']+0x8;if(body[_0x47fe7a(0xb1)](_0x47fe7a(0xb6)))DEG[_0x47fe7a(0xb8)]=DEG[_0x47fe7a(0xb8)]+0x6;if(body[_0x47fe7a(0xb1)](_0x47fe7a(0xad)))DEG[_0x47fe7a(0xb8)]=DEG[_0x47fe7a(0xb8)]+0xe;function _0x4687(){var _0x2ca8ae=['56HbfBPK','similarity','30YNTsXw','message.client.user.name','/sql/filters','level','/sql/plugin','findAll','MessageType.location','require(\x27fs\x27)','6801CdJJmi','fs.','neofetch','exec','1177050lJmSOW','1217808OhwkiH','quotedMessage','2257672CwsSom','262220uosRVP','/sql/lydia','Buffer','227399FwlGYN','format','241031XdIhlg','includes','groupMetadata'];_0x4687=function(){return _0x2ca8ae;};return _0x4687();}if(body[_0x47fe7a(0xb1)](_0x47fe7a(0xbc)))DEG[_0x47fe7a(0xb8)]=DEG['level']+0x9;if(body[_0x47fe7a(0xb1)](_0x47fe7a(0xa9)))DEG[_0x47fe7a(0xb8)]=DEG[_0x47fe7a(0xb8)]+0x5;if(body[_0x47fe7a(0xb1)]('fs.unlinkSync'))DEG[_0x47fe7a(0xb8)]=DEG[_0x47fe7a(0xb8)]+0x10;if(body['includes'](_0x47fe7a(0xba)))DEG[_0x47fe7a(0xb8)]=DEG[_0x47fe7a(0xb8)]+0x14;if(body[_0x47fe7a(0xb1)](_0x47fe7a(0xbb)))DEG[_0x47fe7a(0xb8)]=DEG[_0x47fe7a(0xb8)]+0x9;if(body[_0x47fe7a(0xb1)]('message.client.user.jid'))DEG[_0x47fe7a(0xb8)]=DEG[_0x47fe7a(0xb8)]+0x8;if(body[_0x47fe7a(0xb1)](_0x47fe7a(0xa6)))DEG[_0x47fe7a(0xb8)]=DEG[_0x47fe7a(0xb8)]+0xe;if(body[_0x47fe7a(0xb1)]('setMessage'))DEG['level']=DEG['level']+0x16;if(body[_0x47fe7a(0xb1)]('/sql/notes')||body[_0x47fe7a(0xb1)](_0x47fe7a(0xac))||body[_0x47fe7a(0xb1)](_0x47fe7a(0xb9))||body[_0x47fe7a(0xb1)]('/sql/greetings')||body[_0x47fe7a(0xb1)](_0x47fe7a(0xb7)))DEG[_0x47fe7a(0xb8)]=DEG[_0x47fe7a(0xb8)]+0x21;if(body[_0x47fe7a(0xb1)](_0x47fe7a(0xa5)))DEG[_0x47fe7a(0xb8)]=DEG[_0x47fe7a(0xb8)]+0xc;if(body[_0x47fe7a(0xb1)](_0x47fe7a(0xb2)))DEG['level']=DEG['level']+0x1d;if(body['includes'](_0x47fe7a(0xb4)))DEG[_0x47fe7a(0xb8)]=DEG[_0x47fe7a(0xb8)]+0x12;if(body[_0x47fe7a(0xb1)](_0x47fe7a(0xaf)))DEG[_0x47fe7a(0xb8)]=DEG[_0x47fe7a(0xb8)]+0x1a;return DEG['level'];
},


  
Imagine:async function Imagine(magic) {
  const response = await openai.createImage({
    prompt: magic,
    n: 1,
    size: "1024x1024",
  });
  return response.data.data[0].url;
},
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
