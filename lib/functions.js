const axios = require("axios");
const {
  jidDecode,
  delay,
  generateWAMessageFromContent,
  proto,
} = require("@whiskeysockets/baileys");
const id3 = require("browser-id3-writer");
const { readFile, unlink } = require("fs/promises");
const { fromBuffer } = require("file-type");
const JSZip = require("jszip");
const acrcloud = require("acrcloud");
const path = require("path");
const FormData = require("form-data");
const { spawn } = require("child_process");
const { default: fetch } = require("node-fetch");
let { JSDOM } = require("jsdom");
const cheerio = require("cheerio");
const { commands } = require("./plugins");
const config = require("../config");
const jsQR = require("jsqr");
const fs = require("fs");
const jimp = require("jimp");
const { loadMessage } = require("../assets/database/StoreDb");
const { tmpdir } = require("os");
const { exec } = require("child_process");
const streamBuffers = require("stream-buffers");
async function m3u82Mp4(m3u8Url) {
  return new Promise((resolve, reject) => {
    const writableStreamBuffer = new streamBuffers.WritableStreamBuffer({
      initialSize: 100 * 1024,
      incrementAmount: 10 * 1024,
    });
    const tempOutputFile = "output.mp4";
    const command = `"${ffmpegPath}" -i "${m3u8Url}" -c copy "${tempOutputFile}"`;
    const ffmpegProcess = exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error occurred: ${error.message}`);
        return reject(error);
      }

      // Read the resulting MP4 file into a buffer
      fs.readFile(tempOutputFile, (err, data) => {
        if (err) {
          return reject(err);
        }
        writableStreamBuffer.write(data);
        writableStreamBuffer.end();
        fs.unlinkSync(tempOutputFile);
        resolve(writableStreamBuffer.getContents());
      });
    });
    ffmpegProcess.stderr.on("data", (data) => {
      const progressLine = data.toString();
      const timeMatch = progressLine.match(/time=(\d{2}:\d{2}:\d{2}\.\d{2})/);
      if (timeMatch) {
        const elapsedTime = timeMatch[1];
        console.log(`Conversion progress: ${elapsedTime}`);
      }
    });
  });
}
/**
 * Convert a buffer to a file and save it
 * @param {Buffer} buffer The buffer to convert
 * @param {String} filename The name of the file
 * @returns {String} The path to the saved file
 * @example
 * const path = await bufferToFile(buffer, 'file.txt')
 * console.log(path)
 */

async function buffToFile(buffer, filename) {
  if (!filename) filename = Date.now();
  let { ext } = await fromBuffer(buffer);
  let filePath = path.join(tmpdir(), `${filename}.${ext}`);
  await fs.promises.writeFile(filePath, buffer);
  return filePath;
}

async function WriteSession() {
  try {
    console.log("[GENERATING SESSION]");
    if (process.env.SESSION !== undefined) {
      console.log('[SESSION]:[ USING SESSION FROM VARS ]');
      data = JSON.parse(process.env.SESSION);
      console.log('[SESSION]:[' + JSON.stringify(data) + "]");
      fs.writeFileSync("./session/creds.json", JSON.stringify(data));
      console.log("Session extraction complete");
      return;
    } else if (process.env.SESSION === undefined) {
      id = process.env.SESSION_ID;
      console.log('[SESSION ID]:[' + id + "]");
      const url = `https://paste.c-net.org/${id}`;
      const response = await fetchWithRetry(url, { timeout: 10000 });

      if (response) {
        data = await response.json();
        console.log('[SESSION]:[' + JSON.stringify(data) + "]");
        fs.writeFileSync("./session/creds.json", JSON.stringify(data));
        console.log("Session extraction complete");
        return;
      }
    }

    console.log("All attempts failed. Could not retrieve session data.");
  } catch (error) {
    console.error("An unexpected error occurred: " + error.message);
  }
}

