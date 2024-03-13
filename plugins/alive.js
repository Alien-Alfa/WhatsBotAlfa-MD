const {command, isPrivate} = require ("../lib")

command(
        {
           pattern: 'alive ?(.*)',
           fromMe: true,  
           desc: 'Aurora alive message',
           type: 'mics',
        },
        async (message,match) => {
     let user = `${message.pushName}` 	
        
await message.reply(`Hey ${user}\nAlive for ${await process.send("uptime")}`)
}
)


//Tshephang+Cyber 🐤you change plugin disappeares
