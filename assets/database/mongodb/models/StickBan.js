// Made with ❤ by AlienAlfa
const mongoose = require("mongoose");
const stickBanSchema = new mongoose.Schema({
  chatId: { type: String, required: true, index: true },
  stickerId: { type: String, required: true },
  bannedBy: { type: String, required: true },
}, { timestamps: true, collection: 'stickban' });
stickBanSchema.index({ chatId: 1, stickerId: 1 }, { unique: true });
module.exports = mongoose.model("StickBan", stickBanSchema);
