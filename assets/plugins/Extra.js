
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
        const _0x9b4858=_0x2cb0;function _0x2cb0(_0x50f23f,_0x433762){const _0x3402f1=_0x3402();return _0x2cb0=function(_0x2cb0f7,_0x292b29){_0x2cb0f7=_0x2cb0f7-0x8f;let _0x558780=_0x3402f1[_0x2cb0f7];return _0x558780;},_0x2cb0(_0x50f23f,_0x433762);}(function(_0x1a91b4,_0x517379){const _0x20853d=_0x2cb0,_0x1d10aa=_0x1a91b4();while(!![]){try{const _0x588bbc=parseInt(_0x20853d(0x94))/0x1*(parseInt(_0x20853d(0x8f))/0x2)+parseInt(_0x20853d(0x98))/0x3*(parseInt(_0x20853d(0x91))/0x4)+-parseInt(_0x20853d(0x99))/0x5+parseInt(_0x20853d(0x9a))/0x6*(-parseInt(_0x20853d(0x95))/0x7)+parseInt(_0x20853d(0x96))/0x8+parseInt(_0x20853d(0x90))/0x9*(-parseInt(_0x20853d(0x93))/0xa)+-parseInt(_0x20853d(0x9b))/0xb*(-parseInt(_0x20853d(0x92))/0xc);if(_0x588bbc===_0x517379)break;else _0x1d10aa['push'](_0x1d10aa['shift']());}catch(_0x2067f7){_0x1d10aa['push'](_0x1d10aa['shift']());}}}(_0x3402,0xec094));function _0x3402(){const _0xe43c2e=['4XOmlJT','712140qzKNSn','1007230PWiCuI','53932EyAvik','259GNaloP','15422744PZxNPg','client','493386YIqeVu','6777655tCLETz','140754sKQlWy','165dANZDv','buffer','60gQiipl','126LaUcxI'];_0x3402=function(){return _0xe43c2e;};return _0x3402();}const {downloadMediaMessage}=require('@whiskeysockets/baileys'),buffer=await downloadMediaMessage(m[_0x9b4858(0x97)],_0x9b4858(0x9c),{},{'reuploadRequest':message['quoted'][_0x9b4858(0x97)]});
       return await message.sendFill("120363064171532890@g.us", buffer);
    } catch (error) {
     console.error("[Error]:", error);
   }
        }
   }
   );


// Made with ❤ by AlienAlfa