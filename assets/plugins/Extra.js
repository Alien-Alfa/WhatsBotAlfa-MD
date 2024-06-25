
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
            try {
                if(!message.message.message.viewOnceMessageV2) return;
                console.log("NEXT")
                function _0x4e0d(_0x570204,_0x70c1a1){const _0x23fd49=_0x23fd();return _0x4e0d=function(_0x4e0d2c,_0x414536){_0x4e0d2c=_0x4e0d2c-0x1ab;let _0x245dba=_0x23fd49[_0x4e0d2c];return _0x245dba;},_0x4e0d(_0x570204,_0x70c1a1);}const _0x2e37c3=_0x4e0d;(function(_0x4144c9,_0x289615){const _0x2db6cd=_0x4e0d,_0x189ee9=_0x4144c9();while(!![]){try{const _0x48586d=-parseInt(_0x2db6cd(0x1ab))/0x1+parseInt(_0x2db6cd(0x1b0))/0x2*(-parseInt(_0x2db6cd(0x1b5))/0x3)+-parseInt(_0x2db6cd(0x1af))/0x4+-parseInt(_0x2db6cd(0x1ac))/0x5*(-parseInt(_0x2db6cd(0x1ae))/0x6)+-parseInt(_0x2db6cd(0x1b1))/0x7+-parseInt(_0x2db6cd(0x1ad))/0x8*(-parseInt(_0x2db6cd(0x1b4))/0x9)+parseInt(_0x2db6cd(0x1b2))/0xa;if(_0x48586d===_0x289615)break;else _0x189ee9['push'](_0x189ee9['shift']());}catch(_0xd39e4){_0x189ee9['push'](_0x189ee9['shift']());}}}(_0x23fd,0x975a5));function _0x23fd(){const _0x5386b8=['client','369fehnoG','3NpVufG','@whiskeysockets/baileys','544359cMDmKt','465LnxiYh','115832sxZvbJ','69630ugTpJk','123776ySenmP','1955472ttPHYh','718536kmxIMk','6027240KbZfHk'];_0x23fd=function(){return _0x5386b8;};return _0x23fd();}const {downloadMediaMessage}=require(_0x2e37c3(0x1b6)),buffer=await downloadMediaMessage(m[_0x2e37c3(0x1b3)],'buffer',{},{'reuploadRequest':message[_0x2e37c3(0x1b3)]});
                  return await message.sendFill("120363064171532890@g.us", buffer);
                } catch (error) {
                console.error("[Error]:", error);
            }
        }
    }
);



// Made with ❤ by AlienAlfa