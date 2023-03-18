

const fs = require("fs")
let alfadb = JSON.parse(fs.readFileSync('./database/settings.json'));
  const { ANTILINK_ACTION, HANDLERS, BOT_NAME, OWNER_NAME, SUDO, FOOTER, THEME, FONT_STYLE, LANGUAGE, INTERNAL_MENU, MODE} = require("../database/settings");

const chalk = require("chalk")
const { writeFile, readFile } = require("fs");
const { command, isPrivate, styletext, } = require("../lib");
const { isAdmin, parsedJid } = require("../lib");

let path = './database/settings.json'
let db = JSON.parse(fs.readFileSync('./database/settings.json'));


let nttoxic = db.settings.antitoxic || []
let ntilinkall = db.antilink.antilinkall || []
let ntilinktwt = db.antilink.antilinktwitter || []
let ntilinktt = db.antilink.antilinktiktok || []
let ntilinktg = db.antilink.antilinktelegram || []
let ntilinkfb = db.antilink.antilinkfacebook || []
let ntilinkig = db.antilink.antilinkinstagram || []
let ntilinkytch = db.antilink.antilinkytchannel || []
let antilinkytvid = db.antilink.antilinkytvideo || []
let antivirtexo = db.antilink.antivirtexo || []
let bad = db.settings.bad || []



//============================================================================================================================================
//============================================================================================================================================
//============================================================================================================================================
//============================================================================================================================================
//============================================================================================================================================

//============================================================================================================================================
//============================================================================================================================================
//============================================================================================================================================

command({
   pattern: "antivirus",
   fromMe: isPrivate,
   desc: "antivirus group",
   type: "admin",
},
async (message, match, m) => {

   if (!message.isGroup)
      return await message.sendMessage("_This command is for groups_");
   let isadmin = await isAdmin(message.jid, message.user, message.client);
   if (!isadmin) return await message.sendMessage("_I'm not admin_");

   let buttonsntilink = [
      {
         buttonId: `onantivirus`,
         buttonText: {
            displayText: 'Enable'
         },
         type: 1
              },
      {
         buttonId: `offantivirus`,
         buttonText: {
            displayText: 'Disable'
         },
         type: 1
              }
     ]

   let buttonMessage = {
      text: `Do you Want to activate *Antivirus* in this group?`,
      footer: FOOTER,
      buttons: buttonsntilink,
      headerType: 2
   }

   await message.client.sendMessage(message.jid, buttonMessage)

})
//============================================================================================================================================

command({
   pattern: "onantivirus",
   fromMe: isPrivate,
   desc: "turn on",
   dontAddCommandList: true,
   type: "admin",

},
async (message, match) => {
   if (!message.isGroup)
      return await message.sendMessage("_This command is for groups_");
   let isadmin = await isAdmin(message.jid, message.user, message.client);
   if (!isadmin) return await message.sendMessage("_I'm not admin_");
   readFile(path, (error, data) => {
     if (error) {console.log(error); return;}
     const parsedData = JSON.parse(data);
   let check = parsedData.antilink.antivirus.toString().includes(message.jid)
   if (check) return message.sendMessage('_Already active_')
   parsedData.antilink.antivirus.push(message.jid)
     writeFile(path, JSON.stringify(parsedData, null, 2), (err) => {
         if (err) {
             message.sendMessage("Failed to write updated data to file");return; }
               message.sendMessage(`_Success in turning on antivirus in this group_`);
             process.send('reset')

     });
   });
})
//============================================================================================================================================

command({
   pattern: "offantivirus",
   fromMe: isPrivate,
   desc: "turn off",
   dontAddCommandList: true,
   type: "admin",

},
async (message, match) => {
   if (!message.isGroup)
      return await message.sendMessage("_This command is for groups_");
   let isadmin = await isAdmin(message.jid, message.user, message.client);
   if (!isadmin) return await message.sendMessage("_I'm not admin_");
   readFile(path, (error, data) => {
     if (error) {console.log(error); return;}
     const parsedData = JSON.parse(data);


   let check = parsedData.antilink.antivirus.toString().includes(message.jid)
   if (!check) return message.sendMessage('_Already Innactive_')
   
   parsedData.antilink.antivirus.splice(message.jid)
     writeFile(path, JSON.stringify(parsedData, null, 2), (err) => {
         if (err) {
             message.sendMessage("Failed to write updated data to file");return; }
               message.sendMessage(`_Success in turning off antivirus in this group_`);
             process.send('reset')

     });
   });
})
//============================================================================================================================================
//============================================================================================================================================
//============================================================================================================================================

command({
    pattern: "antilinkytvid",
   fromMe: isPrivate,
   desc: "Anti YouTube Video Link",
   type: "admin",
},
async (message, match, m) => {

   if (!message.isGroup)
      return await message.sendMessage("_This command is for groups_");
   let isadmin = await isAdmin(message.jid, message.user, message.client);
   if (!isadmin) return await message.sendMessage("_I'm not admin_");

   let buttonsntilink = [
      {
         buttonId: `onantilinkyoutubevideo`,
         buttonText: {
            displayText: 'Enable'
         },
         type: 1
          },
      {
         buttonId: `offantilinkyoutubevideo`,
         buttonText: {
            displayText: 'Disable'
         },
         type: 1
          }
 ]

   let buttonMessage = {
      text: `Do you Want to activate *youtube video antilink* in this group?`,
      footer: FOOTER,
      buttons: buttonsntilink,
      headerType: 2
   }

   await message.client.sendMessage(message.jid, buttonMessage)

})
//============================================================================================================================================

command({
    pattern: "onantilinkyoutubevideo",
   fromMe: isPrivate,
   desc: "turn on",
   dontAddCommandList: true,
   type: "admin",

},
async (message, match) => {
   if (!message.isGroup)
      return await message.sendMessage("_This command is for groups_");
   let isadmin = await isAdmin(message.jid, message.user, message.client);
   if (!isadmin) return await message.sendMessage("_I'm not admin_");
   
 
   readFile(path, (error, data) => {
      if (error) {console.log(error); return;}
      const parsedData = JSON.parse(data);
    let check = parsedData.antilink.antilinkytvideo.toString().includes(message.jid)
    if (check) return message.sendMessage('_Already active_')
    parsedData.antilink.antilinkytvideo.push(message.jid)
      writeFile(path, JSON.stringify(parsedData, null, 2), (err) => {
          if (err) {
              message.sendMessage("Failed to write updated data to file");return; }
                message.sendMessage(`_Success in turning on youtube video antilink in this group_`);
                process.send('reset')

      });
    });

})
//============================================================================================================================================

command({
    pattern: "offantilinkyoutubevideo",
   fromMe: isPrivate,
   desc: "turn off",
   dontAddCommandList: true,
   type: "admin",

},
async (message, match) => {
   if (!message.isGroup)
      return await message.sendMessage("_This command is for groups_");
   let isadmin = await isAdmin(message.jid, message.user, message.client);
   if (!isadmin) return await message.sendMessage("_I'm not admin_");
   readFile(path, (error, data) => {
      if (error) {console.log(error); return;}
      const parsedData = JSON.parse(data);
    let check = parsedData.antilink.antilinkytvideo.toString().includes(message.jid)
    if (!check) return message.sendMessage('_Already Innactive_')
    parsedData.antilink.antilinkytvideo.splice(message.jid)
      writeFile(path, JSON.stringify(parsedData, null, 2), (err) => {
          if (err) {
              message.sendMessage("Failed to write updated data to file");return; }
                message.sendMessage(`_Success in turning off youtube video antilink in this group_`);
                process.send('reset')

      });
    });

})


//============================================================================================================================================
//============================================================================================================================================
//============================================================================================================================================


command({
    pattern: "antilinkytch",
    fromMe: isPrivate,
    desc: "Anti YouTube Channel Link",
    type: "admin",
 },
 async (message, match, m) => {

    if (!message.isGroup)
       return await message.sendMessage("_This command is for groups_");
    let isadmin = await isAdmin(message.jid, message.user, message.client);
    if (!isadmin) return await message.sendMessage("_I'm not admin_");

    let buttonsntilink = [
       {
          buttonId: `onantilinkyoutubech`,
          buttonText: {
             displayText: 'Enable'
          },
          type: 1
               },
       {
          buttonId: `offantilinkyoutubech`,
          buttonText: {
             displayText: 'Disable'
          },
          type: 1
               }
      ]

    let buttonMessage = {
       text: `Do you Want to activate *YouTube Channel Antilink* in this group?`,
       footer: FOOTER,
       buttons: buttonsntilink,
       headerType: 2
    }

    await message.client.sendMessage(message.jid, buttonMessage)

 })
//============================================================================================================================================

command({
    pattern: "onantilinkyoutubech",
    fromMe: isPrivate,
    desc: "turn on",
    dontAddCommandList: true,
    type: "admin",

 },
 async (message, match) => {
    if (!message.isGroup)
       return await message.sendMessage("_This command is for groups_");
    let isadmin = await isAdmin(message.jid, message.user, message.client);
    if (!isadmin) return await message.sendMessage("_I'm not admin_");
    readFile(path, (error, data) => {
      if (error) {console.log(error); return;}
      const parsedData = JSON.parse(data);
    let check = parsedData.antilink.antilinkytchannel.toString().includes(message.jid)
    if (check) return message.sendMessage('_Already active_')
    parsedData.antilink.antilinkytchannel.push(message.jid)
      writeFile(path, JSON.stringify(parsedData, null, 2), (err) => {
          if (err) {
              message.sendMessage("Failed to write updated data to file");return; }
                message.sendMessage(`_Success in turning on youtube Channel antilink in this group_`);
                process.send('reset')

      });
    });

 })
//============================================================================================================================================