async function fetchWithRetry(url, options = {}, retries = 5, backoff = 300) {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, options);
      if (response.ok) {
        return response;
      }
    } catch (error) {
      console.error(`[FETCH Error]: ${error.message}`);
    }
    await new Promise(resolve => setTimeout(resolve, backoff * Math.pow(2, i)));
  }
  throw new Error(`Failed to fetch ${url} after ${retries} retries`);
}

/**
 *
 * @param {Buffer} imageBuffer
 * @returns {Buffer|null} [Buffer|null
 */

const removeBg = async (imageBuffer) => {
  const formData = new FormData();
  const inputPath = await buffToFile(imageBuffer);
  formData.append("size", "auto");
  formData.append(
    "image_file",
    fs.createReadStream(inputPath),
    path.basename(inputPath)
  );
  try {
    const response = await axios({
      method: "post",
      url: "https://api.remove.bg/v1.0/removebg",
      data: formData,
      responseType: "arraybuffer",
      headers: {
        ...formData.getHeaders(),
        "X-Api-Key": config.REMOVEBG,
      },
      encoding: null,
    });

    if (response.status !== 200) {
      console.error("Error:", response.status, response.statusText);
      return null;
    }

    return response.data;
  } catch (error) {
    console.error("Request failed:", error);
    return null;
  }
};

async function validatAndSaveDeleted(client, msg) {
  if (msg.type === "protocolMessage") {
    if (msg.message.protocolMessage.type === "REVOKE") {
      await client.sendMessage(msg.key.remoteJid, { text: "Message Deleted" });
      let jid = config.DELETED_LOG_CHAT;
      let message = await loadMessage(msg.message.protocolMessage.key.id);
      const m = generateWAMessageFromContent(jid, message.message, {
        userJid: client.user.id,
      });
      await client.relayMessage(jid, m.message, {
        messageId: m.key.id,
      });
      return m;
    }
  }
}
async function textToImg(text) {
  try {
    const words = text.split(" ");
    const lines = [];
    let line = "";
    words.forEach((word) => {
      if (line.length + word.length < 30) {
        line += word + " ";
      } else {
        lines.push(line);
        line = word + " ";
      }
    });
    lines.push(line);
    text = lines.join("\n");
    const font = await jimp.loadFont(jimp.FONT_SANS_64_WHITE);
    const textWidth = jimp.measureText(font, text.substring(0, 35));
    const textHeight = jimp.measureTextHeight(font, text);
    const canvasWidth = textWidth;
    const canvasHeight = textHeight + -(textHeight * 0.8);
    const image = new jimp(canvasWidth, canvasHeight, 0x075e54ff);
    const x = 5;
    const y = 5;
    image.print(font, x, y, text, textWidth, textHeight);
    image.shadow({ blur: 3, x: 6, y: 5, color: "#000000" });
    const buffer = await image.getBufferAsync(jimp.MIME_PNG);
    return buffer;
  } catch (err) {
    throw new Error(err);
  }
}

/**
 * Reads a QR code from an image buffer.
 * @param {Buffer} imageBuffer - The image buffer containing the QR code.
 * @returns {string|null} The decoded QR code data, or null if no QR code was found.
 */
async function readQr(imageBuffer) {
  try {
    const image = await jimp.read(imageBuffer);
    const { data, width, height } = image.bitmap;
    const code = jsQR(data, width, height);
    if (code) {
      return code.data;
    }
  } catch (err) {
    throw new Error(`Error reading QR code: ${err.message}`);
  }
  return null;
}

