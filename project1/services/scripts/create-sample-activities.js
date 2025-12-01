const axios = require('axios');

const API_URL = 'http://localhost:3001/api';
const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5MTU4ZjRhZDA3Y2M5MGVmMzcyNTY5ZCIsImVtYWlsIjoidGVzdEBub2FmYXJpbi5jb20iLCJyb2xlIjpbImFwcGxpY2FudCJdLCJpYXQiOjE3NjMwMjA2MTgsImV4cCI6MTc2MzYyNTQxOH0.bI7R8y_FbBYjFFPEU4tsSC1qGU_VihUkdXzwQe9UEdM';

const sampleActivities = [
  {
    type: 'project_completed',
    title: 'پروژه سیستم مدیریت آموزش تکمیل شد',
    description: 'پروژه سیستم جامع مدیریت آموزش برای باشگاه نوآفرینان با موفقیت به پایان رسید.',
    content: 'این پروژه شامل پنل مدیریت، ثبت‌نام دوره‌ها، و سیستم ارزیابی است.',
    visibility: 'public',
    metadata: {
      projectName: 'سیستم مدیریت آموزش',
      duration: '3 ماه'
    }
  },
  {
    type: 'achievement_earned',
    title: 'دستاورد برنامه‌نویس برتر دریافت شد',
    description: 'به دلیل مشارکت فعال در پروژه‌های متن‌باز، نشان برنامه‌نویس برتر کسب شد.',
    visibility: 'public',
    metadata: {
      achievementType: 'programming',
      points: 500
    }
  },
  {
    type: 'event_attended',
    title: 'شرکت در کارگاه طراحی رابط کاربری',
    description: 'در کارگاه جامع طراحی رابط کاربری و تجربه کاربری شرکت کردم.',
    visibility: 'public',
    metadata: {
      eventName: 'UI/UX Workshop',
      duration: '4 ساعت'
    }
  },
  {
    type: 'course_completed',
    title: 'دوره پیشرفته React و TypeScript',
    description: 'دوره جامع React و TypeScript را با نمره عالی به پایان رساندم.',
    visibility: 'public',
    metadata: {
      courseName: 'Advanced React & TypeScript',
      score: 95
    }
  },
  {
    type: 'skill_added',
    title: 'مهارت Node.js افزوده شد',
    description: 'مهارت توسعه بک‌اند با Node.js و Express به پروفایل اضافه شد.',
    visibility: 'connections',
    metadata: {
      skillName: 'Node.js',
      level: 'intermediate'
    }
  },
  {
    type: 'post_created',
    title: 'نکات کاربردی در بهینه‌سازی React',
    description: 'چند نکته مهم برای بهینه‌سازی عملکرد اپلیکیشن‌های React را به اشتراک گذاشتم.',
    content: `در این پست به بررسی تکنیک‌های مهم بهینه‌سازی React می‌پردازم:

1. استفاده از React.memo برای جلوگیری از رندرهای غیرضروری
2. به‌کارگیری useMemo و useCallback
3. Code Splitting با React.lazy
4. بهینه‌سازی bundle size

این تکنیک‌ها می‌توانند عملکرد اپلیکیشن را تا 50٪ بهبود دهند.`,
    visibility: 'public',
    metadata: {
      topic: 'React Performance',
      readTime: '5 دقیقه'
    }
  }
];

async function createActivities() {
  console.log('🎨 Creating sample activities...\n');
  
  let successCount = 0;
  let errorCount = 0;

  for (const activity of sampleActivities) {
    try {
      const response = await axios.post(
        `${API_URL}/community/activities`,
        activity,
        {
          headers: {
            'Authorization': `Bearer ${TOKEN}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log(`✅ Created: ${activity.title}`);
      successCount++;
    } catch (error) {
      console.error(`❌ Error creating "${activity.title}":`, error.response?.data || error.message);
      errorCount++;
    }
  }

  console.log(`\n📊 Summary:`);
  console.log(`   ✅ Success: ${successCount}`);
  console.log(`   ❌ Errors: ${errorCount}`);
  
  if (successCount > 0) {
    console.log('\n🎉 Sample activities created successfully!');
    console.log('💡 Now you can view them in the Community page at:');
    console.log('   http://localhost:5173/club-member/community');
  }
}

createActivities().catch(console.error);
