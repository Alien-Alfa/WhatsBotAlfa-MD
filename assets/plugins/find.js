const { command, isPrivate, getBuffer, reply } = require("../../lib/");
const ytsr = require('ytsr');
const acrcloud = require("acrcloud");

command(
  {
    pattern: "find",
    fromMe: true,
    desc: "Find music from audio",
    type: "tools",
  },
  async (message, match, m) => {
    try {
      let { msg, status } = await reply(m, "audio&video", true);
      if (status === 0) return await message.reply(msg);
      
      const buff = await m.download();
      if (!buff) {
        return await message.reply("_Failed to download audio_");
      }

      await message.reply("_Identifying music..._");

      try {
        const acr = new acrcloud({
          host: "identify-eu-west-1.acrcloud.com",
          access_key: "df8c1cffbfa4295dd40188b63d363112",
          access_secret: "d5mygczEZkPlBDRpFjwySUexQM26jix0gCmih389"
        });

        const res = await acr.identify(buff);
        const { code, msg: statusMsg } = res.status;
        
        if (code !== 0) {
          return await message.reply(`_Music identification failed: ${statusMsg}_`);
        }

        if (!res.metadata?.music?.[0]) {
          return await message.reply("_No music found in this audio_");
        }

        const musicData = res.metadata.music[0];
        const { album, title, artists, release_date, genres } = musicData;
        
        // Search for YouTube video
        let youtubeData = null;
        try {
          youtubeData = await searchYoutube(album?.name || title);
        } catch (e) {
          console.error("YouTube search error:", e);
        }

        let text = `🎵 *Music Found*\n\n`;
        text += `📀 *Title:* ${title || "Unknown"}\n`;
        text += `💿 *Album:* ${album?.name || "Unknown"}\n`;
        text += `👨‍🎤 *Artist:* ${artists?.[0]?.name || "Unknown"}\n`;
        text += `📅 *Release Date:* ${release_date || "Unknown"}\n`;
        text += `🎭 *Genre:* ${genres?.[0]?.name || "Unknown"}\n`;

        if (youtubeData) {
          text += `\n🔗 *YouTube Info:*\n`;
          text += `📺 *Title:* ${youtubeData.title}\n`;
          text += `👀 *Views:* ${youtubeData.views}\n`;
          text += `⏱️ *Duration:* ${youtubeData.duration}\n`;
          text += `📤 *Uploaded:* ${youtubeData.uploadedAt}\n`;
          text += `🎬 *Channel:* ${youtubeData.author.name}\n`;
        }

        const thumbnail = youtubeData?.bestThumbnail?.url || null;
        
        if (thumbnail) {
          const image = await getBuffer(thumbnail);
          return await message.client.sendMessage(message.jid, {
            image: image,
            caption: text
          }, { quoted: message });
        } else {
          return await message.reply(text);
        }

      } catch (identifyError) {
        console.error("Music identification error:", identifyError);
        return await message.reply("_Failed to identify music. Please try again._");
      }

    } catch (error) {
      console.error("[Find Music Error]:", error);
      await message.reply("_An error occurred while processing the audio_");
    }
  }
);

async function searchYoutube(query) {
  try {
    if (!query) return null;
    
    const filters = await ytsr.getFilters(query);
    const filter = filters.get('Type').get('Video');
    const options = {
      limit: 1, // Retrieve only the first result
    };
    
    const searchResult = await ytsr(filter.url, options);
    return searchResult.items[0] || null;
  } catch (error) {
    console.error("YouTube search error:", error);
    return null;
  }
}

// Made with ❤ by AlienAlfa
