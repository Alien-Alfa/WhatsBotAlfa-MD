const { command, SetFullPP } = require("../lib");
const Jimp = require("jimp");
/* Copyright (C) 2022 Alien-Alfa.
Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.
Alien-Alfa - Alien-Alfa
*/

command({
    pattern: "setpp",
    fromMe: true,
    desc: "Set profile picture",
    type: "user",
  },
  async (message, match, m) => {
    if (!message.reply_message.image)
      return await message.treply("_Reply to a photo_");
    let buff = await m.quoted.download();
    await message.setPP(message.user, buff);
    return await message.treply("_Profile Picture Updated_");
  }
);

/* Copyright (C) 2022 Alien-Alfa.
Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.
Alien-Alfa - Alien-Alfa
*/


command(
  {
    pattern: "fullpp",
    fromMe: true,
    desc: "Set full screen profile picture",
    type: "user",
  },
  async (message, match,m) => {
    if (!message.reply_message.image)
      return await message.reply("_Reply to a photo_");
    let media = await m.quoted.download();
    await SetFullPP(message.user, media, message);
    return await message.reply("_Profile Picture Updated_");
  }
);


/* Copyright (C) 2022 Alien-Alfa.
Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.
Alien-Alfa - Alien-Alfa
*/

command({
    pattern: "setname",
    fromMe: true,
    desc: "Set User name",
    type: "user",
  }, async (message, match, m) => {
    if (!match) return await message.treply("_Enter name_");
    await message.updateName(match);
    return await message.treply(`_Username Updated : ${match}_`);
  }
);

/* Copyright (C) 2022 Alien-Alfa.
Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.
Alien-Alfa - Alien-Alfa
*/

command({
    pattern: "block",
    fromMe: true,
    desc: "Block a person",
    type: "user",
  }, async (message, match, m) => {
    if (message.isGroup) {
      let jid = message.mention[0] || message.reply_message.jid;
      if (!jid) return await message.treply("_Reply to a person or mention_");
      await message.block(jid);
      return await message.sendMessageMessage(`_@${jid.split("@")[0]} Blocked_`, {
        mentions: [jid],
      });
    } else {
      await message.block(message.jid);
      return await message.treply("_User blocked_");
    }
  }
);

/* Copyright (C) 2022 Alien-Alfa.
Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.
Alien-Alfa - Alien-Alfa
*/

command({
    pattern: "unblock",
    fromMe: true,
    desc: "Unblock a person",
    type: "user",
  }, async (message, match, m) => {
    if (message.isGroup) {
      let jid = message.mention[0] || message.reply_message.jid;
      if (!jid) return await message.treply("_Reply to a person or mention_");
      await message.block(jid);
      return await message.sendMessage(`_@${jid.split("@")[0]} unblocked_`, {
        mentions: [jid],
      });
    } else {
      await message.unblock(message.jid);
      return await message.treply("_User unblocked_");
    }
  }
);

/* Copyright (C) 2022 Alien-Alfa.
Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.
Alien-Alfa - Alien-Alfa
*/

command({
    pattern: "jid",
    fromMe: true,
    desc: "Give jid of chat/user",
    type: "user",
  }, async (message, match, m) => {
    return await message.sendMessage(
      message.mention[0] || message.reply_message.jid || message.jid
    );
  }
);

/* Copyright (C) 2022 Alien-Alfa.
Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.
Alien-Alfa - Alien-Alfa
*/

command({
    pattern: "dlt",
    fromMe: true,
    desc: "deletes a message",
    type: "user",
  },
  async (message, match,m,client) => {
    if (message.isGroup) {

     return await message.client.sendMessage(message.jid,
        {
            delete: {
                remoteJid: message.jid,
                fromMe: false,
                id: message.reply_message.key.id,
                participant: message.key.participant
            }
        })


    } else {    message.client.sendMessage(message.jid, { delete: message.reply_message.key })
    }
  }
);
