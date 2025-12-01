import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import User, { UserRole } from '../src/models/User';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

const createAdminUser = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://admin:admin123@localhost:27017/noafarin?authSource=admin');
    console.log('✅ Connected to MongoDB');

    // Check if admin exists
    const existingAdmin = await User.findOne({ email: 'admin@noafarin.com' });
    
    if (existingAdmin) {
      console.log('⚠️  Admin user already exists - Updating...');
      console.log('   Email:', existingAdmin.email);
      console.log('   Name:', existingAdmin.firstName, existingAdmin.lastName);
      console.log('   Old Roles:', existingAdmin.role);
      
      // Update password and ensure admin role
      existingAdmin.password = 'Admin@123456';
      if (!existingAdmin.role.includes(UserRole.ADMIN)) {
        existingAdmin.role.push(UserRole.ADMIN);
      }
      await existingAdmin.save();
      
      console.log('✅ Admin user updated successfully!');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('📧 Email:    admin@noafarin.com');
      console.log('🔑 Password: Admin@123456');
      console.log('👤 Name:     Admin Noafarin');
      console.log('🎭 Roles:    ', existingAdmin.role);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      
      await mongoose.disconnect();
      return;
    }

    // Create admin user
    const adminUser = await User.create({
      email: 'admin@noafarin.com',
      password: 'Admin@123456',
      firstName: 'Admin',
      lastName: 'Noafarin',
      role: [UserRole.ADMIN],
      isActive: true,
      isVerified: true,
    });

    console.log('✅ Admin user created successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 Email:    admin@noafarin.com');
    console.log('🔑 Password: Admin@123456');
    console.log('👤 Name:     Admin Noafarin');
    console.log('🎭 Role:     ADMIN');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n⚠️  IMPORTANT: Change the password after first login!\n');

    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
};

createAdminUser();
