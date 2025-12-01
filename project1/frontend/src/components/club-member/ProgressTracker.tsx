import { LucideIcon, CheckCircle2, Circle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import { type ColorName, getColorConfig } from '@/styles/design-tokens'
import { Card, CardContent } from '@/components/ui/card'

export interface ProgressItem {
  /** برچسب */
  label: string
  
  /** مقدار فعلی */
  value: number
  
  /** مقدار حداکثر */
  maxValue: number
  
  /** آیکون */
  icon: LucideIcon
  
  /** رنگ */
  color: ColorName
  
  /** توضیحات */
  description?: string
}

export interface ProgressTrackerProps {
  /** آیتم‌های پیشرفت */
  items: ProgressItem[]
  
  /** جهت */
  orientation?: 'horizontal' | 'vertical'
  
  /** نمایش خط اتصال */
  showConnector?: boolean
  
  /** کامپکت */
  compact?: boolean
  
  /** کلاس CSS */
  className?: string
}

export default function ProgressTracker({
  items,
  orientation = 'vertical',
  showConnector = true,
  compact = false,
  className,
}: ProgressTrackerProps) {
  return (
    <div
      className={cn(
        'flex gap-4',
        orientation === 'vertical' ? 'flex-col' : 'flex-row flex-wrap',
        className
      )}
    >
      {items.map((item, index) => {
        const percentage = Math.round((item.value / item.maxValue) * 100)
        const isComplete = percentage >= 100
        const colorConfig = getColorConfig(item.color)
        const Icon = item.icon

        return (
          <div
            key={index}
            className={cn(
              'flex',
              orientation === 'vertical' ? 'flex-row items-start' : 'flex-col items-center',
              orientation === 'horizontal' && 'flex-1 min-w-[200px]'
            )}
          >
            {/* Icon + Connector */}
            <div className={cn('flex', orientation === 'vertical' ? 'flex-col items-center' : 'flex-row items-center')}>
              {/* Icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.1, type: 'spring' }}
                className={cn(
                  'rounded-full flex items-center justify-center flex-shrink-0 relative z-10',
                  `bg-gradient-to-br ${colorConfig.bgGradient}`,
                  `border-3`,
                  isComplete ? 'border-green-500' : `border-${item.color}-300`,
                  compact ? 'w-10 h-10' : 'w-12 h-12'
                )}
              >
                {isComplete ? (
                  <CheckCircle2 className={cn('text-green-600', compact ? 'h-5 w-5' : 'h-6 w-6')} />
                ) : (
                  <Icon className={cn(colorConfig.iconColor, compact ? 'h-5 w-5' : 'h-6 w-6')} />
                )}

                {/* Progress Ring */}
                {!isComplete && (
                  <svg
                    className="absolute inset-0 w-full h-full -rotate-90"
                    viewBox="0 0 36 36"
                  >
                    <circle
                      cx="18"
                      cy="18"
                      r="16"
                      fill="none"
                      className={`stroke-${item.color}-200`}
                      strokeWidth="2"
                    />
                    <motion.circle
                      cx="18"
                      cy="18"
                      r="16"
                      fill="none"
                      className={`stroke-${item.color}-600`}
                      strokeWidth="2"
                      strokeLinecap="round"
                      initial={{ strokeDasharray: '100, 100' }}
                      animate={{ strokeDasharray: `${percentage}, 100` }}
                      transition={{ duration: 1, delay: index * 0.1 }}
                    />
                  </svg>
                )}
              </motion.div>

              {/* Connector Line */}
              {showConnector && index < items.length - 1 && (
                <div
                  className={cn(
                    'bg-gray-300',
                    orientation === 'vertical'
                      ? 'w-0.5 h-8 mx-auto'
                      : 'h-0.5 w-8 my-auto'
                  )}
                />
              )}
            </div>

            {/* Content */}
            <motion.div
              initial={{ opacity: 0, x: orientation === 'vertical' ? -10 : 0, y: orientation === 'horizontal' ? 10 : 0 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ delay: index * 0.1 + 0.2 }}
              className={cn(
                'flex-1',
                orientation === 'vertical' ? 'mr-4' : 'mt-3 text-center'
              )}
            >
              {/* Label + Percentage */}
              <div className="flex items-center justify-between mb-1">
                <h4 className={cn('font-semibold text-gray-800', compact ? 'text-sm' : 'text-base')}>
                  {item.label}
                </h4>
                <span
                  className={cn(
                    'text-xs font-bold',
                    isComplete ? 'text-green-600' : `text-${item.color}-600`
                  )}
                >
                  {percentage}%
                </span>
              </div>

              {/* Value */}
              <div className="flex items-baseline gap-1 mb-2">
                <span className={cn('font-bold', compact ? 'text-lg' : 'text-xl', colorConfig.textColor)}>
                  {item.value}
                </span>
                <span className="text-gray-400 text-sm">/ {item.maxValue}</span>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden mb-1">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(percentage, 100)}%` }}
                  transition={{ duration: 0.8, delay: index * 0.1 + 0.3 }}
                  className={cn(
                    'h-full rounded-full',
                    isComplete
                      ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                      : `bg-gradient-to-r ${colorConfig.gradient}`
                  )}
                />
              </div>

              {/* Description */}
              {item.description && (
                <p className="text-xs text-gray-500 mt-1">{item.description}</p>
              )}
            </motion.div>
          </div>
        )
      })}
    </div>
  )
}

// ============================================
// PROGRESS TRACKER CARD
// ============================================

export interface ProgressTrackerCardProps {
  title: string
  subtitle?: string
  items: ProgressItem[]
  orientation?: 'horizontal' | 'vertical'
  showConnector?: boolean
  compact?: boolean
}

export function ProgressTrackerCard({
  title,
  subtitle,
  items,
  orientation = 'vertical',
  showConnector = true,
  compact = false,
}: ProgressTrackerCardProps) {
  const totalProgress = Math.round(
    items.reduce((sum, item) => sum + (item.value / item.maxValue) * 100, 0) / items.length
  )

  return (
    <Card>
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-gray-900">{title}</h3>
            {subtitle && <p className="text-sm text-gray-600 mt-1">{subtitle}</p>}
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-purple-600">{totalProgress}%</div>
            <p className="text-xs text-gray-500">پیشرفت کلی</p>
          </div>
        </div>

        {/* Progress Items */}
        <ProgressTracker
          items={items}
          orientation={orientation}
          showConnector={showConnector}
          compact={compact}
        />
      </CardContent>
    </Card>
  )
}