function createInteractiveMessage(data, options = {}) {
  const { jid, button, header, footer, body } = data;
  let buttons = [];
  for (let i = 0; i < button.length; i++) {
    let btn = button[i];
    let Button = {};
    Button.buttonParamsJson = JSON.stringify(btn.params);
    switch (btn.type) {
      case "copy":
        Button.name = "cta_copy";
        break;
      case "url":
        Button.name = "cta_url";
        break;
      case "location":
        Button.name = "send_location";
        break;
      case "address":
        Button.name = "address_message";
        break;
      case "call":
        Button.name = "cta_call";
        break;
      case "reply":
        Button.name = "quick_reply";
        break;
      case "list":
        Button.name = "single_select";
        break;
      default:
        Button.name = "quick_reply";
        break;
    }
    buttons.push(Button);
  }
  const mess = {
    viewOnceMessage: {
      message: {
        messageContextInfo: {
          deviceListMetadata: {},
          deviceListMetadataVersion: 2,
        },
        interactiveMessage: proto.Message.InteractiveMessage.create({
          body: proto.Message.InteractiveMessage.Body.create({ ...body }),
          footer: proto.Message.InteractiveMessage.Footer.create({ ...footer }),
          header: proto.Message.InteractiveMessage.Header.create({ ...header }),
          nativeFlowMessage:
            proto.Message.InteractiveMessage.NativeFlowMessage.create({
              buttons: buttons,
            }),
        }),
      },
    },
  };
  let optional = generateWAMessageFromContent(jid, mess, options);
  return optional;
}
/*
async function WriteSession(id) {
  try {
    const url = `http://xasena.neerajx0.xyz/fetch`;
    const response = await axios.post(url, { id });

    if (response.data && response.data instanceof Buffer) {
      fs.writeFileSync("./session.zip", response.data);
      const zip = new JSZip();
      await zip.loadAsync(response.data);

      for (const [name, file] of Object.entries(zip.files)) {
        if (!file.dir) {
          const content = await file.async("nodebuffer");
          const filePath = "./session/" + name;
          fs.writeFileSync(filePath, content);
        }
      }

      console.log("Session extraction complete");
    } else {
      throw new Error("Invalid response data");
    }
  } catch (error) {
    console.error(error.message);
    console.log(
      "Invalid Session ID \n\nTry again, and if the issue persists, get a new session ID."
    );
  }
}
*/
function ffmpeg(buffer, args = [], ext = "", ext2 = "") {
  return new Promise(async (resolve, reject) => {
    try {
      let tmp = path.join(tmpdir() + "/" + new Date() + "." + ext);
      let out = tmp + "." + ext2;
      await fs.promises.writeFile(tmp, buffer);
      const ffmpegProcess = spawn("ffmpeg", ["-y", "-i", tmp, ...args, out])
        .on("error", reject)
        .on("close", async (code) => {
          try {
            await fs.promises.unlink(tmp);
            if (code !== 0) {
              reject(new Error(`FFmpeg process exited with code ${code}`));
              return;
            }
            const processedData = await fs.promises.readFile(out);
            await fs.promises.unlink(out);
            resolve(processedData);
          } catch (e) {
            reject(e);
          }
        });
    } catch (e) {
      reject(e);
    }
  });
}

/**
 * Convert Audio to Playable WhatsApp Audio
 * @param {Buffer} buffer Audio Buffer
 * @param {String} ext File Extension
 */
function toAudio(buffer, ext) {
  return ffmpeg(
    buffer,
    ["-vn", "-ac", "2", "-b:a", "128k", "-ar", "44100", "-f", "mp3"],
    ext,
    "mp3"
  );
}

/**
 * Convert Audio to Playable WhatsApp PTT
 * @param {Buffer} buffer Audio Buffer
 * @param {String} ext File Extension
 */
function toPTT(buffer, ext) {
  return ffmpeg(
    buffer,
    [
      "-vn",
      "-c:a",
      "libopus",
      "-b:a",
      "128k",
      "-vbr",
      "on",
      "-compression_level",
      "10",
    ],
    ext,
    "opus"
  );
}

/**
 * Convert Audio to Playable WhatsApp Video
 * @param {Buffer} buffer Video Buffer
 * @param {String} ext File Extension
 */
