const { command, isPrivate, getBuffer } = require("../../lib/");

async function fetcher(apiUrl, message, m) {
    try {
        console.log(`Fetching IMDB data: ${apiUrl}`);
        const response = await fetch(apiUrl);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.Response === "False") {
            return await message.reply(`_${data.Error || "Movie not found"}_`);
        }

        const ratings = data.Ratings?.map(rating => `${rating.Source}: ${rating.Value}`).join('\n') || "No ratings available";
        
        let mess = `🎬 *${data.Title}* (${data.Year})

📅 *Released:* ${data.Released || "N/A"}
⏱️ *Runtime:* ${data.Runtime || "N/A"}
🎭 *Genre:* ${data.Genre || "N/A"}
⭐ *Rated:* ${data.Rated || "N/A"}

👨‍💼 *Director:* ${data.Director || "N/A"}
🎭 *Actors:* ${data.Actors || "N/A"}

📖 *Plot:* ${data.Plot || "N/A"}

🌍 *Language:* ${data.Language || "N/A"}
🏳️ *Country:* ${data.Country || "N/A"}
🏆 *Awards:* ${data.Awards || "N/A"}
💰 *Box Office:* ${data.BoxOffice || "N/A"}

⭐ *Ratings:*
${ratings}`;

        const contextInfo = {
            externalAdReply: {
                title: `${data.Title}`,
                body: `IMDB Movie Info`,
                previewType: "PHOTO",
                thumbnailUrl: data.Poster && data.Poster !== "N/A" ? data.Poster : "",
                thumbnail: data.Poster && data.Poster !== "N/A" ? await getBuffer(data.Poster).catch(() => null) : null,
                sourceUrl: `https://github.com/alien-alfa`
            }
        };

        return await message.client.sendMessage(message.jid, {
            text: mess,
            contextInfo: contextInfo
        });

    } catch (error) {
        console.error('[IMDB Error]:', error);
        await message.reply("_Error fetching movie information. Please try again._");
    }
}

command(
    {
        pattern: "imdb",
        fromMe: isPrivate,
        desc: "Get movie information from IMDB",
        type: "tool",
    },
    async (message, match, m) => {
        try {
            if (!match) {
                return await message.reply("_Please provide a movie name_\n\nExample: imdb Avengers");
            }

            const movieName = encodeURIComponent(match.trim());
            const apiUrl = `https://www.omdbapi.com/?apikey=3c8ee796&t=${movieName}`;
            
            await message.reply("_Searching movie information..._");
            return await fetcher(apiUrl, message, m);
        } catch (error) {
            console.error('[IMDB Command Error]:', error);
            await message.reply("_Error processing your request_");
        }
    }
);

// Made with ❤ by AlienAlfa
