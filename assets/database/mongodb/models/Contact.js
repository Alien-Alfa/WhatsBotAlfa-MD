// Made with ❤ by AlienAlfa
// MongoDB Contact Model

const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema({
  jid: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  name: {
    type: String,
    required: true,
  },
  isGroup: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
  collection: 'contacts'
});

// Performance indexes
contactSchema.index({ jid: 1 });

const Contact = mongoose.model("Contact", contactSchema);

module.exports = Contact;
