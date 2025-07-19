const config = require("../../config");
const { command, fromMe, isPrivate, toAudio } = require("../../lib/");
const { webp2mp4, textToImg } = require("../../lib/functions");

command(
  {
    pattern: "sticker",
    fromMe: isPrivate,
    desc: "Converts Photo/video/text to sticker",
    type: "converter",
  },
  async (message, match, m) => {
    try {
      if (!(message.reply_message?.video || message.reply_message?.image || message.reply_message?.text)) {
        return await message.reply("_Reply to photo/video/text to convert to sticker_");
      }

      if (message.reply_message.text) {
        const buff = await textToImg(message.reply_message.text);
        if (!buff) return await message.reply("_Error converting text to sticker_");
        
        return await message.sendMessage(
          message.jid,
          buff,
          { packname: config.PACKNAME, author: config.AUTHOR },
          "sticker"
        );
      }

      const buff = await m.quoted.download();
      if (!buff) return await message.reply("_Error downloading media_");
      
      return await message.sendMessage(
        message.jid,
        buff,
        { packname: config.PACKNAME, author: config.AUTHOR },
        "sticker"
      );
    } catch (error) {
      console.error("[Sticker Error]:", error);
      await message.reply("_Error creating sticker_");
    }
  }
);


command(
  {
    pattern: "take",
    fromMe: isPrivate,
    desc: "Converts Photo or video to sticker",
    type: "converter",
  },
  async (message, match, m) => {
    try {
      if (!message.reply_message?.sticker)
        return await message.reply("_Reply to a sticker_");
      
      let isme = await fromMe(message.participant);
      let packname, author;
      
      if (!isme) {
        packname = match?.split(":")[0] || "𝞓𝙇𝞘𝞢𝞜-𝞓𝙇𝙁𝞓";
        author = match?.split(":")[1] || message.pushName;
      } else {
        packname = match?.split(":")[0] || config.PACKNAME;
        author = match?.split(":")[1] || config.AUTHOR;
      }
      
      let buff = await m.quoted.download();
      if (!buff) return await message.reply("_Error downloading sticker_");
      
      return await message.sendMessage(message.jid, buff, { packname, author }, "sticker");
    } catch (error) {
      console.error("[Take Sticker Error]:", error);
      await message.reply("_Error processing sticker_");
    }
  }
);

command(
  {
    pattern: "photo",
    fromMe: isPrivate,
    desc: "Changes sticker to Photo",
    type: "converter",
  },
  async (message, match, m) => {
    try {
      if (!message.reply_message?.sticker)
        return await message.reply("_Reply to a sticker_");
      
      let buff = await m.quoted.download();
      if (!buff) return await message.reply("_Error downloading sticker_");
      
      return await message.sendMessage(message.jid, buff, {}, "image");
    } catch (error) {
      console.error("[Photo Convert Error]:", error);
      await message.reply("_Error converting sticker to photo_");
    }
  }
);

command(
  {
    pattern: "mp3",
    fromMe: isPrivate,
    desc: "converts video/voice to mp3",
    type: "downloader",
  },
  async (message, match, m) => {
    try {
      if (!message.reply_message?.video && !message.reply_message?.audio)
        return await message.reply("_Reply to a video or audio file_");
      
      let buff = await m.quoted.download();
      if (!buff) return await message.reply("_Error downloading media_");
      
      buff = await toAudio(buff, "mp3");
      if (!buff) return await message.reply("_Error converting to MP3_");
      
      return await message.sendMessage(
        message.jid,
        buff,
        { mimetype: "audio/mpeg" },
        "audio"
      );
    } catch (error) {
      console.error("[MP3 Convert Error]:", error);
      await message.reply("_Error converting to MP3_");
    }
  }
);

command(
  {
    pattern: "mp4",
    fromMe: isPrivate,
    desc: "converts video/voice to mp4",
    type: "downloader",
  },
  async (message, match, m) => {
    try {
      if (
        !message.reply_message?.video &&
        !message.reply_message?.sticker &&
        !message.reply_message?.audio
      )
        return await message.reply("_Reply to a sticker/audio/video_");
      
      let buff = await m.quoted.download();
      if (!buff) return await message.reply("_Error downloading media_");
      
      if (message.reply_message.sticker) {
        buff = await webp2mp4(buff);
      } else {
        buff = await toAudio(buff, "mp4");
      }
      
      if (!buff) return await message.reply("_Error converting to MP4_");
      
      return await message.sendMessage(
        message.jid,
        buff,
        { mimetype: "video/mp4" },
        "video"
      );
    } catch (error) {
      console.error("[MP4 Convert Error]:", error);
      await message.reply("_Error converting to MP4_");
    }
  }
);


command(
  {
    pattern: "img",
    fromMe: isPrivate,
    desc: "Converts Sticker to image",
    type: "converter",
  },
  async (message, match, m) => {
    try {
      if (!message.reply_message?.sticker)
        return await message.reply("_Reply to a sticker_");
      
      let buff = await m.quoted.download();
      if (!buff) return await message.reply("_Error downloading sticker_");
      
      return await message.sendMessage(message.jid, buff, {}, "image");
    } catch (error) {
      console.error("[Image Convert Error]:", error);
      await message.reply("_Error converting sticker to image_");
    }
  }
);

// Made with ❤ by AlienAlfa