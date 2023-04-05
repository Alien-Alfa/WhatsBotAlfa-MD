/* Copyright (C) 2022 Alien-Alfa.

Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.

Alien-Alfa Alien-Alfa
*/
const fs = require("fs");
let req = JSON.parse(fs.readFileSync('./database/settings.json'));

const { Sequelize } = require("sequelize");
const conf = require('../config')
if (fs.existsSync("config.env")) require("dotenv").config({ path: "./config.env" });

const toBool = (x) => x == "true";

DATABASE_URL = process.env.DATABASE_URL || "./lib/database.db";
let HANDLER = "";

module.exports = {
  DATABASE_URL: DATABASE_URL,
  DATABASE:DATABASE_URL === "./lib/database.db"? new Sequelize({dialect: "sqlite",storage: DATABASE_URL,logging: false,}): new Sequelize(DATABASE_URL, {dialect: "postgres",ssl: true,protocol: "postgres",dialectOptions: {native: true,ssl: { require: true, rejectUnauthorized: false },},logging: false,}),
    
  LOGS: req.config.LOGS  === "" ? true :  req.config.LOGS,
  ANTILINK_ACTION: req.config.ANTILINK_ACTION  === "" ? "ban" :  req.config.ANTILINK_ACTION,
  SESSION_ID: process.env.SESSION_ID || req.config.SESSION_ID,
  LANG: req.config.LANG  === "" ? "EN" :  req.config.LANG,
  HANDLERS: req.config.HANDLER === "" ? "^" : req.config.HANDLER,
  RMBG_KEY: req.config.RMBG_KEY  === "" ? false :  req.config.RMBG_KEY,
  BRANCH: process.env.BRANCH  === "" ? "latest" : process.env.BRANCH,
  PACKNAME: req.config.PACKNAME  === "" ? "Aurora" :  req.config.PACKNAME ,
  WELCOME_MSG: req.MESSAGE_MEM.WELCOME_MSG  === "" ? "Hi @user Welcome to @gname" : req.MESSAGE_MEM.WELCOME_MSG,
  GOODBYE_MSG: req.MESSAGE_MEM.GOODBYE_MSG  === "" ? "Hi @user It was Nice Seeing you" : req.MESSAGE_MEM.GOODBYE_MSG,
  AUTHOR: req.config.AUTHOR  === "" ? "Alien-Alfa" :  req.config.AUTHOR,
  SUDO: req.config.SUDO  === "" ? "" :  req.config.SUDO,
  HEROKU_APP_NAME: req.config.HEROKU_APP_NAME  === "" ? "^" :  process.env.HEROKU_APP_NAME,
  HEROKU_API_KEY: req.config.HEROKU_API_KEY  === "" ? "^" :  process.env.HEROKU_API_KEY,
  OWNER_NAME: req.config.OWNER_NAME  === "" ? "Alien-Alfa" :  req.config.OWNER_NAME,
  BOT_NAME: req.config.BOT_NAME  === "" ? "Aurora" :  req.config.BOT_NAME,
  WORK_TYPE: req.config.WORK_TYPE  === "" ?  "private" : req.config.WORK_TYPE,
  MODE: req.config.MODE  === "" ? "private" : req.config.MODE,
  ALIVE: req.MESSAGE_MEM.ALIVE  === "" ? "```I am active```" : req.MESSAGE_MEM.ALIVE,
  DB_AUTH_TOKEN: req.config.DB_AUTH_TOKEN  === "" ? false : req.config.DB_AUTH_TOKEN,
  MENTION_AUD: req.config.MENTION_AUD  === "" || [] ? "https://i.imgur.com/2nEwQLy.mp4,https://i.imgur.com/lDZOEHl.mp4,https://i.imgur.com/WxQbgOU.mp4,https://i.imgur.com/BVypaUc.mp4,https://i.imgur.com/L9Jnpt5.mp4,https://i.imgur.com/3Te73pm.mp4,https://i.imgur.com/gkzBe1X.mp4,https://i.imgur.com/aEpNAtl.mp4,https://i.imgur.com/JiuFyXy.mp4,https://i.imgur.com/jEVzyWS.mp4,https://i.imgur.com/1npmJY6.mp4" : req.config.MENTION_AUD,
  MENTION_IMG: req.config.MENTION_IMG  === "https://i.imgur.com/0IaPsiM.jpeg,https://i.imgur.com/MIJv3kT.jpeg" ? false : req.config.MENTION_IMG,
  MENTION: req.settings.MENTION  === [] ? false : req.settings.MENTION,

  FOOTER:  req.config.FOOTER  === "" ?  "Alien-Alfa" : req.config.FOOTER,
  THEME: req.config.THEME  === "" ?  "alfa" : req.config.THEME,
  FONT_STYLE: req.config.FONT_STYLE  === "" ? "1" : req.config.FONT_STYLE,
  LANGUAGE: req.config.LANGUAGE  === "" ? "EN" :  req.config.LANGUAGE, 
  INTERNAL_MENU: req.config.INTERNAL_MENU  === "" ? "active" :  req.config.INTERNAL_MENU,
  STORAGE_JID: req.config.STORAGE_JID  === "" ? "" :  req.config.STORAGE_JID,

  B1:req.config.B1  === "" ? '╭════〘 ' :  req.config.B1,
  B2:req.config.B2  === "" ? ' 〙════⊷❍' :  req.config.B2,
  B3:req.config.B3  === "" ? '┃✧╭─────────────────' :  req.config.B3,
  B4:req.config.B4  === "" ? '┃✧│' :  req.config.B4,
  B5:req.config.B5  === "" ? "┃✧╰─────────────────\n╰══════════════════⊷❍" :  req.config.B5,

  KOYEB_APP_NAME: process.env.KOYEB_APP_NAME || "",
  KOYEB_API_KEY:process.env.KOYEB_API_KEY || "",



};
