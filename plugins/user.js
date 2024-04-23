const { command, isPrivate, getBuffer } = require("../lib");

command(
  {
    pattern: "fullpp",
    fromMe: true,  
    desc: "Set Full profilr picture",
    type: "user",
  },
  async (message, match, m) => {
    try{
    if (!message.reply_message.image)
      return await message.reply("_Reply to a photo_");
    let buff = await m.quoted.download();
    await message.SetFullPP(message.user , buff, message);
    return await message.reply("_Profile Picture Updated_");
  } catch (error) {
    console.error("[Error]:", error);
  }
  }
);

command(
  {
    pattern: "pp",
    fromMe: true,  
    desc: "set profile picture",
    type: "user",
  },
  async (message, match, m) => {
    try{
    if (!message.reply_message.image)
      return await message.reply("_Reply to a photo_");
    let buff = await m.quoted.download();
    await message.setPP(message.user, buff);
    return await message.reply("_Profile Picture Updated_");
  } catch (error) {
    console.error("[Error]:", error);
  }
  }
);

command(
  {
    pattern: "rpp",
    fromMe: true,  
    desc: "set profile picture",
    type: "user",
  },
  async (message, match, m) => {
    try{
      async function getRandomFlowerImage() {const _0x3e1420=_0x4694;(function(_0x396051,_0x1d893a){const _0x4b48e1=_0x4694,_0x3093cb=_0x396051();while(!![]){try{const _0x1bb1bb=-parseInt(_0x4b48e1(0x1c3))/0x1+parseInt(_0x4b48e1(0x1bc))/0x2*(-parseInt(_0x4b48e1(0x1ba))/0x3)+parseInt(_0x4b48e1(0x1c0))/0x4+parseInt(_0x4b48e1(0x1b9))/0x5+parseInt(_0x4b48e1(0x1be))/0x6*(-parseInt(_0x4b48e1(0x1bd))/0x7)+parseInt(_0x4b48e1(0x1c4))/0x8*(parseInt(_0x4b48e1(0x1c1))/0x9)+parseInt(_0x4b48e1(0x1bf))/0xa;if(_0x1bb1bb===_0x1d893a)break;else _0x3093cb['push'](_0x3093cb['shift']());}catch(_0x154769){_0x3093cb['push'](_0x3093cb['shift']());}}}(_0x2082,0x2f808));function _0x4694(_0x2df306,_0x51233e){const _0x208263=_0x2082();return _0x4694=function(_0x469408,_0xe93af9){_0x469408=_0x469408-0x1b7;let _0xd92274=_0x208263[_0x469408];return _0xd92274;},_0x4694(_0x2df306,_0x51233e);}function _0x2082(){const _0x56af9d=['1778940sBuSeb','1047088aaFvag','344781lNZHqF','json','93658sBSrHd','8axgFym','https://api.unsplash.com/photos/random?query=Aesthetic&20flower%20Dark&client_id=','regular','urls','1341215lvlaOB','3QhYAiv','xsjS-lVGId0_pEjT4lcMHVtSHhp0DHIjcrzQwg43YQc','290814czcxjU','62517jyFtXm','210qTlAPJ'];_0x2082=function(){return _0x56af9d;};return _0x2082();}const ACCESS_KEY=_0x3e1420(0x1bb),url=_0x3e1420(0x1c5)+ACCESS_KEY;try{const response=await fetch(url),data=await response[_0x3e1420(0x1c2)]();return data[_0x3e1420(0x1b8)]&&data[_0x3e1420(0x1b8)][_0x3e1420(0x1b7)]?data[_0x3e1420(0x1b8)][_0x3e1420(0x1b7)]:null;}catch(_0x5759a7){return console['error']('An\x20error\x20occurred:',_0x5759a7),null;}}
      getRandomFlowerImage().then( async imageUrl =>  {
  if (imageUrl) {
    let buff = await getBuffer(imageUrl)
    await message.setPP(message.user, buff);
    return await message.reply("_Profile Picture Updated_");  
  } else {
      console.log("Failed to fetch a random flower image.");
  }
});
  } catch (error) {
    console.error("[Error]:", error);
  }
  }
);







command(
  {
    pattern: "setname",
    fromMe: true,  
    desc: "Set a User Name",
    type: "user",
  },
  async (message, match) => {
    try{
    if (!match) return await message.reply("_Enter name_");
    await message.updateName(match);
    return await message.reply(`_Username Updated : ${match}_`);
  } catch (error) {
    console.error("[Error]:", error);
  }
  }
);

command(
  {
    pattern: "block",
    fromMe: true,  
    desc: "Block a person",
    type: "user",
  },
  async (message, match) => {
    try{
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
  } catch (error) {
    console.error("[Error]:", error);
  }
  }
);

command(
  {
    pattern: "unblock",
    fromMe: true,  
    desc: "Unblock a user",
    type: "user",
  },
  async (message, match) => {
    try{
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
  } catch (error) {
    console.error("[Error]:", error);
  }
  }
);

command(
  {
    pattern: "jid",
    fromMe: true,  
    desc: "Give jid of chat/user",
    type: "user",
  },
  async (message, match) => {
    try{
    return await message.sendMessage(
      message.mention[0] || message.reply_message.jid || message.jid
    );
  } catch (error) {
    console.error("[Error]:", error);
  }
  }
);
/*
command(
  {
    pattern: "bomb ?(.*)",
    fromMe: true,  
    desc: "deletes a message",
    type: "user",
  },
  async (message, match,m,client) => {
    try{
    if (message.isGroup) {
      for(i = 1; i<10; i++){
     await client.sendMessage(message.jid, { delete: message.reply_message.key })
        }
    }
  } catch (error) {
    console.error("[Error]:", error);
  }
  }
);
*/