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
        }
        
        const PausedChatModel = mongoManager.getModels().PausedChat;
        return await PausedChatModel.find({});
      } catch (error) {
        console.warn("Get paused chats error:", error);
        console.error("Full error details:", error);
        return [];
      }
    },

    async savePausedChat(chatId, pausedBy = "system", reason = "Manual pause") {
      try {
        const models = mongoManager.getModels();
        if (!models.PausedChat) {
          await mongoManager.connect();
        }
        
        // Ensure we have the correct model reference
        const PausedChatModel = mongoManager.getModels().PausedChat;
        
        // Debug: Check if model exists and log schema
        console.log("🔍 PausedChat model exists:", !!PausedChatModel);
        if (PausedChatModel) {
          console.log("🔍 PausedChat schema paths:", Object.keys(PausedChatModel.schema.paths));
        }
        
        // Since the current schema uses 'jid' field, use that instead of 'chatId'
        const pauseData = {
          jid: chatId,  // Use jid field that exists in schema
          reason,
          pausedBy,
          pausedAt: new Date(),
          isPaused: true
        };
        
        // Use upsert logic manually with existing schema
        try {
          return await PausedChatModel.findOneAndUpdate(
            { jid: chatId },  // Search by jid field
            pauseData,
            { upsert: true, new: true, strict: false }
          );
        } catch (error) {
          console.warn("findOneAndUpdate failed, trying create:", error.message);
          // Fallback to create
          try {
            return await PausedChatModel.create(pauseData);
          } catch (createError) {
            if (createError.code === 11000) {
              // Document exists, just return it
              return await PausedChatModel.findOne({ jid: chatId });
            }
            throw createError;
          }
        }
      } catch (error) {
        console.warn("Save paused chat error:", error);
        console.error("Full error details:", error);
        return null;
      }
    },

    async deletePausedChat(chatId) {
      try {
        const models = mongoManager.getModels();
        if (!models.PausedChat) {
          await mongoManager.connect();
        }
        
        const PausedChatModel = mongoManager.getModels().PausedChat;
        // Use jid field to match the current schema
        return await PausedChatModel.deleteOne({ jid: chatId });
      } catch (error) {
        console.warn("Delete paused chat error:", error);
        console.error("Full error details:", error);
        return null;
      }
    },

    async deleteAllPausedChats() {
      try {
        const models = mongoManager.getModels();
        if (!models.PausedChat) {
          await mongoManager.connect();
        }
        
        const PausedChatModel = mongoManager.getModels().PausedChat;
        return await PausedChatModel.deleteMany({});
      } catch (error) {
        console.warn("Delete all paused chats error:", error);
        console.error("Full error details:", error);
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
