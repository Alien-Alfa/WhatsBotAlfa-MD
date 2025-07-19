// Made with ❤ by AlienAlfa
// MongoDB Filter Model

const mongoose = require("mongoose");

const filterSchema = new mongoose.Schema({
  chatId: {
    type: String,
    required: true,
    index: true,
  },
  pattern: {
    type: String,
    required: true,
  },
  response: {
    type: String,
    required: true,
  },
  isRegex: {
    type: Boolean,
    default: false,
  },
  createdBy: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
  collection: 'filters'
});

filterSchema.index({ chatId: 1, pattern: 1 });

const Filter = mongoose.model("Filter", filterSchema);

module.exports = Filter;
