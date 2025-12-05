import { motion } from 'framer-motion'
import { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface StatItem {
  label: string
  value: number | string
  icon: LucideIcon
  color: string
  bgColor: string
  change?: number
}

export interface StatsRowProps {
  stats: StatItem[]
  loading?: boolean
  className?: string
}

export function StatsRow({ stats, loading = false, className }: StatsRowProps) {
  if (loading) {
    return (
      <div className={cn('grid grid-cols-2 md:grid-cols-4 gap-4', className)}>
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="p-4 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 animate-pulse">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-lg" />
              <div className="space-y-2">
                <div className="h-3 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
                <div className="h-5 w-12 bg-gray-200 dark:bg-gray-700 rounded" />
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className={cn('grid grid-cols-2 md:grid-cols-4 gap-4', className)}>
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="p-4 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center gap-3">
            <div className={cn('p-2.5 rounded-lg', stat.bgColor)}>
              <stat.icon className={cn('h-5 w-5', stat.color)} />
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">{stat.label}</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {typeof stat.value === 'number' ? stat.value.toLocaleString('fa-IR') : stat.value}
              </p>
            </div>
          </div>
          {stat.change !== undefined && (
            <div className={cn(
              'mt-2 text-xs font-medium',
              stat.change >= 0 ? 'text-emerald-600' : 'text-rose-600'
            )}>
              {stat.change >= 0 ? '+' : ''}{stat.change}% نسبت به ماه قبل
            </div>
          )}
        </motion.div>
      ))}
    </div>
  )
}

export default StatsRow
