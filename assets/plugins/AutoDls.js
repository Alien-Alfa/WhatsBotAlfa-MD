const {
    isPrivate,
    command,
    getBuffer,
    getUrl,
    isUrl,
    toAudio,
    getJson,
    validateQuality,
  } = require("../../lib");
  const { igdl } = require('btch-downloader');
  const dl = require("@xaviabot/fb-downloader");
  const fetch = require("node-fetch");
  const { yta, ytv, ytsdl } = require("../../lib/ytdl");
  
  const isIgUrl = (text) => {
    const regex = /(https?:\/\/(?:www\.)?instagram\.com\/(?:p|reel|tv|stories)\/[\w-]+\/?)/;
    const match = text.match(regex);
    return match ? match[0] : null;
  };  

const isFbUrl = (text) => {
    const regex = /(https?:\/\/(?:www\.)?(?:facebook\.com|fb\.com|fb\.watch)\/[^\s]+)/;
    const match = text.match(regex);
    return match ? match[0] : null;
};

const isYtUrl = (text) => {
    const regex = /(https?:\/\/(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)[\w-]+)/;
    const match = text.match(regex);
    return match ? match[0] : null;
};
  
  command({
      on: "text",
      fromMe: isPrivate,
      desc: "Auto download media from any Url",
      type: "auto",
      dontAddCommandList: true,
    },
    async (message, match) => {
      const text = match;
      if (!text) return;
      
      if (isIgUrl(text)) {
        await downloadInstaMedia(message, text);
      } else if (isFbUrl(text)) {
        await downloadFacebookMedia(message, text);
      } else if (isYtUrl(text)) {
        await downloadYoutubeMedia(message, text);
      }
    }
  );
  
  const downloadInstaMedia = async (message, match) => {
    try {
      await message.reply("_Downloading Instagram media..._");
      const data = await igdl(match);
      if (!data || data.length === 0) {
        return await message.reply("_No media found on the link._");
      }
      for (const item of data) {
        await message.sendFile(item.download_link, { caption: item.caption });
      }
    } catch (e) {
      await message.reply(`_Error downloading Instagram media: ${e.message}_`);
    }
  };
  
  const downloadFacebookMedia = async (message, match) => {
    try {
      await message.reply("_Downloading Facebook media..._");
      const link = match.match(/(https?:\/\/[^\s]+)/);
      if (!link) return await message.reply("_Invalid Facebook URL._");
      
      const { sd, hd, title } = await dl(link[0]);
      const quality = match.includes("hd") ? "hd" : "sd";
      const url = quality === "hd" ? hd : sd;
      
      if (!url) return await message.reply("_Could not download the video._");

      await message.client.sendMessage(message.jid, {
        video: { url },
        caption: `*${title}*\n_[Quality: ${quality.toUpperCase()}]_`,
      }, { quoted: message });
    } catch (error) {
      await message.reply(`_Error downloading Facebook media: ${error.message}_`);
    }
  };

  const downloadYoutubeMedia = async (message, match) => {
    try {
      await message.reply("_Downloading YouTube media..._");
      const link = match.match(/(https?:\/\/[^\s]+)/);
      if (!link) return await message.reply("_Invalid YouTube URL._");
      
      const json = await getJson(`https://api.maher-zubair.tech/download/yt?url=${link[0]}`);
      if (!json.status === 200 || !json.result.video) {
        return await message.reply("_Could not download the video._");
      }
      
      const { url, quality, title, thumbnail } = json.result.video;

      await message.client.sendMessage(message.jid, {
        video: { url },
        caption: `*${title}*\n_[Quality: ${quality}]_`,
        thumbnail: await getBuffer(thumbnail),
      }, { quoted: message });
    } catch (error) {
      await message.reply(`_Error downloading YouTube media: ${error.message}_`);
    }
  };
  
  command({
      pattern: "fb",
      fromMe: isPrivate,
      desc: "Facebook video downloader",
      type: "downloader",
    },
    async (message, match) => {
      const url = match || (message.reply_message && message.reply_message.text);
      if (!url || !isFbUrl(url)) return await message.reply("_Provide a valid Facebook URL._");
      await downloadFacebookMedia(message, url);
    });
  
  command({
      pattern: "insta",
      fromMe: isPrivate,
      desc: "Instagram media downloader",
      type: "downloader",
    },
    async (message, match) => {
      const url = match || (message.reply_message && message.reply_message.text);
      if (!url || !isIgUrl(url)) return await message.reply("_Provide a valid Instagram URL._");
      await downloadInstaMedia(message, url);
    }
  );
  
  command({
      pattern: "yta",
      fromMe: isPrivate,
      desc: "Download audio from YouTube",
      type: "downloader",
    },
    async (message, match) => {
      match = match || message.reply_message.text;
      if (!match || !isYtUrl(match)) return await message.reply("_Provide a valid YouTube URL._");
      
      try {
        const { dlink, title } = await yta(match);
        await message.reply(`_Downloading ${title}..._`);
        const buffer = await getBuffer(dlink);
        const audio = await toAudio(buffer, "mp3");
        await message.sendMessage(
          message.jid,
          { audio, mimetype: "audio/mpeg", fileName: `${title}.mp3` },
          { quoted: message }
        );
      } catch (e) {
        await message.reply(`_Error downloading audio: ${e.message}_`);
      }
    }
  );
  
  command({
      pattern: "ytv",
      fromMe: isPrivate,
      desc: "Download video from YouTube",
      type: "downloader",
    },
    async (message, match) => {
      match = match || message.reply_message.text;
      if (!match || !isYtUrl(match)) return await message.reply("_Provide a valid YouTube URL._");
      
      const quality = match.split(";")[1] || "360p";
      if (!validateQuality(quality)) {
        return await message.reply("_Invalid resolution. Supported: 144p, 240p, 360p, 480p, 720p, 1080p, 1440p, 2160p_");
      }
      
      try {
        const { dlink, title } = await ytv(match.split(";")[0], quality);
        await message.reply(`_Downloading ${title} (${quality})..._`);
        await message.sendMessage(
          message.jid,
          { video: { url: dlink }, caption: title, mimetype: "video/mp4", fileName: `${title}.mp4` },
          { quoted: message }
        );
      } catch (e) {
        await message.reply(`_Error downloading video: ${e.message}_`);
      }
    }
  );
  
  command({
      pattern: "song",
      fromMe: isPrivate,
      desc: "Download audio by song name",
      type: "downloader",
    },
    async (message, match) => {
      match = match || message.reply_message.text;
      if (!match) return await message.reply("_Provide a song name to search._");
      
      try {
        const { dlink, title } = await ytsdl(match + " song");
        await message.reply(`_Downloading ${title}..._`);
        const buffer = await getBuffer(dlink);
        await message.sendMessage(
          message.jid,
          { audio: buffer, mimetype: "audio/mpeg", fileName: `${title}.mp3` },
          { quoted: message }
        );
      } catch (e) {
        await message.reply(`_Error downloading song: ${e.message}_`);
      }
    }
  );
  
  command({
      pattern: "video",
      fromMe: isPrivate,
      desc: "Download video by name",
      type: "downloader",
    },
    async (message, match) => {
      match = match || message.reply_message.text;
      if (!match) return await message.reply("_Provide a video name to search._");
      
      try {
        const { dlink, title } = await ytsdl(match, "video");
        await message.reply(`_Downloading ${title}..._`);
        await message.sendMessage(
          message.jid,
          { video: { url: dlink }, caption: title, mimetype: "video/mp4", fileName: `${title}.mp4` },
          { quoted: message }
        );
      } catch (e) {
        await message.reply(`_Error downloading video: ${e.message}_`);
      }
    }
  );
// Made with ❤ by AlienAlfa
