const {
  Function,
  isPrivate,
  getUrl,
  fromBuffer,
  //Imgur,
  getBuffer,
  getJson,
  Fancy,
  //AddMp3Meta,
  formatBytes,
  parseJid,
  isUrl,
  parsedJid,
  pinterest,
  wallpaper,
  wikimedia,
  quotesAnime,
  aiovideodl,
  umma,
  ringtone,
  styletext,
  FileSize,
  h2k,
  textpro,
  yt,
  ytIdRegex,
 // yta,
 // ytv,
  runtime,
  clockString,
  sleep,
  jsonformat,
  Serialize,
  processTime,
  command,
} = require("../lib/");
const util = require("util");
const config = require("../config");
const fs = require('fs-extra');
const axios = require('axios');
const path = require('path');
const got = require('got');

command({pattern:'eval', on: "text", fromMe: isPrivate,  desc :'Runs a server code'}, async (message, match, m, client , conn) => {
  if (match.startsWith(">")) {
    //const m = message;
    try {
      let evaled = await eval(`(async () => { ${match.replace(">" , "")} })()`);
      if (typeof evaled !== "string") evaled = require("util").inspect(evaled);
      await message.reply(evaled);
    } catch (err) {
      await message.reply(util.format(err));
    }
  }
});
