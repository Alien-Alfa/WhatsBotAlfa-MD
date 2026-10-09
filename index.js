const fs = require("fs").promises;
const fsx = require("fs");
const path = require("path");

// Set global base directory
global.__basedir = __dirname;

// Filter raw libsignal/Baileys session noise & aggregate signal failures.
// (The old console.log-only filter missed console.info/warn/error output -
//  that's why "prekey bundle"/session dumps kept flooding the terminal.)
const consoleGuard = require("./lib/consoleGuard");
consoleGuard.install();

const config = require("./config");
const connect = require("./lib/connection");
const { UpdateLocal, WriteSession, isSessionCredentials } = require("./lib");
const { logger } = require("./lib/logger");

// Add got for HTTP requests
const { default: got } = require("got");

// Helper function to safely send messages to parent process
function safeProcessSend(message) {
  if (process.send) {
    try {
      process.send(message);
    } catch (error) {
      if (error.code !== 'EPIPE') {
        logger.warn('Failed to send message to parent process', { 
          message, 
          error: error.message 
        });
      }
      // Silently ignore EPIPE errors (parent process shutting down)
    }
  }
}

// WhatsApp connection state management
let whatsappClient = null;
let connectionStopped = false;
let initializationStartTime = Date.now();

// ---- Dashboard telemetry: forward ERROR/WARN entries + runtime stats to
// server.js over IPC (batched - error storms can't flood the channel). ----
const pendingLogEntries = [];
let logFlushTimer = null;

if (process.send) {
  logger.onEntry = (entry) => {
    if (entry.level === 'TRACE') return;
    pendingLogEntries.push(entry);
    if (pendingLogEntries.length > 100) {
      pendingLogEntries.splice(0, pendingLogEntries.length - 100);
    }
    if (!logFlushTimer) {
      logFlushTimer = setTimeout(() => {
        logFlushTimer = null;
        const batch = pendingLogEntries.splice(0, pendingLogEntries.length);
        try { process.send({ type: 'log', entries: batch }); } catch { /* parent gone */ }
      }, 1000);
    }
  };

  setInterval(() => {
    try {
      if (typeof connect.getStats === 'function') {
        process.send({ type: 'stats', data: connect.getStats() });
      }
    } catch { /* parent gone */ }
  }, 10000);

  // Push current stats immediately - otherwise the server's workerStats stays
  // null for the first 10s after every restart and the dashboard shows an
  // empty bot panel. Delay to let the connection module finish init first.
  setTimeout(() => {
    try {
      if (typeof connect.getStats === 'function') {
        process.send({ type: 'stats', data: connect.getStats() });
      }
    } catch { /* parent gone */ }
  }, 5000);
}

// Listen for messages from parent process (server.js)
process.on('message', async (message) => {
  // Structured messages (dashboard config IPC)
  if (message && typeof message === 'object') {
    switch (message.type) {
      case 'config_update': {
        try {
          const { applyOverrides } = require('./lib/configSchema');
          const result = applyOverrides(config, message.overrides || {});
          if (result.ok && Object.hasOwn(message.overrides || {}, 'RMBG_KEY')) {
            config.REMOVEBG = config.RMBG_KEY;
          }
          if (result.ok && Object.hasOwn(message.overrides || {}, 'HANDLERS')) {
            require('./lib/plugins').refreshCommandPatterns();
          }
          logger.system('Config overrides applied', { keys: Object.keys(message.overrides || {}) });
          if (process.send) process.send({ type: 'config_applied', id: message.id, ok: result.ok, error: result.error });
        } catch (error) {
          logger.error('Failed to apply config overrides', { error });
          if (process.send) process.send({ type: 'config_applied', id: message.id, ok: false, error: error.message });
        }
        break;
      }
      case 'get_config': {
        try {
          const { displayKeys } = require('./lib/configSchema');
          const values = {};
          for (const key of displayKeys) {
            values[key] = key === 'DATABASE'
              ? config.DATABASE?.getDialect() || 'unavailable'
              : config[key];
          }
          if (process.send) process.send({ type: 'config_values', id: message.id, values });
        } catch (error) {
          logger.warn('Failed to read config values', { error: error.message });
        }
        break;
      }
      case 'get_call_access': {
        try {
          const callActions = require('./assets/database/callAction');
          const entries = await callActions.listCallActions();
          if (process.send) process.send({
            type: 'call_access',
            id: message.id,
            entries,
            globalAllowAll: config.ALLOW_ALL_CALLS === true
          });
        } catch (error) {
          if (process.send) process.send({ type: 'call_access', id: message.id, ok: false, error: error.message });
        }
        break;
      }
      case 'set_call_access': {
        try {
          const callActions = require('./assets/database/callAction');
          const ok = await callActions.setCallAction(message.jid, message.enabled === true);
          const entries = await callActions.listCallActions();
          if (process.send) process.send({ type: 'call_access_updated', id: message.id, ok, entries });
        } catch (error) {
          if (process.send) process.send({ type: 'call_access_updated', id: message.id, ok: false, error: error.message });
        }
        break;
      }
      default:
        logger.debug('Unknown structured message from server', { type: message.type });
    }
    return;
  }

  logger.debug('Message received from server', { message });
  
  switch (message) {
    case 'stop_whatsapp':
      await stopWhatsAppConnection();
      break;
    case 'start_whatsapp':
      await startWhatsAppConnection();
      break;
    default:
      logger.warn('Unknown message from server', { message });
  }
});

