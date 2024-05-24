const { command, commands } = require("./plugins");
let config = require("../config");
const axios = require("axios");
const cheerio = require("cheerio");
const OpenAI = require("openai");
const openai_api = "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";
const openai = new OpenAI({ apiKey: openai_api });

const pm2 = require("pm2");

const {
  getBuffer,
  decodeJid,
  parseJid,
  parsedJid,
  getJson,
  isIgUrl,
  isUrl,
  getUrl,
  qrcode,
  secondsToDHMS,
  igdl,
  formatBytes,
  sleep,
  clockString,
  runtime,
  AddMp3Meta,
  Mp3Cutter,
  Bitly,
  isNumber,
  getRandom,
  findMusic,
  WriteSession,
  toAudio,
  isAdmin,
  fromMe,
  MimeTypes,
} = require("./functions");
const { serialize, downloadMedia } = require("./serialize");
const Greetings = require("./Greetings");;
async function getMemoryUsage() {
  const memoryUsage = process.memoryUsage();
  const usedMemory = memoryUsage.heapUsed;
  const totalMemory = memoryUsage.heapTotal;
  const percentageUsed = ((usedMemory / totalMemory) * 100).toFixed(2);

  const formattedUsedMemory = formatBytes(usedMemory);
  const formattedTotalMemory = formatBytes(totalMemory);

  let stackInfo = '';
  if (memoryUsage.stackTotal !== undefined && memoryUsage.stackUsed !== undefined) {
    const formattedStackTotal = formatBytes(memoryUsage.stackTotal);
    const formattedStackUsed = formatBytes(memoryUsage.stackUsed);
    stackInfo = `
  Stack Total: ${formattedStackTotal}
  Stack Used: ${formattedStackUsed}`;
  }

  const memoryUsageText = `Memory Usage:
Total Memory: ${formattedTotalMemory}
Used Memory: ${formattedUsedMemory} (${percentageUsed}%)
External: ${formatBytes(memoryUsage.external)}
Array Buffers: ${formatBytes(memoryUsage.arrayBuffers)}
Allocated: ${formatBytes(totalMemory - usedMemory)}${stackInfo}`;

  return memoryUsageText;
  
}
module.exports = {
  toAudio,
  isPrivate: config.WORK_TYPE.toLowerCase() === "private",
  Greetings,
  isAdmin,
  serialize,
  downloadMedia,
  Function: command,
  command,
  commands,
  getBuffer,
  WriteSession,
  decodeJid,
  parseJid,
  parsedJid,
  getJson,
  isIgUrl,
  isUrl,
  getUrl,
  qrcode,
  secondsToDHMS,
  formatBytes,
  igdl, 
  sleep,
  clockString,
  runtime,
  AddMp3Meta,
  Mp3Cutter,
  Bitly,
  isNumber,
  getRandom,
  findMusic,
  fromMe,
  MimeTypes,
  getMemoryUsage,
};
