const mongoose = require('mongoose');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://admin:admin123@localhost:27017/noafarin?authSource=admin';

// Interview Schema
const interviewSchema = new mongoose.Schema({
  applicationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Application' },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  interviewDate: { type: Date, required: true },
  interviewTime: { type: String, required: true },
  duration: { type: Number, default: 60 },
  location: { type: String, enum: ['online', 'office', 'phone'], required: true },
  meetingLink: String,
  meetingPassword: String,
  officeAddress: String,
  phoneNumber: String,
  status: { 
    type: String, 
    enum: ['scheduled', 'confirmed', 'completed', 'cancelled', 'rescheduled', 'no-show'],
    default: 'scheduled'
  },
  interviewers: [{
    _id: mongoose.Schema.Types.ObjectId,
    firstName: String,
    lastName: String,
    email: String,
    avatar: String
  }],
  interviewType: { 
    type: String, 
    enum: ['technical', 'hr', 'final', 'panel'],
    required: true 
  },
  notes: String,
  feedback: String,
  score: Number,
  rescheduleReason: String,
  rescheduleRequestedAt: Date,
  cancelledReason: String,
  cancelledAt: Date
}, { timestamps: true });

const Interview = mongoose.model('Interview', interviewSchema);

async function createTestInterview() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Get applicant user
    const User = mongoose.model('User', new mongoose.Schema({}, { strict: false }));
    const applicant = await User.findOne({ email: 'applicant@test.com' });
    
    if (!applicant) {
      console.log('❌ Applicant not found!');
      process.exit(1);
    }

    // Create test interview
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(14, 0, 0, 0);

    const interview = await Interview.create({
      userId: applicant._id,
      interviewDate: tomorrow,
      interviewTime: '14:00',
      duration: 60,
      location: 'online',
      meetingLink: 'https://meet.google.com/abc-defg-hij',
      meetingPassword: '123456',
      status: 'scheduled',
      interviewType: 'technical',
      interviewers: [
        {
          _id: new mongoose.Types.ObjectId(),
          firstName: 'محمد',
          lastName: 'احمدی',
          email: 'interviewer@noafarin.com',
          avatar: 'https://ui-avatars.com/api/?name=محمد+احمدی'
        }
      ],
      notes: 'مصاحبه فنی برای موقعیت توسعه‌دهنده فرانت‌اند'
    });

    console.log('✅ Test interview created!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Interview ID:', interview._id);
    console.log('User:', applicant.firstName, applicant.lastName);
    console.log('Date:', interview.interviewDate.toLocaleDateString('fa-IR'));
    console.log('Time:', interview.interviewTime);
    console.log('Type:', interview.interviewType);
    console.log('Status:', interview.status);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

createTestInterview();
