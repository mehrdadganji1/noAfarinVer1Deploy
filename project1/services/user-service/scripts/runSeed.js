const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const MONGODB_URI = 'mongodb://admin:admin123@localhost:27017/noafarin?authSource=admin';

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
  educationHistory: [mongoose.Schema.Types.Mixed],
  workExperience: [mongoose.Schema.Types.Mixed],
  skills: [mongoose.Schema.Types.Mixed],
  certifications: [mongoose.Schema.Types.Mixed],
  socialLinks: mongoose.Schema.Types.Mixed,
  profileCompletion: Number,
  membershipInfo: mongoose.Schema.Types.Mixed,
  memberStats: mongoose.Schema.Types.Mixed,
  isActive: Boolean,
  isVerified: Boolean,
}, { timestamps: true });

const User = mongoose.model('User', UserSchema);

const users = [
  {
    email: 'ali.mohammadi@znu.ac.ir',
    firstName: 'علی',
    lastName: 'محمدی',
    phoneNumber: '09121234567',
    university: 'دانشگاه زنجان',
    major: 'مهندسی کامپیوتر',
    studentId: '40011234',
    bio: 'دانشجوی کارشناسی ارشد هوش مصنوعی',
    role: ['club_member'],
    expertise: ['Python', 'Machine Learning', 'TensorFlow'],
    membershipInfo: { memberId: 'ZN-2022-001', memberSince: new Date('2022-10-01'), membershipLevel: 'gold', points: 2500, status: 'active' },
    memberStats: { eventsAttended: 12, projectsCompleted: 4, coursesCompleted: 8, achievementsEarned: 6, totalPoints: 2500, rank: 3 },
  },
  {
    email: 'zahra.hosseini@znu.ac.ir',
    firstName: 'زهرا',
    lastName: 'حسینی',
    phoneNumber: '09352345678',
    university: 'دانشگاه زنجان',
    major: 'مهندسی نرم‌افزار',
    studentId: '40023456',
    bio: 'توسعه‌دهنده فول‌استک',
    role: ['club_member', 'team-leader'],
    expertise: ['React', 'Node.js', 'TypeScript'],
    membershipInfo: { memberId: 'ZN-2022-002', memberSince: new Date('2022-11-15'), membershipLevel: 'platinum', points: 3800, status: 'active' },
    memberStats: { eventsAttended: 18, projectsCompleted: 7, coursesCompleted: 12, achievementsEarned: 10, totalPoints: 3800, rank: 1 },
  },
  {
    email: 'reza.ahmadi@gmail.com',
    firstName: 'رضا',
    lastName: 'احمدی',
    phoneNumber: '09193456789',
    university: 'دانشگاه آزاد زنجان',
    major: 'مهندسی برق',
    studentId: '99012345',
    bio: 'مهندس الکترونیک و IoT',
    role: ['club_member'],
    expertise: ['Arduino', 'ESP32', 'C++'],
    membershipInfo: { memberId: 'ZN-2023-003', memberSince: new Date('2023-02-01'), membershipLevel: 'silver', points: 1200, status: 'active' },
    memberStats: { eventsAttended: 6, projectsCompleted: 2, coursesCompleted: 4, achievementsEarned: 3, totalPoints: 1200, rank: 8 },
  },
  {
    email: 'maryam.karimi@znu.ac.ir',
    firstName: 'مریم',
    lastName: 'کریمی',
    phoneNumber: '09124567890',
    university: 'دانشگاه زنجان',
    major: 'علوم داده',
    studentId: '40034567',
    bio: 'دانشجوی دکتری علوم داده',
    role: ['club_member', 'mentor'],
    expertise: ['Data Science', 'R', 'Python'],
    membershipInfo: { memberId: 'ZN-2021-004', memberSince: new Date('2021-10-01'), membershipLevel: 'platinum', points: 4200, status: 'active' },
    memberStats: { eventsAttended: 22, projectsCompleted: 8, coursesCompleted: 15, achievementsEarned: 12, totalPoints: 4200, rank: 2 },
  },
  {
    email: 'hossein.rezaei@gmail.com',
    firstName: 'حسین',
    lastName: 'رضایی',
    phoneNumber: '09365678901',
    university: 'دانشگاه زنجان',
    major: 'مهندسی کامپیوتر',
    studentId: '40045678',
    bio: 'توسعه‌دهنده موبایل',
    role: ['club_member'],
    expertise: ['Flutter', 'Dart', 'React Native'],
    membershipInfo: { memberId: 'ZN-2022-005', memberSince: new Date('2022-12-01'), membershipLevel: 'silver', points: 1500, status: 'active' },
    memberStats: { eventsAttended: 8, projectsCompleted: 3, coursesCompleted: 6, achievementsEarned: 4, totalPoints: 1500, rank: 6 },
  },
  {
    email: 'fatemeh.nazari@znu.ac.ir',
    firstName: 'فاطمه',
    lastName: 'نظری',
    phoneNumber: '09126789012',
    university: 'دانشگاه زنجان',
    major: 'طراحی صنعتی',
    studentId: '40056789',
    bio: 'طراح UI/UX',
    role: ['club_member'],
    expertise: ['Figma', 'Adobe XD', 'UI Design'],
    membershipInfo: { memberId: 'ZN-2023-006', memberSince: new Date('2023-01-15'), membershipLevel: 'gold', points: 2100, status: 'active' },
    memberStats: { eventsAttended: 10, projectsCompleted: 5, coursesCompleted: 7, achievementsEarned: 5, totalPoints: 2100, rank: 5 },
  },
  {
    email: 'mohammad.jafari@gmail.com',
    firstName: 'محمد',
    lastName: 'جعفری',
    phoneNumber: '09197890123',
    university: 'دانشگاه علوم پزشکی زنجان',
    major: 'انفورماتیک پزشکی',
    studentId: '40067890',
    bio: 'دانشجوی انفورماتیک پزشکی',
    role: ['club_member'],
    expertise: ['Health Informatics', 'Python', 'FHIR'],
    membershipInfo: { memberId: 'ZN-2023-007', memberSince: new Date('2023-03-01'), membershipLevel: 'bronze', points: 800, status: 'active' },
    memberStats: { eventsAttended: 4, projectsCompleted: 1, coursesCompleted: 3, achievementsEarned: 2, totalPoints: 800, rank: 12 },
  },
  {
    email: 'sara.moradi@znu.ac.ir',
    firstName: 'سارا',
    lastName: 'مرادی',
    phoneNumber: '09358901234',
    university: 'دانشگاه زنجان',
    major: 'مهندسی صنایع',
    studentId: '40078901',
    bio: 'علاقه‌مند به مدیریت پروژه',
    role: ['club_member', 'coordinator'],
    expertise: ['Project Management', 'Agile', 'Scrum'],
    membershipInfo: { memberId: 'ZN-2023-008', memberSince: new Date('2023-04-01'), membershipLevel: 'gold', points: 1900, status: 'active' },
    memberStats: { eventsAttended: 9, projectsCompleted: 4, coursesCompleted: 5, achievementsEarned: 4, totalPoints: 1900, rank: 7 },
  },
  {
    email: 'amir.kazemi@gmail.com',
    firstName: 'امیر',
    lastName: 'کاظمی',
    phoneNumber: '09129012345',
    university: 'دانشگاه زنجان',
    major: 'مهندسی مکانیک',
    studentId: '40089012',
    bio: 'علاقه‌مند به رباتیک',
    role: ['club_member'],
    expertise: ['Robotics', 'ROS', 'MATLAB'],
    membershipInfo: { memberId: 'ZN-2022-009', memberSince: new Date('2022-09-01'), membershipLevel: 'silver', points: 1400, status: 'active' },
    memberStats: { eventsAttended: 7, projectsCompleted: 2, coursesCompleted: 5, achievementsEarned: 3, totalPoints: 1400, rank: 9 },
  },
  {
    email: 'narges.bahrami@znu.ac.ir',
    firstName: 'نرگس',
    lastName: 'بهرامی',
    phoneNumber: '09360123456',
    university: 'دانشگاه زنجان',
    major: 'مهندسی کامپیوتر',
    studentId: '40090123',
    bio: 'متخصص امنیت سایبری',
    role: ['club_member'],
    expertise: ['Cybersecurity', 'Penetration Testing', 'Linux'],
    membershipInfo: { memberId: 'ZN-2023-010', memberSince: new Date('2023-02-15'), membershipLevel: 'gold', points: 2300, status: 'active' },
    memberStats: { eventsAttended: 11, projectsCompleted: 4, coursesCompleted: 9, achievementsEarned: 6, totalPoints: 2300, rank: 4 },
  },
];

async function seed() {
  console.log('Connecting...');
  await mongoose.connect(MONGODB_URI);
  console.log('Connected!');
  
  const hashedPassword = await bcrypt.hash('Test@123', 10);
  let created = 0;
  
  for (const userData of users) {
    const exists = await User.findOne({ email: userData.email });
    if (exists) {
      console.log('Skip:', userData.email);
      continue;
    }
    
    await User.create({
      ...userData,
      password: hashedPassword,
      hasPassword: true,
      phoneVerified: true,
      emailVerified: true,
      isActive: true,
      isVerified: true,
      profileCompletion: 85,
    });
    console.log('Created:', userData.firstName, userData.lastName);
    created++;
  }
  
  console.log('Done! Created', created, 'users');
  await mongoose.disconnect();
}

seed().catch(console.error);
