const {
    isPrivate,
    command,
    getBuffer,
    getUrl,
    igdl,
    isUrl,
    toAudio,
} = require("../../lib");
const dl = require("@xaviabot/fb-downloader");
const fetch = require("node-fetch");

    const isIgUrl = (url) => {
    return /(?:(?:http|https):\/\/)?(?:www\.)?(?:instagram.com|instagr.am|instagr.com)\/(\w+)/gim.test(url);
};
  
    const isFbUrl = (url) => {
    return /(?:(?:http|https):\/\/)?(?:www\.)?(?:facebook.com|fb.com|fb.watch)\/(?:\S+)?/gim.test(url);
};

    const isYtUrl = (url) => {
    return /(?:(?:http|https):\/\/)?(?:www\.)?(?:youtube.com|youtu.be)\/(?:\S+)?/gim.test(url);
};
  

command({
    on: "text",
    fromMe: isPrivate,
    desc: "Auto download media from any Url",
    type: "auto",
},
async (message) => {
    const text = message.text || message.reply_message.text;
    if (text && isIgUrl(text)) {
        await downloadInstaMedia(message, text);

    } else if (text && isFbUrl(text)) {
        await downloadFacebookMedia(message, message.reply_message.text);

    } else if (text && isYtUrl(text)) {
        //await downloadInstaMedia(message, message.reply_message.text);

    }
}
);

const downloadInstaMedia = async (message, match) => {
    match = match || message.reply_message.text;
    if (!match) return;

    const url = getUrl(match.trim())[0];
    if (!url) {
        return await message.client.sendMessage(message.jid, "Invalid Instagram link");
    }

    if (!isIgUrl(url)) {
        return await message.client.sendMessage(message.jid, "Invalid Instagram link");
    }

    try {
        const data = await igdl(url);
        if (data.length === 0) {
            return await message.client.sendMessage(message.jid, "No media found on the link");
        }

        for (const mediaUrl of data) {
            await message.sendFile(mediaUrl);
        }
    } catch (error) {
        await message.client.sendMessage(message.jid, "Error: " + error.message || error);
    }
};

const downloadFacebookMedia = async (message, match) => {
    match = match || message.reply_message.text;
    if (!match) return;

    try {
        if (!match.includes("facebook.com")) return;
        await message.reply("_Downloading..._");
        const regex = /(https?:\/\/[^\s]+)/;
        const link = match.match(regex);
        let {
            sd,
            hd,
            title
        } = await dl(link[0]);
        let img = await getBuffer("https://avatars.githubusercontent.com/u/64305844?v=4");
        if (match.split(";")[1] == "hd") {
            await message.client.sendMessage(message.jid, {
                video: {
                    url: hd
                },
                caption: "[Quality: HD]\n\n" + title,
                thumbnail: img
            }, {
                quoted: message
            });
        }


        let rs = await (await fetch(sd)).buffer();

        await message.client.sendMessage(message.jid, {
            video: rs,
            caption: "[Quality: SD]\n\n" + title,
            thumbnail: img
        }, {
            quoted: message
        });
    } catch (error) {
        await message.client.sendMessage(message.jid, "Error: " + error.message || error);
    }
};

command({
        pattern: "fb",
        fromMe: isPrivate,
        desc: "fb downloader"
    },
    async (message, match) => {
        await downloadFacebookMedia(message, message.reply_message.text);
    });

command({
        pattern: "insta",
        fromMe: isPrivate,
        desc: "To download Instagram media",
        type: "user",
    },
    async (message, match) => {
        await downloadInstaMedia(message, match);
    }
);





  
  command(
    {
      pattern: "yta",
      fromMe: isPrivate,
      desc: "Download audio from youtube",
    },
    async (message, match) => {
      match = match || message.reply_message.text;
      if (!match) return await message.reply("Give me a youtube link");
      if (!isUrl(match)) return await message.reply("Give me a youtube link");
      let { dlink, title } = await yta(match);
      await message.reply(`_Downloading ${title}_`);
      let buff = await getBuffer(dlink);
      buff = await toAudio(buff, "mp3");
      return await message.sendMessage(
        message.jid,
        buff,
        {
          mimetype: "audio/mp4",
          filename: title + ".mp3",
        },
        "audio"
      );
    }
  );
  
  command(
    {
      pattern: "ytv",
      fromMe: isPrivate,
      desc: "Download audio from youtube",
    },
    async (message, match) => {
      match = match || message.reply_message.text;
      if (!match) return await message.reply("Give me a youtube link");
      if (!isUrl(match)) return await message.reply("Give me a youtube link");
      let { dlink, title } = await ytv(match, "360p");
      await message.reply(`_Downloading ${title}_`);
      return await message.sendMessage(
        message.jid,
        dlink,
        {
          mimetype: "video/mp4",
          filename: title + ".mp4",
        },
        "video"
      );
    }
  );
  
  command(
    {
      pattern: "song",
      fromMe: isPrivate,
      desc: "Download audio from youtube",
    },
    async (message, match) => {
      match = match || message.reply_message.text;
      if (!match) return await message.reply("Give me a query");
      let { dlink, title } = await ytsdl(match+" song");
      await message.reply(`_Downloading ${title}_`);
      let buff = await getBuffer(dlink);
      //buff = await toAudio(buff, "mp3");
      return await message.sendMessage(
        message.jid,
        buff,
        {
          mimetype: "audio/mpeg",
          filename: title + ".mp3",
        },
        "audio"
      );
    }
  );
  
  command(
    {
      pattern: "vid",
      fromMe: isPrivate,
      desc: "Download video from youtube",
    },
    async (message, match) => {
      match = match || message.reply_message.text;
      if (!match) return await message.reply("Give me a query");
      let { dlink, title } = await ytsdl(match, "video");
      await message.reply(`_Downloading ${title}_`);
      return await message.sendMessage(
        message.jid,
        dlink,
        {
          mimetype: "video/mp4",
          filename: title + ".mp4",
        },
        "video"
      );
    }
  );
  