/**
 * Create Development Club Member Account
 * یوزر توسعه با دسترسی مستقیم به Dashboard عضو باشگاه
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import '../src/models/User';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const DEV_USER = {
  email: 'dev@club.com',
  password: 'Dev1234!',
  firstName: 'حسین',
  lastName: 'احمدی',
  nationalId: '9876543210',
  phoneNumber: '09121112233',
  university: 'دانشگاه صنعتی شریف',
  major: 'هوش مصنوعی',
  studentId: 'DEV2025',
  graduationYear: 2025,
};

async function createDevClubMember() {
  try {
    console.log('🚀 Creating Dev Club Member Account...\n');
    
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/noafarin');
    console.log('✅ Connected to MongoDB\n');

    const User = mongoose.model('User');

    // Check if user already exists
    const existingUser = await User.findOne({ email: DEV_USER.email });
    
    if (existingUser) {
      console.log('⚠️  Dev user already exists!');
      console.log('📧 Email:', DEV_USER.email);
      console.log('🔑 Password:', DEV_USER.password);
      console.log('👤 Name:', `${existingUser.firstName} ${existingUser.lastName}`);
      console.log('🎭 Roles:', existingUser.role.join(', '));
      
      if (existingUser.membershipInfo?.memberId) {
        console.log('🆔 Member ID:', existingUser.membershipInfo.memberId);
        console.log('✅ User is already a Club Member!\n');
      }
      
      await mongoose.disconnect();
      process.exit(0);
    }

    console.log('👤 Creating dev club member...');
    
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

    // Create user with CLUB_MEMBER role directly
    const newUser = new User({
      email: DEV_USER.email,
      password: DEV_USER.password, // Will be hashed by pre-save hook
      firstName: DEV_USER.firstName,
      lastName: DEV_USER.lastName,
      nationalId: DEV_USER.nationalId,
      phoneNumber: DEV_USER.phoneNumber,
      university: DEV_USER.university,
      major: DEV_USER.major,
      studentId: DEV_USER.studentId,
      graduationYear: DEV_USER.graduationYear,
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
        promotedBy: null, // Dev account - no promoter
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

    console.log('✅ Dev Club Member created successfully!\n');
    console.log('='.repeat(60));
    console.log('📋 Dev Account Details:');
    console.log('='.repeat(60));
    console.log('📧 Email:', DEV_USER.email);
    console.log('🔑 Password:', DEV_USER.password);
    console.log('👤 Name:', `${DEV_USER.firstName} ${DEV_USER.lastName}`);
    console.log('🆔 Member ID:', memberId);
    console.log('🎭 Role: Club Member');
    console.log('📊 Level: Bronze');
    console.log('✅ Status: Active');
    console.log('='.repeat(60));
    
    console.log('\n📝 Login Instructions:');
    console.log('1. Go to: http://localhost:5173/login');
    console.log('2. Email:', DEV_USER.email);
    console.log('3. Password:', DEV_USER.password);
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

createDevClubMember();
