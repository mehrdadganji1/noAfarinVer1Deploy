// Quick script to create a test club member
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/noafarin-user-service', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

async function createTestMember() {
  try {
    const User = mongoose.model('User');
    const MemberProfile = mongoose.model('MemberProfile');
    
    // Find admin user
    const admin = await User.findOne({ email: 'admin@noafarin.com' });
    
    // Create test user
    const testUser = await User.create({
      firstName: 'علی',
      lastName: 'محمدی',
      email: 'test.member@noafarin.com',
      password: '$2a$10$abc123', // Hashed password
      role: ['applicant', 'club_member'],
      membershipInfo: {
        memberId: 'NI-2025-0001',
        memberSince: new Date(),
        membershipLevel: 'bronze',
        points: 0,
        status: 'active',
        promotedBy: admin._id,
        promotedAt: new Date()
      },
      memberStats: {
        eventsAttended: 0,
        projectsCompleted: 0,
        coursesCompleted: 0,
        achievementsEarned: 0,
        totalPoints: 0
      }
    });
    
    // Create profile
    await MemberProfile.create({
      userId: testUser._id,
      bio: 'عضو تستی باشگاه نوآفرینان',
      headline: 'عضو باشگاه نوآفرینان',
      visibility: { profile: 'public' }
    });
    
    console.log('✅ Test member created:', testUser.email);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

createTestMember();
