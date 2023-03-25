//|⬡════════════════════════════════════════════|❝ Ⓒ𝙰𝙻𝙸𝙴𝙽 𝙰𝙻𝙵𝙰 𝙱𝙾𝚃 𝙱𝚈 𝚃𝙾𝚇𝙸𝙲 𝙰𝙻𝙸𝙴𝙽™ ❞|═══════════════════════════════════════════⬡|
const fs = require("fs")

const events = require("../lib/event");
const {
    command
    , isPrivate
    , tiny
    , serif_B
    , clockString
    , styletext
    , listall
, } = require("../lib");
const {
    ALIVE
    , HEROKU_APP_NAME
    , HANDLERS
    , WORK_TYPE
    , PACKNAME
    , AUTHOR
    , BOT_NAME
    , OWNER_NAME
    , SUDO
    , THEME
    , FONT_STYLE
    , INTERNAL_MENU
} = require("../database/settings");
const {
    hostname
    , uptime
    , totalmem
    , freemem
} = require("os");
const {
    config
} = require("dotenv");
const axios = require("axios");

var tempo = (freemem / (1024 * 1024))
let allFreeMem;
if (tempo.toString().length <= 3) {
    allFreeMem = tempo
}
if (tempo.toString().length > 3) {
    allFreeMem = (freemem / (1024 * 1024 * 1024))
}
var avbMem = (totalmem / (1024 * 1024 * 1024))

