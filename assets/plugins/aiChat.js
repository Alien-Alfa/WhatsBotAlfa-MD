const fs = require("fs");
const { command, isPrivate } = require("../../lib");
const gemini = require("../../lib/Gemini");
const config = require("../../config"); 
const { AiChat } = require("../database");
const logger = require("../../lib/logger");

command(
  {
    on: "text",
    fromMe: false,
    desc: "AI chat functionality",
    dontAddCommandList: true,
  },
  async (message, match, m) => {
    try {
      if (match.split(" ")[0].toLowerCase() === "ai") return;
      if (config.GEMINI_API === false) return;
      
      const chatId = message.key.remoteJid;
      const AiCha = await AiChat.Ai.findOne({
        where: {
          chatId
        },
      });
      
      if (!AiCha) return;

      // Group chat logic
      if (message.jid.includes('g.us')) {
        if (!message.reply_message && !message.mention) return;
        
        if (message.reply_message && 
            (message.reply_message.jid.split('@')[0] !== message.client.user.id.split(':')[0])) {
          return;
        }
        
        if (message.mention && message.mention.length >= 1 && 
            (message.mention[0].split('@')[0] !== message.client.user.id.split(':')[0])) {
          return;
        }
      }
      
      // Don't respond to self
      if (message.participant.split('@')[0] === message.client.user.id.split(':')[0]) return;

      match = match || message.reply_message?.text || "";
      const id = message.participant;

      // Handle video replies
      if (message.reply_message?.video) {
        return await message.reply("_I can't generate text from video_");
      }
      
      // Handle image/sticker replies
      if (message.reply_message && (message.reply_message.image || message.reply_message.sticker)) {
        const image = await m.quoted.download();
        if (!image) {
          return await message.reply("_Failed to download image_");
        }
        
        fs.writeFileSync("image.jpg", image);
        const text = await gemini(match, image, false, { id });
        
        // Clean up temp file
        if (fs.existsSync("image.jpg")) {
          fs.unlinkSync("image.jpg");
        }
        
        return await message.reply(text || "_Failed to process image_");
      }
      
      // Handle text messages
      const textInput = message.reply_message?.text 
        ? `${message.reply_message.text}\n\n${match || ""}`
        : match;
        
      if (!textInput.trim()) return;
      
      const response = await gemini(textInput, null, false, { id });
      return await message.reply(response || "_Failed to generate response_");
      
    } catch (error) {
      logger.error("[AI Chat Error]:", error);
      await message.reply("_An error occurred while processing your request_");
    }
  }
);

// Made with ❤ by AlienAlfa




