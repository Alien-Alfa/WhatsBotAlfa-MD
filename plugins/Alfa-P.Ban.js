const fs = require("fs")
const chalk = require("chalk")
const { writeFile, readFile } = require("fs");
const { isAdmin, parsedJid, command, isPrivate, SetupNewUser } = require("../lib");
//let data =  readFile('./database/settings.json')
//let db = JSON.parse(data);
//let bannnnnn = db.settings.banned
let path = './database/settings.json'
const relconfig = require('../config')
const config = require('../database/settings.json')
//const { registeruser } = require('../lib/alfabase')
//============================================================================================================================================
//============================================================================================================================================
//============================================================================================================================================
//============================================================================================================================================
const { PACKNAME, AUTHOR } = require("../database/settings");


command({
  pattern: "warn",
  fromMe: true,
  desc: "Unban number from this group",
  dontAddCommandList: true,
  type: "admin",

},
async (message, match, m) => {
  const _0x46297b=_0xa094;(function(_0x1a3862,_0x4dc486){const _0x46e459=_0xa094,_0xf1ca54=_0x1a3862();while(!![]){try{const _0x90b436=-parseInt(_0x46e459(0x1b0))/0x1*(-parseInt(_0x46e459(0x1b8))/0x2)+-parseInt(_0x46e459(0x1ac))/0x3*(-parseInt(_0x46e459(0x1b3))/0x4)+parseInt(_0x46e459(0x1bc))/0x5+-parseInt(_0x46e459(0x1b5))/0x6+parseInt(_0x46e459(0x1b6))/0x7+-parseInt(_0x46e459(0x1b4))/0x8*(-parseInt(_0x46e459(0x1b9))/0x9)+-parseInt(_0x46e459(0x1ad))/0xa*(parseInt(_0x46e459(0x1af))/0xb);if(_0x90b436===_0x4dc486)break;else _0xf1ca54['push'](_0xf1ca54['shift']());}catch(_0x3c7313){_0xf1ca54['push'](_0xf1ca54['shift']());}}}(_0x4874,0xef10a));if(!message[_0x46297b(0x1ae)])return await message['reply']('_This\x20command\x20is\x20for\x20groups_');let jidd=parsedJid(match)[_0x46297b(0x1bd)]();match=jidd||message[_0x46297b(0x1bb)]['jid'];if(!match)return await message[_0x46297b(0x1ba)](_0x46297b(0x1b2));let isadmin=await isAdmin(message[_0x46297b(0x1b7)],message[_0x46297b(0x1ab)],message[_0x46297b(0x1b1)]);function _0x4874(){const _0x2a2718=['44589NAMpzz','2934520mVQOqJ','isGroup','44hcSLAx','851588EzUZQf','client','_Mention\x20user\x20to\x20add','24QYSUXQ','29592mTDZjy','7738818KbmDUD','5349603lOMXWU','jid','2gYcrpL','468PMvraB','reply','reply_message','7727390OPeajt','toString','user'];_0x4874=function(){return _0x2a2718;};return _0x4874();}if(!isadmin)return await message[_0x46297b(0x1ba)]('_I\x27m\x20not\x20admin_');let jid=parsedJid(match);function _0xa094(_0x129b98,_0x5db1e8){const _0x4874db=_0x4874();return _0xa094=function(_0xa094e6,_0x313999){_0xa094e6=_0xa094e6-0x1ab;let _0x3e924d=_0x4874db[_0xa094e6];return _0x3e924d;},_0xa094(_0x129b98,_0x5db1e8);}await message['warn'](match,message);
  } 
);

//============================================================================================================================================





command({
  pattern: "setup",
  fromMe: true,
  desc: "Setup database",
  dontAddCommandList: true,
  type: "owner",

},
async (message, match, m) => {
  SetupNewUser(message)
})


