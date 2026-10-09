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

