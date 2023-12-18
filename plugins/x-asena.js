/*

const { command, isAdmin ,parsedJid} = require("../lib");
const { PausedChats, WarnDB } = require("../database");
const { WARN_COUNT } = require("../config");
const { saveWarn, resetWarn } = WarnDB;

command(
  {
    pattern: "pause",
    fromMe: true,
    desc: "Pause the chat",
    dontAddCommandList: true,
  },
  async (message) => {
    const chatId = message.key.remoteJid;
    try {
      await PausedChats.savePausedChat(chatId);
      message.reply("Chat paused successfully.");
    } catch (error) {
      console.error(error);
      message.reply("Error pausing the chat.");
    }
  }
);

command(
  {
    pattern: "resume",
    fromMe: true,
    desc: "Resume the paused chat",
    dontAddCommandList: true,
  },
  async (message) => {
    const chatId = message.key.remoteJid;

    try {
      const pausedChat = await PausedChats.PausedChats.findOne({
        where: { chatId },
      });

      if (pausedChat) {
        await pausedChat.destroy();
        message.reply("Chat resumed successfully.");
      } else {
        message.reply("Chat is not paused.");
      }
    } catch (error) {
      console.error(error);
      message.reply("Error resuming the chat.");
    }
  }
);

command(
  {
    pattern: "dlt",
    fromMe: true,
    desc: "deletes a message",
    type: "user",
  },
  async (message, match, m, client) => {
    if (message.isGroup) {
      client.sendMessage(message.jid, { delete: message.reply_message.key });
    }
  }
);

command(
  {
    pattern: "warn",
    fromMe: true,
    desc: "Warn a user",
  },
  async (message, match) => {
    const userId = message.mention[0] || message.reply_message.jid;
    if (!userId) return message.reply("_Mention or reply to someone_");
    let reason = message?.reply_message.text || match;
    reason = reason.replace(/@(\d+)/, "");
    reason = reason ? reason.length <= 1 : "Reason not Provided";

    const warnInfo = await saveWarn(userId, reason);
    let userWarnCount = warnInfo ? warnInfo.warnCount : 0;
    userWarnCount++;
    await message.reply(
      `_User @${
        userId.split("@")[0]
      } warned._ \n_Warn Count: ${userWarnCount}._ \n_Reason: ${reason}_`,
      { mentions: [userId] }
    );
    if (userWarnCount > WARN_COUNT) {
      const jid = parsedJid(userId);
      await message.sendMessage(
        message.jid,
        "Warn limit exceeded kicking user"
      );
      return await message.client.groupParticipantsUpdate(
        message.jid,
        jid,
        "remove"
      );
    }
    return;
  }
);

command(
  {
    pattern: "resetwarn",
    fromMe: true,
    desc: "Reset warnings for a user",
  },
  async (message) => {
    const userId = message.mention[0] || message.reply_message.jid;
    if (!userId) return message.reply("_Mention or reply to someone_");
    await resetWarn(userId);
    return await message.reply(
      `_Warnings for @${userId.split("@")[0]} reset_`,
      {
        mentions: [userId],
      }
    );
  }
);
*/