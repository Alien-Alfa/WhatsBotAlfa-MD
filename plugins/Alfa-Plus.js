
const fs = require("fs")
const { writeFile, readFile } = require("fs");

const chalk = require("chalk")
const { exec, spawn, execSync } = require("child_process")
const axios = require("axios");
const { toAudio } = require("../lib/media");

const events = require("../lib/event");
const { command, isPrivate, getJson } = require("../lib");

const { hostname, uptime, totalmem, freemem } = require("os");
const { configz } = require("dotenv");
const fetch = require('node-fetch')
const config = require('../database/settings')
const { SUDO, MENTION_AUD, MENTION_IMG, MENTION, STORAGE_JID } = require('../database/settings');
const {getAudioBufferFromLink, addInfo, jslbuffer} = require('abu-bot') 
let db = JSON.parse(fs.readFileSync('./database/settings.json'));


command(
  {
    pattern: "decript",
    fromMe: isPrivate,
    desc: "Deencrypt text base(alfa)",
    type: "tool",
  },
  async (message, match) => {
    const _0x5dd1e8=_0x48c4;(function(_0x5206e6,_0x2f840e){const _0x4d3152=_0x48c4,_0x5350f0=_0x5206e6();while(!![]){try{const _0x3ac877=-parseInt(_0x4d3152(0xd2))/0x1*(parseInt(_0x4d3152(0xdc))/0x2)+-parseInt(_0x4d3152(0xdf))/0x3+parseInt(_0x4d3152(0xdb))/0x4*(-parseInt(_0x4d3152(0xd5))/0x5)+-parseInt(_0x4d3152(0xde))/0x6*(-parseInt(_0x4d3152(0xd1))/0x7)+parseInt(_0x4d3152(0xd4))/0x8*(-parseInt(_0x4d3152(0xcf))/0x9)+parseInt(_0x4d3152(0xd6))/0xa+parseInt(_0x4d3152(0xd8))/0xb;if(_0x3ac877===_0x2f840e)break;else _0x5350f0['push'](_0x5350f0['shift']());}catch(_0x13994d){_0x5350f0['push'](_0x5350f0['shift']());}}}(_0x1755,0xb41d8));function _0x48c4(_0xa922f1,_0x97cf83){const _0x17558f=_0x1755();return _0x48c4=function(_0x48c4cf,_0x3217f2){_0x48c4cf=_0x48c4cf-0xcf;let _0x17098d=_0x17558f[_0x48c4cf];return _0x17098d;},_0x48c4(_0xa922f1,_0x97cf83);}let int=match,fin=Buffer[_0x5dd1e8(0xd3)](int,_0x5dd1e8(0xdd))[_0x5dd1e8(0xd9)](_0x5dd1e8(0xd7)),inx=fin[_0x5dd1e8(0xd9)]()[_0x5dd1e8(0xd0)]('/'),our='';for(let r of inx){our+=Buffer['from'](r+'==',_0x5dd1e8(0xdd))[_0x5dd1e8(0xd9)](_0x5dd1e8(0xd7));}function _0x1755(){const _0x120487=['9133641QffzSX','toString','sendMessage','4FXMWJm','11806VdhgKF','base64','135498EwTohg','2993481PzwokM','962073IyuEIr','split','126LwjFlR','31FktGyo','from','8vYLAdW','1012870iIpDGt','9912180ZttcpQ','utf-8'];_0x1755=function(){return _0x120487;};return _0x1755();}return await message[_0x5dd1e8(0xda)](our);
})

