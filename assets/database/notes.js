const config = require('../../config');
const { DataTypes } = require('sequelize');

// Safety check for MongoDB mode
if (!config.DATABASE) {
  console.log('⚠️ Notes feature disabled in MongoDB mode');
  module.exports = {
    NotesDB: null,
    getNotes: async () => [],
    saveNote: async () => null,
    deleteAllNotes: async () => 0
  };
  return;
}

// SQLite/PostgreSQL mode
const NotesDB = config.DATABASE.define('notes', {
  note: {
    type: DataTypes.TEXT,
    allowNull: false
  }
});

async function getNotes() {
  return await NotesDB.findAll();
}

async function saveNote(note) {
  return await NotesDB.create({ note });
}

async function deleteAllNotes() {
  return await NotesDB.destroy({
    where: {},
    truncate: true
  });
}

module.exports = {
  NotesDB,
  getNotes,
  saveNote,
  deleteAllNotes
};
