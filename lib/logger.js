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

    // Fixed-width badge labels keep every console line perfectly aligned
    this.badges = {
      ERROR: 'ERROR',
      WARN: 'WARN',
      INFO: 'INFO',
      SYSTEM: 'SYSTEM',
      WHATSAPP: 'WHATSAPP',
      PERFORMANCE: 'PERF',
      DATABASE: 'DATABASE',
      PLUGIN: 'PLUGIN',
      DEBUG: 'DEBUG',
      TRACE: 'TRACE'
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
      DIM: '\x1b[2m',        // Dim (timestamps, stacks)
      BOLD: '\x1b[1m',
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

    // In-memory ring buffers for the web dashboard
    this.recentBuffer = [];   // last N entries of any level
    this.errorBuffer = [];    // last N ERROR/WARN entries
    this.maxRecent = 500;
    this.maxErrors = 300;

    // Optional hook: called with every logged entry (used to forward
    // ERROR/WARN entries to server.js over IPC for the dashboard)
    this.onEntry = null;
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

  /**
   * Pretty-format a value for console output.
   * Errors get name + message (+ stack for ERROR level), objects get compact JSON.
   */
  formatValue(value, { withStack = false } = {}) {
    if (value === null) return 'null';
    if (value === undefined) return 'undefined';

    if (value instanceof Error) {
      let out = `${value.name || 'Error'}: ${value.message}`;
      if (withStack && value.stack) {
        const lines = value.stack.split('\n').slice(1, 7);
        out += '\n' + lines.join('\n');
        const total = value.stack.split('\n').length - 1;
        if (total > 6) out += `\n  … ${total - 6} more stack frames (see file logs)`;
      }
      return out;
    }

    if (typeof value === 'string') {
      return value.length > 2000 ? value.slice(0, 2000) + ' …' : value;
    }

    if (typeof value === 'object') {
      try {
        const seen = new WeakSet();
        const json = JSON.stringify(value, (k, v) => {
          if (typeof v === 'bigint') return v.toString();
          if (typeof v === 'object' && v !== null) {
            if (seen.has(v)) return '[Circular]';
            seen.add(v);
          }
          if (v instanceof Error) return { name: v.name, message: v.message };
          return v;
        }, 0);
        return json && json.length > 1500 ? json.slice(0, 1500) + ' …' : json;
      } catch {
        return util.inspect(value, { depth: 2, colors: false });
      }
    }

    return String(value);
  }

  formatMessage(level, message, meta = {}) {
    // Normalize the main body
    let body = (typeof message === 'object' && !(message instanceof Error))
      ? this.formatValue(message)
      : String(message);

    // Collect metadata as ordered [key, value] pairs (Error objects kept intact)
    const metaPairs = [];
    if (meta instanceof Error) {
      metaPairs.push(['error', meta]);
    } else if (typeof meta === 'string' && meta.length > 0) {
      body += ` — ${meta}`;
    } else if (meta && typeof meta === 'object' && Object.keys(meta).length > 0) {
      for (const [key, value] of Object.entries(meta)) metaPairs.push([key, value]);
    } else if (typeof meta === 'number' || typeof meta === 'boolean') {
      body += ` — ${String(meta)}`;
    }

    const badge = this.badges[level] || level;
    const isError = level === 'ERROR';
    const c = this.colors;
    const time = new Date().toTimeString().slice(0, 8);
    const pad = ' '.repeat(9); // continuation lines align under the message

    // Metadata continuation lines:  └─ key: value
    const metaLines = metaPairs.map(([key, value], i) => {
      const branch = i === metaPairs.length - 1 ? '└─' : '├─';
      const rendered = this.formatValue(value, { withStack: isError });
      const indented = rendered.replace(/\n/g, `\n${' '.repeat(pad.length + 5)}`);
      return `${pad}${branch} ${key}: ${indented}`;
    });

    const bodyLines = body.split('\n');
    const firstLine = bodyLines[0];
    const extraLines = bodyLines.slice(1).map(l => `${pad}   ${l}`);

    // ---- Console format ----
    // [HH:MM:SS] BADGE    │ message
    //                      └─ key: value
    let consoleFormat;
    if (this.config.enableColors) {
      const head = `${c.DIM}[${time}]${c.RESET} ${c[level] || c.INFO}${c.BOLD}${badge.padEnd(9)}${c.RESET} ${c.DIM}│${c.RESET} ${firstLine}`;
      const tail = [...extraLines, ...metaLines]
        .map(l => `${c.DIM}${l}${c.RESET}`)
        .join('\n');
      consoleFormat = tail ? `${head}\n${tail}` : head;
    } else {
      const head = `[${time}] ${badge.padEnd(9)} │ ${firstLine}`;
      const tail = [...extraLines, ...metaLines].join('\n');
      consoleFormat = tail ? `${head}\n${tail}` : head;
    }

    // ---- File format (full detail, kept grep-able) ----
    const timestamp = new Date().toISOString();
    const processInfo = `[PID:${process.pid}]`;
    const memUsage = `[MEM:${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB]`;
    const metaText = metaPairs
      .map(([key, value]) => `${key}=${this.formatValue(value, { withStack: true })}`)
      .join(' ');
    const detailedFormat = `${timestamp} [${level}] ${processInfo} ${memUsage} ${body}${metaText ? ` | ${metaText.replace(/\n/g, ' ')}` : ''}`;

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
    this.metrics.logsByLevel[level] = (this.metrics.logsByLevel[level] || 0) + 1;

    const formatted = this.formatMessage(level, message, meta);

    // Output to console
    console.log(formatted.console);

    // Write to file if enabled
    this.writeToFile(level, formatted.file);

    // Ring buffers + hook for the dashboard (plain, IPC-safe entry)
    try {
      const entry = {
        ts: Date.now(),
        iso: new Date().toISOString(),
        level,
        message: typeof message === 'string' ? message : this.formatValue(message),
        meta: this.#toPlainMeta(meta)
      };
      this.recentBuffer.push(entry);
      if (this.recentBuffer.length > this.maxRecent) this.recentBuffer.shift();
      if (level === 'ERROR' || level === 'WARN') {
        this.errorBuffer.push(entry);
        if (this.errorBuffer.length > this.maxErrors) this.errorBuffer.shift();
      }
      if (typeof this.onEntry === 'function') this.onEntry(entry);
    } catch { /* never let telemetry break logging */ }
  }

  // Serialize meta into an IPC-safe plain object
  #toPlainMeta(meta) {
    if (!meta) return undefined;
    if (meta instanceof Error) return { error: `${meta.name}: ${meta.message}` };
    if (typeof meta !== 'object') return { value: String(meta) };
    const out = {};
    for (const [key, value] of Object.entries(meta)) {
      if (value instanceof Error) out[key] = `${value.name}: ${value.message}`;
      else if (typeof value === 'bigint') out[key] = value.toString();
      else if (typeof value === 'object' && value !== null) {
        try { out[key] = JSON.parse(JSON.stringify(value, (k, v) => v instanceof Error ? String(v) : v)); }
        catch { out[key] = String(value); }
      }
      else out[key] = value;
    }
    return out;
  }

  // Dashboard accessors
  getRecent(limit = 200, levelFilter = null) {
    const list = levelFilter
      ? this.recentBuffer.filter(e => e.level === levelFilter)
      : this.recentBuffer;
    return list.slice(-limit);
  }

  getErrors(limit = 100) {
    return this.errorBuffer.slice(-limit);
  }

  getErrorCount() {
    return this.metrics.logsByLevel.ERROR || 0;
  }

  clearErrors() {
    this.errorBuffer.length = 0;
    this.metrics.logsByLevel.ERROR = 0;
    this.metrics.logsByLevel.WARN = 0;
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
    const lines = [
      '                     AURORA-MD v2.0.0',
      '                   Production WhatsApp Bot',
      '                   Created by AlienAlfa',
      '',
      `  Status:      Initializing...`,
      `  Logging:     ${this.config.level} level`,
      `  File Logs:   ${this.config.enableFileLogging ? 'Enabled' : 'Disabled'}`,
      `  Environment: ${process.env.NODE_ENV || 'development'}`,
    ];
    const innerWidth = 63;
    const border = '═'.repeat(innerWidth);
    const out = [
      '',
      `╔${border}╗`,
      ...lines.map(l => {
        // strip ANSI-free length check using raw visible text
        const visible = l.replace(/\x1b\[[0-9;]*m/g, '');
        const pad = ' '.repeat(Math.max(0, innerWidth - visible.length));
        return `║${l}${pad}║`;
      }),
      `╚${border}╝`,
      ''
    ].join('\n');
    console.log(out);
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
