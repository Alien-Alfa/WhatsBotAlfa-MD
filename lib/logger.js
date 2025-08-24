/**
 * Aurora-MD Production Logging System
 * Author: AlienAlfa
 * Description: Centralized, production-ready logging with levels, formatting, and performance monitoring
 */

const fs = require('fs');
const path = require('path');
const util = require('util');

class Logger {
  constructor(options = {}) {
    this.levels = {
      ERROR: 0,
      WARN: 1,
      INFO: 2,
      SYSTEM: 2,     // Same as INFO
      WHATSAPP: 2,   // Same as INFO  
      PERFORMANCE: 2, // Same as INFO
      DATABASE: 3,   // Same as DEBUG
      PLUGIN: 3,     // Same as DEBUG
      DEBUG: 3,
      TRACE: 4
    };

    this.colors = {
      ERROR: '\x1b[31m',     // Red
      WARN: '\x1b[33m',      // Yellow
      INFO: '\x1b[36m',      // Cyan
      SYSTEM: '\x1b[32m',    // Green
      WHATSAPP: '\x1b[34m',  // Blue
      PERFORMANCE: '\x1b[95m', // Bright Magenta
      DATABASE: '\x1b[90m',  // Dark Gray
      PLUGIN: '\x1b[35m',    // Magenta
      DEBUG: '\x1b[35m',     // Magenta
      TRACE: '\x1b[37m',     // White
      RESET: '\x1b[0m'
    };

    this.config = {
      level: process.env.LOG_LEVEL || 'INFO',
      enableColors: process.env.NODE_ENV !== 'production',
      enableFileLogging: process.env.ENABLE_FILE_LOGGING === 'true',
      maxFileSize: 10 * 1024 * 1024, // 10MB
      maxFiles: 5,
      logDir: path.join(process.cwd(), 'logs'),
      ...options
    };

    this.currentLogLevel = this.levels[this.config.level] || this.levels.INFO;
    
    // Create logs directory if file logging is enabled
    if (this.config.enableFileLogging) {
      this.ensureLogDir();
    }

    // Performance monitoring
    this.metrics = {
      totalLogs: 0,
      logsByLevel: {},
      startTime: Date.now()
    };

    Object.keys(this.levels).forEach(level => {
      this.metrics.logsByLevel[level] = 0;
    });
  }

  ensureLogDir() {
    try {
      if (!fs.existsSync(this.config.logDir)) {
        fs.mkdirSync(this.config.logDir, { recursive: true });
      }
    } catch (error) {
      console.error('Failed to create log directory:', error.message);
    }
  }

  formatMessage(level, message, meta = {}) {
    // Format the base message
    let formattedMessage = typeof message === 'object' 
      ? util.inspect(message, { depth: 2, colors: false })
      : String(message);

    // Add metadata if provided
    if (Object.keys(meta).length > 0) {
      const metaString = Object.entries(meta)
        .map(([key, value]) => `${key}=${JSON.stringify(value)}`)
        .join(' ');
      formattedMessage += ` | ${metaString}`;
    }

    // Simple format without timestamp and process info for console
    const simpleFormat = `${level.toUpperCase()}: ${formattedMessage}`;
    
    // Detailed format for file logging (keep full info for files)
    const timestamp = new Date().toISOString();
    const processInfo = `[PID:${process.pid}]`;
    const memUsage = `[MEM:${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB]`;
    const detailedFormat = `${timestamp} [${level}] ${processInfo} ${memUsage} ${formattedMessage}`;

    // Console format with colors
    const consoleFormat = this.config.enableColors
      ? `${this.colors[level]}${simpleFormat}${this.colors.RESET}`
      : simpleFormat;

    return { console: consoleFormat, file: detailedFormat };
  }

  writeToFile(level, message) {
    if (!this.config.enableFileLogging) return;

    try {
      const logFile = path.join(this.config.logDir, `aurora-${level.toLowerCase()}.log`);
      const logEntry = `${message}\n`;

      // Check file size and rotate if needed
      if (fs.existsSync(logFile)) {
        const stats = fs.statSync(logFile);
        if (stats.size > this.config.maxFileSize) {
          this.rotateLogFile(logFile);
        }
      }

      fs.appendFileSync(logFile, logEntry);
    } catch (error) {
      console.error('Failed to write to log file:', error.message);
    }
  }