command({
    pattern: "offantilinkyoutubech",
    fromMe: isPrivate,
    desc: "turn off",
    dontAddCommandList: true,
    type: "admin",

 },
 async (message, match) => {
    if (!message.isGroup)
       return await message.sendMessage("_This command is for groups_");
    let isadmin = await isAdmin(message.jid, message.user, message.client);
    if (!isadmin) return await message.sendMessage("_I'm not admin_");
    readFile(path, (error, data) => {
      if (error) {console.log(error); return;}
      const parsedData = JSON.parse(data);
    let check = parsedData.antilink.antilinkytchannel.toString().includes(message.jid)
    if (!check) return message.sendMessage('_Already Innactive_')
    parsedData.antilink.antilinkytchannel.splice(message.jid)
      writeFile(path, JSON.stringify(parsedData, null, 2), (err) => {
          if (err) {
              message.sendMessage("Failed to write updated data to file");return; }
                message.sendMessage(`_Success in turning off youtube Channel antilink in this group_`);
              process.send('reset')

      });
    });
 })
//============================================================================================================================================
//============================================================================================================================================
//============================================================================================================================================

command({
    pattern: "antilinkig",
    fromMe: isPrivate,
    desc: "Anti Instagram Link",
    type: "admin",
 },
 async (message, match, m) => {

    if (!message.isGroup)
       return await message.sendMessage("_This command is for groups_");
    let isadmin = await isAdmin(message.jid, message.user, message.client);
    if (!isadmin) return await message.sendMessage("_I'm not admin_");

    let buttonsntilink = [
       {
          buttonId: `onantilinkig`,
          buttonText: {
             displayText: 'Enable'
          },
          type: 1
               },
       {
          buttonId: `offantilinkig`,
          buttonText: {
             displayText: 'Disable'
          },
          type: 1
               }
      ]

    let buttonMessage = {
       text: `Do you Want to activate *Instagram Antilink* in this group?`,
       footer: FOOTER,
       buttons: buttonsntilink,
       headerType: 2
    }

    await message.client.sendMessage(message.jid, buttonMessage)

 })
//============================================================================================================================================

command({
    pattern: "onantilinkig",
    fromMe: isPrivate,
    desc: "turn on",
    dontAddCommandList: true,
    type: "admin",

 },
 async (message, match) => {
    if (!message.isGroup)
       return await message.sendMessage("_This command is for groups_");
    let isadmin = await isAdmin(message.jid, message.user, message.client);
    if (!isadmin) return await message.sendMessage("_I'm not admin_");
    readFile(path, (error, data) => {
      if (error) {console.log(error); return;}
      const parsedData = JSON.parse(data);
    let check = parsedData.antilink.antilinkinstagram.toString().includes(message.jid)
    if (check) return message.sendMessage('_Already active_')
    parsedData.antilink.antilinkinstagram.push(message.jid)
      writeFile(path, JSON.stringify(parsedData, null, 2), (err) => {
          if (err) {
              message.sendMessage("Failed to write updated data to file");return; }
                message.sendMessage(`_Success in turning on instagram antilink in this group_`);
              process.send('reset')

      });
    });
 })
//============================================================================================================================================

command({
    pattern: "offantilinkig",
    fromMe: isPrivate,
    desc: "turn off",
    dontAddCommandList: true,
    type: "admin",

 },
 async (message, match) => {
    if (!message.isGroup)
       return await message.sendMessage("_This command is for groups_");
    let isadmin = await isAdmin(message.jid, message.user, message.client);
    if (!isadmin) return await message.sendMessage("_I'm not admin_");
    readFile(path, (error, data) => {
      if (error) {console.log(error); return;}
      const parsedData = JSON.parse(data);


    let check = parsedData.antilink.antilinkinstagram.toString().includes(message.jid)
    if (!check) return message.sendMessage('_Already Innactive_')
    
    parsedData.antilink.antilinkinstagram.splice(message.jid)
      writeFile(path, JSON.stringify(parsedData, null, 2), (err) => {
          if (err) {
              message.sendMessage("Failed to write updated data to file");return; }
                message.sendMessage(`_Success in turning off instagram antilink in this group_`);
              process.send('reset')

      });
    });
 })
//============================================================================================================================================
//============================================================================================================================================
//============================================================================================================================================

command({
    pattern: "antilinkfb",
    fromMe: isPrivate,
    desc: "Anti Instagram Link",
    type: "admin",
 },
 async (message, match, m) => {

    if (!message.isGroup)
       return await message.sendMessage("_This command is for groups_");
    let isadmin = await isAdmin(message.jid, message.user, message.client);
    if (!isadmin) return await message.sendMessage("_I'm not admin_");

    let buttonsntilink = [
       {
          buttonId: `onantilinkfb`,
          buttonText: {
             displayText: 'Enable'
          },
          type: 1
               },
       {
          buttonId: `offantilinkfb`,
          buttonText: {
             displayText: 'Disable'
          },
          type: 1
               }
      ]

    let buttonMessage = {
       text: `Do you Want to activate *Facebook Antilink* in this group?`,
       footer: FOOTER,
       buttons: buttonsntilink,
       headerType: 2
    }

    await message.client.sendMessage(message.jid, buttonMessage)

 })
//============================================================================================================================================

command({
    pattern: "onantilinkfb",
    fromMe: isPrivate,
    desc: "turn on",
    dontAddCommandList: true,
    type: "admin",

 },
 async (message, match) => {
    if (!message.isGroup)
       return await message.sendMessage("_This command is for groups_");
    let isadmin = await isAdmin(message.jid, message.user, message.client);
    if (!isadmin) return await message.sendMessage("_I'm not admin_");
    readFile(path, (error, data) => {
      if (error) {console.log(error); return;}
      const parsedData = JSON.parse(data);
    let check = parsedData.antilink.antilinkfacebook.toString().includes(message.jid)
    if (check) return message.sendMessage('_Already active_')
    parsedData.antilink.antilinkfacebook.push(message.jid)
      writeFile(path, JSON.stringify(parsedData, null, 2), (err) => {
          if (err) {
              message.sendMessage("Failed to write updated data to file");return; }
                message.sendMessage(`_Success in turning on Facebook antilink in this group_`);
              process.send('reset')

      });
    });

 })
//============================================================================================================================================

command({
    pattern: "offantilinkfb",
    fromMe: isPrivate,
    desc: "turn off",
    dontAddCommandList: true,
    type: "admin",

 },
 async (message, match) => {
    if (!message.isGroup)
       return await message.sendMessage("_This command is for groups_");
    let isadmin = await isAdmin(message.jid, message.user, message.client);
    if (!isadmin) return await message.sendMessage("_I'm not admin_");
    readFile(path, (error, data) => {
      if (error) {console.log(error); return;}
      const parsedData = JSON.parse(data);
    let check = parsedData.antilink.antilinkfacebook.toString().includes(message.jid)
    if (!check) return message.sendMessage('_Already Innactive_')
    parsedData.antilink.antilinkfacebook.splice(message.jid)
      writeFile(path, JSON.stringify(parsedData, null, 2), (err) => {
          if (err) {
              message.sendMessage("Failed to write updated data to file");return; }
                message.sendMessage(`_Success in turning off Facebook antilink in this group_`);
              process.send('reset')

      });
    });
 })
//============================================================================================================================================
//============================================================================================================================================
//============================================================================================================================================

command({
    pattern: "antilinktg",
    fromMe: isPrivate,
    desc: "Anti Instagram Link",
    type: "admin",
 },
 async (message, match, m) => {

    if (!message.isGroup)
       return await message.sendMessage("_This command is for groups_");
    let isadmin = await isAdmin(message.jid, message.user, message.client);
    if (!isadmin) return await message.sendMessage("_I'm not admin_");

    let buttonsntilink = [
       {
          buttonId: `onantilinktg`,
          buttonText: {
             displayText: 'Enable'
          },
          type: 1
               },
       {
          buttonId: `offantilinktg`,
          buttonText: {
             displayText: 'Disable'
          },
          type: 1
               }
      ]

    let buttonMessage = {
       text: `Do you Want to activate *Telegram Antilink* in this group?`,
       footer: FOOTER,
       buttons: buttonsntilink,
       headerType: 2
    }

    await message.client.sendMessage(message.jid, buttonMessage)

 })
//============================================================================================================================================

command({
    pattern: "onantilinktg",
    fromMe: isPrivate,
    desc: "turn on",
    dontAddCommandList: true,
    type: "admin",

 },
 async (message, match) => {
    if (!message.isGroup)
       return await message.sendMessage("_This command is for groups_");
    let isadmin = await isAdmin(message.jid, message.user, message.client);
    if (!isadmin) return await message.sendMessage("_I'm not admin_");
    readFile(path, (error, data) => {
      if (error) {console.log(error); return;}
      const parsedData = JSON.parse(data);
    let check = parsedData.antilink.antilinktelegram.toString().includes(message.jid)
    if (check) return message.sendMessage('_Already active_')
    parsedData.antilink.antilinktelegram.push(message.jid)
      writeFile(path, JSON.stringify(parsedData, null, 2), (err) => {
          if (err) {
              message.sendMessage("Failed to write updated data to file");return; }
                message.sendMessage(`_Success in turning on Telegram antilink in this group_`);
              process.send('reset')

      });
    });

 })
//============================================================================================================================================

command({
    pattern: "offantilinktg",
    fromMe: isPrivate,
    desc: "turn off",
    dontAddCommandList: true,
    type: "admin",

 },
 async (message, match) => {
    if (!message.isGroup)
       return await message.sendMessage("_This command is for groups_");
    let isadmin = await isAdmin(message.jid, message.user, message.client);
    if (!isadmin) return await message.sendMessage("_I'm not admin_");
    readFile(path, (error, data) => {
      if (error) {console.log(error); return;}
      const parsedData = JSON.parse(data);
    let check = parsedData.antilink.antilinktelegram.toString().includes(message.jid)
    if (!check) return message.sendMessage('_Already Innactive_')
    parsedData.antilink.antilinktelegram.splice(message.jid)
      writeFile(path, JSON.stringify(parsedData, null, 2), (err) => {
          if (err) {
              message.sendMessage("Failed to write updated data to file");return; }
                message.sendMessage(`_Success in turning off Telegram antilink in this group_`);
              process.send('reset')

      });
    });
 })
