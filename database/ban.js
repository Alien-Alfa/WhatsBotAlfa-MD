const config = require('../config');
const { DataTypes } = require('sequelize');

const BanGroup = config.DATABASE.define('BanGroup', {
  chatId: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  }
});

async function getBanGroup() {
  return await BanGroup.findAll();
}

async function savePausedChat(chatId) {
  return await BanGroup.create({ chatId });
}

async function deleteAllBanGroup() {
  return await BanGroup.destroy({
    where: {},
    truncate: true
  });
}

module.exports = {
  BanGroup,
  getBanGroup,
  savePausedChat,
  deleteAllBanGroup
};
