const config = require("../database/settings");
const { command, isPrivate, getJson, sleep, tiny } = require("../lib/");
const { Image } = require("node-webpmux");
const fs = require("fs")
  const { AUTHOR, PACKNAME} = require("../database/settings");


command({
    pattern: "sticker",
    fromMe: isPrivate,
    desc: "_Converts Photo or video to sticker_",
    type: "tool",
  },
  async (message, match, m) => {
    if (!(message.reply_message.video || message.reply_message.image))
      return await message.treply("_Reply to photo or video_");
    let buff = await m.quoted.download();
    message.sendMessage(
      buff,
      { packname: PACKNAME, author: AUTHOR },
      "sticker"
    );
  }
);



command({
    pattern: "tgs",
    fromMe: isPrivate,
    desc: "Download Sticker From Telegram",
    type: "tool",
  }, async (message, match, m) => {
    if (!match)
      return message.treply(
        "_Enter a tg sticker url_\nEg: https://t.me/addstickers/Oldboyfinal\nKeep in mind that there is a chance of ban if used frequently"
      );
    let packid = match.split("/addstickers/")[1];
    let { result } = await getJson(
      `https://api.telegram.org/bot891038791:AAHWB1dQd-vi0IbH2NjKYUk-hqQ8rQuzPD4/getStickerSet?name=${encodeURIComponent(
        packid
      )}`
    );
    if (result.is_animated)
      return message.treply("_Animated stickers are not supported_");
    message.treply(
      `*Total stickers :* ${result.stickers.length}\n*Estimated complete in:* ${
        result.stickers.length * 1.5
      } seconds`.trim()
    );
    for (let sticker of result.stickers) {
      let file_path = await getJson(
        `https://api.telegram.org/bot891038791:AAHWB1dQd-vi0IbH2NjKYUk-hqQ8rQuzPD4/getFile?file_id=${sticker.file_id}`
      );
      await message.sendMessage(
        `https://api.telegram.org/file/bot891038791:AAHWB1dQd-vi0IbH2NjKYUk-hqQ8rQuzPD4/${file_path.result.file_path}`,
        { packname: PACKNAME, author: AUTHOR },
        "sticker"
      );
      sleep(1500);
    }
  }
);



command({
    pattern: "take",
    fromMe: isPrivate,
    desc: "Changes Exif data of stickers",
    type: "tool",
  },
  async (message, match, m) => {
    if (!message.reply_message && !message.reply_message.sticker)
      return await message.treply("_Reply to sticker_");
    let buff = await m.quoted.download();
    let [packname, author] = match.split(",");
    await message.sendMessage(
      buff,
      {
        packname: packname || PACKNAME,
        author: author || AUTHOR,
      },
      "sticker"
    );
  }
);



command({
    pattern: "getexif",
    fromMe: true,
    desc: "description",
    type: "type",
  },
  async (message, match, m) => {
    if (!message.reply_message || !message.reply_message.sticker)
      return await message.treply("_Reply to sticker_");
    let img = new Image();
    await img.load(await m.quoted.download());
    const exif = JSON.parse(img.exif.slice(22).toString());
    await message.treply(exif);
  }
);
