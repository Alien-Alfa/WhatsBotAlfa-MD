/**
 * Database Sync Plugin - Manual sync controls for MongoDB ↔ SQLite
 * Author: GitHub Copilot
 * Description: Provides manual sync commands and status monitoring
 */

const config = require("../../config");
const { cmd } = require("../../lib/plugins");

// Only register commands if MongoDB is enabled
if (config.USE_MONGODB && config.MONGODB_URI) {
  
  // Manual sync command
  cmd(
    {
      pattern: "dbsync",
      desc: "Manually trigger database synchronization",
      category: "system",
      use: ".dbsync",
      filename: __filename,
    },
    async (conn, mek, m, { from, isOwner, reply }) => {
      if (!isOwner) return reply("❌ This command is only for bot owners!");
      
      try {
        const mongoStoreDb = require("../database/MongoStoreDb");
        
        await reply("🔄 Starting manual database synchronization...");
        
        const startTime = Date.now();
        const result = await mongoStoreDb.forceSyncNow();
        const syncTime = Date.now() - startTime;
        
        const response = `
✅ *Database Sync Complete*

📊 *Sync Results:*
• Duration: ${syncTime}ms
• MongoDB → SQLite: ${result.mongoToSqlite.synced} records
• SQLite → MongoDB: ${result.sqliteToMongo.synced} records
• Conflicts resolved: ${result.conflicts || 0}
• Errors: ${result.errors || 0}

⏰ *Last Sync:* ${new Date().toISOString()}
🔄 *Next Auto Sync:* ${result.nextSync || 'In 30 minutes'}
        `;
        
        await reply(response);
        
      } catch (error) {
        console.error("Manual sync error:", error);
        await reply(`❌ Sync failed: ${error.message}`);
      }
    }
  );

  // Sync status command
  cmd(
    {
      pattern: "dbstatus",
      desc: "Check database synchronization status",
      category: "system", 
      use: ".dbstatus",
      filename: __filename,
    },
    async (conn, mek, m, { from, isOwner, reply }) => {
      if (!isOwner) return reply("❌ This command is only for bot owners!");
      
      try {
        const mongoStoreDb = require("../database/MongoStoreDb");
        const stats = mongoStoreDb.getSyncStats();
        
        const response = `
📊 *Database Sync Status*

🍃 *MongoDB:* ${stats.mongodb.connected ? '✅ Connected' : '❌ Disconnected'}
🗃️ *SQLite:* ${stats.sqlite.connected ? '✅ Connected' : '❌ Disconnected'}

🔄 *Sync Information:*
• Auto-sync: ${stats.autoSync ? '✅ Enabled' : '❌ Disabled'}
• Frequency: Every 30 minutes
• Last sync: ${stats.lastSync || 'Never'}
• Next sync: ${stats.nextSync || 'Unknown'}

📈 *Statistics:*
• Total syncs: ${stats.totalSyncs || 0}
• Successful syncs: ${stats.successfulSyncs || 0}
• Failed syncs: ${stats.failedSyncs || 0}
• Records synced: ${stats.recordsSynced || 0}

🎯 *Sync Mode:* ${stats.syncMode || 'Bidirectional'}
⚡ *Performance:* ${stats.averageSyncTime || 'Unknown'}ms avg
        `;
        
        await reply(response);
        
      } catch (error) {
        console.error("Status check error:", error);
        await reply(`❌ Status check failed: ${error.message}`);
      }
    }
  );

  // Database info command
  cmd(
    {
      pattern: "dbinfo",
      desc: "Get detailed database information",
      category: "system",
      use: ".dbinfo",
      filename: __filename,
    },
    async (conn, mek, m, { from, isOwner, reply }) => {
      if (!isOwner) return reply("❌ This command is only for bot owners!");
      
      try {
        const mongoStoreDb = require("../database/MongoStoreDb");
        const info = await mongoStoreDb.getDatabaseInfo();
        
        const response = `
🗄️ *Database Information*

🍃 *MongoDB:*
• Database: ${info.mongodb.database || 'Unknown'}
• Collections: ${info.mongodb.collections || 0}
• Total docs: ${info.mongodb.totalDocuments || 0}
• Size: ${info.mongodb.size || 'Unknown'}

🗃️ *SQLite:*
• Database: ${info.sqlite.database || 'Unknown'}
• Tables: ${info.sqlite.tables || 0}
• Total rows: ${info.sqlite.totalRows || 0}
• Size: ${info.sqlite.size || 'Unknown'}

⚙️ *Configuration:*
• Sync enabled: ${config.USE_MONGODB ? '✅' : '❌'}
• MongoDB URI: ${config.MONGODB_URI ? '✅ Set' : '❌ Not set'}
• Default DB: ${config.USE_MONGODB ? 'MongoDB' : 'SQLite'}

🔄 *Sync Health:*
• Status: ${info.syncHealth || 'Unknown'}
• Data consistency: ${info.dataConsistency || 'Unknown'}
• Last check: ${info.lastHealthCheck || 'Never'}
        `;
        
        await reply(response);
        
      } catch (error) {
        console.error("Database info error:", error);
        await reply(`❌ Info retrieval failed: ${error.message}`);
      }
    }
  );

  // Emergency sync reset command
  cmd(
    {
      pattern: "dbreset",
      desc: "Reset sync system (emergency use only)",
      category: "system",
      use: ".dbreset",
      filename: __filename,
    },
    async (conn, mek, m, { from, isOwner, reply }) => {
      if (!isOwner) return reply("❌ This command is only for bot owners!");
      
      try {
        await reply("⚠️ *WARNING:* This will reset the sync system. Type `.dbreset confirm` to proceed.");
        
        if (!m.text.includes("confirm")) {
          return reply("❌ Reset cancelled. Use `.dbreset confirm` to proceed.");
        }
        
        const mongoStoreDb = require("../database/MongoStoreDb");
        
        await reply("🔄 Resetting sync system...");
        
        await mongoStoreDb.resetSyncSystem();
        
        await reply(`
✅ *Sync System Reset Complete*

🔄 *Actions Taken:*
• Sync timers cleared
• Sync statistics reset
• Connection pools refreshed
• Sync locks released

⚠️ *Next Steps:*
• Auto-sync will resume in 30 minutes
• Use \`.dbsync\` for immediate sync
• Monitor with \`.dbstatus\`
        `);
        
      } catch (error) {
        console.error("Sync reset error:", error);
        await reply(`❌ Reset failed: ${error.message}`);
      }
    }
  );

} else {
  // Register info command for non-MongoDB setups
  cmd(
    {
      pattern: "dbinfo",
      desc: "Get database information",
      category: "system",
      use: ".dbinfo",
      filename: __filename,
    },
    async (conn, mek, m, { from, isOwner, reply }) => {
      if (!isOwner) return reply("❌ This command is only for bot owners!");
      
      const response = `
🗄️ *Database Information*

🗃️ *Current Setup:*
• Database: SQLite/PostgreSQL
• MongoDB: ❌ Not configured
• Sync: ❌ Not available

⚙️ *Configuration:*
• USE_MONGODB: ${config.USE_MONGODB || false}
• MONGODB_URI: ${config.MONGODB_URI ? '✅ Set' : '❌ Not set'}

💡 *To enable MongoDB:*
1. Set MONGODB_URI in environment
2. Set USE_MONGODB=true
3. Restart the bot
      `;
      
      await reply(response);
    }
  );
}
