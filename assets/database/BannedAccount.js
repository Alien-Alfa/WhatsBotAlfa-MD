const config = require('../../config');
const { DataTypes } = require('sequelize');

// MongoDB Support
if (config.USE_MONGODB && config.MONGODB_URI) {
  // Use MongoDB for BannedAccount
  const mongoModels = require("./mongoModels");
const logger = require("../../lib/logger");

  const getModels = async () => {
    return await mongoModels.getMongoModels();
  };

  module.exports = {
    BannedAccountDB: null, // MongoDB doesn't use Sequelize models
    
    async addBannedAccount(jid) {
      try {
        const models = await getModels();
        if (!models || !models.BannedAccount) {
          logger.warn("MongoDB BannedAccount model not available");
          return null;
        }
        
        const result = await models.BannedAccount.findOneAndUpdate(
          { jid: jid },
          { jid, isBanned: true },
          { upsert: true, new: true }
        );
        return result;
      } catch (error) {
        logger.warn("MongoDB addBannedAccount error:", error);
        return null;
      }
    },
    
    async removeBannedAccount(jid) {
      try {
        const models = await getModels();
        const result = await models.BannedAccount.deleteOne({ jid: jid });
        return result.deletedCount > 0;
      } catch (error) {
        logger.warn("MongoDB removeBannedAccount error:", error);
        return false;
      }
    },
    
    async isBannedAccount(jid) {
      try {
        const models = await getModels();
        const bannedAccount = await models.BannedAccount.findOne({ jid: jid });
        return bannedAccount ? bannedAccount.isBanned : false;
      } catch (error) {
        logger.warn("MongoDB isBannedAccount error:", error);
        return false;
      }
    },
    
    async getUserBan(jid = null) {
      try {
        const models = await getModels();
        if (!models || !models.BannedAccount) {
          logger.warn("MongoDB BannedAccount model not available");
          return [];
        }
        
        if (jid) {
          const bannedAccount = await models.BannedAccount.findOne({ jid: jid });
          return bannedAccount ? [bannedAccount] : [];
        } else {
          const bannedAccounts = await models.BannedAccount.find({ isBanned: true });
          return bannedAccounts;
        }
      } catch (error) {
        logger.warn("MongoDB getUserBan error:", error);
        return [];
      }
    }
  };

  // Export MongoDB functions with SQLite-compatible interface
  module.exports = {
    UserBan: null, // MongoDB doesn't use Sequelize models
    getUserBan: async function(jid = null) {
      try {
        const models = await getModels();
        if (!models || !models.BannedAccount) {
          logger.warn("MongoDB BannedAccount model not available");
          return [];
        }
        if (jid) {
          const bannedAccount = await models.BannedAccount.findOne({ jid: jid });
          return bannedAccount ? [bannedAccount] : [];
        } else {
          const bannedAccounts = await models.BannedAccount.find({ isBanned: true });
          return bannedAccounts;
        }
      } catch (error) {
        logger.warn("MongoDB getUserBan error:", error);
        return [];
      }
    },
    saveUserBan: async function(jid, bannedid) {
      try {
        const models = await getModels();
        const result = await models.BannedAccount.findOneAndUpdate(
          { jid: jid },
          { jid, isBanned: true },
          { upsert: true, new: true }
        );
        return result;
      } catch (error) {
        logger.warn("MongoDB saveUserBan error:", error);
        return null;
      }
    },
    deleteUserBan: async function(jid, bannedid) {
      try {
        const models = await getModels();
        const result = await models.BannedAccount.deleteOne({ jid: jid });
        return result.deletedCount > 0;
      } catch (error) {
        logger.warn("MongoDB deleteUserBan error:", error);
        return false;
      }
    }
  };
  
  return;
}

// Safety check for SQLite mode when DATABASE is not configured

// Safety check for MongoDB mode
if (!config.DATABASE) {
  logger.info('⚠️ UserBan feature disabled in MongoDB mode');
  module.exports = {
    UserBan: null,
    addBan: async () => null,
    removeBan: async () => null,
    getBan: async () => false
  };
  return;
}

const UserBan = config.DATABASE.define("UserBan", {
  chatid: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  bannedid: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
});


async function getchatid() {
  try {
    const allchatids = await SettingsDB.findAll();

    if (allchatids.length < 1) {
      return false;
    } else {
      return allchatids;
    }
  } catch (error) {
    logger.error("Error fetching chatidurations:", error);
    return false;
  }
}

async function getUserBan(jid = null) {

  var Where = { chatid: jid };
  var Msg = await UserBan.findAll({
    where: Where,
  });

  if (Msg.length < 1) {
    return null;
  } else {
    // Assuming UserBan model has a property named "bannedid"
    return Msg.map(item => item.bannedid);
  }
}

async function saveUserBan(jid = null, bannedid = null) {
  var Msg = await UserBan.findAll({
    where: {
      chatid: jid,
      bannedid: bannedid,
    },
  });

  if (Msg.length < 1) {
    return await UserBan.create({
      chatid: jid,
      bannedid: bannedid,
    });
  } else {
    return await Msg[0].update({
      chatid: jid,
      bannedid: bannedid,
    });
  }
}

async function deleteUserBan(jid = null, bannedid) {
  var Msg = await UserBan.findAll({
    where: {
      chatid: jid,
      bannedid: bannedid,
    },
  });
  if (Msg.length < 1) {
    return false;
  } else {
    return await Msg[0].destroy();
  }
}

module.exports = {
  UserBan: UserBan,
  getUserBan: getUserBan,
  saveUserBan: saveUserBan,
  deleteUserBan: deleteUserBan,
};
