/*const {command, isPrivate, sleep} = require("../lib")

command({
        pattern: "pdm",
        fromMe: true,  
        desc: "To check ping",
        type: "user",
    },
    async (message, match) => {
        if(match === "on"){
            let { key } = await message.reply("```Activating PDM```");


            setTimeout(async()=>{
                return await message.client.sendMessage(message.jid, { text: "PDM Activated", edit: key} );
              }, 1000)            }
        if(match === "off"){
            let { key } = await message.reply("```Deactivating PDM```");


            setTimeout(async()=>{
                return await message.client.sendMessage(message.jid, { text: "PDM Deactivated", edit: key} );
              }, 1000)    
        }
    }
);*/

