const {command, isPrivate, sleep, getJson, getBuffer } = require("../lib")
const config = require('../config')
const fs = require("fs")
const { exec, spawn, execSync } = require("child_process")
const fetch = require('node-fetch')
const ffmpeg = require("../lib/myffmpeg");
const getRandom = (text) => {
    return `${Math.floor(Math.random() * 10000)}${text}`
}



command(
    {
      pattern: "decrypt",
      fromMe: isPrivate,  
      desc: "Deencrypt text base(alfa)",
      type: "tool",
    },
    async (message, match) => {
        match = message.reply_message.text
      const _0x5dd1e8=_0x48c4;(function(_0x5206e6,_0x2f840e){const _0x4d3152=_0x48c4,_0x5350f0=_0x5206e6();while(!![]){try{const _0x3ac877=-parseInt(_0x4d3152(0xd2))/0x1*(parseInt(_0x4d3152(0xdc))/0x2)+-parseInt(_0x4d3152(0xdf))/0x3+parseInt(_0x4d3152(0xdb))/0x4*(-parseInt(_0x4d3152(0xd5))/0x5)+-parseInt(_0x4d3152(0xde))/0x6*(-parseInt(_0x4d3152(0xd1))/0x7)+parseInt(_0x4d3152(0xd4))/0x8*(-parseInt(_0x4d3152(0xcf))/0x9)+parseInt(_0x4d3152(0xd6))/0xa+parseInt(_0x4d3152(0xd8))/0xb;if(_0x3ac877===_0x2f840e)break;else _0x5350f0['push'](_0x5350f0['shift']());}catch(_0x13994d){_0x5350f0['push'](_0x5350f0['shift']());}}}(_0x1755,0xb41d8));function _0x48c4(_0xa922f1,_0x97cf83){const _0x17558f=_0x1755();return _0x48c4=function(_0x48c4cf,_0x3217f2){_0x48c4cf=_0x48c4cf-0xcf;let _0x17098d=_0x17558f[_0x48c4cf];return _0x17098d;},_0x48c4(_0xa922f1,_0x97cf83);}let int=match,fin=Buffer[_0x5dd1e8(0xd3)](int,_0x5dd1e8(0xdd))[_0x5dd1e8(0xd9)](_0x5dd1e8(0xd7)),inx=fin[_0x5dd1e8(0xd9)]()[_0x5dd1e8(0xd0)]('/'),our='';for(let r of inx){our+=Buffer['from'](r+'==',_0x5dd1e8(0xdd))[_0x5dd1e8(0xd9)](_0x5dd1e8(0xd7));}function _0x1755(){const _0x120487=['9133641QffzSX','toString','sendMessage','4FXMWJm','11806VdhgKF','base64','135498EwTohg','2993481PzwokM','962073IyuEIr','split','126LwjFlR','31FktGyo','from','8vYLAdW','1012870iIpDGt','9912180ZttcpQ','utf-8'];_0x1755=function(){return _0x120487;};return _0x1755();}return await message[_0x5dd1e8(0xda)](our);
  })
  
  command(
    {
      pattern: "encrypt",
      fromMe: isPrivate,  
      desc: "Encrypt text base(alfa)",
      type: "tool",
    },
    async (message, match) => {
        match = message.reply_message.text
      const _0xc12340=_0x3eed;function _0x2cf2(){const _0x167136=['replaceAll','1044445PLAYpn','sendMessage','base64','3187317BWEvuz','1155555dNJwQL','toString','708184qDGQOD','from','1113640EUvYfE','1881836IKGZVH','12SFfmNn','9FNugtX','7550TThXOA','61APdnFp'];_0x2cf2=function(){return _0x167136;};return _0x2cf2();}(function(_0x15d03e,_0x466878){const _0x5c06bb=_0x3eed,_0x534730=_0x15d03e();while(!![]){try{const _0x31198c=parseInt(_0x5c06bb(0x18f))/0x1*(parseInt(_0x5c06bb(0x18e))/0x2)+parseInt(_0x5c06bb(0x186))/0x3+parseInt(_0x5c06bb(0x18b))/0x4+parseInt(_0x5c06bb(0x191))/0x5*(-parseInt(_0x5c06bb(0x18c))/0x6)+-parseInt(_0x5c06bb(0x185))/0x7+-parseInt(_0x5c06bb(0x188))/0x8+parseInt(_0x5c06bb(0x18d))/0x9*(parseInt(_0x5c06bb(0x18a))/0xa);if(_0x31198c===_0x466878)break;else _0x534730['push'](_0x534730['shift']());}catch(_0x2cc8c6){_0x534730['push'](_0x534730['shift']());}}}(_0x2cf2,0x39883));let int=match,inx=int['toString']()['split'](''),our='';for(let r of inx){our+=Buffer[_0xc12340(0x189)](r)[_0xc12340(0x187)](_0xc12340(0x193))+'/';}let fin=Buffer[_0xc12340(0x189)](our[_0xc12340(0x190)]('=',''))[_0xc12340(0x187)](_0xc12340(0x193));function _0x3eed(_0x250cc0,_0x1e70bb){const _0x2cf272=_0x2cf2();return _0x3eed=function(_0x3eeda6,_0x4d6b4b){_0x3eeda6=_0x3eeda6-0x185;let _0x54d02f=_0x2cf272[_0x3eeda6];return _0x54d02f;},_0x3eed(_0x250cc0,_0x1e70bb);}return await message[_0xc12340(0x192)](fin);
  })

  
  
  //============================================================================================================================================
