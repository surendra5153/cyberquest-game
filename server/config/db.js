const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

/**
 * Connect to MongoDB database
 * Tries local MongoDB first, falls back to in-memory server if local fails
 */
const connectDB = async () => {
  try {
    // Try connecting to local MongoDB first
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 2000 // Fail fast if not running
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log('Local MongoDB not found, starting dedicated local instance...');

    try {
      // Start in-memory server as fallback
      const mongod = await MongoMemoryServer.create();
      const uri = mongod.getUri();

      const conn = await mongoose.connect(uri);
      console.log(`Dedicated MongoDB Started & Connected: ${conn.connection.host}`);
      console.log(`Instance URI: ${uri}`);

      // Handle cleanup on process termination
      process.on('SIGINT', async () => {
        await mongoose.disconnect();
        await mongod.stop();
        process.exit(0);
      });
    } catch (fallbackError) {
      console.error(`Fatal Error: Could not connect to any database.`);
      console.error(`Local Error: ${error.message}`);
      console.error(`Fallback Error: ${fallbackError.message}`);
      process.exit(1);
    }
  }
};

module.exports = connectDB;
