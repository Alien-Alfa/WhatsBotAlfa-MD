# 🍃 MongoDB Setup for Aurora-MD

Aurora-MD now supports **dual database operation** with automatic synchronization between MongoDB and SQLite.

## 🚀 Quick Start

Just run the normal start command - MongoDB setup is integrated:

```bash
npm install
npm start
```

The bot will automatically guide you through database configuration on first run.

## 🎯 Setup Options

### Option 1: Interactive Setup (Recommended)
```bash
npm start
# Choose from the menu:
# 1) SQLite only (Beginner-friendly)
# 2) MongoDB + SQLite (Advanced with auto-sync)
```

### Option 2: Pre-configured Environment
```bash
# Set environment variables
export USE_MONGODB=true
export MONGODB_URI="mongodb://localhost:27017/whatsbot-alfa"

# Start directly
npm start
```

### Option 3: Script Commands
```bash
npm run start:mongodb    # Force MongoDB setup
npm run start:sqlite     # Force SQLite only
npm run setup           # Setup only (no start)
```

## 🗄️ Database Configuration Examples

### Local MongoDB
```bash
MONGODB_URI="mongodb://localhost:27017/whatsbot-alfa"
USE_MONGODB=true
```

### MongoDB Atlas (Cloud)
```bash
MONGODB_URI="mongodb+srv://username:password@cluster.mongodb.net/whatsbot-alfa"
USE_MONGODB=true
```

### Custom MongoDB Server
```bash
MONGODB_URI="mongodb://your-server:27017/your-database"
USE_MONGODB=true
```

## 🔄 Database Synchronization

When MongoDB is enabled, Aurora-MD automatically:

- ✅ **Syncs every 30 minutes** between MongoDB and SQLite
- ✅ **Maintains data consistency** across both databases
- ✅ **Resolves conflicts** automatically using timestamps
- ✅ **Provides manual sync controls** via bot commands

### Sync Commands (In Bot)
```bash
.dbstatus    # Check sync health
.dbsync      # Manual sync trigger
.dbinfo      # Database information
.dbreset     # Emergency reset
```

## 📋 Features

- ✅ **Dual Database Support** - MongoDB + SQLite
- ✅ **Auto-Sync** - Every 30 minutes
- ✅ **Zero Code Changes** - Existing functionality unchanged
- ✅ **Performance Optimized** - Caching and batch operations
- ✅ **Error Recovery** - Automatic retry and fallback
- ✅ **Manual Control** - Bot commands for monitoring

## 🛠️ Technical Details

### Models Supported
All 17 database models are fully supported:
- Chat, Message, Contact, PausedChat, Greeting, Warning
- Note, Filter, Plugin, GroupStateSave, CallAction
- AutoReact, AutoTranslate, BanBot, BannedAccount
- StickBan, PDM, AiChat, Gemini

### Dependencies
Required packages (auto-installed):
- `mongoose@8.16.4` - MongoDB ODM
- `node-cron@3.0.3` - Sync scheduling

## 🎉 That's It!

Your Aurora-MD bot is ready with MongoDB support. The setup is fully integrated into `npm start` - no additional scripts needed.

For questions or issues, check the bot's `.dbstatus` command for real-time information.
