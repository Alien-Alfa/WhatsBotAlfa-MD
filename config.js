// Made with ❤ by AlienAlfa
const { Sequelize } = require("sequelize");
const mongoose = require("mongoose");
const fs = require("fs");
require("dotenv").config();

const toBool = (x) => x === "true";
const DATABASE_URL = process.env.DATABASE_URL || "./assets/database.db";

// MongoDB Configuration
const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URI || null;
const USE_MONGODB = toBool(process.env.USE_MONGODB) || false;

const config = {
//============================================================================================================================================
  ANTILINK: toBool(process.env.ANTI_LINK) || false,
//-------------------------------------------------------------------------------------------------------------------------------------------
  LOGS: toBool(process.env.LOGS) || true,
//-------------------------------------------------------------------------------------------------------------------------------------------
  SIMPLE_LOGS: toBool(process.env.SIMPLE_LOGS) || false,
//-------------------------------------------------------------------------------------------------------------------------------------------
  LOG_MESSAGE: toBool(process.env.LOG_MESSAGE) || false,
//-------------------------------------------------------------------------------------------------------------------------------------------
  ANTILINK_ACTION: process.env.ANTILINK_ACTION || "kick",
//-------------------------------------------------------------------------------------------------------------------------------------------
  SESSION_ID: process.env.SESSION_ID || "",
//-------------------------------------------------------------------------------------------------------------------------------------------
  LANG: process.env.LANG || "EN",
//-------------------------------------------------------------------------------------------------------------------------------------------
  AUTH_TOKEN: process.env.AUTH_TOKEN || "",
//-------------------------------------------------------------------------------------------------------------------------------------------
  HANDLERS: process.env.HANDLER === "false" || process.env.HANDLER === "null" || process.env.HANDLER === undefined ? "^" : process.env.HANDLER,
//-------------------------------------------------------------------------------------------------------------------------------------------
  RMBG_KEY: process.env.RMBG_KEY || false,
//-------------------------------------------------------------------------------------------------------------------------------------------
  BRANCH: process.env.BRANCH || "master",
//-------------------------------------------------------------------------------------------------------------------------------------------
  HEROKU_GIT_URL: process.env.HEROKU_GIT_URL || "",
//-------------------------------------------------------------------------------------------------------------------------------------------
  STALE_MESSAGE_GRACE: parseInt(process.env.STALE_MESSAGE_GRACE, 10) || 60000,
//-------------------------------------------------------------------------------------------------------------------------------------------
  WARN_COUNT: parseInt(process.env.WARN_COUNT) || 3,
//-------------------------------------------------------------------------------------------------------------------------------------------
  WELCOME_MSG: process.env.WELCOME_MSG || "Hi @user Welcome to @gname",
//-------------------------------------------------------------------------------------------------------------------------------------------
  GOODBYE_MSG: process.env.GOODBYE_MSG || "@user Left The Group",
//-------------------------------------------------------------------------------------------------------------------------------------------
  PACKNAME: process.env.PACKNAME || "𝞓𝙇𝞘𝞢𝞜",
//-------------------------------------------------------------------------------------------------------------------------------------------
  AUTHOR: process.env.AUTHOR || "𝞓𝙇𝙁𝞓",
//-------------------------------------------------------------------------------------------------------------------------------------------
  SUDO: process.env.SUDO || "0",
//-------------------------------------------------------------------------------------------------------------------------------------------
  HEROKU_APP_NAME: process.env.HEROKU_APP_NAME || "",
//-------------------------------------------------------------------------------------------------------------------------------------------
  HEROKU_API_KEY: process.env.HEROKU_API_KEY || "",
//-------------------------------------------------------------------------------------------------------------------------------------------
  OWNER_NAME: process.env.OWNER_NAME || "𝞓𝙇𝞘𝞢𝞜-𝞓𝙇𝙁𝞓",
//-------------------------------------------------------------------------------------------------------------------------------------------
  HEROKU: toBool(process.env.HEROKU) || false,
//-------------------------------------------------------------------------------------------------------------------------------------------
  BOT_NAME: process.env.BOT_NAME || "𝗔𝗨𝗥𝗢𝗥𝗔",
//-------------------------------------------------------------------------------------------------------------------------------------------
  WORK_TYPE: process.env.WORK_TYPE || "private",
//-------------------------------------------------------------------------------------------------------------------------------------------
  SESSION_URL: process.env.SESSION_URL || "",
//-------------------------------------------------------------------------------------------------------------------------------------------
  DELETED_LOG_CHAT: process.env.DELETED_LOG_CHAT || "",
//-------------------------------------------------------------------------------------------------------------------------------------------
  DELETED_LOG: toBool(process.env.DELETED_LOG) || false,
//-------------------------------------------------------------------------------------------------------------------------------------------
  GEMINI_API: process.env.GEMINI_API || false,
//-------------------------------------------------------------------------------------------------------------------------------------------
  AUTO_READ: toBool(process.env.AUTO_READ) || false,
//-------------------------------------------------------------------------------------------------------------------------------------------
  AUTO_STATUS_READ: toBool(process.env.AUTO_STATUS_READ) || false,
//-------------------------------------------------------------------------------------------------------------------------------------------
  ALLOW_ALL_CALLS: toBool(process.env.ALLOW_ALL_CALLS) || false,
//-------------------------------------------------------------------------------------------------------------------------------------------
  REMOVEBG: process.env.RMBG_KEY || false,
//-------------------------------------------------------------------------------------------------------------------------------------------
  // Database Configuration
  USE_MONGODB: USE_MONGODB,
  MONGODB_URI: MONGODB_URI,
  DATABASE_URL: DATABASE_URL,
//============================================================================================================================================
};

