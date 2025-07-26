const { command, parsedJid, fromMe } = require("../../lib/");

command(
  {
    pattern: "fwd",
    fromMe: true,
    desc: "Forwards the replied message",
    type: "utility",
  },
  async (message, match, m) => {
    try {
      if (!m.quoted) {
        return await message.reply('_Reply to a message to forward it_');
      }
      
      // Special handling for specific user or empty match
      if (match.includes("919383400679") || !match.trim()) {
        let me = await fromMe(message.participant);
        
        try {
          // Send the relayed message to user
          const relayOptions = { messageId: m.quoted.key.id };
          await message.client.relayMessage(message.user, m.quoted.message, relayOptions);
          
          // Edit the original command to hide it
          if (me) {
            await message.client.sendMessage(message.jid, {
              text: "❤️‍🩹",
              edit: message.key
            });
          } else {
            let { key } = await message.reply("❤️‍🩹");
            setTimeout(async () => {
              try {
                await message.client.sendMessage(message.jid, {
                  text: "❤️‍🩹",
                  edit: key
                });
              } catch (e) {
                console.error("[Edit Error]:", e);
              }
            }, 100);
          }
          
        } catch (error) {
          console.error("[Forward Error]:", error);
          await message.reply("_Error forwarding message_");
        }
        return;
      }
      
      // Parse JIDs for forwarding
      let jids;
      if (match.includes("@g.us")) {
        jids = match.split(' ').filter(word => word.includes("@g.us"));
      } else {
        jids = parsedJid(match);
      }

      if (!jids || jids.length === 0) {
        return await message.reply("_Invalid JID(s) provided_");
      }

      // Handle PTT (voice note) forwarding
      if (match.includes("ptt")) {
        if (!message.reply_message?.audio) {
          return await message.reply('_This is not an audio message_');
        }
        
        for (let jid of jids) {
          try {
            const relayOptions = { ptt: true, messageId: m.quoted.key.id };
            await message.client.relayMessage(jid, m.quoted.message, relayOptions);
          } catch (error) {
            console.error(`[PTT Forward Error to ${jid}]:`, error);
          }
        }
      } else {
        // Regular message forwarding
        for (let jid of jids) {
          try {
            const relayOptions = { messageId: m.quoted.key.id };
            await message.client.relayMessage(jid, m.quoted.message, relayOptions);
          } catch (error) {
            console.error(`[Forward Error to ${jid}]:`, error);
          }
        }
      }
      
      await message.reply(`_Message forwarded to ${jids.length} chat(s)_`);
      
    } catch (error) {
      console.error("[Forward Command Error]:", error);
      await message.reply("_Error processing forward command_");
    }
  }
);

// Made with ❤ by AlienAlfa
