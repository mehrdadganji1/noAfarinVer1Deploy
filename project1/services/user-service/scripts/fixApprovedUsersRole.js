/**
 * Fix users who were incorrectly promoted to club_member
 * when their AACO application was approved.
 * 
 * AACO approval only means pre-registration is approved,
 * user should remain as applicant until final approval (accepted status)
 */

const mongoose = require('mongoose');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/noafarin';

// User Schema (simplified)
const userSchema = new mongoose.Schema({
  email: String,
  firstName: String,
  lastName: String,
  role: [String],
});

const User = mongoose.model('User', userSchema);

async function fixApprovedUsersRole() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Find users with club_member role who should be applicant
    // These are users who were incorrectly promoted
    const clubMembers = await User.find({ role: 'club_member' });
    
    console.log(`\n📊 Found ${clubMembers.length} users with club_member role`);
    
    for (const user of clubMembers) {
      console.log(`\n👤 User: ${user.firstName} ${user.lastName} (${user.email})`);
      console.log(`   Current role: ${user.role}`);
      
      // Ask for confirmation (in production, you might want to add more checks)
      // For now, we'll just list them
    }

    // To actually fix, uncomment below:
    // const result = await User.updateMany(
    //   { role: 'club_member' },
    //   { $set: { role: ['applicant'] } }
    // );
    // console.log(`\n✅ Updated ${result.modifiedCount} users to applicant role`);

    console.log('\n⚠️  To fix these users, run with --fix flag');
    console.log('   node scripts/fixApprovedUsersRole.js --fix');

    // Check if --fix flag is provided
    if (process.argv.includes('--fix')) {
      const result = await User.updateMany(
        { role: 'club_member' },
        { $set: { role: ['applicant'] } }
      );
      console.log(`\n✅ Updated ${result.modifiedCount} users to applicant role`);
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

fixApprovedUsersRole();