command(
  {
    pattern: "encript",
    fromMe: isPrivate,
    desc: "Encrypt text base(alfa)",
    type: "tool",
  },
  async (message, match) => {
    const _0xc12340=_0x3eed;function _0x2cf2(){const _0x167136=['replaceAll','1044445PLAYpn','sendMessage','base64','3187317BWEvuz','1155555dNJwQL','toString','708184qDGQOD','from','1113640EUvYfE','1881836IKGZVH','12SFfmNn','9FNugtX','7550TThXOA','61APdnFp'];_0x2cf2=function(){return _0x167136;};return _0x2cf2();}(function(_0x15d03e,_0x466878){const _0x5c06bb=_0x3eed,_0x534730=_0x15d03e();while(!![]){try{const _0x31198c=parseInt(_0x5c06bb(0x18f))/0x1*(parseInt(_0x5c06bb(0x18e))/0x2)+parseInt(_0x5c06bb(0x186))/0x3+parseInt(_0x5c06bb(0x18b))/0x4+parseInt(_0x5c06bb(0x191))/0x5*(-parseInt(_0x5c06bb(0x18c))/0x6)+-parseInt(_0x5c06bb(0x185))/0x7+-parseInt(_0x5c06bb(0x188))/0x8+parseInt(_0x5c06bb(0x18d))/0x9*(parseInt(_0x5c06bb(0x18a))/0xa);if(_0x31198c===_0x466878)break;else _0x534730['push'](_0x534730['shift']());}catch(_0x2cc8c6){_0x534730['push'](_0x534730['shift']());}}}(_0x2cf2,0x39883));let int=match,inx=int['toString']()['split'](''),our='';for(let r of inx){our+=Buffer[_0xc12340(0x189)](r)[_0xc12340(0x187)](_0xc12340(0x193))+'/';}let fin=Buffer[_0xc12340(0x189)](our[_0xc12340(0x190)]('=',''))[_0xc12340(0x187)](_0xc12340(0x193));function _0x3eed(_0x250cc0,_0x1e70bb){const _0x2cf272=_0x2cf2();return _0x3eed=function(_0x3eeda6,_0x4d6b4b){_0x3eeda6=_0x3eeda6-0x185;let _0x54d02f=_0x2cf272[_0x3eeda6];return _0x54d02f;},_0x3eed(_0x250cc0,_0x1e70bb);}return await message[_0xc12340(0x192)](fin);
})



