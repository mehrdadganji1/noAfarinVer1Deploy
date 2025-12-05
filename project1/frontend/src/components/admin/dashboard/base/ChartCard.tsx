import { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { LucideIcon, MoreHorizontal } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ANIMATION_VARIANTS, TRANSITIONS } from '../constants'

export interface ChartCardProps {
  title: string
  subtitle?: string
  icon?: LucideIcon
  iconColor?: string
  headerGradient?: string
  children: ReactNode
  actions?: Array<{
    label: string
    onClick: () => void
    icon?: LucideIcon
  }>
  loading?: boolean
  delay?: number
  className?: string
  contentClassName?: string
}

export function ChartCard({
  title,
  subtitle,
  icon: Icon,
  iconColor = 'text-gray-600',
  headerGradient,
  children,
  actions,
  loading = false,
  delay = 0,
  className,
  contentClassName,
}: ChartCardProps) {
  if (loading) {
    return (
      <div className={cn(
        'rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700',
        'overflow-hidden animate-pulse',
        className
      )}>
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-xl" />
            <div className="space-y-2">
              <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
              <div className="h-3 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
            </div>
          </div>
        </div>
        <div className="p-6">
          <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-xl" />
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
      className={cn(
        'rounded-2xl bg-white dark:bg-gray-800',
        'border border-gray-200 dark:border-gray-700',
        'overflow-hidden hover:shadow-lg transition-shadow duration-300',
        className
      )}
    >
      {/* Header */}
      <div className={cn(
        'px-6 py-4 border-b border-gray-200 dark:border-gray-700',
        headerGradient && `bg-gradient-to-r ${headerGradient}`
      )}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {Icon && (
              <div className={cn(
                'p-2.5 rounded-xl',
                headerGradient ? 'bg-white/20' : 'bg-gray-100 dark:bg-gray-700'
              )}>
                <Icon className={cn('h-5 w-5', headerGradient ? 'text-white' : iconColor)} />
              </div>
            )}
            <div>
              <h3 className={cn(
                'font-semibold',
                headerGradient ? 'text-white' : 'text-gray-900 dark:text-white'
              )}>
                {title}
              </h3>
              {subtitle && (
                <p className={cn(
                  'text-sm',
                  headerGradient ? 'text-white/80' : 'text-gray-500 dark:text-gray-400'
                )}>
                  {subtitle}
                </p>
              )}
            </div>
          </div>

          {/* Actions Menu */}
          {actions && actions.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    'h-8 w-8',
                    headerGradient && 'text-white hover:bg-white/20'
                  )}
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {actions.map((action, index) => (
                  <DropdownMenuItem key={index} onClick={action.onClick}>
                    {action.icon && <action.icon className="h-4 w-4 ml-2" />}
                    {action.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>

      {/* Content */}
      <div className={cn('p-6', contentClassName)}>
        {children}
      </div>
    </motion.div>
  )
}

export default ChartCard
