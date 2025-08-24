const config = require("../../config");
const { DataTypes } = require("sequelize");

// MongoDB Support
if (config.USE_MONGODB && config.MONGODB_URI) {
  // Use MongoDB for PausedChat
  const mongoManager = require("./mongodb");
const logger = require("../../lib/logger");
  let models = null;

  const initModels = async () => {
    if (!models) {
      models = await mongoManager.connect();
    }
    return models;
  };

  module.exports = {
    PausedChatDB: null, // MongoDB doesn't use Sequelize models
    
    async addPausedChat(jid) {
      try {
        const models = await initModels();
        const result = await models.PausedChat.findOneAndUpdate(
          { jid: jid },
          { jid, isPaused: true },
          { upsert: true, new: true }
        );
        return result;
      } catch (error) {
        logger.warn("MongoDB addPausedChat error:", error);
        return null;
      }
    },
    
    async removePausedChat(jid) {
      try {
        const models = await initModels();
        const result = await models.PausedChat.deleteOne({ jid: jid });
        return result.deletedCount > 0;
      } catch (error) {
        logger.warn("MongoDB removePausedChat error:", error);
        return false;
      }
    },
    
    async isPausedChat(jid) {
      try {
        const models = await initModels();
        const pausedChat = await models.PausedChat.findOne({ jid: jid });
        return pausedChat ? pausedChat.isPaused : false;
      } catch (error) {
        logger.warn("MongoDB isPausedChat error:", error);
        return false;
      }
    },
    
    async getPausedChats() {
      try {
        const models = await initModels();
        const pausedChats = await models.PausedChat.find({ isPaused: true });
        return pausedChats;
      } catch (error) {
        logger.warn("MongoDB getPausedChats error:", error);
        return [];
      }
    }
  };
  
  return;
}

// Safety check for SQLite mode when DATABASE is not configured
if (!config.DATABASE) {
  logger.info('⚠️ PausedChat feature disabled in MongoDB mode');
  module.exports = {
    PausedChats: null,
    addPausedChat: async () => null,
    removePausedChat: async () => null,
    isPaused: async () => false,
    getPausedChats: async () => []
  };
  return;
}

const PausedChats = config.DATABASE.define('pausedChats', {
  chatId: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  }
});

async function addPausedChat(chatId) {
  try {
    return await PausedChats.create({ chatId });
  } catch (error) {
    logger.error('Error adding paused chat:', error);
    return null;
  }
}

async function removePausedChat(chatId) {
  try {
    return await PausedChats.destroy({ where: { chatId } });
  } catch (error) {
    logger.error('Error removing paused chat:', error);
    return null;
  }
}

async function isPaused(chatId) {
  try {
    const result = await PausedChats.findOne({ where: { chatId } });
    return !!result;
  } catch (error) {
    logger.error('Error checking paused chat:', error);
    return false;
  }
}

async function getPausedChats() {
  try {
    const results = await PausedChats.findAll();
    return results.map(chat => chat.chatId);
  } catch (error) {
    logger.error('Error getting paused chats:', error);
    return [];
  }
}

module.exports = {
  PausedChats,
  addPausedChat,
  removePausedChat,
  isPaused,
  getPausedChats
};