command({on: "text", fromMe: isPrivate,}, async (message, match, m) => {
  let cmdz = await match.toString().split(' ')[0]
  switch (cmdz) {

  	case 'bass':
  	case 'blown':
  	case 'deep':
  	case 'earrape':
  	case 'fast':
  	case 'fat':
  	case 'nightcore':
  	case 'reverse':
  	case 'robot':
  	case 'slow':
  	case 'smooth':
  	case 'squirrel':

  		if (!(message.reply_message.audio)) return message.sendMessage("_please reply to an audio..._")

  		let media = await message.quoted.download();

  		try {
  			let set
  			if(/bass/.test(match)) set = '-af equalizer=f=54:width_type=o:width=2:g=20'
  			if (/blown/.test(cmdz)) set = '-af acrusher=.1:1:64:0:log'
  			if (/deep/.test(cmdz)) set = '-af atempo=4/4,asetrate=44500*2/3'
  			if (/earrape/.test(cmdz)) set = '-af volume=12'
  			if (/fast/.test(cmdz)) set = '-filter:a "atempo=1.63,asetrate=44100"'
  			if (/fat/.test(cmdz)) set = '-filter:a "atempo=1.6,asetrate=22100"'
  			if (/nightcore/.test(cmdz)) set = '-filter:a atempo=1.06,asetrate=44100*1.25'
  			if (/reverse/.test(cmdz)) set = '-filter_complex "areverse"'
  			if (/robot/.test(cmdz)) set = '-filter_complex "afftfilt=real=\'hypot(re,im)*sin(0)\':imag=\'hypot(re,im)*cos(0)\':win_size=512:overlap=0.75"'
  			if (/slow/.test(cmdz)) set = '-filter:a "atempo=0.7,asetrate=44100"'
  			if (/smooth/.test(cmdz)) set = '-filter:v "minterpolate=\'mi_mode=mci:mc_mode=aobmc:vsbmc=1:fps=120\'"'
  			if (/tupai/.test(cmdz)) set = '-filter:a "atempo=0.5,asetrate=65100"'

  			if (message.reply_message.audio) {
  				message.sendMessage("_please wait..._")


  				let ran = await `${Math.floor(Math.random() * 10000)}` + '.mp3'

  				exec(`ffmpeg -i ${media} ${set} ${ran}`, async (err, stderr, stdout) => {
  					fs.unlinkSync(media)
  					if (err) return message.sendMessage(err)
  					let buff = fs.readFileSync(ran)
  					await message.sendMessage(buff, {
  						mimetype: "audio/mpeg"
  					}, "audio");

  					return fs.unlinkSync(ran)
  				})
  			} else message.sendMessage(media.mime)
  		} catch (e) {
  			message.sendMessage(`${e}`)
  		}

  		break


//============================================================================================================================================



case 'sound1': case 'sound2': case 'sound3': case 'sound4': case 'sound5': case 'sound6': 
case 'sound7': case 'sound8': case 'sound9': case 'sound10': case 'sound11': case 'sound12': 
case 'sound13': case 'sound14': case 'sound15': case 'sound16': case 'sound17': case 'sound18': 
case 'sound19': case 'sound20': case 'sound21': case 'sound22': case 'sound23': case 'sound24': 
case 'sound25': case 'sound26': case 'sound27': case 'sound28': case 'sound29': case 'sound30': 
case 'sound31': case 'sound32': case 'sound33': case 'sound34': case 'sound35': case 'sound36': 
case 'sound37': case 'sound38': case 'sound39': case 'sound40': case 'sound41': case 'sound42': 
case 'sound43': case 'sound44': case 'sound45': case 'sound46': case 'sound47': case 'sound48': 
case 'sound49': case 'sound50': case 'sound51': case 'sound52': case 'sound53': case 'sound54': 
case 'sound55': case 'sound56': case 'sound57': case 'sound58': case 'sound59': case 'sound60': 
case 'sound61': case 'sound62': case 'sound63': case 'sound64': case 'sound65': case 'sound66': 
case 'sound67': case 'sound68': case 'sound69': case 'sound70': case 'sound71': case 'sound72': 
case 'sound73': case 'sound74': case 'sound75': case 'sound76': case 'sound77': case 'sound78': 
case 'sound79': case 'sound80': case 'sound81': case 'sound82': case 'sound83': case 'sound84': 
case 'sound85': case 'sound86': case 'sound87': case 'sound88': case 'sound89': case 'sound90': 
case 'sound91': case 'sound92': case 'sound93': case 'sound94': case 'sound95': case 'sound96': 
case 'sound97': case 'sound98': case 'sound99': case 'sound100': case 'sound101': case 'sound102': 
case 'sound103': case 'sound104': case 'sound105': case 'sound106': case 'sound107': case 'sound108': 
case 'sound109': case 'sound110': case 'sound111': case 'sound112': case 'sound113': case 'sound114': 
case 'sound115': case 'sound116': case 'sound117': case 'sound118': case 'sound119': case 'sound120': 
case 'sound121': case 'sound122': case 'sound123': case 'sound124': case 'sound125': case 'sound126': 
case 'sound127': case 'sound128': case 'sound129': case 'sound130': case 'sound131': case 'sound132': 
case 'sound133': case 'sound134': case 'sound135': case 'sound136': case 'sound137': case 'sound138': 
case 'sound139': case 'sound140': case 'sound141': case 'sound142': case 'sound143': case 'sound144': 
case 'sound145': case 'sound146': case 'sound147': case 'sound148': case 'sound149': case 'sound150': 
case 'sound151': case 'sound152': case 'sound153': case 'sound154': case 'sound155': case 'sound156': 
case 'sound157': case 'sound158': case 'sound159': case 'sound160': case 'sound161':{
  if(isPrivate) return;
XeonBotInc_dev = await fetch(`https://github.com/DGXeon/Tiktokmusic-API/raw/master/tiktokmusic/${message.text}.mp3`)
await message.client.sendMessage(message.jid, { audio: XeonBotInc_dev, mimetype: 'audio/mpeg', ptt: true })     
} break

}

});



