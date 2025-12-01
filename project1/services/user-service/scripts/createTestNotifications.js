const mongoose = require('mongoose')
const dotenv = require('dotenv')
const path = require('path')

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env') })

// Notification Schema
const NotificationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, required: true },
    priority: { type: String, default: 'medium' },
    title: { type: String, required: true },
    message: { type: String, required: true },
    link: String,
    metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
    isRead: { type: Boolean, default: false },
    readAt: Date,
  },
  { timestamps: true }
)

const Notification = mongoose.model('Notification', NotificationSchema)

// User Schema (minimal)
const UserSchema = new mongoose.Schema({
  email: String,
  firstName: String,
  lastName: String,
  role: String,
})

const User = mongoose.model('User', UserSchema)

const createTestNotifications = async () => {
  try {
    console.log('🔄 Connecting to MongoDB...')
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('✅ Connected to MongoDB')

    // Find a club member user
    const clubMember = await User.findOne({ role: 'club_member' })

    if (!clubMember) {
      console.log('❌ No club member found. Please create a club member first.')
      process.exit(1)
    }

    console.log(`✅ Found club member: ${clubMember.firstName} ${clubMember.lastName}`)

    // Delete existing notifications for this user
    await Notification.deleteMany({ userId: clubMember._id })
    console.log('🗑️  Deleted existing notifications')

    // Create test notifications
    const notifications = [
      // Achievement notifications
      {
        userId: clubMember._id,
        type: 'achievement',
        priority: 'high',
        title: '🏆 دستاورد جدید: پیشرو نوآوری',
        message: 'تبریک! شما دستاورد "پیشرو نوآوری" را کسب کردید. این دستاورد به خاطر مشارکت فعال شما در 5 پروژه نوآورانه اعطا شده است.',
        link: '/club-member/achievements',
        metadata: { achievementId: 'innovation-pioneer', xp: 500 },
      },
      {
        userId: clubMember._id,
        type: 'achievement',
        priority: 'medium',
        title: '⭐ سطح جدید: سطح 5',
        message: 'شما به سطح 5 ارتقا یافتید! 250 XP جایزه دریافت کردید.',
        link: '/club-member/gamification',
        metadata: { level: 5, xp: 250 },
      },

      // Project notifications
      {
        userId: clubMember._id,
        type: 'project',
        priority: 'urgent',
        title: '📋 پروژه جدید: سیستم هوش مصنوعی',
        message: 'شما به عنوان توسعه‌دهنده فرانت‌اند به پروژه "سیستم هوش مصنوعی" اضافه شدید. لطفاً جزئیات پروژه را بررسی کنید.',
        link: '/club-member/projects/ai-system',
        metadata: { projectId: 'ai-system', role: 'frontend-developer' },
      },
      {
        userId: clubMember._id,
        type: 'project',
        priority: 'high',
        title: '✅ مایلستون تکمیل شد',
        message: 'مایلستون "طراحی رابط کاربری" در پروژه "اپلیکیشن موبایل" با موفقیت تکمیل شد.',
        link: '/club-member/projects/mobile-app',
        metadata: { projectId: 'mobile-app', milestone: 'ui-design' },
      },

      // Team notifications
      {
        userId: clubMember._id,
        type: 'team',
        priority: 'medium',
        title: '👥 دعوت به تیم: تیم توسعه وب',
        message: 'شما به تیم "توسعه وب" دعوت شدید. لطفاً دعوت را بررسی و پاسخ دهید.',
        link: '/club-member/teams/web-dev',
        metadata: { teamId: 'web-dev', invitedBy: 'محمد احمدی' },
      },
      {
        userId: clubMember._id,
        type: 'team',
        priority: 'low',
        title: '📢 جلسه تیم فردا',
        message: 'جلسه هفتگی تیم "توسعه وب" فردا ساعت 10 صبح برگزار می‌شود.',
        link: '/club-member/teams/web-dev',
        metadata: { teamId: 'web-dev', meetingDate: new Date(Date.now() + 86400000) },
      },

      // Event notifications
      {
        userId: clubMember._id,
        type: 'event',
        priority: 'high',
        title: '📅 رویداد جدید: هکاتون نوآوری',
        message: 'هکاتون نوآوری هفته آینده برگزار می‌شود. برای شرکت ثبت‌نام کنید!',
        link: '/club-member/events/innovation-hackathon',
        metadata: { eventId: 'innovation-hackathon', date: new Date(Date.now() + 604800000) },
      },
      {
        userId: clubMember._id,
        type: 'event',
        priority: 'urgent',
        title: '⏰ یادآوری: رویداد امروز',
        message: 'رویداد "کارگاه React" امروز ساعت 14 شروع می‌شود. آماده باشید!',
        link: '/club-member/events/react-workshop',
        metadata: { eventId: 'react-workshop', startTime: new Date() },
      },

      // Course notifications
      {
        userId: clubMember._id,
        type: 'course',
        priority: 'medium',
        title: '📚 دوره جدید: Node.js پیشرفته',
        message: 'دوره "Node.js پیشرفته" اکنون در دسترس است. برای ثبت‌نام کلیک کنید.',
        link: '/club-member/courses/advanced-nodejs',
        metadata: { courseId: 'advanced-nodejs', instructor: 'علی رضایی' },
      },
      {
        userId: clubMember._id,
        type: 'course',
        priority: 'low',
        title: '✏️ تکلیف جدید',
        message: 'تکلیف جدید در دوره "React Hooks" منتشر شد. مهلت تحویل: 3 روز دیگر.',
        link: '/club-member/courses/react-hooks/assignment',
        metadata: { courseId: 'react-hooks', deadline: new Date(Date.now() + 259200000) },
      },

      // Community notifications
      {
        userId: clubMember._id,
        type: 'community',
        priority: 'low',
        title: '💬 پاسخ جدید به پست شما',
        message: 'کاربر "سارا محمدی" به پست شما در انجمن پاسخ داد.',
        link: '/club-member/community/post/123',
        metadata: { postId: '123', userId: 'sara-mohammadi' },
      },
      {
        userId: clubMember._id,
        type: 'community',
        priority: 'medium',
        title: '👍 پست شما لایک شد',
        message: 'پست شما "بهترین روش‌های کدنویسی" 10 لایک جدید دریافت کرد!',
        link: '/club-member/community/post/456',
        metadata: { postId: '456', likes: 10 },
      },

      // System notifications
      {
        userId: clubMember._id,
        type: 'system',
        priority: 'medium',
        title: '🔔 به‌روزرسانی سیستم',
        message: 'سیستم امشب ساعت 2 بامداد برای به‌روزرسانی غیرفعال می‌شود. مدت زمان: 30 دقیقه.',
        link: '/notifications/settings',
        metadata: { maintenanceStart: new Date(), duration: 30 },
      },
      {
        userId: clubMember._id,
        type: 'system',
        priority: 'low',
        title: '📢 ویژگی جدید',
        message: 'ویژگی "گیمیفیکیشن پیشرفته" اضافه شد. آن را امتحان کنید!',
        link: '/club-member/gamification',
        metadata: { feature: 'advanced-gamification' },
      },

      // Some read notifications
      {
        userId: clubMember._id,
        type: 'achievement',
        priority: 'medium',
        title: '🎯 چالش تکمیل شد',
        message: 'شما چالش "30 روز کدنویسی" را با موفقیت تکمیل کردید!',
        link: '/club-member/challenges',
        metadata: { challengeId: '30-days-coding' },
        isRead: true,
        readAt: new Date(Date.now() - 86400000),
      },
      {
        userId: clubMember._id,
        type: 'project',
        priority: 'low',
        title: '📝 گزارش هفتگی',
        message: 'گزارش هفتگی پروژه‌های شما آماده است.',
        link: '/club-member/projects/reports',
        metadata: { reportType: 'weekly' },
        isRead: true,
        readAt: new Date(Date.now() - 172800000),
      },
    ]

    // Insert notifications
    const result = await Notification.insertMany(notifications)
    console.log(`✅ Created ${result.length} test notifications`)

    // Show stats
    const stats = await Notification.aggregate([
      { $match: { userId: clubMember._id } },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          unread: { $sum: { $cond: [{ $eq: ['$isRead', false] }, 1, 0] } },
          read: { $sum: { $cond: [{ $eq: ['$isRead', true] }, 1, 0] } },
        },
      },
    ])

    console.log('\n📊 Notification Stats:')
    console.log(`   Total: ${stats[0].total}`)
    console.log(`   Unread: ${stats[0].unread}`)
    console.log(`   Read: ${stats[0].read}`)

    console.log('\n✅ Test notifications created successfully!')
    process.exit(0)
  } catch (error) {
    console.error('❌ Error:', error)
    process.exit(1)
  }
}

createTestNotifications()
