const { command, parsedJid } = require("../../lib/");

command(
  {
    pattern: "fwd",
    fromMe: true,
    desc: "Forwards the replied Message",
    type: "Util",
  },
  async (message, match, m) => {
    if(!m.quoted) return message.reply('Reply to something') 
    let jids = parsedJid(match);
    for (let i of jids) {

      try{
        const relayOptions = { messageId: m.quoted.key.id };
          await message.client.relayMessage(i, m.quoted.message, relayOptions);
        } catch (error) {
          console.error("[Error]:", error);
        }



    }   
  }
);
