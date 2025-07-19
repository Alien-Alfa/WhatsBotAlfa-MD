// Made with ❤ by AlienAlfa
// Universal PausedChat adapter for both MongoDB and SQL

const config = require('../../config');

let PausedChatOperations;

if (config.USE_MONGODB && config.MONGODB_URI) {
  // MongoDB operations
  const mongoManager = require('./mongodb');
  
  PausedChatOperations = {
    async getPausedChats() {
      try {
        const models = mongoManager.getModels();
        if (!models.PausedChat) {
          await mongoManager.connect();
          return await mongoManager.getModels().PausedChat.find({});
        }
        return await models.PausedChat.find({});
      } catch (error) {
        console.warn("Get paused chats error:", error);
        return [];
      }
    },

    async savePausedChat(chatId, pausedBy = "system", reason = "Manual pause") {
      try {
        const models = mongoManager.getModels();
        if (!models.PausedChat) {
          await mongoManager.connect();
        }
        return await mongoManager.getModels().PausedChat.findOneAndUpdate(
          { chatId },
          { chatId, pausedBy, reason },
          { upsert: true, new: true }
        );
      } catch (error) {
        console.warn("Save paused chat error:", error);
        return null;
      }
    },

    async deletePausedChat(chatId) {
      try {
        const models = mongoManager.getModels();
        if (!models.PausedChat) {
          await mongoManager.connect();
        }
        return await mongoManager.getModels().PausedChat.deleteOne({ chatId });
      } catch (error) {
        console.warn("Delete paused chat error:", error);
        return null;
      }
    },

    async deleteAllPausedChats() {
      try {
        const models = mongoManager.getModels();
        if (!models.PausedChat) {
          await mongoManager.connect();
        }
        return await mongoManager.getModels().PausedChat.deleteMany({});
      } catch (error) {
        console.warn("Delete all paused chats error:", error);
        return null;
      }
    }
  };
} else {
  // Fallback to Sequelize operations
  const { DataTypes } = require('sequelize');
  
  const PausedChats = config.DATABASE.define('pausedChats', {
    chatId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    }
  });

  PausedChatOperations = {
    PausedChats,
    
    async getPausedChats() {
      return await PausedChats.findAll();
    },

    async savePausedChat(chatId) {
      return await PausedChats.create({ chatId });
    },

    async deletePausedChat(chatId) {
      return await PausedChats.destroy({ where: { chatId } });
    },

    async deleteAllPausedChats() {
      return await PausedChats.destroy({
        where: {},
        truncate: true
      });
    }
  };
}

module.exports = {
  PausedChats: PausedChatOperations,
  ...PausedChatOperations
};
