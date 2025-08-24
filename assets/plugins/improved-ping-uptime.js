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

  if (timeArray.length === 0) {
    return "Just started";
  }

  return timeArray.join(", ");
}

function getPingEmoji(ping) {
  if (ping < 100) return "🟢";
  if (ping < 300) return "🟡";
  if (ping < 500) return "🟠";
  return "🔴";
}

function getUptimeEmoji(uptime) {
  const hours = uptime / 3600;
  if (hours < 1) return "🆕";
  if (hours < 24) return "🟢";
  if (hours < 168) return "🟡"; // 1 week
  return "💎"; // Long running
}

// Improved Ping Command
command({
  pattern: "ping",
  fromMe: isPrivate,
  desc: "Check bot latency and response time",
  type: "user",
}, async (message, match) => {
  const me = await fromMe(message.participant);
  
  try {
    const start = Date.now();
    
    // Initial checking message
    const checkingText = "```Checking server response...```";
    let key;
    
    if (me) {
      await message.client.sendMessage(message.jid, {
        text: checkingText,
        edit: message.key
      });
      key = message.key;
    } else {
      const response = await message.reply(checkingText);
      key = response.key;
    }
    
    // Calculate ping
    const end = Date.now();
    const ping = end - start;
    const emoji = getPingEmoji(ping);
    

    // Detailed response
    const responseText = `${emoji} *Latency:* ${ping}ms`.trim();


    // Detailed response
    const lresponseText = `
┌─「 🏓 PING STATUS 」
│
├ ${emoji} *Latency:* ${ping}ms
│
├ ${emoji} *Latency:* ${ping}ms
├ 📡 *Network:* ${ping < 200 ? 'Excellent' : ping < 400 ? 'Good' : ping < 600 ? 'Fair' : 'Poor'}
├ ⚡ *Status:* ${ping < 300 ? 'Fast' : ping < 600 ? 'Normal' : 'Slow'}
├ 🕐 *Timestamp:* ${new Date().toLocaleTimeString()}
│
└─「 Aurora-MD Active 」`.trim();

    // Send final response after a brief delay
    setTimeout(async () => {
      await message.client.sendMessage(message.jid, {
        text: responseText,
        edit: key
      });
    }, 1000);
    
  } catch (error) {
    logger.error("[Ping Error]:", error);
    const errorText = "❌ Failed to check ping. Please try again.";
    
    if (me) {
      await message.client.sendMessage(message.jid, {
        text: errorText,
        edit: message.key
      });
    } else {
      await message.reply(errorText);
    }
  }
});

// Improved Uptime Command
command({
  pattern: "runtime",
  fromMe: isPrivate,
  desc: "Check bot uptime and system information",
  type: "user",
}, async (message, match) => {
  const me = await fromMe(message.participant);
  
  try {
    // Initial fetching message
    const fetchingText = "```📊 Fetching system uptime...```";
    let key;
    
    if (me) {
      await message.client.sendMessage(message.jid, {
        text: fetchingText,
        edit: message.key
      });
      key = message.key;
    } else {
      const response = await message.reply(fetchingText);
      key = response.key;
    }
    
    // Get uptime data
    const uptimeSeconds = Math.floor(process.uptime());
    const formattedUptime = formatTime(uptimeSeconds);
    const emoji = getUptimeEmoji(uptimeSeconds);
    const startTime = new Date(Date.now() - (uptimeSeconds * 1000));
    
    // Memory usage
    const memUsage = process.memoryUsage();
    const memUsedMB = Math.round(memUsage.heapUsed / 1024 / 1024);
    const memTotalMB = Math.round(memUsage.heapTotal / 1024 / 1024);
    


    // Detailed response
    const responseText = `${emoji} *Uptime:* ${formattedUptime}`.trim();

    // Detailed response
    const lresponseText = `
┌─「 ⏰ UPTIME STATUS 」
│
├ ${emoji} *Uptime:* ${formattedUptime}
├ 🚀 *Started:* ${startTime.toLocaleString()}
├ 💾 *Memory:* ${memUsedMB}MB / ${memTotalMB}MB
├ 📈 *Performance:* ${memUsedMB < 100 ? 'Optimal' : memUsedMB < 200 ? 'Good' : 'High Usage'}
├ 🔄 *Status:* ${uptimeSeconds > 86400 ? 'Stable' : uptimeSeconds > 3600 ? 'Running' : 'Starting'}
├ 🕐 *Current Time:* ${new Date().toLocaleString()}
│
└─「 Aurora-MD Online 」`.trim();

    // Send final response after a brief delay
    setTimeout(async () => {
      await message.client.sendMessage(message.jid, {
        text: responseText,
        edit: key
      });
    }, 1000);
    
  } catch (error) {
    logger.error("[Uptime Error]:", error);
    const errorText = "❌ Failed to fetch uptime. Please try again.";
    
    if (me) {
      await message.client.sendMessage(message.jid, {
        text: errorText,
        edit: message.key
      });
    } else {
      await message.reply(errorText);
    }
  }
});

// Bonus: Combined Status Command
command({
  pattern: "status",
  fromMe: isPrivate,
  desc: "Get comprehensive bot status information",
  type: "user",
}, async (message, match) => {
  const me = await fromMe(message.participant);
  
  try {
    const start = Date.now();
    
    // Initial loading message
    const loadingText = "```🔄 Loading comprehensive status...```";
    let key;
    
    if (me) {
      await message.client.sendMessage(message.jid, {
        text: loadingText,
        edit: message.key
      });
      key = message.key;
    } else {
      const response = await message.reply(loadingText);
      key = response.key;
    }
    
    // Gather all data
    const end = Date.now();
    const ping = end - start;
    const uptimeSeconds = Math.floor(process.uptime());
    const formattedUptime = formatTime(uptimeSeconds);
    const memUsage = process.memoryUsage();
    const memUsedMB = Math.round(memUsage.heapUsed / 1024 / 1024);
    
    const pingEmoji = getPingEmoji(ping);
    const uptimeEmoji = getUptimeEmoji(uptimeSeconds);
    
    // Comprehensive status
    const statusText = `
┌─「 🤖 BOT STATUS 」
│
├ 🏓 *Ping:* ${pingEmoji} ${ping}ms
├ ⏰ *Uptime:* ${uptimeEmoji} ${formattedUptime}
├ 💾 *Memory:* ${memUsedMB}MB
├ 📡 *Network:* ${ping < 200 ? 'Excellent' : 'Good'}
├ 🔋 *Performance:* ${memUsedMB < 100 ? 'Optimal' : 'Good'}
├ 🌐 *Database:* ${require("../../config").USE_MONGODB ? 'MongoDB' : 'SQLite'}
const logger = require("../../lib/logger");
├ 🕐 *Time:* ${new Date().toLocaleString()}
│
└─「 Aurora-MD System Info 」`.trim();

    // Send final response
    setTimeout(async () => {
      await message.client.sendMessage(message.jid, {
        text: statusText,
        edit: key
      });
    }, 1500);
    
  } catch (error) {
    logger.error("[Status Error]:", error);
    const errorText = "❌ Failed to fetch status. Please try again.";
    
    if (me) {
      await message.client.sendMessage(message.jid, {
        text: errorText,
        edit: message.key
      });
    } else {
      await message.reply(errorText);
    }
  }
});
