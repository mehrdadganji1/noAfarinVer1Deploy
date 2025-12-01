const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://admin:admin123@localhost:27017/noafarin?authSource=admin';
mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// User Schema (to fetch real users)
const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  role: [String],
});
const User = mongoose.model('User', userSchema);

// Team Schema
const teamSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  ideaTitle: { type: String, required: true },
  ideaDescription: { type: String, required: true },
  problemStatement: { type: String, required: true },
  solution: { type: String, required: true },
  targetMarket: { type: String, required: true },
  technology: [String],
  members: [{
    userId: { type: String, required: true },
    role: { type: String, enum: ['founder', 'co-founder', 'member'], required: true },
    joinedAt: { type: Date, default: Date.now }
  }],
  mentors: [String],
  status: { type: String, default: 'active' },
  phase: { type: String, default: 'ideation' },
  score: Number,
  ranking: Number,
}, { timestamps: true });

const Team = mongoose.model('Team', teamSchema);

async function createRealTeam() {
  try {
    console.log('\n🔍 Fetching users from database...');
    
    // Get all users
    const users = await User.find({}).limit(10);
    console.log(`\n📊 Found ${users.length} users in database:`);
    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.firstName} ${user.lastName} (${user.email}) - Role: ${user.role.join(', ')}`);
    });

    if (users.length < 2) {
      console.log('\n❌ Need at least 2 users to create a team');
      process.exit(1);
    }

    // Select founder and members from real users
    const founder = users[0];
    const members = users.slice(1, Math.min(4, users.length)); // Take up to 3 more members

    console.log('\n👥 Creating team with:');
    console.log(`   Founder: ${founder.firstName} ${founder.lastName}`);
    members.forEach((member, index) => {
      console.log(`   Member ${index + 1}: ${member.firstName} ${member.lastName}`);
    });

    // Create team with real user IDs
    const teamData = {
      name: 'تیم نوآوری فناوری',
      description: 'تیمی متشکل از متخصصان فناوری اطلاعات برای توسعه راه‌حل‌های نوآورانه',
      ideaTitle: 'پلتفرم هوشمند مدیریت رویدادها',
      ideaDescription: 'یک پلتفرم جامع برای مدیریت رویدادها، ثبت‌نام شرکت‌کنندگان، و پیگیری فعالیت‌ها با استفاده از هوش مصنوعی',
      problemStatement: 'سازمان‌ها با چالش‌های زیادی در مدیریت رویدادها، ثبت‌نام شرکت‌کنندگان و پیگیری فعالیت‌ها مواجه هستند',
      solution: 'ارائه یک پلتفرم یکپارچه با قابلیت‌های هوشمند برای خودکارسازی فرآیندها و بهبود تجربه کاربری',
      targetMarket: 'سازمان‌های برگزارکننده رویدادها، شتاب‌دهنده‌ها، و مراکز نوآوری',
      technology: ['React', 'Node.js', 'MongoDB', 'TypeScript', 'AI/ML'],
      members: [
        {
          userId: founder._id.toString(),
          role: 'founder',
          joinedAt: new Date()
        },
        ...members.map((member, index) => ({
          userId: member._id.toString(),
          role: index === 0 ? 'co-founder' : 'member',
          joinedAt: new Date()
        }))
      ],
      mentors: [],
      status: 'active',
      phase: 'training',
      score: 85,
      ranking: 1
    };

    // Check if team already exists
    const existingTeam = await Team.findOne({ name: teamData.name });
    if (existingTeam) {
      console.log('\n⚠️  Team already exists, deleting old one...');
      await Team.deleteOne({ name: teamData.name });
    }

    const team = await Team.create(teamData);
    
    console.log('\n✅ Team created successfully!');
    console.log('\n📋 Team Details:');
    console.log(`   ID: ${team._id}`);
    console.log(`   Name: ${team.name}`);
    console.log(`   Idea: ${team.ideaTitle}`);
    console.log(`   Status: ${team.status}`);
    console.log(`   Phase: ${team.phase}`);
    console.log(`   Members: ${team.members.length}`);
    console.log(`   Score: ${team.score}`);
    console.log(`   Ranking: ${team.ranking}`);
    
    console.log('\n👥 Team Members:');
    for (const member of team.members) {
      const user = await User.findById(member.userId);
      if (user) {
        console.log(`   - ${user.firstName} ${user.lastName} (${member.role})`);
      }
    }

    console.log('\n✅ Done! You can now view this team in the Director Dashboard.');
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    if (error.code === 11000) {
      console.error('   Team name already exists. Please use a different name.');
    }
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Database connection closed');
  }
}

createRealTeam();
