// Made with ❤ by AlienAlfa
// MongoDB CallAction Model

const mongoose = require("mongoose");

const callActionSchema = new mongoose.Schema({
  chatId: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  action: {
    type: String,
    enum: ['allow', 'reject', 'ignore'],
    default: 'reject',
  },
  enabled: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
  collection: 'callactions'
});

const CallAction = mongoose.model("CallAction", callActionSchema);

module.exports = CallAction;
