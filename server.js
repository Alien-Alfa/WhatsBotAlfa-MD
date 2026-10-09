const cluster = require('cluster');
const path = require('path');
const fs = require('fs').promises;
const fss = require('fs');
const { logger } = require('./lib/logger');
const configSchema = require('./lib/configSchema');

const workers = {};
let whatsappConnectionStatus = 'unknown';
let serverStartTime = Date.now();
let isShuttingDown = false;

// ---------------------------------------------------------------------------
// In-memory telemetry for the dashboard: recent logs, error counter, worker
// stats. Errors from the worker process arrive over IPC ('log' messages),
// the server's own logs are captured through logger.onEntry.
// ---------------------------------------------------------------------------
const logBuffer = [];   // all recent entries (cap 500)
const errorBuffer = []; // ERROR/WARN entries (cap 300)
const MAX_LOG_BUFFER = 500;
const MAX_ERROR_BUFFER = 300;
let errorCounts = { ERROR: 0, WARN: 0 };
let workerStats = null;
let workerStatsUpdatedAt = 0;

function pushLogEntry(entry) {
  if (!entry || !entry.level) return;
  logBuffer.push(entry);
  if (logBuffer.length > MAX_LOG_BUFFER) logBuffer.shift();
  if (entry.level === 'ERROR' || entry.level === 'WARN') {
    errorBuffer.push(entry);
    if (errorBuffer.length > MAX_ERROR_BUFFER) errorBuffer.shift();
    errorCounts[entry.level] = (errorCounts[entry.level] || 0) + 1;
  }
}

// Capture this process's own log entries for the dashboard
logger.onEntry = pushLogEntry;

// Correlated request/response with the worker process (for config API)
let ipcSeq = 0;
const pendingIpc = new Map();

function requestFromWorker(payload, timeoutMs = 3000) {
  return new Promise((resolve) => {
    const worker = workers['index.js'];
    if (!worker || !worker.send) return resolve(null);
    const id = ++ipcSeq;
    const timer = setTimeout(() => {
      pendingIpc.delete(id);
      resolve(null);
    }, timeoutMs);
    pendingIpc.set(id, (value) => {
      clearTimeout(timer);
      pendingIpc.delete(id);
      resolve(value);
    });
    try {
      worker.send({ ...payload, id });
    } catch {
      clearTimeout(timer);
      pendingIpc.delete(id);
      resolve(null);
    }
  });
}

function settleIpc(message) {
  if (!message || typeof message !== 'object' || !message.id) return false;
  const resolver = pendingIpc.get(message.id);
  if (!resolver) return false;
  resolver(message);
  return true;
}

function redactConfig(values = {}) {
    const safeValues = { ...values };
    const secretsConfigured = {};
    for (const [key, definition] of Object.entries(configSchema.schema)) {
        if (!definition.secret) continue;
        secretsConfigured[key] = Boolean(safeValues[key]);
        safeValues[key] = '';
    }
    return { values: safeValues, secretsConfigured };
}

