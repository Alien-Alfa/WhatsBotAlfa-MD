const {command, fromMe, sleep} = require("../lib")


function formatTime(seconds) {
    if (isNaN(seconds) || seconds < 0) {
      return "Invalid input";
    }
  
    const months = Math.floor(seconds / (30 * 24 * 60 * 60));
    seconds -= months * 30 * 24 * 60 * 60;
  
    const days = Math.floor(seconds / (24 * 60 * 60));
    seconds -= days * 24 * 60 * 60;
  
    const hours = Math.floor(seconds / (60 * 60));
    seconds -= hours * 60 * 60;
  
    const minutes = Math.floor(seconds / 60);
    seconds -= minutes * 60;
  
    const timeArray = [];
  
    if (months > 0) {
      timeArray.push(months + (months === 1 ? " month" : " months"));
    }
    if (days > 0) {
      timeArray.push(days + (days === 1 ? " day" : " days"));
    }
    if (hours > 0) {
      timeArray.push(hours + (hours === 1 ? " hour" : " hours"));
    }
    if (minutes > 0) {
      timeArray.push(minutes + (minutes === 1 ? " minute" : " minutes"));
    }
    if (seconds > 0) {
      timeArray.push(seconds + (seconds === 1 ? " second" : " seconds"));
    }
  
    return timeArray.join(", ");
  }
  
  
    


command({
        pattern: "ping",
        fromMe: true,  
        desc: "To check ping",
        type: "user",
    },
    async (message, match) => {
      if(!fromMe(message.user)) return;
      try{
   const start = new Date().getTime();
   await message.client.sendMessage(message.jid, { text: "```Checking Server!```", edit: message.key} );
        const end = new Date().getTime();
        setTimeout(async()=>{
            return await message.client.sendMessage(message.jid, { text: "Ping: "+(end - start) + " ms", edit: message.key} );
          }, 1000)    
        } catch (error) {
          console.error("[Error]:", error);
        }
    }
);
command({
  pattern: "uptime",
  fromMe: true,  
  desc: "To check uptime",
  type: "user",
},
async (message, match) => {
  try{
   await message.client.sendMessage(message.jid, { text: "```Fetching Uptime...```", edit: message.key} );
  setTimeout(async()=>{
      return await message.client.sendMessage(message.jid, { text: "Uptime: "+ await formatTime(process.uptime().toFixed(0)), edit: message.key} );
    }, 1000)    
  } catch (error) {
    console.error("[Error]:", error);
  }
}
);