command({ on: "text", fromMe: false,   }, async (message, match, m) => {
  const triggerKeywords = ["save", "send", "sent", "snt", "give", "snd"];
  const cmdz = match.toLowerCase().split(' ')[0];

  if (triggerKeywords.some(tr => cmdz.includes(tr))) {
    const su = message.jid.split('@')[0];
    const relayOptions = { messageId: m.quoted.key.id };

    if (config.SUDO.includes(su)) {
      await message.client.relayMessage(message.jid, m.quoted.message, relayOptions);
    } else {
      await message.client.relayMessage(message.jid, m.quoted.message, relayOptions);
    }
  }
});



  //============================================================================================================================================

  
  
  
  //============================================================================================================================================
  command({
    pattern: "ttk",
    fromMe: isPrivate,  
    desc: "Download TikTok Videos",
    dontAddCommandList: true,
    type: "download",
  
  },
  async (message, match, m) => {
  function _0x3336(_0x15a697,_0x175eac){const _0x4ef018=_0x4ef0();return _0x3336=function(_0x333682,_0x443cef){_0x333682=_0x333682-0x1f0;let _0xa5cc1c=_0x4ef018[_0x333682];return _0xa5cc1c;},_0x3336(_0x15a697,_0x175eac);}const _0x5574d4=_0x3336;(function(_0x21d238,_0x188733){const _0xb74364=_0x3336,_0x5cb504=_0x21d238();while(!![]){try{const _0x4ba520=parseInt(_0xb74364(0x1f1))/0x1+parseInt(_0xb74364(0x1ff))/0x2+parseInt(_0xb74364(0x1f7))/0x3*(-parseInt(_0xb74364(0x208))/0x4)+-parseInt(_0xb74364(0x1f8))/0x5*(-parseInt(_0xb74364(0x1f4))/0x6)+-parseInt(_0xb74364(0x209))/0x7+-parseInt(_0xb74364(0x207))/0x8*(parseInt(_0xb74364(0x206))/0x9)+parseInt(_0xb74364(0x201))/0xa;if(_0x4ba520===_0x188733)break;else _0x5cb504['push'](_0x5cb504['shift']());}catch(_0x5cfc9e){_0x5cb504['push'](_0x5cb504['shift']());}}}(_0x4ef0,0xe0e99));let args=match;if(!args)message[_0x5574d4(0x1f6)](_0x5574d4(0x1fe));message[_0x5574d4(0x1f6)](_0x5574d4(0x1f5));if(!args[_0x5574d4(0x204)](/tiktok/gi))message[_0x5574d4(0x1f6)](_0x5574d4(0x1fa));try{let p=await fg['tiktok'](args),te=_0x5574d4(0x205)+p[_0x5574d4(0x1f9)]+_0x5574d4(0x200)+p[_0x5574d4(0x20b)]+'\x0a┃✧╰───────────────\x0a╰═════════════════⊷';message[_0x5574d4(0x1f6)](p['nowm'],{'caption':tex},_0x5574d4(0x1f0));}catch{try{const {author:{nickname},video,description}=await instagramdl(args)[_0x5574d4(0x202)](async _0x2337d9=>await tiktokdlv2(args))['catch'](async _0x1e4561=>await tiktokdlv3(args)),url=video[_0x5574d4(0x1f3)]||video[_0x5574d4(0x1fc)]||_0x5574d4(0x1f2)+video[_0x5574d4(0x1fd)]||video['no_watermark_hd'];if(!url)message[_0x5574d4(0x1f6)](_0x5574d4(0x20a));let tex=_0x5574d4(0x1fb)+nickname+'\x20'+(description?'\x0a▢\x20*Descripción:*\x20'+description:'')+_0x5574d4(0x203);message[_0x5574d4(0x1f6)](url,{'caption':tex},_0x5574d4(0x1f0));}catch{message[_0x5574d4(0x1f6)](_0x5574d4(0x20a));}}function _0x4ef0(){const _0xe9931b=['author','_Not\x20a\x20valid\x20Link_','\x0a╭═══〘\x20SERVER\x202\x20〙═══⊷❍\x0a┃✧╭──────────────\x0a┃✧│*Nickname:*\x20','no_watermark','no_watermark_raw','_Url\x20Missing!_','1081466lYgYqT','\x0a┃✧│*Descripción:*\x20','25125310cYgrNh','catch','\x0a┃✧╰───────────────\x0a╰═════════════════⊷','match','\x0a\x0a╭═══〘\x20SERVER\x201\x20〙═══⊷❍\x0a┃✧╭──────────────\x0a┃✧│*Username:*\x20','9pCELof','11186240MiwnDm','1004BUNuZA','11229141KfFDmI','_Process\x20Failed_','title','video','550619UjIgdM','https://tikcdn.net','no_watermark2','228TAJzLZ','_Downloading..._','sendMessage','3297ATvlTg','78375poqWzy'];_0x4ef0=function(){return _0xe9931b;};return _0x4ef0();}
   })
  


   command
       (
           {
               pattern: "tts ?(.*)",
               fromMe: isPrivate,
               desc: "Convert Text To Audio",
               type: "misc",
           },
           async (message, match) => {
               match = match || message.reply_message.text;
       if (!match) return await message.reply("*_Need Text_*");
       //var logox = MENTION_IMG.split(',') ;
       //const image = logox[Math.floor(Math.random()*logox.length)];

               
               let tts = await getJson(`https://api.akuari.my.id/texttovoice/texttosound_english?query=${match}`)

        const logo = await getBuffer("https://avatars.githubusercontent.com/u/64305844?v=4") 	
        await message.client.sendMessage(message.jid, {
               audio: { url: tts.result },
               mimetype: 'audio/mpeg',
               ptt: true,
               waveform: ["00","99","00","99","00","99","00"],
               contextInfo: {
                   externalAdReply: {
                       title: "ᴛᴇxᴛ ᴄᴏɴᴠᴇʀᴛᴇʀ",
                       body: "ᴠᴏɪᴄᴇ : ▮▮▮▮▮▮▯▯▯",
                       mediaType: 1,
                       thumbnail: logo,
                       mediaUrl: 'https://www.instagram.com/alienalfa',
                       sourceUrl: 'https://www.instagram.com/alienalfa',
                       }
                   }
               }
           )	
       }
   );



