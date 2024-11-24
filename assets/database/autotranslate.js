const config = require("../../config");
const { DataTypes } = require("sequelize");

const AutoTrans = config.DATABASE.define("AutoTrans", {
  ChatId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  language: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
});


async function getConfig() {
  try {
    // Retrieve all configurations from the SettingsDB table
    const allConfigs = await SettingsDB.findAll();

    if (allConfigs.length < 1) {
      return false;
    } else {
      return allConfigs;
    }
  } catch (error) {
    console.error("Error fetching configurations:", error);
    return false;
  }
}

async function getAutoTrans(jid = null) {

  var Where = { ChatId: jid };
  var Msg = await AutoTrans.findAll({
    where: Where,
  });

  if (Msg.length < 1) {
    return null;
  } else {
    // Assuming AutoTrans model has a property named "language"
    return Msg.map(item => item.language);
  }
}

async function saveAutoTrans(jid = null, language = null) {
  var Msg = await AutoTrans.findAll({
    where: {
      ChatId: jid,
      language: language,
    },
  });

  if (Msg.length < 1) {
    return await AutoTrans.create({
      ChatId: jid,
      language: language,
    });
  } else {
    return await Msg[0].update({
      ChatId: jid,
      language: language,
    });
  }
}

async function deleteAutoTrans(jid = null, language) {
  var Msg = await AutoTrans.findAll({
    where: {
      ChatId: jid,
      language: language,
    },
  });
  if (Msg.length < 1) {
    return false;
  } else {
    return await Msg[0].destroy();
  }
}

module.exports = {
  AutoTrans: AutoTrans,
  getAutoTrans: getAutoTrans,
  saveAutoTrans: saveAutoTrans,
  deleteAutoTrans: deleteAutoTrans,
};
