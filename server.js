const cluster = require('cluster');
const path = require('path');
const fs = require('fs').promises;
const fss = require('fs');

const workers = {};
let whatsappConnectionStatus = 'unknown'; // Track WhatsApp connection status

const logger = {
    info: (msg) => console.log(`[INFO] ${new Date().toISOString()} - ${msg}`),
    error: (msg) => console.error(`[ERROR] ${new Date().toISOString()} - ${msg}`),
    warn: (msg) => console.warn(`[WARN] ${new Date().toISOString()} - ${msg}`)
};

function start(file) {
    if (workers[file]) {
        logger.warn(`Worker for ${file} already exists`);
        return;
    }
    
    try {
        const args = [path.join(__dirname, file), ...process.argv.slice(2)];

        cluster.setupMaster({
            exec: path.join(__dirname, file),
            args: args.slice(1),
        });

        const p = cluster.fork();
        
        p.on('message', async (data) => {
            logger.info(`Received message from ${file}: ${data}`);
            switch (data) {
                case 'reset':
                    resetProcess(file);
                    break;
                case 'uptime':
                    p.send(process.uptime());
                    break;
                case 'shutdown':
                    shutdown();
                    break;
                case 'whatsapp_connected':
                    whatsappConnectionStatus = 'connected';
                    logger.info('WhatsApp connection established');
                    break;
                case 'whatsapp_disconnected':
                    whatsappConnectionStatus = 'disconnected';
                    logger.info('WhatsApp connection lost');
                    break;
                case 'whatsapp_stopped':
                    whatsappConnectionStatus = 'stopped';
                    logger.info('WhatsApp connection stopped');
                    break;
                default:
                    logger.warn(`Unknown message from ${file}: ${data}`);
            }
        });

        p.on('exit', (code, signal) => {
            logger.error(`Child process for ${file} exited with code: ${code}, signal: ${signal}`);
            if (!workers[file]) {
                logger.error(`No process reference found for ${file}`);
                return;
            }

            delete workers[file];

            // Add delay before restart to prevent rapid restart loops
            setTimeout(() => {
                logger.info("Restarting the process");
                start(file);
            }, 2000);
        });

        p.on('error', (error) => {
            logger.error(`Worker error for ${file}: ${error.message}`);
        });

        workers[file] = p;
        logger.info(`Started worker for ${file} with PID: ${p.process.pid}`);
    } catch (error) {
        logger.error(`Failed to start worker for ${file}: ${error.message}`);
    }
}

function resetProcess(file) {
    const worker = workers[file];
    if (worker) {
        logger.info(`Resetting process for ${file}`);
        worker.kill();
    } else {
        logger.error(`No child process running for ${file}`);
    }
}

function BootUp() {
    logger.info("Booting Up Sequence Initiated!");
    start("index.js");
}

function shutdown() {
    logger.info("Shutting down the server...");
    const shutdownPromises = Object.keys(workers).map(file => 
        new Promise((resolve) => {
            stopProcess(file);
            resolve();
        })
    );
    
    Promise.all(shutdownPromises).then(() => {
        logger.info("All processes stopped");
        process.exit(0);
    });
}

function stopProcess(file) {
    const worker = workers[file];
    if (worker) {
        try {
            worker.send('shutdown');
            delete workers[file];
            logger.info(`Stopping process for ${file}`);
        } catch (error) {
            logger.error(`Error stopping process for ${file}: ${error.message}`);
        }
    } else {
        logger.error(`No child process running for ${file}`);
    }
}

async function deleteSession() {
    try {
        const files = await fs.readdir('session/');
        const deletePromises = files
            .filter(file => file !== 'Aurora.txt')
            .map(async (file) => {
                try {
                    await fs.unlink(path.join('session/', file));
                    logger.info(`${file} has been deleted`);
                } catch (err) {
                    logger.error(`Error deleting file ${file}: ${err.message}`);
                }
            });
        
        await Promise.all(deletePromises);
        logger.info("Session cleanup completed");
    } catch (err) {
        logger.error(`Error reading directory: ${err.message}`);
    }
}

