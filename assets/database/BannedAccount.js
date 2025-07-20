const config = require('../../config');
const { DataTypes } = require('sequelize');

// MongoDB Support
if (config.USE_MONGODB && config.MONGODB_URI) {
  // Use MongoDB for BannedAccount
  const mongoManager = require("./mongodb");
  let models = null;

  const initModels = async () => {
    if (!models) {
      models = await mongoManager.connect();
    }
    return models;
  };

  module.exports = {
    BannedAccountDB: null, // MongoDB doesn't use Sequelize models
    
    async addBannedAccount(jid) {
      try {
        const models = await initModels();
        const result = await models.BannedAccount.findOneAndUpdate(
          { jid: jid },
          { jid, isBanned: true },
          { upsert: true, new: true }
        );
        return result;
      } catch (error) {
        console.warn("MongoDB addBannedAccount error:", error);
        return null;
      }
    },
    
    async removeBannedAccount(jid) {
      try {
        const models = await initModels();
        const result = await models.BannedAccount.deleteOne({ jid: jid });
        return result.deletedCount > 0;
      } catch (error) {
        console.warn("MongoDB removeBannedAccount error:", error);
        return false;
      }
    },
    
    async isBannedAccount(jid) {
      try {
        const models = await initModels();
        const bannedAccount = await models.BannedAccount.findOne({ jid: jid });
        return bannedAccount ? bannedAccount.isBanned : false;
      } catch (error) {
        console.warn("MongoDB isBannedAccount error:", error);
        return false;
      }
    }
  };
  
  return;
}

// Safety check for SQLite mode when DATABASE is not configuredt config = require("../../config");
const { DataTypes } = require("sequelize");

// Safety check for MongoDB mode
if (!config.DATABASE) {
  console.log('⚠️ UserBan feature disabled in MongoDB mode');
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
    console.error("Error fetching chatidurations:", error);
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
