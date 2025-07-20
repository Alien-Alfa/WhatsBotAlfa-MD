const { command } = require("../../lib");

// Simple debug command with no restrictions
command({
    pattern: "debug",
    fromMe: false,  // Allow anyone to use this command
    desc: "Debug test command",
    type: "utility",
}, async (message, match) => {
    try {
        console.log("🧪 DEBUG COMMAND EXECUTED!");
        console.log("Message from:", message.from);
        console.log("Message text:", message.body);
        console.log("Message prefix:", message.prefix);
        await message.reply("✅ Debug: Bot is receiving and processing commands correctly!");
    } catch (error) {
        console.error("Debug command error:", error);
        await message.reply("❌ Debug command failed: " + error.message);
    }
});
