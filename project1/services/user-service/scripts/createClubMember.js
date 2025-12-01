const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  firstName: String,
  lastName: String,
  role: [String],
  phoneNumber: String,
  university: String,
  major: String,
  studentId: String,
  isActive: Boolean,
  isEmailVerified: Boolean,
  membershipStatus: String,
  membershipStartDate: Date,
  xp: Number,
  level: Number,
  achievements: [String],
  bio: String,
  skills: [String],
  interests: [String],
  socialLinks: {
    linkedin: String,
    github: String,
    twitter: String
  }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

async function createClubMember() {
  try {
    console.log('🚀 Creating Club Member Account...\n');
    
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    const email = 'member@noafarin.com';
    
    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('⚠️  User already exists!');
      console.log('📧 Email:', existingUser.email);
      console.log('👤 Name:', existingUser.firstName, existingUser.lastName);
      console.log('🎭 Role:', existingUser.role);
      console.log('\n💡 Login credentials:');
      console.log('   Email: member@noafarin.com');
      console.log('   Password: Member@123\n');
      await mongoose.connection.close();
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash('Member@123', 10);

    // Create club member
    const clubMember = await User.create({
      email: 'member@noafarin.com',
      password: hashedPassword,
      firstName: 'رضا',
      lastName: 'کریمی',
      role: ['club_member'],
      phoneNumber: '09121234567',
      university: 'دانشگاه تهران',
      major: 'مهندسی کامپیوتر',
      studentId: '400123456',
      isActive: true,
      isEmailVerified: true,
      membershipStatus: 'active',
      membershipStartDate: new Date('2024-01-15'),
      xp: 1250,
      level: 5,
      achievements: ['first_login', 'profile_complete', 'first_event', 'team_player'],
      bio: 'عضو فعال باشگاه نوآفرین، علاقه‌مند به توسعه نرم‌افزار و کارآفرینی',
      skills: ['JavaScript', 'React', 'Node.js', 'Python', 'UI/UX Design'],
      interests: ['Web Development', 'Startup', 'AI', 'Blockchain'],
      socialLinks: {
        linkedin: 'https://linkedin.com/in/reza-karimi',
        github: 'https://github.com/rezakarimi',
        twitter: 'https://twitter.com/rezakarimi'
      }
    });

    console.log('✅ Club Member Created Successfully!\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🎉 CLUB MEMBER ACCOUNT');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    console.log('📧 Email:        member@noafarin.com');
    console.log('🔑 Password:     Member@123');
    console.log('👤 Name:         رضا کریمی');
    console.log('🎭 Role:         club_member');
    console.log('📱 Phone:        09121234567');
    console.log('🎓 University:   دانشگاه تهران');
    console.log('📚 Major:        مهندسی کامپیوتر');
    console.log('🆔 Student ID:   400123456');
    console.log('⭐ XP:           1250');
    console.log('🏆 Level:        5');
    console.log('🎖️  Achievements: 4 badges');
    console.log('💼 Status:       Active Member');
    console.log('📅 Member Since: 15 Jan 2024\n');
    
    console.log('🔗 Social Links:');
    console.log('   LinkedIn: https://linkedin.com/in/reza-karimi');
    console.log('   GitHub:   https://github.com/rezakarimi');
    console.log('   Twitter:  https://twitter.com/rezakarimi\n');
    
    console.log('💡 Skills:');
    console.log('   - JavaScript, React, Node.js');
    console.log('   - Python, UI/UX Design\n');
    
    console.log('🎯 Interests:');
    console.log('   - Web Development, Startup');
    console.log('   - AI, Blockchain\n');
    
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🌐 LOGIN URL:');
    console.log('   http://localhost:5173/login');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    console.log('📊 User Object:');
    console.log(JSON.stringify({
      _id: clubMember._id,
      email: clubMember.email,
      firstName: clubMember.firstName,
      lastName: clubMember.lastName,
      role: clubMember.role,
      xp: clubMember.xp,
      level: clubMember.level,
      membershipStatus: clubMember.membershipStatus
    }, null, 2));
    console.log('');

    await mongoose.connection.close();
    console.log('✅ Done!\n');
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

createClubMember();
