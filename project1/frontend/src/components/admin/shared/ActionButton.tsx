import { forwardRef } from 'react'
import { motion } from 'framer-motion'
import { LucideIcon, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface ActionButtonProps {
  icon?: LucideIcon
  label?: string
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  iconOnly?: boolean
  disabled?: boolean
  className?: string
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
  children?: React.ReactNode
}

const variantClasses = {
  primary: 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/25',
  secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-900 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white',
  success: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-500/25',
  warning: 'bg-amber-500 hover:bg-amber-600 text-white shadow-lg shadow-amber-500/25',
  danger: 'bg-rose-600 hover:bg-rose-700 text-white shadow-lg shadow-rose-500/25',
  ghost: 'bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300',
}

const sizeClasses = {
  sm: 'px-3 py-1.5 text-sm gap-1.5',
  md: 'px-4 py-2 text-sm gap-2',
  lg: 'px-6 py-3 text-base gap-2',
}

const iconSizeClasses = {
  sm: 'h-3.5 w-3.5',
  md: 'h-4 w-4',
  lg: 'h-5 w-5',
}

const iconOnlySizeClasses = {
  sm: 'p-1.5',
  md: 'p-2',
  lg: 'p-3',
}

export const ActionButton = forwardRef<HTMLButtonElement, ActionButtonProps>(
  ({ 
    icon: Icon, 
    label, 
    variant = 'primary', 
    size = 'md', 
    loading = false,
    iconOnly = false,
    className,
    disabled,
    onClick,
    type = 'button',
    children,
  }, ref) => {
    const isDisabled = disabled || loading

    return (
      <motion.button
        ref={ref}
        type={type}
        onClick={onClick}
        whileHover={!isDisabled ? { scale: 1.02 } : undefined}
        whileTap={!isDisabled ? { scale: 0.98 } : undefined}
        disabled={isDisabled}
        className={cn(
          'inline-flex items-center justify-center font-medium rounded-lg',
          'transition-colors duration-200',
          'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          variantClasses[variant],
          iconOnly ? iconOnlySizeClasses[size] : sizeClasses[size],
          className
        )}
      >
        {loading ? (
          <Loader2 className={cn('animate-spin', iconSizeClasses[size])} />
        ) : Icon ? (
          <Icon className={iconSizeClasses[size]} />
        ) : null}
        {!iconOnly && (label || children) && (
          <span>{label || children}</span>
        )}
      </motion.button>
    )
  }
)

ActionButton.displayName = 'ActionButton'

export interface ActionButtonGroupProps {
  children: React.ReactNode
  className?: string
}

export function ActionButtonGroup({ children, className }: ActionButtonGroupProps) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      {children}
    </div>
  )
}

export default ActionButton
