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
        
        // Use create instead of findOneAndUpdate to avoid strict mode issues
        const newPausedChat = new PausedChatModel({
          chatId,
          jid: chatId, // Also set jid for compatibility
          pausedBy,
          reason,
          pausedAt: new Date(),
          isPaused: true
        });
        
        // Use upsert logic manually
        try {
          return await newPausedChat.save();
        } catch (duplicateError) {
          if (duplicateError.code === 11000) {
            // Document already exists, update it
            return await PausedChatModel.findOneAndUpdate(
              { chatId },
              { 
                pausedBy,
                reason,
                pausedAt: new Date(),
                isPaused: true,
                jid: chatId
              },
              { new: true, strict: false }
            );
          }
          throw duplicateError;
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
        return await PausedChatModel.deleteOne({ chatId });
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
