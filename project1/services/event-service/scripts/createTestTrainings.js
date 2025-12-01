const mongoose = require('mongoose');
require('dotenv').config();

const trainingSchema = new mongoose.Schema({
  title: String,
  description: String,
  type: String,
  level: String,
  instructor: String,
  startDate: Date,
  endDate: Date,
  duration: Number,
  status: String,
  capacity: Number,
  participants: [String],
  location: String,
  isOnline: Boolean,
  materials: [String],
  prerequisites: [String],
  rating: Number,
  reviews: Number,
  price: Number,
  certificate: Boolean
});

const Training = mongoose.model('Training', trainingSchema);

const testTrainings = [
  {
    title: 'React Advanced Patterns',
    description: 'آموزش پیشرفته الگوهای طراحی در React شامل Hooks، Context API و Performance Optimization',
    type: 'technical',
    level: 'advanced',
    instructor: 'علی احمدی',
    startDate: new Date('2024-12-01'),
    endDate: new Date('2024-12-15'),
    duration: 40,
    status: 'upcoming',
    capacity: 25,
    participants: [],
    location: 'تهران - سالن کنفرانس',
    isOnline: true,
    materials: ['اسلایدها', 'کدهای نمونه', 'ویدیوهای ضبط شده'],
    prerequisites: ['JavaScript ES6+', 'React Basics'],
    rating: 4.8,
    reviews: 45,
    price: 2500000,
    certificate: true
  },
  {
    title: 'Leadership & Team Management',
    description: 'دوره جامع مدیریت تیم و رهبری برای مدیران میانی و ارشد',
    type: 'soft-skills',
    level: 'intermediate',
    instructor: 'دکتر سارا محمدی',
    startDate: new Date('2024-11-28'),
    endDate: new Date('2024-11-30'),
    duration: 16,
    status: 'active',
    capacity: 30,
    participants: ['user1', 'user2', 'user3', 'user4', 'user5'],
    location: 'آنلاین',
    isOnline: true,
    materials: ['کتاب الکترونیک', 'Case Studies', 'Templates'],
    prerequisites: [],
    rating: 4.9,
    reviews: 67,
    price: 1800000,
    certificate: true
  },
  {
    title: 'Python for Data Science',
    description: 'آموزش کاربردی Python برای تحلیل داده و یادگیری ماشین',
    type: 'technical',
    level: 'beginner',
    instructor: 'محمد رضایی',
    startDate: new Date('2024-12-10'),
    endDate: new Date('2025-01-10'),
    duration: 60,
    status: 'upcoming',
    capacity: 40,
    participants: [],
    location: 'آنلاین',
    isOnline: true,
    materials: ['Jupyter Notebooks', 'Datasets', 'Video Tutorials'],
    prerequisites: ['برنامه‌نویسی پایه'],
    rating: 4.7,
    reviews: 89,
    price: 3200000,
    certificate: true
  },
  {
    title: 'Agile & Scrum Fundamentals',
    description: 'اصول و مبانی Agile و Scrum برای تیم‌های نرم‌افزاری',
    type: 'management',
    level: 'beginner',
    instructor: 'رضا کریمی',
    startDate: new Date('2024-11-20'),
    endDate: new Date('2024-11-22'),
    duration: 12,
    status: 'completed',
    capacity: 35,
    participants: ['user1', 'user2', 'user3', 'user4', 'user5', 'user6', 'user7', 'user8'],
    location: 'تهران - دفتر مرکزی',
    isOnline: false,
    materials: ['Scrum Guide', 'Templates', 'Checklists'],
    prerequisites: [],
    rating: 4.6,
    reviews: 52,
    price: 1500000,
    certificate: true
  },
  {
    title: 'UI/UX Design Masterclass',
    description: 'دوره جامع طراحی رابط کاربری و تجربه کاربری',
    type: 'design',
    level: 'intermediate',
    instructor: 'نگار حسینی',
    startDate: new Date('2024-12-05'),
    endDate: new Date('2024-12-20'),
    duration: 45,
    status: 'upcoming',
    capacity: 20,
    participants: [],
    location: 'آنلاین',
    isOnline: true,
    materials: ['Figma Files', 'Design Systems', 'Case Studies'],
    prerequisites: ['آشنایی با Figma'],
    rating: 4.9,
    reviews: 78,
    price: 2800000,
    certificate: true
  },
  {
    title: 'DevOps & CI/CD Pipeline',
    description: 'آموزش عملی DevOps و پیاده‌سازی CI/CD',
    type: 'technical',
    level: 'advanced',
    instructor: 'امیر صادقی',
    startDate: new Date('2024-11-25'),
    endDate: new Date('2024-12-08'),
    duration: 35,
    status: 'active',
    capacity: 15,
    participants: ['user1', 'user2', 'user3'],
    location: 'آنلاین',
    isOnline: true,
    materials: ['Docker Images', 'Scripts', 'Configuration Files'],
    prerequisites: ['Linux', 'Git', 'Docker Basics'],
    rating: 4.8,
    reviews: 34,
    price: 3500000,
    certificate: true
  },
  {
    title: 'Public Speaking & Presentation',
    description: 'مهارت‌های سخنرانی و ارائه موثر',
    type: 'soft-skills',
    level: 'beginner',
    instructor: 'مهدی نوری',
    startDate: new Date('2024-12-15'),
    endDate: new Date('2024-12-17'),
    duration: 10,
    status: 'upcoming',
    capacity: 25,
    participants: [],
    location: 'تهران - سالن همایش',
    isOnline: false,
    materials: ['Presentation Templates', 'Speech Guidelines'],
    prerequisites: [],
    rating: 4.5,
    reviews: 41,
    price: 1200000,
    certificate: false
  },
  {
    title: 'Blockchain Development',
    description: 'توسعه اپلیکیشن‌های غیرمتمرکز با Ethereum و Solidity',
    type: 'technical',
    level: 'advanced',
    instructor: 'حسین موسوی',
    startDate: new Date('2024-10-15'),
    endDate: new Date('2024-11-15'),
    duration: 50,
    status: 'completed',
    capacity: 12,
    participants: ['user1', 'user2', 'user3', 'user4', 'user5', 'user6'],
    location: 'آنلاین',
    isOnline: true,
    materials: ['Smart Contracts', 'DApp Examples', 'Testing Tools'],
    prerequisites: ['JavaScript', 'Web3 Basics'],
    rating: 4.7,
    reviews: 28,
    price: 4000000,
    certificate: true
  }
];

async function createTestTrainings() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    await Training.deleteMany({});
    console.log('🗑️  Cleared existing trainings');

    const created = await Training.insertMany(testTrainings);
    console.log(`✅ Created ${created.length} test trainings`);

    console.log('\n📊 Training Stats:');
    console.log(`   Total: ${created.length}`);
    console.log(`   Active: ${created.filter(t => t.status === 'active').length}`);
    console.log(`   Upcoming: ${created.filter(t => t.status === 'upcoming').length}`);
    console.log(`   Completed: ${created.filter(t => t.status === 'completed').length}`);

    await mongoose.connection.close();
    console.log('\n✅ Done!');
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

createTestTrainings();
