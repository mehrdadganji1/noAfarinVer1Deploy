console.log('Test script starting...');

const mongoose = require('mongoose');
require('dotenv').config();

const MONGODB_URI = 'mongodb://admin:admin123@localhost:27017/noafarin?authSource=admin';

async function test() {
  console.log('Connecting to MongoDB...');
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected!');
    
    const count = await mongoose.connection.db.collection('users').countDocuments();
    console.log('User count:', count);
    
    await mongoose.disconnect();
    console.log('Done!');
  } catch (err) {
    console.error('Error:', err.message);
  }
}

test();
