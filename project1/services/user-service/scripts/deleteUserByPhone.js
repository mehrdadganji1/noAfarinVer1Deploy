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

async function deleteUserByPhone() {
  try {
    const emailToDelete = '09982328585@temp.noafarin.com';
    
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/noafarin';
    console.log('🔌 Connecting to MongoDB:', mongoUri);
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB\n');

    // Find user by email
    const user = await User.findOne({ email: emailToDelete });
    
    if (!user) {
      console.log('⚠️  User not found with email:', emailToDelete);
      await mongoose.connection.close();
      return;
    }

    console.log('📋 User Found:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Email:', user.email);
    console.log('Name:', user.firstName, user.lastName);
    console.log('Phone:', user.phoneNumber);
    console.log('Role:', user.role);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // Delete user
    await User.deleteOne({ email: emailToDelete });
    console.log('✅ User deleted successfully!\n');

    await mongoose.connection.close();
    console.log('✅ Database connection closed');
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

deleteUserByPhone();