async function stopWhatsAppConnection() {
  try {
    // Delegates to the connection module which closes the ACTUAL socket.
    // (The old code referenced a non-existent whatsappClient.sock, so the
    //  socket stayed alive and a later start opened a SECOND connection -
    //  one of the causes of multiplying "Bad MAC" errors.)
    connectionStopped = true;
    await connect.stop();
    logger.whatsapp('WhatsApp connection stopped successfully');
  } catch (error) {
    logger.error('Error stopping WhatsApp connection', { error: error.message });
  }
}

async function startWhatsAppConnection() {
  try {
    logger.whatsapp('Starting WhatsApp connection');
    connectionStopped = false;
    
    // Reuse the SAME connection module - deleting require.cache (old approach)
    // leaked listeners and could open duplicate sockets.
    const result = await connect.resume();
    whatsappClient = result;
    
    if (result) {
      // Notify server about status change
      if (process.send) {
        process.send('whatsapp_connected');
      }
      logger.whatsapp('WhatsApp connection restarted successfully');
    } else {
      logger.whatsapp('WhatsApp connection start cancelled - stopped state');
    }
  } catch (error) {
    logger.error('Error starting WhatsApp connection', { error: error.message });
    if (process.send) {
      process.send('whatsapp_disconnected');
    }
  }
}

async function auth() {
  try {
    const credsPath = path.join(__dirname, "session", "creds.json");
    let existingCredentialsAreValid = false;

    if (fsx.existsSync(credsPath)) {
      try {
        const currentCredentials = JSON.parse(await fs.readFile(credsPath, "utf8"));
        existingCredentialsAreValid = isSessionCredentials(currentCredentials);
      } catch {
        existingCredentialsAreValid = false;
      }

      if (existingCredentialsAreValid) {
        logger.system("Session credentials found, initializing connection");
        return initialize();
      }

      const backupPath = `${credsPath}.invalid-${Date.now()}`;
      await fs.rename(credsPath, backupPath);
      logger.warn("Invalid creds.json moved aside; attempting environment session import");
    }

    if (String(process.env.SESSION || "").trim() || String(process.env.SESSION_ID || "").trim()) {
      logger.system("No valid creds.json found; attempting environment session import");
      if (await WriteSession()) {
        logger.system("Session credentials imported successfully");
        return initialize();
      }
    }

    logger.system("No usable session found; starting QR authentication");
    return initialize();
  } catch (error) {
    logger.error('Authentication initialization failed', { error: error.message });
    
    // Don't exit, allow QR code generation
    logger.system('Falling back to QR code authentication');
    return initialize();
  }
}

