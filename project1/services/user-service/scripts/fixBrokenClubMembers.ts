/**
 * Fix Broken Club Members
 * پیدا کردن userهایی که CLUB_MEMBER هستن اما membership info ندارن
 * و برگردوندنشون به APPLICANT
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import '../src/models/User';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

async function fixBrokenClubMembers() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/noafarin');
    console.log('✅ Connected to MongoDB\n');

    const User = mongoose.model('User');

    // Find users with CLUB_MEMBER role but no membership info
    const brokenMembers = await User.find({
      role: 'club_member',
      $or: [
        { 'membershipInfo.memberId': { $exists: false } },
        { 'membershipInfo.memberId': null },
        { membershipInfo: { $exists: false } },
        { membershipInfo: null }
      ]
    }).select('_id email firstName lastName role membershipInfo');

    console.log(`📊 Found ${brokenMembers.length} broken club members\n`);

    if (brokenMembers.length === 0) {
      console.log('✅ No broken club members found. All users are properly configured!\n');
      await mongoose.disconnect();
      process.exit(0);
    }

    let fixedCount = 0;

    for (const user of brokenMembers) {
      console.log(`🔧 Fixing user: ${user.email}`);
      console.log(`   Name: ${user.firstName} ${user.lastName}`);
      console.log(`   Current roles: ${user.role.join(', ')}`);
      console.log(`   Membership Info: ${user.membershipInfo ? 'exists but invalid' : 'missing'}`);

      // Remove CLUB_MEMBER role and keep only APPLICANT
      const newRoles = user.role.filter((r: string) => r !== 'club_member');
      
      // If no roles left, add APPLICANT
      if (newRoles.length === 0) {
        newRoles.push('applicant');
      } else if (!newRoles.includes('applicant')) {
        // Add APPLICANT if not already there
        newRoles.push('applicant');
      }

      user.role = newRoles;
      
      // Clear broken membership info
      user.membershipInfo = undefined;
      user.memberStats = undefined;
      
      await user.save();

      console.log(`   ✅ Fixed! New roles: ${newRoles.join(', ')}`);
      console.log(`   → User can now be properly promoted via Applications page\n`);
      fixedCount++;
    }

    console.log('\n' + '='.repeat(60));
    console.log('📊 Fix Summary:');
    console.log('='.repeat(60));
    console.log(`Total broken club members found: ${brokenMembers.length}`);
    console.log(`Successfully fixed: ${fixedCount}`);
    console.log('='.repeat(60) + '\n');

    console.log('✅ All broken club members have been fixed!');
    console.log('📝 Next steps:');
    console.log('   1. Go to Admin Panel → Applications');
    console.log('   2. Find the user\'s approved application');
    console.log('   3. Click "ارتقا به عضو باشگاه" button');
    console.log('   4. This will properly create membership info\n');

  } catch (error) {
    console.error('❌ Fix Error:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('👋 Disconnected from MongoDB');
    process.exit(0);
  }
}

console.log('🚀 Starting Fix Broken Club Members...\n');
fixBrokenClubMembers();
