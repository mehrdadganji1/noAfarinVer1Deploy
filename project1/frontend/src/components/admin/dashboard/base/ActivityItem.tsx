import { motion } from 'framer-motion'
import { LucideIcon, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ANIMATION_VARIANTS, TRANSITIONS } from '../constants'

export interface ActivityItemProps {
  icon: LucideIcon
  iconBg?: string
  iconColor?: string
  title: string
  description: string
  time: string
  onClick?: () => void
  delay?: number
  className?: string
}

export function ActivityItem({
  icon: Icon,
  iconBg = 'bg-blue-100 dark:bg-blue-900/30',
  iconColor = 'text-blue-600 dark:text-blue-400',
  title,
  description,
  time,
  onClick,
  delay = 0,
  className,
}: ActivityItemProps) {
  return (
    <motion.div
      variants={ANIMATION_VARIANTS.slideLeft}
      initial="initial"
      animate="animate"
      transition={{ ...TRANSITIONS.normal, delay }}
      onClick={onClick}
      className={cn(
        'group flex items-start gap-4 p-4 rounded-xl',
        'bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-800/50',
        'border border-gray-200 dark:border-gray-700',
        'hover:from-gray-100 hover:to-gray-50 dark:hover:from-gray-700 dark:hover:to-gray-800',
        'hover:border-gray-300 dark:hover:border-gray-600',
        'cursor-pointer transition-all duration-300',
        className
      )}
    >
      {/* Icon */}
      <div className={cn(
        'p-3 rounded-xl transition-transform duration-300 group-hover:scale-110',
        iconBg
      )}>
        <Icon className={cn('h-5 w-5', iconColor)} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-gray-900 dark:text-white mb-1 truncate">
          {title}
        </h4>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
          {description}
        </p>
        <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-500">
          <Clock className="h-3 w-3" />
          <span>{time}</span>
        </div>
      </div>

      {/* Hover Indicator */}
      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
      </div>
    </motion.div>
  )
}

export default ActivityItem
