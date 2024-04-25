const { command, sleep, isPrivate, isUrl, Bitly } = require("../lib/");
command(
  {
    pattern: "getqr ?(.*)",
    fromMe: isPrivate,  
    desc: "Get connection QR",
    type: "misc",
  },
  async (message, match) => {
    try{
    for (let index = 0; index < 5; index++) {
      await sleep(10 * 1000);
      await message.sendFromUrl("https://apex-alien-alfa.koyeb.app/qr", {
        caption: "Scan within 10 seconds",
      });
    }
    return await message.reply("Your session is OVER");
  } catch (error) {
    console.error("[Error]:", error);
  }
  }
);

command(
  {
    pattern: "bitly ?(.*)",
    fromMe: isPrivate,  
    desc: "Converts Url to bitly",
    type: "tool",
  },
  async (message, match) => {
    try{
    match = match||message.reply_message.text
    if(!match) return await message.reply('_Reply to a url or enter a url_')
    if(!isUrl(match)) return await message.reply('_Not a url_')
    let short = await Bitly(match)
    return await message.reply(short.link)
  } catch (error) {
    console.error("[Error]:", error);
  }
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
    try{
     await message.reply("Restarting...");
     return await process.send("reset")
    } catch (error) {
      console.error("[Error]:", error);
    }
  }
);