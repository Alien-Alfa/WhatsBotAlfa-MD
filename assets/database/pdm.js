const config = require("../../config");
const { DataTypes } = require("sequelize");

// MongoDB Support
if (config.USE_MONGODB && config.MONGODB_URI) {
  // Use MongoDB for PDM
  const mongoManager = require("./mongodb");
  let models = null;

  const initModels = async () => {
    if (!models) {
      models = await mongoManager.connect();
    }
    return models;
  };

  module.exports = {
    PdmDB: null, // MongoDB doesn't use Sequelize models
    
    async addPDM(jid) {
      try {
        const models = await initModels();
        const result = await models.PDM.findOneAndUpdate(
          { jid: jid },
          { jid, isEnabled: true },
          { upsert: true, new: true }
        );
        return result;
      } catch (error) {
        console.warn("MongoDB addPDM error:", error);
        return null;
      }
    },
    
    async removePDM(jid) {
      try {
        const models = await initModels();
        const result = await models.PDM.deleteOne({ jid: jid });
        return result.deletedCount > 0;
      } catch (error) {
        console.warn("MongoDB removePDM error:", error);
        return false;
      }
    },
    
    async isPDM(jid) {
      try {
        const models = await initModels();
        const pdm = await models.PDM.findOne({ jid: jid });
        return pdm ? pdm.isEnabled : false;
      } catch (error) {
        console.warn("MongoDB isPDM error:", error);
        return false;
      }
    },
    
    async getPDMs() {
      try {
        const models = await initModels();
        const pdms = await models.PDM.find({ isEnabled: true });
        return pdms;
      } catch (error) {
        console.warn("MongoDB getPDMs error:", error);
        return [];
      }
    }
  };
  
  return;
}

// Safety check for SQLite mode when DATABASE is not configuredt config = require('../../config');
const { DataTypes } = require('sequelize');

// Safety check for MongoDB mode
if (!config.DATABASE) {
  console.log('⚠️ PDM feature disabled in MongoDB mode');
  module.exports = {
    PDM: null,
    savePDM: async () => null,
    checkPDM: async () => false,
    deletePDM: async () => null,
    getPDM: async () => []
  };
  return;
}

const PDM = config.DATABASE.define('PDM', {
  chatId: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  }
});

async function getPDM() {
  return await PDM.findAll();
}

async function savePDM(chatId) {
  return await PDM.create({ chatId });
}

async function deleteAllPDM() {
  return await PDM.destroy({
    where: {},
    truncate: true
  });
}

module.exports = {
  PDM,
  getPDM,
  savePDM,
  deleteAllPDM
};
