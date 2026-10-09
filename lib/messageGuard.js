/**
 * Aurora-MD Message Guard
 * -----------------------
 * Prevents message re-processing (issues #1 and #2):
 *
 *   - In-memory LRU of message ids seen during this process run.
 *   - A small persistent command log (session/processed-commands.log) written
 *     SYNCHRONOUSLY right before a command executes, so even a hard kill
 *     (restart/reboot commands kill the worker immediately) can never cause
 *     the same command to run twice after the bot comes back online.
 *
 * Normal (non-command) messages are persisted through StoreDb.saveMessage
 * with { immediate: true }, which handles their cross-restart dedup.
 */

const fs = require('fs');
const path = require('path');

const MAX_MEMORY_IDS = 5000;
const MAX_COMMAND_IDS = 5000;
const COMMAND_TTL_MS = 7 * 24 * 60 * 60 * 1000; // keep 7 days

const recent = new Map(); // id -> seenAt (ms)
let commandIds = new Set();
let commandFilePath = null;
let loaded = false;

const stats = {
  dupMemory: 0,   // caught by in-memory LRU this run
  dupCommand: 0,  // caught by persistent command log
  dupDb: 0,       // caught by database lookup
  stale: 0        // dropped as too old (age cutoff)
};

function resolvePath() {
  const base = global.__basedir || process.cwd();
  return path.join(base, 'session', 'processed-commands.log');
}

function load() {
  if (loaded) return;
  loaded = true;
  commandFilePath = resolvePath();
  try {
    if (!fs.existsSync(commandFilePath)) return;
    const raw = fs.readFileSync(commandFilePath, 'utf8');
    const now = Date.now();
    const lines = raw.split('\n').filter(Boolean).slice(-MAX_COMMAND_IDS);
    for (const line of lines) {
      const [id, ts] = line.split('|');
      if (!id) continue;
      const t = parseInt(ts, 10) || 0;
      if (now - t <= COMMAND_TTL_MS) commandIds.add(id);
    }
    // Rewrite (prune) if the file grew beyond the cap
    if (raw.split('\n').filter(Boolean).length > MAX_COMMAND_IDS + 500) {
      fs.writeFileSync(commandFilePath, serialize(), 'utf8');
    }
  } catch {
    // Corrupt log is not fatal - dedup falls back to memory + DB
  }
}

function serialize() {
  const now = Date.now();
  return [...commandIds]
    .map(id => `${id}|${now}`)
    .join('\n') + '\n';
}

/** Has this id been seen during THIS run? (fast LRU check) */
function seen(id) {
  return recent.has(id);
}

/** Remember an id for this run (LRU, pruned to MAX_MEMORY_IDS). */
function mark(id) {
  if (!id) return;
  recent.set(id, Date.now());
  if (recent.size > MAX_MEMORY_IDS) {
    const overflow = recent.size - MAX_MEMORY_IDS;
    let i = 0;
    for (const key of recent.keys()) {
      if (i++ >= overflow) break;
      recent.delete(key);
    }
  }
}

/**
 * Persistently remember a COMMAND id BEFORE it executes.
 * Synchronous on purpose: restart/reboot kills this process immediately
 * after the command runs, so an async write could be lost.
 */
function markCommand(id) {
  if (!id) return;
  load();
  if (commandIds.has(id)) return;
  commandIds.add(id);
  try {
    fs.appendFileSync(commandFilePath, `${id}|${Date.now()}\n`, 'utf8');
  } catch (err) {
    // Fallback: rewrite whole file once
    try {
      fs.writeFileSync(commandFilePath, serialize(), 'utf8');
    } catch { /* best effort - memory dedup still active */ }
  }
}

/** True if this id was recorded as an executed command in a previous run. */
function isKnownCommand(id) {
  load();
  return commandIds.has(id);
}

function getStats() {
  load();
  return {
    ...stats,
    memoryIds: recent.size,
    commandIds: commandIds.size
  };
}

module.exports = { seen, mark, markCommand, isKnownCommand, getStats, stats };