//============================================================================================================================================
command({
  pattern: "spotify",
      fromMe: true,
      desc: "Download music from Spotify",
      dontAddCommandList: true,
      type: "download",
  
   },
   async (message, match, m) => {
const _0xabf9c9=_0x1720;(function(_0x4a392f,_0x144a5b){const _0x4f5f16=_0x1720,_0x168abe=_0x4a392f();while(!![]){try{const _0x3f51ba=-parseInt(_0x4f5f16(0x196))/0x1+parseInt(_0x4f5f16(0x1a1))/0x2*(parseInt(_0x4f5f16(0x197))/0x3)+-parseInt(_0x4f5f16(0x191))/0x4+-parseInt(_0x4f5f16(0x190))/0x5+-parseInt(_0x4f5f16(0x195))/0x6+-parseInt(_0x4f5f16(0x1a2))/0x7*(-parseInt(_0x4f5f16(0x1a7))/0x8)+parseInt(_0x4f5f16(0x192))/0x9*(parseInt(_0x4f5f16(0x18f))/0xa);if(_0x3f51ba===_0x144a5b)break;else _0x168abe['push'](_0x168abe['shift']());}catch(_0x4d3e0a){_0x168abe['push'](_0x168abe['shift']());}}}(_0x4699,0x5c92f));if(!match)return await message[_0xabf9c9(0x199)](_0xabf9c9(0x19d));const Spotify=require(_0xabf9c9(0x1a4)),spotify=new Spotify(match),info=await spotify[_0xabf9c9(0x19b)]();if(info[_0xabf9c9(0x1a6)])return await message['reply'](_0xabf9c9(0x194));function _0x1720(_0x5722e4,_0x32385b){const _0x4699f1=_0x4699();return _0x1720=function(_0x1720ab,_0x188346){_0x1720ab=_0x1720ab-0x18f;let _0x2f315f=_0x4699f1[_0x1720ab];return _0x2f315f;},_0x1720(_0x5722e4,_0x32385b);}function _0x4699(){const _0x1f851b=['352024Jpbnwq','3rBKZTX','\x0a\x20*Release\x20Date:*\x20','reply','client','getInfo','sendMessage','_Where\x20is\x20the\x20link?_','jid','join','\x0a\x20*Album:*\x20','1014454kaOvsI','390271otargg','\x0a\x20*Artists:*\x20','../lib/spotify','\x20*Title:*\x20','error','8ywNFjd','85490JFyHZu','1787010CfcSEs','614704HvDFiE','783awsRmv','download','_The\x20link\x20you\x20provided\x20is\x20not\x20spotify\x20link_','386748QEvgfF'];_0x4699=function(){return _0x1f851b;};return _0x4699();}const {name,artists,album_name,release_date,cover_url}=info,details=_0xabf9c9(0x1a5)+(name||'')+_0xabf9c9(0x1a3)+(artists||[])[_0xabf9c9(0x19f)](',')+_0xabf9c9(0x1a0)+album_name+_0xabf9c9(0x198)+(release_date||''),response=await message[_0xabf9c9(0x19a)][_0xabf9c9(0x19c)](message[_0xabf9c9(0x19e)],{'image':{'url':cover_url},'caption':details}),bufferpotify=await spotify[_0xabf9c9(0x193)]();return await message[_0xabf9c9(0x19a)][_0xabf9c9(0x19c)](message[_0xabf9c9(0x19e)],{'audio':bufferpotify});
   })



//============================================================================================================================================
command({
    pattern: "save",
    fromMe: true,
    desc: "turn on",
    dontAddCommandList: true,
    type: "admin",

 },
 async (message, match, m) => {
let jid = STORAGE_JID

   return await message.client.relayMessage(jid, m.quoted.message, { messageId: m.quoted.key.id,});
});



//============================================================================================================================================
command({
  pattern: "vv",
  fromMe: isPrivate,
  desc: "Forwards The View once messsage",
  type: "tool",
},
async (message, match, m) => {
 // if (message.reply_message.mtype != "viewOnceMessageV2") return await message.treply("_Not a View Once_");
  let buff = await m.quoted.download();
  let jid = STORAGE_JID
  return await message.client.sendMessage(jid, buff);
}
);



