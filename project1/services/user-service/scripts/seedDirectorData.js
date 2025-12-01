/**
 * Seed Script for Director Dashboard
 * Creates realistic data in MongoDB for testing
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/noafarin');
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

// User Schema
const UserSchema = new mongoose.Schema({
  email: String,
  password: String,
  firstName: String,
  lastName: String,
  role: [String],
  phoneNumber: String,
  university: String,
  major: String,
  studentId: String,
  isActive: { type: Boolean, default: true },
  isVerified: { type: Boolean, default: false },
  isEmailVerified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

const User = mongoose.model('User', UserSchema);

// Application Schema
const ApplicationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, enum: ['pending', 'in_review', 'approved', 'rejected'], default: 'pending' },
  personalInfo: {
    firstName: String,
    lastName: String,
    email: String,
    phone: String,
    nationalId: String,
    birthDate: Date,
    gender: String
  },
  educationInfo: {
    university: String,
    major: String,
    degree: String,
    gpa: Number,
    graduationYear: Number
  },
  motivation: String,
  skills: [String],
  experience: String,
  reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  reviewedAt: Date,
  reviewNotes: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

const Application = mongoose.model('Application', ApplicationSchema);

// Activity Schema
const ActivitySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  type: { type: String, enum: ['application', 'status', 'document', 'login', 'profile', 'system'] },
  description: String,
  metadata: mongoose.Schema.Types.Mixed,
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

const Activity = mongoose.model('Activity', ActivitySchema);

// Sample data
const sampleUsers = [
  {
    firstName: 'علی', lastName: 'محمدی', email: 'ali.mohammadi@example.com',
    role: ['applicant'], university: 'دانشگاه تهران', major: 'مهندسی کامپیوتر',
    phoneNumber: '09121234567', studentId: 'STU001', daysAgo: 5
  },
  {
    firstName: 'زهرا', lastName: 'احمدی', email: 'zahra.ahmadi@example.com',
    role: ['club_member'], university: 'دانشگاه شریف', major: 'مهندسی نرم‌افزار',
    phoneNumber: '09121234568', studentId: 'STU002', daysAgo: 15
  },
  {
    firstName: 'محمد', lastName: 'رضایی', email: 'mohammad.rezaei@example.com',
    role: ['applicant'], university: 'دانشگاه امیرکبیر', major: 'مهندسی برق',
    phoneNumber: '09121234569', studentId: 'STU003', daysAgo: 3
  },
  {
    firstName: 'فاطمه', lastName: 'کریمی', email: 'fatemeh.karimi@example.com',
    role: ['club_member'], university: 'دانشگاه صنعتی شریف', major: 'مهندسی مکانیک',
    phoneNumber: '09121234570', studentId: 'STU004', daysAgo: 25
  },
  {
    firstName: 'حسین', lastName: 'نوری', email: 'hossein.nouri@example.com',
    role: ['applicant'], university: 'دانشگاه تهران', major: 'مهندسی شیمی',
    phoneNumber: '09121234571', studentId: 'STU005', daysAgo: 7
  },
  {
    firstName: 'مریم', lastName: 'حسینی', email: 'maryam.hosseini@example.com',
    role: ['club_member'], university: 'دانشگاه شریف', major: 'فیزیک',
    phoneNumber: '09121234572', studentId: 'STU006', daysAgo: 40
  },
  {
    firstName: 'رضا', lastName: 'موسوی', email: 'reza.mousavi@example.com',
    role: ['applicant'], university: 'دانشگاه علم و صنعت', major: 'مهندسی صنایع',
    phoneNumber: '09121234573', studentId: 'STU007', daysAgo: 2
  },
  {
    firstName: 'سارا', lastName: 'جعفری', email: 'sara.jafari@example.com',
    role: ['club_member'], university: 'دانشگاه تهران', major: 'ریاضیات',
    phoneNumber: '09121234574', studentId: 'STU008', daysAgo: 50
  },
  {
    firstName: 'امیر', lastName: 'صادقی', email: 'amir.sadeghi@example.com',
    role: ['applicant'], university: 'دانشگاه امیرکبیر', major: 'مهندسی عمران',
    phoneNumber: '09121234575', studentId: 'STU009', daysAgo: 10
  },
  {
    firstName: 'نازنین', lastName: 'رحیمی', email: 'nazanin.rahimi@example.com',
    role: ['club_member'], university: 'دانشگاه شریف', major: 'شیمی',
    phoneNumber: '09121234576', studentId: 'STU010', daysAgo: 60
  },
  {
    firstName: 'مهدی', lastName: 'عباسی', email: 'mehdi.abbasi@example.com',
    role: ['manager'], university: 'دانشگاه تهران', major: 'مدیریت',
    phoneNumber: '09121234577', studentId: 'MGR001', daysAgo: 180
  }
];

async function seedData() {
  try {
    console.log('🌱 Starting data seeding...\n');

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await User.deleteMany({ email: { $in: sampleUsers.map(u => u.email) } });
    await Application.deleteMany({});
    await Activity.deleteMany({});
    console.log('✅ Existing data cleared\n');

    // Create users
    console.log('👥 Creating users...');
    const hashedPassword = await bcrypt.hash('123456', 10);
    const createdUsers = [];

    for (const userData of sampleUsers) {
      const createdAt = new Date();
      createdAt.setDate(createdAt.getDate() - userData.daysAgo);
      
      const user = await User.create({
        ...userData,
        password: hashedPassword,
        isActive: true,
        isVerified: userData.role.includes('club_member') || userData.role.includes('manager'),
        isEmailVerified: true,
        createdAt,
        updatedAt: createdAt
      });
      
      createdUsers.push(user);
      console.log(`  ✓ Created: ${user.firstName} ${user.lastName} (${user.role.join(', ')})`);
    }
    console.log(`✅ Created ${createdUsers.length} users\n`);

    // Create applications
    console.log('📝 Creating applications...');
    const applicants = createdUsers.filter(u => u.role.includes('applicant'));
    const clubMembers = createdUsers.filter(u => u.role.includes('club_member'));
    const manager = createdUsers.find(u => u.role.includes('manager'));

    let appCount = 0;
    
    // Approved applications (for club members)
    for (const member of clubMembers) {
      const createdAt = new Date(member.createdAt);
      createdAt.setHours(createdAt.getHours() - 2);
      
      const reviewedAt = new Date(createdAt);
      reviewedAt.setDate(reviewedAt.getDate() + 1);
      
      await Application.create({
        userId: member._id,
        status: 'approved',
        personalInfo: {
          firstName: member.firstName,
          lastName: member.lastName,
          email: member.email,
          phone: member.phoneNumber,
          nationalId: `${Math.floor(Math.random() * 9000000000) + 1000000000}`,
          birthDate: new Date(2000 + Math.floor(Math.random() * 5), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
          gender: Math.random() > 0.5 ? 'male' : 'female'
        },
        educationInfo: {
          university: member.university,
          major: member.major,
          degree: 'کارشناسی',
          gpa: (Math.random() * 2 + 16).toFixed(2),
          graduationYear: 2025 + Math.floor(Math.random() * 3)
        },
        motivation: `علاقه‌مند به فعالیت در باشگاه نوآفرین و توسعه مهارت‌های فناورانه هستم.`,
        skills: ['برنامه‌نویسی', 'کار تیمی', 'حل مسئله'],
        experience: 'شرکت در چندین پروژه دانشجویی',
        reviewedBy: manager._id,
        reviewedAt,
        reviewNotes: 'متقاضی واجد شرایط است',
        createdAt,
        updatedAt: reviewedAt
      });
      appCount++;
    }

    // Pending applications
    for (let i = 0; i < 2; i++) {
      const applicant = applicants[i];
      const createdAt = new Date();
      createdAt.setDate(createdAt.getDate() - (i + 1));
      
      await Application.create({
        userId: applicant._id,
        status: 'pending',
        personalInfo: {
          firstName: applicant.firstName,
          lastName: applicant.lastName,
          email: applicant.email,
          phone: applicant.phoneNumber,
          nationalId: `${Math.floor(Math.random() * 9000000000) + 1000000000}`,
          birthDate: new Date(2000 + Math.floor(Math.random() * 5), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
          gender: Math.random() > 0.5 ? 'male' : 'female'
        },
        educationInfo: {
          university: applicant.university,
          major: applicant.major,
          degree: 'کارشناسی',
          gpa: (Math.random() * 2 + 16).toFixed(2),
          graduationYear: 2025 + Math.floor(Math.random() * 3)
        },
        motivation: `مشتاق به یادگیری و همکاری در پروژه‌های نوآورانه هستم.`,
        skills: ['خلاقیت', 'تحقیق', 'ارائه'],
        experience: 'تجربه کار در تیم‌های دانشجویی',
        createdAt,
        updatedAt: createdAt
      });
      appCount++;
    }

    // In review applications
    for (let i = 2; i < 4; i++) {
      const applicant = applicants[i];
      const createdAt = new Date();
      createdAt.setDate(createdAt.getDate() - (i + 3));
      
      await Application.create({
        userId: applicant._id,
        status: 'in_review',
        personalInfo: {
          firstName: applicant.firstName,
          lastName: applicant.lastName,
          email: applicant.email,
          phone: applicant.phoneNumber,
          nationalId: `${Math.floor(Math.random() * 9000000000) + 1000000000}`,
          birthDate: new Date(2000 + Math.floor(Math.random() * 5), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
          gender: Math.random() > 0.5 ? 'male' : 'female'
        },
        educationInfo: {
          university: applicant.university,
          major: applicant.major,
          degree: 'کارشناسی',
          gpa: (Math.random() * 2 + 16).toFixed(2),
          graduationYear: 2025 + Math.floor(Math.random() * 3)
        },
        motivation: `آماده برای مشارکت فعال در فعالیت‌های باشگاه هستم.`,
        skills: ['تحلیل', 'طراحی', 'مدیریت زمان'],
        experience: 'شرکت در کارگاه‌های آموزشی',
        createdAt,
        updatedAt: createdAt
      });
      appCount++;
    }

    // Rejected application
    if (applicants.length > 4) {
      const applicant = applicants[4];
      const createdAt = new Date();
      createdAt.setDate(createdAt.getDate() - 20);
      
      const reviewedAt = new Date(createdAt);
      reviewedAt.setDate(reviewedAt.getDate() + 2);
      
      await Application.create({
        userId: applicant._id,
        status: 'rejected',
        personalInfo: {
          firstName: applicant.firstName,
          lastName: applicant.lastName,
          email: applicant.email,
          phone: applicant.phoneNumber,
          nationalId: `${Math.floor(Math.random() * 9000000000) + 1000000000}`,
          birthDate: new Date(2000 + Math.floor(Math.random() * 5), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
          gender: Math.random() > 0.5 ? 'male' : 'female'
        },
        educationInfo: {
          university: applicant.university,
          major: applicant.major,
          degree: 'کارشناسی',
          gpa: (Math.random() * 2 + 14).toFixed(2),
          graduationYear: 2025 + Math.floor(Math.random() * 3)
        },
        motivation: `علاقه‌مند به عضویت در باشگاه`,
        skills: ['برنامه‌نویسی'],
        experience: 'بدون تجربه',
        reviewedBy: manager._id,
        reviewedAt,
        reviewNotes: 'نیاز به تکمیل مدارک',
        createdAt,
        updatedAt: reviewedAt
      });
      appCount++;
    }

    console.log(`✅ Created ${appCount} applications\n`);

    // Create activities
    console.log('🔔 Creating activities...');
    const activityTypes = [
      { type: 'application', desc: 'درخواست عضویت با موفقیت ثبت شد' },
      { type: 'status', desc: 'وضعیت درخواست به {status} تغییر کرد' },
      { type: 'document', desc: 'مدرک {docType} آپلود شد' },
      { type: 'login', desc: 'ورود به سیستم' },
      { type: 'profile', desc: 'پروفایل به‌روزرسانی شد' }
    ];

    let actCount = 0;
    for (const user of createdUsers) {
      // Application activity
      const appActivity = new Date(user.createdAt);
      appActivity.setHours(appActivity.getHours() + 1);
      
      await Activity.create({
        userId: user._id,
        type: 'application',
        description: `${user.firstName} ${user.lastName} درخواست عضویت خود را ثبت کرد`,
        metadata: { action: 'submit' },
        createdAt: appActivity
      });
      actCount++;

      // Status change activity (for approved/rejected)
      if (user.role.includes('club_member')) {
        const statusActivity = new Date(appActivity);
        statusActivity.setDate(statusActivity.getDate() + 1);
        
        await Activity.create({
          userId: user._id,
          type: 'status',
          description: `درخواست ${user.firstName} ${user.lastName} تایید شد`,
          metadata: { status: 'approved', previousStatus: 'pending' },
          createdAt: statusActivity
        });
        actCount++;
      }

      // Login activity
      const loginActivity = new Date();
      loginActivity.setHours(loginActivity.getHours() - Math.floor(Math.random() * 48));
      
      await Activity.create({
        userId: user._id,
        type: 'login',
        description: `${user.firstName} ${user.lastName} وارد سیستم شد`,
        metadata: { ip: `192.168.1.${Math.floor(Math.random() * 255)}` },
        createdAt: loginActivity
      });
      actCount++;
    }

    console.log(`✅ Created ${actCount} activities\n`);

    // Summary
    console.log('📊 Seeding Summary:');
    console.log(`  • Users: ${createdUsers.length}`);
    console.log(`  • Applications: ${appCount}`);
    console.log(`  • Activities: ${actCount}`);
    console.log('\n✅ Data seeding completed successfully!');
    
    // Show login credentials
    console.log('\n🔑 Sample Login Credentials:');
    console.log('  Email: ali.mohammadi@example.com');
    console.log('  Password: 123456');
    console.log('\n  All users have password: 123456');

  } catch (error) {
    console.error('❌ Error seeding data:', error);
    throw error;
  }
}

// Run the seed
(async () => {
  try {
    await connectDB();
    await seedData();
    process.exit(0);
  } catch (error) {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  }
})();
