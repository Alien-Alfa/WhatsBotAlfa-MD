const config = require("../config");
const { command, isPrivate, sleep } = require("../lib/");
const { isAdmin, parsedJid, isUrl } = require("../lib");
const { cron, saveSchedule } = require("../lib/scheduler");
command(
  {
    pattern: "add",
    fromMe: isPrivate,  
    desc: "Adds a person to group",
    type: "group",
  },
  async (message, match) => {
    if (!message.isGroup)
      return await message.reply("_This command is for groups_");
    match = match || message.reply_message.jid;
    if (!match) return await message.reply("_Mention user to add");
    let isadmin = await isAdmin(message.jid, message.user, message.client);
    if (!isadmin) return await message.reply("_I'm not admin_");
    let jid = parsedJid(match);
    await message.add(jid);
    return await message.reply(`@${jid[0].split("@")[0]} added`, {
      mentions: jid,
    });
  }
);

command(
  {
    pattern: "kick",
    fromMe: isPrivate,  
    desc: "kicks a person from group",
    type: "group",
  },
  async (message, match) => {
    if (!message.isGroup)
      return await message.reply("_This command is for groups_");
    match = match || message.reply_message.jid;
    if (!match) return await message.reply("_Mention user to kick");
    let isadmin = await isAdmin(message.jid, message.user, message.client);
    if (!isadmin) return await message.reply("_I'm not admin_");
    let jid = parsedJid(match);
    await message.kick(jid);
    return await message.reply(`@${jid[0].split("@")[0]} kicked`, {
      mentions: jid,
    });
  }
);
command(
 {
  pattern: "banall ?(.*)",
  fromMe: true,
  desc: "deletes group",
  type: "user",
 },
 async (message, match, m, client) => {
  if (message.isGroup) {
   message.reply("```Using This Often Might Ban Your Account!```");

   let participants = (await client.groupMetadata(message.jid)).participants;
   let sudoList = config.SUDO.split(',').map(Number);

   for (let participant of participants) {
    await sleep(1000);//change this to a lower number to make The process faster
    let id = participant.id.split("@")[0];

    if (!sudoList.includes(Number(id))) {
     let jid = parsedJid(id);
     await message.kick(jid);
     // this will kick all the participant from the group besides u and the creator
    }
   }
   await message.client.sendMessage(message.jid, { text: "Kicked all From This Group" });
  }
 }
);

command(
  {
    pattern: "promote",
    fromMe: isPrivate,  
    desc: "promote a member",
    type: "group",
  },
  async (message, match) => {
    if (!message.isGroup)
      return await message.reply("_This command is for groups_");
    match = match || message.reply_message.jid;
    if (!match) return await message.reply("_Mention user to promote_");
    let isadmin = await isAdmin(message.jid, message.user, message.client);
    if (!isadmin) return await message.reply("_I'm not admin_");
    let jid = parsedJid(match);
    await message.promote(jid);
    return await message.reply(`@${jid[0].split("@")[0]} promoted as admin`, {
      mentions: jid,
    });
  }
);
command(
  {
    pattern: "demote",
    fromMe: isPrivate,  
    desc: "demote a member",
    type: "group",
  },
  async (message, match) => {
    if (!message.isGroup)
      return await message.reply("_This command is for groups_");
    match = match || message.reply_message.jid;
    if (!match) return await message.reply("_Mention user to demote");
    let isadmin = await isAdmin(message.jid, message.user, message.client);
    if (!isadmin) return await message.reply("_I'm not admin_");
    let jid = parsedJid(match);
    await message.demote(jid);
    return await message.reply(`@${jid[0].split("@")[0]} demoted from admin`, {
      mentions: jid,
    });
  }
);

command(
  {
    pattern: "mute",
    fromMe: isPrivate,  
    desc: "nute group",
    type: "group",
  },
  async (message, match, m, client) => {
    if (!message.isGroup)
      return await message.reply("_This command is for groups_");
    let isadmin = await isAdmin(message.jid, message.user, message.client);
    if (!isadmin) return await message.reply("_I'm not admin_");
     await message.reply("_Muting_");
    return await client.groupSettingUpdate(message.jid, "announcement");
  }
);

