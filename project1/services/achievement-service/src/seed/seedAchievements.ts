import mongoose from 'mongoose';
import Achievement from '../models/Achievement';
import dotenv from 'dotenv';

dotenv.config();

const achievements = [
  // === BEGINNER ACHIEVEMENTS ===
  {
    title: 'Welcome Aboard',
    titleFa: 'خوش آمدید',
    description: 'Complete your first login',
    descriptionFa: 'اولین ورود خود را انجام دهید',
    icon: '👋',
    category: 'beginner',
    type: 'bronze',
    points: 10,
    requirement: {
      type: 'login_count',
      value: 1,
      description: 'اولین ورود',
    },
  },
  {
    title: 'Profile Builder',
    titleFa: 'سازنده پروفایل',
    description: 'Complete your profile 100%',
    descriptionFa: 'پروفایل خود را 100% تکمیل کنید',
    icon: '✨',
    category: 'beginner',
    type: 'silver',
    points: 50,
    requirement: {
      type: 'profile_completion',
      value: 100,
      description: 'تکمیل 100% پروفایل',
    },
  },
  {
    title: 'Avatar Master',
    titleFa: 'استاد آواتار',
    description: 'Upload your profile picture',
    descriptionFa: 'عکس پروفایل خود را آپلود کنید',
    icon: '🖼️',
    category: 'beginner',
    type: 'bronze',
    points: 15,
    requirement: {
      type: 'avatar_uploaded',
      value: 1,
      description: 'آپلود عکس پروفایل',
    },
  },
  {
    title: 'Bio Writer',
    titleFa: 'نویسنده بیو',
    description: 'Write your bio',
    descriptionFa: 'بیوگرافی خود را بنویسید',
    icon: '📝',
    category: 'beginner',
    type: 'bronze',
    points: 10,
    requirement: {
      type: 'bio_written',
      value: 1,
      description: 'نوشتن بیوگرافی',
    },
  },

  // === PROJECT ACHIEVEMENTS ===
  {
    title: 'First Project',
    titleFa: 'اولین پروژه',
    description: 'Create your first project',
    descriptionFa: 'اولین پروژه خود را ایجاد کنید',
    icon: '🚀',
    category: 'project',
    type: 'bronze',
    points: 10,
    requirement: {
      type: 'project_count',
      value: 1,
      description: 'ایجاد 1 پروژه',
    },
  },
  {
    title: 'Project Master',
    titleFa: 'استاد پروژه',
    description: 'Complete 5 projects',
    descriptionFa: '5 پروژه را تکمیل کنید',
    icon: '🏆',
    category: 'project',
    type: 'gold',
    points: 50,
    requirement: {
      type: 'project_count',
      value: 5,
      description: 'تکمیل 5 پروژه',
    },
  },
  {
    title: 'Project Legend',
    titleFa: 'افسانه پروژه',
    description: 'Complete 10 projects',
    descriptionFa: '10 پروژه را تکمیل کنید',
    icon: '👑',
    category: 'project',
    type: 'platinum',
    points: 100,
    requirement: {
      type: 'project_count',
      value: 10,
      description: 'تکمیل 10 پروژه',
    },
  },

  // Course Achievements
  {
    title: 'First Course',
    titleFa: 'اولین دوره',
    description: 'Complete your first course',
    descriptionFa: 'اولین دوره خود را تکمیل کنید',
    icon: '📚',
    category: 'course',
    type: 'bronze',
    points: 10,
    requirement: {
      type: 'course_count',
      value: 1,
      description: 'تکمیل 1 دوره',
    },
  },
  {
    title: 'Knowledge Seeker',
    titleFa: 'جویای دانش',
    description: 'Complete 3 courses',
    descriptionFa: '3 دوره را تکمیل کنید',
    icon: '🎓',
    category: 'course',
    type: 'silver',
    points: 30,
    requirement: {
      type: 'course_count',
      value: 3,
      description: 'تکمیل 3 دوره',
    },
  },
  {
    title: 'Master Learner',
    titleFa: 'استاد یادگیری',
    description: 'Complete 10 courses',
    descriptionFa: '10 دوره را تکمیل کنید',
    icon: '🌟',
    category: 'course',
    type: 'gold',
    points: 100,
    requirement: {
      type: 'course_count',
      value: 10,
      description: 'تکمیل 10 دوره',
    },
  },

  // Milestone Achievements
  {
    title: 'Milestone Achiever',
    titleFa: 'دستیاب به مایلستون',
    description: 'Complete 10 milestones',
    descriptionFa: '10 مایلستون را تکمیل کنید',
    icon: '🎯',
    category: 'milestone',
    type: 'silver',
    points: 25,
    requirement: {
      type: 'milestone_count',
      value: 10,
      description: 'تکمیل 10 مایلستون',
    },
  },
  {
    title: 'Milestone Master',
    titleFa: 'استاد مایلستون',
    description: 'Complete 50 milestones',
    descriptionFa: '50 مایلستون را تکمیل کنید',
    icon: '⭐',
    category: 'milestone',
    type: 'gold',
    points: 75,
    requirement: {
      type: 'milestone_count',
      value: 50,
      description: 'تکمیل 50 مایلستون',
    },
  },

  // Team Achievements
  {
    title: 'Team Player',
    titleFa: 'بازیکن تیمی',
    description: 'Join your first team',
    descriptionFa: 'به اولین تیم خود بپیوندید',
    icon: '👥',
    category: 'team',
    type: 'bronze',
    points: 15,
    requirement: {
      type: 'team_join',
      value: 1,
      description: 'عضویت در 1 تیم',
    },
  },
  {
    title: 'Team Leader',
    titleFa: 'رهبر تیم',
    description: 'Lead a successful team project',
    descriptionFa: 'یک پروژه تیمی موفق را رهبری کنید',
    icon: '🎖️',
    category: 'team',
    type: 'gold',
    points: 60,
    requirement: {
      type: 'team_lead',
      value: 1,
      description: 'رهبری 1 پروژه تیمی موفق',
    },
  },

  // Community Achievements
  {
    title: 'Community Member',
    titleFa: 'عضو انجمن',
    description: 'Make your first community post',
    descriptionFa: 'اولین پست خود را در انجمن منتشر کنید',
    icon: '💬',
    category: 'community',
    type: 'bronze',
    points: 5,
    requirement: {
      type: 'post_count',
      value: 1,
      description: 'انتشار 1 پست',
    },
  },
  {
    title: 'Active Contributor',
    titleFa: 'مشارکت‌کننده فعال',
    description: 'Make 50 community posts',
    descriptionFa: '50 پست در انجمن منتشر کنید',
    icon: '🌐',
    category: 'community',
    type: 'silver',
    points: 40,
    requirement: {
      type: 'post_count',
      value: 50,
      description: 'انتشار 50 پست',
    },
  },
  {
    title: 'Community Champion',
    titleFa: 'قهرمان انجمن',
    description: 'Make 200 community posts',
    descriptionFa: '200 پست در انجمن منتشر کنید',
    icon: '🏅',
    category: 'community',
    type: 'platinum',
    points: 150,
    requirement: {
      type: 'post_count',
      value: 200,
      description: 'انتشار 200 پست',
    },
  },

  // === STREAK ACHIEVEMENTS ===
  {
    title: 'Consistent',
    titleFa: 'مداوم',
    description: 'Login for 3 days in a row',
    descriptionFa: '3 روز متوالی وارد شوید',
    icon: '🔥',
    category: 'streak',
    type: 'bronze',
    points: 20,
    requirement: {
      type: 'streak_days',
      value: 3,
      description: '3 روز Streak',
    },
  },
  {
    title: 'Dedicated',
    titleFa: 'متعهد',
    description: 'Login for 7 days in a row',
    descriptionFa: '7 روز متوالی وارد شوید',
    icon: '🔥',
    category: 'streak',
    type: 'silver',
    points: 50,
    requirement: {
      type: 'streak_days',
      value: 7,
      description: '7 روز Streak',
    },
  },
  {
    title: 'Unstoppable',
    titleFa: 'توقف‌ناپذیر',
    description: 'Login for 30 days in a row',
    descriptionFa: '30 روز متوالی وارد شوید',
    icon: '🔥',
    category: 'streak',
    type: 'gold',
    points: 150,
    requirement: {
      type: 'streak_days',
      value: 30,
      description: '30 روز Streak',
    },
  },
  {
    title: 'Legend',
    titleFa: 'افسانه',
    description: 'Login for 100 days in a row',
    descriptionFa: '100 روز متوالی وارد شوید',
    icon: '🔥',
    category: 'streak',
    type: 'platinum',
    points: 500,
    requirement: {
      type: 'streak_days',
      value: 100,
      description: '100 روز Streak',
    },
  },

  // === SPEED ACHIEVEMENTS ===
  {
    title: 'Quick Starter',
    titleFa: 'شروع سریع',
    description: 'Complete a project in less than 7 days',
    descriptionFa: 'یک پروژه را در کمتر از 7 روز تکمیل کنید',
    icon: '⚡',
    category: 'speed',
    type: 'silver',
    points: 40,
    requirement: {
      type: 'project_speed',
      value: 7,
      description: 'تکمیل پروژه در کمتر از 7 روز',
    },
  },
  {
    title: 'Lightning Fast',
    titleFa: 'سریع‌تر از برق',
    description: 'Complete a project in less than 3 days',
    descriptionFa: 'یک پروژه را در کمتر از 3 روز تکمیل کنید',
    icon: '⚡',
    category: 'speed',
    type: 'gold',
    points: 80,
    requirement: {
      type: 'project_speed',
      value: 3,
      description: 'تکمیل پروژه در کمتر از 3 روز',
    },
  },
  {
    title: 'Fast Learner',
    titleFa: 'یادگیرنده سریع',
    description: 'Complete a course in one day',
    descriptionFa: 'یک دوره را در یک روز تکمیل کنید',
    icon: '🚀',
    category: 'speed',
    type: 'gold',
    points: 70,
    requirement: {
      type: 'course_speed',
      value: 1,
      description: 'تکمیل دوره در 1 روز',
    },
  },

  // === QUALITY ACHIEVEMENTS ===
  {
    title: 'Perfectionist',
    titleFa: 'کمال‌گرا',
    description: 'Complete a project with 100% quality score',
    descriptionFa: 'یک پروژه را با امتیاز کیفیت 100% تکمیل کنید',
    icon: '💎',
    category: 'quality',
    type: 'gold',
    points: 100,
    requirement: {
      type: 'project_quality',
      value: 100,
      description: 'امتیاز کیفیت 100%',
    },
  },
  {
    title: 'Detail Oriented',
    titleFa: 'دقیق',
    description: 'Complete 5 projects with 90%+ quality',
    descriptionFa: '5 پروژه را با کیفیت بالای 90% تکمیل کنید',
    icon: '🎯',
    category: 'quality',
    type: 'silver',
    points: 60,
    requirement: {
      type: 'high_quality_projects',
      value: 5,
      description: '5 پروژه با کیفیت 90%+',
    },
  },

  // === SOCIAL ACHIEVEMENTS ===
  {
    title: 'Helpful Hand',
    titleFa: 'دست یاری',
    description: 'Help 10 team members',
    descriptionFa: 'به 10 عضو تیم کمک کنید',
    icon: '🤝',
    category: 'social',
    type: 'silver',
    points: 45,
    requirement: {
      type: 'help_count',
      value: 10,
      description: 'کمک به 10 نفر',
    },
  },
  {
    title: 'Mentor',
    titleFa: 'مربی',
    description: 'Mentor 5 new members',
    descriptionFa: '5 عضو جدید را راهنمایی کنید',
    icon: '👨‍🏫',
    category: 'social',
    type: 'gold',
    points: 80,
    requirement: {
      type: 'mentor_count',
      value: 5,
      description: 'راهنمایی 5 عضو جدید',
    },
  },
  {
    title: 'Networker',
    titleFa: 'شبکه‌ساز',
    description: 'Connect with 50 members',
    descriptionFa: 'با 50 عضو ارتباط برقرار کنید',
    icon: '🌐',
    category: 'social',
    type: 'silver',
    points: 50,
    requirement: {
      type: 'connection_count',
      value: 50,
      description: 'ارتباط با 50 عضو',
    },
  },

  // === SPECIAL ACHIEVEMENTS ===
  {
    title: 'Early Adopter',
    titleFa: 'پذیرنده اولیه',
    description: 'Join in the first month',
    descriptionFa: 'در ماه اول عضو شوید',
    icon: '🌟',
    category: 'special',
    type: 'platinum',
    points: 200,
    requirement: {
      type: 'early_adopter',
      value: 1,
      description: 'عضویت در ماه اول',
    },
  },
  {
    title: 'Bug Hunter',
    titleFa: 'شکارچی باگ',
    description: 'Report 5 bugs',
    descriptionFa: '5 باگ گزارش دهید',
    icon: '🐛',
    category: 'special',
    type: 'gold',
    points: 100,
    requirement: {
      type: 'bug_report',
      value: 5,
      description: 'گزارش 5 باگ',
    },
  },
  {
    title: 'Feature Suggester',
    titleFa: 'پیشنهاددهنده ویژگی',
    description: 'Suggest 10 features',
    descriptionFa: '10 ویژگی پیشنهاد دهید',
    icon: '💡',
    category: 'special',
    type: 'silver',
    points: 60,
    requirement: {
      type: 'feature_suggestion',
      value: 10,
      description: 'پیشنهاد 10 ویژگی',
    },
  },
  {
    title: 'Beta Tester',
    titleFa: 'تستر بتا',
    description: 'Test 5 beta features',
    descriptionFa: '5 ویژگی بتا را تست کنید',
    icon: '🧪',
    category: 'special',
    type: 'gold',
    points: 90,
    requirement: {
      type: 'beta_test',
      value: 5,
      description: 'تست 5 ویژگی بتا',
    },
  },

  // === EVENT ACHIEVEMENTS ===
  {
    title: 'Event Participant',
    titleFa: 'شرکت‌کننده رویداد',
    description: 'Attend your first event',
    descriptionFa: 'در اولین رویداد شرکت کنید',
    icon: '🎪',
    category: 'event',
    type: 'bronze',
    points: 20,
    requirement: {
      type: 'event_attend',
      value: 1,
      description: 'شرکت در 1 رویداد',
    },
  },
  {
    title: 'Event Enthusiast',
    titleFa: 'علاقه‌مند رویداد',
    description: 'Attend 10 events',
    descriptionFa: 'در 10 رویداد شرکت کنید',
    icon: '🎉',
    category: 'event',
    type: 'silver',
    points: 60,
    requirement: {
      type: 'event_attend',
      value: 10,
      description: 'شرکت در 10 رویداد',
    },
  },
  {
    title: 'Event Organizer',
    titleFa: 'برگزارکننده رویداد',
    description: 'Organize your first event',
    descriptionFa: 'اولین رویداد خود را برگزار کنید',
    icon: '🎭',
    category: 'event',
    type: 'gold',
    points: 100,
    requirement: {
      type: 'event_organize',
      value: 1,
      description: 'برگزاری 1 رویداد',
    },
  },

  // === SKILL ACHIEVEMENTS ===
  {
    title: 'Skill Collector',
    titleFa: 'جمع‌آوری مهارت',
    description: 'Add 5 skills to your profile',
    descriptionFa: '5 مهارت به پروفایل خود اضافه کنید',
    icon: '🎨',
    category: 'skill',
    type: 'bronze',
    points: 25,
    requirement: {
      type: 'skill_count',
      value: 5,
      description: 'اضافه کردن 5 مهارت',
    },
  },
  {
    title: 'Multi-Talented',
    titleFa: 'چندمهارته',
    description: 'Add 15 skills to your profile',
    descriptionFa: '15 مهارت به پروفایل خود اضافه کنید',
    icon: '🌈',
    category: 'skill',
    type: 'silver',
    points: 50,
    requirement: {
      type: 'skill_count',
      value: 15,
      description: 'اضافه کردن 15 مهارت',
    },
  },
  {
    title: 'Jack of All Trades',
    titleFa: 'استاد همه کاره',
    description: 'Master 10 different skills',
    descriptionFa: '10 مهارت مختلف را تسلط یابید',
    icon: '👑',
    category: 'skill',
    type: 'platinum',
    points: 200,
    requirement: {
      type: 'skill_mastery',
      value: 10,
      description: 'تسلط بر 10 مهارت',
    },
  },
];

async function seedAchievements() {
  try {
    const MONGODB_URI =
      process.env.MONGODB_URI || 'mongodb://localhost:27017/noafarin-achievements';

    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Insert new achievements (skip if already exists)
    for (const achievement of achievements) {
      const exists = await Achievement.findOne({ 
        title: achievement.title,
        category: achievement.category 
      });
      
      if (!exists) {
        await Achievement.create(achievement);
        console.log(`✅ Created: ${achievement.titleFa}`);
      } else {
        console.log(`⏭️  Skipped (exists): ${achievement.titleFa}`);
      }
    }

    console.log(`\n✅ Seeding completed! Total achievements: ${achievements.length}`);

    await mongoose.disconnect();
    console.log('👋 Disconnected from MongoDB');
  } catch (error) {
    console.error('❌ Error seeding achievements:', error);
    process.exit(1);
  }
}

seedAchievements();
