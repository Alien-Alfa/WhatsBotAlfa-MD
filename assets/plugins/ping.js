const {
  command,
  fromMe,
  sleep,
  isPrivate
} = require("../../lib")

function formatTime(seconds) {
  if (isNaN(seconds) || seconds < 0) {
      return "Invalid input";
  }

  const units = [
    { name: "month", value: 30 * 24 * 60 * 60 },
    { name: "day", value: 24 * 60 * 60 },
    { name: "hour", value: 60 * 60 },
    { name: "minute", value: 60 },
    { name: "second", value: 1 }
  ];

  const timeArray = [];
  
  for (const unit of units) {
    const count = Math.floor(seconds / unit.value);
    if (count > 0) {
      timeArray.push(`${count} ${unit.name}${count !== 1 ? "s" : ""}`);
      seconds -= count * unit.value;
    }
  }

  return timeArray.length > 0 ? timeArray.join(", ") : "0 seconds";
}




command({
    pattern: "ping",
    fromMe: isPrivate,
    desc: "Check bot response time",
    type: "utility",
},
async (message, match) => {
    try {
        const start = new Date().getTime();
        const { key } = await message.reply("```Pinging...```");
        const end = new Date().getTime();
        
        const latency = end - start;
        const responseText = `🏓 *Pong!*\n\n⚡ *Latency:* ${latency}ms\n⏱️ *Response Time:* ${latency < 100 ? 'Excellent' : latency < 300 ? 'Good' : 'Fair'}`;
        
        setTimeout(async () => {
            await message.client.sendMessage(message.jid, {
                text: responseText,
                edit: key
            });
        }, 500);
    } catch (error) {
        console.error("[Ping Error]:", error);
        await message.reply("_Error checking ping._");
    }
});
command({
    pattern: "uptime",
    fromMe: isPrivate,
    desc: "Check bot uptime",
    type: "utility",
},
async (message, match) => {
    try {
        const { key } = await message.reply("```Fetching uptime...```");
        const uptime = process.uptime();
        const formattedUptime = formatTime(Math.floor(uptime));
        
        const uptimeText = `⏰ *Bot Uptime*\n\n🚀 *Running for:* ${formattedUptime}\n📊 *Process ID:* ${process.pid}\n💾 *Memory Usage:* ${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`;
        
        setTimeout(async () => {
            await message.client.sendMessage(message.jid, {
                text: uptimeText,
                edit: key
            });
        }, 500);
    } catch (error) {
        console.error("[Uptime Error]:", error);
        await message.reply("_Error fetching uptime._");
    }
});

// Thanks to ❤ Ragnork ❤ for this code


command({
    pattern: 'onwa ?(.*)',
    fromMe: true,
    desc: 'Lists numbers registered on wa, not registered etc.',
    use: 'whatsapp',
    usage: 'onwa +48888888xxx'
}, (async (message, match) => {
    if (!match[1]) return await message.sendReply("_Need number!_");
    let {x} = await message.reply("_Processing..._");
    await processOnwa(message, match)
    return await message.client.sendMessage(message.jid, {
        text: '_Task complete!_',
        edit: x
    });
}));




async function processOnwa(client, numberPattern) {
    try {
      const placeholder = String.fromCharCode(0x200e).repeat(4001);
  
      const generatePossibleNumbers = (pattern) => {
        let basePattern = pattern.replace(/\+/g, '');
        let length = basePattern.length;
        let possibleNumbers = [];
        let xCount = basePattern.split('').filter(char => char === 'x').length;
  
        if (xCount === 0) {
          return [basePattern];
        }
  
        let limit;
        if (xCount === 1) limit = 10;
        else if (xCount === 2) limit = 100;
        else if (xCount === 3) limit = 1000;
        else throw new Error('Too many x characters');
  
        for (let i = 0; i < limit; i++) {
          let number = basePattern.replace(/x/g, (match, offset) => {
            let replacement = String(i).padStart(xCount, '0');
            return replacement[offset % replacement.length];
          });
          possibleNumbers.push(number);
        }
  
        return possibleNumbers;
      };
      
      

  
      const fetchWhatsAppStatus = async (client, numbers) => {
        const possibleNumbers = generatePossibleNumbers(numbers);
        if (!possibleNumbers.length) {
          return "_No possible numbers!_";
        }
        const response = {
          datewise: {},
          notonwa: [],
          onwa: []
        };
      
        // Fetch WhatsApp contacts
        const waContacts = (await client.client.onWhatsApp(...possibleNumbers)).map(contact => contact.jid);
      
        // Filter numbers that are not on WhatsApp
        const notOnWa = possibleNumbers
          .filter(number => !waContacts.includes(number + "@s.whatsapp.net"))
          .map(number => '+' + number);
      
        // Fetch status for WhatsApp contacts
        for (const contact of await waContacts) {
          let status = '';
          let setAt = '';
          try {
            const statusData = await client.client.fetchStatus(await contact);
            console.log(contact)
            status = statusData.status;
            setAt = statusData.setAt;
          } catch (error) {
            console.error(`Failed to fetch status for ${await contact}: ${error.message}`);
          }
      
          if (status) {
            let date;
            try {
              date = new Date(setAt).toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric"
              });
            } catch (error) {
              console.error(`Failed to format date for ${await contact}: ${error.message}`);
              date = "null";
            }
      
            const dateKey = date.split(',')[2]?.trim() || "No date";
            if (!response.datewise[dateKey]) {
              response.datewise[dateKey] = [];
            }
      
            response.datewise[dateKey].push({
              status: status,
              date: date,
              number: '+' + contact.split('@')[0]
            });
          }
        }
      
        response.notonwa = notOnWa;
        response.onwa = waContacts.map(contact => '+' + contact.split('@')[0]);
      
        return response;
      };
      
  
      const result = await fetchWhatsAppStatus(client, numberPattern);

      let notRegisteredMessage = "_*❌=== Not registered on WA ===❌:*_\n" + placeholder + "\n" + await result.notonwa.join("\n");
      let datewiseMessage = '';
      for (let date in result.datewise) {
        datewiseMessage += `*⭕=== ${date} ===⭕*\n` + await result.datewise[date].map(info => `_Number: ${info.number}_\n_Bio: ${info.status}_\n_Date: ${info.date}_`).join("\n\n") + "\n\n";
      }
      let datewiseResultMessage = "*_=== Date wise result ===_*\n" + placeholder + "\n" + datewiseMessage;
      let registeredMessage = "_*=== Total registered numbers ===*_\n" + placeholder + "\n" + await result.onwa.join("\n");
  
      await client.sendReply(await datewiseResultMessage);
      await client.sendReply(await notRegisteredMessage);
      await client.sendReply(await registeredMessage);
  
    } catch (error) {
      await client.sendReply(error.message);
    }
  }
  
// Made with ❤ by AlienAlfa
