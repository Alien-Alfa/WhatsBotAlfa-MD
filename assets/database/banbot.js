const config = require('../../config');
const { DataTypes } = require('sequelize');

// Safety check for MongoDB mode
if (!config.DATABASE) {
  console.log('⚠️ Banbot feature disabled in MongoDB mode');
  module.exports = {
    banbot: null,
    saveBan: async () => null,
    checkBan: async () => false,
    deleteBan: async () => null,
    getBanCount: async () => 0,
    getBans: async () => []
  };
  return;
}

const banbot = config.DATABASE.define('banbot', {
  chatId: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  }
});

async function getbanbot() {
  return await banbot.findAll();
}

async function savebanbot(chatId) {
  return await banbot.create({ chatId });
}

async function deleteAllbanbot() {
  return await banbot.destroy({
    where: {},
    truncate: true
  });
}

module.exports = {
  banbot,
  getbanbot,
  savebanbot,
  deleteAllbanbot
};
