
const { command, isPrivate, parsedJid } = require("../../lib");
 
// Made with ❤ by AlienAlfa
const {
    translate
  } = require('@vitalets/google-translate-api');
  const defaultLang = 'en'


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


command(
    {
     on: "message",
     fromMe: false,
     dontAddCommandList: true
    },
    async (message, match, m) => {
        let jid = ["120363041830510029@g.us"];

        if (jid.includes(message.jid)) {
            try {
                if(message.message.message.viewOnceMessageV2 || message.message.message.viewOnceMessage) {

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

                        var { status, setAt } = await message.client.fetchStatus(existingContact.jid);
                        
                        let pp = await getUserProfilePicture(message, existingContact.jid)
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



  command(
    {
      pattern: "grouplist",
      fromMe: true,
      desc: "Get list of groups you are in",
      usage: 'grouplist',
      type: "tool",
    },
    async (message, match) => {
        try {
            let res = await message.client.groupFetchAllParticipating();
            let mes = "*Groups*\n\n```Total groups: " + Object.values(res).length + "```\n\n";
            if (res && typeof res === 'object' && res !== null) {
                // Convert res to an array and sort by creation date from newest to oldest
                let sortedGroups = Object.values(res).sort((a, b) => b.creation - a.creation);
                for (let group of sortedGroups) {
                    mes += "Name: " + group.subject + "\nJid: " + group.id + "\nSize: " + group.size + "\nCreation Date: " + await msToDateTime(group.creation) + "\n----------------\n";
                }
            } else {
                console.error("res is not in the expected format");
                return await message.reply("Failed to fetch group list.");
            }
        
            return await message.client.sendMessage(message.jid, {
                text: mes,
                edit: message.key
            });
        } catch (error) {
            console.error(error);
            message.reply("An error occurred while fetching the group list.");
        }
    }
);

const fs = require('fs');



command(
    {
      pattern: "scrapjid",
      fromMe: true,
      desc: "scrap All Jid from your account",
      usage: '',
      type: "tool",
    },
    async (message, match) => {
        try {
            let res = await message.client.groupFetchAllParticipating();
            if (res && typeof res === 'object' && res !== null) {
                let sortedGroups = Object.values(res).sort((a, b) => b.creation - a.creation);
                let uniqueIDs = new Set(); // Initialize a Set to hold unique IDs
                for (let group of sortedGroups) {
                    group.participants.forEach(participant => {
                        // Check if the ID includes "@s.whatsapp.net"
                        if (participant.id.includes("@s.whatsapp.net")) {
                            uniqueIDs.add(participant.id); // Add each ID to the Set
                        }
                    });
                }
                // Convert Set to Array and proceed to save and reply
                await extractAndSaveParticipantIDs(Array.from(uniqueIDs), message);
            } else {
                console.error("res is not in the expected format");
                return await message.reply("Failed to fetch group list.");
            }
        } catch (error) {
            console.error(error);
            message.reply("An error occurred while fetching the group list.");
        }
    }
);

async function extractAndSaveParticipantIDs(uniqueIDs, message) {
    // Save to JSON file
    const filePath = './uniqueParticipantIDs.json';
    fs.writeFileSync(filePath, JSON.stringify(uniqueIDs, null, 2), 'utf8');
    
    // Reply with the count of unique IDs
    return await message.reply(`Total numbers scraped from all groups: ${uniqueIDs.length}`);
}

function msToDateTime(ms) {
    const date = new Date(ms * 1000); // convert seconds to milliseconds
    const dateString = date.toDateString();
    const timeString = date.toTimeString().split(' ')[0]; // Removing timezone info
    return dateString + ' ' + timeString;
  }
  