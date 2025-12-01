import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import '../src/models/User';
import '../src/models/Application';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

async function deleteApplicant() {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/noafarin');
  
  const User = mongoose.model('User');
  const Application = mongoose.model('Application');
  
  await User.deleteOne({ email: 'applicant@test.com' });
  await Application.deleteMany({ email: 'applicant@test.com' });
  
  console.log('✅ Deleted applicant@test.com');
  
  await mongoose.disconnect();
  process.exit(0);
}

deleteApplicant();
