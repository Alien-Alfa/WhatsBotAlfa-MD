// Made with ❤ by AlienAlfa
// Database Synchronization Manager - MongoDB ↔ SQLite Sync

const cron = require('node-cron');
const config = require('../../config');

class DatabaseSyncManager {
  constructor() {
    this.isRunning = false;
    this.syncInterval = null;
    this.lastSyncTime = null;
    this.syncStats = {
      totalSyncs: 0,
      lastSyncDuration: 0,
      errors: 0,
    };
  }

  // Helper method to get MongoDB models safely
  getMongoModels() {
    const models = this.mongoDb?.getModels();
    if (!models) {
      console.warn("MongoDB models not available");
      return null;
    }
    return models;
  }

  async initialize() {
    try {
      // Only initialize sync if we have both MongoDB AND SQLite configured
      // If USE_MONGODB is true but DATABASE is null, we're in MongoDB-only mode
      if (!config.USE_MONGODB || !config.MONGODB_URI || config.DATABASE === null) {
        console.log("⏭️ Database sync not needed - using single database");
        return;
      }

      console.log("🔄 Initializing database synchronization manager...");
      
      // Initialize both database connections
      this.mongoDb = require('./MongoStoreDb');
      this.sqliteDb = require('./StoreDb');
      
      await this.mongoDb.initialize();
      
      // Start sync scheduler (every 30 minutes)
      this.startSyncScheduler();
      
      // Initial sync
      await this.performSync('initial');
      
      console.log("✅ Database sync manager initialized");
      
    } catch (error) {
      console.error("❌ Database sync initialization failed:", error);
      throw error;
    }
  }

  startSyncScheduler() {
    // Schedule sync every 30 minutes
    this.syncInterval = cron.schedule('*/30 * * * *', async () => {
      await this.performSync('scheduled');
    }, {
      scheduled: true,
      timezone: "UTC"
    });

    console.log("⏰ Database sync scheduled every 30 minutes");
  }

  async performSync(syncType = 'manual') {
    if (this.isRunning) {
      console.log("⏳ Sync already in progress, skipping...");
      return;
    }

    this.isRunning = true;
    const startTime = Date.now();
    
    try {
      console.log(`🔄 Starting ${syncType} database synchronization...`);
      
      // Sync all collections/tables
      const syncResults = await Promise.allSettled([
        this.syncChats(),
        this.syncMessages(),
        this.syncContacts(),
        this.syncPausedChats(),
        this.syncGreetings(),
        this.syncWarnings(),
        this.syncNotes(),
        this.syncFilters(),
        this.syncPlugins(),
        this.syncCallActions(),
        this.syncAutoReact(),
        this.syncAutoTranslate(),
        this.syncBanBot(),
        this.syncBannedAccounts(),
        this.syncStickBan(),
        this.syncPDM(),
        this.syncAiChat(),
        this.syncGemini(),
        this.syncGroupStateSave()
      ]);

      // Process results
      const successful = syncResults.filter(r => r.status === 'fulfilled').length;
      const failed = syncResults.filter(r => r.status === 'rejected').length;

      const duration = Date.now() - startTime;
      this.syncStats.totalSyncs++;
      this.syncStats.lastSyncDuration = duration;
      this.lastSyncTime = new Date();

      if (failed > 0) {
        this.syncStats.errors++;
        console.warn(`⚠️ Sync completed with ${failed} errors (${successful} successful)`);
      } else {
        console.log(`✅ Database sync completed successfully in ${duration}ms`);
      }

    } catch (error) {
      this.syncStats.errors++;
      this.syncStats.lastError = error.message;
      console.error("❌ Database sync failed:", error);
    } finally {
      this.isRunning = false;
    }
  }

  // Sync individual collections
  async syncChats() {
    try {
      // Get MongoDB models from the correct path
      const models = this.mongoDb.getModels();
      if (!models) {
        console.warn("MongoDB models not available for chat sync");
        return;
      }
      
      // Get latest data from MongoDB
      const mongoChats = await models.Chat.find({})
        .sort({ updatedAt: -1 })
        .limit(1000);

      for (const chat of mongoChats) {
        await this.sqliteDb.saveChat({
          id: chat.id,
          conversationTimestamp: chat.conversationTimestamp,
          isGroup: chat.isGroup
        });
      }

      // Sync back from SQLite to MongoDB (bidirectional)
      const sqliteChats = await this.sqliteDb.chatDb.findAll({
        order: [['updatedAt', 'DESC']],
        limit: 100
      });

      for (const chat of sqliteChats) {
        await this.mongoDb.saveChat({
          id: chat.id,
          conversationTimestamp: chat.conversationTimestamp,
          isGroup: chat.isGroup
        });
      }

    } catch (error) {
      console.warn("Chat sync error:", error);
    }
  }

