/**
 * Aurora-MD Dashboard Configuration Schema
 * ---------------------------------------
 * Single source of truth for configuration keys that the localhost dashboard
 * may read/edit. Shared by:
 *   - config.js      (loads persisted overrides at boot)
 *   - server.js      (validates API input, persists to disk)
 *   - index.js       (live-applies overrides to the running config object)
 *
 * Overrides are stored in session/config-overrides.json and take priority
 * over environment variables (dashboard > env > defaults).
 */

const fs = require('fs');
const path = require('path');

const OVERRIDES_FILE = path.join(
  global.__basedir || process.cwd(),
  'session',
  'config-overrides.json'
);

const schema = {
  LOGS:             { type: 'boolean', label: 'Incoming message logging' },
  SIMPLE_LOGS:      { type: 'boolean', label: 'Simple log style (X-Asena)' },
  AUTO_READ:        { type: 'boolean', label: 'Auto read messages' },
  AUTO_STATUS_READ: { type: 'boolean', label: 'Auto read status updates' },
  ANTI_LINK:        { type: 'boolean', label: 'Anti-link protection' },
  ANTILINK_ACTION:  { type: 'enum', values: ['kick', 'remove', 'warn', 'mute'], label: 'Anti-link action' },
  DELETED_LOG:      { type: 'boolean', label: 'Log deleted messages' },
  WORK_TYPE:        { type: 'enum', values: ['private', 'public', 'groups'], label: 'Work type' },
  HANDLERS:         { type: 'handler', label: 'Command prefix' },
  LANG:             { type: 'string', maxLength: 10, label: 'Language' },
  BOT_NAME:         { type: 'string', maxLength: 60, label: 'Bot name' },
  OWNER_NAME:       { type: 'string', maxLength: 60, label: 'Owner name' },
  PACKNAME:         { type: 'string', maxLength: 60, label: 'Sticker pack name' },
  AUTHOR:           { type: 'string', maxLength: 60, label: 'Sticker author' },
  WELCOME_MSG:      { type: 'string', maxLength: 300, label: 'Welcome message' },
  GOODBYE_MSG:      { type: 'string', maxLength: 300, label: 'Goodbye message' },
  SUDO:             { type: 'string', maxLength: 300, label: 'Sudo numbers (comma separated)' },
  WARN_COUNT:       { type: 'integer', min: 1, max: 20, label: 'Warn limit' },
  DELETED_LOG_CHAT: { type: 'string', maxLength: 100, label: 'Deleted-log chat id' }
};

const editableKeys = Object.keys(schema);

function coerce(key, raw) {
  const def = schema[key];
  const name = def.label || key;

  switch (def.type) {
    case 'boolean': {
      if (typeof raw === 'boolean') return { ok: true, value: raw };
      if (raw === 'true' || raw === '1' || raw === 1) return { ok: true, value: true };
      if (raw === 'false' || raw === '0' || raw === 0) return { ok: true, value: false };
      return { ok: false, error: `${name} must be true/false` };
    }
    case 'enum': {
      const v = String(raw);
      if (def.values.includes(v)) return { ok: true, value: v };
      return { ok: false, error: `${name} must be one of: ${def.values.join(', ')}` };
    }
    case 'integer': {
      const n = parseInt(raw, 10);
      if (Number.isNaN(n)) return { ok: false, error: `${name} must be a number` };
      if (def.min !== undefined && n < def.min) return { ok: false, error: `${name} must be >= ${def.min}` };
      if (def.max !== undefined && n > def.max) return { ok: false, error: `${name} must be <= ${def.max}` };
      return { ok: true, value: n };
    }
    case 'handler': {
      // Used directly inside RegExp: `(${HANDLERS})` - keep it safe
      const v = String(raw);
      if (!v || v.length > 5) return { ok: false, error: 'Prefix must be 1-5 characters' };
      if (/[()\\|?*+{}[\]]/.test(v)) return { ok: false, error: 'Prefix contains invalid regex characters' };
      return { ok: true, value: v };
    }
    default: {
      const v = String(raw);
      const max = def.maxLength || 256;
      if (v.length > max) return { ok: false, error: `${name} must be <= ${max} characters` };
      return { ok: true, value: v };
    }
  }
}

/**
 * Validate + coerce an overrides object against the schema.
 * @returns {{ok: Boolean, values?: Object, error?: String}}
 */
function sanitizeOverrides(overrides) {
  if (!overrides || typeof overrides !== 'object') {
    return { ok: false, error: 'Overrides must be an object' };
  }
  const values = {};
  for (const [key, raw] of Object.entries(overrides)) {
    if (!(key in schema)) continue; // silently ignore unknown keys
    const res = coerce(key, raw);
    if (!res.ok) return { ok: false, error: res.error };
    values[key] = res.value;
  }
  return { ok: true, values };
}

/** Read persisted overrides from disk (returns {} when none/invalid). */
function loadOverrides() {
  try {
    if (!fs.existsSync(OVERRIDES_FILE)) return {};
    const raw = JSON.parse(fs.readFileSync(OVERRIDES_FILE, 'utf8'));
    const res = sanitizeOverrides(raw);
    return res.ok ? res.values : {};
  } catch {
    return {};
  }
}

/** Persist overrides to disk. */
function saveOverrides(overrides) {
  const res = sanitizeOverrides(overrides);
  if (!res.ok) return res;
  try {
    const dir = path.dirname(OVERRIDES_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(OVERRIDES_FILE, JSON.stringify(res.values, null, 2), 'utf8');
    return { ok: true, values: res.values };
  } catch (error) {
    return { ok: false, error: error.message };
  }
}

/**
 * Apply validated overrides onto a live config object (in place).
 * All modules share the same config object, so changes take effect
 * immediately without a restart.
 */
function applyOverrides(config, overrides) {
  const res = sanitizeOverrides(overrides);
  if (!res.ok) return res;
  Object.assign(config, res.values);
  return res;
}

module.exports = {
  schema,
  editableKeys,
  sanitizeOverrides,
  loadOverrides,
  saveOverrides,
  applyOverrides,
  OVERRIDES_FILE
};
