// MongoDB Connection Manager for Aurora-MD
// Made with ❤ by AlienAlfa

const mongoose = require("mongoose");
const config = require("../../config");

// Global connection state
let isConnected = false;
let models = {};

// MongoDB Schema Definitions
const schemas = {
  // Chat Schema
  Chat: new mongoose.Schema({
    jid: { type: String, required: true, unique: true },
    conversationTimestamp: { type: Number, default: 0 },
    isGroup: { type: Boolean, default: false }
  }, { timestamps: true }),

  // Message Schema
  Message: new mongoose.Schema({
    jid: { type: String, required: true, index: true },
    message: { type: mongoose.Schema.Types.Mixed, required: true },
    id: { type: String, required: true, index: true },
    fromMe: { type: Boolean, default: false },
    messageType: { type: String, index: true }
  }, { timestamps: true }),

  // Contact Schema
  Contact: new mongoose.Schema({
    jid: { type: String, required: true, unique: true },
    name: { type: String, default: "" }
  }, { timestamps: true }),

  // Notes Schema
  Note: new mongoose.Schema({
    jid: { type: String, required: true, unique: true },
    note: { type: String, required: true }
  }, { timestamps: true }),

  // Filters Schema
  Filter: new mongoose.Schema({
    jid: { type: String, required: true, index: true },
    pattern: { type: String, required: true },
    text: { type: String, required: true },
    regex: { type: Boolean, default: false }
  }, { timestamps: true }),

  // Greetings Schema
  Greeting: new mongoose.Schema({
    jid: { type: String, required: true, index: true },
    type: { type: String, enum: ['welcome', 'goodbye'], required: true },
    message: { type: String, required: true },
    enabled: { type: Boolean, default: true }
  }, { timestamps: true }),

  // Warnings Schema
  Warning: new mongoose.Schema({
    jid: { type: String, required: true, index: true },
    reason: { type: String, default: "" },
    warned_by: { type: String, required: true },
    date: { type: Date, default: Date.now }
  }, { timestamps: true }),

  // Plugins Schema
  Plugin: new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    url: { type: String, required: true },
    enabled: { type: Boolean, default: true }
  }, { timestamps: true }),

  // Paused Chats Schema
  PausedChat: new mongoose.Schema({
    jid: { type: String, required: true, unique: true },
    reason: { type: String, default: "" }
  }, { timestamps: true }),

  // Call Actions Schema
  CallAction: new mongoose.Schema({
    jid: { type: String, required: true, unique: true },
    action: { type: String, enum: ['block', 'reject'], default: 'reject' }
  }, { timestamps: true }),

  // Auto React Schema
  AutoReact: new mongoose.Schema({
    jid: { type: String, required: true, unique: true },
    emoji: { type: String, required: true },
    enabled: { type: Boolean, default: true }
  }, { timestamps: true }),

  // Auto Translate Schema
  AutoTranslate: new mongoose.Schema({
    jid: { type: String, required: true, unique: true },
    language: { type: String, required: true },
    enabled: { type: Boolean, default: true }
  }, { timestamps: true }),

  // Ban Bot Schema
  BanBot: new mongoose.Schema({
    jid: { type: String, required: true, unique: true },
    reason: { type: String, default: "" },
    banned_by: { type: String, required: true }
  }, { timestamps: true }),

  // Banned Account Schema
  BannedAccount: new mongoose.Schema({
    jid: { type: String, required: true, unique: true },
    reason: { type: String, default: "" },
    banned_by: { type: String, required: true }
  }, { timestamps: true }),

  // Stick Ban Schema
  StickBan: new mongoose.Schema({
    jid: { type: String, required: true, unique: true },
    reason: { type: String, default: "" }
  }, { timestamps: true }),

  // PDM (Private Data Management) Schema
  PDM: new mongoose.Schema({
    jid: { type: String, required: true, index: true },
    key: { type: String, required: true },
    value: { type: mongoose.Schema.Types.Mixed, required: true }
  }, { timestamps: true }),

  // AI Chat Schema
  AiChat: new mongoose.Schema({
    jid: { type: String, required: true, unique: true },
    enabled: { type: Boolean, default: true },
    model: { type: String, default: "gpt-3.5-turbo" }
  }, { timestamps: true }),

  // Gemini Schema
  Gemini: new mongoose.Schema({
    jid: { type: String, required: true, unique: true },
    enabled: { type: Boolean, default: true },
    apiKey: { type: String, required: true }
  }, { timestamps: true }),

  // Group State Save Schema
  GroupStateSave: new mongoose.Schema({
    jid: { type: String, required: true, unique: true },
    settings: { type: mongoose.Schema.Types.Mixed, default: {} }
  }, { timestamps: true })
};

// MongoDB Connection Function
async function connect() {
  if (isConnected && Object.keys(models).length > 0) {
    return models;
  }

  try {
    if (!config.MONGODB_URI) {
      throw new Error("MongoDB URI is not configured");
    }

    console.log("🔄 Connecting to MongoDB...");
    
    // Disconnect any existing connection first
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
    
    // Connect to MongoDB with simplified options
    await mongoose.connect(config.MONGODB_URI, {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      family: 4 // Use IPv4, skip trying IPv6
    });

    isConnected = true;
    console.log("✅ MongoDB connected successfully!");

    // Initialize models
    for (const [modelName, schema] of Object.entries(schemas)) {
      try {
        // Check if model already exists
        if (mongoose.models[modelName]) {
          models[modelName] = mongoose.models[modelName];
        } else {
          models[modelName] = mongoose.model(modelName, schema);
        }
      } catch (error) {
        console.warn(`Warning creating model ${modelName}:`, error.message);
        // Try to get existing model
        try {
          models[modelName] = mongoose.model(modelName);
        } catch (e) {
          console.error(`Failed to initialize model ${modelName}:`, e.message);
        }
      }
    }

    console.log("✅ MongoDB models initialized successfully");
    return models;

  } catch (error) {
    console.error("❌ MongoDB connection failed:", error);
    isConnected = false;
    models = {};
    throw error;
  }
}

// Disconnect function
async function disconnect() {
  if (isConnected) {
    await mongoose.disconnect();
    isConnected = false;
    models = {};
    console.log("📤 MongoDB disconnected");
  }
}

// Get current connection status
function getConnectionStatus() {
  return {
    isConnected,
    modelsCount: Object.keys(models).length,
    readyState: mongoose.connection.readyState
  };
}

// Export functions and models
module.exports = {
  connect,
  disconnect,
  getConnectionStatus,
  models: () => models,
  
  // Individual model access for backward compatibility
  getModels: () => models,
  
  // Connection state
  isConnected: () => isConnected
};
