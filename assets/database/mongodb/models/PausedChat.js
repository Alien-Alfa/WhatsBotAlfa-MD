// Made with ❤ by AlienAlfa
// MongoDB PausedChat Model

const mongoose = require("mongoose");

// Define schema with strict mode disabled for flexibility
const pausedChatSchema = new mongoose.Schema({
  chatId: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  jid: {
    type: String,
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
  isPaused: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
  collection: 'pausedchats',
  strict: false  // Allow additional fields
});

// Pre-save middleware to ensure chatId and jid consistency
pausedChatSchema.pre('save', function(next) {
  if (this.chatId && !this.jid) {
    this.jid = this.chatId;
  } else if (this.jid && !this.chatId) {
    this.chatId = this.jid;
  }
  next();
});

// Check if model already exists to prevent OverwriteModelError
const PausedChat = mongoose.models.PausedChat || mongoose.model("PausedChat", pausedChatSchema);

module.exports = PausedChat;
