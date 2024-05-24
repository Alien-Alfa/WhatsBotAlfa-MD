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

  return timeArray.join(", ");
}




command({
      pattern: "ping",
      fromMe: isPrivate,
      desc: "To check ping",
      type: "user",
  },
  async (message, match) => {
      let me = await fromMe(message.participant)
      if (me) {
          try {
              const start = new Date().getTime();
              await message.client.sendMessage(message.jid, {
                  text: "```Checking Server!```",
                  edit: message.key
              });
              const end = new Date().getTime();
              setTimeout(async () => {
                  return await message.client.sendMessage(message.jid, {
                      text: "Ping: " + (end - start) + " ms",
                      edit: message.key
                  });
              }, 1000)
          } catch (error) {
              console.error("[Error]:", error);
          }
      } else if (!me) {
          try {

              const start = new Date().getTime();
              let {
                  key
              } = await message.reply("```Checking...```");
              const end = new Date().getTime();
              setTimeout(async () => {
                  return await message.client.sendMessage(message.jid, {
                      text: "```Latancy: " + (end - start) + " ms```",
                      edit: key
                  });
              }, 1000)
          } catch (error) {
              console.error("[Error]:", error);
          }
      }
  }
);
command({
      pattern: "uptime",
      fromMe: isPrivate,
      desc: "To check uptime",
      type: "user",
  },
  async (message, match) => {
    let me = await fromMe(message.participant)

            if (me) {
          try {
              await message.client.sendMessage(message.jid, {
                  text: "```Fetching Uptime...```",
                  edit: message.key
              });
              setTimeout(async () => {
                  return await message.client.sendMessage(message.jid, {
                      text: "Uptime: " + await formatTime(process.uptime().toFixed(0)),
                      edit: message.key
                  });
              }, 1000)
          } catch (error) {
              console.error("[Error]:", error);
          }

      } else if (!me) {
          try {
              let { key } = await message.reply("```Fetching Uptime...```");
              setTimeout(async () => {
                  return await message.client.sendMessage(message.jid, {
                      text: "Uptime: " + await formatTime(process.uptime().toFixed(0)),
                      edit: key
                  });
              }, 1000)
          } catch (error) {
              console.error("[Error]:", error);
          }
      }


  }
);



command({
    pattern: "iswa",
    fromMe: isPrivate,
    desc: "To check uptime",
    type: "user",
}, async (message, match) => {
    if (!match) return await message.reply("*Need number and x parameter!*\n_Example: iswa 687822xxx_\n_You can use up to 4 x_");
    const xCount = (match.match(/x/g) || []).length;
    if (xCount < 0) return await message.reply("*Need number and x parameter!*\n_Example: iswa 687822xxx_\n_You can use up to 4 x_");
    if (xCount > 4) return await message.reply("*_Maximum 4 'x' Spported_!*\n_Example: iswa 687822xxx_\n_You can use up to 4 x_");
    const maxNum = Math.pow(10, xCount) - 1;
    const numbersToCheck = Array.from({ length: maxNum + 1 }, (_, i) => match.replace(/x+/g, () => i.toString().padStart(xCount, '0')));
        const {key} = await message.reply("_Finding numbers..._");
        const numbersToCheckString = numbersToCheck.join(',');
    const result = await message.client.onWhatsApp(numbersToCheckString);
    if (result.length > 0) {
        notonwaText = result.map((text, index) => "*" + (index + 1) + " " + text.split("@")[0]);
      }
      return await message.client.sendMessage(message.jid, {
        text: (onwaText.length > 0 ? `*Numbers Registered on WhatsApp:* ${onwaText.length}\n\n${onwaText.join('').trim()}\n\n` : '') +
        (heyThereText.length > 0 ? `*Numbers with 'Hey there! I am using WhatsApp.' about:* ${heyThereText.length}\n\n${heyThereText.join('\n').trim()}\n\n` : '') +
        (noabout.length > 0 ? `*User's with Private about:* ${noabout.length}\n\n${noabout.join('\n').trim()}\n\n` : '') +
        (notonwaText.length > 0 ? `*Numbers Not Registered on WhatsApp:* ${result.notExisting.length}\n\n${notonwaText.join('\n').trim()}` : ''),
        edit: key
    });
});