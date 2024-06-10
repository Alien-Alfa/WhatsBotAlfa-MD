const { command, isPrivate } = require("../../lib/");
const { isAdmin, parsedJid,fromMe } = require("../../lib");

command(
  {
    pattern: "add",
    fromMe: isPrivate,
    desc: "add a person to group",
    type: "group",
  },
  async (message, match) => {
    if (!message.isGroup)
      return await message.reply("_This command is for groups_");

    match = match || message.reply_message.jid;
    if (!match) return await message.reply("_Mention user to add");
    let isyouadmin = await isAdmin(message.jid, message.key.participant, message.client);
    if (!isyouadmin) return;
    //let me = await fromMe(message.participant)
    //const ismeadmin = await isAdmin(message.jid, message.user, message.client);
    //if (!ismeadmin) return await message.reply("_I'm not admin_");
    const jid = parsedJid(match);

    await message.client.groupParticipantsUpdate(message.jid, jid, "add");

    return await message.reply(`_@${jid[0].split("@")[0]} added_`, {
      mentions: [jid],
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
    if (!match) return await message.reply("_Mention user to kick_");
    let isyouadmin = await isAdmin(message.jid, message.key.participant, message.client);
    if (!isyouadmin) return;
    const isadmin = await isAdmin(message.jid, message.user, message.client);

    if (!isadmin) return await message.reply("_I'm not admin_");
    const jid = parsedJid(match);

    await message.client.groupParticipantsUpdate(message.jid, jid, "remove");

    return await message.reply(`_@${jid[0].split("@")[0]} kicked_`, {
      mentions: [jid],
    });
  }
);
command(
  {
    pattern: "gcpp ",
    fromMe: isPrivate,
    desc: "Set profile picture",
    type: "user",
  },
  async (message, match, m) => {
    if (!message.isGroup) return await message.reply("_This command is for groups_");
    const isyouadmin = await isAdmin(message.jid, message.key.participant, message.client);
    if (!isyouadmin) return;
    if (!message.reply_message.image) return await message.reply("_Reply to a photo_");
    const isadmin = await isAdmin(message.jid, message.user, message.client);
    if (!isadmin) return await message.reply("_I'm not admin_");
    let buff = await m.quoted.download();
    await message.setPP(message.jid, buff);
    return await message.reply("_Profile Picture Updated_");
  }
);
command(
  {
    pattern: "fullgcpp",
    fromMe: isPrivate,  
    desc: "Set Full profilr picture for Group",
    type: "group",
  },
  async (message, match, m) => {
    try{
      if (!message.isGroup) return await message.reply("_This command is for groups_");
      const isyouadmin = await isAdmin(message.jid, message.key.participant, message.client);
      if (!isyouadmin) return;
      if (!message.reply_message.image) return await message.reply("_Reply to a photo_");
      const isadmin = await isAdmin(message.jid, message.user, message.client);
      if (!isadmin) return await message.reply("_I'm not admin_");

    let buff = await m.quoted.download();
    await message.SetFullPP(message.jid , buff, message);
    return await message.reply("_Profile Picture Updated_");
  } catch (error) {
    console.error("[Error]:", error);
  }
  }
);
command(
  {
    pattern: "promote",
    fromMe: isPrivate,
    desc: "promote to admin",
    type: "group",
  },
  async (message, match) => {
    if (!message.isGroup)
      return await message.reply("_This command is for groups_");

    match = match || message.reply_message.jid;
    if (!match) return await message.reply("_Mention user to promote_");
    let isyouadmin = await isAdmin(message.jid, message.key.participant, message.client);
    if (!isyouadmin) return;
    const isadmin = await isAdmin(message.jid, message.user, message.client);

    if (!isadmin) return await message.reply("_I'm not admin_");
    const jid = parsedJid(match);

    await message.client.groupParticipantsUpdate(message.jid, jid, "promote");

    return await message.reply(`_@${jid[0].split("@")[0]} promoted as admin_`, {
      mentions: [jid],
    });
  }
);
command(
  {
    pattern: "demote",
    fromMe: isPrivate,
    desc: "demote from admin",
    type: "group",
  },
  async (message, match) => {
    if (!message.isGroup)
      return await message.reply("_This command is for groups_");

    match = match || message.reply_message.jid;
    if (!match) return await message.reply("_Mention user to demote_");
    let isyouadmin = await isAdmin(message.jid, message.key.participant, message.client);
    if (!isyouadmin) return;
    const isadmin = await isAdmin(message.jid, message.user, message.client);

    if (!isadmin) return await message.reply("_I'm not admin_");
    const jid = parsedJid(match);

    await message.client.groupParticipantsUpdate(message.jid, jid, "demote");

    return await message.reply(
      `_@${jid[0].split("@")[0]} demoted from admin_`,
      {
        mentions: [jid],
      }
    );
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
    let isyouadmin = await isAdmin(message.jid, message.key.participant, message.client);
    if (!isyouadmin) return;
    if (!isAdmin(message.jid, message.user, message.client))
      return await message.reply("_I'm not admin_");
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
    let isyouadmin = await isAdmin(message.jid, message.key.participant, message.client);
    if (!isyouadmin) return;
    if (!isAdmin(message.jid, message.user, message.client))
      return await message.reply("_I'm not admin_");
    await message.reply("_Unmuting_");
    return await client.groupSettingUpdate(message.jid, "not_announcement");
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
    let isyouadmin = await isAdmin(message.jid, message.key.participant, message.client);
    if (!isyouadmin) return;
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

command(
  {
    pattern: "tagall",
    fromMe: isPrivate,
    desc: "mention all users in group",
    type: "group",
  },
  async (message, match) => {
    if (!message.isGroup) return;
    let isyouadmin = await isAdmin(message.jid, message.key.participant, message.client);
    if (!isyouadmin) return;
    const { participants } = await message.client.groupMetadata(message.jid);
    let teks = "";
    for (let mem of participants) {
      teks += ` @${mem.id.split("@")[0]}\n`;
    }
    message.sendMessage(message.jid,teks.trim(), {
      mentions: participants.map((a) => a.id),
    });
  }
);

command(
  {
    pattern: "tag",
    fromMe: isPrivate,
    desc: "mention all users in group",
    type: "group",
  },
  async (message, match) => {
    console.log("match")
    match = match || message.reply_message.text;
    if (!match) return message.reply("_Enter or reply to a text to tag_");
    if (!message.isGroup) return;
    let isyouadmin = await isAdmin(message.jid, message.key.participant, message.client);
    if (!isyouadmin) return;
    const { participants } = await message.client.groupMetadata(message.jid);
    message.sendMessage(message.jid,match, {
      mentions: participants.map((a) => a.id),
    });
  }
);

command(
  {
      pattern: "ginfo",
      fromMe: isPrivate,
      desc: "group info",
      type: "group",
  },
  async (message, match, client) => {
      try {
          if (!message.isGroup) return message.reply("_This is not a group chat_");
  
          const metadata = await message.client.groupMetadata(message.jid);

          const { id, subject, owner, creation, size, desc, participants } = metadata;

          const created = msToDateTime(creation);

          let adminsCount = 0;
          let nonAdminsCount = 0;
  
          participants.forEach(participant => {
              if (participant.admin) {
                  adminsCount++;
              } else {
                  nonAdminsCount++;
              }
          });
          const creatorAdmin = participants.find(participant => participant.admin === "superadmin");
        const creatorAdminPhone = creatorAdmin ? "@"+creatorAdmin.id.split("@")[0] : "Not Found!";
            // Format description
    const description = desc ? desc : "No Description";
        // Format owner ID
        const ownerId = owner ? "@"+owner.split("@")[0] : "Not Found!";

          let msg = `*Group Info:*
- Subject: ${subject}
- Creator: ${ownerId}
- Created on: ${created}
- Super Admin: ${creatorAdminPhone}
- Total Number of Participants: ${participants.length}
- Number of Admins: ${adminsCount}
- Number of Participants: ${nonAdminsCount}


- Description: ${description}`;

const jid = parsedJid(msg);
return await message.reply(msg,{
  mentions: [jid],
}
);

      } catch (error) {
          console.error("[Error]:", error);
          return await message.reply("_Error occurred while fetching group info_");
      }
  });
  


  command({
    pattern: "info",
    fromMe: isPrivate,
    desc: "get invite info of group",
    type: "group",
}, async (message, match, m, client) => {
  try {

    match = match || message.reply_message.text;
    if (!match) return await message.reply("_Tag a group invite link to check info_");

    if (!match.includes("chat.whatsapp.com")) { return await message.reply("_Tag a group invite link to check info_"); }

    let cold = match
    let hmm = cold.split("/")[3]

    const metadata = await message.client.groupGetInviteInfo(hmm);
    const { id, subject, owner, creation, size, desc, participants } = metadata;

    // Format creation date
    const created = msToDateTime(creation);

    // Format owner ID
    const ownerId = owner ? "@"+owner.split("@")[0] : "Not Found!";

    // Count admins and non-admins
    let adminCount = 0;
    let nonAdminCount = 0;
    participants.forEach(participant => {
        if (participant.admin === 'admin' || participant.admin === 'superadmin') {
            adminCount++;
        } else {
            nonAdminCount++;
        }
    });

    // Format participant list
    const participantList = participants.map(participant => {
        const { id, admin } = participant;
        return `ID: ${id}, Admin: ${admin}`;
    }).join('\n');

    // Format description
    const description = desc ? desc : "No Description";

    const creatorAdmin = participants.find(participant => participant.admin === "superadmin");
    const creatorAdminPhone = creatorAdmin ? "@" + creatorAdmin.id.split("@")[0] : "Not Found!";

    let msg = `- Group ID: ${id}
- Subject: ${subject}
- Creator: ${ownerId}
- Created on: ${created}
- Super Admin: ${creatorAdminPhone}
- Total Number of Participants: ${participants.length}
- Number of Admins: ${adminCount}
- Number of Participants: ${nonAdminCount}


- Description: ${description}`;

const jid = parsedJid(msg);
return await message.reply(msg,{
  mentions: [jid],
}
);} catch (error) {
  console.error("[Error]:", error);
  return await message.reply("_Error occurred while fetching group info_");
}
});


function msToDateTime(ms) {
  const date = new Date(ms * 1000); // convert seconds to milliseconds
  const dateString = date.toDateString();
  const timeString = date.toTimeString().split(' ')[0]; // Removing timezone info
  return dateString + ' ' + timeString;
}
