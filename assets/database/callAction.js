const config = require('../../config');
const { DataTypes } = require('sequelize');

// MongoDB Support
if (config.USE_MONGODB && config.MONGODB_URI) {
  // Use MongoDB for CallAction
  const mongoManager = require("./mongodb");
  let models = null;

  const initModels = async () => {
    if (!models) {
      models = await mongoManager.connect();
    }
    return models;
  };

  module.exports = {
    CallActionDB: null, // MongoDB doesn't use Sequelize models
    
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
        console.warn("MongoDB addCallAction error:", error);
        return null;
      }
    },
    
    async removeCallAction(jid) {
      try {
        const models = await initModels();
        const result = await models.CallAction.deleteOne({ jid: jid });
        return result.deletedCount > 0;
      } catch (error) {
        console.warn("MongoDB removeCallAction error:", error);
        return false;
      }
    },
    
    async isCallAction(jid) {
      try {
        const models = await initModels();
        const callAction = await models.CallAction.findOne({ jid: jid });
        return callAction ? callAction.isEnabled : false;
      } catch (error) {
        console.warn("MongoDB isCallAction error:", error);
        return false;
      }
    }
  };
  
  return;
}

// Safety check for SQLite mode when DATABASE is not configured
if (!config.DATABASE) {
  console.log('⚠️ CallAction feature disabled in MongoDB mode');
  module.exports = {
    call: null,
    saveCall: async () => null,
    checkCall: async () => false,
    deleteCall: async () => null
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

module.exports = {
  call,
  getcall,
  savecall,
  deleteAllcall
};
