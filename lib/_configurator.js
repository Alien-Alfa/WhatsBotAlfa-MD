//=====================================================================================================
const config = require("../config");
const { DataTypes } = require("sequelize");

// Define SettingsDB model
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

// Function to retrieve configurations
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

// Function to get SUDO user
function getSuUser() {
  return new Promise((resolve, reject) => {
    getConfig()
      .then(SUser => {
        resolve(SUser);
      })
      .catch(error => {
        console.error("Error fetching SUDO user:", error);
        reject(error);
      });
  });
} 

module.exports = {
  getConfig,
  getSuUser
};

//=====================================================================================================