// Performance: Optimized file loading with parallel processing
async function readAndRequireFiles(directory) {
  try {
    const files = await fs.readdir(directory);
    const jsFiles = files.filter(file => path.extname(file) === ".js");
    
    logger.plugin('Loading plugin files', { 
      directory: path.relative(process.cwd(), directory), 
      totalFiles: jsFiles.length 
    });
    
    // Performance: Load files in parallel
    const results = await Promise.allSettled(
      jsFiles.map(async (file) => {
        try {
          const filePath = path.join(directory, file);
          require(filePath);
          return { file, status: 'loaded' };
        } catch (error) {
          logger.warn('Failed to load plugin file', { 
            file, 
            error: error.message 
          });
          return { file, status: 'failed', error: error.message };
        }
      })
    );
    
    const successful = results.filter(r => r.status === 'fulfilled' && r.value.status === 'loaded').length;
    const failed = results.length - successful;
    
    logger.plugin('Plugin files loaded', { 
      directory: path.relative(process.cwd(), directory),
      successful,
      failed,
      total: jsFiles.length
    });
    
  } catch (error) {
    logger.error('Error reading plugin directory', { 
      directory, 
      error: error.message 
    });
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
      logger.plugin('Using local plugins only - no external URL configured');
      return;
    }
    
    logger.plugin('Checking external plugins', { url: gitUrl });
    const startTime = Date.now();
    
    try {
      const response = await got(`${gitUrl}assets/plugins/`, {
        timeout: 10000,
        retry: 0
      });
      
      if (response.statusCode === 200) {
        const loadTime = Date.now() - startTime;
        logger.performance('External plugins check completed', loadTime);
      }
    } catch (error) {
      logger.plugin('External plugins check failed, using local only', { 
        error: error.message 
      });
    }
  } catch (error) {
    logger.warn('Plugin check error', { error: error.message });
  }
};

// Performance: Optimized initialization with timing and error handling
async function initialize() {
  const startTime = Date.now();
  logger.system('Aurora-MD initialization started', { version: '2.0.0' });
  
  try {
    // Performance: Parallel database and file loading
    logger.database('Initializing database and core files');
    
    if (config.USE_MONGODB && config.MONGODB_URI) {
      // MongoDB initialization with sync system
      logger.database('Initializing MongoDB with auto-sync');
      try {
        const mongoStoreDb = require("./assets/database/MongoStoreDb");
        await Promise.all([
          readAndRequireFiles(path.join(__dirname, "/assets/database/")),
          mongoStoreDb.initialize()
        ]);
        
        // In dual database mode, also initialize SQLite tables
        if (config.DATABASE) {
          await config.DATABASE.sync({ 
            logging: false,
            alter: true
          });
          logger.database('SQLite tables synchronized for dual database mode');
        }
        
        // Display sync status
        logger.database('MongoDB sync system initialized', {
          syncFrequency: 'Every 30 minutes',
          autoSync: true,
          dualMode: true
        });
        
      } catch (error) {
        logger.error('MongoDB initialization failed, falling back to SQLite', { 
          error: error.message 
        });
        
        // Load database models and use existing SQLite configuration
        await readAndRequireFiles(path.join(__dirname, "/assets/database/"));
        
        // Sync the existing SQLite database to create any missing tables
        if (config.DATABASE) {
          await config.DATABASE.sync({ 
            logging: false,
            alter: true
          });
          logger.database('SQLite fallback initialized with existing configuration');
        }
      }
      
    } else {
      // SQLite/PostgreSQL initialization
      logger.database('Initializing SQL database');
      // Load database models first
      await readAndRequireFiles(path.join(__dirname, "/assets/database/"));
      // Then sync the database to create tables
      await config.DATABASE.sync({ 
        logging: false, // Disable SQL logging for performance
        alter: true     // Enable table alterations to create missing tables
      });
    }
    
    logger.database('Database synchronization completed');
    
    logger.plugin('Installing plugins');
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
    logger.performance('Plugin installation completed', pluginTime);
    
    logger.whatsapp('Starting WhatsApp connection');
    const connectionStartTime = Date.now();
    const result = await connect();
    whatsappClient = result; // Store client reference
    
    // Notify server about successful connection
    if (process.send) {
      process.send('whatsapp_connected');
    }
    
    const connectionTime = Date.now() - connectionStartTime;
    const totalTime = Date.now() - startTime;
    
    logger.system('Aurora-MD initialization completed successfully', {
      totalTime: totalTime + 'ms',
      connectionTime: connectionTime + 'ms',
      pluginTime: pluginTime + 'ms'
    });
    
    // Display database sync information if MongoDB is enabled
    if (config.USE_MONGODB && config.MONGODB_URI) {
      logger.database('Database sync information', {
        mongodbSQLiteSync: 'Active',
        syncInterval: 'Every 30 minutes',
        dataConsistency: 'Guaranteed',
        manualSync: 'Available via commands'
      });
    }
    
    return result;
    
  } catch (error) {
    logger.error('Initialization failed', { 
      error: error.message,
      stack: error.stack 
    });
    return process.exit(1);
  }
}

auth();
