const {
  Function,
  command,
  qrcode,
  webp2mp4,
  isUrl,
  isPrivate,
  getJson,
  getUrl,
  isIgUrl,
  findMusic,
} = require("../lib/");
const { yta, ytIdRegex, ytv } = require("../lib/yotube");
const { search } = require("yt-search");
const { toAudio } = require("../lib/media");
let gis = require("g-i-s");
const { AddMp3Meta } = require("../lib");

const jimp = require("jimp");
const QRReader = require("qrcode-reader");
let { unlink } = require("fs/promises");
const got = require("got");
const FormData = require("form-data");
const stream = require("stream");
const { promisify } = require("util");
const pipeline = promisify(stream.pipeline);
const fs = require("fs");




Function(
  {
    pattern: "img",
    fromMe: isPrivate,
    desc: "Google Image search",
    type: "downloader",
  }, async (message, match, m) => {
    if (!match) return await message.sendMessage("Enter Search Term,number");
    let [query, amount] = match.split(",");
    let result = await gimage(query, amount);
    await message.sendMessage(
      `_Downloading ${amount || 5} images for ${query}_`
    );
    for (let i of result) {
      await message.sendFromUrl(i);
    }
  }
);

async function gimage(query, amount = 5) {
  let list = [];
  return new Promise((resolve, reject) => {
    gis(query, async (error, result) => {
      for (
        var i = 0;
        i < (result.length < amount ? result.length : amount);
        i++
      ) {
        list.push(result[i].url);
        resolve(list);
      }
    });
  });
}


command({
    pattern: "photo",
    fromMe: isPrivate,
    desc: "Changes sticker to Photo",
    type: "converter",
  },
  async (message, match, m) => {
    if (!message.reply_message)
      return await message.treply("_Reply to a sticker_");
    if (message.reply_message.mtype !== "stickerMessage")
      return await message.treply("_Not a sticker_");
    let buff = await m.quoted.download();
    return await message.sendMessage(buff, {}, "image");
  }
);



command({
    pattern: "mp4",
    fromMe: isPrivate,
    desc: "Changes sticker to Video",
    type: "converter",
  },
  async (message, match, m) => {
    if (!message.reply_message)
      return await message.treply("_Reply to a sticker_");
    if (message.reply_message.mtype !== "stickerMessage")
      return await message.treply("_Not a sticker_");
    let buff = await m.quoted.download();
    let buffer = await webp2mp4(buff);
    return await message.sendMessage(buffer, {}, "video");
  }
);



command({
    pattern: "song",
    fromMe: isPrivate,
    desc: "Downloads Song",
    type: "downloader",
  }, async (message, match, m) => {
    if (!(match || message.reply_message.text))
      return await message.treply("_Enter Song Name_");
    match = match || message.reply_message.text;
    if (ytIdRegex.test(match)) {
      search(match).then(async ({ videos }) => { let title = await videos[0].title 
        let urig = `https://ytdl.tiodevhost.my.id/?url=${videos[0].url}&filter=audioonly&quality=highestaudio&contenttype=audio/mpeg`

        let buff = await AddMp3Meta(urig, videos[0].thumbnail, {
          title,
        });
        message.sendMessage(
          buff,
          { mimetype: "audio/mpeg", quoted: message.data },
          "audio"
        );
      });
    }
    search(match + "song").then(async ({ videos }) => {
      await message.treply(`_Downloading ${videos[0].title}_`);
      search(match).then(async ({ videos }) => { let title = await videos[0].title 
        let urig = `https://ytdl.tiodevhost.my.id/?url=${videos[0].url}&filter=audioonly&quality=highestaudio&contenttype=audio/mpeg`

        let buff = await AddMp3Meta(urig, videos[0].thumbnail, {
          title,
          artist: [videos[0].author],
        });
        message.sendMessage(
          buff,
          { mimetype: "audio/mpeg", quoted: message.data },
          "audio"
        );
      });
    });
  }
);