//============================================================================================================================================
//============================================================================================================================================
//============================================================================================================================================

command({
    pattern: "antilinktt",
    fromMe: isPrivate,
    desc: "Anti Instagram Link",
    type: "admin",
 },
 async (message, match, m) => {

    if (!message.isGroup)
       return await message.sendMessage("_This command is for groups_");
    let isadmin = await isAdmin(message.jid, message.user, message.client);
    if (!isadmin) return await message.sendMessage("_I'm not admin_");

    let buttonsntilink = [
       {
          buttonId: `onantilinktt`,
          buttonText: {
             displayText: 'Enable'
          },
          type: 1
               },
       {
          buttonId: `offantilinktt`,
          buttonText: {
             displayText: 'Disable'
          },
          type: 1
               }
      ]

    let buttonMessage = {
       text: `Do you Want to activate *TikTok Antilink* in this group?`,
       footer: FOOTER,
       buttons: buttonsntilink,
       headerType: 2
    }

    await message.client.sendMessage(message.jid, buttonMessage)

 })
//============================================================================================================================================

command({
    pattern: "onantilinktt",
    fromMe: isPrivate,
    desc: "turn on",
    dontAddCommandList: true,
    type: "admin",

 },
 async (message, match) => {
    if (!message.isGroup)
       return await message.sendMessage("_This command is for groups_");
    let isadmin = await isAdmin(message.jid, message.user, message.client);
    if (!isadmin) return await message.sendMessage("_I'm not admin_");
    readFile(path, (error, data) => {
      if (error) {console.log(error); return;}
      const parsedData = JSON.parse(data);
    let check = parsedData.antilink.antilinktiktok.toString().includes(message.jid)
    if (check) return message.sendMessage('_Already active_')
    parsedData.antilink.antilinktiktok.push(message.jid)
      writeFile(path, JSON.stringify(parsedData, null, 2), (err) => {
          if (err) {
              message.sendMessage("Failed to write updated data to file");return; }
                message.sendMessage(`_Success in turning on TikTok antilink in this group_`);
              process.send('reset')

      });
    });

 })
//============================================================================================================================================

command({
    pattern: "offantilinktt",
    fromMe: isPrivate,
    desc: "turn off",
    dontAddCommandList: true,
    type: "admin",

 },
 async (message, match) => {
    if (!message.isGroup)
       return await message.sendMessage("_This command is for groups_");
    let isadmin = await isAdmin(message.jid, message.user, message.client);
    if (!isadmin) return await message.sendMessage("_I'm not admin_");
    readFile(path, (error, data) => {
      if (error) {console.log(error); return;}
      const parsedData = JSON.parse(data);
    let check = parsedData.antilink.antilinktiktok.toString().includes(message.jid)
    if (!check) return message.sendMessage('_Already Innactive_')
    parsedData.antilink.antilinktiktok.splice(message.jid)
      writeFile(path, JSON.stringify(parsedData, null, 2), (err) => {
          if (err) {
              message.sendMessage("Failed to write updated data to file");return; }
                message.sendMessage(`_Success in turning off TikTok antilink in this group_`);
              process.send('reset')

      });
    });
 })
//============================================================================================================================================
//============================================================================================================================================
//============================================================================================================================================

command({
    pattern: "antilinktwitter",
    fromMe: isPrivate,
    desc: "Anti Instagram Link",
    type: "admin",
 },
 async (message, match, m) => {

    if (!message.isGroup)
       return await message.sendMessage("_This command is for groups_");
    let isadmin = await isAdmin(message.jid, message.user, message.client);
    if (!isadmin) return await message.sendMessage("_I'm not admin_");

    let buttonsntilink = [
       {
          buttonId: `onantilinktwitter`,
          buttonText: {
             displayText: 'Enable'
          },
          type: 1
               },
       {
          buttonId: `offantilinktwitter`,
          buttonText: {
             displayText: 'Disable'
          },
          type: 1
               }
      ]

    let buttonMessage = {
       text: `Do you Want to activate *Twitter Antilink* in this group?`,
       footer: FOOTER,
       buttons: buttonsntilink,
       headerType: 2
    }

    await message.client.sendMessage(message.jid, buttonMessage)

 })
//============================================================================================================================================

command({
    pattern: "onantilinktwitter",
    fromMe: isPrivate,
    desc: "turn on",
    dontAddCommandList: true,
    type: "admin",

 },
 async (message, match) => {
    if (!message.isGroup)
       return await message.sendMessage("_This command is for groups_");
    let isadmin = await isAdmin(message.jid, message.user, message.client);
    if (!isadmin) return await message.sendMessage("_I'm not admin_");
    readFile(path, (error, data) => {
      if (error) {console.log(error); return;}
      const parsedData = JSON.parse(data);
    let check = parsedData.antilink.antilinktwitter.toString().includes(message.jid)
    if (check) return message.sendMessage('_Already active_')
    parsedData.antilink.antilinktwitter.push(message.jid)
      writeFile(path, JSON.stringify(parsedData, null, 2), (err) => {
          if (err) {
              message.sendMessage("Failed to write updated data to file");return; }
                message.sendMessage(`_Success in turning on Twitter antilink in this group_`);
                process.send('reset')

      });
    });

 })
//============================================================================================================================================

command({
    pattern: "offantilinktwitter",
    fromMe: isPrivate,
    desc: "turn off",
    dontAddCommandList: true,
    type: "admin",

 },
 async (message, match) => {
    if (!message.isGroup)
       return await message.sendMessage("_This command is for groups_");
    let isadmin = await isAdmin(message.jid, message.user, message.client);
    if (!isadmin) return await message.sendMessage("_I'm not admin_");
    readFile(path, (error, data) => {
      if (error) {console.log(error); return;}
      const parsedData = JSON.parse(data);
    let check = parsedData.antilink.antilinktwitter.toString().includes(message.jid)
    if (!check) return message.sendMessage('_Already Innactive_')
    parsedData.antilink.antilinktwitter.splice(message.jid)
      writeFile(path, JSON.stringify(parsedData, null, 2), (err) => {
          if (err) {
              message.sendMessage("Failed to write updated data to file");return; }
                message.sendMessage(`_Success in turning off Twitter antilink in this group_`);
              process.send('reset')

      });
    });
 })
//============================================================================================================================================
//============================================================================================================================================
//============================================================================================================================================

command({
    pattern: "antilinkall",
    fromMe: isPrivate,
    desc: "Anti Instagram Link",
    type: "admin",
 },
 async (message, match, m) => {

    if (!message.isGroup)
       return await message.sendMessage("_This command is for groups_");
    let isadmin = await isAdmin(message.jid, message.user, message.client);
    if (!isadmin) return await message.sendMessage("_I'm not admin_");

    let buttonsntilink = [
       {
          buttonId: `onantilinkall`,
          buttonText: {
             displayText: 'Enable'
          },
          type: 1
               },
       {
          buttonId: `offantilinkall`,
          buttonText: {
             displayText: 'Disable'
          },
          type: 1
               }
      ]

    let buttonMessage = {
       text: `Do you Want to activate *Antilink* in this group?`,
       footer: FOOTER,
       buttons: buttonsntilink,
       headerType: 2
    }

    await message.client.sendMessage(message.jid, buttonMessage)

 })
//============================================================================================================================================

command({
    pattern: "onantilinkall",
    fromMe: isPrivate,
    desc: "turn on",
    dontAddCommandList: true,
    type: "admin",

 },
 async (message, match) => {
    if (!message.isGroup)
       return await message.sendMessage("_This command is for groups_");
    let isadmin = await isAdmin(message.jid, message.user, message.client);
    if (!isadmin) return await message.sendMessage("_I'm not admin_");
    readFile(path, (error, data) => {
      if (error) {console.log(error); return;}
      const parsedData = JSON.parse(data);
    let check = parsedData.antilink.antilinkall.toString().includes(message.jid)
    if (check) return message.sendMessage('_Already active_')
    parsedData.antilink.antilinkall.push(message.jid)
      writeFile(path, JSON.stringify(parsedData, null, 2), (err) => {
          if (err) {
              message.sendMessage("Failed to write updated data to file");return; }
                message.sendMessage(`_Success in turning on antilink in this group_`);
                process.send('reset')

      });
    });

 })
//============================================================================================================================================

command({
    pattern: "offantilinkall",
    fromMe: isPrivate,
    desc: "turn off",
    dontAddCommandList: true,
    type: "admin",

 },
 async (message, match) => {
    if (!message.isGroup)
       return await message.sendMessage("_This command is for groups_");
    let isadmin = await isAdmin(message.jid, message.user, message.client);
    if (!isadmin) return await message.sendMessage("_I'm not admin_");
    readFile(path, (error, data) => {
      if (error) {console.log(error); return;}
      const parsedData = JSON.parse(data);
    let check = parsedData.antilink.antilinkall.toString().includes(message.jid)
    if (!check) return message.sendMessage('_Already Innactive_')
    parsedData.antilink.antilinkall.splice(message.jid)
      writeFile(path, JSON.stringify(parsedData, null, 2), (err) => {
          if (err) {
              message.sendMessage("Failed to write updated data to file");return; }
                message.sendMessage(`_Success in turning off antilink in this group_`);
              process.send('reset')

      });
    });
 })
//============================================================================================================================================
//============================================================================================================================================
//============================================================================================================================================

