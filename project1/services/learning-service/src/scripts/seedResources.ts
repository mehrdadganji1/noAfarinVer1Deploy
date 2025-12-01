import mongoose from 'mongoose';
import Resource from '../models/Resource';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/learning_db?authSource=admin';

const resources = [
  {
    id: 'team-over-idea',
    title: 'چرا تیم مهم‌تر از ایده است؟',
    description: 'آمار تکان‌دهنده و داستان‌های واقعی از موفقیت و شکست استارتاپ‌ها',
    category: 'foundation',
    readTime: '15 دقیقه',
    difficulty: 'beginner',
    order: 1,
    tags: ['تیم‌سازی', 'مبانی', 'استارتاپ'],
    nextResourceId: '3h-model',
    metadata: {
      estimatedMinutes: 15,
      sections: 5,
      exercises: 2,
      quizzes: 1
    }
  },
  {
    id: '3h-model',
    title: 'مدل 3H: قلب تیم استارتاپ',
    description: 'شناخت کامل سه نقش کلیدی: Hacker، Hustler و Hipster',
    category: 'foundation',
    readTime: '20 دقیقه',
    difficulty: 'beginner',
    order: 2,
    tags: ['مدل 3H', 'نقش‌ها', 'تیم‌سازی'],
    prevResourceId: 'team-over-idea',
    nextResourceId: 'hacker-role',
    relatedResources: ['hacker-role', 'hustler-role', 'hipster-role'],
    metadata: {
      estimatedMinutes: 20,
      sections: 6,
      exercises: 3,
      quizzes: 1
    }
  },
  {
    id: 'hacker-role',
    title: 'نقش Hacker (CTO): مغز فنی استارتاپ',
    description: 'مسئولیت‌ها، مهارت‌ها و چالش‌های یک CTO موفق',
    category: 'hacker',
    readTime: '30 دقیقه',
    difficulty: 'intermediate',
    order: 3,
    tags: ['CTO', 'فنی', 'برنامه‌نویسی'],
    prevResourceId: '3h-model',
    nextResourceId: 'hustler-role',
    relatedResources: ['3h-model', 'hustler-role'],
    metadata: {
      estimatedMinutes: 30,
      sections: 8,
      exercises: 5,
      quizzes: 2
    }
  },
  {
    id: 'hustler-role',
    title: 'نقش Hustler (CEO): قلب کسب و کار',
    description: 'فروش، بازاریابی، جذب سرمایه و رهبری تیم',
    category: 'hustler',
    readTime: '30 دقیقه',
    difficulty: 'intermediate',
    order: 4,
    tags: ['CEO', 'فروش', 'بازاریابی', 'رهبری'],
    prevResourceId: 'hacker-role',
    nextResourceId: 'hipster-role',
    relatedResources: ['3h-model', 'hipster-role'],
    metadata: {
      estimatedMinutes: 30,
      sections: 8,
      exercises: 5,
      quizzes: 2
    }
  },
  {
    id: 'hipster-role',
    title: 'نقش Hipster (CPO): روح محصول',
    description: 'طراحی UX/UI، تحقیق کاربر و برندسازی',
    category: 'hipster',
    readTime: '25 دقیقه',
    difficulty: 'intermediate',
    order: 5,
    tags: ['CPO', 'طراحی', 'UX/UI', 'برند'],
    prevResourceId: 'hustler-role',
    relatedResources: ['3h-model', 'hacker-role'],
    metadata: {
      estimatedMinutes: 25,
      sections: 7,
      exercises: 4,
      quizzes: 2
    }
  }
];

async function seedResources() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing resources
    await Resource.deleteMany({});
    console.log('🗑️  Cleared existing resources');

    // Read content from markdown files
    const contentPath = path.join(__dirname, '../../../../team_building_content');
    
    for (const resource of resources) {
      let content = '';
      const fileMap: Record<string, string> = {
        'team-over-idea': '01_Team_Over_Idea.md',
        '3h-model': '02_3H_Model.md',
        'hacker-role': '03_Hacker_Role.md',
        'hustler-role': '04_Hustler_Role.md',
        'hipster-role': '05_Hipster_Role.md'
      };

      const fileName = fileMap[resource.id];
      const filePath = path.join(contentPath, fileName);

      try {
        content = fs.readFileSync(filePath, 'utf-8');
      } catch (error) {
        console.warn(`⚠️  Could not read file ${fileName}, using placeholder`);
        content = `# ${resource.title}\n\nمحتوای این منبع در حال آماده‌سازی است...`;
      }

      await Resource.create({
        ...resource,
        content
      });

      console.log(`✅ Created resource: ${resource.title}`);
    }

    console.log('🎉 Successfully seeded all resources!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding resources:', error);
    process.exit(1);
  }
}

seedResources();