//============================================================================================================================================
command({
  pattern: "ig ?(.*)",
  fromMe: isPrivate,
  desc: "downloads video from instagram",
  type: "downloader",
}, async (message, match, m) => {
const _0x2c2317=_0x4ebd;(function(_0xe0ea16,_0x115a55){const _0x1d0c6b=_0x4ebd,_0x8f0594=_0xe0ea16();while(!![]){try{const _0xa7f399=-parseInt(_0x1d0c6b(0x122))/0x1*(-parseInt(_0x1d0c6b(0x138))/0x2)+parseInt(_0x1d0c6b(0x131))/0x3+-parseInt(_0x1d0c6b(0x129))/0x4*(-parseInt(_0x1d0c6b(0x125))/0x5)+-parseInt(_0x1d0c6b(0x132))/0x6+-parseInt(_0x1d0c6b(0x135))/0x7+parseInt(_0x1d0c6b(0x12b))/0x8*(-parseInt(_0x1d0c6b(0x128))/0x9)+parseInt(_0x1d0c6b(0x127))/0xa*(parseInt(_0x1d0c6b(0x137))/0xb);if(_0xa7f399===_0x115a55)break;else _0x8f0594['push'](_0x8f0594['shift']());}catch(_0x283ad2){_0x8f0594['push'](_0x8f0594['shift']());}}}(_0x240d,0xf35c6));function _0x4ebd(_0x897cd0,_0x531c35){const _0x240d58=_0x240d();return _0x4ebd=function(_0x4ebde8,_0x352495){_0x4ebde8=_0x4ebde8-0x122;let _0x4097e5=_0x240d58[_0x4ebde8];return _0x4097e5;},_0x4ebd(_0x897cd0,_0x531c35);}const instagramGetUrl=require(_0x2c2317(0x123));let arg=match;if(arg[_0x2c2317(0x136)]===0x0)return message[_0x2c2317(0x12d)]('Where\x20is\x20the\x20link?');let urlInsta=arg;function _0x240d(){const _0xdfad75=['8198934AXDJiE','jid','split','2541259LUFFTq','length','264BUJAAN','1338fYtenu','617vzQZgK','instagram-url-direct','Done','620650QNvBsJ','instagram.com/p/','152800yeqWsE','44208kPiLGh','28siHBOy','includes','568XQmMod','client','sendMessage','url_list','instagram.com/reel/','The\x20link\x20you\x20provided\x20is\x20not\x20a\x20instagram\x20link\x0a\x0a','4280043DXurOf'];_0x240d=function(){return _0xdfad75;};return _0x240d();}if(!(urlInsta['includes'](_0x2c2317(0x126))||urlInsta[_0x2c2317(0x12a)](_0x2c2317(0x12f))||urlInsta[_0x2c2317(0x12a)]('instagram.com/tv/')))return message['client'][_0x2c2317(0x12d)](message['jid'],{'text':_0x2c2317(0x130)+urlInsta});if(urlInsta[_0x2c2317(0x12a)]('?'))urlInsta=urlInsta[_0x2c2317(0x134)]('/?')[0x0];let res=await instagramGetUrl(urlInsta);for(let i of res[_0x2c2317(0x12e)]){await message['sendFromUrl'](i,{'filename':'InstaDl','quoted':message});}return await message[_0x2c2317(0x12c)][_0x2c2317(0x12d)](message[_0x2c2317(0x133)],{'text':_0x2c2317(0x124)});

});