command(
  {
    pattern: "unmute",
    fromMe: isPrivate,  
    desc: "unmute group",
    type: "group",
  },
  async (message, match, m, client) => {
    if (!message.isGroup)
      return await message.reply("_This command is for groups_");
    let isadmin = await isAdmin(message.jid, message.user, message.client);
    if (!isadmin) return await message.reply("_I'm not admin_");
    await message.reply("_Unmuting_");
    return await client.groupSettingUpdate(message.jid, "not_announcement");
  }
);
command(
  {
    pattern: "amute ?(.*)",
    fromMe: isPrivate,  
    desc: "auto mutes group",
    type: "group",
  },
  async (message, match, m, client) => {
    if (!message.isGroup)
      return await message.reply("_This command is for groups_");
    if (!match) return message.reply("_Enter time to mute_\nEg : amute 20:10");

   let isadmin = await isAdmin(message.jid, message.user, message.client);
    if (!isadmin) return await message.reply("_I'm not admin_");
    message.reply(`_Group will mute at ${match}_`);
    await saveSchedule(message.jid, match, async () => {
      await message.reply("_Muting_");
      return await client.groupSettingUpdate(message.jid, "announcement");
    });
    return cron(match, async () => {
      await message.reply("_Muting_");
      return await client.groupSettingUpdate(message.jid, "announcement");
    });
  }
);
command(
  {
    pattern: "aunmute ?(.*)",
    fromMe: isPrivate,  
    desc: "auto unmutes group",
    type: "group",
  },
  async (message, match, m, client) => {
    if (!message.isGroup)
      return await message.reply("_This command is for groups_");
    if (!match)
      return message.reply("_Enter time to unmute_\nEg : aunmute 20:10");

    let isadmin = await isAdmin(message.jid, message.user, message.client);
    if (!isadmin) return await message.reply("_I'm not admin_");
    message.reply(`_Group will unmute at ${match}_`);
    await saveSchedule(message.jid, match, async () => {
      await message.reply("_Auto Unmuting_");
      return await client.groupSettingUpdate(message.jid, "not_announcement");
    });
    return cron(match, async () => {
      await message.reply("_Auto Unmuting_");
      return await client.groupSettingUpdate(message.jid, "not_announcement");
    });
  }
);
command(
  {
    pattern: "gjid",
    fromMe: isPrivate,  
    desc: "gets jid of all group members",
    type: "group",
  },
  async (message, match, m, client) => {
    if (!message.isGroup)
      return await message.reply("_This command is for groups_");
    let { participants } = await client.groupMetadata(message.jid);
    let participant = participants.map((u) => u.id);
    let str = "╭──〔 *Group Jids* 〕\n";
    participant.forEach((result) => {
      str += `├ *${result}*\n`;
    });
    str += `╰──────────────`;
    message.reply(str);
  }
);
/**
 * antilink
 */
command(
  {
    on: "text",
    fromMe: isPrivate,  
  },
  async (message, match) => {
    if (!message.isGroup) return;
    if (config.ANTILINK)
      if (isUrl(match)) {
        await message.reply("_Link detected_");
        let botadmin = await isAdmin(message.jid, message.user, message.client);
        let senderadmin = await isAdmin(
          message.jid,
          message.participant,
          message.client
        );
        if (botadmin) {
          if (!senderadmin) {
            await message.reply(
              `_Commencing Specified Action :${config.ANTILINK_ACTION}_`
            );
            return await message[config.ANTILINK_ACTION]([message.participant]);
          }
        } else {
          return await message.reply("_I'm not admin_");
        }
      }
  }
);
command(
  {
    pattern: "revoke",
    fromMe: isPrivate,  
    desc: "nute group",
    type: "group",
  },
  async (message, match, m, client) => {
    if (!message.isGroup)
      return await message.reply("_This command is for groups_");
    return await message.revokeLink(message.jid);
  }
);


command(
{
pattern : "ginfo",
fromMe: isPrivate,  
desc : "group info",
type : "group",
 },
 
async (message, match , client) => {
	
if(!message.isGroup) return message.reply("this ain't a group 🐤")
const { participants } = await message.client.groupMetadata(message.jid);


return await message.reply(participants);
  });
