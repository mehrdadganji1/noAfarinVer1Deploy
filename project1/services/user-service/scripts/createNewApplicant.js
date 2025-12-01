const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

// Define User Schema directly
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  phoneNumber: String,
  university: String,
  major: String,
  studentId: String,
  role: [{ type: String, enum: ['applicant', 'club_member', 'admin', 'manager'] }],
  isEmailVerified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

async function createNewApplicant() {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/noafarin';
    console.log('🔌 Connecting to MongoDB:', mongoUri);
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    // Generate unique email
    const timestamp = Date.now();
    const email = `applicant${timestamp}@test.com`;

    // Hash password
    const hashedPassword = await bcrypt.hash('123456', 10);

    // Check if user already has application
    const Application = mongoose.models.Application || mongoose.model('Application', new mongoose.Schema({
      userId: mongoose.Schema.Types.ObjectId,
      status: String,
    }));

    // Create new applicant (ONLY applicant role, no club_member)
    const applicant = new User({
      email: email,
      password: hashedPassword,
      firstName: 'رضا',
      lastName: 'احمدی',
      phoneNumber: '09121234567',
      university: 'دانشگاه شریف',
      major: 'مهندسی نرم‌افزار',
      studentId: '401234567',
      role: ['applicant'], // ONLY applicant role
      isEmailVerified: true, // Auto-verify for testing
    });

    await applicant.save();
    console.log('✅ New Applicant created successfully!\n');

    console.log('📋 Account Details:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Email:', email);
    console.log('Password: 123456');
    console.log('Name: رضا احمدی');
    console.log('Role: applicant');
    console.log('Phone: 09121234567');
    console.log('University: دانشگاه شریف');
    console.log('Major: مهندسی نرم‌افزار');
    console.log('Student ID: 401234567');
    console.log('Email Verified: Yes');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    console.log('🔗 Login URL: http://localhost:5173/login');
    console.log('📱 Use the credentials above to login\n');

    await mongoose.connection.close();
    console.log('✅ Database connection closed');
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

createNewApplicant();
