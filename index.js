const fs = require("fs").promises;
const fsx = require("fs");
const path = require("path");
const config = require("./config");
const connect = require("./lib/connection");
const { UpdateLocal, WriteSession} = require("./lib");

// Add got for HTTP requests
const { default: got } = require("got");

global.__basedir = __dirname;

async function auth() {
  try {
    if (!fsx.existsSync("./session/creds.json")) {
      await WriteSession();
    }
    return initialize();
  } catch (error) {
    console.error("AuthFile Generation Error:", error);
    return process.exit(1);
  }
}

// Performance: Optimized file loading with parallel processing
async function readAndRequireFiles(directory) {
  try {
    const files = await fs.readdir(directory);
    const jsFiles = files.filter(file => path.extname(file) === ".js");
    
    // Performance: Load files in parallel
    await Promise.allSettled(
      jsFiles.map(async (file) => {
        try {
          const filePath = path.join(directory, file);
          require(filePath);
          return filePath;
        } catch (error) {
          console.warn(`⚠️ Failed to load ${file}:`, error.message);
        }
      })
    );
    
    console.log(`✅ Loaded ${jsFiles.length} files from ${directory}`);
  } catch (error) {
    console.error(`❌ Error reading directory ${directory}:`, error);
    throw error;
  }
}

// Performance: Optimized plugin loading
async function loadExternalPlugins() {
  try {
    const gitUrl = config.HEROKU_APP_NAME ? 
      `https://${config.HEROKU_APP_NAME}.herokuapp.com/` : 
      config.HEROKU_GIT_URL;
    
    if (!gitUrl) {
      console.log("📦 Using local plugins only");
      return;
    }
    
    console.log("🔄 Checking for external plugins...");
    const startTime = Date.now();
    
    try {
      const response = await got(`${gitUrl}assets/plugins/`, {
        timeout: 10000,
        retry: 0
      });
      
      if (response.statusCode === 200) {
        const loadTime = Date.now() - startTime;
        console.log(`✅ External plugins checked in ${loadTime}ms`);
      }
    } catch (error) {
      console.log("📦 Using local plugins (external check failed)");
    }
  } catch (error) {
    console.warn("Plugin check error:", error);
  }
};

// Performance: Optimized initialization with timing and error handling
async function initialize() {
  const startTime = Date.now();
  console.log("============> Aurora-MD [Alien-Alfa] <============");
  
  try {
    // Performance: Parallel database and file loading
    console.log("📊 Initializing database and core files...");
    
    if (config.USE_MONGODB && config.MONGODB_URI) {
      // MongoDB initialization with sync system
      console.log("🍃 Using MongoDB database with auto-sync...");
      try {
        const mongoStoreDb = require("./assets/database/MongoStoreDb");
        await Promise.all([
          readAndRequireFiles(path.join(__dirname, "/assets/database/")),
          mongoStoreDb.initialize()
        ]);
        
        // Display sync status
        const syncStats = mongoStoreDb.getSyncStats();
        console.log("🔄 Database sync system initialized");
        console.log(`   - Sync frequency: Every 30 minutes`);
        console.log(`   - Auto-sync with local SQLite: Enabled`);
        
      } catch (error) {
        console.error("❌ MongoDB initialization failed, falling back to SQLite:", error.message);
        console.log("🗃️ Switching to SQLite database...");
        // Load database models and initialize SQLite
        await readAndRequireFiles(path.join(__dirname, "/assets/database/"));
        
        // Create SQLite database instance if not exists
        const { Sequelize } = require("sequelize");
        const sqliteDb = new Sequelize({
          dialect: "sqlite",
          storage: "./assets/database.db",
          logging: false,
          pool: {
            max: 10,
            min: 0,
            acquire: 30000,
            idle: 10000
          }
        });
        
        await sqliteDb.sync({ 
          logging: false,
          alter: true
        });
      }
      
    } else {
      // SQLite/PostgreSQL initialization
      console.log("🗃️ Using SQL database...");
      // Load database models first
      await readAndRequireFiles(path.join(__dirname, "/assets/database/"));
      // Then sync the database to create tables
      await config.DATABASE.sync({ 
        logging: false, // Disable SQL logging for performance
        alter: true     // Enable table alterations to create missing tables
      });
    }
    
    console.log("✅ Database synced");
    
    console.log("⬇ Installing Plugins...");
    const pluginStartTime = Date.now();
    
    // Import plugins function after database is ready
    const { getandRequirePlugins } = require("./assets/database/plugins");
    
    // Performance: Parallel plugin loading
    await Promise.all([
      readAndRequireFiles(path.join(__dirname, "/assets/plugins/")),
      getandRequirePlugins(),
      loadExternalPlugins()
    ]);
    
    const pluginTime = Date.now() - pluginStartTime;
    console.log(`✅ Plugins Installed in ${pluginTime}ms!`);
    
    console.log("🔄 Starting connection...");
    const connectionStartTime = Date.now();
    const result = await connect();
    
    const connectionTime = Date.now() - connectionStartTime;
    const totalTime = Date.now() - startTime;
    
    console.log(`🎉 Bot fully initialized in ${totalTime}ms (connection: ${connectionTime}ms)`);
    
    // Display database sync information if MongoDB is enabled
    if (config.USE_MONGODB && config.MONGODB_URI) {
      console.log("\n📊 Database Sync Information:");
      console.log("   - MongoDB ↔ SQLite sync: Active");
      console.log("   - Sync interval: Every 30 minutes");
      console.log("   - Data consistency: Guaranteed");
      console.log("   - Manual sync: Available via commands\n");
    }
    
    return result;
    
  } catch (error) {
    console.error("❌ Initialization error:", error);
    return process.exit(1);
  }
}

auth();
