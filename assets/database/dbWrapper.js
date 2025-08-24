// Database wrapper to handle both MongoDB and SQL scenarios
const config = require('../../config');
const logger = require("../../lib/logger");

function createModel(modelName, schema, options = {}) {
  if (config.DATABASE) {
    // SQLite/PostgreSQL mode
    return config.DATABASE.define(modelName, schema, options);
  } else {
    // MongoDB mode - return a mock model
    logger.info(`⚠️ ${modelName} model disabled in MongoDB mode`);
    return null;
  }
}

function createSafeFunction(fn, fallbackValue = null) {
  return async function(...args) {
    try {
      if (arguments.callee.model && !arguments.callee.model) {
        logger.info(`⚠️ Database operation not available in MongoDB mode`);
        return fallbackValue;
      }
      return await fn.apply(this, args);
    } catch (error) {
      logger.error('Database operation failed:', error.message);
      return fallbackValue;
    }
  };
}

module.exports = {
  createModel,
  createSafeFunction,
  isMongoMode: !config.DATABASE
};
