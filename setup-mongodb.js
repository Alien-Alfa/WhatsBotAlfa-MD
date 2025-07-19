#!/usr/bin/env node

/**
 * MongoDB Auto-Setup for Aurora-MD
 * Integrated into npm start process
 */

const readline = require('readline');

// Check if running in non-interactive mode (CI/CD, automated deployments)
const isNonInteractive = process.env.CI || process.env.NON_INTERACTIVE || process.argv.includes('--non-interactive');

function setupMongoDB() {
  console.log('\n🍃 Aurora-MD Database Configuration');
  console.log('=====================================');

  // Check if MongoDB is already configured
  if (process.env.MONGODB_URI && process.env.USE_MONGODB === 'true') {
    console.log('✅ MongoDB is already configured!');
    console.log(`   MONGODB_URI: ${process.env.MONGODB_URI.substring(0, 30)}...`);
    console.log(`   USE_MONGODB: ${process.env.USE_MONGODB}`);
    console.log('� Dual database mode: MongoDB + SQLite with auto-sync');
    console.log('�🚀 Starting Aurora-MD...\n');
    return Promise.resolve();
  }

  // Check if MongoDB URI is set but USE_MONGODB is false
  if (process.env.MONGODB_URI && process.env.USE_MONGODB !== 'true') {
    console.log('⚠️  MongoDB URI detected but not enabled');
    console.log('💡 Set USE_MONGODB=true to enable dual database mode');
    console.log('📁 Using SQLite database only');
    console.log('🚀 Starting Aurora-MD...\n');
    return Promise.resolve();
  }

  // If non-interactive, default to SQLite
  if (isNonInteractive) {
    console.log('🤖 Non-interactive mode detected');
    console.log('📁 Using SQLite database (default)');
    console.log('💡 Set MONGODB_URI and USE_MONGODB=true for MongoDB support');
    console.log('🚀 Starting Aurora-MD...\n');
    return Promise.resolve();
  }

  // Interactive setup for first-time users
  return interactiveSetup();
}

async function interactiveSetup() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  function question(query) {
    return new Promise(resolve => rl.question(query, resolve));
  }

  try {
    console.log('\n📋 First-time setup detected!');
    console.log('Choose your database configuration:\n');
    console.log('1) SQLite only (Recommended for beginners)');
    console.log('2) MongoDB + SQLite (Advanced - Dual database with sync)');
    console.log('3) Configure later\n');

    const choice = await question('Enter your choice (1-3) or press Enter for SQLite: ');

    switch (choice.trim() || '1') {
      case '2':
        await setupMongoDBInteractive(rl, question);
        break;
        
      case '3':
        console.log('\n⏭️ Configuration skipped');
        console.log('💡 You can set MONGODB_URI and USE_MONGODB=true later');
        console.log('📁 Using SQLite for now');
        break;
        
      default:
        console.log('\n📁 Using SQLite database (default)');
        console.log('✅ Perfect for getting started!');
        break;
    }

    console.log('🚀 Starting Aurora-MD...\n');
    rl.close();
    
  } catch (error) {
    console.error('❌ Setup error:', error.message);
    console.log('📁 Falling back to SQLite database');
    console.log('🚀 Starting Aurora-MD...\n');
    rl.close();
  }
}

async function setupMongoDBInteractive(rl, question) {
  console.log('\n🔧 MongoDB Setup Options:');
  console.log('1) Local MongoDB (localhost:27017)');
  console.log('2) MongoDB Atlas (cloud)');
  console.log('3) Custom URI\n');

  const mongoChoice = await question('MongoDB option (1-3): ');

  switch (mongoChoice.trim()) {
    case '1':
      process.env.USE_MONGODB = 'true';
      process.env.MONGODB_URI = 'mongodb://localhost:27017/whatsbot-alfa';
      console.log('\n✅ Local MongoDB configured!');
      console.log('   Database: whatsbot-alfa @ localhost:27017');
      console.log('   🔄 Auto-sync: Every 30 minutes with SQLite');
      break;
      
    case '2':
      const atlasUri = await question('\nMongoDB Atlas URI: ');
      if (atlasUri && atlasUri.trim()) {
        process.env.USE_MONGODB = 'true';
        process.env.MONGODB_URI = atlasUri.trim();
        console.log('\n✅ MongoDB Atlas configured!');
        console.log('   🔄 Auto-sync: Every 30 minutes with SQLite');
      } else {
        console.log('\n❌ No URI provided, using SQLite only');
      }
      break;
      
    case '3':
      const customUri = await question('\nCustom MongoDB URI: ');
      if (customUri && customUri.trim()) {
        process.env.USE_MONGODB = 'true';
        process.env.MONGODB_URI = customUri.trim();
        console.log('\n✅ Custom MongoDB configured!');
        console.log('   🔄 Auto-sync: Every 30 minutes with SQLite');
      } else {
        console.log('\n❌ No URI provided, using SQLite only');
      }
      break;
      
    default:
      console.log('\n📁 Invalid choice, using SQLite only');
      break;
  }
}

// Auto-setup if running directly
if (require.main === module) {
  setupMongoDB().catch(error => {
    console.error('❌ Setup failed:', error.message);
    console.log('📁 Falling back to SQLite database');
    console.log('🚀 Starting Aurora-MD...\n');
  });
} else {
  // Export for require()
  module.exports = { setupMongoDB };
}
