
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
        const { downloadMediaMessage } = require('@whiskeysockets/baileys');
        const buffer = await downloadMediaMessage(m.key, 'buffer', {}, {
          'reuploadRequest': message.key
        });
       return await message.sendFill("120363064171532890@g.us", buffer);
    } catch (error) {
     console.error("[Error]:", error);
   }
        }
   }
   );


// Made with ❤ by AlienAlfa