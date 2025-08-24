const config = require("../../config");
const { DataTypes } = require("sequelize");

// MongoDB Support
if (config.USE_MONGODB && config.MONGODB_URI) {
  // Use MongoDB for greetings
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
    GreetingsDB: null, // MongoDB doesn't use Sequelize models
    
    async getGreeting(id) {
      try {
        const models = await initModels();
        const greeting = await models.Greeting.findOne({ jid: id });
        return greeting || false;
      } catch (error) {
        logger.warn("MongoDB getGreeting error:", error);
        return false;
      }
    },
    
    async setGreeting(id, isEnable, message) {
      try {
        const models = await initModels();
        const result = await models.Greeting.findOneAndUpdate(
          { jid: id },
          { jid: id, isEnable, message },
          { upsert: true, new: true }
        );
        return result;
      } catch (error) {
        logger.warn("MongoDB setGreeting error:", error);
        return null;
      }
    },
    
    async deleteGreeting(id) {
      try {
        const models = await initModels();
        const result = await models.Greeting.deleteOne({ jid: id });
        return result.deletedCount > 0;
      } catch (error) {
        logger.warn("MongoDB deleteGreeting error:", error);
        return false;
      }
    },
    
    async enableGreeting(id) {
      try {
        const models = await initModels();
        const result = await models.Greeting.findOneAndUpdate(
          { jid: id },
          { isEnable: true },
          { upsert: true, new: true }
        );
        return result;
      } catch (error) {
        logger.warn("MongoDB enableGreeting error:", error);
        return null;
      }
    },
    
    async disableGreeting(id) {
      try {
        const models = await initModels();
        const result = await models.Greeting.findOneAndUpdate(
          { jid: id },
          { isEnable: false },
          { new: true }
        );
        return result;
      } catch (error) {
        logger.warn("MongoDB disableGreeting error:", error);
        return null;
      }
    },
    
    async getGreetingStatus(id) {
      try {
        const models = await initModels();
        const greeting = await models.Greeting.findOne({ jid: id });
        return greeting ? greeting.isEnable : false;
      } catch (error) {
        logger.warn("MongoDB getGreetingStatus error:", error);
        return false;
      }
    },
    
    async setMessage(id, message) {
      try {
        const models = await initModels();
        const result = await models.Greeting.findOneAndUpdate(
          { jid: id },
          { message },
          { upsert: true, new: true }
        );
        return result;
      } catch (error) {
        logger.warn("MongoDB setMessage error:", error);
        return null;
      }
    },
    
    async getMessage(id) {
      try {
        const models = await initModels();
        const greeting = await models.Greeting.findOne({ jid: id });
        return greeting ? greeting.message : null;
      } catch (error) {
        logger.warn("MongoDB getMessage error:", error);
        return null;
      }
    },
    
    async delMessage(id) {
      try {
        const models = await initModels();
        const result = await models.Greeting.findOneAndUpdate(
          { jid: id },
          { $unset: { message: "" } },
          { new: true }
        );
        return result !== null;
      } catch (error) {
        logger.warn("MongoDB delMessage error:", error);
        return false;
      }
    },
    
    async toggleStatus(id) {
      try {
        const models = await initModels();
        const greeting = await models.Greeting.findOne({ jid: id });
        const newStatus = greeting ? !greeting.isEnable : true;
        const result = await models.Greeting.findOneAndUpdate(
          { jid: id },
          { isEnable: newStatus },
          { upsert: true, new: true }
        );
        return result;
      } catch (error) {
        logger.warn("MongoDB toggleStatus error:", error);
        return null;
      }
    },
    
    async getStatus(id) {
      try {
        const models = await initModels();
        const greeting = await models.Greeting.findOne({ jid: id });
        return greeting ? greeting.isEnable : false;
      } catch (error) {
        logger.warn("MongoDB getStatus error:", error);
        return false;
      }
    }
  };
  
  return;
}

// Safety check for SQLite mode when DATABASE is not configured
if (!config.DATABASE) {
  logger.info('⚠️ Greetings feature disabled in MongoDB mode');
  module.exports = {
    GreetingsDB: null,
    getGreeting: async () => false,
    setGreeting: async () => null,
    deleteGreeting: async () => false,
    enableGreeting: async () => null,
    disableGreeting: async () => null,
    getGreetingStatus: async () => false,
    setMessage: async () => null,
    getMessage: async () => null,
    delMessage: async () => false,
    toggleStatus: async () => null,
    getStatus: async () => false
  };
  return;
}

const GreetingsDB = config.DATABASE.define("Greetings", {
  chat: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  type: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  status: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
});

async function getMessage(jid = null, type = null) {
  const message = await GreetingsDB.findOne({
    where: {
      chat: jid,
      type,
    },
  });

  return message ? message.dataValues : false;
}

async function setMessage(jid = null, type = null, text = null) {
  const existingMessage = await GreetingsDB.findOne({
    where: {
      chat: jid,
      type,
    },
  });

  if (!existingMessage) {
    return await GreetingsDB.create({
      chat: jid,
      message: text,
      type,
      status: true,
    });
  } else {
    return await existingMessage.update({ chat: jid, message: text });
  }
}

async function toggleStatus(jid = null, type = null) {
  const existingMessage = await GreetingsDB.findOne({
    where: {
      chat: jid,
      type,
    },
  });

  if (!existingMessage) {
    return false;
  } else {
    const newStatus = !existingMessage.dataValues.status;
    return await existingMessage.update({ chat: jid, status: newStatus });
  }
}

async function delMessage(jid = null, type = null) {
  const existingMessage = await GreetingsDB.findOne({
    where: {
      chat: jid,
      type,
    },
  });

  if (existingMessage) {
    await existingMessage.destroy();
  }
}

async function getStatus(jid = null, type = null) {
  try {
    const existingMessage = await GreetingsDB.findOne({
      where: {
        chat: jid,
        type,
      },
    });

    return existingMessage ? existingMessage.dataValues.status : false;
  } catch {
    return false;
  }
}

module.exports = {
  GreetingsDB,
  setMessage,
  getMessage,
  delMessage,
  toggleStatus,
  getStatus,
};
