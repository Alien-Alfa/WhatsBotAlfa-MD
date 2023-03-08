const { command, isPrivate } = require("../lib/");
const { isAdmin, parsedJid, isUrl } = require("../lib");
const { cron, saveSchedule } = require("../lib/scheduler");


command({
    pattern: "add",
  fromMe: isPrivate,
  desc: "Adds a person to group",
  type: "group",

}, async (message, match, m) => {
    if (!message.isGroup)
      return await message.treply("_This command is for groups_");
    match = match || message.reply_message.jid;
    if (!match) return await message.treply("_Mention user to add");
    let isadmin = await isAdmin(message.jid, message.user, message.client);
    if (!isadmin) return await message.treply("_I'm not admin_");
    let jid = parsedJid(match);
    await message.add(jid);
    return await message.treply(`@${jid[0].split("@")[0]} added`, {
      mentions: jid,
    });
  }
);


command({
  pattern: "unban",
  fromMe: true,
  desc: "Unban number from this group",
  dontAddCommandList: true,
  type: "admin",

},
async (message, match, m) => {
    if (!message.isGroup)
      return await message.treply("_This command is for groups_");
    match = match || message.reply_message.jid;
    if (!match) return await message.treply("_Mention user to add");
    let isadmin = await isAdmin(message.jid, message.user, message.client);
    if (!isadmin) return await message.treply("_I'm not admin_");
    let jid = parsedJid(match);
    let relay = await message.unban(jid, message);
    return await message.treply(relay, {
      mentions: jid,
    });
  }
);


    command({
    pattern: "shinu",
      fromMe: isPrivate,
      desc: "kicks a person from group",
      type: "group",
    
    }, async (message, match, m) => {
    if (!message.isGroup)
      return await message.treply("_This command is for groups_");
    match = match || message.reply_message.jid;
    if (!match) return await message.treply("_Mention user to kick");
    let isadmin = await isAdmin(message.jid, message.user, message.client);
    if (!isadmin) return await message.treply("_I'm not admin_");
    let jid = parsedJid(match);
    await message.kick(jid);
    return await message.treply(`@${jid[0].split("@")[0]} kicked`, {
      mentions: jid,
    });
  }
);


command({
  pattern: "ban",
  fromMe: true,
  desc: "ban someonr permanantly from this group",
  dontAddCommandList: true,
  type: "admin",

},
async (message, match, m) => {
  if (!message.isGroup) return await message.treply("_This command is for groups_");
  match = match || message.reply_message.jid;
  if (!match) return await message.treply("_Mention user to kick");
  let isadmin = await isAdmin(message.jid, message.user, message.client);
  if (!isadmin) return await message.treply("_I'm not admin_");
  let jid = parsedJid(match);
  let relay = await message.ban(jid, message);
  return await message.treply(relay, {
    mentions: jid,
  });
}
);


    command({
    pattern: "promote",
      fromMe: isPrivate,
      desc: "promote a member",
      type: "group",
    
    }, async (message, match, m) => {
    if (!message.isGroup)
      return await message.treply("_This command is for groups_");
    match = match || message.reply_message.jid;
    if (!match) return await message.treply("_Mention user to promote_");
    let isadmin = await isAdmin(message.jid, message.user, message.client);
    if (!isadmin) return await message.treply("_I'm not admin_");
    let jid = parsedJid(match);
    await message.promote(jid);
    return await message.treply(`@${jid[0].split("@")[0]} promoted as admin`, {
      mentions: jid,
    });
  }
);



    command({
    pattern: "demote",
      fromMe: isPrivate,
      desc: "demote a member",
      type: "group",
    
    }, async (message, match, m) => {
    if (!message.isGroup)
      return await message.treply("_This command is for groups_");
    match = match || message.reply_message.jid;
    if (!match) return await message.treply("_Mention user to demote");
    let isadmin = await isAdmin(message.jid, message.user, message.client);
    if (!isadmin) return await message.treply("_I'm not admin_");
    let jid = parsedJid(match);
    await message.demote(jid);
    return await message.treply(`@${jid[0].split("@")[0]} demoted from admin`, {
      mentions: jid,
    });
  }
);




    command({
    pattern: "mute",
      fromMe: isPrivate,
      desc: "mute group",
      type: "group",
    
    }, async (message, match, m) => {
    if (!message.isGroup)
      return await message.treply("_This command is for groups_");
    if (!isAdmin(message.jid, message.user, message.client))
      return await message.treply("_I'm not admin_");
    await message.treply("_Muting_");
    return await client.groupSettingUpdate(message.jid, "announcement");
  }
);



