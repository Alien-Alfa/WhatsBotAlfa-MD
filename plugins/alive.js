const {command, isPrivate} = require ("../lib")

command(
        {
           pattern: 'alive ?(.*)',
           fromMe: isPrivate,  
           desc: 'Aurora alive message',
           type: 'mics',
        },
        async (message,match) => {
     let user = `${message.pushName}` 	
        
await message.reply(`Hello ${user} all systems are functional`)
}
)


//Tshephang+Cyber 🐤you change plugin disappeares
