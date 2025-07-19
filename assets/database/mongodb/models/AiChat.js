// Made with ❤ by AlienAlfa
const mongoose = require("mongoose");
const aiChatSchema = new mongoose.Schema({
  chatId: { type: String, required: true, unique: true, index: true },
  enabled: { type: Boolean, default: false },
  model: { type: String, default: 'gpt-3.5-turbo' },
}, { timestamps: true, collection: 'aichat' });
module.exports = mongoose.model("AiChat", aiChatSchema);
