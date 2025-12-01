const mongoose = require('mongoose');
require('dotenv').config();

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  type: { type: String, enum: ['workshop', 'seminar', 'competition', 'social', 'training'], required: true },
  status: { type: String, enum: ['upcoming', 'ongoing', 'completed', 'cancelled'], default: 'upcoming' },
  date: { type: Date, required: true },
  endDate: Date,
  location: { type: String, required: true },
  capacity: { type: Number, required: true },
  registered: { type: Number, default: 0 },
  registeredParticipants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  attendees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  organizers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  image: String,
  tags: [String],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

const Event = mongoose.model('Event', eventSchema);

const testEvents = [
  {
    title: 'کارگاه React و TypeScript',
    description: 'یک کارگاه جامع برای یادگیری React و TypeScript از صفر تا صد. در این کارگاه با مفاهیم پایه و پیشرفته آشنا خواهید شد.',
    type: 'workshop',
    status: 'upcoming',
    date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    location: 'سالن کنفرانس A',
    capacity: 50,
    registered: 35,
    tags: ['React', 'TypeScript', 'Frontend'],
  },
  {
    title: 'سمینار هوش مصنوعی',
    description: 'سمینار تخصصی در مورد آخرین پیشرفت‌های هوش مصنوعی و یادگیری ماشین. سخنرانان برجسته حوزه AI حضور خواهند داشت.',
    type: 'seminar',
    status: 'upcoming',
    date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
    location: 'آمفی‌تئاتر مرکزی',
    capacity: 200,
    registered: 150,
    tags: ['AI', 'Machine Learning', 'Deep Learning'],
  },
  {
    title: 'مسابقه برنامه‌نویسی',
    description: 'مسابقه برنامه‌نویسی تیمی با جوایز ارزشمند. تیم‌ها باید در 24 ساعت یک پروژه کامل را پیاده‌سازی کنند.',
    type: 'competition',
    status: 'ongoing',
    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    endDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1 day from now
    location: 'آزمایشگاه کامپیوتر 1',
    capacity: 100,
    registered: 80,
    tags: ['Programming', 'Competition', 'Hackathon'],
  },
  {
    title: 'دورهمی اعضای باشگاه',
    description: 'یک دورهمی دوستانه برای آشنایی بیشتر اعضای باشگاه با یکدیگر. شامل بازی، غذا و فعالیت‌های تفریحی.',
    type: 'social',
    status: 'upcoming',
    date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
    location: 'باغ دانشگاه',
    capacity: 80,
    registered: 65,
    tags: ['Social', 'Networking', 'Fun'],
  },
  {
    title: 'دوره آموزشی Git و GitHub',
    description: 'دوره کامل آموزش Git و GitHub برای مبتدیان. یاد بگیرید چگونه پروژه‌های خود را مدیریت کنید.',
    type: 'training',
    status: 'upcoming',
    date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
    location: 'کلاس 201',
    capacity: 40,
    registered: 38,
    tags: ['Git', 'GitHub', 'Version Control'],
  },
  {
    title: 'کارگاه طراحی UI/UX',
    description: 'کارگاه عملی طراحی رابط کاربری و تجربه کاربری. با ابزارهای Figma و Adobe XD آشنا شوید.',
    type: 'workshop',
    status: 'completed',
    date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
    location: 'استودیو طراحی',
    capacity: 30,
    registered: 30,
    tags: ['UI', 'UX', 'Design', 'Figma'],
  },
  {
    title: 'سمینار امنیت سایبری',
    description: 'سمینار تخصصی امنیت سایبری و روش‌های محافظت از داده‌ها. با تهدیدات رایج و راه‌حل‌ها آشنا شوید.',
    type: 'seminar',
    status: 'upcoming',
    date: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000), // 21 days from now
    location: 'سالن همایش',
    capacity: 150,
    registered: 95,
    tags: ['Security', 'Cybersecurity', 'Hacking'],
  },
  {
    title: 'مسابقه طراحی وب',
    description: 'مسابقه طراحی وب با موضوع آزاد. بهترین طراحی‌ها جوایز نقدی دریافت خواهند کرد.',
    type: 'competition',
    status: 'upcoming',
    date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    location: 'آنلاین',
    capacity: 200,
    registered: 120,
    tags: ['Web Design', 'Competition', 'CSS'],
  },
];

async function createTestEvents() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing events
    await Event.deleteMany({});
    console.log('🗑️  Cleared existing events');

    // Create test events
    const createdEvents = await Event.insertMany(testEvents);
    console.log(`✅ Created ${createdEvents.length} test events`);

    console.log('\n📋 Created Events:');
    createdEvents.forEach((event, index) => {
      console.log(`${index + 1}. ${event.title} (${event.type}) - ${event.status}`);
      console.log(`   📅 ${event.date.toLocaleDateString('fa-IR')}`);
      console.log(`   👥 ${event.registered}/${event.capacity} registered`);
      console.log(`   🆔 ID: ${event._id}\n`);
    });

    await mongoose.connection.close();
    console.log('✅ Done!');
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

createTestEvents();
