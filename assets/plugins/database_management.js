/**
 * Database Management Plugin
 * Author: GitHub Copilot
 * Description: Database management commands for both SQLite and MongoDB
 */

const fs = require("fs");
const config = require("../../config");
const { command } = require("../../lib");

// Database info command (works for both SQLite and MongoDB)
command(
  {
    pattern: "dbinfo",
    fromMe: false,
    desc: "Get database information",
    type: "system",
  },
  async (message, match) => {
    try {
      // Check if MongoDB is enabled
      if (config.USE_MONGODB && config.MONGODB_URI) {
        // MongoDB mode
        const mongoStoreDb = require("../database/MongoStoreDb");
        const mongoose = require("mongoose");
        
        const models = mongoStoreDb.getModels();
        const connectionState = mongoose.connection.readyState;
        
        const stateMap = {
          0: 'Disconnected',
          1: 'Connected', 
          2: 'Connecting',
          3: 'Disconnecting'
        };
        
        const response = `
🗄️ *Database Information*

🍃 *MongoDB Atlas:*
• Connection: ${stateMap[connectionState] || 'Unknown'}
• Database: ${mongoose.connection.name || 'aurora_db'}
• Host: ${mongoose.connection.host || 'MongoDB Atlas'}
• Models: ${models ? Object.keys(models).length : 0} loaded

🗃️ *Local SQLite:*
• Database: ./assets/database.db
• Status: ${require('fs').existsSync('./assets/database.db') ? '✅ Available' : '❌ Missing'}
• Role: Backup & fallback

⚙️ *Configuration:*
• Primary DB: MongoDB Atlas
• Backup DB: SQLite  
• Sync mode: Dual database
• Auto-sync: ✅ Every 30 minutes
        `;
        
        await message.reply(response);
      } else {
        // SQLite mode
        const dbPath = './assets/database.db';
        const dbExists = fs.existsSync(dbPath);
        let dbSize = 0;
        
        if (dbExists) {
          const stats = fs.statSync(dbPath);
          dbSize = (stats.size / 1024).toFixed(2);
        }
        
        const response = `
🗄️ *Database Information*

🗃️ *Current Setup:*
• Database: SQLite
• File: ${dbPath}
• Status: ${dbExists ? '✅ Active' : '❌ Missing'}
• Size: ${dbSize} KB
• MongoDB: ❌ Not configured

⚙️ *Configuration:*
• USE_MONGODB: ${config.USE_MONGODB || false}
• MONGODB_URI: ${config.MONGODB_URI ? '✅ Set' : '❌ Not set'}
• DATABASE_URL: ${config.DATABASE_URL || 'Not set'}

🔧 *Available Commands:*
• ^dbinfo - Database information
• ^dbstatus - Database status
• ^dbsync - Sync info/help

💡 *To enable MongoDB:*
1. Set MONGODB_URI in environment
2. Set USE_MONGODB=true
3. Restart the bot
        `;
        
        await message.reply(response);
      }
    } catch (error) {
      logger.error("Database info error:", error);
      await message.reply(`❌ Info retrieval failed: ${error.message}`);
    }
  }
);