// ---------------------------------------------------------------------------
// Dashboard overrides (session/config-overrides.json) win over env vars.
// Edited live from the localhost dashboard -> applied to this very object at
// runtime by index.js, and re-loaded on every boot from here.
// ---------------------------------------------------------------------------
try {
  const { loadOverrides, sanitizeOverrides } = require("./lib/configSchema");
  const res = sanitizeOverrides(loadOverrides());
  if (res.ok) Object.assign(config, res.values);
} catch (e) {
  // Never let override loading break the bot config
}

if (config.RMBG_KEY) config.REMOVEBG = config.RMBG_KEY;

// Construct the database after dashboard overrides are loaded so DATABASE_URL
// and USE_MONGODB-related settings are consistent from the start of the worker.
config.DATABASE = config.DATABASE_URL === "./assets/database.db"
  ? new Sequelize({
      dialect: "sqlite",
      storage: config.DATABASE_URL,
      logging: false,
      define: { freezeTableName: true, timestamps: true },
      pool: { max: 1, min: 0, acquire: 30000, idle: 10000 },
      dialectOptions: {
        // SQLITE_BUSY hardening: without a busy timeout a locked DB file
        // makes reads/writes FAIL OR HANG, which used to wedge the message
        // pipeline (bot "connected" but deaf). WAL also removes the
        // reader-blocks-writer contention that caused the locks.
        //   busy_timeout: wait up to 5s for the lock instead of erroring
        //   journal_mode WAL: concurrent readers never block the writer
        busy_timeout: 5000
      }
    })
  : new Sequelize(config.DATABASE_URL, {
      dialect: "postgres",
      ssl: true,
      protocol: "postgres",
      dialectOptions: {
        native: true,
        ssl: { require: true, rejectUnauthorized: false },
      },
      logging: false,
      define: { freezeTableName: true, timestamps: true },
      pool: { max: 10, min: 0, acquire: 30000, idle: 10000 }
    });

// SQLite-specific durability + concurrency pragmas. WAL mode is the single
// biggest stability fix for a file-backed bot DB: it lets the message
// pipeline write while reads happen, eliminating the SQLITE_BUSY storms that
// previously froze message processing. Applied right after construction and
// again lazily on first use (some hosts reset pragmas on reconnect).
if (config.DATABASE_URL === "./assets/database.db" && config.DATABASE) {
  try {
    config.DATABASE.query("PRAGMA journal_mode = WAL;");
    config.DATABASE.query("PRAGMA busy_timeout = 5000;");
    config.DATABASE.query("PRAGMA synchronous = NORMAL;");
    config.DATABASE.query("PRAGMA cache_size = -8000;"); // 8MB page cache
    config.DATABASE.query("PRAGMA wal_autocheckpoint = 512;");
  } catch (e) {
    // Pragmas are best-effort; the bot works without them, just less robustly
  }
}

module.exports = config;
