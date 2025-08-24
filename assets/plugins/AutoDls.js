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
const logger = require("../../lib/logger");
  
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
        logger.warn(`Failed to cleanup incomplete file: ${cleanupError.message}`);
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
    logger.warn(`Failed to cleanup file ${filePath}:`, error.message);
  }
};

// Helper function to add delay between requests
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Y2mate YouTube downloader function
const downloadFromY2mate = async (url, quality = "360p") => {
  try {
    // Step 1: Analyze the YouTube URL
    const analyzeResponse = await fetch("https://www.y2mate.com/mates/analyzeV2/ajax", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        "Accept": "*/*",
        "X-Requested-With": "XMLHttpRequest",
        "Origin": "https://www.y2mate.com",
        "Referer": "https://www.y2mate.com/"
      },
      body: `k_query=${encodeURIComponent(url)}&k_page=home&hl=en&q_auto=0`
    });

    if (!analyzeResponse.ok) {
      throw new Error(`Y2mate analyze failed: ${analyzeResponse.status}`);
    }

    const analyzeData = await analyzeResponse.json();
    
    if (analyzeData.status !== "ok" || !analyzeData.result) {
      throw new Error("Y2mate analysis failed");
    }

    const videoData = analyzeData.result;
    const title = videoData.title;
    const vid = videoData.vid;
    
    // Find the best quality available
    let selectedFormat = null;
    const formats = videoData.links?.mp4 || {};
    
    // Priority order for quality selection
    const qualityPriority = [quality, "360p", "480p", "720p", "240p", "144p"];
    
    for (const preferredQuality of qualityPriority) {
      if (formats[preferredQuality]) {
        selectedFormat = {
          quality: preferredQuality,
          k: formats[preferredQuality].k
        };
        break;
      }
    }

    if (!selectedFormat) {
      throw new Error("No suitable video format found");
    }

    // Step 2: Convert/Download the video
    const convertResponse = await fetch("https://www.y2mate.com/mates/convertV2/index", {
      method: "POST", 
      headers: {
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        "Accept": "*/*",
        "X-Requested-With": "XMLHttpRequest",
        "Origin": "https://www.y2mate.com",
        "Referer": "https://www.y2mate.com/"
      },
      body: `vid=${vid}&k=${selectedFormat.k}`
    });

    if (!convertResponse.ok) {
      throw new Error(`Y2mate convert failed: ${convertResponse.status}`);
    }

    const convertData = await convertResponse.json();
    
    if (convertData.status !== "ok" || !convertData.result?.dlink) {
      throw new Error("Y2mate conversion failed");
    }

    return {
      title,
      quality: selectedFormat.quality,
      dlink: convertData.result.dlink,
      filesize: convertData.result.fsize || "Unknown"
    };

  } catch (error) {
    throw new Error(`Y2mate download failed: ${error.message}`);
  }
};

