const { command, SetFullPP, isPrivate } = require("../lib");

command(
  {
    pattern: "setpp ",
    fromMe: isPrivate,  
    desc: "Set profile picture",
    type: "user",
  },
  async (message, match, m) => {
    if (!message.reply_message.image)
      return await message.reply("_Reply to a photo_");
    let buff = await m.quoted.download();
    await SetFullPP(message.user , buff);
    return await message.reply("_Profile Picture Updated_");
  }
);

command(
  {
    pattern: "fullpp ",
    fromMe: isPrivate,  
    desc: "Set profile picture",
    type: "user",
  },
  async (message, match, m) => {
    if (!message.reply_message.image)
      return await message.reply("_Reply to a photo_");
    let buff = await m.quoted.download();
    await message.setPP(message.user, buff);
    return await message.reply("_Profile Picture Updated_");
  }
);

command(
  {
    pattern: "setname ?(.*)",
    fromMe: isPrivate,  
    desc: "Set User name",
    type: "user",
  },
  async (message, match) => {
    if (!match) return await message.reply("_Enter name_");
    await message.updateName(match);
    return await message.reply(`_Username Updated : ${match}_`);
  }
);

command(
  {
    pattern: "block ?(.*)",
    fromMe: isPrivate,  
    desc: "Block a person",
    type: "user",
  },
  async (message, match) => {
    if (message.isGroup) {
      let jid = message.mention[0] || message.reply_message.jid;
      if (!jid) return await message.reply("_Reply to a person or mention_");
      await message.block(jid);
      return await message.sendMessageMessage(`_@${jid.split("@")[0]} Blocked_`, {
        mentions: [jid],
      });
    } else {
      await message.block(message.jid);
      return await message.reply("_User blocked_");
    }
  }
);

command(
  {
    pattern: "unblock ?(.*)",
    fromMe: isPrivate,  
    desc: "Unblock a person",
    type: "user",
  },
  async (message, match) => {
    if (message.isGroup) {
      let jid = message.mention[0] || message.reply_message.jid;
      if (!jid) return await message.reply("_Reply to a person or mention_");
      await message.block(jid);
      return await message.sendMessage(`_@${jid.split("@")[0]} unblocked_`, {
        mentions: [jid],
      });
    } else {
      await message.unblock(message.jid);
      return await message.reply("_User unblocked_");
    }
  }
);

command(
  {
    pattern: "jid ?(.*)",
    fromMe: isPrivate,  
    desc: "Give jid of chat/user",
    type: "user",
  },
  async (message, match) => {
    return await message.sendMessage(
      message.mention[0] || message.reply_message.jid || message.jid
    );
  }
);
/*
command(
  {
    pattern: "bomb ?(.*)",
    fromMe: isPrivate,  
    desc: "deletes a message",
    type: "user",
  },
  async (message, match,m,client) => {
    if (message.isGroup) {
      for(i = 1; i<10; i++){
     await client.sendMessage(message.jid, { delete: message.reply_message.key })
        }
    }
  }
);
*/