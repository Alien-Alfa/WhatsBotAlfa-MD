/**
 * Aurora-MD Console Guard
 * -----------------------
 * libsignal / Baileys print raw session dumps, prekey-bundle chatter and
 * "Session error: Error: Bad MAC" stacks directly through console.{log,info,warn,error},
 * bypassing our logger. This module wraps the console methods so that:
 *
 *   1. Noisy credential/session dumps are swallowed entirely (they were the
 *      "perkey bundle things" cluttering the terminal).
 *   2. Repeating signal/decrypt failures are AGGREGATED and THROTTLED into a
 *      single clean logger warning every N seconds - errors stay spot-able
 *      (with a running counter) without multiplying on every restart.
 *   3. Everything else passes through untouched.
 *
 * Must be installed as early as possible (first line of index.js).
 */

const logger = require('./logger');
const util = require('util');

// Raw credential/session dumps - never useful in a terminal
const SUPPRESS = [
  /Closing session:/,
  /Removing old closed session/,
  /SessionEntry/,
  /_chains:/,
  /registrationId:/,
  /currentRatchet:/,
  /lastRemoteEphemeralKey:/,
  /previousCounter:/,
  /rootKey:/,
  /indexInfo:/,
  /baseKey:/,
  /baseKeyType:/,
  /remoteIdentityKey:/,
  /pendingPreKey:/,
  /pubKey:/,
  /privKey:/,
  /<Buffer /,
  /Buffer\(/,
  /chainKey: \[Object\]/,
  /chainType:/,
  /messageKeys: \{\}/,
  /ephemeralKeyPair:/,
  // Baileys verbose session bookkeeping
  /Skipping restore key /,
  /loaded all app state keys/,
  /applyStateSyncXid/,
];

// Repeating signal problems -> aggregate into ONE throttled warning
const NOISY = [
  { re: /Session error:.*Bad MAC/i, label: 'Bad MAC (signal session mismatch)' },
  { re: /Failed to decrypt message with any known session/i, label: 'decrypt failed (no matching session)' },
  { re: /Closing open session in favor of incoming prekey bundle/i, label: 'prekey bundle session refresh' },
  { re: /No matching sessions found for message/i, label: 'no matching signal sessions' },
  { re: /Session error:/i, label: 'signal session error' },
];

const state = {
  installed: false,
  suppressed: 0,
  counts: {},        // label -> total occurrences
  lastFlush: 0,
  pending: {},       // label -> occurrences since last flush
  THROTTLE_MS: 30000 // one aggregated warning per label per 30s
};

function flushPending() {
  const labels = Object.keys(state.pending);
  if (!labels.length) return;
  for (const label of labels) {
    const n = state.pending[label];
    delete state.pending[label];
    logger.warn(`SIGNAL: ${n}× ${label}`, {
      total: state.counts[label],
      note: 'aggregated/throttled by console guard'
    });
  }
  state.lastFlush = Date.now();
}

function handleNoisy(text) {
  for (const { re, label } of NOISY) {
    if (re.test(text)) {
      state.counts[label] = (state.counts[label] || 0) + 1;
      state.pending[label] = (state.pending[label] || 0) + 1;
      if (Date.now() - state.lastFlush >= state.THROTTLE_MS) flushPending();
      return true;
    }
  }
  return false;
}

function textOf(args) {
  try {
    return args.map(a => {
      if (a instanceof Error) return `${a.message} ${a.stack || ''}`;
      if (typeof a === 'string') return a;
      if (a && typeof a === 'object') {
        // util.inspect preserves class names ("SessionEntry") and prints
        // "<Buffer ..>" for Buffers - JSON.stringify drops BOTH, which is how
        // libsignal's raw session dumps slipped past the filter (issue #3).
        try {
          return `${a.constructor && a.constructor.name !== 'Object' ? a.constructor.name + ' ' : ''}${util.inspect(a, { depth: 4, breakLength: 120 })}`;
        } catch { return ''; }
      }
      return '';
    }).join(' ');
  } catch {
    return '';
  }
}

// Shared entry point for non-console sources (Baileys pino logger):
// returns true when the record was swallowed or aggregated (do not print).
// Safe to call before install() - works standalone.
function swallowOrAggregate(...args) {
  const text = textOf(args);
  if (!text) return false;
  for (const re of SUPPRESS) {
    if (re.test(text)) {
      state.suppressed++;
      return true;
    }
  }
  if (handleNoisy(text)) return true;
  return false;
}

function install() {
  if (state.installed) return;
  state.installed = true;

  const wrap = (original, method) =>
    function (...args) {
      if (swallowOrAggregate(...args)) return;
      return original.apply(this, args);
    };

  console.log = wrap(console.log, 'log');
  console.info = wrap(console.info, 'info');
  console.warn = wrap(console.warn, 'warn');
  console.error = wrap(console.error, 'error');

  // Periodically surface a flush even if throttle window passed silently
  setInterval(() => {
    try { flushPending(); } catch { /* ignore */ }
  }, state.THROTTLE_MS).unref();

  logger.debug('Console guard installed (libsignal noise filtered, signal failures aggregated)');
}

function getStats() {
  return {
    installed: state.installed,
    suppressed: state.suppressed,
    pending: { ...state.pending },
    counts: { ...state.counts }
  };
}

module.exports = { install, getStats, flushPending, swallowOrAggregate };