logger.info("==================================================");
logger.info("                Server Starting...!");
logger.info("==================================================");

// Display MongoDB configuration status
const mongoConfigured = process.env.USE_MONGODB === 'true' && process.env.MONGODB_URI;
if (mongoConfigured) {
    logger.info("🍃 MongoDB Configuration:");
    logger.info(`   Database: ${mongoConfigured ? '✅ Enabled' : '❌ Disabled'}`);
    logger.info(`   URI: ${process.env.MONGODB_URI.substring(0, 20)}...`);
    logger.info("   Auto-sync: Every 30 minutes with SQLite");
    logger.info("   Dual database operation: ACTIVE");
} else {
    logger.info("🗃️ Database Configuration:");
    logger.info("   Database: SQLite only");
    logger.info("   MongoDB: ❌ Not configured");
    logger.info("   💡 Set MONGODB_URI and USE_MONGODB=true to enable dual database");
}
logger.info("==================================================");

const express = require("express");
const app = express();
const port = process.env.PORT || 8000;

// Middleware for parsing JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        uptime: process.uptime(),
        workers: Object.keys(workers),
        botStatus: whatsappConnectionStatus,
        timestamp: new Date().toISOString()
    });
});

app.post('/restart', (req, res) => {
    logger.info("Restart request received");
    try {
        Object.keys(workers).forEach(file => resetProcess(file));
        res.status(200).json({ message: 'Restart initiated' });
    } catch (error) {
        logger.error(`Restart error: ${error.message}`);
        res.status(500).json({ error: 'Restart failed' });
    }
});

app.post('/stop-whatsapp', (req, res) => {
    logger.info("Stop WhatsApp request received");
    try {
        const worker = workers['index.js'];
        if (worker) {
            worker.send('stop_whatsapp');
            whatsappConnectionStatus = 'stopped';
            res.status(200).json({ message: 'WhatsApp connection stopped' });
        } else {
            res.status(404).json({ error: 'No WhatsApp process running' });
        }
    } catch (error) {
        logger.error(`Stop WhatsApp error: ${error.message}`);
        res.status(500).json({ error: 'Stop WhatsApp failed' });
    }
});

app.post('/start-whatsapp', (req, res) => {
    logger.info("Start WhatsApp request received");
    try {
        const worker = workers['index.js'];
        if (worker) {
            worker.send('start_whatsapp');
            whatsappConnectionStatus = 'connecting';
            res.status(200).json({ message: 'WhatsApp connection starting' });
        } else {
            // If no worker exists, start the process
            start("index.js");
            whatsappConnectionStatus = 'connecting';
            res.status(200).json({ message: 'WhatsApp process started' });
        }
    } catch (error) {
        logger.error(`Start WhatsApp error: ${error.message}`);
        res.status(500).json({ error: 'Start WhatsApp failed' });
    }
});

app.post('/update', (req, res) => {
    logger.info("Update request received - Discarding Session");
    try {
        deleteSession();
        res.status(200).json({ message: 'Session cleanup initiated' });
    } catch (error) {
        logger.error(`Update error: ${error.message}`);
        res.status(500).json({ error: 'Update failed' });
    }
});

app.post('/shutdown', (req, res) => {
    logger.info("Shutdown request received");
    res.status(200).json({ message: 'Shutdown initiated' });
    shutdown();
});

app.post('/feksession', (req, res) => {
    logger.info("Session check request received");
    res.status(200).json({ message: 'Session check completed' });
});

app.get('/', (req, res) => { 
    res.sendFile(path.join(__dirname, 'lib/Messages/index.html')); 
});

// Error handling middleware
app.use((error, req, res, next) => {
    logger.error(`Express error: ${error.message}`);
    res.status(500).json({ error: 'Internal server error' });
});

// Start server
const server = app.listen(port, () => {
    logger.info(`Aurora Server listening on port http://localhost:${port}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    logger.info('SIGTERM received, shutting down gracefully');
    server.close(() => {
        shutdown();
    });
});

process.on('SIGINT', () => {
    logger.info('SIGINT received, shutting down gracefully');
    server.close(() => {
        shutdown();
    });
});

// Start the main process
start("index.js");