function start(file) {
    if (workers[file]) {
        logger.warn('Worker already exists', { file, pid: workers[file].process?.pid });
        return;
    }
    
    try {
        const args = [path.join(__dirname, file), ...process.argv.slice(2)];

        cluster.setupMaster({
            exec: path.join(__dirname, file),
            args: args.slice(1),
        });

        const worker = cluster.fork();
        
        worker.on('message', async (data) => {
            // Structured telemetry / config IPC from the worker
            if (data && typeof data === 'object') {
                if (settleIpc(data)) return;
                switch (data.type) {
                    case 'log':
                        // Batched ERROR/WARN entries for the dashboard
                        (data.entries || []).forEach(pushLogEntry);
                        return;
                    case 'stats':
                        workerStats = data.data || null;
                        workerStatsUpdatedAt = Date.now();
                        return;
                    default:
                        logger.debug('Worker structured message', { file, type: data.type });
                        // Structured stats heartbeats from the worker carry the
                        // live socket state - keep the dashboard status in sync
                        // even when string 'whatsapp_*' signals were missed
                        // (e.g. worker restarted but status stayed stale).
                        if (data.type === 'stats' && data.data && typeof data.data === 'object') {
                            const d = data.data;
                            if (d.connectionStopped === true) whatsappConnectionStatus = 'stopped';
                            else if (d.connectionActive === true || d.connectionActive === 'true') whatsappConnectionStatus = 'connected';
                            // Never overwrite with 'disconnected' from a stats
                            // heartbeat alone - transients flap; explicit
                            // 'whatsapp_disconnected' below handles real drops.
                        }
                        return;
                }
            }

            logger.debug('Worker message received', { file, message: data });
            
            switch (data) {
                case 'reset':
                    logger.system('Worker reset requested', { file });
                    resetProcess(file);
                    break;
                case 'Kill':
                    logger.system('Shutdown requested by worker', { file });
                    shutdown();
                    break;
                case 'uptime':
                    const uptime = Math.floor(process.uptime());
                    worker.send(uptime);
                    logger.trace('Uptime sent to worker', { file, uptime });
                    break;
                case 'shutdown':
                    logger.system('Shutdown requested by worker', { file });
                    shutdown();
                    break;
                case 'whatsapp_connected':
                    whatsappConnectionStatus = 'connected';
                    logger.whatsapp('Connection established');
                    break;
                case 'whatsapp_disconnected':
                    whatsappConnectionStatus = 'disconnected';
                    logger.whatsapp('Connection lost');
                    break;
                case 'whatsapp_stopped':
                    whatsappConnectionStatus = 'stopped';
                    logger.whatsapp('Service stopped');
                    break;
                case 'whatsapp_started':
                    whatsappConnectionStatus = 'connected';
                    logger.whatsapp('Service started');
                    break;
                default:
                    logger.warn('Unknown worker message', { file, message: data });
            }
        });

        worker.on('exit', (code, signal) => {
            logger.error('Worker process exited', { 
                file, 
                code, 
                signal, 
                pid: worker.process?.pid,
                restartScheduled: true 
            });
            
            if (!workers[file]) {
                logger.error('Worker reference not found', { file });
                return;
            }

            delete workers[file];

            // Restart the worker unless the WHOLE server is shutting down.
            // NOTE: the condition used to be `code !== 0`, but the worker now
            // exits gracefully with code 0 on SIGTERM (flush + socket close),
            // which silently disabled auto-restart and left the bot dead after
            // a dashboard/chat "restart". A stopped worker is never intended.
            if (!isShuttingDown) {
                // Add delay before restart to prevent rapid restart loops
                setTimeout(() => {
                    if (isShuttingDown) return;
                    logger.system('Restarting worker process', { file, delay: '2000ms' });
                    start(file);
                }, 2000);
            }
        });

        worker.on('error', (error) => {
            // Ignore EPIPE errors which occur when the main process exits before worker
            if (error.code === 'EPIPE') {
                logger.debug('Worker EPIPE error (main process shutting down)', { 
                    file,
                    error: error.message 
                });
                return;
            }
            
            logger.error('Worker error occurred', { 
                file, 
                error: error.message,
                stack: error.stack,
                code: error.code 
            });
        });

        workers[file] = worker;
        logger.system('Worker started successfully', { 
            file, 
            pid: worker.process.pid,
            workerId: worker.id 
        });
        
    } catch (error) {
        logger.error('Failed to start worker', { 
            file, 
            error: error.message,
            stack: error.stack 
        });
    }
}

function resetProcess(file) {
    const worker = workers[file];
    if (worker) {
        logger.system('Resetting worker process', { file, pid: worker.process?.pid });
        worker.kill();
    } else {
        logger.error('No worker process found for reset', { file });
    }
}

function BootUp() {
    logger.system('Boot sequence initiated');
    start("index.js");
}

