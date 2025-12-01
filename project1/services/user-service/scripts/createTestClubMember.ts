/**
 * Create Test Club Member Account
 * ساخت یک اکانت تست کامل برای توسعه dashboard عضو باشگاه
 */

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';
import '../src/models/User';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const TEST_USER = {
  email: 'testmember@noafarin.com',
  password: 'Test1234!',
  firstName: 'محمد',
  lastName: 'نوآفرین',
  nationalId: '1234567890',
  phoneNumber: '09123456789',
  university: 'دانشگاه تهران',
  major: 'مهندسی کامپیوتر',
  studentId: '400123456',
  graduationYear: 2025,
};

async function createTestClubMember() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/noafarin');
    console.log('✅ Connected to MongoDB\n');

    const User = mongoose.model('User');

    // Check if user already exists
    const existingUser = await User.findOne({ email: TEST_USER.email });
    
    if (existingUser) {
      console.log('⚠️  Test user already exists!');
      console.log('📧 Email:', TEST_USER.email);
      console.log('🔑 Password:', TEST_USER.password);
      console.log('👤 Name:', `${existingUser.firstName} ${existingUser.lastName}`);
      console.log('🎭 Roles:', existingUser.role.join(', '));
      
      if (existingUser.membershipInfo?.memberId) {
        console.log('🆔 Member ID:', existingUser.membershipInfo.memberId);
        console.log('✅ User is already a Club Member!\n');
      } else {
        console.log('⚠️  User exists but is NOT a Club Member yet\n');
      }
      
      await mongoose.disconnect();
      process.exit(0);
    }

    console.log('👤 Creating test user...');
    
    // Note: Don't hash password here - the pre-save hook in User model will do it
    
    // Generate Member ID
    const currentYear = new Date().getFullYear();
    const lastMember = await User.findOne({
      'membershipInfo.memberId': new RegExp(`^NI-${currentYear}-`)
    }).sort({ 'membershipInfo.memberId': -1 });

    let nextNumber = 1;
    if (lastMember && lastMember.membershipInfo?.memberId) {
      const lastNumber = parseInt(lastMember.membershipInfo.memberId.split('-')[2]);
      nextNumber = lastNumber + 1;
    }

    const memberId = `NI-${currentYear}-${String(nextNumber).padStart(4, '0')}`;

    // Create user with CLUB_MEMBER role and membership info
    const newUser = new User({
      email: TEST_USER.email,
      password: TEST_USER.password, // Will be hashed by pre-save hook
      firstName: TEST_USER.firstName,
      lastName: TEST_USER.lastName,
      nationalId: TEST_USER.nationalId,
      phoneNumber: TEST_USER.phoneNumber,
      university: TEST_USER.university,
      major: TEST_USER.major,
      studentId: TEST_USER.studentId,
      graduationYear: TEST_USER.graduationYear,
      isEmailVerified: true,
      isActive: true,
      role: ['club_member'], // Direct club member
      
      // Membership Info
      membershipInfo: {
        memberId,
        memberSince: new Date(),
        level: 'bronze',
        points: 0,
        status: 'active',
        promotedBy: null, // Auto-created for testing
        promotedAt: new Date(),
      },
      
      // Member Stats
      memberStats: {
        eventsAttended: 0,
        projectsCompleted: 0,
        coursesCompleted: 0,
        achievementsEarned: 0,
        totalPoints: 0,
        rank: null,
      },
    });

    await newUser.save();

    console.log('✅ Test Club Member created successfully!\n');
    console.log('='.repeat(60));
    console.log('📋 Test Account Details:');
    console.log('='.repeat(60));
    console.log('📧 Email:', TEST_USER.email);
    console.log('🔑 Password:', TEST_USER.password);
    console.log('👤 Name:', `${TEST_USER.firstName} ${TEST_USER.lastName}`);
    console.log('🆔 Member ID:', memberId);
    console.log('🎭 Role: Club Member');
    console.log('📊 Level: Bronze');
    console.log('✅ Status: Active');
    console.log('='.repeat(60));
    console.log('\n📝 Login Instructions:');
    console.log('1. Go to: http://localhost:5173/login');
    console.log('2. Email:', TEST_USER.email);
    console.log('3. Password:', TEST_USER.password);
    console.log('4. → Auto redirect to: /club-member/dashboard');
    console.log('\n🚀 Ready for development!\n');

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('👋 Disconnected from MongoDB');
    process.exit(0);
  }
}

console.log('🚀 Creating Test Club Member Account...\n');
createTestClubMember();