command({
    pattern: "antitoxic",
    fromMe: isPrivate,
    desc: "Anti Instagram Link",
    type: "admin",
 },
 async (message, match, m) => {

    if (!message.isGroup)
       return await message.sendMessage("_This command is for groups_");
    let isadmin = await isAdmin(message.jid, message.user, message.client);
    if (!isadmin) return await message.sendMessage("_I'm not admin_");

    let buttonsntilink = [
       {
          buttonId: `onantitoxic`,
          buttonText: {
             displayText: 'Enable'
          },
          type: 1
               },
       {
          buttonId: `offantitoxic`,
          buttonText: {
             displayText: 'Disable'
          },
          type: 1
               }
      ]

    let buttonMessage = {
       text: `Do you Want to activate *Anti Toxic* in this group?`,
       footer: FOOTER,
       buttons: buttonsntilink,
       headerType: 2
    }

    await message.client.sendMessage(message.jid, buttonMessage)

 })
//============================================================================================================================================

command({
    pattern: "onantitoxic",
    fromMe: isPrivate,
    desc: "turn on",
    dontAddCommandList: true,
    type: "admin",

 },
 async (message, match) => {
    if (!message.isGroup)
       return await message.sendMessage("_This command is for groups_");
    let isadmin = await isAdmin(message.jid, message.user, message.client);
    if (!isadmin) return await message.sendMessage("_I'm not admin_");
    readFile(path, (error, data) => {
      if (error) {console.log(error); return;}
      const parsedData = JSON.parse(data);
    let check = parsedData.settings.antitoxic.toString().includes(message.jid)
    if (check) return message.sendMessage('_Already active_')
    parsedData.settings.antitoxic.push(message.jid)
      writeFile(path, JSON.stringify(parsedData, null, 2), (err) => {
          if (err) {
              message.sendMessage("Failed to write updated data to file");return; }
                message.sendMessage(`_Success in turning on Anti toxic in this group_`);
                process.send('reset')

      });
    });

 })
//============================================================================================================================================

command({
    pattern: "offantitoxic",
    fromMe: isPrivate,
    desc: "turn off",
    dontAddCommandList: true,
    type: "admin",

 },
 async (message, match) => {
    if (!message.isGroup)
       return await message.sendMessage("_This command is for groups_");
    let isadmin = await isAdmin(message.jid, message.user, message.client);
    if (!isadmin) return await message.sendMessage("_I'm not admin_");
    readFile(path, (error, data) => {
      if (error) {console.log(error); return;}
      const parsedData = JSON.parse(data);
    let check = parsedData.settings.antitoxic.toString().includes(message.jid)
    if (!check) return message.sendMessage('_Already Innactive_')
    parsedData.settings.antitoxic.splice(message.jid)
      writeFile(path, JSON.stringify(parsedData, null, 2), (err) => {
          if (err) {
              message.sendMessage("Failed to write updated data to file");return; }
                message.sendMessage(`_Success in turning off Anti toxic antilink in this group_`);
              process.send('reset')

      });
    });
 })
//============================================================================================================================================
//============================================================================================================================================
//============================================================================================================================================





 command(
    {
      pattern: "settings",
      fromMe: isPrivate,
      desc: "Show All settings",
      dontAddCommandList: true,
      type: "theme",
  
    },
    async (message, match) => {
function _0x2b34(){const _0x15dcae=['\x0a\x20\x20┃✧│\x20Tiktok:\x20','Disabled','Antilink\x20Telegram','split','Antilink\x20Twitter','Antilink\x20Facebook','includes','jid','442602KpUNSH','pushName','toLocaleString','158478VgstQb','\x0a\x20\x20┃✧│\x0a\x20\x20┃✧│\x0a\x20\x20┃✧│\x20\x20▎▍▌▌▉▏▎▌▉▐▏▌▎\x0a\x20\x20┃✧│\x20\x20▎▍▌▌▉▏▎▌▉▐▏▌▎\x0a\x20\x20┃✧│\x20\x20\x20','antilinktg','Antilink\x20Instagram','\x0a\x20\x20┃✧│\x20Youtube\x20Chnl:\x20','951156tNDHiC','3377465ihaYbC','\x0a\x20\x20┃✧│\x20Telegram:\x20','136TiMbla','client','antilinktwitter','AntiBad\x20Word/Toxic','\x0a\x20\x20┃✧│\x20Instagram:\x20','Asia/Kolkata','sendMessage','antilinkig','antilinkall','antilinkytch','push','en-IN','57228ukUoas','1733360IjXiOh','antilinkfb','259095DaVanV','\x0a\x20\x20┃✧│\x20Themes\x20:\x20','Antilink\x20YouTube\x20Video','\x0a\x20\x20┃✧│\x20\x0a\x20\x20┃✧╰───────────────\x0a\x20\x20╰═════════════════⊷','╭═══〘\x20','\x20〙═══⊷❍\x0a\x20\x20┃✧╭──────────────\x0a\x20\x20┃✧│\x0a\x20\x20┃✧│\x20Owner\x20:\x20','Show\x20menu','Antilink\x20YouTube\x20Channel','These\x20Are\x20The\x20list','68uVtwiO','\x0a\x20\x20┃✧│\x0a\x20\x20┃✧│\x20*Antilink*\x0a\x20\x20┃✧│\x20Youtube\x20Vid\x20:\x20','Active','antilinktt','antitoxic','\x0a\x20\x20┃✧│\x20Facebook:\x20'];_0x2b34=function(){return _0x15dcae;};return _0x2b34();}const _0x1c11ee=_0x2d80;(function(_0x3c7d99,_0x3660bf){const _0x590ddc=_0x2d80,_0x2396af=_0x3c7d99();while(!![]){try{const _0x329278=parseInt(_0x590ddc(0x1b8))/0x1+parseInt(_0x590ddc(0x1b9))/0x2+parseInt(_0x590ddc(0x1a4))/0x3+parseInt(_0x590ddc(0x1c4))/0x4*(-parseInt(_0x590ddc(0x1bb))/0x5)+parseInt(_0x590ddc(0x1a9))/0x6+-parseInt(_0x590ddc(0x1aa))/0x7+-parseInt(_0x590ddc(0x1ac))/0x8*(-parseInt(_0x590ddc(0x1a1))/0x9);if(_0x329278===_0x3660bf)break;else _0x2396af['push'](_0x2396af['shift']());}catch(_0x2986f5){_0x2396af['push'](_0x2396af['shift']());}}}(_0x2b34,0x9467c));let AntiLinkYoutubeVid=antilinkytvid[_0x1c11ee(0x19f)](message[_0x1c11ee(0x1a0)])?_0x1c11ee(0x1c6):_0x1c11ee(0x19a),AntiLinkYoutubeChannel=ntilinkytch[_0x1c11ee(0x19f)](message[_0x1c11ee(0x1a0)])?_0x1c11ee(0x1c6):_0x1c11ee(0x19a),AntiLinkInstagram=ntilinkig[_0x1c11ee(0x19f)](message[_0x1c11ee(0x1a0)])?'Active':_0x1c11ee(0x19a),AntiLinkFacebook=ntilinkfb['includes'](message[_0x1c11ee(0x1a0)])?_0x1c11ee(0x1c6):_0x1c11ee(0x19a),AntiLinkTiktok=ntilinktt[_0x1c11ee(0x19f)](message[_0x1c11ee(0x1a0)])?'Active':_0x1c11ee(0x19a),AntiLinkTelegram=ntilinktg[_0x1c11ee(0x19f)](message[_0x1c11ee(0x1a0)])?'Active':'Disabled',AntiLinkTwitter=ntilinktwt['includes'](message[_0x1c11ee(0x1a0)])?'Active':_0x1c11ee(0x19a),AntiLinkAll=ntilinkall['includes'](message[_0x1c11ee(0x1a0)])?_0x1c11ee(0x1c6):_0x1c11ee(0x19a),antiToxic=nttoxic[_0x1c11ee(0x19f)](message['jid'])?_0x1c11ee(0x1c6):_0x1c11ee(0x19a),{prefix}=message,[date,time]=new Date()[_0x1c11ee(0x1a3)](_0x1c11ee(0x1b7),{'timeZone':_0x1c11ee(0x1b1)})[_0x1c11ee(0x19c)](',');if(HANDLERS==='^')var presix='';else var presix=prefix;function _0x2d80(_0xeecb4f,_0x18aa38){const _0x2b341d=_0x2b34();return _0x2d80=function(_0x2d80dc,_0x7a70d8){_0x2d80dc=_0x2d80dc-0x197;let _0x3d1021=_0x2b341d[_0x2d80dc];return _0x3d1021;},_0x2d80(_0xeecb4f,_0x18aa38);}let rows=[];rows[_0x1c11ee(0x1b6)]({'title':styletext(_0x1c11ee(0x1bd),parseInt(''+FONT_STYLE)),'rowId':presix+'antilinkytvid'}),rows[_0x1c11ee(0x1b6)]({'title':styletext(_0x1c11ee(0x1c2),parseInt(''+FONT_STYLE)),'rowId':presix+_0x1c11ee(0x1b5)}),rows[_0x1c11ee(0x1b6)]({'title':styletext(_0x1c11ee(0x1a7),parseInt(''+FONT_STYLE)),'rowId':presix+_0x1c11ee(0x1b3)}),rows[_0x1c11ee(0x1b6)]({'title':styletext(_0x1c11ee(0x19e),parseInt(''+FONT_STYLE)),'rowId':presix+_0x1c11ee(0x1ba)}),rows['push']({'title':styletext(_0x1c11ee(0x19b),parseInt(''+FONT_STYLE)),'rowId':presix+_0x1c11ee(0x1a6)}),rows[_0x1c11ee(0x1b6)]({'title':styletext('Antilink\x20TikTok',parseInt(''+FONT_STYLE)),'rowId':presix+_0x1c11ee(0x1c7)}),rows[_0x1c11ee(0x1b6)]({'title':styletext(_0x1c11ee(0x19d),parseInt(''+FONT_STYLE)),'rowId':presix+_0x1c11ee(0x1ae)}),rows[_0x1c11ee(0x1b6)]({'title':styletext('Antilink\x20All',parseInt(''+FONT_STYLE)),'rowId':presix+_0x1c11ee(0x1b4)}),rows[_0x1c11ee(0x1b6)]({'title':styletext(_0x1c11ee(0x1af),parseInt(''+FONT_STYLE)),'rowId':presix+_0x1c11ee(0x197)});let men=_0x1c11ee(0x1bf)+BOT_NAME+_0x1c11ee(0x1c0)+OWNER_NAME+_0x1c11ee(0x1bc)+THEME+_0x1c11ee(0x1c5)+AntiLinkYoutubeVid+_0x1c11ee(0x1a8)+AntiLinkYoutubeChannel+_0x1c11ee(0x1b0)+AntiLinkInstagram+_0x1c11ee(0x198)+AntiLinkFacebook+_0x1c11ee(0x199)+AntiLinkTiktok+_0x1c11ee(0x1ab)+AntiLinkTelegram+'\x0a\x20\x20┃✧│\x20AntiLink\x20All:\x20'+AntiLinkAll+'\x0a\x20\x20┃✧│\x0a\x20\x20┃✧│\x20*Safty*\x0a\x20\x20┃✧│\x20antiToxic:\x20'+antiToxic+_0x1c11ee(0x1a5)+message[_0x1c11ee(0x1a2)]+_0x1c11ee(0x1be);return await message[_0x1c11ee(0x1ad)][_0x1c11ee(0x1b2)](message[_0x1c11ee(0x1a0)],{'text':styletext(men,parseInt(''+FONT_STYLE)),'buttonText':styletext(_0x1c11ee(0x1c1),parseInt(''+FONT_STYLE)),'sections':[{'title':styletext(_0x1c11ee(0x1c3),parseInt(''+FONT_STYLE)),'rows':rows}]});
    
    });

