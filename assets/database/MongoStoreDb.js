// Made with ❤ by AlienAlfa
// MongoDB Store Database Operations - Fully Compatible with SQLite Functions

const { isJidGroup } = require("@whiskeysockets/baileys");
const config = require("../../config");

// Dynamic database loading based on configuration
let dbOperations;

if (config.USE_MONGODB && config.MONGODB_URI) {
  // MongoDB Operations
  const mongoModels = require("./mongoModels");
  
  // Performance: Cache for frequently accessed data
  const contactCache = new Map();
  const messageCache = new Map();
  const chatCache = new Map();
  const CACHE_TTL = 300000; // 5 minutes

  // MongoDB operations - fully compatible with SQLite interface
  dbOperations = {
    models: null, // Initialize models property
    
    async initialize() {
      try {
        const models = await mongoModels.initializeMongoModels();
        this.models = models;
        dbOperations.models = models; // Also set on the main object
        
        // Initialize database sync manager
        const dbSyncManager = require("./DatabaseSyncManager");
        await dbSyncManager.initialize();
        
        console.log("✅ MongoDB models initialized successfully");
        return models;
      } catch (error) {
        console.error("MongoDB initialization failed:", error);
        throw error;
      }
    },

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
      if (msgContent.extendedTextMessage) return 'extendedText';
      
      return 'other';
    },

    // Core database operations - identical to SQLite interface
    async saveContact(jid, name) {
      try {
        if (!jid || !name || isJidGroup(jid)) return;
        
        const models = this.models || dbOperations.models;
        if (!models || !models.Contact) {
          console.warn("MongoDB models not initialized for saveContact");
          return null;
        }
        
        const cacheKey = `contact_${jid}`;
        const cached = contactCache.get(cacheKey);
        if (cached && cached.name === name && Date.now() - cached.timestamp < CACHE_TTL) {
          return cached.data;
        }
        
        const result = await models.Contact.findOneAndUpdate(
          { jid },
          { jid, name, isGroup: isJidGroup(jid) },
          { upsert: true, new: true }
        );
        
        contactCache.set(cacheKey, { name, data: result, timestamp: Date.now() });
        return result;
      } catch (e) {
        console.warn("Save contact error:", e);
        return null;
      }
    },

    async saveMessage(message, user) {
      try {
        const models = this.models || dbOperations.models;
        if (!models || !models.Message) {
          console.warn("MongoDB models not initialized for saveMessage");
          return null;
        }
        
        if (!message?.key?.id) return;
        
        const messageData = {
          id: message.key.id,
          jid: message.key.remoteJid,
          message: message,
          sender: user,
          messageType: dbOperations.getMessageType(message),
        };
        
        const result = await models.Message.findOneAndUpdate(
          { id: message.key.id },
          messageData,
          { upsert: true, new: true }
        );
        
        if (user && message.pushName) {
          await dbOperations.saveContact(user, message.pushName);
        }
        
        return result;
      } catch (e) {
        console.warn("Save message error:", e);
        return null;
      }
    },

    async loadMessage(id) {
      try {
        if (!id) return null;
        
        const models = this.models || dbOperations.models;
        if (!models || !models.Message) {
          console.warn("MongoDB models not initialized for loadMessage");
          return null;
        }
        
        const cacheKey = `load_${id}`;
        const cached = messageCache.get(cacheKey);
        if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
          return cached.data;
        }
        
        const message = await models.Message.findOne({ id });
        const result = message || null;
        
        messageCache.set(cacheKey, { data: result, timestamp: Date.now() });
        return result;
      } catch (e) {
        console.warn("Load message error:", e);
        return null;
      }
    },

    async saveChat(chat) {
      try {
        const models = this.models || dbOperations.models;
        if (!models || !models.Chat) {
          console.warn("MongoDB models not initialized for saveChat");
          return null;
        }
        
        if (!chat?.id || chat.id === "status@broadcast" || chat.id === "broadcast") return;
        if (!chat.conversationTimestamp) return;
        
        const cacheKey = `chat_${chat.id}`;
        const cached = chatCache.get(cacheKey);
        if (cached && cached.timestamp === chat.conversationTimestamp) return cached.data;
        
        const isGroup = isJidGroup(chat.id);
        
        try {
          const result = await models.Chat.findOneAndUpdate(
            { jid: chat.id },
            {
              jid: chat.id,
              conversationTimestamp: chat.conversationTimestamp,
              isGroup,
            },
            { upsert: true, new: true }
          );
          
          chatCache.set(cacheKey, { timestamp: chat.conversationTimestamp, data: result });
          return result;
        } catch (error) {
          // Handle duplicate key errors gracefully
          if (error.code === 11000) {
            console.warn(`Duplicate chat entry for ${chat.id}, attempting to find existing...`);
            try {
              const existing = await models.Chat.findOne({ jid: chat.id });
              if (existing) {
                chatCache.set(cacheKey, { timestamp: chat.conversationTimestamp, data: existing });
                return existing;
              }
            } catch (findError) {
              console.error("Error finding existing chat:", findError.message);
            }
          }
          throw error;
        }
      } catch (e) {
        console.warn("Save chat error:", e);
        return null;
      }
    },

    async getName(jid) {
      try {
        const cacheKey = `name_${jid}`;
        const cached = contactCache.get(cacheKey);
        if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
          return cached.name;
        }
        
        const models = this.models || dbOperations.models;
        if (!models || !models.Contact) {
          console.warn("MongoDB models not initialized for getName");
          return jid.split("@")[0].replace(/_/g, " ");
        }
        
        const contact = await models.Contact.findOne({ jid });
        const name = contact?.name || jid.split("@")[0].replace(/_/g, " ");
        
        contactCache.set(cacheKey, { name, timestamp: Date.now() });
        return name;
      } catch (e) {
        console.warn("Get name error:", e);
        return jid.split("@")[0].replace(/_/g, " ");
      }
    },

    async loadDeletedMessages(jid, sinceTimestamp) {
      try {
        const models = this.models || dbOperations.models;
        if (!models || !models.Message) {
          console.warn("MongoDB models not initialized for loadDeletedMessages");
          return [];
        }
        
        const messages = await models.Message.find({
          jid,
          createdAt: { $gte: new Date(sinceTimestamp) },
        })
        .sort({ createdAt: -1 })
        .limit(100);
        
        return messages;
      } catch (error) {
        console.error("Error loading deleted messages:", error);
        return [];
      }
    },

    // Database model access for direct operations
    getModels() {
      return dbOperations.models || mongoModels.getMongoModels();
    },

    // Compatibility methods for existing code
    async findContact(jid) {
      const models = this.models || dbOperations.models;
      if (!models || !models.Contact) {
        console.warn("MongoDB models not initialized for findContact");
        return null;
      }
      return await models.Contact.findOne({ jid });
    },

    async findMessage(id) {
      return await dbOperations.loadMessage(id);
    },

    async findChat(id) {
      const models = this.models || dbOperations.models;
      if (!models || !models.Chat) {
        console.warn("MongoDB models not initialized for findChat");
        return null;
      }
      return await models.Chat.findOne({ id });
    },

    // Bulk operations for performance
    async saveMessages(messages) {
      try {
        const models = this.models || dbOperations.models;
        if (!models || !models.Message) {
          console.warn("MongoDB models not initialized for saveMessages");
          return null;
        }
        
        const operations = messages.map(({ message, user }) => ({
          updateOne: {
            filter: { id: message.key.id },
            update: {
              id: message.key.id,
              jid: message.key.remoteJid,
              message: message,
              sender: user,
              messageType: dbOperations.getMessageType(message),
            },
            upsert: true
          }
        }));

        return await models.Message.bulkWrite(operations);
      } catch (e) {
        console.warn("Bulk save messages error:", e);
        return null;
      }
    },

    async saveContacts(contacts) {
      try {
        const models = this.models || dbOperations.models;
        if (!models || !models.Contact) {
          console.warn("MongoDB models not initialized for saveContacts");
          return null;
        }
        
        const operations = contacts.map(({ jid, name }) => ({
          updateOne: {
            filter: { jid },
            update: { jid, name, isGroup: isJidGroup(jid) },
            upsert: true
          }
        }));

        return await models.Contact.bulkWrite(operations);
      } catch (e) {
        console.warn("Bulk save contacts error:", e);
        return null;
      }
    },

    // Sync management
    async performSync() {
      // Check if we're in dual database mode (MongoDB + SQLite)
      const config = require("../../config");
      if (!config.DATABASE || config.DATABASE === null) {
        // MongoDB-only mode - no sync needed
        return { 
          status: "skipped", 
          message: "Database sync not needed - using MongoDB only",
          timestamp: new Date().toISOString()
        };
      }
      
      const dbSyncManager = require("./DatabaseSyncManager");
      return await dbSyncManager.forcSync();
    },

    getSyncStats() {
      // Check if we're in dual database mode (MongoDB + SQLite)
      const config = require("../../config");
      if (!config.DATABASE || config.DATABASE === null) {
        // MongoDB-only mode - return basic stats
        return {
          totalSyncs: 0,
          lastSyncDuration: 0,
          errors: 0,
          mode: "mongodb-only",
          lastSyncTime: null
        };
      }
      
      const dbSyncManager = require("./DatabaseSyncManager");
      return dbSyncManager.getSyncStats();
    }
  };
} else {
  // Fallback to Sequelize operations with same interface
  let sequelizeOperations;
  
  try {
    sequelizeOperations = require("./StoreDb");
  } catch (error) {
    console.warn("StoreDb not available, creating mock operations");
    sequelizeOperations = {
      saveContact: async () => null,
      saveMessage: async () => null,
      loadMessage: async () => null,
      saveChat: async () => null,
      getName: async (jid) => jid.split("@")[0].replace(/_/g, " "),
      loadDeletedMessages: async () => []
    };
  }

  dbOperations = {
    async initialize() {
      console.log("🗃️ Using SQLite database operations");
      return Promise.resolve();
    },
    
    ...sequelizeOperations,
    
    // Add compatibility methods
    getModels() {
      return null; // SQLite doesn't use models
    },

    async performSync() {
      console.log("ℹ️ Sync not available with SQLite-only mode");
      return null;
    },

    getSyncStats() {
      return {
        message: "Sync not available with SQLite-only mode",
        isRunning: false
      };
    }
  };
}

module.exports = dbOperations;
