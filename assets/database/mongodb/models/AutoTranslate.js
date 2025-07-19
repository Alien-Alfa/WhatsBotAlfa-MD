// Made with ❤ by AlienAlfa
const mongoose = require("mongoose");
const autoTranslateSchema = new mongoose.Schema({
  chatId: { type: String, required: true, unique: true, index: true },
  enabled: { type: Boolean, default: false },
  targetLanguage: { type: String, default: 'en' },
}, { timestamps: true, collection: 'autotranslate' });
module.exports = mongoose.model("AutoTranslate", autoTranslateSchema);
