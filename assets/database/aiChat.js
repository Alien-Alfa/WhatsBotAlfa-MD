const config = require('../../config');
const { DataTypes } = require('sequelize');

// Safety check for MongoDB mode
if (!config.DATABASE) {
  console.log('⚠️ AiChat feature disabled in MongoDB mode');
  module.exports = {
    Ai: null,
    saveAi: async () => null,
    checkAi: async () => false,
    deleteAi: async () => null
  };
  return;
}

const Ai = config.DATABASE.define('Ai', {
  chatId: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  }
});

async function getAi() {
  return await Ai.findAll();
}

async function saveAi(chatId) {
  return await Ai.create({ chatId });
}

async function deleteAllAi() {
  return await Ai.destroy({
    where: {},
    truncate: true
  });
}

module.exports = {
  Ai,
  getAi,
  saveAi,
  deleteAllAi
};
