// Made with ❤ by AlienAlfa
// MongoDB Chat Model

const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  conversationTimestamp: {
    type: Number,
    required: true,
    index: true,
  },
  isGroup: {
    type: Boolean,
    required: true,
    default: false,
    index: true,
  },
}, {
  timestamps: true,
  collection: 'chats'
});

// Performance indexes
chatSchema.index({ conversationTimestamp: -1 });
chatSchema.index({ isGroup: 1, conversationTimestamp: -1 });

const Chat = mongoose.model("Chat", chatSchema);

module.exports = Chat;
