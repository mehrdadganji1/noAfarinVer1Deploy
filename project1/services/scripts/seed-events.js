// Seed script to create sample events in MongoDB
const mongoose = require('mongoose');
require('dotenv').config();

const EventSchema = new mongoose.Schema({
  title: String,
  description: String,
  type: String,
  status: String,
  date: Date,
  time: String,
  duration: Number,
  location: String,
  capacity: Number,
  registered: { type: Number, default: 0 },
  registeredParticipants: [mongoose.Schema.Types.ObjectId],
  attendees: [mongoose.Schema.Types.ObjectId],
  organizer: String,
  organizers: [mongoose.Schema.Types.ObjectId],
  createdBy: mongoose.Schema.Types.ObjectId,
  thumbnail: String,
  tags: [String],
}, { timestamps: true });

const Event = mongoose.model('Event', EventSchema);

const sampleEvents = [
  {
    title: 'کارگاه راه‌اندازی استارتاپ',
    description: 'آموزش گام به گام راه‌اندازی استارتاپ از ایده تا اجرا',
    type: 'workshop',
    status: 'upcoming',
    date: new Date('2025-01-15'),
    time: '14:00',
    duration: 3,
    location: 'سالن کنفرانس دانشگاه تهران',
    capacity: 50,
    registered: 0,
    registeredParticipants: [],
    attendees: [],
    organizer: 'دکتر احمدی',
    organizers: [],
    createdBy: new mongoose.Types.ObjectId(),
    tags: ['استارتاپ', 'کسب‌وکار'],
  },
  {
    title: 'جلسه شبکه‌سازی ماهانه',
    description: 'فرصتی برای آشنایی با سایر کارآفرینان و سرمایه‌گذاران',
    type: 'networking',
    status: 'upcoming',
    date: new Date('2025-01-20'),
    time: '18:00',
    duration: 2,
    location: 'کافه نوآوران',
    capacity: 30,
    registered: 0,
    registeredParticipants: [],
    attendees: [],
    organizer: 'تیم نوآفرین',
    organizers: [],
    createdBy: new mongoose.Types.ObjectId(),
    tags: ['شبکه‌سازی', 'کارآفرینی'],
  },
  {
    title: 'وبینار هوش مصنوعی در کسب‌وکار',
    description: 'کاربردهای AI در توسعه محصول و خدمات',
    type: 'webinar',
    status: 'upcoming',
    date: new Date('2025-01-18'),
    time: '20:00',
    duration: 2,
    onlineLink: 'https://meet.google.com/xxx',
    capacity: 100,
    registered: 0,
    registeredParticipants: [],
    attendees: [],
    organizer: 'دکتر رضایی',
    organizers: [],
    createdBy: new mongoose.Types.ObjectId(),
    tags: ['AI', 'تکنولوژی'],
  },
];

async function seedEvents() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing events
    console.log('🗑️  Clearing existing events...');
    await Event.deleteMany({});
    console.log('✅ Existing events cleared');

    // Insert sample events
    console.log('📝 Inserting sample events...');
    const inserted = await Event.insertMany(sampleEvents);
    console.log(`✅ ${inserted.length} events created successfully!`);
    
    console.log('\n📋 Created events:');
    inserted.forEach((event, index) => {
      console.log(`${index + 1}. ${event.title} (ID: ${event._id})`);
    });

    mongoose.connection.close();
    console.log('\n✅ Database connection closed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding events:', error);
    process.exit(1);
  }
}

seedEvents();
