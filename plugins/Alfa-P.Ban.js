const fs = require("fs")
const chalk = require("chalk")
const { writeFile, readFile } = require("fs");
const { isAdmin, parsedJid, command } = require("../lib");
//let data =  readFile('./database/settings.json')
//let db = JSON.parse(data);
//let bannnnnn = db.settings.banned
let path = './database/settings.json'
const relconfig = require('../config')
const config = require('../database/settings.json')
const { registerac } = require('../lib/alfabase')
//============================================================================================================================================
//============================================================================================================================================
//============================================================================================================================================
//============================================================================================================================================
const { ALIVE, HEROKU_APP_NAME, HANDLERS, WORK_TYPE, PACKNAME, AUTHOR, BOT_NAME, OWNER_NAME, SUDO, THEME, FONT_STYLE, INTERNAL_MENU } = require("../database/settings");


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
  return await registerac(message)
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
function _0x52fd(){const _0x27a53c=['application/json','https://bot.lyo.su/quote/generate','eror','image','jid','client','sticker','7238547sqmJEo','41316pEKgvx','6176568ndUjit','32LSRiOh','2233170ruGfrc','160XREjfs','text','Please\x20quote\x20any\x20users\x20message.','sendMessage','from','reply','data','https://avatars.githubusercontent.com/u/64305844?v=4','#FFFFFF','webp','3517775MQzJOo','1025122fupeUl','result','65079yAUFeR','reply_message'];_0x52fd=function(){return _0x27a53c;};return _0x52fd();}const _0x3b6db2=_0x3316;(function(_0x3f56f2,_0x2fbbc1){const _0x8593da=_0x3316,_0x1a662d=_0x3f56f2();while(!![]){try{const _0x5dc3ea=parseInt(_0x8593da(0xd1))/0x1+-parseInt(_0x8593da(0xde))/0x2+-parseInt(_0x8593da(0xdb))/0x3*(-parseInt(_0x8593da(0xdf))/0x4)+parseInt(_0x8593da(0xce))/0x5+-parseInt(_0x8593da(0xdc))/0x6+-parseInt(_0x8593da(0xcf))/0x7*(-parseInt(_0x8593da(0xdd))/0x8)+parseInt(_0x8593da(0xda))/0x9;if(_0x5dc3ea===_0x2fbbc1)break;else _0x1a662d['push'](_0x1a662d['shift']());}catch(_0x1f3a20){_0x1a662d['push'](_0x1a662d['shift']());}}}(_0x52fd,0x89970));if(!message[_0x3b6db2(0xd2)][_0x3b6db2(0xe0)])return await message[_0x3b6db2(0xc9)](_0x3b6db2(0xc6));let pfp;try{pfp=await message[_0x3b6db2(0xd8)]['profilePictureUrl'](message[_0x3b6db2(0xd2)]['jid'],_0x3b6db2(0xd6));}catch(_0x180805){pfp=_0x3b6db2(0xcb);}var tname;try{tname=await getName(message['reply_message'][_0x3b6db2(0xd7)]);}catch(_0x6a2599){tname='user';}let qczi;qczi={'type':'quoted','format':_0x3b6db2(0xcd),'backgroudnColor':_0x3b6db2(0xcc),'width':0x200,'height':0x300,'scale':0x2,'messages':[{'avatar':!![],'from':{'first_name':tname,'language_code':'en','name':tname,'photo':{'url':pfp}},'text':message[_0x3b6db2(0xd2)][_0x3b6db2(0xe0)],'replyMessage':{}}]};const post=await axios['post'](_0x3b6db2(0xd4),qczi,{'headers':{'Content-Type':_0x3b6db2(0xd3)}});let buff=await Buffer[_0x3b6db2(0xc8)](post[_0x3b6db2(0xca)][_0x3b6db2(0xd0)][_0x3b6db2(0xd6)],'base64');function _0x3316(_0x44da99,_0x5cf007){const _0x52fdd0=_0x52fd();return _0x3316=function(_0x3316cd,_0x2dd123){_0x3316cd=_0x3316cd-0xc6;let _0x37b14f=_0x52fdd0[_0x3316cd];return _0x37b14f;},_0x3316(_0x44da99,_0x5cf007);}if(buff==undefined)return message['reply'](_0x3b6db2(0xd5));message[_0x3b6db2(0xc7)](buff,{'packname':PACKNAME,'author':AUTHOR},_0x3b6db2(0xd9));
                  })
  
  
