import { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import { getColorConfig, type ColorName } from '@/styles/design-tokens'

export interface MetricCardProps {
  /** برچسب */
  label: string
  
  /** مقدار فعلی */
  value: number
  
  /** مقدار حداکثر */
  maxValue: number
  
  /** واحد */
  unit: string
  
  /** آیکون */
  icon: LucideIcon
  
  /** رنگ تم */
  color: ColorName
  
  /** نمایش progress bar */
  showProgress?: boolean
  
  /** نمایش درصد */
  showPercentage?: boolean
  
  /** کامپکت */
  compact?: boolean
  
  /** کلاس CSS */
  className?: string
}

export default function MetricCard({
  label,
  value,
  maxValue,
  unit,
  icon: Icon,
  color,
  showProgress = true,
  showPercentage = true,
  compact = false,
  className,
}: MetricCardProps) {
  const colorConfig = getColorConfig(color)
  const percentage = Math.round((value / maxValue) * 100)
  const isComplete = percentage >= 100

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={cn(
        'bg-white rounded-xl border-2 transition-all duration-300',
        `border-${color}-200 hover:border-${color}-400`,
        compact ? 'p-3' : 'p-4',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        {/* Icon */}
        <div
          className={cn(
            'rounded-lg flex items-center justify-center',
            `bg-gradient-to-br ${colorConfig.bgGradient}`,
            compact ? 'w-8 h-8' : 'w-10 h-10'
          )}
        >
          <Icon className={cn(compact ? 'h-4 w-4' : 'h-5 w-5', colorConfig.iconColor)} />
        </div>

        {/* Percentage Badge */}
        {showPercentage && (
          <div
            className={cn(
              'px-2 py-1 rounded-full text-xs font-bold',
              isComplete
                ? 'bg-green-100 text-green-700'
                : `bg-${color}-100 text-${color}-700`
            )}
          >
            {percentage}%
          </div>
        )}
      </div>

      {/* Label */}
      <h4 className={cn('font-medium text-gray-700 mb-2', compact ? 'text-xs' : 'text-sm')}>
        {label}
      </h4>

      {/* Value Display */}
      <div className="flex items-baseline gap-1 mb-3">
        <span className={cn('font-bold text-gray-900', compact ? 'text-xl' : 'text-2xl')}>
          {value}
        </span>
        <span className="text-gray-400 text-sm">/ {maxValue}</span>
        <span className="text-gray-500 text-xs mr-1">{unit}</span>
      </div>

      {/* Progress Bar */}
      {showProgress && (
        <div className="relative w-full bg-gray-200 rounded-full h-2 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(percentage, 100)}%` }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
            className={cn(
              'h-full rounded-full',
              isComplete
                ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                : `bg-gradient-to-r ${colorConfig.gradient}`
            )}
          />
          
          {/* Glow effect when complete */}
          {isComplete && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-400 opacity-50"
            />
          )}
        </div>
      )}
    </motion.div>
  )
}

// ============================================
// METRIC CARD LIST
// ============================================

export interface MetricCardListProps {
  metrics: Array<Omit<MetricCardProps, 'className'>>
  columns?: 1 | 2 | 3 | 4
  compact?: boolean
  className?: string
}

export function MetricCardList({
  metrics,
  columns = 3,
  compact = false,
  className,
}: MetricCardListProps) {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  }

  return (
    <div className={cn('grid gap-4', gridCols[columns], className)}>
      {metrics.map((metric, index) => (
        <MetricCard key={index} {...metric} compact={compact} />
      ))}
    </div>
  )
}