if (THEME === "alfa") {
    if (INTERNAL_MENU === 'active') {
        command({
            pattern: "ping"
            , fromMe: isPrivate
            , desc: "To check ping"
            , type: "user"
        , }, async (message, match, m) => {
            const start = new Date().getTime();
            await message.sendMessage("```Processing...```");
            const end = new Date().getTime();
            return await message.sendMessage("```" + (end - start) +
                "ms```"
            );
        });

        var gmsg = ""
            , ownmsg = ""
            , dlmsg = ""
            , utilmsg = ""
            , srmsg = ""
            , tms = ""
            , lms = ""
            , edmsg = ""
            , xmediazi = "";

        command({
                pattern: "menu"
                , fromMe: isPrivate
                , desc: "Show All commands"
                , dontAddCommandList: true
                , type: "theme",

            }
            , async (message, match, m) => {
  
                if (HANDLERS === "^")
                    var presix = ''
                else
                    var presix = prefix
                    if (match) {
                        for (let i of events.commands) {
                          if (i.pattern.test(message.prefix + match))
                          message.treply(`
                          ╭════〘 *Command Info* 〙════⊷❍
                          ┃✧╭─────────────────
                          ┃ \`\`\`Command : ${message.prefix}${match.trim()}\`\`\`
                          ┃ \`\`\`Description : ${i.desc}\`\`\`
                          ┃✧╰─────────────────
                          ╰══════════════════⊷❍`);
                        }
                      } else {
                    

                    let [date, time] = new Date()
                        .toLocaleString("en-IN", {
                            timeZone: "Asia/Kolkata"
                        })
                        .split(",");

                    for (let i of events.commands) {
                        if (i.type === 'group') {
                            gmsg +=
                                `┃✧│ ${message.prefix}${i.pattern.toString().match(/(\W*)([A-Za-zğüşıiöç1234567890 ]*)/)[2]} \n`
                        };
                        if (i.type === 'downloader') {
                            dlmsg +=
                                `┃✧│ ${message.prefix}${i.pattern.toString().match(/(\W*)([A-Za-zğüşıiöç1234567890 ]*)/)[2]} \n`
                        };
                        if (i.type === 'textmaker') {
                            tms +=
                                `┃✧│ ${message.prefix}${i.pattern.toString().match(/(\W*)([A-Za-zğüşıiöç1234567890 ]*)/)[2]} \n`
                        };
                        if (i.type === 'user') {
                            ownmsg +=
                                `┃✧│ ${message.prefix}${i.pattern.toString().match(/(\W*)([A-Za-zğüşıiöç1234567890 ]*)/)[2]} \n`
                        };
                        if (i.type === 'edit') {
                            edmsg +=
                                `┃✧│ ${message.prefix}${i.pattern.toString().match(/(\W*)([A-Za-zğüşıiöç1234567890 ]*)/)[2]} \n`
                        };
                        if (i.type === 'xediazi') {
                            xmediazi +=
                                `┃✧│ ${message.prefix}${i.pattern.toString().match(/(\W*)([A-Za-zğüşıiöç1234567890 ]*)/)[2]} \n`
                        };
                        if (i.type === 'search') {
                            srmsg +=
                                `┃✧│ ${message.prefix}${i.pattern.toString().match(/(\W*)([A-Za-zğüşıiöç1234567890 ]*)/)[2]} \n`
                        };
                        if (i.type === 'tool') {
                            utilmsg +=
                                `┃✧│ ${message.prefix}${i.pattern.toString().match(/(\W*)([A-Za-zğüşıiöç1234567890 ]*)/)[2]} \n`
                        };
                    }

                    let rows = [];
                    rows.push({
                        title: styletext(`All Menu`, parseInt(
                            `${FONT_STYLE}`))
                        , rowId: `${presix}allmenu`
                    , });
                    rows.push({
                        title: styletext(`Edit List`, parseInt(
                            `${FONT_STYLE}`))
                        , rowId: `${presix}medit`
                    , });
                    rows.push({
                        title: styletext(`Search List`,
                            parseInt(`${FONT_STYLE}`))
                        , rowId: `${presix}msearch`
                    , });
                    rows.push({
                        title: styletext(`Downloads List`,
                            parseInt(`${FONT_STYLE}`))
                        , rowId: `${presix}mdownloader`
                    , });
                    rows.push({
                        title: styletext(`X-media List`,
                            parseInt(`${FONT_STYLE}`))
                        , rowId: `${presix}mxediazi`
                    , });
                    rows.push({
                        title: styletext(`Tools List`, parseInt(
                            `${FONT_STYLE}`))
                        , rowId: `${presix}mtool`
                    , });
                    rows.push({
                        title: styletext(`Owner List`, parseInt(
                            `${FONT_STYLE}`))
                        , rowId: `${presix}muser`
                    , });
                    rows.push({
                        title: styletext(`Logomaker List`,
                            parseInt(`${FONT_STYLE}`))
                        , rowId: `${presix}mtextmaker`
                    , });
                    rows.push({
                        title: styletext(`Group List`, parseInt(
                            `${FONT_STYLE}`))
                        , rowId: `${presix}mgroup`
                    , });

                    let men = `╭═══〘 ${BOT_NAME} 〙═══⊷❍
  ┃✧╭──────────────
  ┃✧│
  ┃✧│ Owner : ${OWNER_NAME}
  ┃✧│ User : ${message.pushName}
  ┃✧│ Mode : ${WORK_TYPE}
  ┃✧│ Total RAM: ${avbMem.toFixed(2)} GB
  ┃✧│ Available RAM: ${allFreeMem.toFixed(0)}GB / ${avbMem.toFixed(2)}GB
  ┃✧│ Commands: ${events.commands.length}
  ┃✧│ Uptime: ${clockString(uptime())}
  ┃✧│ Version: ${require("../package.json").version}
  ┃✧│
  ┃✧│
  ┃✧│  ▎▍▌▌▉▏▎▌▉▐▏▌▎
  ┃✧│  ▎▍▌▌▉▏▎▌▉▐▏▌▎
  ┃✧│   ${ await message.pushName}
  ┃✧│ 
  ┃✧╰───────────────
  ╰═════════════════⊷`

                    return await message.client.sendMessage(message.jid,
                    {
                        text: styletext(men, parseInt(
                            `${FONT_STYLE}`))
                        , buttonText: styletext("Show menu",
                            parseInt(`${FONT_STYLE}`))
                        , sections: [
                            {
                                title: styletext(
                                    "These Are The list",
                                    parseInt(
                                        `${FONT_STYLE}`)
                                    )
                                , rows: rows
              , }
            , ]
                    , });

                }
            });

        command({
            pattern: "msearch"
            , fromMe: isPrivate
            , desc: "Show All search"
            , dontAddCommandList: true
        , }, async (message, match, m) => {

            let menu = `╭────────────────╮
         ${BOT_NAME}
╰────────────────╯
╭────────────────
`

            let {
                prefix
            } = message;
            let [date, time] = new Date()
                .toLocaleString("en-IN", {
                    timeZone: "Asia/Kolkata"
                })
                .split(",");

            var srmsg = "";
            for (let i of events.commands) {
                if (i.type === 'search') {
                    srmsg +=
                        `│ ${message.prefix}${i.pattern.toString().match(/(\W*)([A-Za-zğüşıiöç1234567890 ]*)/)[2]} \n`
                };
            }

            menu += srmsg;
            menu += `╰────────────────`

            message.sendMessage(styletext(menu, parseInt(
                `${FONT_STYLE}`)));

        });

        //-------------------------------------------------------------------------------------------------------------------
        //-------------------------------------------------------------------------------------------------------------------
        //-------------------------------------------------------------------------------------------------------------------

        command({
            pattern: "mgroup"
            , fromMe: isPrivate
            , desc: "Show All group"
            , dontAddCommandList: true
        , }, async (message, match, m) => {

            let menu = `╭────────────────╮
         ${BOT_NAME}
╰────────────────╯
╭────────────────
`

            let {
                prefix
            } = message;
            let [date, time] = new Date()
                .toLocaleString("en-IN", {
                    timeZone: "Asia/Kolkata"
                })
                .split(",");

            var gmsg = "";
            for (let i of events.commands) {
                if (i.type === 'group') {
                    gmsg +=
                        `┃✧│ ${message.prefix}${i.pattern.toString().match(/(\W*)([A-Za-zğüşıiöç1234567890 ]*)/)[2]} \n`
                };
            }

            menu += gmsg;
            menu += `╰────────────────`

            message.sendMessage(styletext(menu, parseInt(
                `${FONT_STYLE}`)));

        });

        //-------------------------------------------------------------------------------------------------------------------
        //-------------------------------------------------------------------------------------------------------------------
        //-------------------------------------------------------------------------------------------------------------------

        command({
            pattern: "mdownloader"
            , fromMe: isPrivate
            , desc: "Show All downloader"
            , dontAddCommandList: true
        , }, async (message, match, m) => {

            let menu = `╭────────────────╮
         ${BOT_NAME}
╰────────────────╯
╭────────────────
`

            let {
                prefix
            } = message;
            let [date, time] = new Date()
                .toLocaleString("en-IN", {
                    timeZone: "Asia/Kolkata"
                })
                .split(",");

            var dlmsg = "";
            for (let i of events.commands) {
                if (i.type === 'downloader') {
                    dlmsg +=
                        `┃✧│ ${message.prefix}${i.pattern.toString().match(/(\W*)([A-Za-zğüşıiöç1234567890 ]*)/)[2]} \n`
                };
            }

            menu += dlmsg;
            menu += `╰────────────────`

            message.sendMessage(styletext(menu, parseInt(
                `${FONT_STYLE}`)));

        });

        //-------------------------------------------------------------------------------------------------------------------
        //-------------------------------------------------------------------------------------------------------------------
        //-------------------------------------------------------------------------------------------------------------------

        command({
            pattern: "mtextmaker"
            , fromMe: isPrivate
            , desc: "Show All textmaker"
            , dontAddCommandList: true
        , }, async (message, match, m) => {

            let menu = `╭────────────────╮
         ${BOT_NAME}
╰────────────────╯
╭────────────────
`

            let {
                prefix
            } = message;
            let [date, time] = new Date()
                .toLocaleString("en-IN", {
                    timeZone: "Asia/Kolkata"
                })
                .split(",");

            var tms = "";
            for (let i of events.commands) {
                if (i.type === 'textmaker') {
                    tms +=
                        `┃✧│ ${message.prefix}${i.pattern.toString().match(/(\W*)([A-Za-zğüşıiöç1234567890 ]*)/)[2]} \n`
                };
            }

            menu += tms;
            menu += `╰────────────────`

            message.sendMessage(styletext(menu, parseInt(
                `${FONT_STYLE}`)));

        });

        //-------------------------------------------------------------------------------------------------------------------
        //-------------------------------------------------------------------------------------------------------------------
        //-------------------------------------------------------------------------------------------------------------------

        command({
            pattern: "muser"
            , fromMe: isPrivate
            , desc: "Show All user"
            , dontAddCommandList: true
        , }, async (message, match, m) => {

            let menu = `╭────────────────╮
         ${BOT_NAME}
╰────────────────╯
╭────────────────
`

            let {
                prefix
            } = message;
            let [date, time] = new Date()
                .toLocaleString("en-IN", {
                    timeZone: "Asia/Kolkata"
                })
                .split(",");

            var ownmsg = "";
            for (let i of events.commands) {
                if (i.type === 'user') {
                    ownmsg +=
                        `┃✧│ ${message.prefix}${i.pattern.toString().match(/(\W*)([A-Za-zğüşıiöç1234567890 ]*)/)[2]} \n`
                };
            }

            menu += ownmsg;
            menu += `╰────────────────`

            message.sendMessage(styletext(menu, parseInt(
                `${FONT_STYLE}`)));

        });

        //-------------------------------------------------------------------------------------------------------------------
        //-------------------------------------------------------------------------------------------------------------------
        //-------------------------------------------------------------------------------------------------------------------

        command({
            pattern: "medit"
            , fromMe: isPrivate
            , desc: "Show All edit"
            , dontAddCommandList: true
        , }, async (message, match, m) => {

            let menu = `╭────────────────╮
         ${BOT_NAME}
╰────────────────╯
╭────────────────
`

            let {
                prefix
            } = message;
            let [date, time] = new Date()
                .toLocaleString("en-IN", {
                    timeZone: "Asia/Kolkata"
                })
                .split(",");

            var edmsg = "";
            for (let i of events.commands) {
                if (i.type === 'edit') {
                    edmsg +=
                        `┃✧│ ${message.prefix}${i.pattern.toString().match(/(\W*)([A-Za-zğüşıiöç1234567890 ]*)/)[2]} \n`
                };
            }

            menu += edmsg;
            menu += `╰────────────────`

            message.sendMessage(styletext(menu, parseInt(
                `${FONT_STYLE}`)));

        });

        //-------------------------------------------------------------------------------------------------------------------
        //-------------------------------------------------------------------------------------------------------------------
        //-------------------------------------------------------------------------------------------------------------------

        command({
            pattern: "mtool"
            , fromMe: isPrivate
            , desc: "Show All tool"
            , dontAddCommandList: true
        , }, async (message, match, m) => {

            let menu = `╭────────────────╮
         ${BOT_NAME}
╰────────────────╯
╭────────────────
`

            let {
                prefix
            } = message;
            let [date, time] = new Date()
                .toLocaleString("en-IN", {
                    timeZone: "Asia/Kolkata"
                })
                .split(",");

            var utilmsg = "";
            for (let i of events.commands) {
                if (i.type === 'tool') {
                    utilmsg +=
                        `┃✧│ ${message.prefix}${i.pattern.toString().match(/(\W*)([A-Za-zğüşıiöç1234567890 ]*)/)[2]} \n`
                };
            }

            menu += utilmsg;
            menu += `╰────────────────`

            message.sendMessage(styletext(menu, parseInt(
                `${FONT_STYLE}`)));

        });

        //-------------------------------------------------------------------------------------------------------------------
        //-------------------------------------------------------------------------------------------------------------------
        //-------------------------------------------------------------------------------------------------------------------

        command({
            pattern: "mxediazi"
            , fromMe: isPrivate
            , desc: "Show All x-ediazi"
            , dontAddCommandList: true
        , }, async (message, match, m) => {

            let menu = `╭────────────────╮
         ${BOT_NAME}
╰────────────────╯
╭────────────────
`

            let {
                prefix
            } = message;
            let [date, time] = new Date()
                .toLocaleString("en-IN", {
                    timeZone: "Asia/Kolkata"
                })
                .split(",");

            var xmediazi = "";
            for (let i of events.commands) {
                if (i.type === 'xediazi') {
                    xmediazi +=
                        `┃✧│ ${message.prefix}${i.pattern.toString().match(/(\W*)([A-Za-zğüşıiöç1234567890 ]*)/)[2]} \n`
                };
            }

            menu += xmediazi;
            menu += `╰────────────────`

            message.sendMessage(styletext(menu, parseInt(
                `${FONT_STYLE}`)));

        });

        command({
            pattern: "allmenu"
            , fromMe: isPrivate
            , desc: "Show All commands"
            , dontAddCommandList: true
            , type: "theme",

        }, async (message, match, m) => {
            if (match) {
                for (let i of events.commands) {
                    if (i.pattern.test(message.prefix + match))
                        message.treply(`
╭════〘 *Command Info* 〙════⊷❍
┃✧╭─────────────────
┃ \`\`\`Command : ${message.prefix}${match.trim()}\`\`\`
┃ \`\`\`Description : ${i.desc}\`\`\`
┃✧╰─────────────────
╰══════════════════⊷❍`);
                }
            }
            if (!match) {
                let {
                    prefix
                } = message;
                if (HANDLERS === "^")
                    var presix = ''
                else
                    var presix = prefix

                let [date, time] = new Date()
                    .toLocaleString("en-IN", {
                        timeZone: "Asia/Kolkata"
                    })
                    .split(",");

                var gmsg = ""
                    , ownmsg = ""
                    , dlmsg = ""
                    , utilmsg = ""
                    , srmsg = ""
                    , tms = ""
                    , lms = ""
                    , edmsg = ""
                    , xmediazi = "";
                for (let i of events.commands) {
                    if (i.type === 'group') {
                        gmsg +=
                            `┃✧│ ${message.prefix}${i.pattern.toString().match(/(\W*)([A-Za-zğüşıiöç1234567890 ]*)/)[2]} \n`
                    };
                    if (i.type === 'downloader') {
                        dlmsg +=
                            `┃✧│ ${message.prefix}${i.pattern.toString().match(/(\W*)([A-Za-zğüşıiöç1234567890 ]*)/)[2]} \n`
                    };
                    if (i.type === 'textmaker') {
                        tms +=
                            `┃✧│ ${message.prefix}${i.pattern.toString().match(/(\W*)([A-Za-zğüşıiöç1234567890 ]*)/)[2]} \n`
                    };
                    if (i.type === 'user') {
                        ownmsg +=
                            `┃✧│ ${message.prefix}${i.pattern.toString().match(/(\W*)([A-Za-zğüşıiöç1234567890 ]*)/)[2]} \n`
                    };
                    if (i.type === 'edit') {
                        edmsg +=
                            `┃✧│ ${message.prefix}${i.pattern.toString().match(/(\W*)([A-Za-zğüşıiöç1234567890 ]*)/)[2]} \n`
                    };
                    if (i.type === 'xediazi') {
                        xmediazi +=
                            `┃✧│ ${message.prefix}${i.pattern.toString().match(/(\W*)([A-Za-zğüşıiöç1234567890 ]*)/)[2]} \n`
                    };
                    if (i.type === 'search') {
                        srmsg +=
                            `┃✧│ ${message.prefix}${i.pattern.toString().match(/(\W*)([A-Za-zğüşıiöç1234567890 ]*)/)[2]} \n`
                    };
                    if (i.type === 'tool') {
                        utilmsg +=
                            `┃✧│ ${message.prefix}${i.pattern.toString().match(/(\W*)([A-Za-zğüşıiöç1234567890 ]*)/)[2]} \n`
                    };
                }
                var menu = `
╭═══ ${BOT_NAME} ═══⊷❍
┃✧╭──────────────
┃✧│ prefix :
┃✧│ Owner : ${OWNER_NAME}
┃✧│ User : ${message.pushName}
┃✧│ Mode : ${WORK_TYPE}
┃✧│ Server : ${HEROKU_APP_NAME}
┃✧│ Total RAM: ${avbMem.toFixed(2)} GB
┃✧│ Commands: ${events.commands.length}
┃✧│ Version: ${require("../package.json").version}
┃✧╰───────────────
╰═════════════════⊷
╭════ Group ════⊷❍
┃✧╭─────────────────
┃✧│ 
${gmsg}
┃✧╰─────────────────
╰══════════════════⊷❍
╭════〘 Download 〙════⊷❍
┃✧╭─────────────────
┃✧│ 
${dlmsg}
┃✧╰─────────────────
╰══════════════════⊷❍
╭════〘 Tools 〙════⊷❍
┃✧╭─────────────────
┃✧│ 
${utilmsg}
┃✧╰─────────────────
╰══════════════════⊷❍
╭════〘 Logo Maker 〙════⊷❍
┃✧╭─────────────────
┃✧│ 
┃✧│ logo
${tms}
┃✧╰─────────────────
╰══════════════════⊷❍
╭════〘 Owner 〙════⊷❍
┃✧╭─────────────────
┃✧│ 
${ownmsg}
┃✧╰─────────────────
╰══════════════════⊷❍
╭════〘 Edit 〙════⊷❍
┃✧╭─────────────────
┃✧│ 
${edmsg}
┃✧╰─────────────────
╰══════════════════⊷❍
╭════〘 X-Media 〙════⊷❍
┃✧╭─────────────────
┃✧│ 
${xmediazi}
┃✧╰─────────────────
╰══════════════════⊷❍
╭════〘 Search 〙════⊷❍
┃✧╭─────────────────
┃✧│ 
${srmsg}
┃✧╰─────────────────
╰══════════════════⊷❍

`
                // return await message.sendImageTemplate(await skbuffer(SUDO.split(";")[3]),FancyRandom(menu),"All rights reserved "+SUDO.split(";")[0],buttons);

                return await message.client.sendMessage(message.jid,
                {
                     text: styletext(menu, parseInt(
                        `${FONT_STYLE}`))
                    , footer: tiny(
                        `Alfa-Alien-Alfa ${WORK_TYPE} Bot\nVersion : ${require("../package.json").version}`
                    )
                    , buttons: [
                        {
                            buttonId: `${presix}ping`
                            , buttonText: {
                                displayText: serif_B(
                                    "PING")
                            }
      , }
                        , {
                            buttonId: `${presix}list`
                            , buttonText: {
                                displayText: serif_B(
                                    "LIST")
                            }
      , }
    , ]
                , });

            }

        });

        //|⬡════════════════════════════════════════════|❝ Ⓒ𝙰𝙻𝙸𝙴𝙽 𝙰𝙻𝙵𝙰 𝙱𝙾𝚃 𝙱𝚈 𝚃𝙾𝚇𝙸𝙲 𝙰𝙻𝙸𝙴𝙽™ ❞|═══════════════════════════════════════════⬡|

        command({
            pattern: "list"
            , fromMe: isPrivate
            , desc: "Show All commands"
            , dontAddCommandList: true
        , }, async (message, match, m) => {

            let menus = `---------------------------------
\n`
            let menu = `╭────────────────╮
         ${BOT_NAME}
╰────────────────╯
╭────────────────
`
            let cmnd = [];
            let cmd, desc;
            events.commands.map((command, num) => {

                if (command.pattern) {
                    cmd = command.pattern
                        .toString()
                        .match(
                            /(\W*)([A-Za-züşiğ öç1234567890]*)/
                            )[2];
                }
                if (command.desc) {
                    desc = command.desc
                } else {
                    desc = ''
                }
                if (!command.dontAddCommandList && cmd !==
                    undefined) {
                    cmnd.push({
                        cmd
                        , desc
                    });
                }
            });
            cmnd.sort();
            cmnd.forEach(({
                cmd
                , desc
            }, num) => {
                menu += `│ ${(num += 1)} ${cmd}\n│ ───\n`;
            });
            menu += `╰────────────────`

            message.sendMessage(styletext(menu, parseInt(
                `${FONT_STYLE}`)));

        });
    }

} // if alfa

