const config = require('../../config');
const { DataTypes } = require('sequelize');

// Safety check for MongoDB mode
if (!config.DATABASE) {
  console.log('⚠️ AutoReact feature disabled in MongoDB mode');
  module.exports = {
    React: null,
    saveReact: async () => null,
    checkReact: async () => false,
    deleteReact: async () => null
  };
  return;
}

const React = config.DATABASE.define('React', {
  chatId: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  }
});

async function getReact() {
  return await React.findAll();
}

async function saveReact(chatId) {
  return await React.create({ chatId });
}

async function deleteAllReact() {
  return await React.destroy({
    where: {},
    truncate: true
  });
}

module.exports = {
  React,
  getReact,
  saveReact,
  deleteAllReact
};
