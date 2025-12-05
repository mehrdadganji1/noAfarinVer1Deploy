import { motion } from 'framer-motion'
import { Activity } from 'lucide-react'
import { ChartCard } from '../base'
import { AdminStats } from '@/hooks/useAdminStats'
import { cn } from '@/lib/utils'

interface UserActivityChartProps {
  stats: AdminStats | undefined
  loading?: boolean
  delay?: number
}

export function UserActivityChart({ stats, loading = false, delay = 0 }: UserActivityChartProps) {
  const activities = [
    { 
      label: 'امروز', 
      value: stats?.activity.dailyActiveUsers || 0, 
      color: 'from-emerald-500 to-teal-500',
      bgColor: 'bg-emerald-500',
    },
    { 
      label: 'این هفته', 
      value: stats?.activity.weeklyActiveUsers || 0, 
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-500',
    },
    { 
      label: 'این ماه', 
      value: stats?.activity.monthlyActiveUsers || 0, 
      color: 'from-purple-500 to-indigo-500',
      bgColor: 'bg-purple-500',
    },
  ]

  const maxValue = Math.max(...activities.map(a => a.value), 1)

  const dailyRate = stats?.users.total 
    ? Math.round((stats.activity.dailyActiveUsers / stats.users.total) * 100) 
    : 0
  const monthlyRate = stats?.users.total 
    ? Math.round((stats.activity.monthlyActiveUsers / stats.users.total) * 100) 
    : 0

  return (
    <ChartCard
      title="کاربران فعال"
      subtitle="میزان فعالیت کاربران"
      icon={Activity}
      iconColor="text-emerald-600 dark:text-emerald-400"
      headerGradient="from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20"
      loading={loading}
      delay={delay}
    >
      <div className="space-y-6">
        {activities.map((activity, index) => (
          <motion.div
            key={activity.label}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: delay + 0.1 + index * 0.1 }}
            className="space-y-2"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {activity.label}
              </span>
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                {activity.value.toLocaleString('fa-IR')}
              </span>
            </div>
            <div className="relative w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(activity.value / maxValue) * 100}%` }}
                transition={{ delay: delay + 0.2 + index * 0.1, duration: 0.8, ease: 'easeOut' }}
                className={cn(
                  'h-4 rounded-full bg-gradient-to-r',
                  activity.color,
                  'flex items-center justify-end pr-2'
                )}
              >
                {activity.value > 0 && (
                  <span className="text-xs text-white font-semibold">
                    {Math.round((activity.value / maxValue) * 100)}%
                  </span>
                )}
              </motion.div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Rate Cards */}
      <div className="mt-6 grid grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: delay + 0.5 }}
          className="p-4 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-xl border border-emerald-200 dark:border-emerald-800"
        >
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">نرخ فعالیت روزانه</p>
          <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
            {dailyRate}%
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: delay + 0.6 }}
          className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl border border-blue-200 dark:border-blue-800"
        >
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">نرخ فعالیت ماهانه</p>
          <p className="text-xl font-bold text-blue-600 dark:text-blue-400">
            {monthlyRate}%
          </p>
        </motion.div>
      </div>
    </ChartCard>
  )
}

export default UserActivityChart