command({
    pattern: "unmute",
  fromMe: isPrivate,
  desc: "unmute group",
  type: "group",

}, async (message, match, m) => {
    if (!message.isGroup)
      return await message.treply("_This command is for groups_");
    if (!isAdmin(message.jid, message.user, message.client))
      return await message.treply("_I'm not admin_");
    await message.treply("_Unmuting_");
    return await client.groupSettingUpdate(message.jid, "not_announcement");
  }
);


command({
    pattern: "amute",
    fromMe: true,
    desc: "auto mutes group",
    type: "group",
  },
  async (message, match, m, client) => {
    if (!message.isGroup)
      return await message.treply("_This command is for groups_");
    if (!match) return message.treply("_Enter time to mute_\nEg : amute 20:10");

    if (!isAdmin(message.jid, message.user, message.client))
      return await message.treply("_I'm not admin_");
    message.treply(`_Group will mute at ${match}_`);
    await saveSchedule(message.jid, match, async () => {
      await message.treply("_Muting_");
      return await client.groupSettingUpdate(message.jid, "announcement");
    });
    return cron(match, async () => {
      await message.treply("_Muting_");
      return await client.groupSettingUpdate(message.jid, "announcement");
    });
  }
);


command({
    pattern: "aunmute",
    fromMe: true,
    desc: "auto unmutes group",
    type: "group",
  },
  async (message, match, m, client) => {
    if (!message.isGroup)
      return await message.treply("_This command is for groups_");
    if (!match)
      return message.treply("_Enter time to unmute_\nEg : aunmute 20:10");

    if (!isAdmin(message.jid, message.user, message.client))
      return await message.treply("_I'm not admin_");
    message.treply(`_Group will unmute at ${match}_`);
    await saveSchedule(message.jid, match, async () => {
      await message.treply("_Auto Unmuting_");
      return await client.groupSettingUpdate(message.jid, "not_announcement");
    });
    return cron(match, async () => {
      await message.treply("_Auto Unmuting_");
      return await client.groupSettingUpdate(message.jid, "not_announcement");
    });
  }
);


command({
    pattern: "gjid",
    fromMe: true,
    desc: "gets jid of all group members",
    type: "group",
  },
  async (message, match, m, client) => {
    if (!message.isGroup)
      return await message.treply("_This command is for groups_");
    let { participants } = await client.groupMetadata(message.jid);
    let participant = participants.map((u) => u.id);
    let str = "╭──〔 *Group Jids* 〕\n";
    participant.forEach((result) => {
      str += `├ *${result}*\n`;
    });
    str += `╰──────────────`;
    message.treply(str);
  }
);



command({
    pattern: "tagall ?(.*)",
    fromMe: true,
    desc: "mention all users in group",
    type: "group",
  }, async (message, match, m) => {
    if (!message.isGroup) return;
    const { participants } = await message.client.groupMetadata(message.jid);
    let teks = "";
    for (let mem of participants) {
      teks += ` @${mem.id.split("@")[0]}\n`;
    }
    message.sendMessage(teks.trim(), {
      mentions: participants.map((a) => a.id),
    });
  }
);


command({
    pattern: "tag ?(.*)",
    fromMe: true,
    desc: "mention all users in group",
    type: "group",
  }, async (message, match, m) => {
    if (!message.isGroup) return;
    const { participants } = await message.client.groupMetadata(message.jid);
    let teks = match;
    for (let mem of participants) {
      teks += ` @${mem.id.split("@")[0]}\n`;
    }
    message.sendMessage(teks.trim(), {
      mentions: participants.map((a) => a.id),
    });
  }
);
command({
    pattern: "poll ?(.*)",
    fromMe: true,
    desc: "create poll",
    type: "group",
  }, async (message, match, m) => {
       let {prefix} = message
    let [poll,opt] = match.split(";");
    if (match.split(";") < 2)
      return await message.treply(
        `${global.prefix}poll question;option1,option2,option3.....`
      );
    
    let options = [];

    for (let i of opt.split(',')) {
      options.push({ optionName: i });
    }
    return await message.client.relayMessage(
      message.jid,
      {
        pollCreationMessage: {
          name: poll,
          options,
          selectableOptionsCount: 0,
        },
      },
      {}
    );
  }
);

/**
 * antilink
 */




