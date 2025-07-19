// Made with ❤ by AlienAlfa
const mongoose = require("mongoose");
const bannedAccountSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true, index: true },
  reason: { type: String, default: 'Account banned' },
  bannedBy: { type: String, required: true },
}, { timestamps: true, collection: 'bannedaccounts' });
module.exports = mongoose.model("BannedAccount", bannedAccountSchema);
