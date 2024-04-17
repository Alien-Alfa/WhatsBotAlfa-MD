const { getConfig, setConfig, modifyConfig} = require("../database/settings.js");
const { command, isPrivate, tiny, prefix } = require("../lib");
const Lang = {
  FILTER_DESC:
    "It adds a filter. If someone writes your filter, it send the answer. If you just write .filter, it show's your filter list.",
  NO_FILTER: "*❌ There are no filters in this chat!*",
  FILTERS: tiny("your filters for this chat"),
  NEED_REPLY: "*❌ Please type in reply!*\n*Example:*",
  FILTERED: "*✅ Successfully set* ```{}``` *to filter!*",
  STOP_DESC: "Stops the filter you added previously.",
  NEED_FILTER: "*❌ Please type a filter!*\n*Example:*",
  ALREADY_NO_FILTER: "*❌ There is already no filter like this!*",
  DELETED: "*✅ The filter was successfully deleted!*",
};



command(
  {
    pattern: "setsudo ?(.*)",
    fromMe: true,  
    desc: "Set Sudo User",
    type: "user",
  },
  async (message, match) => {
    try{
    let newSUDO;
    if (message.isGroup) {
      let jid = message.mention[0] || message.reply_message.jid;
      if (!jid) return await message.reply("_Reply to a person or mention_");
      newSUDO = jid.split("@")[0]
      //return await message.sendMessage(`_@${jid.split("@")[0]} is now a SUDO User_`, {mentions: [jid],});
    } else {
      newSUDO = message.jid.split("@")[0]
       //await message.reply("_You are now a SUDO User_");
    }

let SUser = await getConfig();
let SuUser;
if (Array.isArray(SUser)) {
  const sudoConfig = await SUser.find(config => config.config === "SUDO");
   SuUser = sudoConfig ? sudoConfig.value : null;
}
let newsud = SuUser+","+newSUDO+'"'

if(!SuUser.includes(newSUDO)){
let val = await modifyConfig("SUDO", await newsud.replace('",', ","))
console.log(val)
return await message.reply("_You are now a SUDO User_");
}
  }catch(err){console.log(err)}
}
);



command(
  {
    pattern: "settings ?(.*)",
    fromMe: true,  
    desc: Lang.FILTER_DESC,
    usage: ".filter keyword:message",
  },
  async (message, match) => {
      filtreler = await getConfig();
      if (filtreler === false) {
        await message.reply(Lang.NO_FILTER);
      } else {
        var mesaj = "*USER CONFIG*";
        filtreler.map(
          (config) => (mesaj += "\n\n> "+config.dataValues.config+":\n- `"+config.dataValues.value+"`\n")
        );
        await message.reply(mesaj);
      }
}
);
/*
command(
  {
    pattern: "settings ?(.*)",
    fromMe: true,  
    desc: Lang.FILTER_DESC,
    usage: ".filter keyword:message",
  },
  async (message, match) => {
    let text, msg;
    try {
      [text, msg] = match.split(":");
    } catch {}
    if (!match) {
      filtreler = await getConfig();
      if (filtreler === false) {
        await message.reply(Lang.NO_FILTER);
      } else {
        var mesaj = "*USER CONFIG*";
        filtreler.map(
          (config) => (mesaj += `${config.dataValues.config}:\n   ${config.dataValues.value}\n`)
        );
        await message.reply(mesaj);
      }
    } else if (!text || !msg){
      return await message.reply(
        "```use : .filter keyword:message\nto set a filter```"
      );}else{
        await setConfig(message.jid, text, msg, true);
    return await message.reply(`_Sucessfully set filter for ${text}_`);
      }}
);
*/
command(
  {
    pattern: "test21 ?(.*)",
    fromMe: true,  
    desc: "description",
    type: "type",
  },
  async (message, match) => {
    toggleFilter(message.jid);
  }
);

command(
  {
    pattern: "stop ?(.*)",
    fromMe: true,  
    desc: Lang.STOP_DESC,
    usage: '.stop "hello"',
  },
  async (message, match) => {
    if (!match) return await message.reply("\n*Example:* ```.stop hello```");

    del = await deleteConfig(message.jid, match);

    if (!del) {
      await message.reply(Lang.ALREADY_NO_FILTER);
    } else {
      await message.reply(`_Filter ${match} deleted_`);
    }
  }
);

command({ on: "text", fromMe: true,   }, async (message, match) => {
  var filtreler = await getConfig(message.jid);
  if (!filtreler) return;
  filtreler.map(async (filter) => {
    pattern = new RegExp(
      filter.dataValues.regex
        ? filter.dataValues.pattern
        : "\\b(" + filter.dataValues.pattern + ")\\b",
      "gm"
    );
    if (pattern.test(match)) {
      await message.reply(filter.dataValues.text, {
        quoted: message,
      });
    }
  });
});

command({
        pattern: "pdm",
        fromMe: true,  
        desc: "To check ping",
        type: "user",
    },
    async (message, match) => {
        if(match === "on"){
            let { key } = await message.reply("```Activating PDM```");


            setTimeout(async()=>{
                return await message.client.sendMessage(message.jid, { text: "PDM Activated", edit: key} );
              }, 1000)            }
        if(match === "off"){
            let { key } = await message.reply("```Deactivating PDM```");


            setTimeout(async()=>{
                return await message.client.sendMessage(message.jid, { text: "PDM Deactivated", edit: key} );
              }, 1000)    
        }
    }
);

