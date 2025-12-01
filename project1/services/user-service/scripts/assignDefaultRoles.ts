/**
 * Script to assign APPLICANT role to all users without roles
 * و همچنین اطمینان از اینکه همه users حداقل یک نقش دارند
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import '../src/models/User'; // Import User model to register schema
import { UserRole } from '../src/models/User';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env') });

interface IUser {
  _id: mongoose.Types.ObjectId;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole[];
}

async function assignDefaultRoles() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/noafarin');
    console.log('✅ Connected to MongoDB\n');

    const User = mongoose.model('User');

    // Find all users
    const allUsers = await User.find({}).select('_id email firstName lastName role');
    console.log(`📊 Total users found: ${allUsers.length}\n`);

    let updatedCount = 0;
    let alreadyOkCount = 0;

    for (const user of allUsers) {
      const userData = user as unknown as IUser;
      
      // Check if user has no roles or empty role array
      if (!userData.role || userData.role.length === 0) {
        console.log(`🔧 Updating user: ${userData.email}`);
        console.log(`   Name: ${userData.firstName} ${userData.lastName}`);
        console.log(`   Current roles: ${userData.role || 'undefined'}`);
        
        // Set default role to APPLICANT
        userData.role = [UserRole.APPLICANT];
        await user.save();
        
        console.log(`   ✅ Updated to: APPLICANT\n`);
        updatedCount++;
      } else {
        console.log(`✓ User ${userData.email} already has roles: ${userData.role.join(', ')}`);
        alreadyOkCount++;
      }
    }

    console.log('\n' + '='.repeat(60));
    console.log('📊 Summary:');
    console.log('='.repeat(60));
    console.log(`Total users: ${allUsers.length}`);
    console.log(`Updated to APPLICANT: ${updatedCount}`);
    console.log(`Already had roles: ${alreadyOkCount}`);
    console.log('='.repeat(60) + '\n');

    if (updatedCount > 0) {
      console.log('✅ Successfully assigned default roles to all users!');
    } else {
      console.log('✅ All users already have roles!');
    }

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('\n👋 Disconnected from MongoDB');
    process.exit(0);
  }
}

// Run the script
assignDefaultRoles();
