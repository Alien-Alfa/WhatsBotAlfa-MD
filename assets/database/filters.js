const config = require("../../config");
const { DataTypes } = require("sequelize");

// MongoDB Support
if (config.USE_MONGODB && config.MONGODB_URI) {
  // Use MongoDB for filters
  const mongoManager = require("./mongodb");
const logger = require("../../lib/logger");
  let models = null;

  const initModels = async () => {
    if (!models) {
      models = await mongoManager.connect();
    }
    return models;
  };

  module.exports = {
    FiltersDB: null, // MongoDB doesn't use Sequelize models
    
    async setFilter(id, text, data, read = false) {
      try {
        const models = await initModels();
        const result = await models.Filter.findOneAndUpdate(
          { jid: id, text: text },
          { jid: id, text, data, read },
          { upsert: true, new: true }
        );
        return result;
      } catch (error) {
        logger.warn("MongoDB setFilter error:", error);
        return null;
      }
    },
    
    async deleteFilter(id, text) {
      try {
        const models = await initModels();
        const result = await models.Filter.deleteOne({ jid: id, text: text });
        return result.deletedCount > 0;
      } catch (error) {
        logger.warn("MongoDB deleteFilter error:", error);
        return false;
      }
    },
    
    async getFilter(id, text) {
      try {
        const models = await initModels();
        const filter = await models.Filter.findOne({ jid: id, text: text });
        return filter;
      } catch (error) {
        logger.warn("MongoDB getFilter error:", error);
        return null;
      }
    },
    
    async getFilters(id) {
      try {
        const models = await initModels();
        const filters = await models.Filter.find({ jid: id });
        return filters;
      } catch (error) {
        logger.warn("MongoDB getFilters error:", error);
        return [];
      }
    }
  };
  
  return;
}

// Safety check for SQLite mode when DATABASE is not configured
if (!config.DATABASE) {
  logger.info('⚠️ Filters feature disabled in MongoDB mode');
  module.exports = {
    FiltersDB: null,
    getFilter: async () => false,
    setFilter: async () => null,
    deleteFilter: async () => false,
    getFilters: async () => []
  };
  return;
}

const FiltersDB = config.DATABASE.define("filters", {
  chat: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  pattern: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  text: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  regex: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
});

async function getFilter(jid = null, filter = null) {
  const whereClause = { chat: jid };
  if (filter !== null) {
    whereClause.pattern = filter;
  }
  const filters = await FiltersDB.findAll({
    where: whereClause,
  });

  return filters.length > 0 ? filters : false;
}

async function setFilter(jid = null, filter = null, tex = null, regx = false) {
  const existingFilter = await FiltersDB.findOne({
    where: {
      chat: jid,
      pattern: filter,
    },
  });

  if (!existingFilter) {
    return await FiltersDB.create({
      chat: jid,
      pattern: filter,
      text: tex,
      regex: regx,
    });
  } else {
    return await existingFilter.update({
      chat: jid,
      pattern: filter,
      text: tex,
      regex: regx,
    });
  }
}

async function deleteFilter(jid = null, filter) {
  const existingFilter = await FiltersDB.findOne({
    where: {
      chat: jid,
      pattern: filter,
    },
  });

  if (!existingFilter) {
    return false;
  } else {
    return await existingFilter.destroy();
  }
}

module.exports = {
  FiltersDB,
  getFilter,
  setFilter,
  deleteFilter,
};