//============================================================================================================================================
//============================================================================================================================================
//============================================================================================================================================
//============================================================================================================================================
let file = require.resolve(__filename)
fs.watchFile(file, () => {
	fs.unwatchFile(file)
	console.log(chalk.redBright(`Update"${__filename}"`))
	delete require.cache[file]
	require(file)
})


const axios = require("axios");



command({
  pattern: "qc",
  fromMe: false,
  desc: "Show All commands",
  dontAddCommandList: true,
  type: "theme",

}, async (message, match, m) => {
const _0x146677=_0xeb2d;(function(_0xeef856,_0x265415){const _0x2dc57a=_0xeb2d,_0x22dd82=_0xeef856();while(!![]){try{const _0x5320d7=-parseInt(_0x2dc57a(0x187))/0x1+-parseInt(_0x2dc57a(0x196))/0x2*(parseInt(_0x2dc57a(0x193))/0x3)+parseInt(_0x2dc57a(0x199))/0x4+parseInt(_0x2dc57a(0x17d))/0x5+-parseInt(_0x2dc57a(0x198))/0x6*(parseInt(_0x2dc57a(0x195))/0x7)+parseInt(_0x2dc57a(0x197))/0x8+parseInt(_0x2dc57a(0x182))/0x9;if(_0x5320d7===_0x265415)break;else _0x22dd82['push'](_0x22dd82['shift']());}catch(_0x3af39d){_0x22dd82['push'](_0x22dd82['shift']());}}}(_0x88fa,0x69f39));if(!message[_0x146677(0x186)][_0x146677(0x190)])return await message[_0x146677(0x17e)](_0x146677(0x18a));let pfp;try{pfp=await message[_0x146677(0x18c)][_0x146677(0x18e)](message[_0x146677(0x186)][_0x146677(0x18f)],'image');}catch(_0x20709f){pfp=_0x146677(0x18b);}var tname;function _0xeb2d(_0x398ab4,_0x291719){const _0x88fa6a=_0x88fa();return _0xeb2d=function(_0xeb2d16,_0x2ba9cd){_0xeb2d16=_0xeb2d16-0x17c;let _0x45e8c5=_0x88fa6a[_0xeb2d16];return _0x45e8c5;},_0xeb2d(_0x398ab4,_0x291719);}try{tname=await message[_0x146677(0x183)](message[_0x146677(0x186)]['jid']);}catch(_0x1a688d){tname=_0x146677(0x180);}function _0x88fa(){const _0x20df11=['1115934rjwumv','277588PHtBkG','quoted','application/json','2891585CqYgIR','reply','webp','User','result','2249082luAwav','getName','post','image','reply_message','777220rlIOOI','base64','https://bot.lyo.su/quote/generate','Please\x20quote\x20any\x20users\x20message.','https://avatars.githubusercontent.com/u/64305844?v=4','client','eror','profilePictureUrl','jid','text','sendMessage','data','6FBgLwl','#FFFFFF','7orQUMS','181178lSciLw','5446016bdnvDm'];_0x88fa=function(){return _0x20df11;};return _0x88fa();}let qczi;qczi={'type':_0x146677(0x19a),'format':_0x146677(0x17f),'backgroudnColor':_0x146677(0x194),'width':0x200,'height':0x300,'scale':0x2,'messages':[{'avatar':!![],'from':{'first_name':tname,'language_code':'en','name':tname,'photo':{'url':pfp}},'text':message[_0x146677(0x186)][_0x146677(0x190)],'replyMessage':{}}]};const post=await axios[_0x146677(0x184)](_0x146677(0x189),qczi,{'headers':{'Content-Type':_0x146677(0x17c)}});let buff=await Buffer['from'](post[_0x146677(0x192)][_0x146677(0x181)][_0x146677(0x185)],_0x146677(0x188));if(buff==undefined)return message[_0x146677(0x17e)](_0x146677(0x18d));message[_0x146677(0x191)](buff,{'packname':PACKNAME,'author':AUTHOR},'sticker');
})
