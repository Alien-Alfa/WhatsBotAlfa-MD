// Made with ❤ by AlienAlfa
// Performance optimized database operations

const { isJidGroup } = require("@whiskeysockets/baileys");
const config = require("../../config");
const { DataTypes, Op } = require("sequelize");
const logger = require("../../lib/logger");

// MongoDB Safety Check: Provide dual-mode support
if (!config.DATABASE) {
  // MongoDB mode or no SQLite - provide routing to MongoDB operations
  logger.info("SQLite not available, routing database operations to MongoDB or fallback");
  
  module.exports = {
    saveMessage: async () => null,
    loadMessage: async (messageId) => {
      try {
        // Try to use MongoDB operations if available
        if (config.USE_MONGODB && config.MONGODB_URI) {
          const mongoStoreDb = require("./MongoStoreDb");
          if (mongoStoreDb && mongoStoreDb.loadMessage) {
            logger.info(`Routing loadMessage to MongoDB for messageId: ${messageId}`);
            return await mongoStoreDb.loadMessage(messageId);
          }
        }
        logger.warn("MongoDB not available for loadMessage, returning null");
        return null;
      } catch (error) {
        logger.warn("Failed to load message from MongoDB:", error.message);
        return null;
      }
    },
    loadDeletedMessages: async (jid, sinceTimestamp) => {
      try {
        // Try to use MongoDB operations if available
        if (config.USE_MONGODB && config.MONGODB_URI) {
          const mongoStoreDb = require("./MongoStoreDb");
          if (mongoStoreDb && mongoStoreDb.loadDeletedMessages) {
            logger.info(`Routing loadDeletedMessages to MongoDB for jid: ${jid}`);
            return await mongoStoreDb.loadDeletedMessages(jid, sinceTimestamp);
          }
        }
        logger.warn("MongoDB not available for loadDeletedMessages, returning empty array");
        return [];
      } catch (error) {
        logger.warn("Failed to load deleted messages from MongoDB:", error.message);
        return [];
      }
    },
    saveChat: async () => null,
    getName: async (jid) => jid.split("@")[0].replace(/_/g, " "),
    flushMessageQueue: async () => null,
  };
  return;
}

// Performance: Optimize database models with indexes
const chatDb = config.DATABASE.define("Chat", {
  id: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
  },
  conversationTimestamp: {
    type: DataTypes.INTEGER,
    allowNull: false,
    index: true, // Add index for performance
  },
  isGroup: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    index: true, // Add index for performance
  },
}, {
  tableName: 'Chats', // Explicitly set table name to match expected plural form
  indexes: [
    {
      fields: ['conversationTimestamp']
    },
    {
      fields: ['isGroup']
    }
  ]
});

const messageDb = config.DATABASE.define("message", {
  jid: {
    type: DataTypes.STRING,
    allowNull: false,
    index: true, // Add index for performance
  },
  message: {
    type: DataTypes.JSON,
    allowNull: false,
  },
  id: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
  },
}, {
  indexes: [
    {
      fields: ['jid']
    }
  ]
});

const deletedMessageDb = config.DATABASE.define("deletedMessage", {
  id: { type: DataTypes.STRING, allowNull: false, primaryKey: true },
  jid: { type: DataTypes.STRING, allowNull: false },
  originalMessageId: { type: DataTypes.STRING, allowNull: false },
  deletedAt: { type: DataTypes.DATE, allowNull: false },
}, {
  tableName: 'DeletedMessages',
  indexes: [{ fields: ['jid', 'deletedAt'] }],
});

