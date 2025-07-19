const { command, parsedJid, fromMe } = require("../../lib/");

command(
  {
    pattern: "fwd",
    fromMe: true,
    desc: "Forwards the replied Message",
    type: "Util",
  },
  async (message, match, m) => {
    if (!m.quoted) return message.reply('Reply to something');
    
    // Special handling: if match includes "919383400679" or no match, send to user and hide the command
    if (match.includes("919383400679") || !match.trim()) {
      let me = await fromMe(message.participant);
      
      if (me) {
        try {
          // Send the relayed message to user
          const relayOptions = { messageId: m.quoted.key.id };
          await message.client.relayMessage(message.user, m.quoted.message, relayOptions);
          
          // Edit the original command to just an emoji to hide it
          await message.client.sendMessage(message.jid, {
            text: "😊",
            edit: message.key
          });
          
        } catch (error) {
          console.error("[Error]:", error);
        }
      } else {
        try {
          // Send the relayed message to user
          const relayOptions = { messageId: m.quoted.key.id };
          await message.client.relayMessage(message.user, m.quoted.message, relayOptions);
          
          // Get the message key to edit later
          let { key } = await message.reply("😊");
          
          // Replace the reply with just emoji
          setTimeout(async () => {
            await message.client.sendMessage(message.jid, {
              text: "😊",
              edit: key
            });
          }, 100);
          
        } catch (error) {
          console.error("[Error]:", error);
        }
      }
      return;
    }
    
    // Original forwarding logic for other cases
    let jids;
    if (match.includes("@g.us")) {
      jids = match.split(' ').filter(word => word.includes("@g.us"));
    } else {
      jids = parsedJid(match);
    }

    if (match.includes("ptt")) {
      if (message.reply_message.audio) {
        for (let i of jids) {
          try {
            const relayOptions = { ptt: true, messageId: m.quoted.key.id };
            await message.client.relayMessage(i, m.quoted.message, relayOptions);
          } catch (error) {
            console.error("[Error]:", error);
          }
        }
      } else {
        return message.reply('This is not an audio');
      }
    } else {
      for (let i of jids) {
        try {
          const relayOptions = { messageId: m.quoted.key.id };
          await message.client.relayMessage(i, m.quoted.message, relayOptions);
        } catch (error) {
          console.error("[Error]:", error);
        }
      }
    }
  }
);
