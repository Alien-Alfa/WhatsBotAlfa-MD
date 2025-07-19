// Made with ❤ by AlienAlfa
const mongoose = require("mongoose");
const banBotSchema = new mongoose.Schema({
  chatId: { type: String, required: true, unique: true, index: true },
  enabled: { type: Boolean, default: false },
  reason: { type: String, default: 'Bot banned' },
}, { timestamps: true, collection: 'banbot' });
module.exports = mongoose.model("BanBot", banBotSchema);
