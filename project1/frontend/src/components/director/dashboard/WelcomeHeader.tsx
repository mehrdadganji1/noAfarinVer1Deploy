import { motion } from 'framer-motion'
import { Crown, TrendingUp, Users, Activity } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'

interface WelcomeHeaderProps {
  stats?: {
    totalUsers: number
    activeToday: number
    growthRate: number
  }
}

export default function WelcomeHeader({ stats }: WelcomeHeaderProps) {
  const user = useAuthStore((state) => state.user)
  
  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'صبح بخیر'
    if (hour < 18) return 'عصر بخیر'
    return 'شب بخیر'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-8 text-white shadow-2xl"
    >
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
      </div>

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="flex items-center gap-3 mb-3"
            >
              <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
                <Crown className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-4xl font-bold">{getGreeting()}</h1>
                <p className="text-white/90 text-lg mt-1">
                  {user?.firstName} {user?.lastName}
                </p>
              </div>
            </motion.div>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-white/80 text-base max-w-2xl"
            >
              به پنل مدیریت نوآفرین خوش آمدید. از اینجا می‌توانید تمام جنبه‌های سیستم را مدیریت و نظارت کنید.
            </motion.p>
          </div>

          {/* Quick Stats Pills */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col gap-3"
          >
            <div className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full">
              <Users className="h-4 w-4" />
              <span className="text-sm font-semibold">{stats?.totalUsers || 0} کاربر</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full">
              <Activity className="h-4 w-4" />
              <span className="text-sm font-semibold">{stats?.activeToday || 0} فعال امروز</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-green-500/30 backdrop-blur-sm rounded-full">
              <TrendingUp className="h-4 w-4" />
              <span className="text-sm font-semibold">+{stats?.growthRate || 0}% رشد</span>
            </div>
          </motion.div>
        </div>

        {/* Status Badge */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full"
        >
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span className="text-sm font-medium">سیستم آنلاین و فعال</span>
        </motion.div>
      </div>
    </motion.div>
  )
}
