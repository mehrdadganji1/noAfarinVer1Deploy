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

async function createApplicant() {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/noafarin';
    console.log('🔌 Connecting to MongoDB:', mongoUri);
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    // Check if user already exists
    const existingUser = await User.findOne({ email: 'applicant@test.com' });
    if (existingUser) {
      console.log('⚠️  User already exists!');
      console.log('\n📋 Existing User Details:');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('Email:', existingUser.email);
      console.log('Password: 123456 (use this to login)');
      console.log('Name:', existingUser.firstName, existingUser.lastName);
      console.log('Role:', existingUser.role);
      console.log('Phone:', existingUser.phoneNumber);
      console.log('University:', existingUser.university);
      console.log('Major:', existingUser.major);
      console.log('Student ID:', existingUser.studentId);
      console.log('Email Verified:', existingUser.isEmailVerified);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
      
      await mongoose.connection.close();
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash('123456', 10);

    // Create new applicant
    const applicant = new User({
      email: 'applicant@test.com',
      password: hashedPassword,
      firstName: 'علی',
      lastName: 'محمدی',
      phoneNumber: '09123456789',
      university: 'دانشگاه تهران',
      major: 'مهندسی کامپیوتر',
      studentId: '400123456',
      role: ['applicant'],
      isEmailVerified: true, // Auto-verify for testing
    });

    await applicant.save();
    console.log('✅ Applicant created successfully!\n');

    console.log('📋 Account Details:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Email: applicant@test.com');
    console.log('Password: 123456');
    console.log('Name: علی محمدی');
    console.log('Role: applicant');
    console.log('Phone: 09123456789');
    console.log('University: دانشگاه تهران');
    console.log('Major: مهندسی کامپیوتر');
    console.log('Student ID: 400123456');
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

createApplicant();
