const plugins = require("../../lib/plugins");
const { command, isPrivate, clockString, pm2Uptime} = require("../../lib");
const { fancy10, typewriter, tiny } = require("../../lib/fancy")
const config = require("../../config");

const { hostname, uptime, totalmem, freemem } = require("os");

var tempo = (freemem / (1024 * 1024))
let allFreeMem;
if(tempo.toString().length <= 3){ allFreeMem = tempo }
if(tempo.toString().length > 3){ allFreeMem = (freemem / (1024 * 1024 * 1024)) }
var avbMem = (totalmem / (1024 * 1024 * 1024))
function formatTime(seconds) {
  if (isNaN(seconds) || seconds < 0) {
    return "Invalid input";
  }

  const months = Math.floor(seconds / (30 * 24 * 60 * 60));
  seconds -= months * 30 * 24 * 60 * 60;

  const days = Math.floor(seconds / (24 * 60 * 60));
  seconds -= days * 24 * 60 * 60;

  const hours = Math.floor(seconds / (60 * 60));
  seconds -= hours * 60 * 60;

  const minutes = Math.floor(seconds / 60);
  seconds -= minutes * 60;

  const timeArray = [];

  if (months > 0) {
    timeArray.push(months + (months === 1 ? " month" : " months"));
  }
  if (days > 0) {
    timeArray.push(days + (days === 1 ? " day" : " days"));
  }
  if (hours > 0) {
    timeArray.push(hours + (hours === 1 ? " hour" : " hours"));
  }
  if (minutes > 0) {
    timeArray.push(minutes + (minutes === 1 ? " minute" : " minutes"));
  }
  if (seconds > 0) {
    timeArray.push(seconds + (seconds === 1 ? " second" : " seconds"));
  }

  return timeArray.join(", ");
}

command(
  {
    pattern: "menu",
    fromMe: isPrivate,  
    desc: "Show All commands",
    dontAddCommandList: true,
    type:"user",
  },
  async (message, match) => {
    try{
      if (match) {
        for (let i of plugins.commands) {
          if (
            i.pattern instanceof RegExp &&
            i.pattern.test(message.prefix + match)
          ) {
            const cmdNameMatch = i.pattern.toString().match(/\/(\w+)/);
            const cmdName = cmdNameMatch ? cmdNameMatch[1] : "Unknown";
            let mess = `\`\`\`Command: ${message.prefix}${cmdName}
Description: ${i.desc}\`\`\``;
        return await message.client.sendMessage(message.jid, {text: mess});

          }
        }
        
      } else {
      let { prefix } = message;
      let [date, time] = new Date()
        .toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })
        .split(",");

        let menu = `╭═══〘 ${config.BOT_NAME} 〙═══⊷❍
┃✧╭──────────────
┃✧│
┃✧│ Owner : ${config.OWNER_NAME}
┃✧│ User : ${message.pushName}
┃✧│ Total RAM: ${avbMem.toFixed(2)} GB
┃✧│ Available RAM: ${allFreeMem.toFixed(0)}GB / ${avbMem.toFixed(2)}GB
┃✧│ Commands: ${plugins.commands.length}
┃✧│ Uptime: ${await formatTime(process.uptime().toFixed(0))}
┃✧│ Version: ${require("../../package.json").version}
┃✧│
┃✧│
┃✧│  ▎▍▌▌▉▏▎▌▉▐▏▌▎
┃✧│  ▎▍▌▌▉▏▎▌▉▐▏▌▎
┃✧│   ${ await message.pushName}
┃✧│
┃✧╰───────────────
╰═════════════════⊷`;
      let cmnd = [];
      let cmd;
      let category = [];
      plugins.commands.map((command, num) => {
        if (command.pattern) {
          cmd = command.pattern
            .toString()
            .match(/(\W*)([A-Za-züşiğ öç1234567890]*)/)[2];
        }

        if (!command.dontAddCommandList && cmd !== undefined) {
          let type;
          if (!command.type) {
            type = "misc";
          } else {
            type = command.type.toLowerCase();
          }

          cmnd.push({ cmd, type: type });

          if (!category.includes(type)) category.push(type);
        }
      });
      cmnd.sort();
      category.sort().forEach((cmmd) => {
        menu += `
╭════〘 ${cmmd} 〙════⊷❍\n┃✧╭─────────────────
┃✧│ `;
        let comad = cmnd.filter(({ type }) => type == cmmd);
        comad.forEach(({ cmd }, num) => {
          menu += `\n┃✧│ ${cmd.trim()}`;
        });
        menu += `\n┃✧╰─────────────────
╰══════════════════⊷❍`;
      });

      menu += `\n`;
      //menu += `_🔖Send ${prefix}menu <command name> to get detailed information of specific command._\n*📍Eg:* _${prefix}menu plugin_`;
      let fin = await menu.toUpperCase()
      return await message.client.sendMessage(message.jid, {text: typewriter(fin)});

    }
  } catch (error) {
    console.error("[Error]:", error);
  }
  }
);



command(
  {
    pattern: "list",
    fromMe: true,
    desc: "Show All Commands",
    type: "user",
    dontAddCommandList: true,
  },
  async (message, match, { prefix }) => {
    try{
    let menu = `╭────────────────╮
    ALIEN ALFA
╰────────────────╯
╭────────────────
`
    let cmnd = [];
    let cmd, desc;
    plugins.commands.map((command) => {
      if (command.pattern) {
        cmd = command.pattern.toString().split(/\W+/)[1];
      }
      desc = command.desc || false;

      if (!command.dontAddCommandList && cmd !== undefined) {
        cmnd.push({ cmd, desc });
      }
    });
    cmnd.sort();
    cmnd.forEach(({ cmd, desc }, num) => {
      menu += `│ \`\`\`${cmd}\`\`\`\n`;
    });
    menu += `╰────────────────`
    let fin = await menu.toUpperCase()
    return await message.client.sendMessage(message.jid, {text: typewriter(fin)});
  } catch (error) {
    console.error("[Error]:", error);
  }
  }
);