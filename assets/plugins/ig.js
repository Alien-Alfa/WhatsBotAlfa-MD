const { isPrivate, command, getUrl, igdl, isIgUrl } = require("../../lib/");
command(
  {
    pattern: "insta",
    fromMe: isPrivate,
    desc: "To download instagram media",
    type: "user",
  },
  async (message, match) => {
    match = match || message.reply_message.text;
    if (!match) return;
    const url = getUrl(match.trim())[0];
    if (!url) return;
    if (!isIgUrl(url))
      return await message.client.sendMessage(message.jid, "Invalid Instagram link");
    if (!isIgUrl(match.trim()))
      return await message.client.sendMessage(message.jid, "Invalid Instagram link");
    try {
      const data = await igdl(getUrl(match.trim())[0]);
      if (data.length == 0)
        return await message.client.sendMessage(
          message.jid,
          "No media found on the link"
        );
      data.forEach(async (url) => {
        await message.sendFile(url);
      });
    } catch (e) {
      await message.client.sendMessage(message.jid, "Error: " + e);
    }
  }
);
