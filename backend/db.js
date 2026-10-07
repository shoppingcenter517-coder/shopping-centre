const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');

// MONGO_URI set hai  -> us database se connect (local MongoDB ya Atlas)
// MONGO_URI khali    -> built-in MongoDB (kuch install nahi karna), data backend/data folder me save hota hai
async function connectDB() {
  let uri = (process.env.MONGO_URI || '').trim();

  if (!uri && process.env.RENDER) {
    throw new Error('MONGO_URI set nahi hai. Render ke Environment me MongoDB Atlas ki connection string daalo.');
  }

  if (!uri) {
    const { MongoMemoryServer } = require('mongodb-memory-server');
    const dbPath = path.join(__dirname, 'data');
    fs.mkdirSync(dbPath, { recursive: true });
    console.log('Built-in MongoDB start ho raha hai (pehli baar 1-2 minute lag sakte hain, download hota hai)...');
    const mongod = await MongoMemoryServer.create({
      instance: { dbPath, storageEngine: 'wiredTiger', port: 27018 },
      binary: { version: '7.0.14' },
    });
    uri = mongod.getUri('shopping_centre');
    const stop = async () => {
      await mongod.stop().catch(() => {});
      process.exit(0);
    };
    process.on('SIGINT', stop);
    process.on('SIGTERM', stop);
  }

  await mongoose.connect(uri);
  console.log('MongoDB connected');
}

module.exports = connectDB;
