const {
    isPrivate,
    command,
    getBuffer,
    getUrl,
    isUrl,
    toAudio,
    getJson,
    validateQuality,
  } = require("../../lib");
  const { igdl } = require('btch-downloader');
  const dl = require("@xaviabot/fb-downloader");
  const fetch = require("node-fetch");
  const { yta, ytv, ytsdl } = require("../../lib/ytdl");
  const fs = require('fs');
  const path = require('path');
  const { Readable } = require('stream');
  
  const isIgUrl = (text) => {
    const regex = /(https?:\/\/(?:www\.)?instagram\.com\/(?:p|reel|tv|stories)\/[\w-]+\/?)/;
    const match = text.match(regex);
    return match ? match[0] : null;
  };  

const isFbUrl = (text) => {
    const regex = /(https?:\/\/(?:www\.)?(?:facebook\.com|fb\.com|fb\.watch)\/[^\s]+)/;
    const match = text.match(regex);
    return match ? match[0] : null;
};

const isYtUrl = (text) => {
    const regex = /(https?:\/\/(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)[\w-]+)/;
    const match = text.match(regex);
    return match ? match[0] : null;
};

// Helper function to download file using stream
const downloadFileStream = async (url, filename) => {
  const tempDir = path.join(__dirname, '../../temp');
  
  // Create temp directory if it doesn't exist
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }
  
  const filePath = path.join(tempDir, filename);
  
  try {
    // Add timeout and retry logic
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
    
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    // Create write stream
    const fileStream = fs.createWriteStream(filePath);
    
    // Pipe the response to file with error handling
    await new Promise((resolve, reject) => {
      const stream = response.body.pipe(fileStream);
      
      response.body.on('error', (error) => {
        fileStream.destroy();
        reject(new Error(`Download stream error: ${error.message}`));
      });
      
      fileStream.on('error', (error) => {
        reject(new Error(`File write error: ${error.message}`));
      });
      
      fileStream.on('finish', () => {
        // Verify file was written
        if (fs.existsSync(filePath) && fs.statSync(filePath).size > 0) {
          resolve();
        } else {
          reject(new Error('File download incomplete or empty'));
        }
      });
      
      // Handle stream end without finish (connection issues)
      stream.on('end', () => {
        setTimeout(() => {
          if (!fileStream.destroyed) {
            fileStream.end();
          }
        }, 1000);
      });
    });
    
    return filePath;
  } catch (error) {
    // Clean up file if it exists
    if (fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
      } catch (cleanupError) {
        console.warn(`Failed to cleanup incomplete file: ${cleanupError.message}`);
      }
    }
    
    // Handle specific error types
    if (error.name === 'AbortError') {
      throw new Error('Download timeout - file too large or connection slow');
    } else if (error.message.includes('rate-overlimit')) {
      throw new Error('Rate limit exceeded - please try again later');
    } else {
      throw error;
    }
  }
};

// Helper function to clean up temp files
const cleanupFile = (filePath) => {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch (error) {
    console.warn(`Failed to cleanup file ${filePath}:`, error.message);
  }
};

