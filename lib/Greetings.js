/* Copyright (C) 2022 Albin Thomas.
Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.
Alien-Alfa WhatsApp Bot - Albin Thomas
*/

const { parseJid } = require(".");
const { getStatus, getMessage } = require("./database/greetings");
async function Greetings(data, conn) {
  let metadata = await conn.groupMetadata(data.id);
  for (let user of data.participants) {
    let userpp;
    try {
      userpp = await conn.profilePictureUrl(user, "image");
    } catch {
      userpp = "https://avatars.githubusercontent.com/u/64305844?v=4";
    }

    switch (data.action) {
      case "add":
        {
          let status = await getStatus(data.id, "welcome");
          if (!status) return;
          let welcome_message = getMessage(data.id, "welcome");
          console.log(welcome_message)

          let msg = welcome_message.message

            let mess = ''
            if (/{user}/.test(msg)) {
              mess + msg.replace(/@user/gi, "@" + user.split("@")[0])
              if (/{gname}/.test(msg)) {
                mess + msg.replace(/@gname/gi, metadata.subject)
                if (/{count}/.test(msg)) {
                  mess + msg.replace(/@count/gi, metadata.participants.length);
                  if (/{pp}/.test(msg)) {
                    conn.sendMessage(data.id, { image: { url: userpp }, caption: mess.replace(/{pp}/, ""), mentions: parseJid(mess), });
                  } else {
                    conn.sendMessage(data.id, { text: mess, mentions: parseJid(mess) });
                  }
                }
              }
            }
        }
        break;
      case "remove":
        {
          let status = await getStatus(data.id, "goodbye");
          if (!status) return;
          let GOODBYE_MSG = getMessage(data.id, "goodbye");
          let msg = GOODBYE_MSG.message


          let mess = ''
          if (/{user}/.test(msg)) {
            mess + msg.replace(/@user/gi, "@" + user.split("@")[0])
            if (/{gname}/.test(msg)) {
              mess + msg.replace(/@gname/gi, metadata.subject)
              if (/{count}/.test(msg)) {
                mess + msg.replace(/@count/gi, metadata.participants.length);
                if (/{pp}/.test(msg)) {
                  conn.sendMessage(data.id, { image: { url: userpp }, caption: mess.replace(/{pp}/, ""), mentions: parseJid(mess), });
                } else {
                  conn.sendMessage(data.id, { text: mess, mentions: parseJid(mess) });
                }
              }
            }
          }


        }
        break;
    }
  }
}
module.exports = Greetings;
