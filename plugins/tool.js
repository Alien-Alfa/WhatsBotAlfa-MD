const { command, qrcode, isUrl, isPrivate, findMusic } = require("../lib/");
const jimp = require("jimp");
const QRReader = require("qrcode-reader");
let { unlink } = require("fs/promises");
const got = require("got");
const FormData = require("form-data");
const stream = require("stream");
const { promisify } = require("util");
const pipeline = promisify(stream.pipeline);
const fs = require("fs");
command({
    pattern: "qr",
    fromMe: isPrivate,
    desc: "Read/Write Qr.",
    type: "tool",
  }, async (message, match, m) => {
    match = match || message.reply_message.text;
    if (match) {
      let buff = await qrcode(match);
      return await message.sendMessage(buff, {}, "image");
    } else if (!message.reply_message || !message.reply_message.image)
      return await message.sendMessage(
        "*Example : qr test*\n*Reply to a qr image.*"
      );

    const { bitmap } = await jimp.read(
      await message.reply_message.downloadMediaMessage()
    );
    const qr = new QRReader();
    qr.cvideosback = (err, value) =>
      message.sendMessage(err ?? value.result, { quoted: message.data });
    qr.decode(bitmap);
  }
);

command({
    pattern: "find ?(.*)",
    fromMe: true,
    desc: "find the replied music",
    type: "tools",
  },
  async (message, match, msg) => {
    if (!message.reply_message)
      return await message.treply("_Reply to a audio or video_");
    let buff = await msg.quoted.download();
    let data = await findMusic(buff);
    if (!data.status) return message.treply(data);

    let buttonMessage = {
      text: `Title : ${data.title}            
Artist : ${data.artists}            
Album : ${data.album}            
Genre : ${data.genres}          
Release : ${data.release_date}`,
      templateButtons: [
        {
          urlButton: {
            displayText: "Play on youtube",
            url: data.youtube,
          },
        },
        {
          index: 1,
          urlButton: {
            displayText: "Play on spotify",
            url: data.spotify,
          },
        },
        {
          index: 2,
          quickReplyButton: {
            displayText: "Download",
            id: `${message.prefix}yta ${data.youtube}`,
          },
        },
      ],
    };
    await message.sendMessage(buttonMessage, {}, "template");
  }
);

command({
    pattern: "removebg",
    fromMe: isPrivate,
    desc: "removes background of an image",
    type: "tool",
  },
  async (message, match, m) => {
    
    if (!message.reply_message || !message.reply_message.image)
      return await message.treply("_Reply to a photo_");
      let apirnobg = ['q61faXzzR5zNU6cvcrwtUkRU','S258diZhcuFJooAtHTaPEn4T','5LjfCVAp4vVNYiTjq9mXJWHF','aT7ibfUsGSwFyjaPZ9eoJc61','BY63t7Vx2tS68YZFY6AJ4HHF','5Gdq1sSWSeyZzPMHqz7ENfi8','86h6d6u4AXrst4BVMD9dzdGZ','xp8pSDavAgfE5XScqXo9UKHF','dWbCoCb3TacCP93imNEcPxcL']
	    let apinobg = apirnobg[Math.floor(Math.random() * apirnobg.length)]

   // if (RMBG_KEY === false)
   //   return await message.treply(
   //     `_Get a new api key from https://www.remove.bg/api_\n_set it via_\n_setvar RMBG_KEY: api key_`
   //   );

    await message.treply("_Removing Background_");
    var location = await message.reply_message.downloadMediaMessage();

    var form = new FormData();
    form.append("image_file", fs.createReadStream(location));
    form.append("size", "auto");

    var rbg = await got.stream.post("https://api.remove.bg/v1.0/removebg", {
      body: form,
      headers: {
        "X-Api-Key": apinobg,
      },
    });

    await pipeline(rbg, fs.createWriteStream("rbg.png"));

    await message.sendMessage(fs.readFileSync("rbg.png"), {}, "image");
    await unlink(location);
    return await unlink("rbg.png");
  }
);

command({
    pattern: "bitly ?(.*)",
    fromMe: isPrivate,
    desc: "Converts Url to bitly",
    type: "tool",
  }, async (message, match, m) => {
    match = match || message.reply_message.text;
    if (!match) return await message.treply("_Reply to a url or enter a url_");
    if (!isUrl(match)) return await message.treply("_Not a url_");
    let short = await Bitly(match);
    return await message.treply(short.link);
  }
);

command({
    pattern: "spdf",
    fromMe: isPrivate,
    desc: "Converts Site to PDF.",
    type: "tool",
  }, async (message, match, m) => {
    match = match || message.reply_message.text;
    if (!match || !isUrl(match)) return await message.treply("_Enter a URL_");

    let url = new URL(match);
    await message.sendFromUrl(
      `https://api.html2pdf.app/v1/generate?url=${match}&apiKey=begC4dFAup1b8LyRXxAfjetfqDg2uYx8PWmh9YJ59tTZXiUyh2Vs72HdYQB68vyc`,
      { fileName: `${url.origin}.pdf`, mimetype: "application/pdf" }
    );
  }
);
