const {command, isPrivate} = require ("../lib")

command(
        {
           pattern: 'alive ?(.*)',
           fromMe: true,  
           desc: 'Aurora alive message',
           type: 'mics',
        },
        async (message,match) => {
         try{
     let user = `${message.pushName}` 	
        
await message.reply(`Hey ${user}\nAlive for ${await process.send("uptime")}`)
} catch (error) {
   console.error("[Error]:", error);
 }
}
)


//Tshephang+Cyber 🐤you change plugin disappeares
