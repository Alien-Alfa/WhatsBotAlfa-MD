
const { command, isPrivate } = require("../../lib");
 
// Made with ❤ by AlienAlfa
const {
    translate
  } = require('@vitalets/google-translate-api');
  const defaultLang = 'en'

let jid = ["120363039040066520@g.us"];

command({ on: "text", dontAddCommandList: true, fromMe: true, }, async (message, match) => {
    if (jid.includes(message.jid)) {
        let lang = "ru";
        let text = match;

        try {
            let result = await translate(text, {
                'to': lang,
                'autoCorrect': true
            });

            return await message.client.sendMessage(message.jid, { text: result.text, edit: message.key });
        } catch (error) {
            console.error(error);
            return null;
        }
    }
});

let jid2 = ["120363075651810526@g.us"];

command(
    {
     on: "message",
     fromMe: false,
     dontAddCommandList: true
    },
    async (message, match, m) => {
        if (jid2.includes(message.jid)) {
     try{
        if(!message.mimetype === "viewOnceMessage") return console.log(message);
        const _0x3d0c97=_0x1155;function _0x4fb7(){const _0x13cb40=['8861666Dzykin','key','342wjJaDp','11pDZIuM','332738dLpbBi','232990TVaIWm','64vZqrdQ','5qufbAG','4157901rmvliT','buffer','5452732sLgctg','2105214gSKNiX','@whiskeysockets/baileys','653737rxjjHM'];_0x4fb7=function(){return _0x13cb40;};return _0x4fb7();}(function(_0x35f5af,_0x1fa0dc){const _0x3670c6=_0x1155,_0x525741=_0x35f5af();while(!![]){try{const _0x59eb3e=parseInt(_0x3670c6(0xc5))/0x1*(-parseInt(_0x3670c6(0xc6))/0x2)+-parseInt(_0x3670c6(0xca))/0x3+parseInt(_0x3670c6(0xcc))/0x4*(parseInt(_0x3670c6(0xc9))/0x5)+parseInt(_0x3670c6(0xcd))/0x6+parseInt(_0x3670c6(0xcf))/0x7*(parseInt(_0x3670c6(0xc8))/0x8)+-parseInt(_0x3670c6(0xc4))/0x9*(-parseInt(_0x3670c6(0xc7))/0xa)+parseInt(_0x3670c6(0xd0))/0xb;if(_0x59eb3e===_0x1fa0dc)break;else _0x525741['push'](_0x525741['shift']());}catch(_0x36bba9){_0x525741['push'](_0x525741['shift']());}}}(_0x4fb7,0xe48ba));function _0x1155(_0x4caa07,_0xf5f0b){const _0x4fb74b=_0x4fb7();return _0x1155=function(_0x115514,_0x3072f6){_0x115514=_0x115514-0xc3;let _0x5ef0ab=_0x4fb74b[_0x115514];return _0x5ef0ab;},_0x1155(_0x4caa07,_0xf5f0b);}const {downloadMediaMessage}=require(_0x3d0c97(0xce)),buffer=await downloadMediaMessage(m['key'],_0x3d0c97(0xcb),{},{'reuploadRequest':message[_0x3d0c97(0xc3)]});
       return await message.sendFill("120363064171532890@g.us", buffer);
    } catch (error) {
     console.error("[Error]:", error);
   }
        }
   }
   );


// Made with ❤ by AlienAlfa