command({
    pattern: "video",
    fromMe: isPrivate,
    desc: "Downloads video",
    type: "downloader",
  }, async (message, match, m) => {
    if (!match)
    if (!message.reply_message.text)
      return await message.treply("_Enter Video Name_");
    match = match || message.reply_message.text;
    if (ytIdRegex.test(match)) {
      search(match).then(async ({ videos }) => { let title = await videos[0].title 
        let urig = `https://ytdl.tiodevhost.my.id/?url=${videos[0].url}&filter=audioandvideo&quality=highestvideo&contenttype=video/mp4`

        message.sendFromUrl(urig, {
          caption :title,
           filename: title });
      });
    }
    search(match).then(async ({ videos }) => {
      await message.treply(`_Downloading ${videos[0].title}_`);
      search(match).then(async ({ videos }) => { let title = await videos[0].title 

        let urig = `https://ytdl.tiodevhost.my.id/?url=${videos[0].url}&filter=audioandvideo&quality=highestvideo&contenttype=video/mp4`
        message.sendFromUrl(urig, { filename: title,
          caption :title,
          quoted: message });
      });
    });
  }
);





command({
    pattern: "mp3",
    fromMe: isPrivate,
    desc: "converts video/voice to mp3",
    type: "downloader",
  },
  async (message, match, m) => {
    //if(message.reply_message.text) return await message.treply('_Enter Video Name_')
    let buff = await m.quoted.download();
    buff = await toAudio(buff, "mp3");
    return await message.sendMessage(buff, { mimetype: "audio/mpeg" }, "audio");
  }
);


command({
    pattern: "fetch",
    fromMe: isPrivate,
    desc: "Downloads from a direct link",
    type: "downloader",
  }, async (message, match, m) => {
    match = match || message.reply_message.text;
    if (!match)
      return message.treply(
        "_Send a direct media link_\n_*link;caption(optional)*_"
      );
    try {
      let url = match.split(";")[0];
      let options = {};
      options.caption = match.split(";")[1];

      if (isUrl(url)) {
        message.sendFromUrl(url, options);
      } else {
        message.treply("_Not a URL_");
      }
    } catch (e) {
      console.log(e);
      message.treply("_No content found_");
    }
  }
);


command({
    pattern: "yts",
    fromMe: isPrivate,
    desc: "Search Youtube",
    type: "search",
  }, async (message, match, m) => {
    if (!match) return await message.treply("_Enter a search term_");
    let rows = [];
    search(match).then(async ({ videos }) => {
      videos.forEach((result) => {
        rows.push({
          title: result.title,
          description: `\nDuration : ${result.duration.toString()}\nAuthor : ${
            result.author
          }\nPublished : ${result.ago}\nDescription : ${
            result.description
          }\nURL : ${result.url}`,
          rowId: `${prefix} ytv `,
        });
      });
      await message.client.sendMessage(message.jid, {
        text: "Youtube Search for " + match,
        buttonText: "View Results",
        sections: [
          {
            title: "Youtube Search",
            rows: rows,
          },
        ],
      });
    });
  }
);



command({
    pattern: "ytv",
    fromMe: isPrivate,
    dontAddCommandList: true,
  }, async (message, match, m) => {
    match = match || message.reply_message.text;
    if (!match) return await message.treply("_Enter a URL_");

    if (!ytIdRegex.test(match)) return await message.treply("_Invalid Url_");
    search(match).then(async ({ videos }) => { let title = await videos[0].title 
      await message.treply(`_Downloading ${title}_`);
      let urig = `https://ytdl.tiodevhost.my.id/?url=${videos[0].url}&filter=audioandvideo&quality=highestvideo&contenttype=video/mp4`

      return await message.sendFromUrl(urig, {
        filename: title,
        caption :title,
        quoted: message,
      });
    });
  }
);



command({
    pattern: "yta",
    fromMe: isPrivate,
    dontAddCommandList: true,
  }, async (message, match, m) => {
    match = match || message.reply_message.text;
    if (!match) return await message.treply("_Enter a URL_");
    if (!ytIdRegex.test(match)) return await message.treply("_Invalid Url_");
    search(match).then(async ({ videos }) => { let title = await videos[0].title 
      await message.treply(`_Downloading ${title}_`);
      let urig = `https://ytdl.tiodevhost.my.id/?url=${videos[0].url}&filter=audioonly&quality=highestaudio&contenttype=audio/mpeg`

      let buff = await AddMp3Meta(urig, videos[0].thumbnail, {
        title,
      });
      return await message.sendMessage(
        buff,
        { mimetype: "audio/mpeg", quoted: message.data },
        "audio"
      );
    });
  }
);






