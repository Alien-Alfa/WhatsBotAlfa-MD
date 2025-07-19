// Made with ❤ by AlienAlfa
const mongoose = require("mongoose");
const geminiSchema = new mongoose.Schema({
  chatId: { type: String, required: true, unique: true, index: true },
  enabled: { type: Boolean, default: false },
  apiKey: { type: String },
}, { timestamps: true, collection: 'gemini' });
module.exports = mongoose.model("Gemini", geminiSchema);
