require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./db');
const { seedProducts } = require('./seedData');

// Note: ye script database reset karke products dobara daalti hai.
// (Built-in database use ho raha ho to server band karke hi chalana; normal case me iski zaroorat nahi, server pehli baar khud seed karta hai.)
(async () => {
  try {
    await connectDB();
    await seedProducts({ reset: true });
  } catch (e) {
    console.error(e);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
    process.exit();
  }
})();
