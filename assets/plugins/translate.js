const { command, isPrivate } = require("../../lib");
 
// Made with ❤ by AlienAlfa
const {
    translate
  } = require('@vitalets/google-translate-api');
  const defaultLang = 'en'
  
  command({
       pattern: "trt",
       fromMe: isPrivate,  
       desc: "Google Translate",
       dontAddCommandList: true,
       type: "tool",
  
    },
    async (message, match, m) => {
      try {
        if (!match && !m.quoted?.text) {
          return await message.reply("_Please provide text to translate or reply to a message_\n\nUsage: trt <lang> <text> or trt <text>");
        }

        let args = match ? match.split(" ") : [];
        let lang = args[0];
        let text = args.slice(1).join(" ");
        
        if (!lang || lang.length !== 2) {
          lang = defaultLang;
          text = match || "";
        }
        
        if (!text && m.quoted && m.quoted.text) {
          text = m.quoted.text;
        }
        
        if (!text) {
          return await message.reply("_No text found to translate_");
        }

        let result = await translate(text, {
          to: lang,
          autoCorrect: true
        }).catch(() => null);
        
        if (!result) {
          return await message.reply("_Translation failed. Please try again._");
        }

        return await message.sendMessage(message.jid, `*Translation (${lang}):*\n${result.text}`);

      } catch (error) {
        console.error("[Translate Error]:", error);
        await message.reply("_Error occurred during translation_");
      }
    })

// Made with ❤ by AlienAlfa