function shutdown() {
    isShuttingDown = true;
    
    logger.system('Graceful shutdown initiated', { 
        activeWorkers: Object.keys(workers).length,
        uptime: Math.floor((Date.now() - serverStartTime) / 1000) + 's'
    });
    
    const shutdownPromises = Object.keys(workers).map(file => 
        new Promise((resolve) => {
            const worker = workers[file];
            if (worker && worker.process) {
                // Give worker time to shutdown gracefully
                worker.process.kill('SIGTERM');
                setTimeout(() => {
                    if (workers[file]) {
                        worker.process.kill('SIGKILL');
                    }
                    resolve();
                }, 5000);
            } else {
                resolve();
            }
        })
    );
    
    Promise.all(shutdownPromises).then(() => {
        logger.system('All worker processes stopped successfully');
        logger.shutdown();
        process.exit(0);
    });
}

function stopProcess(file) {
    const worker = workers[file];
    if (worker) {
        try {
            worker.send('shutdown');
            delete workers[file];
            logger.system('Worker process stopped', { file, pid: worker.process?.pid });
        } catch (error) {
            logger.error('Error stopping worker process', { 
                file, 
                error: error.message 
            });
        }
    } else {
        logger.error('No worker process found for stop', { file });
    }
}

async function deleteSession() {
    try {
        const sessionDir = 'session/';
        const files = await fs.readdir(sessionDir);
        const protectedFiles = ['Aurora.txt'];
        
        const deletePromises = files
            .filter(file => !protectedFiles.includes(file))
            .map(async (file) => {
                try {
                    await fs.unlink(path.join(sessionDir, file));
                    logger.debug('Session file deleted', { file });
                } catch (err) {
                    logger.error('Error deleting session file', { 
                        file, 
                        error: err.message 
                    });
                }
            });
        
        await Promise.all(deletePromises);
        logger.system('Session cleanup completed', { 
            totalFiles: files.length,
            deletedFiles: files.length - protectedFiles.length,
            protectedFiles 
        });
        
    } catch (err) {
        logger.error('Session cleanup failed', { error: err.message });
    }
}

// Display startup banner and configuration
logger.banner();
logger.system('Server initialization started');

// MongoDB configuration logging
const mongoConfigured = process.env.USE_MONGODB === 'true' && process.env.MONGODB_URI;
if (mongoConfigured) {
    logger.database('MongoDB configuration detected', {
        enabled: true,
        uri: process.env.MONGODB_URI.substring(0, 20) + '...',
        autoSync: 'Every 30 minutes',
        dualMode: true
    });
} else {
    logger.database('SQLite configuration active', {
        mongodb: false,
        suggestion: 'Set MONGODB_URI and USE_MONGODB=true for dual database mode'
    });
}

const express = require("express");
const app = express();
const port = process.env.PORT || 8000;

// Middleware for parsing JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
    const healthData = {
        status: 'ok',
        uptime: Math.floor(process.uptime()),
        workers: Object.keys(workers),
        botStatus: whatsappConnectionStatus,
        errorCounts,
        timestamp: new Date().toISOString(),
        memory: {
            used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
            total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024)
        },
        version: require('./package.json').version
    };
    
    logger.trace('Health check requested', { ip: req.ip });
    res.json(healthData);
});

// ---------------------------------------------------------------------------
// Dashboard API - stats, logs, errors, configuration
// ---------------------------------------------------------------------------

// Runtime stats (server + worker + counters)
app.get('/api/stats', (req, res) => {
    res.json({
        status: whatsappConnectionStatus,
        server: {
            uptime: Math.floor(process.uptime()),
            startedAt: new Date(serverStartTime).toISOString(),
            pid: process.pid,
            memory: {
                used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
                total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024)
            },
            version: require('./package.json').version,
            node: process.version,
            environment: process.env.NODE_ENV || 'development'
        },
        workers: Object.keys(workers),
        bot: workerStats,
        botStatsUpdatedAt: workerStatsUpdatedAt ? new Date(workerStatsUpdatedAt).toISOString() : null,
        logs: {
            errorCounts,
            recentCount: logBuffer.length,
            errorCount: errorBuffer.length
        },
        timestamp: new Date().toISOString()
    });
});

