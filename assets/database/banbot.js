const config = require('../../config');
const { DataTypes } = require('sequelize');

// MongoDB Support
if (config.USE_MONGODB && config.MONGODB_URI) {
  // Use MongoDB for Banbot
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
    BanBotDB: null, // MongoDB doesn't use Sequelize models
    banbot: {
      findOne: async () => null, // Mock Sequelize findOne for settings.js compatibility
      create: async () => null,
      findAll: async () => [],
      destroy: async () => true
    },
    
    async addBanBot(jid) {
      try {
        const models = await initModels();
        const result = await models.BanBot.findOneAndUpdate(
          { jid: jid },
          { jid, isBanned: true },
          { upsert: true, new: true }
        );
        return result;
      } catch (error) {
        logger.warn("MongoDB addBanBot error:", error);
        return null;
      }
    },
    
    async removeBanBot(jid) {
      try {
        const models = await initModels();
        const result = await models.BanBot.deleteOne({ jid: jid });
        return result.deletedCount > 0;
      } catch (error) {
        logger.warn("MongoDB removeBanBot error:", error);
        return false;
      }
    },
    
    async isBanBot(jid) {
      try {
        const models = await initModels();
        const banBot = await models.BanBot.findOne({ jid: jid });
        return banBot ? banBot.isBanned : false;
      } catch (error) {
        logger.warn("MongoDB isBanBot error:", error);
        return false;
      }
    }
  };
  
  return;
}

// Safety check for SQLite mode when DATABASE is not configured
if (!config.DATABASE) {
  logger.info('⚠️ Banbot feature disabled in MongoDB mode');
  module.exports = {
    banbot: null,
    saveBan: async () => null,
    checkBan: async () => false,
    deleteBan: async () => null,
    getBanCount: async () => 0,
    getBans: async () => []
  };
  return;
}

const banbot = config.DATABASE.define('banbot', {
  chatId: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  }
});

async function getbanbot() {
  return await banbot.findAll();
}

async function savebanbot(chatId) {
  return await banbot.create({ chatId });
}

async function deleteAllbanbot() {
  return await banbot.destroy({
    where: {},
    truncate: true
  });
}

module.exports = {
  banbot,
  getbanbot,
  savebanbot,
  deleteAllbanbot
};
