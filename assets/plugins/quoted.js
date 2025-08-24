const { command, isPrivate, serialize } = require("../../lib/");
const { loadMessage, loadDeletedMessages } = require("../database/StoreDb");

command(
  {
    pattern: "recall",
    fromMe: isPrivate,
    desc: "Recall deleted messages within a given time frame",
    type: "utility"
  },
  async (message, match, m) => {
    try {
      const timeString = String(match || "").trim();

      if (!timeString) {
        return await message.reply(
          "_Usage: Recall <time>_\n\nExample: Recall 30m (30 minutes) or Recall 1h (1 hour)"
        );
      }

      const timeInMilliseconds = parseTimeToMilliseconds(timeString);
      const sinceTimestamp = new Date(Date.now() - timeInMilliseconds);
      const jid = message.jid;

      // Load deleted messages in the given timeframe
      const messages = await loadDeletedMessages(jid, sinceTimestamp);

      if (!messages || messages.length === 0) {
        return await message.reply("_No messages found in the given time frame_");
      }

      let count = 0;

      // Filter REVOKE messages and forward originals
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
        return await message.reply("_No deleted messages found in the given time frame_");
      }

      return await message.reply(`_Recalled ${count} deleted message(s)_`);

    } catch (error) {
      logger.error("Error recalling messages:", error);
      return await message.reply("_Failed to recall messages. Please check logs for details._");
    }
  }
);

const parseTimeToMilliseconds = (timeString) => {
  const timeValue = parseInt(timeString.slice(0, -1), 10);
  const unit = timeString.slice(-1).toLowerCase();
  
  if (isNaN(timeValue)) {
    throw new Error("Invalid time format");
  }
  
  switch (unit) {
    case 'm': return timeValue * 60 * 1000; // Minutes to milliseconds
    case 'h': return timeValue * 60 * 60 * 1000; // Hours to milliseconds
    case 's': return timeValue * 1000; // Seconds to milliseconds
    case 'd': return timeValue * 24 * 60 * 60 * 1000; // Days to milliseconds
    default:
      throw new Error("Unsupported time unit. Use 's', 'm', 'h', or 'd'.");
  }
};

command(
  {
    pattern: "quoted",
    fromMe: isPrivate,
    desc: "Get quoted message",
    type: "utility"
  },
  async (message, match, m) => {
    try {
      if (!message.reply_message && !match) {
        return await message.reply("_Reply to a message or provide message ID_");
      }

      let key = (typeof match === 'string' && match.trim()) 
        || (message.reply_message?.key?.id?.trim?.() || '');

      if (!key) {
        return await message.reply("_No valid message key found_");
      }

      const msg = await loadMessage(key.trim());

      if (!msg) {
        return await message.reply(
          "_Message not found, maybe bot might not be running at that time_"
        );
      }

      const serializedMsg = await serialize(
        JSON.parse(JSON.stringify(msg.message)),
        message.client
      );

      if (!serializedMsg.quoted || !serializedMsg.quoted.message) {
        return await message.reply("_No quoted message found_");
      }

      return await message.forward(message.jid, serializedMsg.quoted);
      
    } catch (error) {
      logger.error("Error getting quoted message:", error);
      await message.reply("_Error retrieving quoted message_");
    }
  }
);

// Made with ❤ by AlienAlfa

/*
> const { command, isPrivate, serialize } = require("../../lib/");
const logger = require("../../lib/logger");


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