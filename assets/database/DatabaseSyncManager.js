// Made with ❤ by AlienAlfa
// Database Synchronization Manager - Local SQLite → MongoDB Sync

const cron = require('node-cron');
const config = require('../../config');
const logger = require('../../lib/logger');

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

  async initialize() {
    try {
      // Only initialize sync if MongoDB is enabled and we have local database
      // Local database is always primary, MongoDB is optional sync target
      if (!config.USE_MONGODB || !config.MONGODB_URI) {
        logger.info("MongoDB sync disabled - using local database only", {
          component: 'DatabaseSyncManager',
          useMongoDb: config.USE_MONGODB,
          hasMongoUri: !!config.MONGODB_URI,
          localDbActive: !!config.DATABASE
        });
        return;
      }

      logger.info("Initializing database synchronization manager", {
        component: 'DatabaseSyncManager',
        mongoUri: config.MONGODB_URI ? 'configured' : 'missing',
        localDatabase: 'always active',
        syncDirection: 'Local SQLite → MongoDB'
      });

      // Initialize MongoDB connection
      this.mongoDb = require('./mongodb');
      await this.mongoDb.connect();

      // Start periodic sync (every 5 minutes)
      this.startPeriodicSync();

      logger.info("Database synchronization manager initialized successfully", {
        component: 'DatabaseSyncManager'
      });

    } catch (error) {
      logger.error("Failed to initialize database sync manager", {
        component: 'DatabaseSyncManager',
        error: error.message,
        stack: error.stack
      });
    }
  }

  startPeriodicSync() {
    // Run sync every 5 minutes
    this.syncInterval = cron.schedule('*/5 * * * *', async () => {
      await this.performSync('scheduled');
    }, {
      scheduled: true,
      timezone: "UTC"
    });

    logger.info("Periodic sync scheduled", {
      component: 'DatabaseSyncManager',
      interval: '5 minutes'
    });
  }

  async performSync(syncType = 'manual') {
    if (this.isRunning) {
      logger.warn("Sync already in progress, skipping", {
        component: 'DatabaseSyncManager'
      });
      return;
    }

    this.isRunning = true;
    const startTime = Date.now();

    try {
      logger.info("Starting database synchronization", {
        component: 'DatabaseSyncManager',
        syncType,
        direction: 'Local → MongoDB'
      });

      // Perform sync operations (local to MongoDB only)
      await this.syncFromLocalToMongo();

      this.syncStats.totalSyncs++;
      this.syncStats.lastSyncDuration = Date.now() - startTime;
      this.lastSyncTime = new Date();

      logger.info("Database synchronization completed", {
        component: 'DatabaseSyncManager',
        syncType,
        duration: this.syncStats.lastSyncDuration,
        totalSyncs: this.syncStats.totalSyncs
      });

    } catch (error) {
      this.syncStats.errors++;
      this.syncStats.lastError = error.message;
      logger.error("Database sync failed", {
        component: 'DatabaseSyncManager',
        syncType,
        error: error.message,
        stack: error.stack
      });
    } finally {
      this.isRunning = false;
    }
  }

  async syncFromLocalToMongo() {
    // Get MongoDB models
    const models = this.mongoDb?.getModels();
    if (!models) {
      logger.warn("MongoDB models not available for sync");
      return;
    }

    if (!config.DATABASE) {
      logger.warn("Local database not available for sync");
      return;
    }

    // Sync only recent data to avoid overwhelming the system
    const recentTime = new Date(Date.now() - 24 * 60 * 60 * 1000); // Last 24 hours

    try {
      // Sync Chats
      await this.syncChatsToMongo(models, recentTime);
      
      // Sync Messages
      await this.syncMessagesToMongo(models, recentTime);
      
      // Sync other important data
      await this.syncPausedChatsToMongo(models);
      
      logger.debug("All sync operations completed successfully");
      
    } catch (error) {
      logger.error("Error during sync operations", {
        error: error.message,
        stack: error.stack
      });
      throw error;
    }
  }

  async syncChatsToMongo(models, recentTime) {
    try {
      const ChatModel = config.DATABASE.models.Chat;
      if (!ChatModel) {
        logger.warn("Local Chat model not found");
        return;
      }

      const localChats = await ChatModel.findAll({
        where: {
          conversationTimestamp: {
            [config.DATABASE.Sequelize.Op.gte]: recentTime.getTime()
          }
        },
        limit: 1000,
        order: [['conversationTimestamp', 'DESC']]
      });

      let syncedCount = 0;
      for (const chat of localChats) {
        try {
          await models.Chat.updateOne(
            { id: chat.id },
            {
              id: chat.id,
              conversationTimestamp: chat.conversationTimestamp,
              isGroup: chat.isGroup,
              updatedAt: new Date()
            },
            { upsert: true }
          );
          syncedCount++;
        } catch (error) {
          logger.warn("Error syncing chat to MongoDB", { 
            chatId: chat.id, 
            error: error.message 
          });
        }
      }

      logger.debug(`Synced ${syncedCount}/${localChats.length} chats to MongoDB`);

    } catch (error) {
      logger.warn("Chat sync error", { error: error.message });
    }
  }

  async syncMessagesToMongo(models, recentTime) {
    try {
      const MessageModel = config.DATABASE.models.message;
      if (!MessageModel) {
        logger.warn("Local Message model not found");
        return;
      }

      const localMessages = await MessageModel.findAll({
        where: {
          createdAt: {
            [config.DATABASE.Sequelize.Op.gte]: recentTime
          }
        },
        limit: 500,
        order: [['createdAt', 'DESC']]
      });

      let syncedCount = 0;
      for (const message of localMessages) {
        try {
          await models.Message.updateOne(
            { id: message.id || message.jid },
            {
              id: message.id || message.jid,
              jid: message.jid,
              message: message.message,
              sender: message.sender,
              messageType: this.getMessageType(message.message),
              updatedAt: new Date()
            },
            { upsert: true }
          );
          syncedCount++;
        } catch (error) {
          logger.warn("Error syncing message to MongoDB", { 
            messageId: message.jid, 
            error: error.message 
          });
        }
      }

      logger.debug(`Synced ${syncedCount}/${localMessages.length} messages to MongoDB`);

    } catch (error) {
      logger.warn("Message sync error", { error: error.message });
    }
  }

  async syncPausedChatsToMongo(models) {
    try {
      // Sync paused chats from local database
      const { PausedChats } = require('./index');
      const pausedChats = await PausedChats.getPausedChats();

      let syncedCount = 0;
      for (const pausedChat of pausedChats) {
        try {
          const chatId = pausedChat.chatId || pausedChat.jid;
          if (chatId) {
            await models.PausedChat.updateOne(
              { chatId: chatId },
              {
                chatId: chatId,
                isPaused: true,
                updatedAt: new Date()
              },
              { upsert: true }
            );
            syncedCount++;
          }
        } catch (error) {
          logger.warn("Error syncing paused chat to MongoDB", { 
            chatId: pausedChat.chatId || pausedChat.jid, 
            error: error.message 
          });
        }
      }

      logger.debug(`Synced ${syncedCount} paused chats to MongoDB`);

    } catch (error) {
      logger.warn("Paused chat sync error", { error: error.message });
    }
  }

  async forceSync() {
    logger.info("Force sync requested", {
      component: 'DatabaseSyncManager'
    });
    await this.performSync('force');
  }

  getStatus() {
    return {
      isRunning: this.isRunning,
      lastSyncTime: this.lastSyncTime,
      stats: this.syncStats,
      isEnabled: config.USE_MONGODB && !!config.MONGODB_URI
    };
  }

  // Helper method to determine message type
  getMessageType(message) {
    if (!message?.message) return 'unknown';
    
    const msgContent = message.message;
    if (msgContent.conversation) return 'text';
    if (msgContent.imageMessage) return 'image';
    if (msgContent.videoMessage) return 'video';
    if (msgContent.audioMessage) return 'audio';
    if (msgContent.documentMessage) return 'document';
    if (msgContent.stickerMessage) return 'sticker';
    if (msgContent.locationMessage) return 'location';
    if (msgContent.contactMessage) return 'contact';
    if (msgContent.extendedTextMessage) return 'text';
    
    return 'unknown';
  }

  async stop() {
    if (this.syncInterval) {
      this.syncInterval.destroy();
      this.syncInterval = null;
    }

    if (this.mongoDb) {
      await this.mongoDb.disconnect();
    }

    logger.info("Database sync manager stopped", {
      component: 'DatabaseSyncManager'
    });
  }
}

module.exports = new DatabaseSyncManager();