// Recent log entries (level filter optional: ?level=ERROR&limit=200)
app.get('/api/logs', (req, res) => {
    const limit = Math.min(parseInt(req.query.limit, 10) || 200, 500);
    const level = req.query.level ? String(req.query.level).toUpperCase() : null;
    const entries = level ? logBuffer.filter(e => e.level === level) : logBuffer;
    res.json({
        entries: entries.slice(-limit),
        total: logBuffer.length,
        errorCounts
    });
});

// Every ERROR/WARN that occurred (+ counters)
app.get('/api/errors', (req, res) => {
    const limit = Math.min(parseInt(req.query.limit, 10) || 100, 300);
    res.json({
        entries: errorBuffer.slice(-limit),
        counts: errorCounts,
        total: errorBuffer.length
    });
});

// Clear the error counter + error list
app.post('/api/clear-errors', (req, res) => {
    logger.system('Error log cleared from dashboard', { ip: req.ip });
    errorBuffer.length = 0;
    errorCounts = { ERROR: 0, WARN: 0 };
    try { logger.clearErrors(); } catch { /* ignore */ }
    res.json({ ok: true, counts: errorCounts });
});

// Effective configuration (live values from the worker when it's alive)
app.get('/api/config', async (req, res) => {
    const reply = await requestFromWorker({ type: 'get_config' }, 3000);
    const overrides = configSchema.loadOverrides();
    const runtime = reply?.values || {};
    const safeRuntime = redactConfig(runtime);
    const safeOverrides = redactConfig(overrides);
    const secretsConfigured = {
        ...safeOverrides.secretsConfigured,
        ...Object.fromEntries(Object.entries(safeRuntime.secretsConfigured).map(([key, value]) => [
            key,
            value || safeOverrides.secretsConfigured[key]
        ]))
    };
    res.json({
        schema: configSchema.schema,
        keys: configSchema.displayKeys,
        editableKeys: configSchema.editableKeys,
        values: reply ? safeRuntime.values : null,
        overrides: safeOverrides.values,
        secretsConfigured,
        workerAlive: !!workers['index.js']
    });
});

// Persist + live-apply configuration overrides
app.post('/api/config', async (req, res) => {
    logger.system('Config update requested', { ip: req.ip });
    try {
        const body = req.body || {};
        const save = configSchema.saveOverrides(body);
        if (!save.ok) {
            return res.status(400).json({ ok: false, error: save.error });
        }

        const previous = await requestFromWorker({ type: 'get_config' }, 3000);
        const restartRequired = Object.keys(save.values).filter(key => {
            const definition = configSchema.schema[key];
            return definition?.restartRequired && previous?.values?.[key] !== save.values[key];
        });

        // Live-apply in the worker process (shared config object)
        const reply = await requestFromWorker(
            { type: 'config_update', overrides: save.values },
            3000
        );

        const safeSave = redactConfig(save.values);
        res.json({
            ok: true,
            values: safeSave.values,
            secretsConfigured: safeSave.secretsConfigured,
            restartRequired,
            appliedLive: reply ? !!reply.ok && restartRequired.length === 0 : false,
            applyError: reply?.error || null,
            note: restartRequired.length
                ? `Saved. Restart required for: ${restartRequired.join(', ')}`
                : reply
                ? 'Applied live'
                : 'Saved - worker not reachable, will apply on next start'
        });
    } catch (error) {
        logger.error('Config update failed', { error: error.message });
        res.status(500).json({ ok: false, error: error.message });
    }
});

function normalizeCallJid(value) {
    const raw = String(value || '').trim();
    if (/^\d{5,20}$/.test(raw)) return `${raw}@s.whatsapp.net`;
    if (/^\d{5,20}(?::\d+)?@(s\.whatsapp\.net|lid)$/i.test(raw)) return raw;
    return null;
}

app.get('/api/call-access', async (req, res) => {
    const reply = await requestFromWorker({ type: 'get_call_access' }, 5000);
    if (!reply) return res.status(503).json({ ok: false, error: 'Bot worker is unavailable' });
    res.json({ ok: true, entries: reply.entries || [], globalAllowAll: reply.globalAllowAll === true });
});