  async syncMessages() {
    try {
      // Sync recent messages only to avoid overwhelming
      const recentTime = new Date(Date.now() - 24 * 60 * 60 * 1000); // Last 24 hours

      const mongoMessages = await this.mongoDb.models.Message.find({
        createdAt: { $gte: recentTime }
      }).limit(500);

      for (const msg of mongoMessages) {
        if (msg.message && msg.message.key) {
          await this.sqliteDb.saveMessage(msg.message, msg.sender);
        }
      }

      // Sync back from SQLite
      const sqliteMessages = await this.sqliteDb.messageDb.findAll({
        where: {
          createdAt: { [require('sequelize').Op.gte]: recentTime }
        },
        limit: 500
      });

      for (const msg of sqliteMessages) {
        await this.mongoDb.saveMessage(msg.message, msg.jid);
      }

    } catch (error) {
      console.warn("Message sync error:", error);
    }
  }

  async syncContacts() {
    try {
      const mongoContacts = await this.mongoDb.models.Contact.find({}).limit(1000);

      for (const contact of mongoContacts) {
        await this.sqliteDb.saveContact(contact.jid, contact.name);
      }

      // Sync back
      const sqliteContacts = await this.sqliteDb.contactDb.findAll({ limit: 1000 });

      for (const contact of sqliteContacts) {
        await this.mongoDb.saveContact(contact.jid, contact.name);
      }

    } catch (error) {
      console.warn("Contact sync error:", error);
    }
  }

  async syncPausedChats() {
    try {
      const mongoPaused = await this.mongoDb.models.PausedChat.find({});
      
      for (const paused of mongoPaused) {
        const pausedChats = require('./PausedChat');
        await pausedChats.addPausedChat(paused.chatId || paused.jid);
      }

      // Sync back
      const pausedChats = require('./PausedChat');
      const sqlitePaused = await pausedChats.getPausedChats();

      for (const paused of sqlitePaused) {
        await this.mongoDb.models.PausedChat.findOneAndUpdate(
          { chatId: paused.chatId },
          { chatId: paused.chatId, pausedBy: 'system' },
          { upsert: true }
        );
      }

    } catch (error) {
      console.warn("PausedChat sync error:", error);
    }
  }

  async syncGreetings() {
    try {
      const mongoGreetings = await this.mongoDb.models.Greeting.find({});

      // Sync greeting data - implement based on your greeting structure
      for (const greeting of mongoGreetings) {
        // Update SQLite greeting equivalent
        const greetingDb = require('./greetings');
        if (greetingDb && greetingDb.setGreeting) {
          await greetingDb.setGreeting(greeting.chatId, greeting.type, greeting.message);
        }
      }

    } catch (error) {
      console.warn("Greeting sync error:", error);
    }
  }

  async syncWarnings() {
    try {
      const mongoWarnings = await this.mongoDb.models.Warning.find({});

      for (const warning of mongoWarnings) {
        const warnDb = require('./warn');
        if (warnDb && warnDb.addWarning) {
          await warnDb.addWarning(warning.chatId, warning.userId, warning.warnCount);
        }
      }

    } catch (error) {
      console.warn("Warning sync error:", error);
    }
  }

  async syncNotes() {
    try {
      const mongoNotes = await this.mongoDb.models.Note.find({});

      for (const note of mongoNotes) {
        const noteDb = require('./notes');
        if (noteDb && noteDb.addNote) {
          await noteDb.addNote(note.chatId, note.noteName, note.noteContent);
        }
      }

    } catch (error) {
      console.warn("Note sync error:", error);
    }
  }

  async syncFilters() {
    try {
      const mongoFilters = await this.mongoDb.models.Filter.find({});

      for (const filter of mongoFilters) {
        const filterDb = require('./filters');
        if (filterDb && filterDb.addFilter) {
          await filterDb.addFilter(filter.chatId, filter.pattern, filter.response);
        }
      }

    } catch (error) {
      console.warn("Filter sync error:", error);
    }
  }

  async syncPlugins() {
    try {
      const mongoPlugins = await this.mongoDb.models.Plugin.find({});

      for (const plugin of mongoPlugins) {
        const pluginDb = require('./plugins');
        if (pluginDb && pluginDb.setPluginConfig) {
          await pluginDb.setPluginConfig(plugin.name, plugin.enabled, plugin.config);
        }
      }

    } catch (error) {
      console.warn("Plugin sync error:", error);
    }
  }

  async syncCallActions() {
    try {
      const mongoCallActions = await this.mongoDb.models.CallAction.find({});

      for (const callAction of mongoCallActions) {
        const callDb = require('./callAction');
        if (callDb && callDb.setCallAction) {
          await callDb.setCallAction(callAction.chatId, callAction.action);
        }
      }

    } catch (error) {
      console.warn("CallAction sync error:", error);
    }
  }

  // Implement remaining sync methods for all other collections
  async syncAutoReact() {
    try {
      const mongoAutoReact = await this.mongoDb.models.AutoReact.find({});
      
      for (const autoReact of mongoAutoReact) {
        const autoReactDb = require('./autoreact');
        if (autoReactDb && autoReactDb.setAutoReact) {
          await autoReactDb.setAutoReact(autoReact.chatId, autoReact.enabled, autoReact.reactions);
        }
      }
    } catch (error) {
      console.warn("AutoReact sync error:", error);
    }
  }

