import { motion } from 'framer-motion'
import { LucideIcon, Plus, Search, FileX } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export interface EmptyStateProps {
  icon?: LucideIcon
  title: string
  description?: string
  actionLabel?: string
  onAction?: () => void
  variant?: 'default' | 'search' | 'error'
  className?: string
}

const variantConfig = {
  default: {
    icon: FileX,
    iconColor: 'text-gray-400',
    bgColor: 'bg-gray-100 dark:bg-gray-800',
  },
  search: {
    icon: Search,
    iconColor: 'text-blue-400',
    bgColor: 'bg-blue-50 dark:bg-blue-900/20',
  },
  error: {
    icon: FileX,
    iconColor: 'text-rose-400',
    bgColor: 'bg-rose-50 dark:bg-rose-900/20',
  },
}

export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  variant = 'default',
  className,
}: EmptyStateProps) {
  const config = variantConfig[variant]
  const Icon = icon || config.icon

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'flex flex-col items-center justify-center py-16 px-4 text-center',
        'rounded-xl border border-dashed border-gray-300 dark:border-gray-700',
        'bg-gray-50/50 dark:bg-gray-900/50',
        className
      )}
    >
      <div className={cn('p-4 rounded-full mb-4', config.bgColor)}>
        <Icon className={cn('h-10 w-10', config.iconColor)} />
      </div>
      
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        {title}
      </h3>
      
      {description && (
        <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mb-6">
          {description}
        </p>
      )}
      
      {onAction && actionLabel && (
        <Button onClick={onAction}>
          <Plus className="h-4 w-4 ml-2" />
          {actionLabel}
        </Button>
      )}
    </motion.div>
  )
}

export default EmptyState
