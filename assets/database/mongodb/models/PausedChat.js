// Made with ❤ by AlienAlfa
// MongoDB PausedChat Model

const mongoose = require("mongoose");

const pausedChatSchema = new mongoose.Schema({
  chatId: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  reason: {
    type: String,
    default: "Manual pause",
  },
  pausedBy: {
    type: String,
    required: true,
  },
  pausedAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
  collection: 'pausedchats'
});

const PausedChat = mongoose.model("PausedChat", pausedChatSchema);

module.exports = PausedChat;
