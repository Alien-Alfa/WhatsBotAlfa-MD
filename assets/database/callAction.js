const config = require('../../config');
const { DataTypes } = require('sequelize');

// MongoDB Support
if (config.USE_MONGODB && config.MONGODB_URI) {
  // Use MongoDB for CallAction
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
    CallActionDB: null, // MongoDB doesn't use Sequelize models
    call: {
      findOne: async () => null, // Mock Sequelize findOne for settings.js compatibility
      create: async () => null,
      findAll: async () => [],
      destroy: async () => true
    },
    
    async addCallAction(jid) {
      try {
        const models = await initModels();
        const result = await models.CallAction.findOneAndUpdate(
          { jid: jid },
          { jid, isEnabled: true },
          { upsert: true, new: true }
        );
        return result;
      } catch (error) {
        logger.warn("MongoDB addCallAction error:", error);
        return null;
      }
    },
    
    async removeCallAction(jid) {
      try {
        const models = await initModels();
        const result = await models.CallAction.deleteOne({ jid: jid });
        return result.deletedCount > 0;
      } catch (error) {
        logger.warn("MongoDB removeCallAction error:", error);
        return false;
      }
    },
    
    async isCallAction(jid) {
      try {
        const models = await initModels();
        const callAction = await models.CallAction.findOne({ jid: jid });
        return callAction ? callAction.isEnabled : false;
      } catch (error) {
        logger.warn("MongoDB isCallAction error:", error);
        return false;
      }
    },

    async listCallActions() {
      try {
        const models = await initModels();
        const entries = await models.CallAction.find({ isEnabled: true }).sort({ jid: 1 }).lean();
        return entries.map(entry => entry.jid);
      } catch (error) {
        logger.warn("MongoDB listCallActions error:", error);
        return [];
      }
    },

    async setCallAction(jid, enabled) {
      return enabled ? !!(await this.addCallAction(jid)) : await this.removeCallAction(jid);
    }
  };
  
  return;
}

// Safety check for SQLite mode when DATABASE is not configured
if (!config.DATABASE) {
  logger.info('⚠️ CallAction feature disabled in MongoDB mode');
  module.exports = {
    call: null,
    saveCall: async () => null,
    checkCall: async () => false,
    deleteCall: async () => null,
    listCallActions: async () => [],
    setCallAction: async () => false,
  };
  return;
}

const call = config.DATABASE.define('call', {
  chatId: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  }
});

async function getcall() {
  return await call.findAll();
}

async function savecall(chatId) {
  return await call.create({ chatId });
}

async function deleteAllcall() {
  return await call.destroy({
    where: {},
    truncate: true
  });
}

async function listCallActions() {
  const entries = await call.findAll({ order: [['chatId', 'ASC']] });
  return entries.map(entry => entry.chatId);
}

async function setCallAction(chatId, enabled) {
  if (enabled) {
    await call.findOrCreate({ where: { chatId }, defaults: { chatId } });
    return true;
  }
  await call.destroy({ where: { chatId } });
  return true;
}

module.exports = {
  call,
  getcall,
  savecall,
  deleteAllcall,
  listCallActions,
  setCallAction,
};
