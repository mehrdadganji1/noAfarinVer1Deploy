/**
 * Seed Script: Create realistic Iranian users from Zanjan
 * Run: node scripts/seedZanjaniUsers.js
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://admin:admin123@localhost:27017/noafarin?authSource=admin';

process.stdout.write('🚀 Starting seed script...\n');
process.stdout.write('📡 MongoDB URI: ' + MONGODB_URI.replace(/:[^:@]+@/, ':****@') + '\n');

// User Schema (simplified for seeding)
const UserSchema = new mongoose.Schema({
  email: String,
  password: String,
  firstName: String,
  lastName: String,
  role: [String],
  phoneNumber: String,
  phoneVerified: Boolean,
  emailVerified: Boolean,
  hasPassword: Boolean,
  university: String,
  major: String,
  studentId: String,
  bio: String,
  avatar: String,
  expertise: [String],
  educationHistory: [{
    institution: String,
    degree: String,
    major: String,
    startDate: Date,
    endDate: Date,
    current: Boolean,
    gpa: Number,
    achievements: String,
  }],
  workExperience: [{
    company: String,
    position: String,
    startDate: Date,
    endDate: Date,
    current: Boolean,
    description: String,
    location: String,
  }],
  skills: [{
    name: String,
    level: String,
    endorsements: Number,
    endorsedBy: [mongoose.Schema.Types.ObjectId],
  }],
  certifications: [{
    name: String,
    issuer: String,
    date: Date,
    expiryDate: Date,
    credentialId: String,
    url: String,
  }],
  socialLinks: {
    linkedin: String,
    github: String,
    portfolio: String,
    twitter: String,
    other: String,
  },
  profileCompletion: Number,
  membershipInfo: {
    memberId: String,
    memberSince: Date,
    membershipLevel: String,
    points: Number,
    status: String,
    lastActivityAt: Date,
  },
  memberStats: {
    eventsAttended: Number,
    projectsCompleted: Number,
    coursesCompleted: Number,
    achievementsEarned: Number,
    totalPoints: Number,
    rank: Number,
  },
  isActive: Boolean,
  isVerified: Boolean,
}, { timestamps: true });

const User = mongoose.model('User', UserSchema);

// Realistic Iranian users from Zanjan
const zanjaniUsers = [
  {
    email: 'ali.mohammadi@znu.ac.ir',
    firstName: 'علی',
    lastName: 'محمدی',
    phoneNumber: '09121234567',
    university: 'دانشگاه زنجان',
    major: 'مهندسی کامپیوتر',
    studentId: '40011234',
    bio: 'دانشجوی کارشناسی ارشد هوش مصنوعی، علاقه‌مند به یادگیری ماشین و پردازش زبان طبیعی',
    role: ['club_member'],
    expertise: ['Python', 'Machine Learning', 'TensorFlow'],
    educationHistory: [
      {
        institution: 'دانشگاه زنجان',
        degree: 'کارشناسی ارشد',
        major: 'هوش مصنوعی',
        startDate: new Date('2022-09-01'),
        current: true,
        gpa: 18.5,
        achievements: 'رتبه اول ورودی، پژوهشگر برتر دانشکده',
      },
      {
        institution: 'دانشگاه زنجان',
        degree: 'کارشناسی',
        major: 'مهندسی کامپیوتر',
        startDate: new Date('2018-09-01'),
        endDate: new Date('2022-06-30'),
        current: false,
        gpa: 17.8,
      }
    ],
    workExperience: [
      {
        company: 'شرکت فناوری اطلاعات زنجان',
        position: 'توسعه‌دهنده بک‌اند',
        startDate: new Date('2021-06-01'),
        current: true,
        description: 'توسعه API و سرویس‌های میکروسرویس با Python و FastAPI',
        location: 'زنجان',
      }
    ],
    skills: [
      { name: 'Python', level: 'expert', endorsements: 15 },
      { name: 'TensorFlow', level: 'advanced', endorsements: 8 },
      { name: 'Docker', level: 'intermediate', endorsements: 5 },
      { name: 'PostgreSQL', level: 'advanced', endorsements: 7 },
    ],
    certifications: [
      {
        name: 'TensorFlow Developer Certificate',
        issuer: 'Google',
        date: new Date('2023-03-15'),
        credentialId: 'TF-2023-12345',
      }
    ],
    socialLinks: {
      linkedin: 'https://linkedin.com/in/ali-mohammadi-zn',
      github: 'https://github.com/alimohammadi-zn',
    },
    membershipInfo: {
      memberId: 'ZN-2022-001',
      memberSince: new Date('2022-10-01'),
      membershipLevel: 'gold',
      points: 2500,
      status: 'active',
    },
    memberStats: {
      eventsAttended: 12,
      projectsCompleted: 4,
      coursesCompleted: 8,
      achievementsEarned: 6,
      totalPoints: 2500,
      rank: 3,
    },
  },
  {
    email: 'zahra.hosseini@znu.ac.ir',
    firstName: 'زهرا',
    lastName: 'حسینی',
    phoneNumber: '09352345678',
    university: 'دانشگاه زنجان',
    major: 'مهندسی نرم‌افزار',
    studentId: '40023456',
    bio: 'توسعه‌دهنده فول‌استک، عاشق React و Node.js، فعال در حوزه استارتاپ',
    role: ['club_member', 'team-leader'],
    expertise: ['React', 'Node.js', 'TypeScript', 'MongoDB'],
    educationHistory: [
      {
        institution: 'دانشگاه زنجان',
        degree: 'کارشناسی',
        major: 'مهندسی نرم‌افزار',
        startDate: new Date('2020-09-01'),
        current: true,
        gpa: 18.2,
        achievements: 'برنده مسابقه برنامه‌نویسی استانی',
      }
    ],
    workExperience: [
      {
        company: 'استارتاپ نوآوران زنجان',
        position: 'توسعه‌دهنده فرانت‌اند',
        startDate: new Date('2022-01-01'),
        current: true,
        description: 'طراحی و پیاده‌سازی رابط کاربری با React و TypeScript',
        location: 'زنجان',
      }
    ],
    skills: [
      { name: 'React', level: 'expert', endorsements: 20 },
      { name: 'TypeScript', level: 'advanced', endorsements: 12 },
      { name: 'Node.js', level: 'advanced', endorsements: 10 },
      { name: 'Tailwind CSS', level: 'expert', endorsements: 8 },
    ],
    socialLinks: {
      linkedin: 'https://linkedin.com/in/zahra-hosseini-dev',
      github: 'https://github.com/zahrahosseini',
      portfolio: 'https://zahra-dev.ir',
    },
    membershipInfo: {
      memberId: 'ZN-2022-002',
      memberSince: new Date('2022-11-15'),
      membershipLevel: 'platinum',
      points: 3800,
      status: 'active',
    },
    memberStats: {
      eventsAttended: 18,
      projectsCompleted: 7,
      coursesCompleted: 12,
      achievementsEarned: 10,
      totalPoints: 3800,
      rank: 1,
    },
  },
  {
    email: 'reza.ahmadi@gmail.com',
    firstName: 'رضا',
    lastName: 'احمدی',
    phoneNumber: '09193456789',
    university: 'دانشگاه آزاد زنجان',
    major: 'مهندسی برق',
    studentId: '99012345',
    bio: 'مهندس الکترونیک و علاقه‌مند به IoT و سیستم‌های نهفته',
    role: ['club_member'],
    expertise: ['Arduino', 'ESP32', 'C++', 'PCB Design'],
    educationHistory: [
      {
        institution: 'دانشگاه آزاد زنجان',
        degree: 'کارشناسی',
        major: 'مهندسی برق - الکترونیک',
        startDate: new Date('2019-09-01'),
        endDate: new Date('2023-06-30'),
        current: false,
        gpa: 16.5,
      }
    ],
    workExperience: [
      {
        company: 'شرکت الکترونیک پارس',
        position: 'مهندس سخت‌افزار',
        startDate: new Date('2023-07-01'),
        current: true,
        description: 'طراحی و توسعه بردهای الکترونیکی و سیستم‌های IoT',
        location: 'زنجان',
      }
    ],
    skills: [
      { name: 'Arduino', level: 'expert', endorsements: 12 },
      { name: 'ESP32', level: 'advanced', endorsements: 8 },
      { name: 'C++', level: 'advanced', endorsements: 6 },
      { name: 'Altium Designer', level: 'intermediate', endorsements: 4 },
    ],
    membershipInfo: {
      memberId: 'ZN-2023-003',
      memberSince: new Date('2023-02-01'),
      membershipLevel: 'silver',
      points: 1200,
      status: 'active',
    },
    memberStats: {
      eventsAttended: 6,
      projectsCompleted: 2,
      coursesCompleted: 4,
      achievementsEarned: 3,
      totalPoints: 1200,
      rank: 8,
    },
  },
  {
    email: 'maryam.karimi@znu.ac.ir',
    firstName: 'مریم',
    lastName: 'کریمی',
    phoneNumber: '09124567890',
    university: 'دانشگاه زنجان',
    major: 'علوم داده',
    studentId: '40034567',
    bio: 'دانشجوی دکتری علوم داده، پژوهشگر در حوزه تحلیل داده‌های بزرگ',
    role: ['club_member', 'mentor'],
    expertise: ['Data Science', 'R', 'Python', 'Spark'],
    educationHistory: [
      {
        institution: 'دانشگاه زنجان',
        degree: 'دکتری',
        major: 'علوم داده',
        startDate: new Date('2021-09-01'),
        current: true,
        gpa: 19.0,
        achievements: 'انتشار 3 مقاله ISI',
      },
      {
        institution: 'دانشگاه تهران',
        degree: 'کارشناسی ارشد',
        major: 'آمار',
        startDate: new Date('2018-09-01'),
        endDate: new Date('2021-06-30'),
        current: false,
        gpa: 18.7,
      }
    ],
    skills: [
      { name: 'Python', level: 'expert', endorsements: 25 },
      { name: 'R', level: 'expert', endorsements: 18 },
      { name: 'Apache Spark', level: 'advanced', endorsements: 10 },
      { name: 'Tableau', level: 'advanced', endorsements: 8 },
    ],
    certifications: [
      {
        name: 'IBM Data Science Professional',
        issuer: 'IBM',
        date: new Date('2022-08-20'),
        credentialId: 'IBM-DS-2022-789',
      },
      {
        name: 'AWS Certified Data Analytics',
        issuer: 'Amazon',
        date: new Date('2023-01-10'),
        credentialId: 'AWS-DA-2023-456',
      }
    ],
    socialLinks: {
      linkedin: 'https://linkedin.com/in/maryam-karimi-data',
      github: 'https://github.com/maryamkarimi',
    },
    membershipInfo: {
      memberId: 'ZN-2021-004',
      memberSince: new Date('2021-10-01'),
      membershipLevel: 'platinum',
      points: 4200,
      status: 'active',
    },
    memberStats: {
      eventsAttended: 22,
      projectsCompleted: 8,
      coursesCompleted: 15,
      achievementsEarned: 12,
      totalPoints: 4200,
      rank: 2,
    },
  },
  {
    email: 'hossein.rezaei@gmail.com',
    firstName: 'حسین',
    lastName: 'رضایی',
    phoneNumber: '09365678901',
    university: 'دانشگاه زنجان',
    major: 'مهندسی کامپیوتر',
    studentId: '40045678',
    bio: 'توسعه‌دهنده موبایل، متخصص Flutter و React Native',
    role: ['club_member'],
    expertise: ['Flutter', 'Dart', 'React Native', 'Firebase'],
    educationHistory: [
      {
        institution: 'دانشگاه زنجان',
        degree: 'کارشناسی',
        major: 'مهندسی کامپیوتر',
        startDate: new Date('2021-09-01'),
        current: true,
        gpa: 17.2,
      }
    ],
    workExperience: [
      {
        company: 'فریلنسر',
        position: 'توسعه‌دهنده موبایل',
        startDate: new Date('2022-06-01'),
        current: true,
        description: 'توسعه اپلیکیشن‌های موبایل برای کسب‌وکارهای محلی',
        location: 'زنجان',
      }
    ],
    skills: [
      { name: 'Flutter', level: 'advanced', endorsements: 10 },
      { name: 'Dart', level: 'advanced', endorsements: 8 },
      { name: 'Firebase', level: 'intermediate', endorsements: 5 },
      { name: 'UI/UX Design', level: 'intermediate', endorsements: 4 },
    ],
    socialLinks: {
      github: 'https://github.com/hosseinrezaei',
      portfolio: 'https://hossein-apps.ir',
    },
    membershipInfo: {
      memberId: 'ZN-2022-005',
      memberSince: new Date('2022-12-01'),
      membershipLevel: 'silver',
      points: 1500,
      status: 'active',
    },
    memberStats: {
      eventsAttended: 8,
      projectsCompleted: 3,
      coursesCompleted: 6,
      achievementsEarned: 4,
      totalPoints: 1500,
      rank: 6,
    },
  },

  {
    email: 'fatemeh.nazari@znu.ac.ir',
    firstName: 'فاطمه',
    lastName: 'نظری',
    phoneNumber: '09126789012',
    university: 'دانشگاه زنجان',
    major: 'طراحی صنعتی',
    studentId: '40056789',
    bio: 'طراح UI/UX، علاقه‌مند به طراحی محصول و تجربه کاربری',
    role: ['club_member'],
    expertise: ['Figma', 'Adobe XD', 'UI Design', 'User Research'],
    educationHistory: [
      {
        institution: 'دانشگاه زنجان',
        degree: 'کارشناسی',
        major: 'طراحی صنعتی',
        startDate: new Date('2020-09-01'),
        current: true,
        gpa: 18.0,
        achievements: 'برنده جایزه طراحی استانی',
      }
    ],
    skills: [
      { name: 'Figma', level: 'expert', endorsements: 18 },
      { name: 'Adobe XD', level: 'advanced', endorsements: 12 },
      { name: 'Prototyping', level: 'advanced', endorsements: 8 },
      { name: 'User Research', level: 'intermediate', endorsements: 6 },
    ],
    socialLinks: {
      linkedin: 'https://linkedin.com/in/fatemeh-nazari-design',
      portfolio: 'https://fatemeh-design.ir',
    },
    membershipInfo: {
      memberId: 'ZN-2023-006',
      memberSince: new Date('2023-01-15'),
      membershipLevel: 'gold',
      points: 2100,
      status: 'active',
    },
    memberStats: {
      eventsAttended: 10,
      projectsCompleted: 5,
      coursesCompleted: 7,
      achievementsEarned: 5,
      totalPoints: 2100,
      rank: 5,
    },
  },
  {
    email: 'mohammad.jafari@gmail.com',
    firstName: 'محمد',
    lastName: 'جعفری',
    phoneNumber: '09197890123',
    university: 'دانشگاه علوم پزشکی زنجان',
    major: 'انفورماتیک پزشکی',
    studentId: '40067890',
    bio: 'دانشجوی انفورماتیک پزشکی، علاقه‌مند به هوش مصنوعی در پزشکی',
    role: ['club_member'],
    expertise: ['Health Informatics', 'Python', 'FHIR', 'HL7'],
    educationHistory: [
      {
        institution: 'دانشگاه علوم پزشکی زنجان',
        degree: 'کارشناسی ارشد',
        major: 'انفورماتیک پزشکی',
        startDate: new Date('2022-09-01'),
        current: true,
        gpa: 17.8,
      }
    ],
    workExperience: [
      {
        company: 'بیمارستان ولیعصر زنجان',
        position: 'کارشناس IT',
        startDate: new Date('2020-03-01'),
        current: true,
        description: 'پشتیبانی سیستم‌های اطلاعات بیمارستانی',
        location: 'زنجان',
      }
    ],
    skills: [
      { name: 'Python', level: 'intermediate', endorsements: 6 },
      { name: 'SQL', level: 'advanced', endorsements: 8 },
      { name: 'FHIR', level: 'intermediate', endorsements: 4 },
      { name: 'Data Analysis', level: 'intermediate', endorsements: 5 },
    ],
    membershipInfo: {
      memberId: 'ZN-2023-007',
      memberSince: new Date('2023-03-01'),
      membershipLevel: 'bronze',
      points: 800,
      status: 'active',
    },
    memberStats: {
      eventsAttended: 4,
      projectsCompleted: 1,
      coursesCompleted: 3,
      achievementsEarned: 2,
      totalPoints: 800,
      rank: 12,
    },
  },
  {
    email: 'sara.moradi@znu.ac.ir',
    firstName: 'سارا',
    lastName: 'مرادی',
    phoneNumber: '09358901234',
    university: 'دانشگاه زنجان',
    major: 'مهندسی صنایع',
    studentId: '40078901',
    bio: 'علاقه‌مند به مدیریت پروژه و بهینه‌سازی فرآیندها',
    role: ['club_member', 'coordinator'],
    expertise: ['Project Management', 'Agile', 'Scrum', 'Jira'],
    educationHistory: [
      {
        institution: 'دانشگاه زنجان',
        degree: 'کارشناسی',
        major: 'مهندسی صنایع',
        startDate: new Date('2019-09-01'),
        endDate: new Date('2023-06-30'),
        current: false,
        gpa: 17.5,
      }
    ],
    workExperience: [
      {
        company: 'شرکت تولیدی زنجان',
        position: 'کارشناس برنامه‌ریزی',
        startDate: new Date('2023-08-01'),
        current: true,
        description: 'برنامه‌ریزی تولید و مدیریت پروژه‌های بهبود',
        location: 'زنجان',
      }
    ],
    skills: [
      { name: 'Project Management', level: 'advanced', endorsements: 10 },
      { name: 'Scrum', level: 'advanced', endorsements: 8 },
      { name: 'Jira', level: 'intermediate', endorsements: 6 },
      { name: 'Excel', level: 'expert', endorsements: 12 },
    ],
    certifications: [
      {
        name: 'Scrum Master Certified',
        issuer: 'Scrum Alliance',
        date: new Date('2023-05-20'),
        credentialId: 'SMC-2023-123',
      }
    ],
    socialLinks: {
      linkedin: 'https://linkedin.com/in/sara-moradi-pm',
    },
    membershipInfo: {
      memberId: 'ZN-2023-008',
      memberSince: new Date('2023-04-01'),
      membershipLevel: 'gold',
      points: 1900,
      status: 'active',
    },
    memberStats: {
      eventsAttended: 9,
      projectsCompleted: 4,
      coursesCompleted: 5,
      achievementsEarned: 4,
      totalPoints: 1900,
      rank: 7,
    },
  },
  {
    email: 'amir.kazemi@gmail.com',
    firstName: 'امیر',
    lastName: 'کاظمی',
    phoneNumber: '09129012345',
    university: 'دانشگاه زنجان',
    major: 'مهندسی مکانیک',
    studentId: '40089012',
    bio: 'علاقه‌مند به رباتیک و سیستم‌های خودکار',
    role: ['club_member'],
    expertise: ['Robotics', 'ROS', 'MATLAB', 'SolidWorks'],
    educationHistory: [
      {
        institution: 'دانشگاه زنجان',
        degree: 'کارشناسی ارشد',
        major: 'مهندسی مکانیک - مکاترونیک',
        startDate: new Date('2021-09-01'),
        current: true,
        gpa: 17.9,
        achievements: 'عضو تیم رباتیک دانشگاه',
      }
    ],
    skills: [
      { name: 'ROS', level: 'advanced', endorsements: 8 },
      { name: 'MATLAB', level: 'expert', endorsements: 12 },
      { name: 'SolidWorks', level: 'advanced', endorsements: 10 },
      { name: 'Python', level: 'intermediate', endorsements: 5 },
    ],
    socialLinks: {
      github: 'https://github.com/amirkazemi-robotics',
    },
    membershipInfo: {
      memberId: 'ZN-2022-009',
      memberSince: new Date('2022-09-01'),
      membershipLevel: 'silver',
      points: 1400,
      status: 'active',
    },
    memberStats: {
      eventsAttended: 7,
      projectsCompleted: 2,
      coursesCompleted: 5,
      achievementsEarned: 3,
      totalPoints: 1400,
      rank: 9,
    },
  },
  {
    email: 'narges.bahrami@znu.ac.ir',
    firstName: 'نرگس',
    lastName: 'بهرامی',
    phoneNumber: '09360123456',
    university: 'دانشگاه زنجان',
    major: 'مهندسی کامپیوتر',
    studentId: '40090123',
    bio: 'متخصص امنیت سایبری و تست نفوذ',
    role: ['club_member'],
    expertise: ['Cybersecurity', 'Penetration Testing', 'Linux', 'Network Security'],
    educationHistory: [
      {
        institution: 'دانشگاه زنجان',
        degree: 'کارشناسی',
        major: 'مهندسی کامپیوتر',
        startDate: new Date('2020-09-01'),
        current: true,
        gpa: 18.3,
        achievements: 'برنده CTF استانی',
      }
    ],
    skills: [
      { name: 'Penetration Testing', level: 'advanced', endorsements: 10 },
      { name: 'Linux', level: 'expert', endorsements: 14 },
      { name: 'Network Security', level: 'advanced', endorsements: 8 },
      { name: 'Python', level: 'advanced', endorsements: 7 },
    ],
    certifications: [
      {
        name: 'CompTIA Security+',
        issuer: 'CompTIA',
        date: new Date('2023-06-15'),
        credentialId: 'SEC-2023-456',
      }
    ],
    socialLinks: {
      linkedin: 'https://linkedin.com/in/narges-bahrami-sec',
      github: 'https://github.com/nargesbahrami',
    },
    membershipInfo: {
      memberId: 'ZN-2023-010',
      memberSince: new Date('2023-02-15'),
      membershipLevel: 'gold',
      points: 2300,
      status: 'active',
    },
    memberStats: {
      eventsAttended: 11,
      projectsCompleted: 4,
      coursesCompleted: 9,
      achievementsEarned: 6,
      totalPoints: 2300,
      rank: 4,
    },
  },
];

async function seedUsers() {
  try {
    await mongoose.connect(MONGODB_URI);
    process.stdout.write('✅ Connected to MongoDB\n');

    const hashedPassword = await bcrypt.hash('Test@123', 10);

    for (const userData of zanjaniUsers) {
      const existingUser = await User.findOne({ email: userData.email });
      
      if (existingUser) {
        process.stdout.write(`⏭️  User ${userData.email} already exists, skipping...\n`);
        continue;
      }

      const user = new User({
        ...userData,
        password: hashedPassword,
        hasPassword: true,
        phoneVerified: true,
        emailVerified: true,
        isActive: true,
        isVerified: true,
        profileCompletion: 85,
      });

      await user.save();
      process.stdout.write(`✅ Created user: ${userData.firstName} ${userData.lastName} (${userData.email})\n`);
    }

    process.stdout.write('\n🎉 Seeding completed successfully!\n');
    process.stdout.write(`📊 Total users seeded: ${zanjaniUsers.length}\n`);
    
  } catch (error) {
    process.stderr.write('❌ Error seeding users: ' + error.message + '\n');
  } finally {
    await mongoose.disconnect();
    process.stdout.write('🔌 Disconnected from MongoDB\n');
  }
}

seedUsers();
