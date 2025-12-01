const mongoose = require('mongoose');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/noafar-club';

const testApplications = [
  {
    firstName: 'علی',
    lastName: 'محمدی',
    email: 'ali.mohammadi@test.com',
    phoneNumber: '09121234567',
    nationalId: '0012345678',
    dateOfBirth: new Date('2000-01-15'),
    university: 'دانشگاه تهران',
    major: 'مهندسی کامپیوتر',
    degree: 'کارشناسی',
    studentId: '98123456',
    graduationYear: 2024,
    hasStartupIdea: true,
    startupIdea: 'پلتفرم آموزش آنلاین',
    hasTeam: false,
    technicalSkills: ['React', 'Node.js', 'MongoDB'],
    interests: ['Web Development', 'AI'],
    whyJoin: 'علاقه‌مند به یادگیری و توسعه مهارت‌های کارآفرینی هستم و می‌خواهم در یک محیط حرفه‌ای تجربه کسب کنم.',
    goals: 'هدف من راه‌اندازی یک استارتاپ موفق در حوزه فناوری و کمک به توسعه اکوسیستم نوآوری کشور است.',
    status: 'pending',
  },
  {
    firstName: 'زهرا',
    lastName: 'احمدی',
    email: 'zahra.ahmadi@test.com',
    phoneNumber: '09129876543',
    nationalId: '0087654321',
    dateOfBirth: new Date('1999-05-20'),
    university: 'دانشگاه شریف',
    major: 'مهندسی نرم‌افزار',
    degree: 'کارشناسی ارشد',
    studentId: '97234567',
    graduationYear: 2025,
    hasStartupIdea: true,
    startupIdea: 'اپلیکیشن سلامت دیجیتال',
    hasTeam: true,
    teamMembers: 'تیم 3 نفره شامل توسعه‌دهنده، طراح و بازاریاب',
    technicalSkills: ['Python', 'Django', 'Machine Learning'],
    interests: ['Healthcare Tech', 'Data Science'],
    whyJoin: 'می‌خواهم از تجربیات منتورها و شبکه ارتباطی باشگاه برای توسعه ایده استارتاپی خود استفاده کنم.',
    goals: 'ایجاد یک محصول تکنولوژی سلامت که بتواند زندگی مردم را بهبود بخشد و در بازار جهانی رقابت کند.',
    status: 'approved',
    reviewNotes: 'متقاضی بسیار با انگیزه با ایده خوب و تیم قوی',
    reviewedAt: new Date(),
  },
  {
    firstName: 'رضا',
    lastName: 'کریمی',
    email: 'reza.karimi@test.com',
    phoneNumber: '09131112233',
    nationalId: '0011223344',
    dateOfBirth: new Date('2001-03-10'),
    university: 'دانشگاه امیرکبیر',
    major: 'مهندسی برق',
    degree: 'کارشناسی',
    studentId: '99345678',
    graduationYear: 2023,
    hasStartupIdea: false,
    hasTeam: false,
    technicalSkills: ['IoT', 'Arduino', 'C++'],
    interests: ['Hardware', 'Robotics'],
    whyJoin: 'علاقه‌مند به یادگیری مهارت‌های کارآفرینی و پیدا کردن تیم برای شروع پروژه‌های نوآورانه هستم.',
    goals: 'توسعه مهارت‌های فنی و کسب‌وکار و شروع یک استارتاپ در حوزه اینترنت اشیا.',
    status: 'pending',
  },
  {
    firstName: 'فاطمه',
    lastName: 'حسینی',
    email: 'fatemeh.hosseini@test.com',
    phoneNumber: '09144445566',
    nationalId: '0055667788',
    dateOfBirth: new Date('1998-08-25'),
    university: 'دانشگاه صنعتی شریف',
    major: 'مدیریت کسب‌وکار',
    degree: 'کارشناسی ارشد',
    studentId: '96456789',
    graduationYear: 2024,
    hasStartupIdea: true,
    startupIdea: 'پلتفرم تجارت الکترونیک محلی',
    hasTeam: true,
    teamMembers: 'تیم 4 نفره با تخصص‌های مختلف',
    technicalSkills: ['Business Analysis', 'Marketing', 'Excel'],
    interests: ['E-commerce', 'Digital Marketing'],
    whyJoin: 'می‌خواهم از منابع و شبکه باشگاه برای توسعه کسب‌وکار خود بهره ببرم.',
    goals: 'راه‌اندازی یک پلتفرم تجارت الکترونیک موفق که به کسب‌وکارهای محلی کمک کند.',
    status: 'rejected',
    reviewNotes: 'ایده نیاز به بازنگری دارد، پیشنهاد می‌شود بعد از بهبود مجدد درخواست دهد',
    reviewedAt: new Date(),
  },
  {
    firstName: 'محمد',
    lastName: 'رضایی',
    email: 'mohammad.rezaei@test.com',
    phoneNumber: '09157778899',
    nationalId: '0099887766',
    dateOfBirth: new Date('2000-11-30'),
    university: 'دانشگاه علم و صنعت',
    major: 'مهندسی صنایع',
    degree: 'کارشناسی',
    studentId: '98567890',
    graduationYear: 2024,
    hasStartupIdea: true,
    startupIdea: 'سیستم مدیریت زنجیره تامین هوشمند',
    hasTeam: false,
    technicalSkills: ['Data Analysis', 'SQL', 'Python'],
    interests: ['Supply Chain', 'Optimization'],
    whyJoin: 'می‌خواهم مهارت‌های فنی و کسب‌وکار خود را توسعه دهم و با افراد هم‌فکر آشنا شوم.',
    goals: 'ایجاد یک استارتاپ در حوزه لجستیک و زنجیره تامین با استفاده از فناوری‌های نوین.',
    status: 'under-review',
    reviewNotes: 'در حال بررسی دقیق‌تر ایده و سوابق متقاضی',
  },
];

