const config = require('../../config');
const { DataTypes } = require('sequelize');

// MongoDB Support
if (config.USE_MONGODB && config.MONGODB_URI) {
  // Use MongoDB for StickBan
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
    StickBanDB: null, // MongoDB doesn't use Sequelize models
    
    async addStickBan(jid) {
      try {
        const models = await initModels();
        const result = await models.StickBan.findOneAndUpdate(
          { jid: jid },
          { jid, isBanned: true },
          { upsert: true, new: true }
        );
        return result;
      } catch (error) {
        logger.warn("MongoDB addStickBan error:", error);
        return null;
      }
    },
    
    async removeStickBan(jid) {
      try {
        const models = await initModels();
        const result = await models.StickBan.deleteOne({ jid: jid });
        return result.deletedCount > 0;
      } catch (error) {
        logger.warn("MongoDB removeStickBan error:", error);
        return false;
      }
    },
    
    async isStickBan(jid) {
      try {
        const models = await initModels();
        const stickBan = await models.StickBan.findOne({ jid: jid });
        return stickBan ? stickBan.isBanned : false;
      } catch (error) {
        logger.warn("MongoDB isStickBan error:", error);
        return false;
      }
    }
  };
  
  return;
}

// Safety check for SQLite mode when DATABASE is not configured
if (!config.DATABASE) {
  logger.info('⚠️ StickBan feature disabled in MongoDB mode');
  module.exports = {
    StickBan: null,
    addBan: async () => null,
    removeBan: async () => null,
    getBan: async () => false
  };
  return;
}

const StickBan = config.DATABASE.define("StickBan", {
  chat: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  stickid: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
});


async function getConfig() {
  try {
    // Retrieve all configurations from the SettingsDB table
    const allConfigs = await SettingsDB.findAll();

    if (allConfigs.length < 1) {
      return false;
    } else {
      return allConfigs;
    }
  } catch (error) {
    logger.error("Error fetching configurations:", error);
    return false;
  }
}

async function getStickBan(jid = null) {

  var Where = { chat: jid };
  var Msg = await StickBan.findAll({
    where: Where,
  });

  if (Msg.length < 1) {
    return null;
  } else {
    // Assuming StickBan model has a property named "stickid"
    return Msg.map(item => item.stickid);
  }
}

async function saveStickBan(jid = null, stickid = null) {
  var Msg = await StickBan.findAll({
    where: {
      chat: jid,
      stickid: stickid,
    },
  });

  if (Msg.length < 1) {
    return await StickBan.create({
      chat: jid,
      stickid: stickid,
    });
  } else {
    return await Msg[0].update({
      chat: jid,
      stickid: stickid,
    });
  }
}

async function deleteStickBan(jid = null, stickid) {
  var Msg = await StickBan.findAll({
    where: {
      chat: jid,
      stickid: stickid,
    },
  });
  if (Msg.length < 1) {
    return false;
  } else {
    return await Msg[0].destroy();
  }
}

module.exports = {
  StickBan: StickBan,
  getStickBan: getStickBan,
  saveStickBan: saveStickBan,
  deleteStickBan: deleteStickBan,
};
