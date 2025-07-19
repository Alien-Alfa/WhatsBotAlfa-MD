// Made with ❤ by AlienAlfa
// MongoDB Greeting Model

const mongoose = require("mongoose");

const greetingSchema = new mongoose.Schema({
  chatId: {
    type: String,
    required: true,
    index: true,
  },
  type: {
    type: String,
    enum: ['welcome', 'goodbye'],
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  enabled: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
  collection: 'greetings'
});

greetingSchema.index({ chatId: 1, type: 1 }, { unique: true });

const Greeting = mongoose.model("Greeting", greetingSchema);

module.exports = Greeting;
