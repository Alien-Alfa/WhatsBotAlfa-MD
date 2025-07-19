#!/usr/bin/env node

/**
 * MongoDB Auto-Setup for Aurora-MD
 * Integrated into npm start process
 */

function setupMongoDB() {
  console.log('\n🍃 Aurora-MD Database Configuration');
  console.log('=====================================');

  // Check if MongoDB is already configured
  if (process.env.MONGODB_URI && process.env.USE_MONGODB === 'true') {
    console.log('✅ MongoDB is already configured!');
    console.log(`   MONGODB_URI: ${process.env.MONGODB_URI.substring(0, 30)}...`);
    console.log(`   USE_MONGODB: ${process.env.USE_MONGODB}`);
    console.log('🔄 Dual database mode: MongoDB + SQLite with auto-sync');
    console.log('🚀 Starting Aurora-MD...\n');
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

  // If no MongoDB configuration found
  if (!process.env.MONGODB_URI) {
    console.log('📁 Using SQLite database (default)');
    console.log('💡 Set MONGODB_URI and USE_MONGODB=true for MongoDB support');
    console.log('🚀 Starting Aurora-MD...\n');
    return Promise.resolve();
  }

  console.log('🚀 Starting Aurora-MD...\n');
  return Promise.resolve();
}

// Run setup if this file is executed directly
if (require.main === module) {
  setupMongoDB()
    .then(() => {
      // Setup complete, exit successfully
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Setup failed:', error);
      process.exit(1);
    });
}

module.exports = { setupMongoDB };