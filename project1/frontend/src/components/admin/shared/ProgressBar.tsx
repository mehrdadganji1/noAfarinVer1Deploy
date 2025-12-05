import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

export interface ProgressBarProps {
  value: number
  max?: number
  label?: string
  showValue?: boolean
  showPercentage?: boolean
  size?: 'sm' | 'md' | 'lg'
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'purple' | 'gradient'
  animated?: boolean
  className?: string
}

const colorClasses = {
  blue: 'bg-blue-500',
  green: 'bg-emerald-500',
  yellow: 'bg-amber-500',
  red: 'bg-rose-500',
  purple: 'bg-purple-500',
  gradient: 'bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500',
}

const sizeClasses = {
  sm: 'h-1.5',
  md: 'h-2.5',
  lg: 'h-4',
}

export function ProgressBar({
  value,
  max = 100,
  label,
  showValue = false,
  showPercentage = false,
  size = 'md',
  color = 'blue',
  animated = true,
  className,
}: ProgressBarProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100)

  return (
    <div className={cn('space-y-2', className)}>
      {(label || showValue || showPercentage) && (
        <div className="flex items-center justify-between text-sm">
          {label && (
            <span className="font-medium text-gray-700 dark:text-gray-300">{label}</span>
          )}
          <div className="flex items-center gap-2">
            {showValue && (
              <span className="text-gray-600 dark:text-gray-400">
                {value.toLocaleString('fa-IR')} / {max.toLocaleString('fa-IR')}
              </span>
            )}
            {showPercentage && (
              <span className="font-semibold text-gray-900 dark:text-white">
                {Math.round(percentage)}%
              </span>
            )}
          </div>
        </div>
      )}
      <div className={cn(
        'w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden',
        sizeClasses[size]
      )}>
        <motion.div
          initial={animated ? { width: 0 } : { width: `${percentage}%` }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className={cn(
            'h-full rounded-full',
            colorClasses[color]
          )}
        />
      </div>
    </div>
  )
}

export interface MultiProgressBarProps {
  segments: Array<{
    value: number
    color: string
    label?: string
  }>
  total?: number
  size?: 'sm' | 'md' | 'lg'
  showLegend?: boolean
  className?: string
}

export function MultiProgressBar({
  segments,
  total,
  size = 'md',
  showLegend = true,
  className,
}: MultiProgressBarProps) {
  const calculatedTotal = total || segments.reduce((sum, s) => sum + s.value, 0)

  return (
    <div className={cn('space-y-3', className)}>
      <div className={cn(
        'w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden flex',
        sizeClasses[size]
      )}>
        {segments.map((segment, index) => {
          const percentage = (segment.value / calculatedTotal) * 100
          return (
            <motion.div
              key={index}
              initial={{ width: 0 }}
              animate={{ width: `${percentage}%` }}
              transition={{ duration: 0.8, ease: 'easeOut', delay: index * 0.1 }}
              className={cn('h-full', segment.color)}
            />
          )
        })}
      </div>

      {showLegend && (
        <div className="flex flex-wrap gap-4">
          {segments.map((segment, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className={cn('w-3 h-3 rounded-full', segment.color)} />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {segment.label}: {segment.value.toLocaleString('fa-IR')}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ProgressBar
