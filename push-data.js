#!/usr/bin/env node
/**
 * Quick Data Push Script
 * Forces immediate synchronization of current data to MongoDB
 */

const config = require('./config');

async function pushCurrentData() {
  console.log('🚀 Quick Data Push to MongoDB');
  console.log('=============================');

  try {
    if (!config.USE_MONGODB || !config.MONGODB_URI) {
      console.error('❌ MongoDB not configured');
      process.exit(1);
    }

    // Initialize MongoDB
    console.log('🍃 Connecting to MongoDB...');
    const MongoStoreDb = require('./assets/database/MongoStoreDb');
    
    // Initialize the MongoDB store
    await MongoStoreDb.initialize();
    console.log('✅ MongoDB store initialized');

    // Check if sync functionality is available
    if (typeof MongoStoreDb.performSync === 'function') {
      console.log('🔄 Starting forced sync...');
      const syncResult = await MongoStoreDb.performSync();
      console.log('✅ Sync completed:', syncResult);
    } else {
      console.log('⚠️ Sync function not available, manual data creation...');
      
      // Create sample data to test the connection
      const testMessage = {
        key: {
          id: 'test_' + Date.now(),
          remoteJid: '919383400679@s.whatsapp.net'
        },
        message: {
          conversation: 'Test message for MongoDB'
        }
      };

      const saved = await MongoStoreDb.saveMessage(testMessage, '919383400679@s.whatsapp.net');
      if (saved) {
        console.log('✅ Test message saved to MongoDB');
      } else {
        console.log('❌ Failed to save test message');
      }
    }

    // Get current sync stats
    const stats = MongoStoreDb.getSyncStats();
    console.log('\n📊 Current Sync Status:');
    console.log(JSON.stringify(stats, null, 2));

    console.log('\n🎉 Data push completed!');

  } catch (error) {
    console.error('❌ Data push failed:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  pushCurrentData().catch(console.error);
}

module.exports = { pushCurrentData };