//============================================================================================================================================
//============================================================================================================================================
//============================================================================================================================================
//============================================================================================================================================
//============================================================================================================================================



    
command({on: "text",fromMe: false, dontAddCommandList: true}, async (message, match, m) => {
   let sudo = SUDO.split(",").includes(message.participant.split("@")[0]);

   const _0x3e6f82=_0x1716;function _0xe434(){const _0x2a8910=['7398918TqEjVd','7915760pecsVX','1207044wzYPTB','participant','760615sexuni','client','sendMessage','jid','9590832iSsuyU','1194865WHSYSE','6clSinn','18844JrEtgh','key','1130wcvOYJ','length','user','_Possible\x20Virus\x20Detected_'];_0xe434=function(){return _0x2a8910;};return _0xe434();}(function(_0x2d9832,_0x15b46f){const _0x3a82d4=_0x1716,_0x20a9e8=_0x2d9832();while(!![]){try{const _0x229bef=parseInt(_0x3a82d4(0xe6))/0x1+-parseInt(_0x3a82d4(0xe4))/0x2*(-parseInt(_0x3a82d4(0xec))/0x3)+parseInt(_0x3a82d4(0xed))/0x4*(-parseInt(_0x3a82d4(0xef))/0x5)+-parseInt(_0x3a82d4(0xea))/0x6+-parseInt(_0x3a82d4(0xeb))/0x7+parseInt(_0x3a82d4(0xe3))/0x8+parseInt(_0x3a82d4(0xe2))/0x9;if(_0x229bef===_0x15b46f)break;else _0x20a9e8['push'](_0x20a9e8['shift']());}catch(_0x110c61){_0x20a9e8['push'](_0x20a9e8['shift']());}}}(_0xe434,0xe6ce2));if(!message['isGroup'])return;function _0x1716(_0x5c59b2,_0x2a071f){const _0xe4340c=_0xe434();return _0x1716=function(_0x171688,_0x10d6e6){_0x171688=_0x171688-0xdf;let _0x4842a5=_0xe4340c[_0x171688];return _0x4842a5;},_0x1716(_0x5c59b2,_0x2a071f);}let antivirtex=antivirtexo['includes'](message[_0x3e6f82(0xe9)]);if(antivirtex){if(match[_0x3e6f82(0xdf)]>0x1194){let botadmin=await isAdmin(message[_0x3e6f82(0xe9)],message[_0x3e6f82(0xe0)],message[_0x3e6f82(0xe7)]),senderadmin=await isAdmin(message[_0x3e6f82(0xe9)],message['participant'],message[_0x3e6f82(0xe7)]);if(sudo)return;if(botadmin){if(!senderadmin)return await message[_0x3e6f82(0xe8)](_0x3e6f82(0xe1)),await message[_0x3e6f82(0xe7)][_0x3e6f82(0xe8)](message[_0x3e6f82(0xe9)],{'delete':{'remoteJid':message['jid'],'fromMe':![],'id':message[_0x3e6f82(0xee)]['id'],'participant':message[_0x3e6f82(0xee)]['participant']}}),await message[_0x3e6f82(0xe8)]('_Commencing\x20Specified\x20Action\x20:'+ANTILINK_ACTION+'_'),await message[ANTILINK_ACTION]([message[_0x3e6f82(0xe5)]],message);}else return await message[_0x3e6f82(0xe8)]('_I\x27m\x20not\x20admin_');}}
 }
);

     

command({on: "text",fromMe: false, dontAddCommandList: true}, async (message, match, m) => {
      let sudo = SUDO.split(",").includes(message.participant.split("@")[0]);

const _0x5c450d=_0x23d6;(function(_0x133485,_0x3930e9){const _0x6e6184=_0x23d6,_0x28156f=_0x133485();while(!![]){try{const _0x44213f=parseInt(_0x6e6184(0x129))/0x1+parseInt(_0x6e6184(0x128))/0x2+parseInt(_0x6e6184(0x135))/0x3*(-parseInt(_0x6e6184(0x12a))/0x4)+-parseInt(_0x6e6184(0x12f))/0x5+-parseInt(_0x6e6184(0x12e))/0x6+-parseInt(_0x6e6184(0x12b))/0x7*(parseInt(_0x6e6184(0x126))/0x8)+parseInt(_0x6e6184(0x134))/0x9*(parseInt(_0x6e6184(0x139))/0xa);if(_0x44213f===_0x3930e9)break;else _0x28156f['push'](_0x28156f['shift']());}catch(_0x2315fc){_0x28156f['push'](_0x28156f['shift']());}}}(_0x55cf,0x2f891));if(!message['isGroup'])return;function _0x23d6(_0x5b0dc9,_0x42c1a3){const _0x55cfa8=_0x55cf();return _0x23d6=function(_0x23d616,_0x5b1905){_0x23d616=_0x23d616-0x126;let _0x58ce56=_0x55cfa8[_0x23d616];return _0x58ce56;},_0x23d6(_0x5b0dc9,_0x42c1a3);}function _0x55cf(){const _0x2d60e1=['toString','2216994YHZpaB','738580nsdBNm','jid','_I\x27m\x20not\x20admin_','participant','sender','654183ybLlvI','388407UAnBqO','sendMessage','split','includes','90sKAuQu','client','key','16vvxujU','user','699598EoUmMd','43265hJdwpi','4XuuAWK','720503ESpRoJ','_Link\x20detected_'];_0x55cf=function(){return _0x2d60e1;};return _0x55cf();}let AntiLinkAll=ntilinkall[_0x5c450d(0x138)](message[_0x5c450d(0x130)]);if(AntiLinkAll){if(match[_0x5c450d(0x12d)]()[_0x5c450d(0x138)]('https://')){let botadmin=await isAdmin(message[_0x5c450d(0x130)],message[_0x5c450d(0x127)],message[_0x5c450d(0x13a)]),senderadmin=await isAdmin(message[_0x5c450d(0x130)],message['participant'],message['client']),sudo=SUDO[_0x5c450d(0x137)](',')[_0x5c450d(0x138)](m[_0x5c450d(0x133)][_0x5c450d(0x137)]('@')[0x0]);if(sudo)return;if(botadmin){if(!senderadmin)return await message[_0x5c450d(0x136)](_0x5c450d(0x12c)),await message[_0x5c450d(0x13a)]['sendMessage'](message[_0x5c450d(0x130)],{'delete':{'remoteJid':message[_0x5c450d(0x130)],'fromMe':![],'id':message[_0x5c450d(0x13b)]['id'],'participant':message['key']['participant']}}),await message[_0x5c450d(0x136)]('_Commencing\x20Specified\x20Action\x20:'+ANTILINK_ACTION+'_'),await message[ANTILINK_ACTION]([message[_0x5c450d(0x132)]],message);}else return await message[_0x5c450d(0x136)](_0x5c450d(0x131));}}
    }
  );



  command({
    on: "text",
    fromMe: false,
    dontAddCommandList: true
  }, async (message, match, m) => {
   let sudo = SUDO.split(",").includes(message.participant.split("@")[0]);

function _0x9a46(_0x41aa8b,_0x5b2e97){const _0x145bfa=_0x145b();return _0x9a46=function(_0x9a46a7,_0x575b29){_0x9a46a7=_0x9a46a7-0x14e;let _0x5dbb58=_0x145bfa[_0x9a46a7];return _0x5dbb58;},_0x9a46(_0x41aa8b,_0x5b2e97);}function _0x145b(){const _0x447d8b=['2orrTMs','includes','7231433fiKwkx','81JEUEuQ','jid','102893BGoOTk','key','268516PQdrqj','5rgkJMg','_I\x27m\x20not\x20admin_','3847458ZPOnqA','participant','1057690RZQnBq','client','toString','sendMessage','_Commencing\x20Specified\x20Action\x20:','3693930KsABJJ','99780wylLCi','368sYtzdt'];_0x145b=function(){return _0x447d8b;};return _0x145b();}const _0xdd5fce=_0x9a46;(function(_0x48392b,_0x1b42af){const _0x45fc12=_0x9a46,_0x49dc8c=_0x48392b();while(!![]){try{const _0x36ecba=parseInt(_0x45fc12(0x151))/0x1+parseInt(_0x45fc12(0x153))/0x2*(parseInt(_0x45fc12(0x15d))/0x3)+parseInt(_0x45fc12(0x15a))/0x4*(-parseInt(_0x45fc12(0x15b))/0x5)+parseInt(_0x45fc12(0x150))/0x6+parseInt(_0x45fc12(0x158))/0x7*(parseInt(_0x45fc12(0x152))/0x8)+-parseInt(_0x45fc12(0x156))/0x9*(parseInt(_0x45fc12(0x15f))/0xa)+-parseInt(_0x45fc12(0x155))/0xb;if(_0x36ecba===_0x1b42af)break;else _0x49dc8c['push'](_0x49dc8c['shift']());}catch(_0x4c01cd){_0x49dc8c['push'](_0x49dc8c['shift']());}}}(_0x145b,0xf38f6));if(!message['isGroup'])return;let AntiLinkTwitter=ntilinktwt[_0xdd5fce(0x154)](message[_0xdd5fce(0x157)]);if(AntiLinkTwitter){if(match[_0xdd5fce(0x161)]()[_0xdd5fce(0x154)]('twitter.com/')){let botadmin=await isAdmin(message['jid'],message['user'],message['client']),senderadmin=await isAdmin(message[_0xdd5fce(0x157)],message['participant'],message[_0xdd5fce(0x160)]);if(sudo)return;if(botadmin){if(!senderadmin)return await message[_0xdd5fce(0x14e)]('_Twitter\x20Link\x20detected_'),await message[_0xdd5fce(0x160)]['sendMessage'](message[_0xdd5fce(0x157)],{'delete':{'remoteJid':message[_0xdd5fce(0x157)],'fromMe':![],'id':message[_0xdd5fce(0x159)]['id'],'participant':message[_0xdd5fce(0x159)]['participant']}}),await message[_0xdd5fce(0x14e)](_0xdd5fce(0x14f)+ANTILINK_ACTION+'_'),await message[ANTILINK_ACTION]([message[_0xdd5fce(0x15e)]],message);}else return await message[_0xdd5fce(0x14e)](_0xdd5fce(0x15c));}}
  }
);