//============================================================================================================================================
command({
  pattern: "ttk",
  fromMe: true,
  desc: "Download TikTok Videos",
  dontAddCommandList: true,
  type: "download",

},
async (message, match, m) => {
function _0x3336(_0x15a697,_0x175eac){const _0x4ef018=_0x4ef0();return _0x3336=function(_0x333682,_0x443cef){_0x333682=_0x333682-0x1f0;let _0xa5cc1c=_0x4ef018[_0x333682];return _0xa5cc1c;},_0x3336(_0x15a697,_0x175eac);}const _0x5574d4=_0x3336;(function(_0x21d238,_0x188733){const _0xb74364=_0x3336,_0x5cb504=_0x21d238();while(!![]){try{const _0x4ba520=parseInt(_0xb74364(0x1f1))/0x1+parseInt(_0xb74364(0x1ff))/0x2+parseInt(_0xb74364(0x1f7))/0x3*(-parseInt(_0xb74364(0x208))/0x4)+-parseInt(_0xb74364(0x1f8))/0x5*(-parseInt(_0xb74364(0x1f4))/0x6)+-parseInt(_0xb74364(0x209))/0x7+-parseInt(_0xb74364(0x207))/0x8*(parseInt(_0xb74364(0x206))/0x9)+parseInt(_0xb74364(0x201))/0xa;if(_0x4ba520===_0x188733)break;else _0x5cb504['push'](_0x5cb504['shift']());}catch(_0x5cfc9e){_0x5cb504['push'](_0x5cb504['shift']());}}}(_0x4ef0,0xe0e99));let args=match;if(!args)message[_0x5574d4(0x1f6)](_0x5574d4(0x1fe));message[_0x5574d4(0x1f6)](_0x5574d4(0x1f5));if(!args[_0x5574d4(0x204)](/tiktok/gi))message[_0x5574d4(0x1f6)](_0x5574d4(0x1fa));try{let p=await fg['tiktok'](args),te=_0x5574d4(0x205)+p[_0x5574d4(0x1f9)]+_0x5574d4(0x200)+p[_0x5574d4(0x20b)]+'\x0a┃✧╰───────────────\x0a╰═════════════════⊷';message[_0x5574d4(0x1f6)](p['nowm'],{'caption':tex},_0x5574d4(0x1f0));}catch{try{const {author:{nickname},video,description}=await instagramdl(args)[_0x5574d4(0x202)](async _0x2337d9=>await tiktokdlv2(args))['catch'](async _0x1e4561=>await tiktokdlv3(args)),url=video[_0x5574d4(0x1f3)]||video[_0x5574d4(0x1fc)]||_0x5574d4(0x1f2)+video[_0x5574d4(0x1fd)]||video['no_watermark_hd'];if(!url)message[_0x5574d4(0x1f6)](_0x5574d4(0x20a));let tex=_0x5574d4(0x1fb)+nickname+'\x20'+(description?'\x0a▢\x20*Descripción:*\x20'+description:'')+_0x5574d4(0x203);message[_0x5574d4(0x1f6)](url,{'caption':tex},_0x5574d4(0x1f0));}catch{message[_0x5574d4(0x1f6)](_0x5574d4(0x20a));}}function _0x4ef0(){const _0xe9931b=['author','_Not\x20a\x20valid\x20Link_','\x0a╭═══〘\x20SERVER\x202\x20〙═══⊷❍\x0a┃✧╭──────────────\x0a┃✧│*Nickname:*\x20','no_watermark','no_watermark_raw','_Url\x20Missing!_','1081466lYgYqT','\x0a┃✧│*Descripción:*\x20','25125310cYgrNh','catch','\x0a┃✧╰───────────────\x0a╰═════════════════⊷','match','\x0a\x0a╭═══〘\x20SERVER\x201\x20〙═══⊷❍\x0a┃✧╭──────────────\x0a┃✧│*Username:*\x20','9pCELof','11186240MiwnDm','1004BUNuZA','11229141KfFDmI','_Process\x20Failed_','title','video','550619UjIgdM','https://tikcdn.net','no_watermark2','228TAJzLZ','_Downloading..._','sendMessage','3297ATvlTg','78375poqWzy'];_0x4ef0=function(){return _0xe9931b;};return _0x4ef0();}
 })





//============================================================================================================================================



let file = require.resolve(__filename)
fs.watchFile(file, () => {
	fs.unwatchFile(file)
	console.log(chalk.redBright(`Update"${__filename}"`))
	delete require.cache[file]
	require(file)
})




command({
  pattern: "alive",
  fromMe: true,
  desc: "Download TikTok Videos",
  dontAddCommandList: true,
  type: "download",

},
async (message, match, m) => {
message.sendMessage(config.ALIVE) 
})


// Thanks to Abu ser

let MFOR_TITLE = "WhatsBotAlfa-MD"
let MFOR_BODY = "sᴏᴜɴᴅ : ▮▮▮▮▮▮▯▯▯"
let MFOR_MEDIA_URL = 'https://www.instagram.com/alienalfa'
let MFOR_SOURCE_URL = 'https://www.instagram.com/alienalfa'


