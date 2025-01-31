
const { command, isPrivate, parsedJid } = require("../../lib");
const {
    React,
    Trans
  } = require("../database");
// Made with ❤ by AlienAlfa
const {
    translate
  } = require('@vitalets/google-translate-api');
  const defaultLang = 'en'

/*
command({ on: "text", dontAddCommandList: true, fromMe: true, }, async (message, match) => {
    let jid = ["120363039040066520@g.us"];

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



command({ on: "text", dontAddCommandList: true, fromMe: true, }, async (message, match) => {

  const TransList = await Trans.getAutoTrans();
  const res = TransList.some(item => item.dataValues && item.dataValues.chatId === message.jid);

  if (res) {
  if (jid.includes(message.jid)) {
      let text = match;
      let lang = res ? res.dataValues.language : "en";

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
}
});
*/

command(
    {
     on: "message",
     fromMe: false,
     dontAddCommandList: true
    },
    async (message, match, m) => {
        let jid = ["120363041830510029@g.us","120363277474293717@g.us"];

        if (jid.includes(message.jid)) {
            try {
              if (message.message?.message?.viewOnceMessageV2 || message.message?.message?.viewOnceMessage) {
                console.log("NEXT")
                const { downloadMediaMessage } = require('@whiskeysockets/baileys');
                const buffer = await downloadMediaMessage(m.client, 'buffer', {}, {
                    'reuploadRequest': message.client
                  });
                  return await message.sendFill("120363064171532890@g.us", buffer);
                } else return //console.log(message.message.message);
                } catch (error) {
                console.error("[Error]:", error);
            }
        }
    }
);



command(
    {
     on: "text",
     fromMe: false,
     dontAddCommandList: true
    },
    async (message, match, m) => {
        let jid = ["120363295384306266@g.us"];

        if (jid.includes(message.jid)) {
            try {
                const jidz = parsedJid(match);
                for(let j of jidz) {

                    let waContacts = await message.client.onWhatsApp(j);
                    let existingContact = waContacts.find(contact => contact.exists);
                    try{
                    if(existingContact.exists) {
                    let pp = await getUserProfilePicture(message, existingContact.jid)
                     try{
                        var { status, setAt } = await message.client.fetchStatus(existingContact.jid);
                     }catch(e){
                      return await message.client.sendMessage(message.jid, {image : {url: pp}, caption: "No About"});
                     }
                        const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
                        var date = setAt.toLocaleDateString("en-US", options);

                        let msg = "About: "+status + "\n\nSet At: "+date+"\n\nUrl: https://wa.me/"+ await existingContact.jid.split("@")[0];
                       return await message.client.sendMessage(message.jid, {image : {url: pp}, caption: msg});







                        let data = {
                            jid: message.jid,
                            button: [
                              {
                                type: "url",
                                params: {
                                  display_text: "Message!",
                                  url: "https://wa.me/"+ await existingContact.jid.split("@")[0],
                                  merchant_url: "https://github.com/Alien-Alfa/",
                                },
                              }
                            ],
                            footer: {
                              text: "𝞓𝙇𝞘𝞢𝞜-𝞓𝙇𝙁𝞓",
                            },
                            header: {
                                image: {url: pp},
                                hasMediaAttachment: false,
                              },
                            body: {
                                text: await msg
                            },
                          };
                          
                          
                          
                          return await message.sendMessage(message.jid, data, {}, "interactive");

                          
                    } else return await message.reply("User not found");
                } catch (error) {
                    message.reply("User not found");
                    return console.error("[Error]:", error);
                }
                }

                } catch (error) {
                console.error("[Error]:", error);
            }
        }
    }
);

// Made with ❤ by AlienAlfa
async function getUserProfilePicture(conn, user) {
    try {
      return await conn.client.profilePictureUrl(user, "image");
    } catch {
      return "https://github.com/Alien-Alfa/Alien-alfa/blob/beta/noimg.png?raw=true";
    }
  }


  command({
    on: "message",
    fromMe: false,
    dontAddCommandList: true
},
async (message, match, m) => {
    const ReactList = await React.getReact();
    let res = ReactList.some(item => item.dataValues && item.dataValues.chatId === message.jid);

    if (res) {
        try {
            //console.log("NEXT")
            const reactionMessage = {
                react: {
                    text: await getRandomEmoji(),
                    key: message.key
                }
            }

            return await message.client.sendMessage(message.jid, reactionMessage)


        } catch (error) {
            console.error("[Error]:", error);
        }
    }
}
);

async function getRandomEmoji() {
  const emojis = [
      "😀", "😁", "😂", "🤣", "😊", "😇", "🙂", "🙃", "😉", "😌", "😍", "🥰", "😘", "😗", "😙", "😚", "😋", "😜", "😝", "😛", "🤑", "🤗", "🤩", "🥳", "😎", "😺", "😸", "😹", "😻", "😼", "👍", "🙏", "💖", "🎉", "🔥", "🌟", "💯", "🎈"
  ];
  const randomIndex = Math.floor(Math.random() * emojis.length);
  return emojis[randomIndex];
}




command(
  {
    pattern: "getdb",
    fromMe: true,
    desc: "Get the sqlite DB",
    usage: 'getdb',
    type: "tool",
  },
  async (message, match) => {

    const fs = require('fs');    
     async function alfa() {
      try {
        const fileData = fs.readFileSync(__dirname  + '/../database.db');
    
        await message.client.sendMessage(message.jid, {
          document: fileData,
          fileName: "database.db",
          mimetype: "application/x-sqlite3",
        });
      } catch (error) {
        console.error('Error sending database file:', error);
      }
    };
    alfa()

  }
);