async function createTestApplications() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Define Application schema
    const ApplicationSchema = new mongoose.Schema({
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      firstName: String,
      lastName: String,
      email: String,
      phoneNumber: String,
      nationalId: String,
      dateOfBirth: Date,
      university: String,
      major: String,
      degree: String,
      studentId: String,
      graduationYear: Number,
      hasStartupIdea: Boolean,
      startupIdea: String,
      hasTeam: Boolean,
      teamMembers: String,
      technicalSkills: [String],
      interests: [String],
      whyJoin: String,
      goals: String,
      previousExperience: String,
      requestedRole: String,
      status: String,
      reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      reviewedAt: Date,
      reviewNotes: String,
      documents: [Object],
      submittedAt: Date,
    }, { timestamps: true });

    const Application = mongoose.models.Application || mongoose.model('Application', ApplicationSchema);

    // Define User schema
    const UserSchema = new mongoose.Schema({
      email: String,
      role: String,
    });
    const User = mongoose.models.User || mongoose.model('User', UserSchema);
    const users = await User.find({ role: 'applicant' }).limit(5);
    
    if (users.length === 0) {
      console.log('⚠️  No applicant users found. Creating applications without userId...');
    }

    console.log('\n📝 Creating test applications...');
    
    for (let i = 0; i < testApplications.length; i++) {
      const appData = {
        ...testApplications[i],
        userId: users[i % users.length]?._id,
        submittedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000), // Random date in last 30 days
      };

      // Check if application already exists
      const existing = await Application.findOne({ email: appData.email });
      if (existing) {
        console.log(`   ⏭️  Skipping ${appData.firstName} ${appData.lastName} (already exists)`);
        continue;
      }

      const application = new Application(appData);
      await application.save();
      console.log(`   ✅ Created: ${appData.firstName} ${appData.lastName} (${appData.status})`);
    }

    // Show stats
    const stats = await Application.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    console.log('\n📊 Application Statistics:');
    stats.forEach(stat => {
      console.log(`   ${stat._id}: ${stat.count}`);
    });

    await mongoose.disconnect();
    console.log('\n✅ Done!');
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

createTestApplications();