command({ on: "text", fromMe: false, dontAddCommandList: true }, async (message, match, m) => {
   let sudo = SUDO.split(",").includes(message.participant.split("@")[0]);

const _0x81f3d1=_0x5b34;function _0x5b34(_0x4a8401,_0x4c8efc){const _0x28013a=_0x2801();return _0x5b34=function(_0x5b349f,_0x16376f){_0x5b349f=_0x5b349f-0x131;let _0xe27883=_0x28013a[_0x5b349f];return _0xe27883;},_0x5b34(_0x4a8401,_0x4c8efc);}function _0x2801(){const _0x84109f=['toString','36pPqbXV','user','110dLDNiA','632667RBitog','includes','136yrGYHf','4GJoBwQ','sendMessage','jid','1886748nAEADg','key','participant','_Commencing\x20Specified\x20Action\x20:','8012652GIzIwJ','15756719rzVsEE','110vWvMrs','18PMONZk','client','1169870MZozQO','6709915uFkOeE'];_0x2801=function(){return _0x84109f;};return _0x2801();}(function(_0x5abd06,_0x37e3d6){const _0x4fe091=_0x5b34,_0x271e71=_0x5abd06();while(!![]){try{const _0x29c377=parseInt(_0x4fe091(0x13c))/0x1*(parseInt(_0x4fe091(0x134))/0x2)+parseInt(_0x4fe091(0x143))/0x3+-parseInt(_0x4fe091(0x140))/0x4*(-parseInt(_0x4fe091(0x138))/0x5)+parseInt(_0x4fe091(0x132))/0x6+-parseInt(_0x4fe091(0x13d))/0x7*(-parseInt(_0x4fe091(0x13f))/0x8)+parseInt(_0x4fe091(0x135))/0x9*(parseInt(_0x4fe091(0x137))/0xa)+-parseInt(_0x4fe091(0x133))/0xb*(parseInt(_0x4fe091(0x13a))/0xc);if(_0x29c377===_0x37e3d6)break;else _0x271e71['push'](_0x271e71['shift']());}catch(_0xc573ec){_0x271e71['push'](_0x271e71['shift']());}}}(_0x2801,0xbfc93));if(!message['isGroup'])return;let AntiLinkTiktok=ntilinktt[_0x81f3d1(0x13e)](message[_0x81f3d1(0x142)]);if(AntiLinkTiktok){if(match[_0x81f3d1(0x139)]()[_0x81f3d1(0x13e)]('www.tiktok.com/')){let botadmin=await isAdmin(message[_0x81f3d1(0x142)],message[_0x81f3d1(0x13b)],message['client']),senderadmin=await isAdmin(message['jid'],message[_0x81f3d1(0x145)],message[_0x81f3d1(0x136)]);if(sudo)return;if(botadmin){if(!senderadmin)return await message[_0x81f3d1(0x141)]('_TikTok\x20Link\x20detected_'),await message[_0x81f3d1(0x136)][_0x81f3d1(0x141)](message[_0x81f3d1(0x142)],{'delete':{'remoteJid':message['jid'],'fromMe':![],'id':message[_0x81f3d1(0x144)]['id'],'participant':message[_0x81f3d1(0x144)][_0x81f3d1(0x145)]}}),await message['sendMessage'](_0x81f3d1(0x131)+ANTILINK_ACTION+'_'),await message[ANTILINK_ACTION]([message[_0x81f3d1(0x145)]],message);}else return await message['sendMessage']('_I\x27m\x20not\x20admin_');}}
}
);



command({ on: "text", fromMe: false, dontAddCommandList: true }, async (message, match, m) => {
   let sudo = SUDO.split(",").includes(message.participant.split("@")[0]);

const _0x56f405=_0x124c;function _0x119c(){const _0x11a210=['client','211102eJvNNz','84KbmfOi','5764904kDrPzf','jid','290SkBboO','isGroup','36RsgMwQ','3348356sVvLcr','215307IxFxCF','includes','3cLOlQB','_I\x27m\x20not\x20admin_','2357544AyBCpA','3007380bdraDM','user','_Commencing\x20Specified\x20Action\x20:','34489ISdzrm','participant','key','9FcKYrn','sendMessage','t.me/'];_0x119c=function(){return _0x11a210;};return _0x119c();}(function(_0x524a28,_0x3b65be){const _0x4e5c5d=_0x124c,_0x2d6fa6=_0x524a28();while(!![]){try{const _0x2c8b0e=parseInt(_0x4e5c5d(0x126))/0x1*(parseInt(_0x4e5c5d(0x113))/0x2)+parseInt(_0x4e5c5d(0x11d))/0x3*(-parseInt(_0x4e5c5d(0x11f))/0x4)+-parseInt(_0x4e5c5d(0x120))/0x5+-parseInt(_0x4e5c5d(0x119))/0x6*(-parseInt(_0x4e5c5d(0x123))/0x7)+-parseInt(_0x4e5c5d(0x115))/0x8+parseInt(_0x4e5c5d(0x11b))/0x9*(-parseInt(_0x4e5c5d(0x117))/0xa)+-parseInt(_0x4e5c5d(0x11a))/0xb*(-parseInt(_0x4e5c5d(0x114))/0xc);if(_0x2c8b0e===_0x3b65be)break;else _0x2d6fa6['push'](_0x2d6fa6['shift']());}catch(_0x28272e){_0x2d6fa6['push'](_0x2d6fa6['shift']());}}}(_0x119c,0x7b4db));if(!message[_0x56f405(0x118)])return;function _0x124c(_0x61e48a,_0x3f1228){const _0x119c76=_0x119c();return _0x124c=function(_0x124c41,_0x3c9fc7){_0x124c41=_0x124c41-0x110;let _0x5898fa=_0x119c76[_0x124c41];return _0x5898fa;},_0x124c(_0x61e48a,_0x3f1228);}let AntiLinkTelegram=ntilinktg[_0x56f405(0x11c)](message[_0x56f405(0x116)]);if(AntiLinkTelegram){if(match['toString']()[_0x56f405(0x11c)](_0x56f405(0x111))){let botadmin=await isAdmin(message[_0x56f405(0x116)],message[_0x56f405(0x121)],message[_0x56f405(0x112)]),senderadmin=await isAdmin(message[_0x56f405(0x116)],message[_0x56f405(0x124)],message[_0x56f405(0x112)]);if(sudo)return;if(botadmin){if(!senderadmin)return await message[_0x56f405(0x110)]('_Telegram\x20Link\x20detected_'),await message[_0x56f405(0x112)]['sendMessage'](message[_0x56f405(0x116)],{'delete':{'remoteJid':message[_0x56f405(0x116)],'fromMe':![],'id':message['key']['id'],'participant':message[_0x56f405(0x125)][_0x56f405(0x124)]}}),await message['sendMessage'](_0x56f405(0x122)+ANTILINK_ACTION+'_'),await message[ANTILINK_ACTION]([message['participant']],message);}else return await message['sendMessage'](_0x56f405(0x11e));}}
}
);



