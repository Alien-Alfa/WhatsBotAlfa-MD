const { command, isPrivate} = require("../lib/");

command(
  {
    pattern: "join",
    fromMe: true,  
    desc: "hem",
    type: "group",
  },
  async (message, match) => {
     match = match || message.reply_message.text
      let cold = match
      let hmm = cold.split("/")[3]
      await  message.client.groupAcceptInvite(hmm)
     return await message.sendMessage("_joined_")
   });

