import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Challenge, { ChallengeType, ChallengeCategory, ChallengeDifficulty } from '../models/Challenge';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/noafarin-xp';

// Challenge templates for daily generation
const challengeTemplates = [
  // Easy Challenges
  {
    title: 'ورود روزانه',
    description: 'امروز وارد سیستم شو',
    category: ChallengeCategory.GENERAL,
    difficulty: ChallengeDifficulty.EASY,
    requirements: {
      action: 'daily_login',
      count: 1,
    },
    rewards: {
      xp: 20,
    },
  },
  {
    title: 'حضور در یک رویداد',
    description: 'در یک رویداد شرکت کن',
    category: ChallengeCategory.EVENTS,
    difficulty: ChallengeDifficulty.EASY,
    requirements: {
      action: 'attend_event',
      count: 1,
    },
    rewards: {
      xp: 50,
    },
  },
  {
    title: 'تکمیل یک درس',
    description: 'یک درس آموزشی را تکمیل کن',
    category: ChallengeCategory.COURSES,
    difficulty: ChallengeDifficulty.EASY,
    requirements: {
      action: 'complete_lesson',
      count: 1,
    },
    rewards: {
      xp: 30,
    },
  },

  // Medium Challenges
  {
    title: 'ایجاد یک پروژه',
    description: 'یک پروژه جدید ایجاد کن',
    category: ChallengeCategory.PROJECTS,
    difficulty: ChallengeDifficulty.MEDIUM,
    requirements: {
      action: 'create_project',
      count: 1,
    },
    rewards: {
      xp: 100,
    },
  },
  {
    title: 'تکمیل 2 milestone',
    description: '2 milestone از پروژه‌هایت را تکمیل کن',
    category: ChallengeCategory.PROJECTS,
    difficulty: ChallengeDifficulty.MEDIUM,
    requirements: {
      action: 'complete_milestone',
      count: 2,
    },
    rewards: {
      xp: 100,
    },
  },
  {
    title: 'به‌روزرسانی پروفایل',
    description: 'پروفایل خود را کامل کن',
    category: ChallengeCategory.PROFILE,
    difficulty: ChallengeDifficulty.MEDIUM,
    requirements: {
      action: 'update_profile',
      count: 1,
    },
    rewards: {
      xp: 50,
    },
  },

  // Hard Challenges
  {
    title: 'تکمیل یک پروژه',
    description: 'یک پروژه را به اتمام برسان',
    category: ChallengeCategory.PROJECTS,
    difficulty: ChallengeDifficulty.HARD,
    requirements: {
      action: 'complete_project',
      count: 1,
    },
    rewards: {
      xp: 200,
    },
  },
  {
    title: 'تکمیل یک دوره',
    description: 'یک دوره آموزشی کامل را به پایان برسان',
    category: ChallengeCategory.COURSES,
    difficulty: ChallengeDifficulty.HARD,
    requirements: {
      action: 'complete_course',
      count: 1,
    },
    rewards: {
      xp: 200,
    },
  },
  {
    title: 'شرکت در 3 رویداد',
    description: 'در 3 رویداد مختلف شرکت کن',
    category: ChallengeCategory.EVENTS,
    difficulty: ChallengeDifficulty.HARD,
    requirements: {
      action: 'attend_event',
      count: 3,
    },
    rewards: {
      xp: 150,
    },
  },
];

async function seedDailyChallenges() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Check if challenges already exist
    const existingCount = await Challenge.countDocuments();
    if (existingCount > 0) {
      console.log(`ℹ️  ${existingCount} challenges already exist. Skipping seed.`);
      console.log('💡 To re-seed, manually delete challenges from MongoDB first.');
      process.exit(0);
    }

    // Create today's challenges (3 random challenges: 1 easy, 1 medium, 1 hard)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const easyChallenges = challengeTemplates.filter(c => c.difficulty === ChallengeDifficulty.EASY);
    const mediumChallenges = challengeTemplates.filter(c => c.difficulty === ChallengeDifficulty.MEDIUM);
    const hardChallenges = challengeTemplates.filter(c => c.difficulty === ChallengeDifficulty.HARD);

    const selectedChallenges = [
      easyChallenges[Math.floor(Math.random() * easyChallenges.length)],
      mediumChallenges[Math.floor(Math.random() * mediumChallenges.length)],
      hardChallenges[Math.floor(Math.random() * hardChallenges.length)],
    ];

    const challenges = selectedChallenges.map(template => ({
      ...template,
      type: ChallengeType.DAILY,
      startDate: today,
      endDate: tomorrow,
      isActive: true,
      currentCompletions: 0,
    }));

    await Challenge.insertMany(challenges);
    console.log(`✅ Created ${challenges.length} daily challenges`);

    // Display created challenges
    challenges.forEach((challenge, index) => {
      console.log(`\n${index + 1}. ${challenge.title}`);
      console.log(`   Difficulty: ${challenge.difficulty}`);
      console.log(`   Category: ${challenge.category}`);
      console.log(`   XP Reward: ${challenge.rewards.xp}`);
      console.log(`   Action: ${challenge.requirements.action} (${challenge.requirements.count}x)`);
    });

    console.log('\n✅ Seed completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding challenges:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  seedDailyChallenges();
}

export default seedDailyChallenges;
