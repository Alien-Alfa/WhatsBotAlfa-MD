// Made with ❤ by AlienAlfa
// MongoDB Warning Model

const mongoose = require("mongoose");

const warningSchema = new mongoose.Schema({
  chatId: {
    type: String,
    required: true,
    index: true,
  },
  userId: {
    type: String,
    required: true,
    index: true,
  },
  warnCount: {
    type: Number,
    default: 1,
    min: 0,
  },
  reasons: [{
    reason: String,
    date: {
      type: Date,
      default: Date.now,
    },
    warnedBy: String,
  }],
}, {
  timestamps: true,
  collection: 'warnings'
});

warningSchema.index({ chatId: 1, userId: 1 }, { unique: true });

const Warning = mongoose.model("Warning", warningSchema);

module.exports = Warning;
