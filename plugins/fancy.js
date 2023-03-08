
const { command, styletext, listall, tiny, isPrivate } = require("../lib/");
const axios = require("axios");


command({
    pattern: "fancy",
    fromMe: isPrivate,
    desc: "converts text to fancy text",
    type: "tool",
  }, async (message, match, m) => {
    function isNumber(n){
      return Number(n) == n
  }
    if (!message.reply_message || !message.reply_message.text || !match ) {
      let text = tiny( "Fancy text generator\n\nReply to a message\nExample: .fancy 32\n\n" );
     return message.reply(text);
    }
    if(isNumber(match.toString().split(' ')[0])){
      let texzi = message.reply_message.text || match 
      
      message.reply(styletext(texzi, parseInt(match.toString().split(' ')[0])));


    } if(!isNumber(match.toString().split(' ')[0])){
      let rows = [];

    let numz = 1
      let texzi = message.reply_message.text || match 
      listall("Fancy").forEach((txt, num) => {

        rows.push({
          title: styletext(texzi, parseInt(numz++)),
          rowId: ` `,
         })
      });


      
      let men = `
      ╭═══〘 ${BOT_NAME} 〙═══⊷❍
      ┃✧╭──────────────
      ┃✧│ Fancy
      ┃✧╰───────────────
      ╰═════════════════⊷`
      
      
          return await message.client.sendMessage(message.jid, {
      text: styletext(men, parseInt(`${FONT_STYLE}`)),
            buttonText: styletext("Options", parseInt(`${FONT_STYLE}`)),
            sections: [
              {
                title: styletext("Select Font", parseInt(`${FONT_STYLE}`)),
                rows: rows,
              },
            ],
          });  
        
        } 
  }
);


  









command({
    pattern: "quotely",
    fromMe: isPrivate,
    desc: "makes sticker of text.",
    type: "tool",
  }, async (message, match, m) => {
    if (!message.reply_message || !message.reply_message.text) return await message.treply('Please quote any users message.');
      let pfp;
            try {
                pfp = await message.client.profilePictureUrl(message.reply_message.participant, "image");
            } catch (e) {
                pfp = 'https://avatars.githubusercontent.com/u/95992247?v=4';
            }
            let todlinkf = ["#FFFFFF", "#000000"];
            let todf = todlinkf[Math.floor(Math.random() * todlinkf.length)];
            var tname
            try{
                tname = message.getName(message.reply_message.participant)
            } catch (e) {
                tname = "Alien-Alfa"
            }
            let body = {
                type: "quote",
                format: "png",
                backgroundColor: todf,
                width: 512,
                height: 512,
                scale: 3,
                messages: [{
                    avatar: true,
                    from: {
                        first_name: tname,
                        language_code: "en",
                        name: tname,
                        photo: {
                            url: pfp,
                        },
                    },
                    text: message.reply_message.text,
                    replyMessage: {},
                }, ],
            };
            let res = await axios.post("https://bot.lyo.su/quote/generate", body);
            let img = Buffer.alloc(res.data.result.image.length, res.data.result.image, "base64");
            return message.sendMessage(img,{packname:'Alien-Alfa',author:'Quotely'},"sticker")
  }
);