  rotateLogFile(logFile) {
    try {
      const ext = path.extname(logFile);
      const basename = path.basename(logFile, ext);
      const dirname = path.dirname(logFile);

      // Rotate existing files
      for (let i = this.config.maxFiles - 1; i > 0; i--) {
        const oldFile = path.join(dirname, `${basename}.${i}${ext}`);
        const newFile = path.join(dirname, `${basename}.${i + 1}${ext}`);
        
        if (fs.existsSync(oldFile)) {
          if (i === this.config.maxFiles - 1) {
            fs.unlinkSync(oldFile);
          } else {
            fs.renameSync(oldFile, newFile);
          }
        }
      }

      // Move current log to .1
      const rotatedFile = path.join(dirname, `${basename}.1${ext}`);
      fs.renameSync(logFile, rotatedFile);
    } catch (error) {
      console.error('Failed to rotate log file:', error.message);
    }
  }

  log(level, message, meta = {}) {
    if (this.levels[level] > this.currentLogLevel) return;

    // Update metrics
    this.metrics.totalLogs++;
    this.metrics.logsByLevel[level]++;

    const formatted = this.formatMessage(level, message, meta);

    // Output to console
    console.log(formatted.console);

    // Write to file if enabled
    this.writeToFile(level, formatted.file);
  }

  // Convenience methods
  error(message, meta = {}) {
    this.log('ERROR', message, meta);
  }

  warn(message, meta = {}) {
    this.log('WARN', message, meta);
  }

  info(message, meta = {}) {
    this.log('INFO', message, meta);
  }

  debug(message, meta = {}) {
    this.log('DEBUG', message, meta);
  }

  trace(message, meta = {}) {
    this.log('TRACE', message, meta);
  }

  // System event logging
  system(event, details = {}) {
    this.log('SYSTEM', event, details);
  }

  // Database operation logging
  database(operation, details = {}) {
    this.log('DATABASE', operation, details);
  }

  // WhatsApp event logging
  whatsapp(event, details = {}) {
    this.log('WHATSAPP', event, details);
  }

  // Plugin event logging
  plugin(event, details = {}) {
    this.log('PLUGIN', event, details);
  }

  // Performance logging
  performance(operation, duration, details = {}) {
    this.log('PERFORMANCE', `${operation} completed in ${duration}ms`, details);
  }

  // Security event logging
  security(event, details = {}) {
    this.warn(`SECURITY: ${event}`, details);
  }

  // Get performance metrics
  getMetrics() {
    const uptime = Date.now() - this.metrics.startTime;
    return {
      ...this.metrics,
      uptime: uptime,
      logsPerSecond: (this.metrics.totalLogs / (uptime / 1000)).toFixed(2)
    };
  }

  // Startup banner
  banner() {
    const banner = `
╔═══════════════════════════════════════════════════════════════╗
║                     AURORA-MD v2.0.0                         ║
║                   Production WhatsApp Bot                     ║
║                   Created by AlienAlfa                        ║
║                                                               ║
║  Status: Initializing...                                      ║
║  Logging: ${this.config.level} level                                     ║
║  File Logs: ${this.config.enableFileLogging ? 'Enabled' : 'Disabled'}                                  ║
║  Environment: ${process.env.NODE_ENV || 'development'}                               ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝`;
    
    console.log(banner);
  }

  // Graceful shutdown logging
  shutdown() {
    const metrics = this.getMetrics();
    this.info('System shutdown initiated', metrics);
    
    if (this.config.enableFileLogging) {
      this.info('Log files saved to: ' + this.config.logDir);
    }
  }
}

// Create singleton instance
const logger = new Logger();

// Export both the class and singleton
module.exports = {
  Logger,
  logger,
  // Convenience exports for backward compatibility
  info: (msg, meta) => logger.info(msg, meta),
  error: (msg, meta) => logger.error(msg, meta),
  warn: (msg, meta) => logger.warn(msg, meta),
  debug: (msg, meta) => logger.debug(msg, meta),
  trace: (msg, meta) => logger.trace(msg, meta),
  system: (event, details) => logger.system(event, details),
  database: (operation, details) => logger.database(operation, details),
  whatsapp: (event, details) => logger.whatsapp(event, details),
  plugin: (event, details) => logger.plugin(event, details),
  performance: (operation, duration, details) => logger.performance(operation, duration, details),
  security: (event, details) => logger.security(event, details)
};
