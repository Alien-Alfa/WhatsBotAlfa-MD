const config = require("../config");
const { DataTypes } = require("sequelize");

const SettingsDB = config.DATABASE.define("settings", {
  config: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  value: {
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



async function setConfig(config = null, value = null) {
  var Msg = await SettingsDB.findAll({
    where: {
        config: config,
        value: value,
    },
  });

  if (Msg.length < 1) {
    return await SettingsDB.create({
        config: config,
        value: value,
    });
  } else {
    return await Msg[0].update({
        config: config,
        value: value,
    });
  }
}

async function deleteConfig(config = null, value = null) {
  var Msg = await SettingsDB.findAll({
    where: {
        config: config,
        value: value,
    },
  });
  if (Msg.length < 1) {
    return await Msg[0].update({
        config: config,
        value: value,
    });  } else {
        return await Msg[0].update({
            config: config,
            value: value,
        });  }
}
async function modifyConfig(configKey, newValue) {
  try {
    const existingSetting = await SettingsDB.findOne({
      where: {
        config: configKey,
      },
    });

    if (!existingSetting) {
      // Create new setting
      await SettingsDB.create({
        config: configKey,
        value: newValue,
      });
      return "Setting created successfully.";
    } else {
      // Update existing setting
      await existingSetting.update({ value: newValue });
      return "Setting modified successfully.";
    }
  } catch (error) {
    console.error("Error modifying configuration:", error);
    return "Failed to modify configuration.";
  }
}


module.exports = {
  SettingsDB: SettingsDB,
  getConfig: getConfig,
  setConfig: setConfig,
  modifyConfig:modifyConfig,
  deleteConfig: deleteConfig,
};
