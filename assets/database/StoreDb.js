// Made with ❤ by AlienAlfa
// Performance optimized database operations

const { isJidGroup } = require("@whiskeysockets/baileys");
const config = require("../../config");
const { DataTypes, Op } = require("sequelize");

// MongoDB Safety Check: Prevent database operations in MongoDB mode
if (!config.DATABASE) {
  // MongoDB mode - provide safe fallback functions
  module.exports = {
    saveMessage: async () => null,
    loadMessage: async () => null,
    loadDeletedMessages: async () => [],
    saveChat: async () => null,
    getName: async (jid) => jid.split("@")[0].replace(/_/g, " "),
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

const saveContact = async (jid, name) => {
  try {
    if (!jid || !name || isJidGroup(jid)) return;
    
    // Performance: Check cache first
    const cacheKey = `contact_${jid}`;
    const cached = contactCache.get(cacheKey);
    if (cached && cached.name === name && Date.now() - cached.timestamp < CACHE_TTL) {
      return;
    }
    
    const exists = await contactDb.findOne({ where: { jid } });
    if (exists) {
      if (exists.name === name) {
        // Update cache
        contactCache.set(cacheKey, { name, timestamp: Date.now() });
        return;
      }
      const result = await contactDb.update({ name }, { where: { jid } });
      contactCache.set(cacheKey, { name, timestamp: Date.now() });
      return result;
    } else {
      const result = await contactDb.create({ jid, name });
      contactCache.set(cacheKey, { name, timestamp: Date.now() });
      return result;
    }
  } catch (e) {
    console.warn("Save contact error:", e);
  }
};

// Performance: Optimized message saving with batching
const messageBatch = [];
let messageBatchTimer = null;

const saveMessage = async (message, user) => {
  try {
    if (!message?.key?.id) return;
    
    // Performance: Add to batch instead of immediate save
    messageBatch.push({ message, user });
    
    if (messageBatchTimer) clearTimeout(messageBatchTimer);
    messageBatchTimer = setTimeout(async () => {
      const batch = [...messageBatch];
      messageBatch.length = 0;
      
      try {
        await Promise.allSettled(
          batch.map(async ({ message, user }) => {
            const cacheKey = `msg_${message.key.id}`;
            if (messageCache.has(cacheKey)) return;
            
            await messageDb.upsert({
              id: message.key.id,
              jid: message.key.remoteJid,
              message: message,
            });
            
            messageCache.set(cacheKey, { timestamp: Date.now() });
            
            if (user && message.pushName) {
              await saveContact(user, message.pushName);
            }
          })
        );
      } catch (error) {
        console.warn("Batch message save error:", error);
      }
    }, 100); // Batch every 100ms
  } catch (e) {
    console.warn("Save message error:", e);
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
    console.warn("Load message error:", e);
    return null;
  }
};

const loadDeletedMessages = async (jid, sinceTimestamp) => {
  try {
    const messages = await messageDb.findAll({
      where: {
        jid,
        createdAt: {
          [Op.gte]: sinceTimestamp,
        },
      },
      order: [['createdAt', 'DESC']],
      limit: 100, // Performance: Limit results
    });

    return messages;
  } catch (error) {
    console.error("Error loading deleted messages:", error);
    throw new Error("Error loading deleted messages");
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
    const chatExists = await chatDb.findOne({ where: { id: chat.id } });
    
    if (chatExists) {
      const result = await chatDb.update(
        { conversationTimestamp: chat.conversationTimestamp },
        { where: { id: chat.id } }
      );
      chatCache.set(cacheKey, { timestamp: chat.conversationTimestamp });
      return result;
    } else {
      const result = await chatDb.create({
        id: chat.id,
        conversationTimestamp: chat.conversationTimestamp,
        isGroup,
      });
      chatCache.set(cacheKey, { timestamp: chat.conversationTimestamp });
      return result;
    }
  } catch (e) {
    console.warn("Save chat error:", e);
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
    console.warn("Get name error:", e);
    return jid.split("@")[0].replace(/_/g, " ");
  }
};
module.exports = {
  saveMessage,
  loadMessage,
  loadDeletedMessages,
  saveChat,
  getName,
};