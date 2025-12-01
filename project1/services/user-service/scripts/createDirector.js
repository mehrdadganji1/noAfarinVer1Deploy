const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
require('dotenv').config()

// User Model
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['applicant', 'club_member', 'team-leader', 'mentor', 'judge', 'coordinator', 'manager', 'director', 'admin'],
    default: 'applicant' 
  },
  isEmailVerified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
})

const User = mongoose.models.User || mongoose.model('User', userSchema)

async function createDirector() {
  try {
    console.log('🚀 Starting Director user creation...\n')

    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/noafarin'
    console.log('📡 Connecting to MongoDB...')
    await mongoose.connect(mongoUri)
    console.log('✅ Connected to MongoDB\n')

    // Check if director already exists
    const existingDirector = await User.findOne({ email: 'director@noafarin.com' })
    if (existingDirector) {
      console.log('⚠️  Director user already exists!')
      console.log('📧 Email:', existingDirector.email)
      console.log('👤 Name:', existingDirector.firstName, existingDirector.lastName)
      console.log('🎭 Role:', existingDirector.role)
      console.log('\n💡 You can login with:')
      console.log('   Email: director@noafarin.com')
      console.log('   Password: Director@123\n')
      process.exit(0)
    }

    // Hash password
    console.log('🔐 Hashing password...')
    const hashedPassword = await bcrypt.hash('Director@123', 10)
    console.log('✅ Password hashed\n')

    // Create director user
    console.log('👑 Creating Director user...')
    const director = await User.create({
      email: 'director@noafarin.com',
      password: hashedPassword,
      firstName: 'مدیرکل',
      lastName: 'نوآفرین',
      role: 'director',
      isEmailVerified: true
    })

    console.log('✅ Director user created successfully!\n')
    console.log('═══════════════════════════════════════')
    console.log('👑 DIRECTOR USER CREDENTIALS')
    console.log('═══════════════════════════════════════')
    console.log('📧 Email:    director@noafarin.com')
    console.log('🔑 Password: Director@123')
    console.log('👤 Name:     مدیرکل نوآفرین')
    console.log('🎭 Role:     director')
    console.log('✅ Verified: true')
    console.log('═══════════════════════════════════════\n')
    
    console.log('🎯 Next Steps:')
    console.log('1. Start the frontend: cd project1/frontend && npm run dev')
    console.log('2. Go to: http://localhost:5173/login')
    console.log('3. Login with the credentials above')
    console.log('4. You will be redirected to: /director/dashboard\n')
    
    console.log('🚀 Happy Managing! 👑\n')

    process.exit(0)
  } catch (error) {
    console.error('❌ Error creating director:', error.message)
    process.exit(1)
  }
}

// Run the script
createDirector()
