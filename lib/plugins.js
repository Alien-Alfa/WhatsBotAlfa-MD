const config = require("../config");
const logger = require("./logger");
const commands = [];

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

function buildCommandPattern(pattern) {
  const prefix = String(config.HANDLERS || "^");
  const prefixPattern = prefix === "^" ? "(?:\\^|\\.)?" : escapeRegExp(prefix);
  return new RegExp(`^(${prefixPattern})( ?${pattern}(?=\\b|$))(.*)`, "is");
}

function refreshCommandPatterns() {
  for (const item of commands) {
    if (item.patternSource) item.pattern = buildCommandPattern(item.patternSource);
  }
}

/**
 * Define a command and store it in the commands array.
 * @param {Object} commandInfo - Information about the command.
 * @param {Function} func - The function to execute when the command is triggered.
 * @returns {Object} - The command information.
 */
function command(commandInfo, func) {
  commandInfo.function = func;
  if (commandInfo.pattern) {
    commandInfo.patternSource = commandInfo.pattern;
    commandInfo.pattern = buildCommandPattern(commandInfo.patternSource);
  } else {
    // NORMALIZE: plugins declare `pattern: false` (or "", null) for on:"text"
    // listeners that just watch chat (TicTacToe.js, fun.js). `false` is
    // falsy so it never got converted to a RegExp, leaking a boolean into
    // code that later calls command.pattern.test() - which THREW
    // "command.pattern?.test is not a function" on every message.
    // From here on command.pattern is ALWAYS RegExp | undefined.
    commandInfo.pattern = undefined;
  }
  commandInfo.dontAddCommandList = commandInfo.dontAddCommandList || false;
  commandInfo.fromMe = commandInfo.fromMe || false;
  commandInfo.type = commandInfo.type || "misc";

  commands.push(commandInfo);
  return commandInfo;
}

module.exports = {
  command,
  commands,
  buildCommandPattern,
  refreshCommandPatterns,
};

