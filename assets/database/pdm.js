const config = require('../../config');
const { DataTypes } = require('sequelize');

// Safety check for MongoDB mode
if (!config.DATABASE) {
  console.log('⚠️ PDM feature disabled in MongoDB mode');
  module.exports = {
    PDM: null,
    savePDM: async () => null,
    checkPDM: async () => false,
    deletePDM: async () => null
  };
  return;
}

const PDM = config.DATABASE.define('PDM', {
  chatId: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  }
});

async function getPDM() {
  return await PDM.findAll();
}

async function savePDM(chatId) {
  return await PDM.create({ chatId });
}

async function deleteAllPDM() {
  return await PDM.destroy({
    where: {},
    truncate: true
  });
}

module.exports = {
  PDM,
  getPDM,
  savePDM,
  deleteAllPDM
};