command({on: 'text' ,fromMe: false}, (async (message, match) => {
  //if(!MENTION.includes(message.jid)) return;
function _0x5dbb(_0x1b65a4,_0x467a64){var _0x264ea4=_0x264e();return _0x5dbb=function(_0x5dbb2c,_0x34eacc){_0x5dbb2c=_0x5dbb2c-0xb3;var _0x2ff7f3=_0x264ea4[_0x5dbb2c];return _0x2ff7f3;},_0x5dbb(_0x1b65a4,_0x467a64);}var _0x32b50c=_0x5dbb;(function(_0x54ebd2,_0x3c1575){var _0x1d7c6a=_0x5dbb,_0x14a894=_0x54ebd2();while(!![]){try{var _0x152a16=parseInt(_0x1d7c6a(0xc5))/0x1+parseInt(_0x1d7c6a(0xb7))/0x2*(parseInt(_0x1d7c6a(0xc8))/0x3)+-parseInt(_0x1d7c6a(0xbb))/0x4+-parseInt(_0x1d7c6a(0xb8))/0x5*(-parseInt(_0x1d7c6a(0xba))/0x6)+-parseInt(_0x1d7c6a(0xb9))/0x7*(parseInt(_0x1d7c6a(0xbf))/0x8)+-parseInt(_0x1d7c6a(0xc2))/0x9*(-parseInt(_0x1d7c6a(0xc7))/0xa)+-parseInt(_0x1d7c6a(0xc0))/0xb;if(_0x152a16===_0x3c1575)break;else _0x14a894['push'](_0x14a894['shift']());}catch(_0x2a123a){_0x14a894['push'](_0x14a894['shift']());}}}(_0x264e,0xb22e6));var duration=[0xbebc74b,0x3d0770,0x15751bf0],audios=MENTION_AUD,tit=_0x32b50c(0xbc),art=_0x32b50c(0xca),logo=MENTION_IMG[_0x32b50c(0xb6)](',');const image=logo[Math[_0x32b50c(0xcb)](Math['random']()*logo[_0x32b50c(0xc6)])],image1=await jslbuffer(image),resimg=await jslbuffer(image),audio=await jslbuffer(audios);let fake=duration[Math[_0x32b50c(0xcb)](Math['random']()*duration[_0x32b50c(0xc6)])]||![];function _0x264e(){var _0x2dc094=['Error\x20on\x20parsing\x20audio\x20\x0a','Automation','floor','jid','includes','audio/mpeg','mention','split','134032sRvklc','4242835UggtrG','7184555BfmNcv','6CbnTxD','3421348CHlvXp','AlienAlfa','mp4','sendMessage','8ViKekT','7707315wzObzn','mention_msg.mp3','282753mDEKcx','random','client','819543RWrXaG','length','310gjsNuT','30KPwSdb'];_0x264e=function(){return _0x2dc094;};return _0x264e();}var jids=audios[_0x32b50c(0xb6)](',')['filter'](_0x408ae3=>_0x408ae3[_0x32b50c(0xb3)](_0x32b50c(0xbd)));try{var men=message[_0x32b50c(0xb5)][0x0]['split']('@')[0x0];}catch{return;}message[_0x32b50c(0xb5)]&&message['mention'][0x0]&&SUDO[_0x32b50c(0xb3)](men)&&getAudioBufferFromLink(jids[Math['floor'](Math[_0x32b50c(0xc3)]()*jids[_0x32b50c(0xc6)])],async function(_0x41e211){var _0xe47fa1=_0x32b50c;if(_0x41e211){try{var _0x757bef=await addInfo(_0xe47fa1(0xc1),tit,art,'Alfa\x20audio\x20metadata',await jslbuffer(image));}catch(_0x4df21b){return await message[_0xe47fa1(0xbe)](_0xe47fa1(0xc9)+_0x4df21b);}return message[_0xe47fa1(0xc4)]['sendMessage'](message[_0xe47fa1(0xcc)],{'audio':_0x757bef,'second':fake,'mimetype':_0xe47fa1(0xb4),'ptt':!![],'waveform':[0x0,0x63,0x37,0x63,0x0,0x63,0x37,0x63,0x0,0x63,0x37,0x63,0x37,0x63,0x0],'contextInfo':{'externalAdReply':{'title':MFOR_TITLE,'body':MFOR_BODY,'mediaType':0x2,'thumbnail':resimg,'mediaUrl':MFOR_MEDIA_URL,'sourceUrl':MFOR_SOURCE_URL}}},{'quoted':message});}});
}));



