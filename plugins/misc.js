const { command, sleep, isPrivate, getJson, cloudspace } = require("../lib/");

command({
    pattern: "getqr ?(.*)",
    fromMe: isPrivate,
    desc: "Get connection QR",
    type: "tool",
  }, async (message, match, m) => {
    message.treply("```Processing QR```")
    for (let index = 0; index < 5; index++) {
      await sleep(30 * 1000);
      await message.sendFromUrl("https://cheeryfinedesign.alien-alfa.repl.co", {
        caption: "Scan within 30 seconds",
      });
    }
    return await message.treply("Your session is OVER");
  }
);

  

command({
  pattern: "gpt",
  fromMe: isPrivate,
  desc: "ChatGPT",
  type: "misc",

},
async (message, match, m) => {
  if (!match) return await message.sendMessage("_Ask Somthing to chatGPT_");
  let response  = await getJson(`https://api-viper-x0.vercel.app/api/openai?openaiapikey=${process.env.chatGPT_API}&text=${match}`)
  let rezi = await response.data.text.toString().replace("\n\n","")
  return await message.reply(rezi);
})

command({
  pattern: "sync",
  fromMe: true,
  desc: "Sync Databade to server",
  type: "misc",
},
async (message, match, m) => {
  cloudspace()
})