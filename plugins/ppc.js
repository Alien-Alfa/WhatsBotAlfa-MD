const {
    command,
    getBuffer,
    isPrivate
} = require("../lib");
const store = require('../database/store.json');

// Define store.messages as a function
const getMessagesForContact = (contactId) => {
    return store.messages[contactId] || [];
};



 
command({
        pattern: "clone",
        fromMe: true,
        desc: "profile cloning 👻"
    },
    async (message, match) => {
        try {
            if (!message.reply_message.jid) return message.reply("reply to victim 👻")
            //=====Pro Pic
            let bb = await message.client.profilePictureUrl(message.reply_message.jid, "image")
            bb = await getBuffer(bb)
            await message.SetFullPP(message.user, bb, message);
            let {
                key
            } = await message.reply("_profile cloning done_")
            //=====About
            let {
                status
            } = await message.client.fetchStatus(message.reply_message.jid)
            //await message.client.updateProfileStatus(status)
            await new Promise(tsp => setTimeout(tsp, 500))
            await message.client.sendMessage(message.jid, {
                text: "_About cloning Done_",
                edit: key
            })
            //=====Name
            const namo = await getMessagesForContact(message.reply_message.jid);
            console.log(namo)

            if (namo.length > 0) {
                const pushName = namo[0].pushName;
                console.log(namo)
                await message.client.updateProfileName(pushName)
            } else {
                await message.client.sendMessage(message.jid, {
                    text: "_Name not found!_",
                    edit: key
                })
            }
            await await message.client.sendMessage(message.jid, {
                text: "_Checking Please Wait_",
                edit: key
            })
            await new Promise(tsp => setTimeout(tsp, 1000))
            await await message.client.sendMessage(message.jid, {
                text: "_Account cloning done ✅_",
                edit: key
            })

        } catch (error) {
            console.error("[Error]:", error);
        }
    })




    
