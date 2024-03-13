/* const {command , getBuffer, isPrivate} = require("../lib");

command({
pattern: "clone",
fromMe: true,  
desc: "profile cloning 👻"
},
async(message, match)=>{
if(! message.reply_message.jid) return message.reply("reply to victim 👻")

let bb = await client.profilePictureUrl(message.reply_message.jid, "image")

bb = await getBuffer(bb)

 await message.client.updateProfilePicture(message.user,bb)
 
let {key} = await message.reply("profile cloning done")



let {status} = await client.fetchStatus(message.reply_message.jid)



await client.updateProfileStatus(status)

await new Promise(tsp => setTimeout (tsp,1000))

await client.sendMessage(message.jid ,{text: "full cloning done ✅" , edit: key})


})
*/
