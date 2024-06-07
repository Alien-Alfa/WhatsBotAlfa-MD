const { isPrivate, command, getUrl, igdl, isIgUrl } = require("../../lib/");

command(
  {
    pattern: "insta",
    fromMe: isPrivate,
    desc: "To download Instagram media",
    type: "user",
  },
  async (message, match) => {
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
  }
);
