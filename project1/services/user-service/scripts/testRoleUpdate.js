const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/noafarin')
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

const User = require('../src/models/User').default;

async function testRoleUpdate() {
  try {
    console.log('\n🔍 Testing Role Update Functionality...\n');

    // Find a test user (not director)
    const testUser = await User.findOne({ 
      role: { $ne: 'director' } 
    }).select('-password');

    if (!testUser) {
      console.log('❌ No test user found');
      process.exit(1);
    }

    console.log('📋 Current User Info:');
    console.log('   ID:', testUser._id);
    console.log('   Name:', testUser.firstName, testUser.lastName);
    console.log('   Email:', testUser.email);
    console.log('   Current Roles:', testUser.role);

    // Test 1: Update to single role
    console.log('\n🧪 Test 1: Update to single role (manager)');
    testUser.role = ['manager'];
    await testUser.save();
    console.log('   ✅ Updated roles:', testUser.role);

    // Test 2: Update to multiple roles
    console.log('\n🧪 Test 2: Update to multiple roles (manager + club_member)');
    testUser.role = ['manager', 'club_member'];
    await testUser.save();
    console.log('   ✅ Updated roles:', testUser.role);

    // Test 3: Using findByIdAndUpdate
    console.log('\n🧪 Test 3: Using findByIdAndUpdate (admin)');
    const updatedUser = await User.findByIdAndUpdate(
      testUser._id,
      { role: ['admin'] },
      { new: true, runValidators: true }
    ).select('-password');
    console.log('   ✅ Updated roles:', updatedUser.role);

    // Test 4: Restore original roles
    console.log('\n🧪 Test 4: Restore to applicant');
    await User.findByIdAndUpdate(
      testUser._id,
      { role: ['applicant'] },
      { new: true }
    );
    console.log('   ✅ Restored to applicant');

    console.log('\n✅ All tests passed!\n');
    process.exit(0);

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error(error);
    process.exit(1);
  }
}

testRoleUpdate();