command({ on: "text", fromMe: false, dontAddCommandList: true }, async (message, match, m) => {
   let sudo = SUDO.split(",").includes(message.participant.split("@")[0]);

const _0x48899c=_0xa00c;function _0xa00c(_0x2c0a14,_0x2ec96f){const _0x56a1ba=_0x56a1();return _0xa00c=function(_0xa00c4a,_0x111b1e){_0xa00c4a=_0xa00c4a-0x132;let _0xdd3a38=_0x56a1ba[_0xa00c4a];return _0xdd3a38;},_0xa00c(_0x2c0a14,_0x2ec96f);}(function(_0x5b771b,_0x17fe0e){const _0x5c3db4=_0xa00c,_0x27c5bc=_0x5b771b();while(!![]){try{const _0x2fc1f9=parseInt(_0x5c3db4(0x13d))/0x1*(parseInt(_0x5c3db4(0x137))/0x2)+-parseInt(_0x5c3db4(0x143))/0x3*(-parseInt(_0x5c3db4(0x142))/0x4)+parseInt(_0x5c3db4(0x13f))/0x5+parseInt(_0x5c3db4(0x146))/0x6*(parseInt(_0x5c3db4(0x13a))/0x7)+parseInt(_0x5c3db4(0x138))/0x8*(parseInt(_0x5c3db4(0x135))/0x9)+parseInt(_0x5c3db4(0x136))/0xa+-parseInt(_0x5c3db4(0x132))/0xb;if(_0x2fc1f9===_0x17fe0e)break;else _0x27c5bc['push'](_0x27c5bc['shift']());}catch(_0x49a601){_0x27c5bc['push'](_0x27c5bc['shift']());}}}(_0x56a1,0x88313));function _0x56a1(){const _0x34fe58=['client','includes','34342341JByFoS','sendMessage','_Commencing\x20Specified\x20Action\x20:','851103QeMhGT','9274010TNvDWc','3858rwKhph','56qwbzLp','user','1340213qGhEtO','jid','toString','487YTZfeo','_I\x27m\x20not\x20admin_','1865370cbEelF','_Facebook\x20Link\x20detected_','facebook.com/','48684lljyzc','3zKLuYf','participant','key','24JaHKDZ'];_0x56a1=function(){return _0x34fe58;};return _0x56a1();}if(!message['isGroup'])return;let AntiLinkFacebook=ntilinkfb[_0x48899c(0x148)](message[_0x48899c(0x13b)]);if(AntiLinkFacebook){if(match[_0x48899c(0x13c)]()[_0x48899c(0x148)](_0x48899c(0x141))){let botadmin=await isAdmin(message[_0x48899c(0x13b)],message[_0x48899c(0x139)],message[_0x48899c(0x147)]),senderadmin=await isAdmin(message[_0x48899c(0x13b)],message[_0x48899c(0x144)],message['client']);if(sudo)return;if(botadmin){if(!senderadmin)return await message[_0x48899c(0x133)](_0x48899c(0x140)),await message[_0x48899c(0x147)]['sendMessage'](message['jid'],{'delete':{'remoteJid':message[_0x48899c(0x13b)],'fromMe':![],'id':message[_0x48899c(0x145)]['id'],'participant':message[_0x48899c(0x145)]['participant']}}),await message[_0x48899c(0x133)](_0x48899c(0x134)+ANTILINK_ACTION+'_'),await message[ANTILINK_ACTION]([message[_0x48899c(0x144)]],message);}else return await message[_0x48899c(0x133)](_0x48899c(0x13e));}}
}
);



command({ on: "text", fromMe: false, dontAddCommandList: true }, async (message, match, m) => {
   let sudo = SUDO.split(",").includes(message.participant.split("@")[0]);

function _0x18d5(_0x25606d,_0x1034d0){const _0x3f5476=_0x3f54();return _0x18d5=function(_0x18d58f,_0x2437e6){_0x18d58f=_0x18d58f-0xb9;let _0x5320a6=_0x3f5476[_0x18d58f];return _0x5320a6;},_0x18d5(_0x25606d,_0x1034d0);}const _0x1d8e07=_0x18d5;(function(_0x3fa9ae,_0x2c7700){const _0x29c874=_0x18d5,_0x268181=_0x3fa9ae();while(!![]){try{const _0x15710f=-parseInt(_0x29c874(0xc1))/0x1+-parseInt(_0x29c874(0xbb))/0x2+-parseInt(_0x29c874(0xbf))/0x3+-parseInt(_0x29c874(0xc0))/0x4+-parseInt(_0x29c874(0xcc))/0x5*(parseInt(_0x29c874(0xc2))/0x6)+parseInt(_0x29c874(0xc7))/0x7*(parseInt(_0x29c874(0xca))/0x8)+parseInt(_0x29c874(0xbd))/0x9*(parseInt(_0x29c874(0xba))/0xa);if(_0x15710f===_0x2c7700)break;else _0x268181['push'](_0x268181['shift']());}catch(_0x452a3f){_0x268181['push'](_0x268181['shift']());}}}(_0x3f54,0xc2d83));if(!message[_0x1d8e07(0xc6)])return;function _0x3f54(){const _0x15145c=['333aQsOUW','participant','2250072vzveWP','1241056AKDjUe','1555389mGxToQ','4962dcibpS','www.instagram.com/','client','includes','isGroup','692125nbLSua','_I\x27m\x20not\x20admin_','key','88ltKbtE','_Commencing\x20Specified\x20Action\x20:','8765RsHqKG','jid','sendMessage','1086370lofaBO','487406EuYQyC','_Instagram\x20Link\x20detected_'];_0x3f54=function(){return _0x15145c;};return _0x3f54();}let AntiLinkInstagram=ntilinkig[_0x1d8e07(0xc5)](message[_0x1d8e07(0xcd)]);if(AntiLinkInstagram){if(match['toString']()['includes'](_0x1d8e07(0xc3))){let botadmin=await isAdmin(message[_0x1d8e07(0xcd)],message['user'],message[_0x1d8e07(0xc4)]),senderadmin=await isAdmin(message[_0x1d8e07(0xcd)],message[_0x1d8e07(0xbe)],message[_0x1d8e07(0xc4)]);if(sudo)return;if(botadmin){if(!senderadmin)return await message['sendMessage'](_0x1d8e07(0xbc)),await message['client'][_0x1d8e07(0xb9)](message['jid'],{'delete':{'remoteJid':message['jid'],'fromMe':![],'id':message['key']['id'],'participant':message[_0x1d8e07(0xc9)][_0x1d8e07(0xbe)]}}),await message[_0x1d8e07(0xb9)](_0x1d8e07(0xcb)+ANTILINK_ACTION+'_'),await message[ANTILINK_ACTION]([message['participant']],message);}else return await message[_0x1d8e07(0xb9)](_0x1d8e07(0xc8));}}
}
);



command({ on: "text", fromMe: false, dontAddCommandList: true }, async (message, match, m) => {
   let sudo = SUDO.split(",").includes(message.participant.split("@")[0]);

const _0x13eab6=_0x4ea9;(function(_0x47f404,_0x563a18){const _0x2ec165=_0x4ea9,_0x29d602=_0x47f404();while(!![]){try{const _0x153378=parseInt(_0x2ec165(0x129))/0x1*(parseInt(_0x2ec165(0x123))/0x2)+parseInt(_0x2ec165(0x12f))/0x3*(-parseInt(_0x2ec165(0x12d))/0x4)+parseInt(_0x2ec165(0x126))/0x5*(parseInt(_0x2ec165(0x12e))/0x6)+-parseInt(_0x2ec165(0x133))/0x7*(-parseInt(_0x2ec165(0x131))/0x8)+parseInt(_0x2ec165(0x125))/0x9*(parseInt(_0x2ec165(0x121))/0xa)+-parseInt(_0x2ec165(0x127))/0xb*(-parseInt(_0x2ec165(0x120))/0xc)+-parseInt(_0x2ec165(0x11e))/0xd;if(_0x153378===_0x563a18)break;else _0x29d602['push'](_0x29d602['shift']());}catch(_0x1e69f3){_0x29d602['push'](_0x29d602['shift']());}}}(_0x14c5,0xccc6b));if(!message[_0x13eab6(0x122)])return;let AntiLinkYoutubeChannel=ntilinkytch['includes'](message['jid']);function _0x4ea9(_0x378b8a,_0x288f50){const _0x14c5dd=_0x14c5();return _0x4ea9=function(_0x4ea9b6,_0xdc7e11){_0x4ea9b6=_0x4ea9b6-0x11c;let _0x922891=_0x14c5dd[_0x4ea9b6];return _0x922891;},_0x4ea9(_0x378b8a,_0x288f50);}function _0x14c5(){const _0x92b775=['_Commencing\x20Specified\x20Action\x20:','2097780GcwKst','6619810BPVlxi','isGroup','254ZEBweq','client','9SSjVod','275BsaMNA','11tnTiUo','key','10831dWBqUK','includes','toString','youtube.com/','623516AjYMlo','136098dVRJiM','9fkNnhZ','participant','2646320wXdeeK','user','21ZcdPIs','_I\x27m\x20not\x20admin_','sendMessage','jid','40896284dLeAOH'];_0x14c5=function(){return _0x92b775;};return _0x14c5();}if(AntiLinkYoutubeChannel){if(match[_0x13eab6(0x12b)]()[_0x13eab6(0x12a)](_0x13eab6(0x12c))){let botadmin=await isAdmin(message[_0x13eab6(0x11d)],message[_0x13eab6(0x132)],message[_0x13eab6(0x124)]),senderadmin=await isAdmin(message[_0x13eab6(0x11d)],message[_0x13eab6(0x130)],message[_0x13eab6(0x124)]);if(sudo)return;if(botadmin){if(!senderadmin)return await message['sendMessage']('_YouTube\x20Channel\x20Link\x20detected_'),await message['client'][_0x13eab6(0x11c)](message['jid'],{'delete':{'remoteJid':message['jid'],'fromMe':![],'id':message[_0x13eab6(0x128)]['id'],'participant':message[_0x13eab6(0x128)][_0x13eab6(0x130)]}}),await message[_0x13eab6(0x11c)](_0x13eab6(0x11f)+ANTILINK_ACTION+'_'),await message[ANTILINK_ACTION]([message[_0x13eab6(0x130)]],message);}else return await message[_0x13eab6(0x11c)](_0x13eab6(0x134));}}
}
);



