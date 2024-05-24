const {
  command,
  isPrivate,
  qrcode,
  Bitly,
  isUrl,
  readQR,
  getMemoryUsage,
  MimeTypes,
  getJson,
} = require("../../lib/");
const fetch = require('node-fetch')

const { downloadMediaMessage } = require("@whiskeysockets/baileys");
command(
  {
    pattern: "vv",
    fromMe: true,
    desc: "Forwards The View once messsage",
    type: "tool",
  },
  async (message, match, m) => {
    let buff = await m.quoted.download();
    return await message.sendFile(buff);
  }
);

command(
  {
    pattern: "fetch ?(.*)",
    fromMe: isPrivate,  
    desc: "Downloads from a direct link",
    type: "downloader",
  },
  async (message, match) => {
    try{
    match = match || message.reply_message.text;
    if (!match)
      return message.reply(
        "_Send a direct media link_\n_*link;caption(optional)*_"
      );
    try {
      let url = match.split(";")[0];
      let options = {};
      options.caption = match.split(";")[1];

      if (isUrl(url)) {
        message.sendFromUrl(url, options);
      } else {
        message.reply("_Not a URL_");
      }
    } catch (e) {
      console.log(e);
      message.reply("_No content found_");
    }
    return await message.reply(participants);
    } catch (error) {
      console.error("[Error]:", error);
    }
    
  }
);


// STATUS SAVER ( MAKE fromMe: false TO USE AS PUBLIC )
command(
  { 
    on: "text",
    fromMe: false,
    desc: "Save or Give Status Updates",
    dontAddCommandList: true,
    type: "Tool"
  },
  async (message, match, m) => {
    try{
      if (message.isGroup) return;
      const triggerKeywords = ["save", "send", "sent", "snt", "give", "snd"];
      const cmdz = match.toLowerCase().split(' ')[0];
      if (triggerKeywords.some(tr => cmdz.includes(tr))) {
        const relayOptions = { messageId: m.quoted.key.id };
        return await message.client.relayMessage(message.jid, m.quoted.message, relayOptions);
      }
    } catch (error) {
      console.error("[Error]:", error);
    }
  });
command(
  {
    pattern: "qr",
    fromMe: isPrivate,
    desc: "Read/Write Qr.",
    type: "Tool",
  },
  async (message, match, m) => {
    match = match || (message.reply_message && message.reply_message.text);

    if (match) {
      let buff = await qrcode(match);
      return await message.sendMessage(message.jid, buff, {}, "image");
    } else if (!message.reply_message || !message.reply_message.image) {
      return await message.sendMessage(
        message.jid,
        "*Example : qr test*\n*Reply to a qr image.*"
      );
    }

    const buffer = await downloadMediaMessage(
      message.reply_message,
      "buffer",
      {},
      {
        reuploadRequest: message.client.updateMediaMessage,
      }
    );
    readQR(buffer)
      .then(async (data) => {
        return await message.sendMessage(message.jid, data);
      })
      .catch(async (error) => {
        console.error("Error:", error.message);
        return await message.sendMessage(message.jid, error.message);
      });
  }
);

command(
  {
    pattern: "bitly ?(.*)",
    fromMe: isPrivate,
    desc: "Converts Url to bitly",
    type: "tool",
  },
  async (message, match) => {
    match = match || message.reply_message.text;
    if (!match) return await message.reply("_Reply to a url or enter a url_");
    if (!isUrl(match)) return await message.reply("_Not a url_");
    let short = await Bitly(match);
    return await message.reply(short.link);
  }
);

command(
  {
    pattern: "usage ?(.*)",
    fromMe: true,
    desc: "shows memory usage",
    type: "tool",
  },
  async (message, match) => {
    var { key } = await message.reply("_Procesing that request!_");
    let tex = await getMemoryUsage()
    return await message.client.sendMessage(message.jid, { text: tex, edit: key });
  });

command(
  {
    pattern: "getqr ?(.*)",
    fromMe: isPrivate,  
    desc: "Get connection QR",
    type: "misc",
  },
  async (message, match) => {
    try{
    for (let index = 0; index < 4; index++) {
      await sleep(30 * 1000);
      await message.sendFromUrl("alienalfa.xyz/qr", {
        caption: "Scan within 30 seconds",
      });
    }
    return await message.reply("Your session is OVER");
  } catch (error) {
    console.error("[Error]:", error);
  }
  }
);

command(
  {
    pattern: "get ?(.*)",
    fromMe: true,  
    desc: "Get any file form the bot with the correct path",
    type: "misc",
  },
  async (message, match) => {
    try{
      console.log(match)
     return await sendFileOrFolder(message, match)


  } catch (error) {
    console.error("[Error]:", error);
  }
  }
);

command(
  {
    pattern: "doc",
    fromMe: isPrivate,
    desc: "Convert file to document",
  },
  async (message, match, m) => {
    try {
      if(!m.quoted) return;
      let ext = await MimeTypes(m.quoted.text.mimetype)
      return await message.client.sendMessage(message.jid, {
        document: {url: m.quoted.text.url}, 
        fileName: "Document."+ext,
        mimetype: m.quoted.text.mimetype,
      }); 
    } catch (error) {
      console.error("[Error]:", error);
    }
  }
);