// Y2mate audio downloader function
const downloadAudioFromY2mate = async (url) => {
  try {
    // Step 1: Analyze the YouTube URL
    const analyzeResponse = await fetch("https://www.y2mate.com/mates/analyzeV2/ajax", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        "Accept": "*/*",
        "X-Requested-With": "XMLHttpRequest",
        "Origin": "https://www.y2mate.com",
        "Referer": "https://www.y2mate.com/"
      },
      body: `k_query=${encodeURIComponent(url)}&k_page=home&hl=en&q_auto=0`
    });

    if (!analyzeResponse.ok) {
      throw new Error(`Y2mate analyze failed: ${analyzeResponse.status}`);
    }

    const analyzeData = await analyzeResponse.json();
    
    if (analyzeData.status !== "ok" || !analyzeData.result) {
      throw new Error("Y2mate analysis failed");
    }

    const videoData = analyzeData.result;
    const title = videoData.title;
    const vid = videoData.vid;
    
    // Get MP3 format
    const mp3Formats = videoData.links?.mp3 || {};
    let selectedFormat = null;
    
    // Try to get the best quality MP3 (usually mp3128)
    if (mp3Formats.mp3128) {
      selectedFormat = {
        quality: "128kbps",
        k: mp3Formats.mp3128.k
      };
    } else if (mp3Formats.mp364) {
      selectedFormat = {
        quality: "64kbps", 
        k: mp3Formats.mp364.k
      };
    } else {
      throw new Error("No MP3 format available");
    }

    // Step 2: Convert/Download the audio
    const convertResponse = await fetch("https://www.y2mate.com/mates/convertV2/index", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        "Accept": "*/*",
        "X-Requested-With": "XMLHttpRequest",
        "Origin": "https://www.y2mate.com",
        "Referer": "https://www.y2mate.com/"
      },
      body: `vid=${vid}&k=${selectedFormat.k}`
    });

    if (!convertResponse.ok) {
      throw new Error(`Y2mate convert failed: ${convertResponse.status}`);
    }

    const convertData = await convertResponse.json();
    
    if (convertData.status !== "ok" || !convertData.result?.dlink) {
      throw new Error("Y2mate conversion failed");
    }

    return {
      title,
      quality: selectedFormat.quality,
      dlink: convertData.result.dlink,
      filesize: convertData.result.fsize || "Unknown"
    };

  } catch (error) {
    throw new Error(`Y2mate audio download failed: ${error.message}`);
  }
};
  
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
        logger.error("Auto download error:", error);
        // Don't send error message for auto-downloads to avoid spam
        if (error.message.includes('rate-overlimit')) {
          logger.warn("Rate limit hit for auto-download, skipping...");
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
        logger.warn("Instagram download API error:", igdlError.message);
        return await message.reply("_Instagram download failed. Please try again later._");
      }
      
      // Validate that data is an array and not an error string
      if (!data || !Array.isArray(data) || data.length === 0) {
        logger.warn("Instagram download failed or returned invalid data:", data);
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
            logger.warn("Invalid download link for Instagram media:", item);
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
          logger.error(`Error downloading Instagram media ${mediaCount}:`, error);
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
            logger.error(`Fallback failed for Instagram media ${mediaCount}:`, fallbackError);
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
      logger.error("Instagram download error:", e);
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
        logger.error("Error in Facebook streaming download:", error);
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
      
      const url = link[0];
      logger.info("🔍 Attempting to download YouTube URL:", url);
      
      // Try Y2mate first (most reliable)
      try {
        logger.info("🔄 Using Y2mate method...");
        const { title, quality, dlink, filesize } = await downloadFromY2mate(url, "360p");
        let filePath = null;
        
        try {
          const filename = `youtube_y2mate_${Date.now()}.mp4`;
          filePath = await downloadFileStream(dlink, filename);
          
          await message.sendMessage(message.jid, {
            video: fs.readFileSync(filePath),
            caption: `*${title}*\n_[Quality: ${quality}]_\n_[Size: ${filesize}]_`,
            mimetype: "video/mp4",
            fileName: `${title}.mp4`
          }, { quoted: message });
          
          logger.info("✅ Y2mate download successful");
          return;
        } catch (streamError) {
          logger.warn("Y2mate stream download failed, using direct URL:", streamError.message);
          await message.sendMessage(message.jid, {
            video: { url: dlink },
            caption: `*${title}*\n_[Quality: ${quality}]_\n_[Size: ${filesize}]_`,
          }, { quoted: message });
          logger.info("✅ Y2mate direct URL successful");
          return;
        } finally {
          if (filePath) cleanupFile(filePath);
        }
        
      } catch (y2mateError) {
        logger.warn("Y2mate failed, trying original methods:", y2mateError.message);
        
        // Fallback to original API
        try {
          const json = await getJson(`https://api.maher-zubair.tech/download/yt?url=${url}`);
          logger.info("🔍 YouTube API response success");
          
          if (!json || json.status !== 200 || !json.result || !json.result.video) {
            throw new Error("Invalid API response");
          }
          
          const { url: videoUrl, quality, title, thumbnail } = json.result.video;
          
          if (!videoUrl) {
            throw new Error("No download URL found");
          }
          
          let filePath = null;
          let thumbnailBuffer = null;

          try {
            // Download thumbnail
            try {
              if (thumbnail) {
                thumbnailBuffer = await getBuffer(thumbnail);
              }
            } catch (thumbError) {
              logger.warn("Failed to download thumbnail:", thumbError.message);
            }

            // Generate unique filename
            const filename = `youtube_${Date.now()}.mp4`;
            
            // Download using stream
            filePath = await downloadFileStream(videoUrl, filename);
            
            // Send the video file
            await message.sendMessage(message.jid, {
              video: fs.readFileSync(filePath),
              caption: `*${title || 'YouTube Video'}*\n_[Quality: ${quality || 'Unknown'}]_`,
              thumbnail: thumbnailBuffer,
              mimetype: "video/mp4",
              fileName: `${title || 'youtube_video'}.mp4`
            }, { quoted: message });
            
            logger.info("✅ YouTube backup API download successful");
            return;
            
          } catch (error) {
            logger.error("Error in YouTube streaming download:", error);
            // Fallback to direct URL method
            try {
              await message.sendMessage(message.jid, {
                video: { url: videoUrl },
                caption: `*${title || 'YouTube Video'}*\n_[Quality: ${quality || 'Unknown'}]_`,
                thumbnail: thumbnailBuffer,
              }, { quoted: message });
              logger.info("✅ YouTube backup direct URL successful");
              return;
            } catch (fallbackError) {
              throw new Error("Both streaming and direct URL methods failed");
            }
          } finally {
            // Clean up temp file
            if (filePath) {
              cleanupFile(filePath);
            }
          }
          
        } catch (apiError) {
          logger.warn("Backup API also failed, trying ytv method:", apiError.message);
          
          // Final fallback to ytv function
          try {
            logger.info("🔄 Using final fallback ytv method...");
            const { dlink, title } = await ytv(url, "360p");
            let filePath = null;
            
            try {
              const filename = `youtube_fallback_${Date.now()}.mp4`;
              filePath = await downloadFileStream(dlink, filename);
              
              await message.sendMessage(message.jid, {
                video: fs.readFileSync(filePath),
                caption: `*${title}*\n_[Quality: 360p]_`,
                mimetype: "video/mp4",
                fileName: `${title}.mp4`
              }, { quoted: message });
              
              logger.info("✅ YouTube final fallback download successful");
              return;
            } catch (streamError) {
              logger.warn("Final fallback stream failed, using direct URL:", streamError.message);
              await message.sendMessage(message.jid, {
                video: { url: dlink },
                caption: `*${title}*\n_[Quality: 360p]_`,
              }, { quoted: message });
              logger.info("✅ YouTube final direct URL successful");
              return;
            } finally {
              if (filePath) cleanupFile(filePath);
            }
          } catch (finalError) {
            logger.error("All YouTube download methods failed:", finalError.message);
            return await message.reply("_YouTube download is currently unavailable. Please try again later._");
          }
        }
      }
      
    } catch (error) {
      logger.error("YouTube download error:", error);
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
        // Try Y2mate first
        try {
          logger.info("🔄 Using Y2mate for audio download...");
          const { title, quality, dlink, filesize } = await downloadAudioFromY2mate(match);
          await message.reply(`_Downloading ${title}..._`);
          
          // Generate unique filename
          const filename = `youtube_audio_y2mate_${Date.now()}.mp3`;
          
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
          
          logger.info("✅ Y2mate audio download successful");
          return;
          
        } catch (y2mateError) {
          logger.warn("Y2mate audio failed, using fallback:", y2mateError.message);
          
          // Fallback to original yta method
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
          
          logger.info("✅ Fallback audio download successful");
        }
        
      } catch (e) {
        logger.error("Error in YouTube audio streaming download:", e);
        // Final fallback to buffer method
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
        // Try Y2mate first
        try {
          logger.info("🔄 Using Y2mate for video download...");
          const { title, quality: actualQuality, dlink, filesize } = await downloadFromY2mate(match.split(";")[0], quality);
          await message.reply(`_Downloading ${title} (${actualQuality})..._`);
          
          // Generate unique filename
          const filename = `youtube_video_y2mate_${Date.now()}.mp4`;
          
          // Download using stream
          filePath = await downloadFileStream(dlink, filename);
          
          await message.sendMessage(
            message.jid,
            { 
              video: fs.readFileSync(filePath), 
              caption: `*${title}*\n_[Quality: ${actualQuality}]_\n_[Size: ${filesize}]_`, 
              mimetype: "video/mp4", 
              fileName: `${title}.mp4` 
            },
            { quoted: message }
          );
          
          logger.info("✅ Y2mate video download successful");
          return;
          
        } catch (y2mateError) {
          logger.warn("Y2mate video failed, using fallback:", y2mateError.message);
          
          // Fallback to original ytv method
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
          
          logger.info("✅ Fallback video download successful");
        }
        
      } catch (e) {
        logger.error("Error in YouTube video streaming download:", e);
        // Final fallback to direct URL method
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
        logger.error("Error in song streaming download:", e);
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
        logger.error("Error in video streaming download:", e);
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
