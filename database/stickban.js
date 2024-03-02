const config = require('../config');
const { DataTypes } = require('sequelize');

const StickBan = config.DATABASE.define('StickBan', {
  chatId: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  }
});

async function getStickBan() {
  return await StickBan.findAll();
}

async function savePausedChat(chatId) {
  return await StickBan.create({ chatId });
}

async function deleteAllStickBan() {
  return await StickBan.destroy({
    where: {},
    truncate: true
  });
}

module.exports = {
  StickBan,
  getStickBan,
  savePausedChat,
  deleteAllStickBan
};
