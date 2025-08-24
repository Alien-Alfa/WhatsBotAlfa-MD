const config = require("../../config");
const util = require("util");
const { DataTypes } = require("sequelize");
const logger = require("../../lib/logger");

// MongoDB Safety Check: Prevent database operations in MongoDB mode
if (!config.DATABASE) {
  // MongoDB mode - provide safe fallback functions
  module.exports = {
    SaveGemini: async () => null,
    GetGemini: async () => [],
  };
  return;
}

const GeminiDB = config.DATABASE.define("Geminis", {
  chatid: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  history: {
    type: DataTypes.ARRAY(DataTypes.JSON),
    allowNull: false,
  },
});

const SaveGemini = async (chatid, parts) => {
  return new Promise(async (resolve, reject) => {
    try {
      const gemini = await GeminiDB.findOne({ where: { chatid } });
      if (!gemini) {
        await GeminiDB.create({ chatid, history: parts });
      }
      let part = gemini.history;
      part.push(parts);
      return await gemini.update({ chatid, history: part }).then(resolve);
    } catch (e) {
      logger.info(util.format(e));
    }
  });
};

const GetGemini = async (chatid) => {
  return new Promise(async (resolve, reject) => {
    try {
      const gemini = await GeminiDB.findOne({ where: { chatid } });
      if (!gemini) return resolve([]);
    } catch (e) {
      logger.info(util.format(e));
      return resolve([]);
    }
  });
};

module.exports = { SaveGemini, GetGemini };
