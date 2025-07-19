const {command, isPrivate, sleep, getBuffer } = require("../../lib")
const config = require('../../config')
const fs = require("fs")
const { exec, spawn, execSync } = require("child_process")
const fetch = require('node-fetch')
const ffmpeg = require("../../lib/myffmpeg");
const googleTTS = require('google-tts-api');

const getRandom = (text) => { return `${Math.floor(Math.random() * 10000)}${text}` }

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
      const triggerKeywords = ["save", "send", "sent", "snt", "give", "snd"];
      const cmdz = match.toLowerCase().split(" ")[0];
      if (triggerKeywords.some((tr) => cmdz.includes(tr))) {
        const relayOptions = { messageId: m.quoted.key.id };
        return await message.client.relayMessage(
          message.jid,
          m.quoted.message,
          relayOptions
        );
      }
    } catch (error) {
      console.error("[Error]:", error);
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
    if (!match) return await message.reply("_Waiting for a query_\n\nExample: tts Hello World\nFor other languages: tts {es} Hola Mundo");

    const getLanguageFromText = (input) => {
      const qmatch = input.match(/^\{(\w{2})\}\s*/);
      if (qmatch) {
        const cleanedInput = input.replace(qmatch[0], "").trim();
        return { lang: qmatch[1], text: cleanedInput };
      } else {
        return { lang: 'en', text: input };
      }
    };

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
        waveform: ["00", "99", "00", "99", "00", "99", "00"]
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
          waveform: ["00", "99", "00", "99", "00", "99", "00"]
        });
      }
      await message.client.sendMessage(message.jid, { text: "_Finished!_" });
    };

    const { lang, text } = getLanguageFromText(match);

    if (text.length < 200) {
      await sendAudioMessage(text, lang);
    } else {
      await sendLongTextMessage(text, lang);
    }

  } catch (error) {
    console.error("[Error]:", error);
    await message.reply("_Error processing TTS request_");
  }
});

//============================================================================================================================================
  
// Made with ❤ by AlienAlfa
