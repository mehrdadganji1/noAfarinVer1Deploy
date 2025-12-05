import { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { LucideIcon, TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { METRIC_THEMES, ANIMATION_VARIANTS, TRANSITIONS, MetricTheme } from '../constants'

export interface MetricCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon: LucideIcon
  theme?: MetricTheme
  change?: number
  changeLabel?: string
  loading?: boolean
  delay?: number
  className?: string
  onClick?: () => void
}

export function MetricCard({
  title,
  value,
  subtitle,
  icon: Icon,
  theme = 'users',
  change,
  changeLabel,
  loading = false,
  delay = 0,
  className,
  onClick,
}: MetricCardProps) {
  const themeStyles = METRIC_THEMES[theme]

  const getTrendIcon = () => {
    if (change === undefined) return null
    if (change > 0) return <TrendingUp className="h-4 w-4" />
    if (change < 0) return <TrendingDown className="h-4 w-4" />
    return <Minus className="h-4 w-4" />
  }

  const getTrendColor = () => {
    if (change === undefined) return ''
    if (change > 0) return 'text-emerald-600 dark:text-emerald-400'
    if (change < 0) return 'text-rose-600 dark:text-rose-400'
    return 'text-gray-500'
  }

  if (loading) {
    return (
      <div className={cn(
        'rounded-2xl p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700',
        'animate-pulse',
        className
      )}>
        <div className="flex items-start justify-between mb-4">
          <div className="h-12 w-12 bg-gray-200 dark:bg-gray-700 rounded-xl" />
          <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded-full" />
        </div>
        <div className="space-y-2">
          <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
          <div className="h-8 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
          <div className="h-3 w-20 bg-gray-200 dark:bg-gray-700 rounded" />
        </div>
      </div>
    )
  }

  return (
    <motion.div
      variants={ANIMATION_VARIANTS.slideUp}
      initial="initial"
      animate="animate"
      transition={{ ...TRANSITIONS.normal, delay }}
      onClick={onClick}
      className={cn(
        'group relative rounded-2xl p-6 overflow-hidden',
        'bg-white dark:bg-gray-800',
        'border border-gray-200 dark:border-gray-700',
        'hover:shadow-xl hover:border-gray-300 dark:hover:border-gray-600',
        'transition-all duration-300 cursor-pointer',
        className
      )}
    >
      {/* Gradient Overlay on Hover */}
      <div className={cn(
        'absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-300',
        `bg-gradient-to-br ${themeStyles.gradient}`
      )} />

      {/* Content */}
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          {/* Icon */}
          <div className={cn(
            'p-3 rounded-xl transition-transform duration-300 group-hover:scale-110',
            themeStyles.iconBg
          )}>
            <Icon className={cn('h-6 w-6', themeStyles.iconColor)} />
          </div>

          {/* Change Indicator */}
          {change !== undefined && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: delay + 0.2 }}
              className={cn(
                'flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium',
                change > 0 && 'bg-emerald-100 dark:bg-emerald-900/30',
                change < 0 && 'bg-rose-100 dark:bg-rose-900/30',
                change === 0 && 'bg-gray-100 dark:bg-gray-700',
                getTrendColor()
              )}
            >
              {getTrendIcon()}
              <span>{Math.abs(change)}%</span>
            </motion.div>
          )}
        </div>

        {/* Title */}
        <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
          {title}
        </p>

        {/* Value */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: delay + 0.1 }}
          className="text-3xl font-bold text-gray-900 dark:text-white mb-1"
        >
          {typeof value === 'number' ? value.toLocaleString('fa-IR') : value}
        </motion.p>

        {/* Subtitle */}
        {subtitle && (
          <p className="text-xs text-gray-500 dark:text-gray-500">
            {subtitle}
          </p>
        )}

        {/* Change Label */}
        {changeLabel && (
          <p className={cn('text-xs mt-2', getTrendColor())}>
            {changeLabel}
          </p>
        )}
      </div>
    </motion.div>
  )
}

export default MetricCard
