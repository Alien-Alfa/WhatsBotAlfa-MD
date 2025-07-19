// Made with ❤ by AlienAlfa
// MongoDB Store Database Operations - Fully Compatible with SQLite Functions

const { isJidGroup } = require("@whiskeysockets/baileys");
const config = require("../../config");

// Dynamic database loading based on configuration
let dbOperations;

if (config.USE_MONGODB && config.MONGODB_URI) {
  // MongoDB Operations
  const mongoManager = require("./mongodb");
  
  // Performance: Cache for frequently accessed data
  const contactCache = new Map();
  const messageCache = new Map();
  const chatCache = new Map();
  const CACHE_TTL = 300000; // 5 minutes

  // MongoDB operations - fully compatible with SQLite interface
  dbOperations = {
    async initialize() {
      try {
        const models = await mongoManager.connect();
        this.models = models;
        
        // Initialize database sync manager
        const dbSyncManager = require("./DatabaseSyncManager");
        await dbSyncManager.initialize();
        
        return models;
      } catch (error) {
        console.error("MongoDB initialization failed:", error);
        throw error;
      }
    },

    // Core database operations - identical to SQLite interface
    async saveContact(jid, name) {
      try {
        if (!jid || !name || isJidGroup(jid)) return;
        
        const cacheKey = `contact_${jid}`;
        const cached = contactCache.get(cacheKey);
        if (cached && cached.name === name && Date.now() - cached.timestamp < CACHE_TTL) {
          return cached.data;
        }
        
        const result = await this.models.Contact.findOneAndUpdate(
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
        if (!message?.key?.id) return;
        
        const messageData = {
          id: message.key.id,
          jid: message.key.remoteJid,
          message: message,
          sender: user,
          messageType: this.getMessageType(message),
        };
        
        const result = await this.models.Message.findOneAndUpdate(
          { id: message.key.id },
          messageData,
          { upsert: true, new: true }
        );
        
        if (user && message.pushName) {
          await this.saveContact(user, message.pushName);
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
        
        const cacheKey = `load_${id}`;
        const cached = messageCache.get(cacheKey);
        if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
          return cached.data;
        }
        
        const message = await this.models.Message.findOne({ id });
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
        if (!chat?.id || chat.id === "status@broadcast" || chat.id === "broadcast") return;
        if (!chat.conversationTimestamp) return;
        
        const cacheKey = `chat_${chat.id}`;
        const cached = chatCache.get(cacheKey);
        if (cached && cached.timestamp === chat.conversationTimestamp) return cached.data;
        
        const isGroup = isJidGroup(chat.id);
        const result = await this.models.Chat.findOneAndUpdate(
          { id: chat.id },
          {
            id: chat.id,
            conversationTimestamp: chat.conversationTimestamp,
            isGroup,
          },
          { upsert: true, new: true }
        );
        
        chatCache.set(cacheKey, { timestamp: chat.conversationTimestamp, data: result });
        return result;
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
        
        const contact = await this.models.Contact.findOne({ jid });
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
        const messages = await this.models.Message.find({
          jid,
          createdAt: { $gte: new Date(sinceTimestamp) },
        })
        .sort({ createdAt: -1 })
        .limit(100);
        
        return messages;
      } catch (error) {
        console.error("Error loading deleted messages:", error);
        throw new Error("Error loading deleted messages");
      }
    },

    // Additional utility methods to match SQLite interface
    getMessageType(message) {
      if (!message?.message) return 'text';
      const messageKeys = Object.keys(message.message);
      return messageKeys[0] || 'text';
    },

    // Database model access for direct operations
    getModels() {
      return this.models;
    },

    // Compatibility methods for existing code
    async findContact(jid) {
      return await this.models.Contact.findOne({ jid });
    },

    async findMessage(id) {
      return await this.loadMessage(id);
    },

    async findChat(id) {
      return await this.models.Chat.findOne({ id });
    },

    // Bulk operations for performance
    async saveMessages(messages) {
      try {
        const operations = messages.map(({ message, user }) => ({
          updateOne: {
            filter: { id: message.key.id },
            update: {
              id: message.key.id,
              jid: message.key.remoteJid,
              message: message,
              sender: user,
              messageType: this.getMessageType(message),
            },
            upsert: true
          }
        }));

        return await this.models.Message.bulkWrite(operations);
      } catch (e) {
        console.warn("Bulk save messages error:", e);
        return null;
      }
    },

    async saveContacts(contacts) {
      try {
        const operations = contacts.map(({ jid, name }) => ({
          updateOne: {
            filter: { jid },
            update: { jid, name, isGroup: isJidGroup(jid) },
            upsert: true
          }
        }));

        return await this.models.Contact.bulkWrite(operations);
      } catch (e) {
        console.warn("Bulk save contacts error:", e);
        return null;
      }
    },

    // Sync management
    async performSync() {
      const dbSyncManager = require("./DatabaseSyncManager");
      return await dbSyncManager.forcSync();
    },

    getSyncStats() {
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