app.post('/api/call-access', async (req, res) => {
    const jid = normalizeCallJid(req.body?.jid);
    if (!jid) return res.status(400).json({ ok: false, error: 'Enter a valid phone JID or LID' });
    const reply = await requestFromWorker({
        type: 'set_call_access',
        jid,
        enabled: req.body?.enabled === true
    }, 5000);
    if (!reply?.ok) return res.status(503).json({ ok: false, error: reply?.error || 'Call access update failed' });
    res.json({ ok: true, entries: reply.entries || [] });
});

app.post('/api/call-access/global', async (req, res) => {
    const enabled = req.body?.enabled === true;
    const saved = configSchema.saveOverrides({ ALLOW_ALL_CALLS: enabled });
    if (!saved.ok) return res.status(400).json({ ok: false, error: saved.error });
    const applied = await requestFromWorker({
        type: 'config_update',
        overrides: { ALLOW_ALL_CALLS: enabled }
    }, 5000);
    res.json({
        ok: true,
        enabled,
        appliedLive: !!applied?.ok
    });
});

app.post('/api/call-access/global', async (req, res) => {
    const enabled = req.body?.enabled === true;
    const saved = configSchema.saveOverrides({ ALLOW_ALL_CALLS: enabled });
    if (!saved.ok) return res.status(400).json({ ok: false, error: saved.error });
    const applied = await requestFromWorker({
        type: 'config_update',
        overrides: { ALLOW_ALL_CALLS: enabled }
    }, 5000);
    res.json({ ok: true, enabled, appliedLive: !!applied?.ok });
});

