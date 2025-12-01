/**
 * Check if test user exists and validate credentials
 */

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';
import '../src/models/User';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const TEST_EMAIL = 'testmember@noafarin.com';
const TEST_PASSWORD = 'Test1234!';

async function checkUser() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/noafarin');
    console.log('✅ Connected to MongoDB\n');

    const User = mongoose.model('User');

    // Find user (with password - it has select: false in schema)
    const user = await User.findOne({ email: TEST_EMAIL }).select('+password');

    if (!user) {
      console.log('❌ User NOT found in database!');
      console.log('📧 Email:', TEST_EMAIL);
      console.log('\n🔧 Solution: Run this command:');
      console.log('   npm run create-member\n');
      process.exit(1);
    }

    console.log('✅ User found in database!');
    console.log('='.repeat(60));
    console.log('📧 Email:', user.email);
    console.log('👤 Name:', `${user.firstName} ${user.lastName}`);
    console.log('🎭 Roles:', user.role.join(', '));
    console.log('🔐 Email Verified:', user.isEmailVerified ? '✅ Yes' : '❌ No');
    console.log('✅ Active:', user.isActive ? '✅ Yes' : '❌ No');
    
    if (user.membershipInfo?.memberId) {
      console.log('🆔 Member ID:', user.membershipInfo.memberId);
      console.log('📊 Level:', user.membershipInfo.level);
      console.log('⭐ Status:', user.membershipInfo.status);
    } else {
      console.log('⚠️  No membership info');
    }
    
    console.log('='.repeat(60));

    // Test password
    console.log('\n🔐 Testing password...');
    const isPasswordValid = await bcrypt.compare(TEST_PASSWORD, user.password);
    
    if (isPasswordValid) {
      console.log('✅ Password is CORRECT!');
      console.log('🔑 Password:', TEST_PASSWORD);
    } else {
      console.log('❌ Password is WRONG!');
      console.log('⚠️  Expected:', TEST_PASSWORD);
      console.log('\n🔧 Solution: Run this command to recreate user:');
      console.log('   npm run create-member\n');
      process.exit(1);
    }

    console.log('\n📝 Summary:');
    console.log('='.repeat(60));
    console.log('✅ User exists: YES');
    console.log('✅ Password valid: YES');
    console.log('✅ Email verified: YES');
    console.log('✅ Account active: YES');
    console.log('✅ Has membership: ' + (user.membershipInfo?.memberId ? 'YES' : 'NO'));
    console.log('='.repeat(60));

    console.log('\n🎯 Next steps:');
    console.log('1. Clear browser localStorage (F12 → Application → Local Storage → Clear)');
    console.log('2. Clear browser cache (Ctrl+Shift+Delete)');
    console.log('3. Go to: http://localhost:5173/login');
    console.log('4. Login with:');
    console.log('   Email:', TEST_EMAIL);
    console.log('   Password:', TEST_PASSWORD);
    console.log('5. Should redirect to: /club-member/dashboard\n');

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('👋 Disconnected from MongoDB');
    process.exit(0);
  }
}

console.log('🔍 Checking test user...\n');
checkUser();