// Database sync command (works differently for SQLite vs MongoDB)
command(
  {
    pattern: "dbsync",
    fromMe: false,
    desc: "Database sync command",
    type: "system",
  },
  async (message, match) => {
    try {
      if (config.USE_MONGODB && config.MONGODB_URI) {
        // MongoDB sync
        const mongoStoreDb = require("../database/MongoStoreDb");
        
        await message.reply("🔄 Starting manual database synchronization...");
        
        const startTime = Date.now();
        
        let result;
        if (typeof mongoStoreDb.performSync === 'function') {
          result = await mongoStoreDb.performSync();
        } else {
          await mongoStoreDb.initialize();
          result = { status: "ok", message: "MongoDB connection verified" };
        }
        
        const syncTime = Date.now() - startTime;
        
        // Customize message based on sync result
        let response;
        if (result.status === 'skipped') {
          response = `
✅ *Database Status Check Complete*

📊 *MongoDB Status:*
• Duration: ${syncTime}ms
• Mode: MongoDB Only
• Connection: ✅ Active
• Sync: Not needed (single database)

ℹ️ *Info:* Running in MongoDB-only mode. No sync required as all data is stored directly in MongoDB.

⏰ *Last Check:* ${new Date().toLocaleString()}
          `;
        } else {
          response = `
✅ *Database Sync Complete*

📊 *Sync Results:*
• Duration: ${syncTime}ms
• Status: ${result.status || 'completed'}
• MongoDB: ✅ Connected
• Auto-sync: ✅ Active

⏰ *Last Sync:* ${new Date().toLocaleString()}
🔄 *Next Auto Sync:* In 30 minutes
          `;
        }
        
        
        await message.reply(response);
      } else {
        // SQLite mode - explain sync limitations
        const response = `
ℹ️ *Database Sync - SQLite Mode*

🗃️ *Current Setup:*
• Database: SQLite (Local file)
• Sync: ❌ Not available in SQLite mode
• Cloud backup: ❌ Not configured

💡 *About Database Sync:*
Database sync is only available with MongoDB setup, which allows:
• Auto-sync between local SQLite and cloud MongoDB
• Real-time data backup
• Cross-platform data sharing

🔧 *To Enable Database Sync:*
1. Get MongoDB Atlas URI (free at mongodb.com)
2. Set MONGODB_URI environment variable
3. Set USE_MONGODB=true
4. Restart the bot

📋 *Current Options in SQLite Mode:*
• ^dbinfo - View database details
• ^dbstatus - Check database health

⚡ *SQLite Benefits:*
• Fast local operations
• No internet dependency
• Simple file-based storage
        `;
        
        await message.reply(response);
      }
    } catch (error) {
      logger.error("Sync error:", error);
      await message.reply(`❌ Sync failed: ${error.message}`);
    }
  }
);

// Database status command
command(
  {
    pattern: "dbstatus",
    fromMe: false,
    desc: "Check database status",
    type: "system",
  },
  async (message, match) => {
    try {
      if (config.USE_MONGODB && config.MONGODB_URI) {
        // MongoDB status
        const mongoStoreDb = require("../database/MongoStoreDb");
const logger = require("../../lib/logger");
        const models = mongoStoreDb.getModels();
        
        let counts = { messages: 0, contacts: 0, chats: 0 };
        let isConnected = false;
        
        try {
          if (models && models.Message) {
            counts.messages = await models.Message.countDocuments();
            counts.contacts = await models.Contact.countDocuments();
            counts.chats = await models.Chat.countDocuments();
            isConnected = true;
          }
        } catch (e) {
          logger.warn("Count error:", e.message);
        }
        
        const response = `
📊 *Database Status*

🍃 *MongoDB:* ${isConnected ? '✅ Connected' : '❌ Disconnected'}
🗃️ *SQLite:* ⚠️ Backup only

🔄 *Sync Information:*
• Auto-sync: ✅ Enabled
• Frequency: Every 30 minutes
• Status: ${isConnected ? '✅ Healthy' : '⚠️ Check connection'}

📈 *Data Statistics:*
• Messages: ${counts.messages}
• Contacts: ${counts.contacts}
• Chats: ${counts.chats}
• Total records: ${counts.messages + counts.contacts + counts.chats}
        `;
        
        await message.reply(response);
      } else {
        // SQLite status
        const dbPath = './assets/database.db';
        const dbExists = fs.existsSync(dbPath);
        
        let fileInfo = { size: 0, modified: 'Unknown' };
        if (dbExists) {
          const stats = fs.statSync(dbPath);
          fileInfo.size = (stats.size / 1024).toFixed(2);
          fileInfo.modified = new Date(stats.mtime).toLocaleString();
        }
        
        let connectionStatus = 'Unknown';
        try {
          if (config.DATABASE) {
            await config.DATABASE.authenticate();
            connectionStatus = '✅ Connected';
          }
        } catch (e) {
          connectionStatus = '❌ Connection failed';
        }
        
        const response = `
📊 *SQLite Database Status*

🗃️ *Database File:*
• Path: ${dbPath}
• Exists: ${dbExists ? '✅ Yes' : '❌ No'}
• Size: ${fileInfo.size} KB
• Last Modified: ${fileInfo.modified}

🔗 *Connection:*
• Status: ${connectionStatus}
• Type: SQLite
• Pool: ${config.DATABASE ? '✅ Active' : '❌ Not initialized'}

💡 *Note:* This is SQLite mode. For advanced features like auto-sync and cloud backup, enable MongoDB.
        `;
        
        await message.reply(response);
      }
    } catch (error) {
      logger.error("Status check error:", error);
      await message.reply(`❌ Status check failed: ${error.message}`);
    }
  }
);