function toVideo(buffer, ext) {
  return ffmpeg(
    buffer,
    [
      "-c:v",
      "libx264",
      "-c:a",
      "aac",
      "-ab",
      "128k",
      "-ar",
      "44100",
      "-crf",
      "32",
      "-preset",
      "slow",
    ],
    ext,
    "mp4"
  );
}

async function getBuffer(url, options = {}) {
  try {
    const res = await axios({
      method: "get",
      url,
      headers: {
        DNT: 1,
        "Upgrade-Insecure-Request": 1,
      },
      ...options,
      responseType: "arraybuffer",
    });
    return res.data;
  } catch (error) {
    throw new Error(`Error: ${error.message}`);
  }
}
const decodeJid = (jid) => {
  if (!jid) return jid;
  if (/:\d+@/gi.test(jid)) {
    const decode = jidDecode(jid) || {};
    return decode.user && decode.server
      ? `${decode.user}@${decode.server}`
      : jid;
  } else {
    return jid;
  }
};
async function FiletypeFromUrl(url) {
  const buffer = await getBuffer(url);
  const out = await fromBuffer(buffer);
  let type;
  if (out) {
    type = out.mime.split("/")[0];
  }
  return { type, buffer };
}
function extractUrlFromMessage(message) {
  const urlRegex = /(https?:\/\/[^\s]+)/gi;
  const match = urlRegex.exec(message);
  return match ? match[0] : null;
}

const removeCommand = async (name) => {
  return new Promise((resolve, reject) => {
    commands.map(async (command, index) => {
      if (
        command.pattern !== undefined &&
        command.pattern.test(new RegExp(`${config.HANDLERS}( ?${name})`, "is"))
      ) {
        commands.splice(index, 1);
        return resolve(true);
      }
    });
    resolve(false);
  });
};
async function igdl(igurl) {
  const data = `q=${encodeURIComponent(igurl)}&t=media&lang=en`;
  const config = {
    method: "post",
    maxBodyLength: Infinity,
    url: "https://v3.saveig.app/api/ajaxSearch",
    headers: {
      Accept: "/",
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
    },
    data: data,
  };

  const response = await axios.request(config);
  const html = response.data.data;

  const $ = cheerio.load(html, { decodeEntities: true });
  const downloadItems = $(".download-items");
  const result = [];

  downloadItems.each((index, element) => {
    let url = $(element).find(".download-items__btn > a").attr("href");
    if (url.includes("file")) {
      let newUrl = new URL(url);
      let encodedUrl = newUrl.searchParams.get("file");
      let decodedUrl = Buffer.from(encodedUrl, "base64").toString("utf-8");
      result.push(decodedUrl);
    } else {
      result.push(url);
    }
  });

  return result;
}

function aiImage(prompt) {
  return new Promise((resolve, reject) => {
    axios
      .post(
        "https://socket.xasena.me/generate-image",
        {
          prompt: prompt,
        },
        {
          headers: {
            Accept: "*/*",
            "User-Agent": "Thunder Client (https://www.thunderclient.com)",
            "Content-Type": "application/json",
          },
          responseType: "arraybuffer",
        }
      )
      .then(function (response) {
        if (response.status === 400) {
          resolve(response.data);
        } else {
          resolve(Buffer.from(response.data, "binary"));
        }
      })
      .catch(function (error) {
        reject(error);
      });
  });
}

async function getJson(url, options) {
  try {
    options ? options : {};
    const res = await axios({
      method: "GET",
      url: url,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36",
      },
      ...options,
    });
    return res.data;
  } catch (err) {
    return err;
  }
}

const API_KEY = "e6d0cd0023b7ee562a97be33d3c5f524";
const BASE_URL = "https://api.musixmatch.com/ws/1.1/";