app.post('/restart', (req, res) => {
    logger.system('Restart request received', { ip: req.ip, userAgent: req.get('User-Agent') });
    try {
        Object.keys(workers).forEach(file => resetProcess(file));
        res.status(200).json({ 
            message: 'Restart initiated successfully',
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        logger.error('Restart request failed', { error: error.message });
        res.status(500).json({ 
            error: 'Restart failed',
            message: error.message 
        });
    }
});

app.post('/stop-whatsapp', (req, res) => {
    logger.whatsapp('Stop request received', { ip: req.ip });
    try {
        const worker = workers['index.js'];
        if (worker) {
            worker.send('stop_whatsapp');
            whatsappConnectionStatus = 'stopped';
            res.status(200).json({ 
                message: 'WhatsApp connection stopped successfully',
                timestamp: new Date().toISOString()
            });
        } else {
            res.status(404).json({ 
                error: 'No WhatsApp process running',
                timestamp: new Date().toISOString()
            });
        }
    } catch (error) {
        logger.error('Stop WhatsApp request failed', { error: error.message });
        res.status(500).json({ 
            error: 'Stop WhatsApp failed',
            message: error.message 
        });
    }
});

app.post('/start-whatsapp', (req, res) => {
    logger.whatsapp('Start request received', { ip: req.ip });
    try {
        const worker = workers['index.js'];
        if (worker) {
            worker.send('start_whatsapp');
            whatsappConnectionStatus = 'connecting';
            res.status(200).json({ 
                message: 'WhatsApp connection starting',
                timestamp: new Date().toISOString()
            });
        } else {
            // If no worker exists, start the process
            start("index.js");
            whatsappConnectionStatus = 'connecting';
            res.status(200).json({ 
                message: 'WhatsApp process started',
                timestamp: new Date().toISOString()
            });
        }
    } catch (error) {
        logger.error('Start WhatsApp request failed', { error: error.message });
        res.status(500).json({ 
            error: 'Start WhatsApp failed',
            message: error.message 
        });
    }
});

app.post('/update', (req, res) => {
    logger.system('Update request received - Session cleanup', { ip: req.ip });
    try {
        deleteSession();
        res.status(200).json({ 
            message: 'Session cleanup initiated',
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        logger.error('Update request failed', { error: error.message });
        res.status(500).json({ 
            error: 'Update failed',
            message: error.message 
        });
    }
});

app.post('/shutdown', (req, res) => {
    logger.system('Shutdown request received', { ip: req.ip });
    res.status(200).json({ 
        message: 'Shutdown initiated',
        timestamp: new Date().toISOString()
    });
    shutdown();
});

app.post('/feksession', (req, res) => {
    logger.trace('Session check request received', { ip: req.ip });
    res.status(200).json({ 
        message: 'Session check completed',
        timestamp: new Date().toISOString()
    });
});

app.get('/', (req, res) => { 
    logger.trace('Root endpoint accessed', { ip: req.ip });
    res.sendFile(path.join(__dirname, 'lib/Messages/index.html')); 
});

// Error handling middleware
app.use((error, req, res, next) => {
    logger.error('Express middleware error', { 
        error: error.message,
        stack: error.stack,
        url: req.url,
        method: req.method,
        ip: req.ip
    });
    res.status(500).json({ 
        error: 'Internal server error',
        timestamp: new Date().toISOString()
    });
});

// Start server with port conflict handling
let server = null;

function startServer(portToUse) {
    return new Promise((resolve, reject) => {
        const serverInstance = app.listen(portToUse, () => {
            logger.system('Aurora Server started successfully', { 
                port: portToUse,
                url: `http://localhost:${portToUse}`,
                environment: process.env.NODE_ENV || 'development'
            });
            resolve(serverInstance);
        }).on('error', (err) => {
            reject(err);
        });
    });
}

async function initializeServer() {
    try {
        server = await startServer(port);
    } catch (err) {
        if (err.code === 'EADDRINUSE') {
            logger.error('Port already in use, trying alternative port', { 
                requestedPort: port,
                error: err.message 
            });
            
            // Try alternative port
            const alternativePort = port + 1;
            logger.info('Attempting to start on alternative port', { port: alternativePort });
            
            try {
                server = await startServer(alternativePort);
            } catch (altErr) {
                logger.error('Failed to start server on alternative port', { 
                    port: alternativePort,
                    error: altErr.message 
                });
                process.exit(1);
            }
        } else {
            logger.error('Server startup failed', { error: err.message });
            process.exit(1);
        }
    }
}

// Graceful shutdown handlers
process.on('SIGTERM', () => {
    logger.system('SIGTERM received - Graceful shutdown initiated');
    if (server) {
        server.close(() => {
            shutdown();
        });
    } else {
        shutdown();
    }
});

process.on('SIGINT', () => {
    logger.system('SIGINT received - Graceful shutdown initiated');
    if (server) {
        server.close(() => {
            shutdown();
        });
    } else {
        shutdown();
    }
});

// Uncaught exception handler
process.on('uncaughtException', (error) => {
    logger.error('Uncaught exception detected', {
        error: error.message,
        stack: error.stack,
        fatal: true
    });
    
    // Graceful shutdown on uncaught exception
    if (server) {
        server.close(() => {
            process.exit(1);
        });
    } else {
        process.exit(1);
    }
});

// Unhandled promise rejection handler
process.on('unhandledRejection', (reason, promise) => {
    logger.error('Unhandled promise rejection detected', {
        reason: reason?.message || reason,
        promise: promise.toString()
    });
});

// Worker process error handling
process.on('message', (message) => {
    if (message.type === 'error') {
        logger.error('Worker process error', {
            error: message.error,
            stack: message.stack
        });
    }
});

// Initialize server and start the main process
async function initialize() {
    try {
        await initializeServer();
        // Dev/test mode: run the API server WITHOUT forking the WhatsApp
        // worker (never opens a second WhatsApp connection).
        if (process.env.AURORA_NO_WORKER === 'true') {
            logger.system('AURORA_NO_WORKER=true - API server only, worker not started');
            return;
        }
        logger.system('Starting main worker process');
        start("index.js");
    } catch (error) {
        logger.error('Failed to initialize application', {
            error: error.message,
            stack: error.stack
        });
        process.exit(1);
    }
}

// Start the application
initialize();