const { command, isPrivate } = require("../../lib");
const googleTTS = require('google-tts-api');
const logger = require("../../lib/logger");

const getLanguageFromText = (input) => {
  const value = typeof input === "string" ? input.trim() : "";
  const languageMatch = value.match(/^\{([a-z]{2,3}(?:[-_][a-z0-9]{2,8})*)\}\s*/i);
  if (!languageMatch) return { lang: "en", text: value };

  const lang = languageMatch[1]
    .replace(/_/g, "-")
    .split("-")
    .map((part, index) => index === 0
      ? part.toLowerCase()
      : /^[a-z]{2}$/i.test(part) ? part.toUpperCase() : part)
    .join("-");
  return { lang, text: value.slice(languageMatch[0].length).trim() };
};

//============================================================================================================================================
// STATUS SAVER ( MAKE fromMe: false TO USE AS PUBLIC )
command(
  {
    on: "text",
    fromMe: false,
    desc: "Save or Give Status Updates",
    dontAddCommandList: true,
    type: "Tool",
  },
  async (message, match, m) => {
    try {
      if (message.isGroup) return;
        if (typeof match !== "string") return;
      const triggerKeywords = ["save", "send", "sent", "snt", "give", "snd"];
        const cmdz = match.trim().toLowerCase().split(/\s+/)[0];
        if (triggerKeywords.includes(cmdz) && m?.quoted?.key?.id && m.quoted.message) {
        const relayOptions = { messageId: m.quoted.key.id };
        return await message.client.relayMessage(
          message.jid,
          m.quoted.message,
          relayOptions
        );
      }
    } catch (error) {
      logger.error("[Error]:", error);
    }
  }
);

command({
  pattern: "tts",
  fromMe: isPrivate,
  desc: "Text to Speech - Google TTS",
  type: "tool"
}, async (message, match) => {
  try {
    if (typeof match !== "string" || !match.trim()) {
      return await message.reply("_Waiting for a query_\n\nExample: tts Hello World\nFor other languages: tts {es} Hola Mundo or tts {pt-BR} Olá");
    }

    const { lang, text } = getLanguageFromText(match);
    if (!text) return await message.reply("_Add text after the language code._");

    const sendAudioMessage = async (text, lang) => {
      const url = await googleTTS.getAudioUrl(text, {
        lang: lang,
        slow: false,
        host: 'https://translate.google.com'
      });
      await message.client.sendMessage(message.jid, {
        audio: { url: url },
        mimetype: "audio/mpeg",
        ptt: true,
      });
    };

    const sendLongTextMessage = async (text, lang) => {
      await message.reply("_This is a very *long text*. I will *break it down* to smaller parts_");
      const urls = await googleTTS.getAllAudioUrls(text, {
        lang: lang,
        slow: false,
        host: 'https://translate.google.com'
      });
      let part = 1;
      for (const tex of urls) {
        await new Promise(resolve => setTimeout(resolve, 2000));
        await message.client.sendMessage(message.jid, {
          text: `*Part ${part++}*\n\n${tex.shortText}`
        });
        await message.client.sendMessage(message.jid, {
          audio: { url: tex.url },
          mimetype: "audio/mpeg",
          ptt: true,
        });
      }
      await message.client.sendMessage(message.jid, { text: "_Finished!_" });
    };

    if (text.length < 200) {
      await sendAudioMessage(text, lang);
    } else {
      await sendLongTextMessage(text, lang);
    }

  } catch (error) {
    logger.error("[Error]:", error);
    await message.reply(`_Error processing TTS request: ${error.message}_`);
  }
});

module.exports.getLanguageFromText = getLanguageFromText;

//============================================================================================================================================
  
// Made with ❤ by AlienAlfa
