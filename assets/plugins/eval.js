const {
  Greetings,
  isAdmin,
  serialize,
  downloadMedia,
  Function,
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
  sleep,
  clockString,
  runtime,
  AddMp3Meta,
  Mp3Cutter,
  Bitly,
  isNumber,
  getRandom,
  findMusic,
  AItts,
  toAudio,
  pm2Uptime,
  start,
} = require("../../lib/");

const {
  saveMessage,
  loadMessage,
  saveChat,
  getName,
} = require("../database/StoreDb");

const { yta, ytv, ytdlDl, ytdlget, formatYtdata } = require("../../lib/ytdl");
const util = require("util");
const config = require("../../config");
const { delay } = require("@whiskeysockets/baileys");
const { exec } = require('child_process');

// JavaScript evaluation
Function(
  { 
    on: "text", 
    fromMe: true, 
    desc: "Evaluate JavaScript code", 
    type: "owner", 
    dontAddCommandList: true 
  },
  async (message, match, m, client, msg) => {
    if (message.text.startsWith(">")) {
      const conn = message.client;
      const json = (x) => JSON.stringify(x, null, 2);
      const client = conn;
      
      try {
        const code = message.text.replace(">", "").trim();
        if (!code) return await message.reply("_Please provide code to evaluate_");
        
        let evaled = await eval(code);
        if (typeof evaled !== "string") {
          evaled = require("util").inspect(evaled);
        }
        
        // Limit output length to prevent spam
        if (evaled.length > 4000) {
          evaled = evaled.substring(0, 4000) + "...\n\n_Output truncated_";
        }
        
        await message.reply("```javascript\n" + evaled + "\n```");
      } catch (err) {
        await message.reply("```\n" + util.format(err) + "\n```");
      }
    }
  }
);

// Async JavaScript evaluation
Function(
  { 
    on: "text", 
    fromMe: true, 
    desc: "Evaluate async JavaScript code", 
    type: "owner", 
    dontAddCommandList: true 
  },
  async (message, match, m, client, msg) => {
    if (message.text.startsWith("<")) {
      const conn = message.client;
      const client = conn;
      const util = require("util");
const logger = require("../../lib/logger");
      const json = (x) => JSON.stringify(x, null, 2);
      
      try {
        const code = message.text.replace("<", "").trim();
        if (!code) return await message.reply("_Please provide code to evaluate_");
        
        let return_val = await eval(`(async () => { ${code} })()`);
        
        if (return_val && typeof return_val !== "string") {
          return_val = util.inspect(return_val);
        }
        
        if (return_val) {
          // Limit output length
          if (return_val.length > 4000) {
            return_val = return_val.substring(0, 4000) + "...\n\n_Output truncated_";
          }
          await message.reply("```javascript\n" + return_val + "\n```");
        } else {
          await message.reply("_No return value_");
        }
      } catch (e) {
        await message.reply("```\n" + util.format(e) + "\n```");
      }
    }
  }
);

// Shell command execution
Function(
  { 
    on: "text", 
    fromMe: true, 
    desc: "Execute shell commands", 
    type: "owner", 
    dontAddCommandList: true 
  },
  async (message, match, m, client, msg) => {
    if (message.text.startsWith("$")) {
      try {
        const command = message.text.replace("$", "").trim();
        if (!command) return await message.reply("_Please provide a command to execute_");
        
        exec(command, { timeout: 30000 }, async (error, stdout, stderr) => {
          if (error) {
            return await message.reply(`❌ *Error:*\n\`\`\`\n${error.message}\n\`\`\``);
          }
          
          if (stderr) {
            return await message.reply(`⚠️ *Stderr:*\n\`\`\`\n${stderr}\n\`\`\``);
          }
          
          if (stdout) {
            // Limit output length
            let output = stdout;
            if (output.length > 4000) {
              output = output.substring(0, 4000) + "...\n\n_Output truncated_";
            }
            return await message.reply(`✅ *Output:*\n\`\`\`\n${output}\n\`\`\``);
          } else {
            return await message.reply("_Command executed successfully (no output)_");
          }
        });
        
      } catch (e) {
        await message.reply(`❌ *Error:*\n\`\`\`\n${util.format(e)}\n\`\`\``);
      }
    }
  }
);

// Made with ❤ by AlienAlfa

