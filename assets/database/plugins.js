const { default: got } = require("got");
const config = require("../../config");
const { DataTypes } = require("sequelize");

// Handle both MongoDB and SQLite configurations
let PluginDB;

if (config.USE_MONGODB && config.MONGODB_URI) {
  // Use MongoDB model
  try {
    const PluginModel = require("./mongodb/models/Plugin");
    PluginDB = PluginModel;
  } catch (error) {
    console.warn("MongoDB Plugin model not found, falling back to SQLite");
    PluginDB = null;
  }
} else if (config.DATABASE) {
  // Use SQLite model
  PluginDB = config.DATABASE.define("Plugin", {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    url: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  });
} else {
  console.warn("No database configuration found for plugins");
  PluginDB = null;
}

async function installPlugin(adres, file) {
  if (!PluginDB) {
    console.warn("Plugin database not available");
    return false;
  }

  try {
    let existingPlugin;
    
    if (config.USE_MONGODB && config.MONGODB_URI) {
      // MongoDB query
      existingPlugin = await PluginDB.findOne({ url: adres });
    } else {
      // SQLite query
      existingPlugin = await PluginDB.findOne({ where: { url: adres } });
    }

    if (existingPlugin) {
      return false;
    } else {
      if (config.USE_MONGODB && config.MONGODB_URI) {
        // MongoDB create
        return await PluginDB.create({ url: adres, name: file });
      } else {
        // SQLite create
        return await PluginDB.create({ url: adres, name: file });
      }
    }
  } catch (error) {
    console.error("Plugin installation error:", error);
    return false;
  }
}

async function removePlugin(name) {
  if (!PluginDB) {
    console.warn("Plugin database not available");
    return false;
  }

  try {
    let existingPlugin;
    
    if (config.USE_MONGODB && config.MONGODB_URI) {
      // MongoDB query
      existingPlugin = await PluginDB.findOne({ name: name });
    } else {
      // SQLite query
      existingPlugin = await PluginDB.findOne({ where: { name: name } });
    }

    if (existingPlugin) {
      if (config.USE_MONGODB && config.MONGODB_URI) {
        // MongoDB delete
        await PluginDB.findOneAndDelete({ name: name });
      } else {
        // SQLite delete
        await existingPlugin.destroy();
      }
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error("Plugin removal error:", error);
    return false;
  }
}

async function getandRequirePlugins() {
  if (!PluginDB) {
    console.warn("Plugin database not available, skipping plugin loading");
    return;
  }

  try {
    let plugins;
    
    if (config.USE_MONGODB && config.MONGODB_URI) {
      // MongoDB query
      plugins = await PluginDB.find({});
    } else {
      // SQLite query
      plugins = await PluginDB.findAll();
    }
    
    // Convert to plain objects for processing
    plugins = plugins.map((plugin) => {
      if (config.USE_MONGODB && config.MONGODB_URI) {
        return plugin.toObject ? plugin.toObject() : plugin;
      } else {
        return plugin.dataValues || plugin;
      }
    });
    
    plugins.forEach((plugin) => {
      try {
        got(plugin.url).then(async (res) => {
          require("fs").writeFileSync(
            __basedir + "/assets/plugins" + plugin.name + ".js",
            res.body
          );
          require(__basedir + "/assets/plugins" + plugin.name);
          console.log("Installed plugin:", plugin.name);
        });
      } catch (e) {
        console.error("Plugin loading error:", e);
      }
    });
  } catch (error) {
    console.error("Plugin retrieval error:", error);
  }
}

module.exports = { PluginDB, installPlugin, removePlugin, getandRequirePlugins };
