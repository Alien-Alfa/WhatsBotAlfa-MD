const config = require("../../config");
const { DataTypes } = require("sequelize");

// Safety check for MongoDB mode
if (!config.DATABASE) {
  console.log('⚠️ PausedChat feature disabled in MongoDB mode');
  module.exports = {
    PausedChats: null,
    addPausedChat: async () => null,
    removePausedChat: async () => null,
    isPaused: async () => false,
    getPausedChats: async () => []
  };
  return;
}

const PausedChats = config.DATABASE.define('pausedChats', {
  chatId: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  }
});

async function addPausedChat(chatId) {
  try {
    return await PausedChats.create({ chatId });
  } catch (error) {
    console.error('Error adding paused chat:', error);
    return null;
  }
}

async function removePausedChat(chatId) {
  try {
    return await PausedChats.destroy({ where: { chatId } });
  } catch (error) {
    console.error('Error removing paused chat:', error);
    return null;
  }
}

async function isPaused(chatId) {
  try {
    const result = await PausedChats.findOne({ where: { chatId } });
    return !!result;
  } catch (error) {
    console.error('Error checking paused chat:', error);
    return false;
  }
}

async function getPausedChats() {
  try {
    const results = await PausedChats.findAll();
    return results.map(chat => chat.chatId);
  } catch (error) {
    console.error('Error getting paused chats:', error);
    return [];
  }
}

module.exports = {
  PausedChats,
  addPausedChat,
  removePausedChat,
  isPaused,
  getPausedChats
};
