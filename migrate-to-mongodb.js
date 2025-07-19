#!/usr/bin/env node
/**
 * Data Migration Script: SQLite → MongoDB
 * Migrates all existing data from SQLite database to MongoDB Atlas
 */

const config = require('./config');
const fs = require('fs');
const path = require('path');

async function migrateData() {
  console.log('🔄 Starting data migration: SQLite → MongoDB');
  console.log('=====================================');

  try {
    // Check if MongoDB is configured
    if (!config.USE_MONGODB || !config.MONGODB_URI) {
      console.error('❌ MongoDB not configured. Please set USE_MONGODB=true and MONGODB_URI');
      process.exit(1);
    }

    // Initialize MongoDB connection
    console.log('🍃 Connecting to MongoDB...');
    const mongoManager = require('./assets/database/mongodb');
    const models = await mongoManager.connect();
    console.log('✅ MongoDB connected successfully');

    // Initialize SQLite database
    console.log('🗃️ Loading SQLite database...');
    const { Sequelize } = require('sequelize');
    const sqliteDb = new Sequelize({
      dialect: 'sqlite',
      storage: './assets/database.db',
      logging: false
    });

    // Test SQLite connection
    await sqliteDb.authenticate();
    console.log('✅ SQLite database connected');

    // Define SQLite models (basic structure)
    const SQLiteChat = sqliteDb.define('Chat', {
      id: { type: Sequelize.STRING, primaryKey: true },
      conversationTimestamp: Sequelize.INTEGER,
      isGroup: Sequelize.BOOLEAN
    });

    const SQLiteMessage = sqliteDb.define('message', {
      id: { type: Sequelize.STRING, primaryKey: true },
      jid: Sequelize.STRING,
      message: Sequelize.JSON,
      sender: Sequelize.STRING
    });

    const SQLiteContact = sqliteDb.define('contact', {
      jid: { type: Sequelize.STRING, primaryKey: true },
      name: Sequelize.STRING,
      isGroup: Sequelize.BOOLEAN
    });

    // Sync SQLite models
    await sqliteDb.sync();

    // Migration counters
    let migrationStats = {
      chats: { total: 0, migrated: 0, errors: 0 },
      messages: { total: 0, migrated: 0, errors: 0 },
      contacts: { total: 0, migrated: 0, errors: 0 }
    };

    // Migrate Chats
    console.log('\n📊 Migrating Chats...');
    try {
      const sqliteChats = await SQLiteChat.findAll();
      migrationStats.chats.total = sqliteChats.length;
      
      for (const chat of sqliteChats) {
        try {
          await models.Chat.findOneAndUpdate(
            { id: chat.id },
            {
              id: chat.id,
              conversationTimestamp: chat.conversationTimestamp,
              isGroup: chat.isGroup || false
            },
            { upsert: true, new: true }
          );
          migrationStats.chats.migrated++;
        } catch (error) {
          console.warn(`⚠️ Error migrating chat ${chat.id}:`, error.message);
          migrationStats.chats.errors++;
        }
      }
      console.log(`✅ Chats: ${migrationStats.chats.migrated}/${migrationStats.chats.total} migrated`);
    } catch (error) {
      console.warn('⚠️ No chats table found or error accessing chats');
    }

    // Migrate Messages
    console.log('\n💬 Migrating Messages...');
    try {
      const sqliteMessages = await SQLiteMessage.findAll({ limit: 10000 }); // Limit for performance
      migrationStats.messages.total = sqliteMessages.length;
      
      for (const message of sqliteMessages) {
        try {
          await models.Message.findOneAndUpdate(
            { id: message.id },
            {
              id: message.id,
              jid: message.jid,
              message: message.message,
              sender: message.sender,
              messageType: getMessageType(message.message)
            },
            { upsert: true, new: true }
          );
          migrationStats.messages.migrated++;
          
          // Progress indicator
          if (migrationStats.messages.migrated % 100 === 0) {
            console.log(`   📤 Migrated ${migrationStats.messages.migrated}/${migrationStats.messages.total} messages...`);
          }
        } catch (error) {
          console.warn(`⚠️ Error migrating message ${message.id}:`, error.message);
          migrationStats.messages.errors++;
        }
      }
      console.log(`✅ Messages: ${migrationStats.messages.migrated}/${migrationStats.messages.total} migrated`);
    } catch (error) {
      console.warn('⚠️ No messages table found or error accessing messages');
    }

    // Migrate Contacts
    console.log('\n👥 Migrating Contacts...');
    try {
      const sqliteContacts = await SQLiteContact.findAll();
      migrationStats.contacts.total = sqliteContacts.length;
      
      for (const contact of sqliteContacts) {
        try {
          await models.Contact.findOneAndUpdate(
            { jid: contact.jid },
            {
              jid: contact.jid,
              name: contact.name,
              isGroup: contact.isGroup || false
            },
            { upsert: true, new: true }
          );
          migrationStats.contacts.migrated++;
        } catch (error) {
          console.warn(`⚠️ Error migrating contact ${contact.jid}:`, error.message);
          migrationStats.contacts.errors++;
        }
      }
      console.log(`✅ Contacts: ${migrationStats.contacts.migrated}/${migrationStats.contacts.total} migrated`);
    } catch (error) {
      console.warn('⚠️ No contacts table found or error accessing contacts');
    }

    // Migration Summary
    console.log('\n🎉 Migration Complete!');
    console.log('====================');
    console.log(`📊 Chats: ${migrationStats.chats.migrated}/${migrationStats.chats.total} (${migrationStats.chats.errors} errors)`);
    console.log(`💬 Messages: ${migrationStats.messages.migrated}/${migrationStats.messages.total} (${migrationStats.messages.errors} errors)`);
    console.log(`👥 Contacts: ${migrationStats.contacts.migrated}/${migrationStats.contacts.total} (${migrationStats.contacts.errors} errors)`);
    
    const totalMigrated = migrationStats.chats.migrated + migrationStats.messages.migrated + migrationStats.contacts.migrated;
    const totalRecords = migrationStats.chats.total + migrationStats.messages.total + migrationStats.contacts.total;
    
    console.log(`\n📈 Overall: ${totalMigrated}/${totalRecords} records migrated successfully`);
    console.log(`⏰ Migration completed at: ${new Date().toISOString()}`);

    // Close connections
    await sqliteDb.close();
    await mongoManager.disconnect();
    
    console.log('\n✅ Migration completed successfully!');
    console.log('🚀 Your bot is now ready to use MongoDB with all existing data');

  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

// Helper function to determine message type
function getMessageType(message) {
  if (!message) return 'unknown';
  
  try {
    const msgObj = typeof message === 'string' ? JSON.parse(message) : message;
    
    if (msgObj.conversation) return 'text';
    if (msgObj.imageMessage) return 'image';
    if (msgObj.videoMessage) return 'video';
    if (msgObj.audioMessage) return 'audio';
    if (msgObj.documentMessage) return 'document';
    if (msgObj.stickerMessage) return 'sticker';
    if (msgObj.locationMessage) return 'location';
    if (msgObj.contactMessage) return 'contact';
    if (msgObj.extendedTextMessage) return 'extendedText';
    
    return 'other';
  } catch (error) {
    return 'unknown';
  }
}

// Run migration if called directly
if (require.main === module) {
  migrateData().catch(console.error);
}

module.exports = { migrateData };