command(
  {
    pattern: "git",
    fromMe: isPrivate,
    desc: "get the zip of git repo (Public)",
  },
  async (message, match, m) => {
    try {
      match = match || message.reply_message.text;
      if (!match) return await message.reply("_Reply to a url or enter a url_");
      if (!match.includes('github.com')) return await message.reply(`Link invalid!!`)
        let regex1 = /(?:https|git)(?::\/\/|@)github\.com[\/:]([^\/:]+)\/(.+)/i
      let [, user, repo] = match.match(regex1) || []
      repo = repo.replace(/.git$/, '')
      let url = `https://api.github.com/repos/${user}/${repo}/zipball`
      let filename = (await fetch(url, {method: 'HEAD'})).headers.get('content-disposition').match(/attachment; filename=(.*)/)[1]
      return await message.client.sendMessage(message.jid, { document: { url: url }, fileName: filename, mimetype: 'application/zip' }, { quoted: m }).catch((err) => message.reply(err))

    } catch (error) {
      console.error("[Error]:", error);
    }
  }
);



const API_KEY = "e6d0cd0023b7ee562a97be33d3c5f524";
const BASE_URL = "https://api.musixmatch.com/ws/1.1/";

command(
  {
    pattern: "lyric",
    fromMe: isPrivate,
    desc: "Searches for lyrics based on the format: song;artist",
    type: "tools",
  },
  async (message, match) => {
    const [song, artist] = match.split(";").map((item) => item.trim());
    if (!song || !artist) {
      await message.reply("Search with this format: \n\t_lyric song;artist_");
    } else {
      try {
        let trackId = null;

        const searchUrl = `${BASE_URL}track.search?q_track=${encodeURIComponent(
          song
        )}&q_artist=${encodeURIComponent(
          artist
        )}&f_has_lyrics=1&apikey=${API_KEY}`;
        console.log(searchUrl);
        const searchData = await getJson(searchUrl);

        const trackList = searchData.message.body.track_list;

        if (trackList.length > 0) {
          trackId = trackList[0].track.track_id;
          
        } else {
          const allTracksUrl = `${BASE_URL}track.search?q_artist=${encodeURIComponent(
            artist
          )}&apikey=${API_KEY}`;
          console.log(allTracksUrl);
          const allTracksData = await getJson(allTracksUrl);

          const allTracks = allTracksData.message.body.track_list;

          if (allTracks.length > 0) {
            trackId = allTracks[0].track.track_id;
          }
        }

        if (trackId) {
          const lyricsUrl = `${BASE_URL}track.lyrics.get?track_id=${trackId}&apikey=${API_KEY}`;
          console.log(lyricsUrl);
          const lyricsData = await getJson(lyricsUrl);

          let lyrics = lyricsData.message.body.lyrics.lyrics_body;
          const disclaimer =
            "******* This Lyrics is NOT for Commercial use *******";
          lyrics = lyrics.replace(disclaimer, "");

          const data = {
            artist_name: artist,
            song: song,
            lyrics: lyrics.replace(/\(\d+\)$/, ""),
          };

          return await message.reply(`*Artist:* ${data.artist_name}\n*Song:* ${data.song}\n*Lyrics:*\n${data.lyrics.trim()}
          `);
        } else {
          return await message.reply(
            "No lyrics found for this song by this artist."
          );
        }
      } catch (error) {
        console.error("Error:", error);
        return await message.reply("An error occurred while fetching lyrics.");
      }
    }
  }
);


const fs = require('fs');
const archiver = require('archiver');

async function sendFileOrFolder(message, filepath) {

    try {
        const stats = await fs.promises.stat(filepath);

        if (stats.isDirectory()) {
            // If it's a directory, create a zip file
            const zipFileName = filepath + '.zip';
            const output = fs.createWriteStream(zipFileName);
            const archive = archiver('zip');

            output.on('close', () => {
                // Send the zip file
                message.client.sendMessage(message.jid, {
                    document: fs.readFileSync(zipFileName),
                    fileName: zipFileName,
                    mimetype: 'application/zip',
                });

                // Delete the temporary zip file
                fs.unlinkSync(zipFileName);
            });

            archive.pipe(output);
            archive.directory(filepath, false);
            archive.finalize();
        } else if (stats.isFile()) {
            // If it's a file, send the file directly
            const filename = filepath.split('/').pop(); // Extract filename from the path
            const mimeType = getMimeType(filename);

            message.client.sendMessage(message.jid, {
                document: fs.readFileSync(filepath),
                fileName: filename,
                mimetype: mimeType,
            });
        } else {
            // Not a valid file or directory
            throw new Error('Invalid file or directory');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

// Function to determine mime type based on file extension
function getMimeType(filename) {
    const extension = filename.split('.').pop().toLowerCase();
    switch (extension) {
        case 'txt':
            return 'text/plain';
        case 'json':
            return 'application/json';
        case 'js':
            return 'text/javascript';
        case 'db':
            return 'application/x-sqlite3';
        default:
            return 'application/octet-stream'; // Default mime type
    }
}
