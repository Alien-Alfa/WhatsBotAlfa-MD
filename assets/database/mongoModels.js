// Centralized MongoDB Models Manager
// Made with ❤ by AlienAlfa
// This ensures all database files use the same MongoDB models instance

const config = require("../../config");
const logger = require("../../lib/logger");

// Global MongoDB models cache
let globalModels = null;
let mongoManager = null;
let isInitialized = false;

// Initialize MongoDB connection and models once
async function initializeMongoModels() {
  if (isInitialized && globalModels) {
    return globalModels;
  }

  try {
    // Only initialize if MongoDB is configured
    if (!config.USE_MONGODB || !config.MONGODB_URI) {
      logger.info("MongoDB not configured, skipping initialization");
      return null;
    }

    if (!mongoManager) {
      mongoManager = require("./mongodb");
    }

    logger.info("🔄 Initializing MongoDB models...");
    globalModels = await mongoManager.connect();
    isInitialized = true;
    
    logger.info("✅ MongoDB models initialized and cached globally");
    return globalModels;
    
  } catch (error) {
    logger.error("❌ Failed to initialize MongoDB models:", error);
    isInitialized = false;
    globalModels = null;
    throw error;
  }
}

// Get cached models or initialize if needed
async function getMongoModels() {
  if (!globalModels && !isInitialized) {
    return await initializeMongoModels();
  }
  
  return globalModels;
}

// Check if models are available
function areModelsAvailable() {
  return isInitialized && globalModels !== null;
}

// Get specific model safely
async function getModel(modelName) {
  const models = await getMongoModels();
  
  if (!models || !models[modelName]) {
    logger.warn(`MongoDB model '${modelName}' not available`);
    return null;
  }
  
  return models[modelName];
}

// Force reinitialize (for error recovery)
async function reinitializeModels() {
  logger.info("🔄 Forcing MongoDB models reinitialization...");
  isInitialized = false;
  globalModels = null;
  return await initializeMongoModels();
}

module.exports = {
  initializeMongoModels,
  getMongoModels,
  getModel,
  areModelsAvailable,
  reinitializeModels,
  
  // Backward compatibility
  connect: getMongoModels
};