if (THEME === "xasena") {
    if (INTERNAL_MENU === 'active') {

        command({
                pattern: "menu"
                , fromMe: isPrivate
                , desc: "Show All commands"
                , dontAddCommandList: true
                , type: "theme",

            }
            , async (message, match, m) => {

                if (match) {
                    for (let i of events.commands) {
                        if (i.pattern.test(message.prefix + match))
                            message.treply(
                                `\`\`\`Command : ${message.prefix}${match.trim()}
  Description : ${i.desc}\`\`\``
                            );
                    }
                }
                if (!match) {
                    let {
                        prefix
                    } = message;
                    let [date, time] = new Date()
                        .toLocaleString("en-IN", {
                            timeZone: "Asia/Kolkata"
                        })
                        .split(",");
                    let menu = `╭━━━━━ᆫ ${BOT_NAME} ᄀ━━━
  ┃ ⎆  *OWNER* :  ${OWNER_NAME}
  ┃ ⎆  *PREFIX* : ${global.prefix}
  ┃ ⎆  *HOST NAME* :${hostname().split("-")[0]}
  ┃ ⎆  *DATE* : ${date}
  ┃ ⎆  *TIME* : ${time}
  ┃ ⎆  *COMMANDS* : ${events.commands.length} 
  ┃ ⎆  *UPTIME* : ${clockString(uptime())} 
  ╰━━━━━━━━━━━━━━━
  ╭╼╾╼╾╼╾╼╾╼╾╼╾╼╾╼\n╽`;
                    let cmnd = [];
                    let cmd;
                    let category = [];
                    events.commands.map((command, num) => {
                        if (command.pattern) {
                            cmd = command.pattern
                                .toString()
                                .match(
                                    /(\W*)([A-Za-züşiğ öç1234567890]*)/
                                    )[2];
                        }

                        if (!command.dontAddCommandList &&
                            cmd !== undefined) {
                            let type;
                            if (!command.type) {
                                type = "misc";
                            } else {
                                type = command.type
                                .toLowerCase();
                            }

                            cmnd.push({
                                cmd
                                , type: type
                            });

                            if (!category.includes(type))
                                category.push(type);
                        }
                    });
                    cmnd.sort();
                    category.sort().forEach((cmmd) => {
                        menu += `
  ┃╭─────────────◆
  ┃  │ ⦿---- ${cmmd} ----⦿
  ┃  ╰┬────────────◆
  ┃  ┌┤`
                        let comad = cmnd.filter(({
                            type
                        }) => type == cmmd);
                        comad.forEach(({
                            cmd
                        }, num) => {
                            menu +=
                                `\n┃  │ ⛥  ${cmd.trim()}`;
                        });
                        menu += `\n┃  ╰─────────────◆`;
                    });

                    menu += ` ╰━━━━━━━━━━━──⊷\n`
                    menu +=
                        `_🔖Send ${global.prefix}menu <command name> to get detailed information of specific command._\n*📍Eg:* _${global.prefix}menu plugin_`;
                    return await message.client.sendMessage(message.jid,
                    {
                        image: {
                            url: `https://wallpapercave.com/wp/wp3891779.jpg`
                        }
                        , caption: menu
                        , footer: tiny(
                            `Alien-Alfa Public Bot\nVersion : ${require("../package.json").version}`
                        )
                        , buttons: [
                            {
                                buttonId: `${global.prefix}ping`
                                , buttonText: {
                                    displayText: serif_B(
                                        "PING 🎈")
                                }
            , }
                            , {
                                buttonId: `${global.prefix}list`
                                , buttonText: {
                                    displayText: serif_B(
                                        "LIST 🎈 ")
                                }
            , }
          , ]
                    , });
                }
            }
        );

        //|⬡════════════════════════════════════════════|❝ Ⓒ𝙰𝙻𝙸𝙴𝙽 𝙰𝙻𝙵𝙰 𝙱𝙾𝚃 𝙱𝚈 𝚃𝙾𝚇𝙸𝙲 𝙰𝙻𝙸𝙴𝙽™ ❞|═══════════════════════════════════════════⬡|

        command({
                pattern: "list"
                , fromMe: isPrivate
                , desc: "Show All commands"
                , dontAddCommandList: true
            , }
            , async (message, match, m) => {

                let menu =
                    `╭───〔 ${tiny(BOT_NAME+" command list")} 〕────\n`;

                let cmnd = [];
                let cmd, desc;
                events.commands.map((command) => {
                    if (command.pattern) {
                        cmd = command.pattern
                            .toString()
                            .match(
                                /(\W*)([A-Za-züşiğ öç1234567890]*)/
                                )[2];
                    }
                    if (command.desc) {
                        desc = command.desc;
                    } else {
                        desc = false;
                    }
                    if (!command.dontAddCommandList && cmd !==
                        undefined) {
                        cmnd.push({
                            cmd
                            , desc
                        });
                    }
                });
                cmnd.sort();
                cmnd.forEach(({
                    cmd
                    , desc
                }, num) => {
                    menu +=
                        `├ ${(num += 1)} *${tiny(cmd.trim())}*\n`;
                    if (desc) menu +=
                        `├ ${tiny("use : " + desc)}\n`;
                });
                menu += `╰──────────────────────────`;
                return await message.treply(menu);

            }
        );
    }

    command({
            pattern: "ping"
            , fromMe: isPrivate
            , desc: "To check ping"
            , type: "user"
        , }
        , async (message, match, m) => {
            const start = new Date().getTime();
            await message.sendMessage("```Pong!```");
            const end = new Date().getTime();
            return await message.sendMessage("```" + (end - start) +
                "ms```"
            );
        }
    );

} // if asena

