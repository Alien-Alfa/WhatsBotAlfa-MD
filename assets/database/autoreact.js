const config = require("../../config");
const { DataTypes } = require("sequelize");

// MongoDB Support
if (config.USE_MONGODB && config.MONGODB_URI) {
  // Use MongoDB for AutoReact
  const mongoManager = require("./mongodb");
  let models = null;

  const initModels = async () => {
    if (!models) {
      models = await mongoManager.connect();
    }
    return models;
  };

  module.exports = {
    AutoReactDB: null, // MongoDB doesn't use Sequelize models
    React: {
      findOne: async () => null, // Mock Sequelize findOne for settings.js compatibility
      create: async () => null,
      findAll: async () => [],
      destroy: async () => true
    },
    
    async addAutoReact(jid) {
      try {
        const models = await initModels();
        const result = await models.AutoReact.findOneAndUpdate(
          { jid: jid },
          { jid, isEnabled: true },
          { upsert: true, new: true }
        );
        return result;
      } catch (error) {
        console.warn("MongoDB addAutoReact error:", error);
        return null;
      }
    },
    
    async removeAutoReact(jid) {
      try {
        const models = await initModels();
        const result = await models.AutoReact.deleteOne({ jid: jid });
        return result.deletedCount > 0;
      } catch (error) {
        console.warn("MongoDB removeAutoReact error:", error);
        return false;
      }
    },
    
    async isAutoReact(jid) {
      try {
        const models = await initModels();
        const autoReact = await models.AutoReact.findOne({ jid: jid });
        return autoReact ? autoReact.isEnabled : false;
      } catch (error) {
        console.warn("MongoDB isAutoReact error:", error);
        return false;
      }
    },
    
    async getAutoReacts() {
      try {
        const models = await initModels();
        const autoReacts = await models.AutoReact.find({ isEnabled: true });
        return autoReacts;
      } catch (error) {
        console.warn("MongoDB getAutoReacts error:", error);
        return [];
      }
    },

    // Additional function aliases for compatibility
    async getReact() {
      return await this.getAutoReacts();
    }
  };
  
  return;
}

// Safety check for SQLite mode when DATABASE is not configured
if (!config.DATABASE) {
  console.log('⚠️ AutoReact feature disabled in MongoDB mode');
  module.exports = {
    React: null,
    saveReact: async () => null,
    checkReact: async () => false,
    deleteReact: async () => null,
    getReact: async () => []
  };
  return;
}

const React = config.DATABASE.define('React', {
  chatId: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  }
});

async function getReact() {
  return await React.findAll();
}

async function saveReact(chatId) {
  return await React.create({ chatId });
}

async function deleteAllReact() {
  return await React.destroy({
    where: {},
    truncate: true
  });
}

module.exports = {
  React: {
    getReact: getReact
  },
  getReact,
  saveReact,
  deleteAllReact
};
