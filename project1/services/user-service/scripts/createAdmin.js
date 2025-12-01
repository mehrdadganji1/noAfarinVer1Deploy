const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstName: String,
  lastName: String,
  role: [String],
  isActive: { type: Boolean, default: true },
  isEmailVerified: { type: Boolean, default: true },
  permissions: [String],
}, { timestamps: true });

const User = mongoose.model('User', UserSchema);

async function createAdmin() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const adminEmail = 'admin@aaco.ir';
    const adminPassword = 'Admin@AACO2024';

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: adminEmail });
    
    if (existingAdmin) {
      console.log('⚠️  Admin user already exists!');
      console.log('Email:', adminEmail);
      console.log('Updating password...');
      
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      existingAdmin.password = hashedPassword;
      existingAdmin.role = ['admin']; // lowercase to match UserRole enum
      existingAdmin.isActive = true;
      existingAdmin.isEmailVerified = true;
      existingAdmin.firstName = 'مدیر';
      existingAdmin.lastName = 'سیستم';
      
      await existingAdmin.save();
      console.log('✅ Admin password updated!');
    } else {
      console.log('📝 Creating new admin user...');
      
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      
      const admin = new User({
        email: adminEmail,
        password: hashedPassword,
        firstName: 'مدیر',
        lastName: 'سیستم',
        role: ['admin'], // lowercase to match UserRole enum
        isActive: true,
        isEmailVerified: true,
        permissions: [
          'MANAGE_USERS',
          'REVIEW_APPLICATIONS',
          'APPROVE_APPLICATIONS',
          'MANAGE_EVENTS',
          'MANAGE_TRAININGS',
          'MANAGE_TEAMS',
          'APPROVE_FUNDING',
          'SYSTEM_SETTINGS',
          'VIEW_ANALYTICS',
          'MANAGE_CONTENT'
        ],
      });

      await admin.save();
      console.log('✅ Admin user created successfully!');
    }

    console.log('\n' + '='.repeat(60));
    console.log('🎉 ADMIN ACCOUNT DETAILS');
    console.log('='.repeat(60));
    console.log('Email:    ', adminEmail);
    console.log('Password: ', adminPassword);
    console.log('Role:     ', 'ADMIN (مدیر سیستم)');
    console.log('='.repeat(60));
    console.log('\n⚠️  IMPORTANT: Save these credentials securely!');
    console.log('📝 Credentials saved to: pass.txt\n');

    await mongoose.connection.close();
    console.log('✅ Database connection closed');
    
    return {
      email: adminEmail,
      password: adminPassword,
      role: 'ADMIN'
    };
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  createAdmin().then(() => process.exit(0));
}

module.exports = createAdmin;
