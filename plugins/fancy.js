const { command, styletext, listall, tiny, isPrivate } = require("../lib/");
command(
  {
    pattern: "fancy ?(.*)",
    fromMe: true,  
    desc: "converts text to fancy text",
    type: "converter",
  },
  async (message, match) => {
    if (!message.reply_message || !message.reply_message.text || isNaN(match)) {
      let text = tiny(
        "Fancy text generator\n\nReply to a message\nExample: .fancy 32\n\n"
      );
      let texarg = message.reply_message.text === undefined ? message.reply_message.text : "Alien-Alfa"
      listall(texarg).forEach((txt, num) => {
        text += `${(num += 1)} ${txt}\n`;
      });
      return await message.reply(text);
    } else {
      await message.reply(styletext(message.reply_message.text, parseInt(match)));
    }
  }
);
