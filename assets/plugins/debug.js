const { command } = require("../../lib");
const logger = require("../../lib/logger");

// Simple debug command with no restrictions
command({
    pattern: "debug",
    fromMe: false,  // Allow anyone to use this command
    desc: "Debug test command",
    type: "utility",
}, async (message, match) => {
    try {
        logger.info("🧪 DEBUG COMMAND EXECUTED!");
        logger.info("Message from:", message.from);
        logger.info("Message text:", message.body);
        logger.info("Message prefix:", message.prefix);
        await message.reply("✅ Debug: Bot is receiving and processing commands correctly!");
    } catch (error) {
        logger.error("Debug command error:", error);
        await message.reply("❌ Debug command failed: " + error.message);
    }
});
