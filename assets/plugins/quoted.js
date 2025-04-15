const { command, isPrivate, serialize } = require("../../lib/");
const { loadMessage, loadDeletedMessages } = require("../database/StoreDb");

command(
  {
    pattern: "recall",
    fromMe: isPrivate,
    desc: "Recall deleted messages within a given time frame",
  },
  async (message, m, match) => {
    try {
      const timeString = String(match.body || "").trim();

      if (!timeString) {
        return await message.reply(
          "Usage: Recall <time>\nExample: Recall 30m (30 minutes) or Recall 1h (1 hour)"
        );
      }

      const timeInMilliseconds = parseTimeToMilliseconds(timeString);
      const sinceTimestamp = new Date(Date.now() - timeInMilliseconds);
      const jid = message.jid;

      // Step 1: Load all messages in the given timeframe
      const messages = await loadDeletedMessages(jid, sinceTimestamp);

      if (!messages || messages.length === 0) {
        return await message.reply("*No messages found in the given time frame.*");
      }

      let count = 0;

      // Step 2: Filter REVOKE messages and forward originals
      for (const msg of messages) {
        let parsed;
        try {
          parsed = typeof msg.message === 'string' ? JSON.parse(msg.message) : msg.message;
        } catch (e) {
          continue; // skip if parsing fails
        }

        const isRevoke = parsed?.message?.protocolMessage?.type === 'REVOKE';
        const deletedKeyId = parsed?.message?.protocolMessage?.key?.id;

        if (isRevoke && deletedKeyId) {
          const original = await loadMessage(deletedKeyId);

          if (original && original.message) {
            const deserialized = await serialize(original.message, message.client);
            await message.forward(message.jid, deserialized);
            count++;
          }
        }
      }

      if (count === 0) {
        return await message.reply("*No deleted messages found in the given time frame.*");
      }

      return await message.reply(`*Recalled ${count} deleted message(s).*`);

    } catch (error) {
      console.error("Error recalling messages:", error);
      return await message.reply("_Failed to recall messages. Please check logs for details._");
    }
  }
);


const parseTimeToMilliseconds = (timeString) => {
  const timeValue = parseInt(timeString.slice(timeString.lastIndexOf(" ") + 1, -1), 10);
  const unit = timeString.slice(-1); // Extract the unit (m/h)
  
  if (isNaN(timeValue)) {
    throw new Error("Invalid time format");
  }
  
  if (unit === 'm') return timeValue * 60 * 1000; // Minutes to milliseconds
  if (unit === 'h') return timeValue * 60 * 60 * 1000; // Hours to milliseconds
  
  throw new Error("Unsupported time unit. Use 'm' for minutes or 'h' for hours.");
};

command(
  {
    pattern: "quoted",
    fromMe: isPrivate,
    desc: "quoted message",
  },
  async (message, m, match) => {
    if (!message.reply_message && !match) {
      return await message.reply("*Reply to a message or provide ID*");
    }

    let key = (typeof match === 'string' && match.trim()) 
    || (message.reply_message?.key?.id?.trim?.() || '');

if (!key) {
    console.log('Debugging Info:', { match, replyMessageKeyId: message.reply_message?.key?.id });
    return await message.reply("*No valid key found*");
}


    let msg = await loadMessage( await key.trim() );
    console.log("Key: '"+key+"'\n\n"+ await msg);

    if (msg) {

      msg = await serialize(
        await JSON.parse(JSON.stringify(await msg.message)),
        message.client
      );

      if (!msg.quoted || !msg.quoted.message) {
        return await message.reply("No quoted message found");
      }
  
      return await message.forward(message.jid, await msg.quoted);
      
    }

    if (!msg) {
      return await message.reply(
        "_Message not found, maybe bot might not be running at that time_"
      );
    }

  }
);

/*
> const { command, isPrivate, serialize } = require("../../lib/");


command({
  pattern: 'wapoll ?(.*)',
  fromMe: true,
  desc: "Creates poll (WhatsApp feature)",
  use: 'group',
  usage: '.wapoll Poll title,option,option,option'
}, (async (message, match) => {
  //if (!message.isGroup) return await message.sendReply(Lang.GROUP_COMMAND)
  if (!match[1]) return await message.sendReply(`_Need params!_\n_.wapoll title,option,option_`)
  match = match[1].split(',')
  const buttons = [];
  for (let i = 1; i < match.length; i++) {
  buttons.push({optionName: match[i]})
  }
  await message.client.relayMessage(message.jid, { senderKeyDistributionMessage: {groupId: message.jid}, messageContextInfo: {messageSecret: "LzBNJaq8ZGE/2hn5bUplPvecdDxTSI1qduEbbIMI5J4="}, pollCreationMessage: { name: match[0], options: buttons, selectableOptionsCount: 0 } }, {});
}));

*/