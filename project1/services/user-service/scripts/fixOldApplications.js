const mongoose = require('mongoose');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/noafar-club';

async function fixOldApplications() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Define schemas
    const ApplicationSchema = new mongoose.Schema({
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      firstName: String,
      lastName: String,
      email: String,
      status: String,
    }, { strict: false, strictPopulate: false });
    
    const UserSchema = new mongoose.Schema({
      firstName: String,
      lastName: String,
      email: String,
    }, { strict: false });
    
    const Application = mongoose.models.Application || mongoose.model('Application', ApplicationSchema);
    const User = mongoose.models.User || mongoose.model('User', UserSchema);

    // Find applications without firstName or lastName
    const brokenApps = await Application.find({
      $or: [
        { firstName: { $exists: false } },
        { lastName: { $exists: false } },
        { firstName: null },
        { lastName: null },
        { firstName: '' },
        { lastName: '' },
      ]
    }).populate('userId');

    console.log(`\n📋 Found ${brokenApps.length} applications without proper names`);

    if (brokenApps.length === 0) {
      console.log('✅ All applications have proper data!');
      await mongoose.disconnect();
      return;
    }

    let fixed = 0;
    let deleted = 0;

    for (const app of brokenApps) {
      if (!app.userId) {
        console.log(`   ❌ Deleting application ${app._id} (no userId)`);
        await Application.deleteOne({ _id: app._id });
        deleted++;
        continue;
      }

      // Try to fix from userId
      if (app.userId.firstName && app.userId.lastName) {
        app.firstName = app.userId.firstName;
        app.lastName = app.userId.lastName;
        if (!app.email) app.email = app.userId.email;
        await app.save();
        console.log(`   ✅ Fixed: ${app.firstName} ${app.lastName}`);
        fixed++;
      } else {
        // Set placeholder values
        app.firstName = 'کاربر';
        app.lastName = 'ناشناس';
        if (!app.email) app.email = app.userId.email || 'unknown@test.com';
        await app.save();
        console.log(`   ⚠️  Set placeholder for application ${app._id}`);
        fixed++;
      }
    }

    console.log(`\n📊 Summary:`);
    console.log(`   Fixed: ${fixed}`);
    console.log(`   Deleted: ${deleted}`);

    // Show all applications now
    const allApps = await Application.find().select('firstName lastName email status');
    console.log(`\n📋 All applications (${allApps.length}):`);
    allApps.forEach(app => {
      console.log(`   ${app.firstName} ${app.lastName} - ${app.email} (${app.status})`);
    });

    await mongoose.disconnect();
    console.log('\n✅ Done!');
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

fixOldApplications();