if (THEME === "normal") {

    var gmsg = ""
        , ownmsg = ""
        , dlmsg = ""
        , utilmsg = ""
        , srmsg = ""
        , tms = ""
        , lms = ""
        , edmsg = ""
        , xmediazi = "";

    command({
            pattern: "list"
            , fromMe: isPrivate
            , desc: "Show All commands"
            , dontAddCommandList: true
            , type: "theme",

        }
        , async (message, match, m) => {
            let {
                preefix
            } = message;

            if (HANDLERS === "^")
                var presix = ''
            else
                var presix = prefix
            if (match) {

                for (let i of events.commands) {
                    if (i.pattern.test(message.preefix + match))
                        message.treply(`
  ╭════〘 *Command Info* 〙════⊷❍
  ┃✧╭─────────────────
  ┃ \`\`\`Command : ${message.prefix}${match.trim()}\`\`\`
  ┃ \`\`\`Description : ${i.desc}\`\`\`
  ┃✧╰─────────────────
  ╰══════════════════⊷❍`);
                }
            }
            if (!match) {

                let [date, time] = new Date()
                    .toLocaleString("en-IN", {
                        timeZone: "Asia/Kolkata"
                    })
                    .split(",");

                for (let i of events.commands) {
                    if (i.type === 'group') {
                        gmsg +=
                            `┃✧│ ${message.prefix}${i.pattern.toString().match(/(\W*)([A-Za-zğüşıiöç1234567890 ]*)/)[2]} \n`
                    };
                    if (i.type === 'downloader') {
                        dlmsg +=
                            `┃✧│ ${message.prefix}${i.pattern.toString().match(/(\W*)([A-Za-zğüşıiöç1234567890 ]*)/)[2]} \n`
                    };
                    if (i.type === 'textmaker') {
                        tms +=
                            `┃✧│ ${message.prefix}${i.pattern.toString().match(/(\W*)([A-Za-zğüşıiöç1234567890 ]*)/)[2]} \n`
                    };
                    if (i.type === 'user') {
                        ownmsg +=
                            `┃✧│ ${message.prefix}${i.pattern.toString().match(/(\W*)([A-Za-zğüşıiöç1234567890 ]*)/)[2]} \n`
                    };
                    if (i.type === 'edit') {
                        edmsg +=
                            `┃✧│ ${message.prefix}${i.pattern.toString().match(/(\W*)([A-Za-zğüşıiöç1234567890 ]*)/)[2]} \n`
                    };
                    if (i.type === 'xediazi') {
                        xmediazi +=
                            `┃✧│ ${message.prefix}${i.pattern.toString().match(/(\W*)([A-Za-zğüşıiöç1234567890 ]*)/)[2]} \n`
                    };
                    if (i.type === 'search') {
                        srmsg +=
                            `┃✧│ ${message.prefix}${i.pattern.toString().match(/(\W*)([A-Za-zğüşıiöç1234567890 ]*)/)[2]} \n`
                    };
                    if (i.type === 'tool') {
                        utilmsg +=
                            `┃✧│ ${message.prefix}${i.pattern.toString().match(/(\W*)([A-Za-zğüşıiöç1234567890 ]*)/)[2]} \n`
                    };
                }

                let men = `╭═══〘 ${BOT_NAME} 〙═══⊷❍
┃✧╭──────────────
┃✧│
┃✧│ Owner : ${OWNER_NAME}
┃✧│ User : ${message.pushName}
┃✧│ Mode : ${WORK_TYPE}
┃✧│ Total RAM: ${avbMem.toFixed(2)} GB
┃✧│ Available RAM: ${allFreeMem.toFixed(0)}GB / ${avbMem.toFixed(2)}GB
┃✧│ Commands: ${events.commands.length}
┃✧│ Uptime: ${clockString(uptime())}
┃✧│ Version: ${require("../package.json").version}
┃✧│
┃✧│
┃✧│  ▎▍▌▌▉▏▎▌▉▐▏▌▎
┃✧│  ▎▍▌▌▉▏▎▌▉▐▏▌▎
┃✧│   ${ await message.pushName}
┃✧│ 
┃✧╰───────────────
╰═════════════════⊷`

                const sections = [
                    {
                        title: styletext("These Are The list",
                            parseInt(`${FONT_STYLE}`))
                        , rows: [
                            {
                                title: styletext(`All Menu`,
                                    parseInt(
                                        `${FONT_STYLE}`))
                                , rowId: `${presix}allmenu`
                            }
                            , {
                                title: styletext(`Edit List`,
                                    parseInt(
                                        `${FONT_STYLE}`))
                                , rowId: `${presix}msearch`
                            }
                            , {
                                title: styletext(`Search List`,
                                    parseInt(
                                        `${FONT_STYLE}`))
                                , rowId: `${presix}allmenu`
                            }
                            , {
                                title: styletext(
                                    `Downloads List`,
                                    parseInt(
                                        `${FONT_STYLE}`))
                                , rowId: `${presix}mdownloader`
                            }
                            , {
                                title: styletext(`X-media List`,
                                    parseInt(
                                        `${FONT_STYLE}`))
                                , rowId: `${presix}mxediazi`
                            }
                            , {
                                title: styletext(`Tools List`,
                                    parseInt(
                                        `${FONT_STYLE}`))
                                , rowId: `${presix}mtool`
                            }
                            , {
                                title: styletext(`Owner List`,
                                    parseInt(
                                        `${FONT_STYLE}`))
                                , rowId: `${presix}muser`
                            }
                            , {
                                title: styletext(
                                    `Logomaker List`,
                                    parseInt(
                                        `${FONT_STYLE}`))
                                , rowId: `${presix}mtextmaker`
                            }
                            , {
                                title: styletext(`Group List`,
                                    parseInt(
                                        `${FONT_STYLE}`))
                                , rowId: `${presix}mgroup`
                            }
            , ]
              }
          , ]

                const listMessage = {
                    text: styletext(men, parseInt(`${FONT_STYLE}`))
                    , footer: "AlienAlfa"
                    , buttonText: styletext("Show menu", parseInt(
                        `${FONT_STYLE}`))
                    , sections
                }

                return await message.client.sendMessage(message.jid,
                    listMessage)

            }
        });

    command({
            pattern: "help"
            , fromMe: isPrivate
            , dontAddCommandList: true
        , }
        , async (message, match, m) => {

            let [date, time] = new Date()
                .toLocaleString("en-IN", {
                    timeZone: "Africa/Johannesburg"
                })
                .split(",");
            let menu = `
    ╭───────────㋰
    │╭──[ ${BOT_NAME} ]──㋰
    ││USER :  ${message.pushName}
    ││NUMBER :  ${m.sender.split("@")[0]}
    ││WORKTYPE : ${WORK_TYPE}
    │╰──㋰
    │
    │╭──[ "INFO BOT"]──㋰
    ││BOTNAME : ${BOT_NAME}
    ││TIME : ${time}
    ││DATE : ${date}
    ││OWNER : ${OWNER_NAME}
    ││PREFIX : ${HANDLERS}
    ││HOSTNAME : ${hostname().split("-")[0]}
    │╰──㋰
    ╰───────────㋰\n`

            let buttons = [
                {
                    buttonId: "ping"
                    , buttonText: {
                        displayText: tiny("SPEED")
                    }
      , }
                , {
                    buttonId: "list"
                    , buttonText: {
                        displayText: tiny("LIST")
                    }
      , }
    ]
            let contextInfo = {
                externalAdReply: {
                    title: "AMAROK-MD"
                    , body: "TREME-TITANS"
                    , mediaType: 2
                    , thumbnail: 'https://github.com/Alien-Alfa/Alien-alfa/blob/beta/MD-Images/done.jpg?raw=true'
                    , mediaUrl: 'https://amarok-deploy.vercel.app'
                    , sourceUrl: 'https://amarok-deploy.vercel.app'
                    , showAdAttribution: true
                }
            }

            const listMessage = {
                image: {
                    url: 'https://github.com/Alien-Alfa/Alien-alfa/blob/beta/MD-Images/done.jpg?raw=true'
                , }
                , caption: tiny(menu)
                , footer: "AlienAlfa"
                , buttons: buttons
                , contextInfo: contextInfo
            }

            return await message.client.sendMessage(message.jid,
                listMessage, {
                    quoted: message
                })
        })

}


