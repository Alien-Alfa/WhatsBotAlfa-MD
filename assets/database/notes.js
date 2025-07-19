const config = require("../../config");
const { DataTypes } = require("sequelize");

// MongoDB Support
if (config.USE_MONGODB && config.MONGODB_URI) {
  // Use MongoDB for notes
  const mongoManager = require("./mongodb");
  let models = null;

  const initModels = async () => {
    if (!models) {
      models = await mongoManager.connect();
    }
    return models;
  };

  module.exports = {
    NotesDB: null, // MongoDB doesn't use Sequelize models
    
    async setNote(jid, note) {
      try {
        const models = await initModels();
        const result = await models.Note.findOneAndUpdate(
          { jid: jid },
          { jid, note },
          { upsert: true, new: true }
        );
        return result;
      } catch (error) {
        console.warn("MongoDB setNote error:", error);
        return null;
      }
    },
    
    async getNote(jid) {
      try {
        const models = await initModels();
        const noteDoc = await models.Note.findOne({ jid: jid });
        return noteDoc ? noteDoc.note : null;
      } catch (error) {
        console.warn("MongoDB getNote error:", error);
        return null;
      }
    },
    
    async deleteNote(jid) {
      try {
        const models = await initModels();
        const result = await models.Note.deleteOne({ jid: jid });
        return result.deletedCount > 0;
      } catch (error) {
        console.warn("MongoDB deleteNote error:", error);
        return false;
      }
    },
    
    async getNotes() {
      try {
        const models = await initModels();
        const notes = await models.Note.find({});
        return notes;
      } catch (error) {
        console.warn("MongoDB getNotes error:", error);
        return [];
      }
    }
  };
  
  return;
}

// Safety check for SQLite mode when DATABASE is not configuredt config = require('../../config');
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
