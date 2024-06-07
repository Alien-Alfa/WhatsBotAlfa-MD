const {
    isPrivate,
    command,
    getBuffer,
    getUrl,
    igdl,
    isIgUrl
} = require("../../lib/");


const dl = require("@xaviabot/fb-downloader");
const fetch = require("node-fetch");
command({
        pattern: "fb",
        on: "text",
        fromMe: isPrivate,
        desc: "fb downloader"
    },

    async (message, match) => {
        try {
            match = match || message.reply_message.text;
            if (!match.includes("facebook.com")) return;
            await message.reply("_Downloading..._");
            // Regular expression to match the URL
            const regex = /(https?:\/\/[^\s]+)/;
            const link = match.match(regex);
            let {
                sd,
                hd,
                thumbnail,
                title
            } = await dl(link[0]);
            let img = await getBuffer("https://avatars.githubusercontent.com/u/64305844?v=4");
            if (match.split(";")[1] == "hd") {
                await message.client.sendMessage(message.jid, {
                    video: {
                        url: hd
                    },
                    caption: "[Quality: HD]\n\n" + title,
                    thumbnail: img
                }, {
                    quoted: message
                });
            }


            let rs = await (await fetch(sd)).buffer();

            await message.client.sendMessage(message.jid, {
                video: rs,
                caption: "[Quality: SD]\n\n" + title,
                thumbnail: img
            }, {
                quoted: message
            });
        } catch (e) {
            await message.reply(`*[Download Failed]* \n*[Error]: ${e}*`)
        }
    });




const downloadInstaMedia = async (message, match) => {
    match = match || message.reply_message.text;
    if (!match) return;

    const url = getUrl(match.trim())[0];
    if (!url) {
        return await message.client.sendMessage(message.jid, "Invalid Instagram link");
    }

    if (!isIgUrl(url)) {
        return await message.client.sendMessage(message.jid, "Invalid Instagram link");
    }

    try {
        const data = await igdl(url);
        if (data.length === 0) {
            return await message.client.sendMessage(message.jid, "No media found on the link");
        }

        for (const mediaUrl of data) {
            await message.sendFile(mediaUrl);
        }
    } catch (error) {
        await message.client.sendMessage(message.jid, "Error: " + error.message || error);
    }
};

command({
        pattern: "insta",
        fromMe: isPrivate,
        desc: "To download Instagram media",
        type: "user",
    },
    async (message, match) => {
        await downloadInstaMedia(message, match);
    }
);

command({
        on: "text",
        fromMe: isPrivate,
        desc: "Auto download Instagram media from any message",
        type: "auto",
    },
    async (message) => {
        const text = message.text || message.reply_message.text;
        if (text && isIgUrl(text)) {
            await downloadInstaMedia(message, text);
        }
    }
);