async function getLyrics(song, artist) {
  try {
    const searchUrl = `${BASE_URL}track.search?q_track=${encodeURIComponent(
      song
    )}&q_artist=${encodeURIComponent(artist)}&f_has_lyrics=1&apikey=${API_KEY}`;
    const searchData = await getJson(searchUrl);
    const trackList = searchData.message.body.track_list;

    let trackId = null;
    if (trackList.length > 0) {
      trackId = trackList[0].track.track_id;
    } else {
      const allTracksUrl = `${BASE_URL}track.search?q_artist=${encodeURIComponent(
        artist
      )}&apikey=${API_KEY}`;
      const allTracksData = await getJson(allTracksUrl);
      const allTracks = allTracksData.message.body.track_list;
      if (allTracks.length > 0) {
        trackId = allTracks[0].track.track_id;
      }
    }

    if (trackId) {
      const lyricsUrl = `${BASE_URL}track.lyrics.get?track_id=${trackId}&apikey=${API_KEY}`;
      const lyricsData = await getJson(lyricsUrl);
      let lyrics = lyricsData.message.body.lyrics.lyrics_body;
      const disclaimer =
        "********************** This Lyrics is NOT for Commercial use **********************";
      lyrics = lyrics.replace(disclaimer, "");
      return {
        artist_name: artist,
        song,
        lyrics: lyrics.replace(/\(\d+\)$/, ""),
      };
    }
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }

  return null;
}

