const toBool = (x) => x == 'true'
const { Sequelize } = require('sequelize')
const { existsSync } = require('fs')
if (existsSync('config.env')) require('dotenv').config({ path: './config.env' })
const DATABASE_URL = process.env.DATABASE_URL === undefined ? './database.db' : process.env.DATABASE_URL
module.exports = {
  VERSION: require('./package.json').version,
  LOGS: toBool(process.env.LOGS) || true,
  ALWAYS_ONLINE: toBool(process.env.ALWAYS_ONLINE),
  IMGBB_KEY: ["76a050f031972d9f27e329d767dd988f","deb80cd12ababea1c9b9a8ad6ce3fab2","78c84c62b32a88e86daf87dd509a657a"],
  ALIVE_LOGO: process.env.ALIVE_LOGO || "https://i.imgur.com/c9CNgT5.jpeg",
  SESSION_ID:process.env.SESSION_ID || false,
  ANTILINK: toBool(process.env.ANTI_LINK) || false,
  ANTILINK_ACTION: process.env.ANTI_LINK || "kick",
  MDB: process.env.MDB || "mongodb+srv://tshephang:ducky1@ducky.ummj1kc.mongodb.net/?retryWrites=true&w=majority",
  LANG: process.env.LANG ||  'EN',
  HANDLERS: process.env.HANDLERS === 'false' || process.env.HANDLER === 'null' ? '^': '^',
  RMBG_KEY: process.env.RMBG_KEY || false,
  BRANCH: "master",
  PACKNAME: process.env.PACKNAME || "𝞓𝙇𝞘𝞢𝞜-𝞓𝙇𝙁𝞓",
  AUTHOR: process.env.AUTHOR || "𝑇𝑠ℎ𝑒𝑝ℎ𝑎𝑛𝑔\n𝞓𝙇𝞘𝞢𝞜-𝞓𝙇𝙁𝞓",
  DATABASE: DATABASE_URL === './database.db' ? new Sequelize({ dialect: 'sqlite', storage: DATABASE_URL, logging: false }) : new Sequelize(DATABASE_URL, {dialect: 'postgres', ssl: true, protocol: 'postgres', dialectOptions: { native: true, ssl: { require: true, rejectUnauthorized: false },}, logging: false }),
  BOT_INFO: process.env.BOT_INFO || 'Aurora;Tshephang/AlienAlfa;0;https://github.com/Alien-Alfa/Alien-alfa/blob/beta/Alfa.jpg?raw=true',
  SUDO: process.env.SUDO || "919383400679,27630425578",
  HEROKU_APP_NAME: process.env.HEROKU_APP_NAME || " ",
  HEROKU_API_KEY: process.env.HEROKU_API_KEY || " ",
  OWNER_NAME: process.env.OWNER_NAME || "𝞓𝙇𝞘𝞢𝞜-𝞓𝙇𝙁𝞓",
  BOT_NAME: process.env.BOT_NAME || "𝗔𝗨𝗥𝗢𝗥𝗔",
  WORK_TYPE: process.env.WORK_TYPE || "private",
};
