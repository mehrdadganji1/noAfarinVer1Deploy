/**
 * Restore legitimate club_member users who were incorrectly changed to applicant
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

// List of emails that should be club_member
const legitimateClubMembers = [
  'testmember@noafarin.com',
  'dev@club.com',
  'zahra.ahmadi@example.com',
  'fatemeh.karimi@example.com',
  'maryam.hosseini@example.com',
  'reza.mousavi@example.com',
  'sara.jafari@example.com',
  'nazanin.rahimi@example.com',
  'member@noafarin.com',
];

async function restoreClubMembers() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    for (const email of legitimateClubMembers) {
      const user = await User.findOne({ email });
      if (user) {
        // Restore club_member role
        let newRoles = ['club_member'];
        
        // Keep team-leader if they had it
        if (email === 'testmember@noafarin.com') {
          newRoles = ['club_member', 'team-leader'];
        }
        
        await User.updateOne(
          { email },
          { $set: { role: newRoles } }
        );
        console.log(`✅ Restored ${email} to ${newRoles.join(', ')}`);
      } else {
        console.log(`⚠️  User not found: ${email}`);
      }
    }

    console.log('\n✅ Done restoring club members');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

restoreClubMembers();