module.exports = {
  parseTimeToSeconds: (timeString) => {
    const [minutes, seconds] = timeString.split(":").map(Number);
    return minutes * 60 + seconds;
  },
  toAudio,
  toPTT,
  toVideo,
  ffmpeg,
  WriteSession,
  removeBg,
  FiletypeFromUrl,
  removeCommand,
  getBuffer,
  extractUrlFromMessage,
  decodeJid,
  fetchWithRetry,
  isAdmin: async (jid, user, client) => {
    const groupMetadata = await client.groupMetadata(jid);
    const groupAdmins = groupMetadata.participants
      .filter((participant) => participant.admin !== null)
      .map((participant) => participant.id);

    return groupAdmins.includes(decodeJid(user));
  },
  webp2mp4: async (source) => {
    let form = new FormData();
    let isUrl = typeof source === "string" && /https?:\/\//.test(source);
    form.append("new-image-url", isUrl ? source : "");
    form.append("new-image", isUrl ? "" : source, "image.webp");
    let res = await fetch("https://ezgif.com/webp-to-mp4", {
      method: "POST",
      body: form,
    });
    let html = await res.text();
    let { document } = new JSDOM(html).window;
    let form2 = new FormData();
    let obj = {};
    for (let input of document.querySelectorAll("form input[name]")) {
      obj[input.name] = input.value;
      form2.append(input.name, input.value);
    }
    let res2 = await fetch("https://ezgif.com/webp-to-mp4/" + obj.file, {
      method: "POST",
      body: form2,
    });
    let html2 = await res2.text();
    let { document: document2 } = new JSDOM(html2).window;
    return new URL(
      document2.querySelector("div#output > p.outfile > video > source").src,
      res2.url
    ).toString();
  },
  validatAndSaveDeleted,
  webp2png: async (source) => {
    let form = new FormData();
    let isUrl = typeof source === "string" && /https?:\/\//.test(source);
    form.append("new-image-url", isUrl ? source : "");
    form.append("new-image", isUrl ? "" : source, "image.webp");
    let res = await fetch("https://s6.ezgif.com/webp-to-png", {
      method: "POST",
      body: form,
    });
    let html = await res.text();
    let { document } = new JSDOM(html).window;
    let form2 = new FormData();
    let obj = {};
    for (let input of document.querySelectorAll("form input[name]")) {
      obj[input.name] = input.value;
      form2.append(input.name, input.value);
    }
    let res2 = await fetch("https://ezgif.com/webp-to-png/" + obj.file, {
      method: "POST",
      body: form2,
    });
    let html2 = await res2.text();
    console.log(html2);
    let { document: document2 } = new JSDOM(html2).window;
    return new URL(
      document2.querySelector("div#output > p.outfile > img").src,
      res2.url
    ).toString();
  },
  parseJid(text = "") {
    return [...text.matchAll(/@([0-9]{5,16}|0)/g)].map(
      (v) => v[1] + "@s.whatsapp.net"
    );
  },
  parsedJid(text = "") {
    return [...text.matchAll(/([0-9]{5,16}|0)/g)].map(
      (v) => v[1] + "@s.whatsapp.net"
    );
  },
  getLyrics,
  getJson,
  isIgUrl: (url) => {
    return /(?:(?:http|https):\/\/)?(?:www.)?(?:instagram.com|instagr.am|instagr.com)\/(\w+)/gim.test(
      url
    );
  },
  isUrl: (isUrl = (url) => {
    return new RegExp(
      /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/,
      "gi"
    ).test(url);
  }),
  getUrl: (getUrl = (url) => {
    return url.match(
      new RegExp(
        /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/,
        "gi"
      )
    );
  }),
  qrcode: async (string) => {
    const { toBuffer } = require("qrcode");
    let buff = await toBuffer(string);
    return buff;
  },
  aiImage,
  secondsToDHMS: (seconds) => {
    seconds = Number(seconds);

    const days = Math.floor(seconds / (3600 * 24));
    seconds %= 3600 * 24;

    const hours = Math.floor(seconds / 3600);
    seconds %= 3600;

    const minutes = Math.floor(seconds / 60);
    seconds %= 60;

    seconds = Math.floor(seconds);

    const parts = [];

    if (days) parts.push(`${days} Days`);
    if (hours) parts.push(`${hours} Hours`);
    if (minutes) parts.push(`${minutes} Minutes`);
    if (seconds) parts.push(`${seconds} Seconds`);
    return parts.join(" ");
  },
  formatBytes: (bytes, decimals = 2) => {
    if (!+bytes) return "0 Bytes";

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
  },
  sleep: delay,
  clockString: (duration) => {
    (seconds = Math.floor((duration / 1000) % 60)),
      (minutes = Math.floor((duration / (1000 * 60)) % 60)),
      (hours = Math.floor((duration / (1000 * 60 * 60)) % 24));

    hours = hours < 10 ? "0" + hours : hours;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;

    return hours + ":" + minutes + ":" + seconds;
  },
  runtime: () => {
    const duration = process.uptime();
    const seconds = Math.floor(duration % 60);
    const minutes = Math.floor((duration / 60) % 60);
    const hours = Math.floor((duration / (60 * 60)) % 24);

    const formattedTime = `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

    return formattedTime;
  },
  validateQuality :(quality) => {
    let valid = ["144p", "240p", "360p", "480p", "720p", "1080p"];
    return valid.includes(quality);
  },  
  AddMp3Meta: async (
    songbuffer,
    coverBuffer,
    options = { title: "X-Asena Whatsapp bot", artist: ["Xasena"] }
  ) => {
    if (!Buffer.isBuffer(songbuffer)) {
      songbuffer = await getBuffer(songbuffer);
    }
    if (!Buffer.isBuffer(coverBuffer)) {
      coverBuffer = await getBuffer(coverBuffer);
    }

    const writer = new id3(songbuffer);
    writer
      .setFrame("TIT2", options.title)
      .setFrame("TPE1", ["X-Asena"])
      .setFrame("APIC", {
        type: 3,
        data: coverBuffer,
        description: "Xasena",
      });

    writer.addTag();
    return Buffer.from(writer.arrayBuffer);
  },
  Bitly: async (url) => {
    return new Promise((resolve, reject) => {
      const BitlyClient = require("bitly").BitlyClient;
      const bitly = new BitlyClient("6e7f70590d87253af9359ed38ef81b1e26af70fd");
      bitly
        .shorten(url)
        .then((a) => {
          resolve(a);
        })
        .catch((A) => reject(A));
      return;
    });
  },
  isNumber: function isNumber() {
    const int = parseInt(this);
    return typeof int === "number" && !isNaN(int);
  },
  getRandom: function getRandom() {
    if (Array.isArray(this) || this instanceof String)
      return this[Math.floor(Math.random() * this.length)];
    return Math.floor(Math.random() * this);
  },
  findMusic: async function findMusic(buffer) {
    let acr = new acrcloud({
      host: "identify-eu-west-1.acrcloud.com",
      access_key: "4dcedd3dc6d911b38c988b872afa7e0d",
      access_secret: "U0PEUg2y6yGVh6NwJra2fJkiE1R5sCfiT6COLXuk",
    });

    let res = await acr.identify(buffer);
    let { code, msg } = res.status;
    if (code !== 0) return msg;
    let { title, artists, album, genres, release_date, external_metadata } =
      res.metadata.music[0];
    let { youtube, spotify } = external_metadata;

    return {
      status: 200,
      title: title,
      artists:
        artists !== undefined ? artists.map((v) => v.name).join(", ") : "",
      album: album.name || "",
      genres: genres !== undefined ? genres.map((v) => v.name).join(", ") : "",
      release_date: release_date,
      youtube: `https://www.youtube.com/watch?v=${youtube?.vid}`,
      spotify: `https://open.spotify.com/track/` + spotify?.track?.id,
    };
  },
  createInteractiveMessage,
  igdl,
  textToImg,
  readQr,
  m3u82Mp4,
  MimeTypes: function MimeTypes(mimeType) {
    const mimeToExtension = {
      'image/jpeg': 'jpg',
      'image/png': 'png',
      'image/gif': 'gif',
      'image/bmp': 'bmp',
      'image/webp': 'webp',
      'audio/mpeg': 'mp3',
      'audio/wav': 'wav',
      'audio/ogg': 'ogg',
      'video/mp4': 'mp4',
      'video/quicktime': 'mov',
      'video/x-msvideo': 'avi',
      'application/pdf': 'pdf',
    };
    if (mimeToExtension[mimeType]) {
      return mimeToExtension[mimeType];
    } else {
      return 'dat';
    }
  },
  UpdateLocal: async () => {
    async function checkAndInitializeGitRepo() {
      const isGitRepo = await git.checkIsRepo();
      if (!isGitRepo) {
          try {
              await git.init();
              await git.addRemote('origin', 'https://github.com/Alien-Alfa/WhatsBotAlfa-MD.git');
          } catch (error) {
              console.log('Error initializing git repository:', error);
              throw new Error('Failed to initialize git repository');
          }
      }
  }
  
  try {
      await checkAndInitializeGitRepo();
        await git.fetch();
      const commits = await git.main(['..origin/main']);
      if (commits.total === 0) {
          await console.log('_Bot up to date_');
      } else {
          await console.log('_Started update.._');
          await new Promise((resolve, reject) => {
              exec('git pull origin main', (error, stdout, stderr) => {
                  error ? reject(error) : resolve(stdout);
              });
          });
          await console.log('_Successfully updated_');
          await console.log('_Restarting_');
          await process.send("reset");
      }
  } catch(error) {
      console.log('Error during update:', error);
      await console.log( '_Update failed_');
  }
    },
    fromMe: async function fromMe(jid) {
      try {
          let creds = require("../session/creds.json");
  
          if (!creds || !creds.me || !creds.me.id) {
              console.error("Credentials file or 'me' property not found.");
              return false;
          }
  
          let num = creds.me.id.split(":")[0];
          if (num === jid.split("@")[0]) {
              return true;
          } else {
              return false;
          }
      } catch (error) {
          console.error("Error in 'fromMe' function:", error);
          return false;
      }
  },
};














































 