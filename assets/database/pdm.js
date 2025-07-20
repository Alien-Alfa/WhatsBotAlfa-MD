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

  // Create MongoDB-compatible interface that matches SQLite exports
  const mongoInterface = {
    PdmDB: null, // MongoDB doesn't use this
    
    // MongoDB functions (new interface)
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
    
    async getPDM() {
      try {
        const models = await initModels();
        const pdms = await models.PDM.find({ isEnabled: true });
        return pdms;
      } catch (error) {
        console.warn("MongoDB getPDM error:", error);
        return [];
      }
    },
    
    // SQLite-compatible interface for settings.js
    PDM: {
      findOne: async (options) => {
        try {
          const models = await initModels();
          const query = {};
          if (options.where && options.where.chatId) {
            query.jid = options.where.chatId;
          }
          return await models.PDM.findOne(query);
        } catch (error) {
          console.warn("MongoDB PDM.findOne error:", error);
          return null;
        }
      },
      create: async (data) => {
        try {
          const models = await initModels();
          return await models.PDM.create({ jid: data.chatId, isEnabled: true });
        } catch (error) {
          console.warn("MongoDB PDM.create error:", error);
          return null;
        }
      },
      findAll: async (options = {}) => {
        try {
          const models = await initModels();
          return await models.PDM.find({});
        } catch (error) {
          console.warn("MongoDB PDM.findAll error:", error);
          return [];
        }
      },
      destroy: async (options) => {
        try {
          const models = await initModels();
          if (options.where && options.where.chatId) {
            const result = await models.PDM.deleteOne({ jid: options.where.chatId });
            return result.deletedCount;
          }
          return 0;
        } catch (error) {
          console.warn("MongoDB PDM.destroy error:", error);
          return 0;
        }
      }
    },

    // Export the same functions as SQLite version for compatibility
    savePDM: async (chatId) => {
      try {
        const models = await initModels();
        return await models.PDM.findOneAndUpdate(
          { jid: chatId },
          { jid: chatId, isEnabled: true },
          { upsert: true, new: true }
        );
      } catch (error) {
        console.warn("MongoDB savePDM error:", error);
        return null;
      }
    },

    deleteAllPDM: async () => {
      try {
        const models = await initModels();
        const result = await models.PDM.deleteMany({});
        return result.deletedCount;
      } catch (error) {
        console.warn("MongoDB deleteAllPDM error:", error);
        return 0;
      }
    }
  };

  module.exports = mongoInterface;
  
  return;
}

// Safety check for SQLite mode when DATABASE is not configured
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