const contactDb = config.DATABASE.define("contact", {
  jid: {
    type: DataTypes.STRING,
    allowNull: false,
    index: true, // Add index for performance
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  tableName: 'contacts', // Explicitly set table name to match expected plural form
  indexes: [
    {
      fields: ['jid']
    }
  ]
});

// Performance: Cache for frequently accessed data
const contactCache = new Map();
const messageCache = new Map();
const CACHE_TTL = 300000; // 5 minutes

// Database operation queue to prevent SQLite locking
class DatabaseQueue {
  constructor() {
    this.queue = [];
    this.isProcessing = false;
  }

  async add(operation) {
    return new Promise((resolve, reject) => {
      this.queue.push({ operation, resolve, reject });
      this.process();
    });
  }

  async process() {
    if (this.isProcessing || this.queue.length === 0) return;
    
    this.isProcessing = true;
    
    while (this.queue.length > 0) {
      const { operation, resolve, reject } = this.queue.shift();
      
      try {
        const result = await operation();
        resolve(result);
      } catch (error) {
        reject(error);
      }
      
      // Small delay to prevent overwhelming SQLite
      await new Promise(resolve => setTimeout(resolve, 10));
    }
    
    this.isProcessing = false;
  }
}

const dbQueue = new DatabaseQueue();

const saveContact = async (jid, name, options = {}) => {
  try {
    if (!jid || !name || isJidGroup(jid)) return;
    
    // Performance: Check cache first
    const cacheKey = `contact_${jid}`;
    const cached = contactCache.get(cacheKey);
    if (cached && cached.name === name && Date.now() - cached.timestamp < CACHE_TTL) {
      return;
    }
    
    const persistContact = async () => {
      let retries = 3;
      
      while (retries > 0) {
        try {
          // Use findOrCreate to handle race conditions
          const [contact, created] = await contactDb.findOrCreate({
            where: { jid },
            defaults: { jid, name }
          });
          
          // If record exists but name is different, update it
          if (!created && contact.name !== name) {
            await contact.update({ name });
          }
          
          return contact;
        } catch (error) {
          retries--;
          
          if (error.name === 'SequelizeTimeoutError' || error.parent?.code === 'SQLITE_BUSY') {
            if (retries > 0) {
              // Wait longer before retry for database locks
              await new Promise(resolve => setTimeout(resolve, 100 * (4 - retries)));
              continue;
            }
          }
          
          throw error;
        }
      }
    };

    // Message persistence already runs inside the queue; enqueueing a nested
    // contact write there would wait forever for the current task to finish.
    const result = options.inQueue
      ? await persistContact()
      : await dbQueue.add(persistContact);
    
    contactCache.set(cacheKey, { name, timestamp: Date.now() });
    return result;
  } catch (e) {
    logger.warn("Save contact error:", e.message || e);
    return null;
  }
};

// Performance: Optimized message saving with batching
const messageBatch = [];
let messageBatchTimer = null;

// Core single-message write (used by both batched and immediate paths)
const persistOne = async ({ message, user }) => {
  const cacheKey = `msg_${message.key.id}`;
  if (messageCache.has(cacheKey)) return;

  let retries = 3;
  while (retries > 0) {
    try {
      await messageDb.upsert({
        id: message.key.id,
        jid: message.key.remoteJid,
        message: message,
      });

      messageCache.set(cacheKey, { timestamp: Date.now() });

      if (user && message.pushName) {
        await saveContact(user, message.pushName, { inQueue: true });
      }

      break; // Success, exit retry loop
    } catch (error) {
      retries--;

      if (error.name === 'SequelizeTimeoutError' || error.parent?.code === 'SQLITE_BUSY') {
        if (retries > 0) {
          await new Promise(resolve => setTimeout(resolve, 50 * (4 - retries)));
          continue;
        }
      }

      throw error;
    }
  }
};

const writeMessages = (batch) =>
  dbQueue.add(async () => {
    await Promise.allSettled(batch.map(persistOne));
  });

/**
 * Save a message.
 * @param {Object} message - raw WA message
 * @param {String} user - sender jid (for contact save)
 * @param {Object} [options]
 * @param {Boolean} [options.immediate] - write to DB NOW and await it.
 *   Used for command messages so a restart/reboot can never lose them
 *   from the store (they would replay as "new" after boot - issue #2).
 */
const saveMessage = async (message, user, options = {}) => {
  try {
    if (!message?.key?.id) return;

    // Immediate path: awaited write, bypasses the 100ms batch window
    if (options && options.immediate) {
      try {
        await writeMessages([{ message, user }]);
      } catch (error) {
        logger.warn("Immediate message save error:", error.message || error);
      }
      return;
    }

    // Performance: Add to batch instead of immediate save
    messageBatch.push({ message, user });

    if (messageBatchTimer) clearTimeout(messageBatchTimer);
    messageBatchTimer = setTimeout(async () => {
      messageBatchTimer = null;
      const batch = [...messageBatch];
      messageBatch.length = 0;

      try {
        await writeMessages(batch);
      } catch (error) {
        logger.warn("Batch message save error:", error.message || error);
      }
    }, 100); // Batch every 100ms
  } catch (e) {
    logger.warn("Save message error:", e.message || e);
  }
};

/**
 * Flush any pending batched message writes immediately.
 * Called before command execution and on SIGINT/SIGTERM shutdown.
 */
const flushMessageQueue = async () => {
  if (messageBatchTimer) {
    clearTimeout(messageBatchTimer);
    messageBatchTimer = null;
  }
  if (!messageBatch.length) return;
  const batch = [...messageBatch];
  messageBatch.length = 0;
  try {
    await writeMessages(batch);
  } catch (error) {
    logger.warn("Flush message queue error:", error.message || error);
  }
};

// Performance: Optimized message loading with cache
const loadMessage = async (id) => {
  try {
    if (!id) return null;
    
    const cacheKey = `load_${id}`;
    const cached = messageCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return cached.data;
    }
    
    const message = await messageDb.findOne({ where: { id } });
    const result = message?.dataValues || null;
    
    messageCache.set(cacheKey, { data: result, timestamp: Date.now() });
    return result;
  } catch (e) {
    logger.warn("Load message error:", e);
    return null;
  }
};

