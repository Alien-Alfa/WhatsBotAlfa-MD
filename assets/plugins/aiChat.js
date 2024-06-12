const fs = require("fs");
const { command, isPrivate } = require("../../lib");
const gemini = require("../../lib/Gemini");
const config = require("../../config"); 
const { AiChat  } = require("../database");
command(
  {
    on: "text",
    fromMe: false,
    desc: "Ai chat",
  },
  async (message, match, m) => {
    if (match.split(" ")[0].toLowerCase() === "ai") return;
    if (config.GEMINI_API === false) return 
    const chatId = message.key.remoteJid;
    const AiCha = await AiChat.Ai.findOne({
        where: {
           chatId
        },
     });
    
     if (AiCha) {

    if (message.jid.includes('g.us')) {
        if (message.reply_message === false && message.mention === false) return;
        if (message.reply_message && (message.reply_message.jid.split('@')[0] != message.client.user.id.split(':')[0])) return;
        if (message.mention !== false && message.mention.length >= 1 && (message.mention[0].split('@')[0] != message.client.user.id.split(':')[0])) return;
    }
    if(message.participant.split('@')[0] === message.client.user.id.split(':')[0]) return;


        match = match || message.reply_message.text;
        const id = message.participant;

            if (message.reply_message && message.reply_message.video)
              return await message.reply("I can't generate text from video");
            if (
              message.reply_message &&
              (message.reply_message.image || message.reply_message.sticker)
            ) {
              const image = await m.quoted.download();
        
              fs.writeFileSync("image.jpg", image);
              const text = await gemini(match, image, false, {
                id,
              });
              return await message.reply(text);
            }
            match = message.reply_message
              ? message.reply_message.text + `\n\n${match || ""}`
              : match;
            const text = await gemini(match, null, false, { id });
            return await message.reply(text);
    
    
    
     }








  }
);




