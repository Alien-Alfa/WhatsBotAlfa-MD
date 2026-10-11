// Made with ❤ by AlienAlfa
// lib/lidMap.js
// ---------------
// WhatsApp LID <-> phone-number resolution.
//
// WhatsApp's "LID migration" identifies users by an @lid JID instead of the
// classic @s.whatsapp.net phone number. Incoming stanzas carry BOTH forms when
// WhatsApp can supply them:
//     key.participant      = 117455560623373@lid     (LID identity)
//     key.participantPn    = 919377700679@s.whatsapp.net (phone number)
//
// Older code (sudo checks, admin checks, plugin logic) compares against phone
// numbers stored in config.SUDO / group metadata, so a LID sender used to fail
// every match. This module keeps a small persistent LID->PN cache (built from
// every stanza/graph that exposes both) so plugins/libs can normalise a LID
// back to its phone number, and offers tiny helpers for LID-safe comparisons.

const fs = require("fs");
const path = require("path");

const filePath = () =>
  path.join(global.__basedir || process.cwd(), "session", "lid-map.json");

let map = null; // Map<lidNumber, pnNumber>

function load() {
  if (map) return map;
  map = new Map();
  try {
    if (fs.existsSync(filePath())) {
      const data = JSON.parse(fs.readFileSync(filePath(), "utf8"));
      if (data && typeof data === "object") {
        for (const [k, v] of Object.entries(data)) map.set(k, v);
      }
    }
  } catch {
    // Corrupt map is not fatal - it simply rebuilds from live traffic.
  }
  return map;
}

let flushTimer = null;
function flush() {
  if (flushTimer) return;
  flushTimer = setTimeout(() => {
    flushTimer = null;
    try {
      fs.writeFileSync(filePath(), JSON.stringify(Object.fromEntries(map)), "utf8");
    } catch {
      /* best effort - in-memory map stays authoritative this run */
    }
  }, 1000);
}

/** True when a JID is an @lid identity. */
function isLidJid(jid) {
  return typeof jid === "string" && jid.endsWith("@lid");
}

/** Bare numeric part of any JID (strips @server and :device). */
function numberPart(jid) {
  if (typeof jid !== "string") return null;
  return jid.split("@")[0].split(":")[0] || null;
}

/**
 * Record a LID -> PN mapping. Ignores invalid/identical pairs.
 * Safe to call with (lidJid, pnJid) in any order-independent fashion.
 */
function record(lidJid, pnJid) {
  if (!isLidJid(lidJid) || typeof pnJid !== "string") return;
  if (pnJid.endsWith("@lid")) return;
  const lid = numberPart(lidJid);
  const pn = numberPart(pnJid);
  if (!lid || !pn || lid === pn) return;
  const m = load();
  if (m.get(lid) !== pn) {
    m.set(lid, pn);
    flush();
  }
}

/** Resolve a LID JID (or LID number) to its known phone number, or null. */
function lidToPn(lidJid) {
  const lid = numberPart(lidJid);
  if (!lid) return null;
  return load().get(lid) || null;
}

/** Current cache size (for diagnostics). */
function getStats() {
  return { entries: load().size };
}

module.exports = { isLidJid, numberPart, record, lidToPn, getStats };