const loadDeletedMessages = async (jid, sinceTimestamp) => {
  try {
    const messages = await deletedMessageDb.findAll({
      where: {
        jid,
        deletedAt: {
          [Op.gte]: sinceTimestamp,
        },
      },
      order: [['deletedAt', 'DESC']],
      limit: 100, // Performance: Limit results
    });

    return messages;
  } catch (error) {
    logger.error("Error loading deleted messages:", error);
    throw new Error("Error loading deleted messages");
  }
};

const saveDeletedMessage = async ({ id, jid, originalMessageId, deletedAt = new Date() }) => {
  if (!id || !jid || !originalMessageId) return;
  try {
    await dbQueue.add(() => deletedMessageDb.upsert({
      id,
      jid,
      originalMessageId,
      deletedAt,
    }));
  } catch (error) {
    logger.warn("Save deleted message error:", error.message || error);
  }
};

// Performance: Optimized chat saving with cache
const chatCache = new Map();

const saveChat = async (chat) => {
  try {
    if (!chat?.id || chat.id === "status@broadcast" || chat.id === "broadcast") return;
    if (!chat.conversationTimestamp) return;
    
    const cacheKey = `chat_${chat.id}`;
    const cached = chatCache.get(cacheKey);
    if (cached && cached.timestamp === chat.conversationTimestamp) return;
    
    const isGroup = isJidGroup(chat.id);
    
    // Queue the database operation to prevent SQLite locking
    const result = await dbQueue.add(async () => {
      let retries = 3;
      
      while (retries > 0) {
        try {
          // Use findOrCreate to handle race conditions
          const [chatRecord, created] = await chatDb.findOrCreate({
            where: { id: chat.id },
            defaults: {
              id: chat.id,
              conversationTimestamp: chat.conversationTimestamp,
              isGroup,
            }
          });
          
          // If record exists but timestamp is different, update it
          if (!created && chatRecord.conversationTimestamp !== chat.conversationTimestamp) {
            await chatRecord.update({ 
              conversationTimestamp: chat.conversationTimestamp 
            });
          }
          
          return chatRecord;
        } catch (error) {
          retries--;
          
          if (error.name === 'SequelizeTimeoutError' || error.parent?.code === 'SQLITE_BUSY') {
            if (retries > 0) {
              // Wait longer before retry for database locks
              await new Promise(resolve => setTimeout(resolve, 100 * (4 - retries)));
              continue;
            }
          }
          
          throw error;
        }
      }
    });
    
    chatCache.set(cacheKey, { timestamp: chat.conversationTimestamp });
    return result;
  } catch (e) {
    logger.warn("Save chat error:", e.message || e);
    return null;
  }
};

// Performance: Optimized name getter with cache
const getName = async (jid) => {
  try {
    const cacheKey = `name_${jid}`;
    const cached = contactCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return cached.name;
    }
    
    const contact = await contactDb.findOne({ where: { jid } });
    const name = contact?.name || jid.split("@")[0].replace(/_/g, " ");
    
    contactCache.set(cacheKey, { name, timestamp: Date.now() });
    return name;
  } catch (e) {
    logger.warn("Get name error:", e);
    return jid.split("@")[0].replace(/_/g, " ");
  }
};
module.exports = {
  saveMessage,
  loadMessage,
  loadDeletedMessages,
  saveDeletedMessage,
  saveChat,
  getName,
  flushMessageQueue,
};