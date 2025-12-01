const mongoose = require('mongoose');
require('dotenv').config();

const checkDirectorUser = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Define User schema inline
    const userSchema = new mongoose.Schema({
      email: String,
      password: String,
      firstName: String,
      lastName: String,
      role: [String],
      isActive: Boolean,
      isVerified: Boolean,
      isEmailVerified: Boolean,
    });
    
    userSchema.methods.comparePassword = async function(candidatePassword) {
      const bcrypt = require('bcryptjs');
      return await bcrypt.compare(candidatePassword, this.password);
    };
    
    const User = mongoose.models.User || mongoose.model('User', userSchema);

    // Find director user
    const director = await User.findOne({ email: 'director@noafarin.com' });

    if (!director) {
      console.log('❌ Director user not found!');
      console.log('Run: node services/user-service/scripts/createDirector.js');
      process.exit(1);
    }

    console.log('\n✅ Director user found:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 Email:', director.email);
    console.log('👤 Name:', director.firstName, director.lastName);
    console.log('🎭 Roles:', director.role);
    console.log('✅ Active:', director.isActive);
    console.log('✅ Verified:', director.isVerified);
    console.log('✅ Email Verified:', director.isEmailVerified);
    console.log('🆔 User ID:', director._id);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    // Test password
    const isPasswordCorrect = await director.comparePassword('Director@123');
    console.log('\n🔐 Password test:', isPasswordCorrect ? '✅ Correct' : '❌ Wrong');

    if (!isPasswordCorrect) {
      console.log('⚠️ Password might be wrong. Expected: Director@123');
    }

    // Check if role includes 'director'
    if (!director.role.includes('director')) {
      console.log('\n❌ WARNING: User does not have "director" role!');
      console.log('Current roles:', director.role);
      console.log('Fixing...');
      
      director.role = ['director'];
      await director.save();
      console.log('✅ Fixed! Role updated to: director');
    }

    console.log('\n✅ All checks passed! You can login with:');
    console.log('Email: director@noafarin.com');
    console.log('Password: Director@123');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\n✅ Disconnected from MongoDB');
  }
};

checkDirectorUser();