  async syncAutoTranslate() {
    try {
      const mongoAutoTranslate = await this.mongoDb.models.AutoTranslate.find({});
      
      for (const autoTranslate of mongoAutoTranslate) {
        const autoTranslateDb = require('./autotranslate');
        if (autoTranslateDb && autoTranslateDb.setAutoTranslate) {
          await autoTranslateDb.setAutoTranslate(autoTranslate.chatId, autoTranslate.enabled, autoTranslate.targetLanguage);
        }
      }
    } catch (error) {
      console.warn("AutoTranslate sync error:", error);
    }
  }

  async syncBanBot() {
    try {
      const mongoBanBot = await this.mongoDb.models.BanBot.find({});
      
      for (const banBot of mongoBanBot) {
        const banBotDb = require('./banbot');
        if (banBotDb && banBotDb.setBanBot) {
          await banBotDb.setBanBot(banBot.chatId, banBot.enabled, banBot.reason);
        }
      }
    } catch (error) {
      console.warn("BanBot sync error:", error);
    }
  }

  async syncBannedAccounts() {
    try {
      const mongoBannedAccounts = await this.mongoDb.models.BannedAccount.find({});
      
      for (const bannedAccount of mongoBannedAccounts) {
        const bannedAccountDb = require('./BannedAccount');
        if (bannedAccountDb && bannedAccountDb.addBannedAccount) {
          await bannedAccountDb.addBannedAccount(bannedAccount.userId, bannedAccount.reason, bannedAccount.bannedBy);
        }
      }
    } catch (error) {
      console.warn("BannedAccount sync error:", error);
    }
  }

  async syncStickBan() {
    try {
      const mongoStickBan = await this.mongoDb.models.StickBan.find({});
      
      for (const stickBan of mongoStickBan) {
        const stickBanDb = require('./stickban');
        if (stickBanDb && stickBanDb.addStickBan) {
          await stickBanDb.addStickBan(stickBan.chatId, stickBan.stickerId, stickBan.bannedBy);
        }
      }
    } catch (error) {
      console.warn("StickBan sync error:", error);
    }
  }

  async syncPDM() {
    try {
      const mongoPDM = await this.mongoDb.models.PDM.find({});
      
      for (const pdm of mongoPDM) {
        const pdmDb = require('./pdm');
        if (pdmDb && pdmDb.setPDM) {
          await pdmDb.setPDM(pdm.chatId, pdm.enabled, pdm.deleteTime);
        }
      }
    } catch (error) {
      console.warn("PDM sync error:", error);
    }
  }

  async syncAiChat() {
    try {
      const mongoAiChat = await this.mongoDb.models.AiChat.find({});
      
      for (const aiChat of mongoAiChat) {
        const aiChatDb = require('./aiChat');
        if (aiChatDb && aiChatDb.setAiChat) {
          await aiChatDb.setAiChat(aiChat.chatId, aiChat.enabled, aiChat.model);
        }
      }
    } catch (error) {
      console.warn("AiChat sync error:", error);
    }
  }

  async syncGemini() {
    try {
      const mongoGemini = await this.mongoDb.models.Gemini.find({});
      
      for (const gemini of mongoGemini) {
        const geminiDb = require('./gemini');
        if (geminiDb && geminiDb.setGemini) {
          await geminiDb.setGemini(gemini.chatId, gemini.enabled, gemini.apiKey);
        }
      }
    } catch (error) {
      console.warn("Gemini sync error:", error);
    }
  }

  async syncGroupStateSave() {
    try {
      const mongoGroupState = await this.mongoDb.models.GroupStateSave.find({});
      
      for (const groupState of mongoGroupState) {
        const groupStateDb = require('./GroupStateSave');
        if (groupStateDb && groupStateDb.saveGroupState) {
          await groupStateDb.saveGroupState(groupState.chatId, groupState.state);
        }
      }
    } catch (error) {
      console.warn("GroupStateSave sync error:", error);
    }
  }

  // Utility methods
  getSyncStats() {
    return {
      ...this.syncStats,
      lastSyncTime: this.lastSyncTime,
      isRunning: this.isRunning,
      nextSync: this.syncInterval ? 'Every 30 minutes' : 'Not scheduled'
    };
  }

  async forcSync() {
    console.log("🔄 Force sync requested...");
    await this.performSync('manual');
  }

  stopSync() {
    if (this.syncInterval) {
      this.syncInterval.stop();
      console.log("⏹️ Database sync stopped");
    }
  }

  restartSync() {
    this.stopSync();
    this.startSyncScheduler();
    console.log("🔄 Database sync restarted");
  }
}

// Create singleton instance
const dbSyncManager = new DatabaseSyncManager();

module.exports = dbSyncManager;