// Helper function to add delay between requests
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
  
  command({
      on: "text",
      fromMe: isPrivate,
      desc: "Auto download media from any Url",
      type: "auto",
      dontAddCommandList: true,
    },
    async (message, match) => {
      const text = match;
      if (!text) return;
      
      try {
        if (isIgUrl(text)) {
          await downloadInstaMedia(message, text);
        } else if (isFbUrl(text)) {
          await downloadFacebookMedia(message, text);
        } else if (isYtUrl(text)) {
          await downloadYoutubeMedia(message, text);
        }
      } catch (error) {
        console.error("Auto download error:", error);
        // Don't send error message for auto-downloads to avoid spam
        if (error.message.includes('rate-overlimit')) {
          console.warn("Rate limit hit for auto-download, skipping...");
        }
      }
    }
  );
  
  const downloadInstaMedia = async (message, match) => {
    try {
      await message.reply("_Downloading Instagram media..._");
      
      // Extract URL from match string
      const urlMatch = match.match(/(https?:\/\/(?:www\.)?instagram\.com\/(?:p|reel|tv|stories)\/[\w-]+\/?)/);
      if (!urlMatch) return await message.reply("_Invalid Instagram URL._");
      
      const url = urlMatch[0];
      
      let data;
      try {
        data = await igdl(url);
      } catch (igdlError) {
        console.warn("Instagram download API error:", igdlError.message);
        return await message.reply("_Instagram download failed. Please try again later._");
      }
      
      // Validate that data is an array and not an error string
      if (!data || !Array.isArray(data) || data.length === 0) {
        console.warn("Instagram download failed or returned invalid data:", data);
        return await message.reply("_No media found on the link or download failed._");
      }
      
      let mediaCount = 0;
      for (let i = 0; i < data.length; i++) {
        const item = data[i];
        let filePath = null;
        
        // Add delay between downloads to avoid rate limiting
        if (i > 0) {
          await delay(2000); // 2 second delay between media items
        }
        
        try {
          // Check if download_link exists and is valid
          if (!item.download_link || typeof item.download_link !== 'string') {
            console.warn("Invalid download link for Instagram media:", item);
            continue;
          }

          // Determine file extension from URL or content type
          let fileExtension = 'jpg'; // default
          if (item.download_link.includes('.mp4') || item.download_link.includes('video')) {
            fileExtension = 'mp4';
          } else if (item.download_link.includes('.jpg') || item.download_link.includes('.jpeg')) {
            fileExtension = 'jpg';
          } else if (item.download_link.includes('.png')) {
            fileExtension = 'png';
          }
          
          // Generate unique filename
          const filename = `instagram_${Date.now()}_${mediaCount}.${fileExtension}`;
          
          // Download using stream
          filePath = await downloadFileStream(item.download_link, filename);
          
          // Send file based on type
          if (fileExtension === 'mp4') {
            await message.sendMessage(message.jid, {
              video: fs.readFileSync(filePath),
              caption: item.caption || `📸 Instagram Video ${mediaCount + 1}`,
              mimetype: "video/mp4"
            }, { quoted: message });
          } else {
            await message.sendMessage(message.jid, {
              image: fs.readFileSync(filePath),
              caption: item.caption || `📸 Instagram Photo ${mediaCount + 1}`
            }, { quoted: message });
          }
          
          mediaCount++;
        } catch (error) {
          console.error(`Error downloading Instagram media ${mediaCount}:`, error);
          // Try fallback method for this media item
          try {
            if (item.download_link) {
              if (item.download_link.includes('.mp4') || item.download_link.includes('video')) {
                await message.sendMessage(message.jid, {
                  video: { url: item.download_link },
                  caption: item.caption || `📸 Instagram Video ${mediaCount + 1}`
                }, { quoted: message });
              } else {
                await message.sendMessage(message.jid, {
                  image: { url: item.download_link },
                  caption: item.caption || `📸 Instagram Photo ${mediaCount + 1}`
                }, { quoted: message });
              }
              mediaCount++;
            }
          } catch (fallbackError) {
            console.error(`Fallback failed for Instagram media ${mediaCount}:`, fallbackError);
          }
        } finally {
          // Clean up temp file
          if (filePath) {
            cleanupFile(filePath);
          }
        }
      }
      
      if (mediaCount === 0) {
        await message.reply("_Failed to download any media from the Instagram link._");
      }
    } catch (e) {
      console.error("Instagram download error:", e);
      await message.reply(`_Error downloading Instagram media: ${e.message}_`);
    }
  };
  
  const downloadFacebookMedia = async (message, match) => {
    try {
      await message.reply("_Downloading Facebook media..._");
      const link = match.match(/(https?:\/\/[^\s]+)/);
      if (!link) return await message.reply("_Invalid Facebook URL._");
      
      const { sd, hd, title } = await dl(link[0]);
      const quality = match.includes("hd") ? "hd" : "sd";
      const url = quality === "hd" ? hd : sd;
      
      if (!url) return await message.reply("_Could not download the video._");

      let filePath = null;
      try {
        // Generate unique filename
        const filename = `facebook_${Date.now()}.mp4`;
        
        // Download using stream
        filePath = await downloadFileStream(url, filename);
        
        // Send the video file
        await message.sendMessage(message.jid, {
          video: fs.readFileSync(filePath),
          caption: `*${title}*\n_[Quality: ${quality.toUpperCase()}]_`,
          mimetype: "video/mp4",
          fileName: `${title}.mp4`
        }, { quoted: message });
        
      } catch (error) {
        console.error("Error in Facebook streaming download:", error);
        // Fallback to direct URL method
        await message.client.sendMessage(message.jid, {
          video: { url },
          caption: `*${title}*\n_[Quality: ${quality.toUpperCase()}]_`,
        }, { quoted: message });
      } finally {
        // Clean up temp file
        if (filePath) {
          cleanupFile(filePath);
        }
      }
    } catch (error) {
      await message.reply(`_Error downloading Facebook media: ${error.message}_`);
    }
  };

  const downloadYoutubeMedia = async (message, match) => {
    try {
      await message.reply("_Downloading YouTube media..._");
      const link = match.match(/(https?:\/\/[^\s]+)/);
      if (!link) return await message.reply("_Invalid YouTube URL._");
      
      const json = await getJson(`https://api.maher-zubair.tech/download/yt?url=${link[0]}`);
      if (json.status !== 200 || !json.result || !json.result.video) {
        return await message.reply("_Could not download the video._");
      }
      
      const { url, quality, title, thumbnail } = json.result.video;
      let filePath = null;
      let thumbnailBuffer = null;

      try {
        // Download thumbnail
        try {
          thumbnailBuffer = await getBuffer(thumbnail);
        } catch (thumbError) {
          console.warn("Failed to download thumbnail:", thumbError.message);
        }

        // Generate unique filename
        const filename = `youtube_${Date.now()}.mp4`;
        
        // Download using stream
        filePath = await downloadFileStream(url, filename);
        
        // Send the video file
        await message.sendMessage(message.jid, {
          video: fs.readFileSync(filePath),
          caption: `*${title}*\n_[Quality: ${quality}]_`,
          thumbnail: thumbnailBuffer,
          mimetype: "video/mp4",
          fileName: `${title}.mp4`
        }, { quoted: message });
        
      } catch (error) {
        console.error("Error in YouTube streaming download:", error);
        // Fallback to direct URL method
        await message.client.sendMessage(message.jid, {
          video: { url },
          caption: `*${title}*\n_[Quality: ${quality}]_`,
          thumbnail: thumbnailBuffer,
        }, { quoted: message });
      } finally {
        // Clean up temp file
        if (filePath) {
          cleanupFile(filePath);
        }
      }
    } catch (error) {
      await message.reply(`_Error downloading YouTube media: ${error.message}_`);
    }
  };
  
  command({
      pattern: "fb",
      fromMe: isPrivate,
      desc: "Facebook video downloader",
      type: "downloader",
    },
    async (message, match) => {
      const url = match || (message.reply_message && message.reply_message.text);
      if (!url || !isFbUrl(url)) return await message.reply("_Provide a valid Facebook URL._");
      await downloadFacebookMedia(message, url);
    });
  
  command({
      pattern: "insta",
      fromMe: isPrivate,
      desc: "Instagram media downloader",
      type: "downloader",
    },
    async (message, match) => {
      const url = match || (message.reply_message && message.reply_message.text);
      if (!url || !isIgUrl(url)) return await message.reply("_Provide a valid Instagram URL._");
      await downloadInstaMedia(message, url);
    }
  );
  
  command({
      pattern: "yta",
      fromMe: isPrivate,
      desc: "Download audio from YouTube",
      type: "downloader",
    },
    async (message, match) => {
      match = match || (message.reply_message && message.reply_message.text);
      if (!match || !isYtUrl(match)) return await message.reply("_Provide a valid YouTube URL._");
      
      let filePath = null;
      try {
        const { dlink, title } = await yta(match);
        await message.reply(`_Downloading ${title}..._`);
        
        // Generate unique filename
        const filename = `youtube_audio_${Date.now()}.mp3`;
        
        // Download using stream
        filePath = await downloadFileStream(dlink, filename);
        
        // Convert to audio if needed
        const audioBuffer = fs.readFileSync(filePath);
        const convertedAudio = await toAudio(audioBuffer, "mp3");
        
        await message.sendMessage(
          message.jid,
          { 
            audio: convertedAudio, 
            mimetype: "audio/mpeg", 
            fileName: `${title}.mp3`,
            ptt: false
          },
          { quoted: message }
        );
      } catch (e) {
        console.error("Error in YouTube audio streaming download:", e);
        // Fallback to buffer method
        try {
          const { dlink, title } = await yta(match);
          const buffer = await getBuffer(dlink);
          const audio = await toAudio(buffer, "mp3");
          await message.sendMessage(
            message.jid,
            { audio, mimetype: "audio/mpeg", fileName: `${title}.mp3` },
            { quoted: message }
          );
        } catch (fallbackError) {
          await message.reply(`_Error downloading audio: ${fallbackError.message}_`);
        }
      } finally {
        // Clean up temp file
        if (filePath) {
          cleanupFile(filePath);
        }
      }
    }
  );
  
  command({
      pattern: "ytv",
      fromMe: isPrivate,
      desc: "Download video from YouTube",
      type: "downloader",
    },
    async (message, match) => {
      match = match || (message.reply_message && message.reply_message.text);
      if (!match || !isYtUrl(match)) return await message.reply("_Provide a valid YouTube URL._");
      
      const quality = match.split(";")[1] || "360p";
      if (!validateQuality(quality)) {
        return await message.reply("_Invalid resolution. Supported: 144p, 240p, 360p, 480p, 720p, 1080p, 1440p, 2160p_");
      }
      
      let filePath = null;
      try {
        const { dlink, title } = await ytv(match.split(";")[0], quality);
        await message.reply(`_Downloading ${title} (${quality})..._`);
        
        // Generate unique filename
        const filename = `youtube_video_${Date.now()}.mp4`;
        
        // Download using stream
        filePath = await downloadFileStream(dlink, filename);
        
        await message.sendMessage(
          message.jid,
          { 
            video: fs.readFileSync(filePath), 
            caption: `*${title}*\n_[Quality: ${quality}]_`, 
            mimetype: "video/mp4", 
            fileName: `${title}.mp4` 
          },
          { quoted: message }
        );
      } catch (e) {
        console.error("Error in YouTube video streaming download:", e);
        // Fallback to direct URL method
        try {
          const { dlink, title } = await ytv(match.split(";")[0], quality);
          await message.sendMessage(
            message.jid,
            { video: { url: dlink }, caption: title, mimetype: "video/mp4", fileName: `${title}.mp4` },
            { quoted: message }
          );
        } catch (fallbackError) {
          await message.reply(`_Error downloading video: ${fallbackError.message}_`);
        }
      } finally {
        // Clean up temp file
        if (filePath) {
          cleanupFile(filePath);
        }
      }
    }
  );
  
  command({
      pattern: "song",
      fromMe: isPrivate,
      desc: "Download audio by song name",
      type: "downloader",
    },
    async (message, match) => {
      match = match || (message.reply_message && message.reply_message.text);
      if (!match) return await message.reply("_Provide a song name to search._");
      
      let filePath = null;
      try {
        const { dlink, title } = await ytsdl(match + " song");
        await message.reply(`_Downloading ${title}..._`);
        
        // Generate unique filename
        const filename = `song_${Date.now()}.mp3`;
        
        // Download using stream
        filePath = await downloadFileStream(dlink, filename);
        
        const audioBuffer = fs.readFileSync(filePath);
        await message.sendMessage(
          message.jid,
          { 
            audio: audioBuffer, 
            mimetype: "audio/mpeg", 
            fileName: `${title}.mp3`,
            ptt: false
          },
          { quoted: message }
        );
      } catch (e) {
        console.error("Error in song streaming download:", e);
        // Fallback to buffer method
        try {
          const { dlink, title } = await ytsdl(match + " song");
          const buffer = await getBuffer(dlink);
          await message.sendMessage(
            message.jid,
            { audio: buffer, mimetype: "audio/mpeg", fileName: `${title}.mp3` },
            { quoted: message }
          );
        } catch (fallbackError) {
          await message.reply(`_Error downloading song: ${fallbackError.message}_`);
        }
      } finally {
        // Clean up temp file
        if (filePath) {
          cleanupFile(filePath);
        }
      }
    }
  );
  
  command({
      pattern: "video",
      fromMe: isPrivate,
      desc: "Download video by name",
      type: "downloader",
    },
    async (message, match) => {
      match = match || (message.reply_message && message.reply_message.text);
      if (!match) return await message.reply("_Provide a video name to search._");
      
      let filePath = null;
      try {
        const { dlink, title } = await ytsdl(match, "video");
        await message.reply(`_Downloading ${title}..._`);
        
        // Generate unique filename
        const filename = `video_${Date.now()}.mp4`;
        
        // Download using stream
        filePath = await downloadFileStream(dlink, filename);
        
        await message.sendMessage(
          message.jid,
          { 
            video: fs.readFileSync(filePath), 
            caption: `*${title}*`, 
            mimetype: "video/mp4", 
            fileName: `${title}.mp4` 
          },
          { quoted: message }
        );
      } catch (e) {
        console.error("Error in video streaming download:", e);
        // Fallback to direct URL method
        try {
          const { dlink, title } = await ytsdl(match, "video");
          await message.sendMessage(
            message.jid,
            { video: { url: dlink }, caption: title, mimetype: "video/mp4", fileName: `${title}.mp4` },
            { quoted: message }
          );
        } catch (fallbackError) {
          await message.reply(`_Error downloading video: ${fallbackError.message}_`);
        }
      } finally {
        // Clean up temp file
        if (filePath) {
          cleanupFile(filePath);
        }
      }
    }
  );
// Made with ❤ by AlienAlfa
