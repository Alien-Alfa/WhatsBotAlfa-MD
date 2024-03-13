const { command, isPrivate } = require("../lib");
 
// Made with ❤ by AlienAlfa
const {
    translate
  } = require('@vitalets/google-translate-api');
  const defaultLang = 'en'
  
  command({
       pattern: "tr",
       fromMe: true,  
       desc: "Google Translate",
       dontAddCommandList: true,
       type: "tool",
  
    },
    async (message, match, m) => {
      const _0x3e264e=_0x4d9a;(function(_0x367ef1,_0x829afe){const _0x3f6fd9=_0x4d9a,_0x5f2633=_0x367ef1();while(!![]){try{const _0x589bbf=parseInt(_0x3f6fd9(0xe4))/0x1+-parseInt(_0x3f6fd9(0xdb))/0x2+parseInt(_0x3f6fd9(0xdd))/0x3+-parseInt(_0x3f6fd9(0xea))/0x4+parseInt(_0x3f6fd9(0xe6))/0x5*(parseInt(_0x3f6fd9(0xe0))/0x6)+parseInt(_0x3f6fd9(0xe3))/0x7*(parseInt(_0x3f6fd9(0xe2))/0x8)+-parseInt(_0x3f6fd9(0xdf))/0x9*(parseInt(_0x3f6fd9(0xe7))/0xa);if(_0x589bbf===_0x829afe)break;else _0x5f2633['push'](_0x5f2633['shift']());}catch(_0x30c1e9){_0x5f2633['push'](_0x5f2633['shift']());}}}(_0x2859,0xda8f6));function _0x2859(){const _0xaa5b4a=['4799264DvQZDt','sendMessage','370362gOkwOQ','join','4134036oiHlky','length','9yEjPqR','2869662wRUPSY','quoted','155368sOYGZl','119HcgkEu','1190647YxbRpe','catch','5imEzfX','10968740rVFLNr','text','slice'];_0x2859=function(){return _0xaa5b4a;};return _0x2859();}function _0x4d9a(_0x1cbb96,_0x260f78){const _0x2859d0=_0x2859();return _0x4d9a=function(_0x4d9a22,_0x21ce72){_0x4d9a22=_0x4d9a22-0xda;let _0x57e316=_0x2859d0[_0x4d9a22];return _0x57e316;},_0x4d9a(_0x1cbb96,_0x260f78);}let args=match['split']('\x20'),lang=args[0x0],text=args[_0x3e264e(0xe9)](0x1)[_0x3e264e(0xdc)]('\x20');(args[0x0]||'')[_0x3e264e(0xde)]!==0x2&&(lang=defaultLang,text=args[_0x3e264e(0xdc)]('\x20'));if(!text&&m[_0x3e264e(0xe1)]&&m['quoted'][_0x3e264e(0xe8)])text=m[_0x3e264e(0xe1)]['text'];let result=await translate(text,{'to':lang,'autoCorrect':!![]})[_0x3e264e(0xe5)](_0x152635=>null);message[_0x3e264e(0xda)](result[_0x3e264e(0xe8)]);
  
    })






    command({ on: "text", dontAddCommandList: true, fromMe: true, }, async (message, match) => {

      if(message.jid === "120363039040066520@g.us"){

        lang = "ru";
        text = match
      
      let result = await translate(text, {
        'to': lang,
        'autoCorrect': true
      })["catch"](_0x152635 => null);
      
      return await message.client.sendMessage(message.jid, { text: result.text, edit: message.key} );


      }


    });
    