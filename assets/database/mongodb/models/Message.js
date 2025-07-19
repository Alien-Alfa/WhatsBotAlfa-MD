// Made with ❤ by AlienAlfa
// MongoDB Message Model

const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  jid: {
    type: String,
    required: true,
    index: true,
  },
  message: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
  sender: {
    type: String,
    index: true,
  },
  messageType: {
    type: String,
    index: true,
  },
}, {
  timestamps: true,
  collection: 'messages'
});

// Performance indexes
messageSchema.index({ jid: 1, createdAt: -1 });
messageSchema.index({ sender: 1, createdAt: -1 });
messageSchema.index({ messageType: 1 });

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;
