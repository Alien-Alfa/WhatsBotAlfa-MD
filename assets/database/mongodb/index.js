// Made with ❤ by AlienAlfa
// MongoDB Connection and Model Manager

const mongoose = require("mongoose");
const config = require("../../../config");
const logger = require("../../../lib/logger");

// Import all MongoDB models
const Chat = require("./models/Chat");
const Message = require("./models/Message");
const Contact = require("./models/Contact");
const PausedChat = require("./models/PausedChat");
const Greeting = require("./models/Greeting");
const Warning = require("./models/Warning");
const Note = require("./models/Note");
const Filter = require("./models/Filter");
const Plugin = require("./models/Plugin");
const GroupStateSave = require("./models/GroupStateSave");
const CallAction = require("./models/CallAction");
const AutoReact = require("./models/AutoReact");
const AutoTranslate = require("./models/AutoTranslate");
const BanBot = require("./models/BanBot");
const BannedAccount = require("./models/BannedAccount");
const StickBan = require("./models/StickBan");
const PDM = require("./models/PDM");
const AiChat = require("./models/AiChat");
const Gemini = require("./models/Gemini");

class MongoDBManager {
  constructor() {
    this.isConnected = false;
    this.models = {};
  }

  async connect() {
    try {
      if (!config.MONGODB_URI) {
        throw new Error("MONGODB_URI is required for MongoDB connection");
      }

      logger.info("🔄 Connecting to MongoDB...");
      
      await mongoose.connect(config.MONGODB_URI, {
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 30000,
        socketTimeoutMS: 45000,
      });

      this.isConnected = true;
      logger.info("✅ MongoDB connected successfully!");

      // Initialize models
      this.models = {
        Chat,
        Message,
        Contact,
        PausedChat,
        Greeting,
        Warning,
        Note,
        Filter,
        Plugin,
        GroupStateSave,
        CallAction,
        AutoReact,
        AutoTranslate,
        BanBot,
        BannedAccount,
        StickBan,
        PDM,
        AiChat,
        Gemini,
      };
      
      // Debug: Verify PausedChat model schema
      logger.info("🔍 Initializing MongoDB models...");
      logger.info("🔍 PausedChat model schema paths:", Object.keys(PausedChat.schema.paths));
      logger.info("🔍 PausedChat model name:", PausedChat.modelName);
      logger.info("🔍 PausedChat collection name:", PausedChat.collection.name);

      // Set up connection event handlers
      mongoose.connection.on("error", (error) => {
        logger.error("❌ MongoDB connection error:", error);
      });

      mongoose.connection.on("disconnected", () => {
        logger.warn("⚠️ MongoDB disconnected");
        this.isConnected = false;
      });

      mongoose.connection.on("reconnected", () => {
        logger.info("🔄 MongoDB reconnected");
        this.isConnected = true;
      });

      return this.models;
    } catch (error) {
      logger.error("❌ MongoDB connection failed:", error);
      throw error;
    }
  }

  async disconnect() {
    try {
      await mongoose.disconnect();
      this.isConnected = false;
      logger.info("✅ MongoDB disconnected gracefully");
    } catch (error) {
      logger.error("❌ Error disconnecting from MongoDB:", error);
      throw error;
    }
  }

  getModels() {
    return this.models;
  }

  isConnectionActive() {
    return this.isConnected && mongoose.connection.readyState === 1;
  }
}

// Create singleton instance
const mongoManager = new MongoDBManager();

module.exports = mongoManager;
