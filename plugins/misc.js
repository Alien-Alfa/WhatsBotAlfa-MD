const { command, sleep, isPrivate, isUrl, Bitly } = require("../lib/");
command(
  {
    pattern: "getqr ?(.*)",
    fromMe: true,  
    desc: "Get connection QR",
    type: "misc",
  },
  async (message, match) => {
    for (let index = 0; index < 5; index++) {
      await sleep(10 * 1000);
      await message.sendFromUrl("https://tshephang.cf/", {
        caption: "Scan within 10 seconds",
      });
    }
    return await message.reply("Your session is OVER");
  }
);

command(
  {
    pattern: "bitly ?(.*)",
    fromMe: true,  
    desc: "Converts Url to bitly",
    type: "tool",
  },
  async (message, match) => {
    match = match||message.reply_message.text
    if(!match) return await message.reply('_Reply to a url or enter a url_')
    if(!isUrl(match)) return await message.reply('_Not a url_')
    let short = await Bitly(match)
    return await message.reply(short.link)
  }
);

command(
  {
    pattern: "restart ?(.*)",
    fromMe: true,  
    desc: "restart the bot",
    type: "misc",
  },
  async (message, match) => {
     await message.reply("Restarting...");
     return await process.send("reset")
  }
);