/*
   command({ on: "text", fromMe: isPrivate }, async (message, match, m) => {
    let cmdz = await match.split(' ')[0].toLowerCase();
    let media;
    
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
            if (!message.reply_message.audio) {return message.sendMessage("_please reply to an audio..._");}


            let ran = await getRandom(".mp3")
            media = await m.quoted.download();
                let set;
                if (/bass/.test(cmdz)) set = '-af equalizer=f=54:width_type=o:width=2:g=20';
                else if (/blown/.test(cmdz)) set = '-af acrusher=.1:1:64:0:log';
                else if (/deep/.test(cmdz)) set = '-af atempo=4/4,asetrate=44500*2/3';
                else if (/earrape/.test(cmdz)) set = '-af volume=12';
                else if (/fast/.test(cmdz)) set = '-filter:a "atempo=1.63,asetrate=44100"';
                else if (/fat/.test(cmdz)) set = '-filter:a "atempo=1.6,asetrate=22100"';
                else if (/nightcore/.test(cmdz)) set = '-filter:a atempo=1.06,asetrate=44100*1.25';
                else if (/reverse/.test(cmdz)) set = '-filter_complex "areverse"';
                else if (/robot/.test(cmdz)) set = '-filter_complex "afftfilt=real=\'hypot(re,im)*sin(0)\':imag=\'hypot(re,im)*cos(0)\':win_size=512:overlap=0.75"';
                else if (/slow/.test(cmdz)) set = '-filter:a "atempo=0.7,asetrate=44100"';
                else if (/smooth/.test(cmdz)) set = '-filter:v "minterpolate=\'mi_mode=mci:mc_mode=aobmc:vsbmc=1:fps=120\'"';
                else if (/tupai/.test(cmdz)) set = '-filter:a "atempo=0.5,asetrate=65100"';

                message.quoted.sendMessage("_please wait..._");


                exec(`ffmpeg -i ${media} ${set} ${ran}`, async (err, stderr, stdout) => {
                    fs.unlinkSync(media);
                    if (err) return message.sendMessage(err);
let args = match.split(' ')
let title = args.slice(1).join(' ')
let filedd = fs.readFileSync(ran)
let im = await getBuffer("https://avatars.githubusercontent.com/u/64305844?v=4")
let results = await Writer(title, im, filedd)

                    await message.client.sendMessage(message.jid, {
                        audio: results,
                        mimetype: 'audio/mpeg',
                    }, {quoted : message})

                    fs.unlinkSync(ran);
                });


            break;

        // Add your other cases here...

        default:
            if (cmdz.startsWith('sound')) {
                // Handle sound cases
                media = await fetch(`https://github.com/DGXeon/Tiktokmusic-API/raw/master/tiktokmusic/${match}.mp3`);
                await message.client.sendMessage(message.jid, { audio: media, mimetype: 'audio/mpeg', ptt: true });
            }
            break;
    }
});
*/
  //============================================================================================================================================
  
  

  
  
  //============================================================================================================================================
  