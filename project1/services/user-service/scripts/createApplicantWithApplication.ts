/**
 * Create Test Applicant with Approved Application
 * برای test کردن Promotion flow
 */

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';
import '../src/models/User';
import '../src/models/Application';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const TEST_APPLICANT = {
  email: 'applicant@test.com',
  password: 'Test1234!',
  firstName: 'علی',
  lastName: 'محمدی',
  nationalId: '1234567891',
  phoneNumber: '09123456780',
  university: 'دانشگاه شریف',
  major: 'مهندسی نرم‌افزار',
  studentId: '400123457',
  graduationYear: 2024,
};

async function createApplicantWithApplication() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/noafarin');
    console.log('✅ Connected to MongoDB\n');

    const User = mongoose.model('User');
    const Application = mongoose.model('Application');

    // Check if user already exists
    let user = await User.findOne({ email: TEST_APPLICANT.email });
    
    if (user) {
      console.log('⚠️  User already exists!');
      console.log('📧 Email:', TEST_APPLICANT.email);
      console.log('🔑 Password:', TEST_APPLICANT.password);
      console.log('👤 Name:', `${user.firstName} ${user.lastName}`);
      console.log('🎭 Role:', user.role.join(', '));
      
      // Check application
      const existingApp = await Application.findOne({ user: user._id });
      if (existingApp) {
        console.log('📋 Application Status:', existingApp.status);
        console.log('\n✅ User and Application already exist!\n');
      } else {
        console.log('⚠️  User exists but no application\n');
      }
      
      await mongoose.disconnect();
      process.exit(0);
    }

    console.log('👤 Creating test applicant...');
    
    // Create user as APPLICANT
    user = new User({
      email: TEST_APPLICANT.email,
      password: TEST_APPLICANT.password, // Will be hashed by pre-save hook
      firstName: TEST_APPLICANT.firstName,
      lastName: TEST_APPLICANT.lastName,
      nationalId: TEST_APPLICANT.nationalId,
      phoneNumber: TEST_APPLICANT.phoneNumber,
      university: TEST_APPLICANT.university,
      major: TEST_APPLICANT.major,
      studentId: TEST_APPLICANT.studentId,
      graduationYear: TEST_APPLICANT.graduationYear,
      isEmailVerified: true,
      isActive: true,
      role: ['applicant'], // APPLICANT role
    });

    await user.save();
    console.log('✅ User created!');

    // Create approved application
    console.log('📋 Creating approved application...');
    
    const application = new Application({
      userId: user._id,
      firstName: TEST_APPLICANT.firstName,
      lastName: TEST_APPLICANT.lastName,
      email: TEST_APPLICANT.email,
      phoneNumber: TEST_APPLICANT.phoneNumber,
      nationalId: TEST_APPLICANT.nationalId,
      dateOfBirth: new Date('2000-01-01'),
      
      // Education Info
      university: TEST_APPLICANT.university,
      major: TEST_APPLICANT.major,
      degree: 'کارشناسی',
      studentId: TEST_APPLICANT.studentId,
      graduationYear: TEST_APPLICANT.graduationYear,
      gpa: 18.5,
      
      // Address
      province: 'تهران',
      city: 'تهران',
      address: 'تهران، خیابان آزادی',
      postalCode: '1234567890',
      
      // Professional Info
      hasStartupIdea: true,
      startupIdea: 'ایده استارتاپ در زمینه فناوری اطلاعات',
      hasTeam: false,
      workExperience: 'دانشجو',
      skills: ['JavaScript', 'TypeScript', 'React', 'Node.js'],
      portfolioUrl: 'https://github.com/test',
      
      // Motivation
      whyJoin: 'علاقه‌مند به یادگیری مهارت‌های جدید و کار در محیط نوآورانه و خلاقانه هستم',
      goals: 'هدف من توسعه مهارت‌های فنی و کسب تجربه در پروژه‌های واقعی است',
      commitmentLevel: 'full-time',
      
      // Status
      status: 'approved', // APPROVED for testing
      submittedAt: new Date(),
    });

    await application.save();
    console.log('✅ Application created and approved!');

    console.log('\n' + '='.repeat(60));
    console.log('📋 Test Applicant Details:');
    console.log('='.repeat(60));
    console.log('📧 Email:', TEST_APPLICANT.email);
    console.log('🔑 Password:', TEST_APPLICANT.password);
    console.log('👤 Name:', `${TEST_APPLICANT.firstName} ${TEST_APPLICANT.lastName}`);
    console.log('🎭 Role: APPLICANT');
    console.log('📋 Application Status: APPROVED');
    console.log('='.repeat(60));
    
    console.log('\n📝 Next Steps:');
    console.log('1. Login as Admin: admin@noafarin.com / Admin@123456');
    console.log('2. Go to: Admin Panel → Applications');
    console.log('3. Find:', TEST_APPLICANT.email);
    console.log('4. Click: "ارتقا به عضو باشگاه" button');
    console.log('5. ✅ User will become Club Member with proper membership info\n');

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('👋 Disconnected from MongoDB');
    process.exit(0);
  }
}

console.log('🚀 Creating Test Applicant with Approved Application...\n');
createApplicantWithApplication();
