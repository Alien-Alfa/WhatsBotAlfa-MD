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
  BOT_NAME: { type: 'string', section: 'Identity', label: 'Bot name', maxLength: 60 },
  OWNER_NAME: { type: 'string', section: 'Identity', label: 'Owner name', maxLength: 60 },
  WORK_TYPE: { type: 'enum', section: 'Identity', label: 'Work type', values: ['private', 'public', 'groups'], restartRequired: true },
  HANDLERS: { type: 'handler', section: 'Identity', label: 'Command prefix', description: 'The default accepts no prefix, ^, or .', maxLength: 5 },
  SUDO: { type: 'string', section: 'Identity', label: 'Owner numbers', description: 'Comma-separated phone numbers or LID numbers, digits only.', maxLength: 500 },

  LOGS: { type: 'boolean', section: 'Messages', label: 'Incoming message logs' },
  SIMPLE_LOGS: { type: 'boolean', section: 'Messages', label: 'Compact message format' },
  LOG_MESSAGE: { type: 'boolean', section: 'Messages', label: 'Full message diagnostics', description: 'Includes serialized message details in worker output.' },
  AUTO_READ: { type: 'boolean', section: 'Messages', label: 'Mark incoming messages read' },
  AUTO_STATUS_READ: { type: 'boolean', section: 'Messages', label: 'Mark status updates read' },
  STALE_MESSAGE_GRACE: { type: 'integer', section: 'Messages', label: 'Live message age limit (ms)', min: 1000, max: 86400000, restartRequired: true },
  LANG: { type: 'string', section: 'Messages', label: 'Language', maxLength: 20, restartRequired: true },
  ALLOW_ALL_CALLS: { type: 'boolean', section: 'Calls', label: 'Allow all calls', description: 'Disables automatic call rejection globally.' },

  ANTILINK: { type: 'boolean', section: 'Groups', label: 'Anti-link protection' },
  ANTILINK_ACTION: { type: 'enum', section: 'Groups', label: 'Anti-link response', values: ['kick', 'remove', 'warn', 'mute'] },
  WARN_COUNT: { type: 'integer', section: 'Groups', label: 'Warnings before action', min: 1, max: 20 },
  WELCOME_MSG: { type: 'textarea', section: 'Groups', label: 'Welcome message', description: 'Template supports @user and @gname.', maxLength: 500 },
  GOODBYE_MSG: { type: 'textarea', section: 'Groups', label: 'Goodbye message', maxLength: 500 },

  DELETED_LOG: { type: 'boolean', section: 'Moderation', label: 'Forward deleted messages' },
  DELETED_LOG_CHAT: { type: 'string', section: 'Moderation', label: 'Deleted-message log chat', maxLength: 120 },

  PACKNAME: { type: 'string', section: 'Stickers', label: 'Sticker pack name', maxLength: 60 },
  AUTHOR: { type: 'string', section: 'Stickers', label: 'Sticker author', maxLength: 60 },
  RMBG_KEY: { type: 'secret', section: 'Integrations', label: 'Remove.bg API key', maxLength: 500 },
  REMOVEBG: { type: 'secret', section: 'Integrations', label: 'Remove.bg runtime alias', editable: false, aliasFor: 'RMBG_KEY' },
  GEMINI_API: { type: 'secret', section: 'Integrations', label: 'Gemini API key', maxLength: 500 },
  HEROKU: { type: 'boolean', section: 'Integrations', label: 'Heroku deployment mode', restartRequired: true },
  HEROKU_APP_NAME: { type: 'string', section: 'Integrations', label: 'Heroku app name', maxLength: 100, restartRequired: true },
  HEROKU_API_KEY: { type: 'secret', section: 'Integrations', label: 'Heroku API key', maxLength: 500, restartRequired: true },
  HEROKU_GIT_URL: { type: 'string', section: 'Integrations', label: 'External plugin URL', maxLength: 500, restartRequired: true },
  BRANCH: { type: 'string', section: 'Integrations', label: 'Update branch', maxLength: 100, restartRequired: true },

  SESSION_ID: { type: 'secret', section: 'Session & security', label: 'Session credential', maxLength: 10000, restartRequired: true },
  SESSION_URL: { type: 'secret', section: 'Session & security', label: 'Session URL', maxLength: 1000, restartRequired: true },
  AUTH_TOKEN: { type: 'secret', section: 'Session & security', label: 'Authentication token', maxLength: 1000, restartRequired: true },

  USE_MONGODB: { type: 'boolean', section: 'Storage', label: 'Use MongoDB', restartRequired: true },
  MONGODB_URI: { type: 'secret', section: 'Storage', label: 'MongoDB URI', maxLength: 1000, restartRequired: true },
  DATABASE_URL: { type: 'secret', section: 'Storage', label: 'SQL database URL', maxLength: 1000, restartRequired: true },
  DATABASE: { type: 'runtime', section: 'Storage', label: 'Active database adapter', description: 'Read-only; database changes require a worker restart.', editable: false },
};

const displayKeys = Object.keys(schema);
const editableKeys = displayKeys.filter(key => schema[key].editable !== false);

function coerce(key, raw) {
  const def = schema[key];
  const name = def.label || key;

  switch (def.type) {
    case 'secret': {
      const value = String(raw ?? '').trim();
      if (!value) return { ok: true, skip: true };
      if (value.length > (def.maxLength || 1000)) return { ok: false, error: `${name} is too long` };
      return { ok: true, value };
    }
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
      const rawValue = String(raw).trim();
      const v = ['false', 'null'].includes(rawValue.toLowerCase()) ? '^' : rawValue;
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
  for (const [inputKey, raw] of Object.entries(overrides)) {
    const key = inputKey === 'ANTI_LINK' ? 'ANTILINK' : inputKey;
    if (!(key in schema) || schema[key].editable === false) continue;
    const res = coerce(key, raw);
    if (!res.ok) return { ok: false, error: res.error };
    if (!res.skip) values[key] = res.value;
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
    const values = { ...loadOverrides(), ...res.values };
    const dir = path.dirname(OVERRIDES_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(OVERRIDES_FILE, JSON.stringify(values, null, 2), 'utf8');
    return { ok: true, values };
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
  displayKeys,
  editableKeys,
  sanitizeOverrides,
  loadOverrides,
  saveOverrides,
  applyOverrides,
  OVERRIDES_FILE
};