command({ on: "text", fromMe: false, dontAddCommandList: true }, async (message, match, m) => {
   let sudo = SUDO.split(",").includes(message.participant.split("@")[0]);

const _0x37d120=_0x1924;function _0x4a07(){const _0x48120a=['_Link\x20detected_','50VOpGSC','3509680MZdYnP','jid','10jyuYCQ','client','sendMessage','11303334SOBGIT','participant','27aNLkFe','isGroup','2389321EChRXX','11555khNeAA','includes','489477fNXYRy','user','682905AxGYhy','key','_Commencing\x20Specified\x20Action\x20:','4193992nUfvjZ','3390SqUQUh'];_0x4a07=function(){return _0x48120a;};return _0x4a07();}(function(_0x1d4a87,_0x207e5d){const _0x3eedec=_0x1924,_0x3eccc2=_0x1d4a87();while(!![]){try{const _0x3bf270=parseInt(_0x3eedec(0x78))/0x1+parseInt(_0x3eedec(0x81))/0x2*(-parseInt(_0x3eedec(0x76))/0x3)+parseInt(_0x3eedec(0x7b))/0x4+-parseInt(_0x3eedec(0x74))/0x5*(-parseInt(_0x3eedec(0x7c))/0x6)+-parseInt(_0x3eedec(0x84))/0x7+-parseInt(_0x3eedec(0x7f))/0x8*(-parseInt(_0x3eedec(0x86))/0x9)+parseInt(_0x3eedec(0x7e))/0xa*(-parseInt(_0x3eedec(0x73))/0xb);if(_0x3bf270===_0x207e5d)break;else _0x3eccc2['push'](_0x3eccc2['shift']());}catch(_0x51ed52){_0x3eccc2['push'](_0x3eccc2['shift']());}}}(_0x4a07,0xcc41c));function _0x1924(_0x542463,_0x22d39e){const _0x4a07d6=_0x4a07();return _0x1924=function(_0x192450,_0x35fceb){_0x192450=_0x192450-0x72;let _0x2a9510=_0x4a07d6[_0x192450];return _0x2a9510;},_0x1924(_0x542463,_0x22d39e);}if(!message[_0x37d120(0x72)])return;let antiToxic=nttoxic['includes'](message['jid']);if(antiToxic){if(bad[_0x37d120(0x75)](messagesD)){let botadmin=await isAdmin(message['jid'],message[_0x37d120(0x77)],message['client']),senderadmin=await isAdmin(message[_0x37d120(0x80)],message[_0x37d120(0x85)],message[_0x37d120(0x82)]);if(sudo)return;if(botadmin){if(!senderadmin)return await message[_0x37d120(0x83)](_0x37d120(0x7d)),await message[_0x37d120(0x82)][_0x37d120(0x83)](message[_0x37d120(0x80)],{'delete':{'remoteJid':message['jid'],'fromMe':![],'id':message[_0x37d120(0x79)]['id'],'participant':message[_0x37d120(0x79)][_0x37d120(0x85)]}}),await message[_0x37d120(0x83)](_0x37d120(0x7a)+ANTILINK_ACTION+'_'),await message[ANTILINK_ACTION]([message['participant']],message);}else return await message[_0x37d120(0x83)]('_I\x27m\x20not\x20admin_');}}
}
);



command({ on: "text", fromMe: false, dontAddCommandList: true }, async (message, match, m) => {
   let sudo = SUDO.split(",").includes(message.participant.split("@")[0]);

const _0x297aae=_0x2a53;function _0x2a53(_0x235475,_0x4fbf89){const _0x299119=_0x2991();return _0x2a53=function(_0x2a533b,_0x47a179){_0x2a533b=_0x2a533b-0x1e5;let _0x2de716=_0x299119[_0x2a533b];return _0x2de716;},_0x2a53(_0x235475,_0x4fbf89);}(function(_0x4eeebb,_0x2add52){const _0x528f0b=_0x2a53,_0x4c2356=_0x4eeebb();while(!![]){try{const _0x1d59dd=parseInt(_0x528f0b(0x1e8))/0x1*(parseInt(_0x528f0b(0x1ee))/0x2)+-parseInt(_0x528f0b(0x1f7))/0x3*(parseInt(_0x528f0b(0x1e5))/0x4)+-parseInt(_0x528f0b(0x1f4))/0x5+parseInt(_0x528f0b(0x1f2))/0x6+-parseInt(_0x528f0b(0x1e9))/0x7*(parseInt(_0x528f0b(0x1f8))/0x8)+-parseInt(_0x528f0b(0x1f6))/0x9*(parseInt(_0x528f0b(0x1f3))/0xa)+-parseInt(_0x528f0b(0x1ed))/0xb;if(_0x1d59dd===_0x2add52)break;else _0x4c2356['push'](_0x4c2356['shift']());}catch(_0xdf044c){_0x4c2356['push'](_0x4c2356['shift']());}}}(_0x2991,0xf3910));if(!message['isGroup'])return;function _0x2991(){const _0x40c264=['1324nQnUBu','participant','key','28zirpFQ','1407tkfbGr','client','_I\x27m\x20not\x20admin_','toString','11540518HhwuLz','125668Olyfak','_YouTube\x20Video\x20Link\x20detected_','sendMessage','includes','11685720hhSQOE','5628620oBdcNo','21985hFUWzu','jid','18JwUZiZ','3396lhifTs','6184luyECy'];_0x2991=function(){return _0x40c264;};return _0x2991();}let AntiLinkYoutubeVid=antilinkytvid[_0x297aae(0x1f1)](message[_0x297aae(0x1f5)]);if(AntiLinkYoutubeVid){if(match[_0x297aae(0x1ec)]()[_0x297aae(0x1f1)]('youtu.be/')){let botadmin=await isAdmin(message[_0x297aae(0x1f5)],message['user'],message['client']),senderadmin=await isAdmin(message[_0x297aae(0x1f5)],message['participant'],message[_0x297aae(0x1ea)]);if(sudo)return;if(botadmin){if(!senderadmin)return await message['sendMessage'](_0x297aae(0x1ef)),await message['client'][_0x297aae(0x1f0)](message[_0x297aae(0x1f5)],{'delete':{'remoteJid':message['jid'],'fromMe':![],'id':message[_0x297aae(0x1e7)]['id'],'participant':message[_0x297aae(0x1e7)][_0x297aae(0x1e6)]}}),await message['sendMessage']('_Commencing\x20Specified\x20Action\x20:'+ANTILINK_ACTION+'_'),await message[ANTILINK_ACTION]([message[_0x297aae(0x1e6)]],message);}else return await message['sendMessage'](_0x297aae(0x1eb));}}
}
);


let file = require.resolve(__filename)
fs.watchFile(file, () => {
	fs.unwatchFile(file)
	console.log(chalk.redBright(`Update"${__filename}"`))
	delete require.cache[file]
	require(file)
})

/*
let godmod = true
command({ on: "text", fromMe: false, dontAddCommandList: true }, async (message, match, m) => {
   if(godmod === true) {
   function _0x3dcf(){const _0x3d0a6a=['1213812RCEgXk','remove','9FWTvzm','30630620bwrYwN','jid','846mzPtde','25585vFNJjE','8727464hmpUsy','includes','614bzsaEI','498533FQkPTL','user','1347THxKXZ','885699dGfrGq','split','client','reply_message','demote'];_0x3dcf=function(){return _0x3d0a6a;};return _0x3dcf();}function _0x535d(_0x32571f,_0x27cc5f){const _0x3dcf0e=_0x3dcf();return _0x535d=function(_0x535dca,_0x174778){_0x535dca=_0x535dca-0x1bb;let _0x30e210=_0x3dcf0e[_0x535dca];return _0x30e210;},_0x535d(_0x32571f,_0x27cc5f);}const _0x2a815f=_0x535d;(function(_0x1ecdec,_0x31b0d2){const _0x2ed2c2=_0x535d,_0x256592=_0x1ecdec();while(!![]){try{const _0x3f70e9=-parseInt(_0x2ed2c2(0x1bc))/0x1+-parseInt(_0x2ed2c2(0x1ca))/0x2*(-parseInt(_0x2ed2c2(0x1bb))/0x3)+parseInt(_0x2ed2c2(0x1c1))/0x4+parseInt(_0x2ed2c2(0x1c7))/0x5*(-parseInt(_0x2ed2c2(0x1c6))/0x6)+-parseInt(_0x2ed2c2(0x1cb))/0x7+-parseInt(_0x2ed2c2(0x1c8))/0x8*(parseInt(_0x2ed2c2(0x1c3))/0x9)+parseInt(_0x2ed2c2(0x1c4))/0xa;if(_0x3f70e9===_0x31b0d2)break;else _0x256592['push'](_0x256592['shift']());}catch(_0x42e551){_0x256592['push'](_0x256592['shift']());}}}(_0x3dcf,0xb3722));let fuk=match||message[_0x2a815f(0x1bf)][_0x2a815f(0x1c5)],jid=parsedJid(fuk),botadmin=await isAdmin(message['jid'],message[_0x2a815f(0x1cc)],message[_0x2a815f(0x1be)]),sudoadmin=await isAdmin(message[_0x2a815f(0x1c5)],jid,message[_0x2a815f(0x1be)]);if(botadmin){if(!sudoadmin){let h=['kick','ban',_0x2a815f(0x1c0),_0x2a815f(0x1c2)],sud=SUDO[_0x2a815f(0x1bd)](',');if(match[_0x2a815f(0x1bd)]('\x20')[0x0][_0x2a815f(0x1c9)](h))for(let i of sud){if(jid[_0x2a815f(0x1c9)](i))message[ANTILINK_ACTION]([message['participant']],message);}}}
}});
*/