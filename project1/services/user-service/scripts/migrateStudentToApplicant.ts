/**
 * Migration Script: Convert all STUDENT roles to APPLICANT
 * تبدیل همه نقش‌های "student" قدیمی به "applicant" جدید
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import '../src/models/User'; // Import User model to register schema

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env') });

interface IUser {
  _id: mongoose.Types.ObjectId;
  email: string;
  firstName: string;
  lastName: string;
  role: string[];
}

async function migrateStudentToApplicant() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/noafarin');
    console.log('✅ Connected to MongoDB\n');

    const User = mongoose.model('User');

    // Find all users with "student" role
    const usersWithStudent = await User.find({
      role: { $in: ['student', 'STUDENT'] }
    }).select('_id email firstName lastName role');

    console.log(`📊 Found ${usersWithStudent.length} users with "student" role\n`);

    if (usersWithStudent.length === 0) {
      console.log('✅ No users with "student" role found. Database is clean!\n');
      await mongoose.disconnect();
      process.exit(0);
    }

    let migratedCount = 0;

    for (const user of usersWithStudent) {
      const userData = user as unknown as IUser;
      
      console.log(`🔧 Migrating user: ${userData.email}`);
      console.log(`   Name: ${userData.firstName} ${userData.lastName}`);
      console.log(`   Current roles: ${userData.role.join(', ')}`);
      
      // Replace "student" with "applicant"
      const newRoles = userData.role.map(role => {
        if (role.toLowerCase() === 'student') {
          return 'applicant';
        }
        return role;
      });

      // Remove duplicates
      const uniqueRoles = [...new Set(newRoles)];
      
      userData.role = uniqueRoles;
      await user.save();
      
      console.log(`   ✅ Migrated to: ${uniqueRoles.join(', ')}\n`);
      migratedCount++;
    }

    console.log('\n' + '='.repeat(60));
    console.log('📊 Migration Summary:');
    console.log('='.repeat(60));
    console.log(`Total users migrated: ${migratedCount}`);
    console.log(`student → applicant`);
    console.log('='.repeat(60) + '\n');

    console.log('✅ Migration completed successfully!');
    console.log('👉 All "student" roles have been converted to "applicant"');

  } catch (error) {
    console.error('❌ Migration Error:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('\n👋 Disconnected from MongoDB');
    process.exit(0);
  }
}

// Run the migration
console.log('🚀 Starting Student → Applicant Migration...\n');
migrateStudentToApplicant();
