/**
 * Delete test user to recreate
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import '../src/models/User';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const TEST_EMAIL = 'testmember@noafarin.com';

async function deleteTestUser() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/noafarin');
    console.log('✅ Connected to MongoDB\n');

    const User = mongoose.model('User');

    // Delete user
    const result = await User.deleteOne({ email: TEST_EMAIL });

    if (result.deletedCount > 0) {
      console.log('✅ Test user deleted successfully!');
      console.log('📧 Email:', TEST_EMAIL);
      console.log('\n🔄 Now run: npm run create-member\n');
    } else {
      console.log('⚠️  Test user not found');
      console.log('📧 Email:', TEST_EMAIL);
      console.log('\n✅ You can create new user: npm run create-member\n');
    }

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('👋 Disconnected from MongoDB');
    process.exit(0);
  }
}

console.log('🗑️  Deleting test user...\n');
deleteTestUser();
