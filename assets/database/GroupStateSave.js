const config = require('../../config');
const { DataTypes } = require('sequelize');

// MongoDB Support
if (config.USE_MONGODB && config.MONGODB_URI) {
  // Use MongoDB for GroupStateSave
  const mongoManager = require("./mongodb");
  let models = null;

  const initModels = async () => {
    if (!models) {
      models = await mongoManager.connect();
    }
    return models;
  };

  module.exports = {
    GroupStateSaveDB: null, // MongoDB doesn't use Sequelize models
    
    async saveGroupState(jid, state) {
      try {
        const models = await initModels();
        const result = await models.GroupStateSave.findOneAndUpdate(
          { jid: jid },
          { jid, state },
          { upsert: true, new: true }
        );
        return result;
      } catch (error) {
        console.warn("MongoDB saveGroupState error:", error);
        return null;
      }
    },
    
    async getGroupState(jid) {
      try {
        const models = await initModels();
        const groupState = await models.GroupStateSave.findOne({ jid: jid });
        return groupState ? groupState.state : null;
      } catch (error) {
        console.warn("MongoDB getGroupState error:", error);
        return null;
      }
    },
    
    async deleteGroupState(jid) {
      try {
        const models = await initModels();
        const result = await models.GroupStateSave.deleteOne({ jid: jid });
        return result.deletedCount > 0;
      } catch (error) {
        console.warn("MongoDB deleteGroupState error:", error);
        return false;
      }
    }
  };
  
  return;
}

// Safety check for SQLite mode when DATABASE is not configured

// Safety check for MongoDB mode
if (!config.DATABASE) {
  console.log('⚠️ GroupDB feature disabled in MongoDB mode');
  module.exports = {
    GroupDB: null,
    saveGroup: async () => null,
    getGroup: async () => null
  };
  return;
}

const GroupDB = config.DATABASE.define("GroupSnapshot", {
  chat: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  ProfilePic: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  metaData: { 
    type: DataTypes.STRING,
    allowNull: false,
  }
});

async function getSnapshot(jid = null) {
  if (!jid) return null; 

  const snapshot = await GroupDB.findAll({
    where: { chat: jid },
  });

  return snapshot.length > 0 ? snapshot : null;
}

async function setSnapshot(jid = null, pfp = null, metadata = null) {
  if (!jid || !pfp || !metadata) return null; 

  let existingSnapshot = await GroupDB.findOne({
    where: { chat: jid },
  });

  if (existingSnapshot) {
    try {
      await existingSnapshot.update({
        ProfilePic: pfp,
        metaData: metadata, 
      });
      return existingSnapshot;
    } catch (error) {
      console.error("Error updating snapshot:", error);
      return null; 
    }
  } else {
    try {
      return await GroupDB.create({
        chat: jid,
        ProfilePic: pfp,
        metaData: metadata, 
      });
    } catch (error) {
      console.error("Error creating snapshot:", error);
      return null; 
    }
  }
}

async function deleteSnapshot(jid = null) {
  if (!jid) return null; 

  const existingSnapshot = await GroupDB.findOne({
    where: { chat: jid },
  });

  if (!existingSnapshot) return null; 

  try {
    await existingSnapshot.destroy();
    return true; 
  } catch (error) {
    console.error("Error deleting snapshot:", error);
    return false; 
  }
}

module.exports = {
  GroupDB,
  getSnapshot,
  setSnapshot,
  deleteSnapshot,
};
