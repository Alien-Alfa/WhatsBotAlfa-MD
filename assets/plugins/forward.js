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
    if(match.includes("ptt")){
      if(message.reply_message.audio){
        for (let i of jids) {
          try{
            const relayOptions = { ptt: true,  messageId: m.quoted.key.id };
             return await message.client.relayMessage(i, m.quoted.message, relayOptions);

            } catch (error) {
              console.error("[Error]:", error);
            }
        }   
      }
      else {return message.reply('This is not an audio') }
    }
    for (let i of jids) {
      try{
        const relayOptions = { messageId: m.quoted.key.id };
        return await message.client.relayMessage(i, m.quoted.message, relayOptions);
        } catch (error) {
          console.error("[Error]:", error);
        }
    }   
  }
);
