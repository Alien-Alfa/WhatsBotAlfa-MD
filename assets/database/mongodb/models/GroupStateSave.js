// Made with ❤ by AlienAlfa
// MongoDB GroupStateSave Model

const mongoose = require("mongoose");

const groupStateSaveSchema = new mongoose.Schema({
  chatId: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  state: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
}, {
  timestamps: true,
  collection: 'groupstatesave'
});

const GroupStateSave = mongoose.model("GroupStateSave", groupStateSaveSchema);

module.exports = GroupStateSave;
