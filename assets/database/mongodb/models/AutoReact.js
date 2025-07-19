// Made with ❤ by AlienAlfa
const mongoose = require("mongoose");
const autoReactSchema = new mongoose.Schema({
  chatId: { type: String, required: true, unique: true, index: true },
  enabled: { type: Boolean, default: false },
  reactions: [{ type: String }],
}, { timestamps: true, collection: 'autoreact' });
module.exports = mongoose.model("AutoReact", autoReactSchema);
