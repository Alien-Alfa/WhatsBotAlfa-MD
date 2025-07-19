const config = require("../../config");
const { DataTypes } = require("sequelize");

// MongoDB Support
if (config.USE_MONGODB && config.MONGODB_URI) {
  // Use MongoDB for AiChat
  const mongoManager = require("./mongodb");
  let models = null;

  const initModels = async () => {
    if (!models) {
      models = await mongoManager.connect();
    }
    return models;
  };

  module.exports = {
    AiChatDB: null, // MongoDB doesn't use Sequelize models
    
    async addAiChat(jid) {
      try {
        const models = await initModels();
        const result = await models.AiChat.findOneAndUpdate(
          { jid: jid },
          { jid, isEnabled: true },
          { upsert: true, new: true }
        );
        return result;
      } catch (error) {
        console.warn("MongoDB addAiChat error:", error);
        return null;
      }
    },
    
    async removeAiChat(jid) {
      try {
        const models = await initModels();
        const result = await models.AiChat.deleteOne({ jid: jid });
        return result.deletedCount > 0;
      } catch (error) {
        console.warn("MongoDB removeAiChat error:", error);
        return false;
      }
    },
    
    async isAiChat(jid) {
      try {
        const models = await initModels();
        const aiChat = await models.AiChat.findOne({ jid: jid });
        return aiChat ? aiChat.isEnabled : false;
      } catch (error) {
        console.warn("MongoDB isAiChat error:", error);
        return false;
      }
    },
    
    async getAiChats() {
      try {
        const models = await initModels();
        const aiChats = await models.AiChat.find({ isEnabled: true });
        return aiChats;
      } catch (error) {
        console.warn("MongoDB getAiChats error:", error);
        return [];
      }
    }
  };
  
  return;
}

// Safety check for SQLite mode when DATABASE is not configured
if (!config.DATABASE) {
  console.log('⚠️ AiChat feature disabled in MongoDB mode');
  module.exports = {
    Ai: null,
    saveAi: async () => null,
    checkAi: async () => false,
    deleteAi: async () => null
  };
  return;
}

const Ai = config.DATABASE.define('Ai', {
  chatId: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  }
});

async function getAi() {
  return await Ai.findAll();
}

async function saveAi(chatId) {
  return await Ai.create({ chatId });
}

async function deleteAllAi() {
  return await Ai.destroy({
    where: {},
    truncate: true
  });
}

module.exports = {
  Ai,
  getAi,
  saveAi,
  deleteAllAi
};
