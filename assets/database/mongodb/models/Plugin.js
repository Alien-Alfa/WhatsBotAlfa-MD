// Made with ❤ by AlienAlfa
// MongoDB Plugin Model

const mongoose = require("mongoose");

const pluginSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  enabled: {
    type: Boolean,
    default: true,
  },
  config: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
}, {
  timestamps: true,
  collection: 'plugins'
});

const Plugin = mongoose.model("Plugin", pluginSchema);

module.exports = Plugin;
