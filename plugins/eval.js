

const {
  Function,
  isPrivate,
  getUrl,
  fromBuffer,
  getBuffer,
  getJson,
  AddMp3Meta,
  createMap,
  formatBytes,
  parseJid,
  isUrl,
  parsedJid,
  styletext,
  yt,
  ytIdRegex,
  yta,
  ytv,
  runtime,
  clockString,
  sleep,
  command,
} = require("../lib/");
const util = require("util");

const exec = require('child_process').exec;
const os = require("os");

command({pattern:'eval', on: "text", fromMe: true,desc :'Runs a server code'}, async (message, match, m, client) => {
  if (match.startsWith(">")) {
    //const m = message;
    try {
      let evaled = await eval(`${match.replace(">", "")}`);
      if (typeof evaled !== "string") evaled = require("util").inspect(evaled);
      await message.reply(evaled);
    } catch (err) {
      await message.reply(util.format(err));
    }
  }
  if (match.startsWith("$")) {

  var user = os.userInfo().username;
  if (match === '') return await message.sendMessage('reply your command');

  exec(match, async (err, stdout, stderr) => {
    if (err) {
      return await message.sendMessage('```' + user + ':#  ' + match + '\n\n' + err + '```');
    }

    return await message.sendMessage('```' + user + ':# ' + match + '\n\n' + stdout + '```');
  });
}
});

 



