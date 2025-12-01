const mongoose = require('mongoose');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/noafar-club';

async function fixApplicationDates() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const ApplicationSchema = new mongoose.Schema({}, { strict: false });
    const Application = mongoose.models.Application || mongoose.model('Application', ApplicationSchema);

    // Update all applications that don't have submittedAt
    const result = await Application.updateMany(
      { submittedAt: { $exists: false } },
      [{ $set: { submittedAt: '$createdAt' } }]
    );

    console.log(`✅ Updated ${result.modifiedCount} applications with submittedAt field`);

    // Show sample
    const sample = await Application.findOne().select('firstName lastName submittedAt createdAt');
    if (sample) {
      console.log('\n📋 Sample application:');
      console.log(`   Name: ${sample.firstName} ${sample.lastName}`);
      console.log(`   Created: ${sample.createdAt}`);
      console.log(`   Submitted: ${sample.submittedAt}`);
    }

    await mongoose.disconnect();
    console.log('\n✅ Done!');
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

fixApplicationDates();
