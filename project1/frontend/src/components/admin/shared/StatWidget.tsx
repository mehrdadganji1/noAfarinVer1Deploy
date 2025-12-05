import { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { LucideIcon, TrendingUp, TrendingDown, Minus, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface StatWidgetProps {
  title: string
  value: string | number
  subtitle?: string
  icon?: LucideIcon
  iconBg?: string
  iconColor?: string
  change?: number
  changeLabel?: string
  trend?: 'up' | 'down' | 'neutral'
  sparkline?: number[]
  footer?: ReactNode
  variant?: 'default' | 'compact' | 'detailed'
  delay?: number
  className?: string
}

export function StatWidget({
  title,
  value,
  subtitle,
  icon: Icon,
  iconBg = 'bg-blue-100 dark:bg-blue-900/30',
  iconColor = 'text-blue-600 dark:text-blue-400',
  change,
  changeLabel,
  trend,
  sparkline,
  footer,
  variant = 'default',
  delay = 0,
  className,
}: StatWidgetProps) {
  const getTrendIcon = () => {
    const actualTrend = trend || (change !== undefined ? (change > 0 ? 'up' : change < 0 ? 'down' : 'neutral') : undefined)
    if (!actualTrend) return null
    
    const icons = {
      up: TrendingUp,
      down: TrendingDown,
      neutral: Minus,
    }
    const TrendIcon = icons[actualTrend]
    return <TrendIcon className="h-4 w-4" />
  }

  const getTrendColor = () => {
    const actualTrend = trend || (change !== undefined ? (change > 0 ? 'up' : change < 0 ? 'down' : 'neutral') : undefined)
    if (!actualTrend) return ''
    
    return {
      up: 'text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/30',
      down: 'text-rose-600 dark:text-rose-400 bg-rose-100 dark:bg-rose-900/30',
      neutral: 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700',
    }[actualTrend]
  }

  // Simple sparkline renderer
  const renderSparkline = () => {
    if (!sparkline || sparkline.length < 2) return null
    
    const max = Math.max(...sparkline)
    const min = Math.min(...sparkline)
    const range = max - min || 1
    const width = 80
    const height = 24
    const points = sparkline.map((v, i) => {
      const x = (i / (sparkline.length - 1)) * width
      const y = height - ((v - min) / range) * height
      return `${x},${y}`
    }).join(' ')

    return (
      <svg width={width} height={height} className="overflow-visible">
        <polyline
          points={points}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-blue-500"
        />
      </svg>
    )
  }

  if (variant === 'compact') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay }}
        className={cn(
          'flex items-center gap-3 p-3 rounded-xl',
          'bg-white dark:bg-gray-800',
          'border border-gray-200 dark:border-gray-700',
          className
        )}
      >
        {Icon && (
          <div className={cn('p-2 rounded-lg', iconBg)}>
            <Icon className={cn('h-4 w-4', iconColor)} />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{title}</p>
          <p className="text-lg font-bold text-gray-900 dark:text-white">
            {typeof value === 'number' ? value.toLocaleString('fa-IR') : value}
          </p>
        </div>
        {change !== undefined && (
          <div className={cn('flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium', getTrendColor())}>
            {getTrendIcon()}
            {Math.abs(change)}%
          </div>
        )}
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={cn(
        'p-5 rounded-xl',
        'bg-white dark:bg-gray-800',
        'border border-gray-200 dark:border-gray-700',
        'hover:shadow-lg transition-shadow duration-300',
        className
      )}
    >
      <div className="flex items-start justify-between mb-4">
        {Icon && (
          <div className={cn('p-3 rounded-xl', iconBg)}>
            <Icon className={cn('h-6 w-6', iconColor)} />
          </div>
        )}
        {sparkline && (
          <div className="opacity-60">
            {renderSparkline()}
          </div>
        )}
        {!sparkline && change !== undefined && (
          <div className={cn('flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium', getTrendColor())}>
            {getTrendIcon()}
            {Math.abs(change)}%
          </div>
        )}
      </div>

      <div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{title}</p>
        <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
          {typeof value === 'number' ? value.toLocaleString('fa-IR') : value}
        </p>
        {subtitle && (
          <p className="text-xs text-gray-500 dark:text-gray-400">{subtitle}</p>
        )}
        {changeLabel && (
          <p className={cn('text-xs mt-2', getTrendColor().split(' ')[0])}>
            {changeLabel}
          </p>
        )}
      </div>

      {footer && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          {footer}
        </div>
      )}
    </motion.div>
  )
}

export default StatWidget