let TTS_TITLE = "ᴛᴇxᴛ ᴄᴏɴᴠᴇʀᴛᴇʀ"
let TTS_BODY = "ᴠᴏɪᴄᴇ : ▮▮▮▮▮▮▯▯▯"
let TTS_MEDIA_URL = 'https://www.instagram.com/alienalfa'
let TTS_SOURCE_URL = 'https://github.com/Alien-Alfa/WhatsBotAlfa-MD'

command
	(
		{
			pattern: "tts ?(.*)",
			fromMe: isPublic,
			desc: "Convert Text To Audio",
			type: "misc",
		},
		async (message, match) => {
      const _0x4b0f73=_0x5588;(function(_0x81cd92,_0x97af2f){const _0x17cb9f=_0x5588,_0xfcb40e=_0x81cd92();while(!![]){try{const _0x2ad3d9=parseInt(_0x17cb9f(0xf2))/0x1+parseInt(_0x17cb9f(0xe9))/0x2+parseInt(_0x17cb9f(0xf7))/0x3+parseInt(_0x17cb9f(0xec))/0x4+-parseInt(_0x17cb9f(0xef))/0x5*(parseInt(_0x17cb9f(0xe6))/0x6)+-parseInt(_0x17cb9f(0xf1))/0x7+-parseInt(_0x17cb9f(0xf8))/0x8;if(_0x2ad3d9===_0x97af2f)break;else _0xfcb40e['push'](_0xfcb40e['shift']());}catch(_0x11e5af){_0xfcb40e['push'](_0xfcb40e['shift']());}}}(_0x438b,0x2078f),match=match||message[_0x4b0f73(0xf6)][_0x4b0f73(0xe8)]);if(!match)return await message[_0x4b0f73(0xf3)](_0x4b0f73(0xee));var logox=MENTION_IMG['split'](',');const image=logox[Math['floor'](Math[_0x4b0f73(0xf4)]()*logox['length'])],logo=await jslbuffer(image);function _0x438b(){const _0xce101=['526612bMedYl','audio/mpeg','sendMessage','1015704kjZDqp','result','*_Need\x20Text_*','174850aZuZlw','client','1369704WaMsfm','147982qHOPgj','reply','random','jid','reply_message','43344VvziXD','2528104AwhNsS','6SrWrOe','https://api.akuari.my.id/texttovoice/texttosound_english?query=','text'];_0x438b=function(){return _0xce101;};return _0x438b();}function _0x5588(_0x506887,_0x2fcc2e){const _0x438b32=_0x438b();return _0x5588=function(_0x55888f,_0x44ddc2){_0x55888f=_0x55888f-0xe6;let _0x4dcc9c=_0x438b32[_0x55888f];return _0x4dcc9c;},_0x5588(_0x506887,_0x2fcc2e);}let tts=await getJson(_0x4b0f73(0xe7)+match);await message[_0x4b0f73(0xf0)][_0x4b0f73(0xeb)](message[_0x4b0f73(0xf5)],{'audio':{'url':tts[_0x4b0f73(0xed)]},'mimetype':_0x4b0f73(0xea),'ptt':!![],'waveform':[0x0,0x63,0x0,0x63,0x0,0x63,0x0],'contextInfo':{'externalAdReply':{'title':TTS_TITLE,'body':TTS_BODY,'mediaType':0x1,'thumbnail':logo,'mediaUrl':TTS_MEDIA_URL,'sourceUrl':TTS_SOURCE_URL}}},{'quoted':message});
	}
);