// Made with ❤ by AlienAlfa
// MongoDB Note Model

const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema({
  chatId: {
    type: String,
    required: true,
    index: true,
  },
  noteName: {
    type: String,
    required: true,
  },
  noteContent: {
    type: String,
    required: true,
  },
  createdBy: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
  collection: 'notes'
});

noteSchema.index({ chatId: 1, noteName: 1 }, { unique: true });

const Note = mongoose.model("Note", noteSchema);

module.exports = Note;
