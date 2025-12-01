const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

// Define User Schema
const userSchema = new mongoose.Schema({
  email: String,
  firstName: String,
  lastName: String,
  phoneNumber: String,
  role: [String],
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

async function listAllUsers() {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/noafarin';
    console.log('🔌 Connecting to MongoDB:', mongoUri);
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB\n');

    // Find all users
    const users = await User.find({}).select('email firstName lastName phoneNumber role');
    
    console.log(`📋 Found ${users.length} users:\n`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.firstName} ${user.lastName}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Phone: ${user.phoneNumber || 'N/A'}`);
      console.log(`   Role: ${user.role.join(', ')}`);
      console.log('   ─────────────────────────────────────────────────────────────────────────');
    });

    await mongoose.connection.close();
    console.log('\n✅ Database connection closed');
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

listAllUsers();
