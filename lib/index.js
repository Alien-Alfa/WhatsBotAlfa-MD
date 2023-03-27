/* Copyright (C) 2022 Albin Thomas.
Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.
Alien-Alfa WhatsApp Bot - Albin Thomas
*/
const fs = require("fs");

let db = JSON.parse(fs.readFileSync('./database/settings.json'));
  const { WORK_TYPE } = require("../database/settings");

  const Heroku = require("heroku-client");
  const heroku = new Heroku({ token: process.env.HEROKU_API_KEY });
  const simpleGit = require("simple-git");
  const git = simpleGit();

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
const { Configuration, OpenAIApi } = require("openai");
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
