// Made with ❤ by AlienAlfa
const mongoose = require("mongoose");
const pdmSchema = new mongoose.Schema({
  chatId: { type: String, required: true, unique: true, index: true },
  enabled: { type: Boolean, default: false },
  deleteTime: { type: Number, default: 30000 },
}, { timestamps: true, collection: 'pdm' });
module.exports = mongoose.model("PDM", pdmSchema);
