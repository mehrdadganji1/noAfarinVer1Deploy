import { motion } from 'framer-motion'
import { Users } from 'lucide-react'
import { ChartCard } from '../base'
import { AdminStats } from '@/hooks/useAdminStats'
import { cn } from '@/lib/utils'

interface RoleDistributionProps {
  stats: AdminStats | undefined
  loading?: boolean
  delay?: number
}

export function RoleDistribution({ stats, loading = false, delay = 0 }: RoleDistributionProps) {
  const roles = [
    { 
      name: 'متقاضیان', 
      value: stats?.users.applicants || 0, 
      color: 'bg-amber-500',
      strokeColor: 'stroke-amber-500',
      lightBg: 'bg-amber-50 dark:bg-amber-900/20',
    },
    { 
      name: 'اعضای باشگاه', 
      value: stats?.users.clubMembers || 0, 
      color: 'bg-purple-500',
      strokeColor: 'stroke-purple-500',
      lightBg: 'bg-purple-50 dark:bg-purple-900/20',
    },
    { 
      name: 'مدیران', 
      value: stats?.users.admins || 0, 
      color: 'bg-rose-500',
      strokeColor: 'stroke-rose-500',
      lightBg: 'bg-rose-50 dark:bg-rose-900/20',
    },
  ]

  const total = roles.reduce((sum, role) => sum + role.value, 0)
  const circumference = 2 * Math.PI * 80

  return (
    <ChartCard
      title="توزیع نقش‌ها"
      subtitle="تفکیک کاربران بر اساس نقش"
      icon={Users}
      iconColor="text-purple-600 dark:text-purple-400"
      headerGradient="from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20"
      loading={loading}
      delay={delay}
    >
      {/* Circular Progress */}
      <div className="flex items-center justify-center mb-6">
        <div className="relative w-48 h-48">
          <svg className="w-full h-full transform -rotate-90">
            {/* Background Circle */}
            <circle
              cx="96"
              cy="96"
              r="80"
              fill="none"
              className="stroke-gray-200 dark:stroke-gray-700"
              strokeWidth="16"
            />
            {/* Role Segments */}
            {roles.map((role, index) => {
              const percentage = total > 0 ? (role.value / total) * 100 : 0
              const offset = circumference - (percentage / 100) * circumference
              const prevPercentages = roles
                .slice(0, index)
                .reduce((sum, r) => sum + (total > 0 ? (r.value / total) * 100 : 0), 0)
              const rotation = (prevPercentages / 100) * 360

              return (
                <motion.circle
                  key={role.name}
                  cx="96"
                  cy="96"
                  r="80"
                  fill="none"
                  className={role.strokeColor}
                  strokeWidth="16"
                  strokeDasharray={circumference}
                  initial={{ strokeDashoffset: circumference }}
                  animate={{ strokeDashoffset: offset }}
                  transition={{ delay: delay + 0.2 + index * 0.15, duration: 0.8, ease: 'easeOut' }}
                  style={{
                    transform: `rotate(${rotation}deg)`,
                    transformOrigin: '96px 96px',
                  }}
                />
              )
            })}
          </svg>
          {/* Center Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: delay + 0.5 }}
            className="absolute inset-0 flex items-center justify-center flex-col"
          >
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {total.toLocaleString('fa-IR')}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">کل کاربران</p>
          </motion.div>
        </div>
      </div>

      {/* Legend */}
      <div className="space-y-3">
        {roles.map((role, index) => {
          const percentage = total > 0 ? Math.round((role.value / total) * 100) : 0
          return (
            <motion.div
              key={role.name}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: delay + 0.6 + index * 0.1 }}
              className={cn(
                'flex items-center justify-between p-3 rounded-xl',
                role.lightBg
              )}
            >
              <div className="flex items-center gap-3">
                <div className={cn('w-4 h-4 rounded-full', role.color)} />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {role.name}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-gray-900 dark:text-white">
                  {role.value.toLocaleString('fa-IR')}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 px-2 py-1 rounded-full">
                  {percentage}%
                </span>
              </div>
            </motion.div>
          )
        })}
      </div>
    </ChartCard>
  )
}

export default RoleDistribution
