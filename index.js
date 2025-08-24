const fs = require("fs").promises;
const fsx = require("fs");
const path = require("path");

// Set global base directory
global.__basedir = __dirname;

// Filter out verbose technical messages
const originalConsoleLog = console.log;
console.log = (...args) => {
  const message = args.join(' ');
  
  // Filter out verbose session messages
  if (message.includes('Closing session:') || 
      message.includes('SessionEntry') ||
      message.includes('_chains:') ||
      message.includes('registrationId:') ||
      message.includes('currentRatchet:') ||
      message.includes('ephemeralKeyPair:') ||
      message.includes('lastRemoteEphemeralKey:') ||
      message.includes('previousCounter:') ||
      message.includes('rootKey:') ||
      message.includes('indexInfo:') ||
      message.includes('baseKey:') ||
      message.includes('baseKeyType:') ||
      message.includes('remoteIdentityKey:') ||
      message.includes('pendingPreKey:') ||
      message.includes('pubKey:') ||
      message.includes('privKey:') ||
      message.includes('<Buffer ') ||
      message.includes('Buffer(') ||
      message.includes('chainKey: [Object]') ||
      message.includes('chainType:') ||
      message.includes('messageKeys: {}') ||
      message.includes('  }') && (message.includes('chains') || message.includes('Ratchet') || message.includes('Info'))) {
    return; // Suppress these messages
  }
  
  // Show only the summary for session closing
  if (message.includes('Closing open session in favor of incoming prekey bundle')) {
    originalConsoleLog('WHATSAPP: Session updated - incoming prekey bundle');
    return;
  }
  
  originalConsoleLog(...args);
};

const config = require("./config");
const connect = require("./lib/connection");
const { UpdateLocal, WriteSession} = require("./lib");
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

// Listen for messages from parent process (server.js)
process.on('message', async (message) => {
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
    logger.whatsapp('Stopping WhatsApp connection');
    connectionStopped = true;
    
    if (whatsappClient && whatsappClient.sock) {
      await whatsappClient.sock.logout();
      whatsappClient.sock.end();
    }
    
    // Notify server about status change
    if (process.send) {
      process.send('whatsapp_stopped');
    }
    
    logger.whatsapp('WhatsApp connection stopped successfully');
  } catch (error) {
    logger.error('Error stopping WhatsApp connection', { error: error.message });
  }
}

async function startWhatsAppConnection() {
  try {
    logger.whatsapp('Starting WhatsApp connection');
    connectionStopped = false;
    
    // Import fresh connection module
    delete require.cache[require.resolve('./lib/connection')];
    const connect = require("./lib/connection");
    
    // Re-initialize the connection
    const result = await connect();
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
    if (!fsx.existsSync("./session/creds.json")) {
      logger.system('Session credentials not found, attempting to generate from environment');
      
      // Try to generate session from environment variables
      if (process.env.SESSION || process.env.SESSION_ID) {
        await WriteSession();
        
        // Check if session was successfully created
        if (fsx.existsSync("./session/creds.json")) {
          logger.system('Session generated successfully from environment');
          return initialize();
        }
      }
      
      // If no session environment variables or generation failed, proceed with QR
      logger.system('No session found, will generate QR code for authentication');
      return initialize();
    }
    
    logger.system('Session credentials found, initializing connection');
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
