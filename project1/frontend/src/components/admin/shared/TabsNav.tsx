import { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface Tab {
  id: string
  label: string
  icon?: LucideIcon
  badge?: number | string
  disabled?: boolean
}

export interface TabsNavProps {
  tabs: Tab[]
  activeTab: string
  onChange: (tabId: string) => void
  variant?: 'default' | 'pills' | 'underline' | 'cards'
  size?: 'sm' | 'md' | 'lg'
  fullWidth?: boolean
  className?: string
}

export function TabsNav({
  tabs,
  activeTab,
  onChange,
  variant = 'default',
  size = 'md',
  fullWidth = false,
  className,
}: TabsNavProps) {
  const sizeClasses = {
    sm: 'text-sm px-3 py-1.5',
    md: 'text-sm px-4 py-2',
    lg: 'text-base px-5 py-2.5',
  }

  const iconSizeClasses = {
    sm: 'h-3.5 w-3.5',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  }

  if (variant === 'pills') {
    return (
      <div className={cn(
        'flex gap-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl',
        fullWidth && 'w-full',
        className
      )}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => !tab.disabled && onChange(tab.id)}
              disabled={tab.disabled}
              className={cn(
                'relative flex items-center gap-2 rounded-lg font-medium transition-all',
                sizeClasses[size],
                fullWidth && 'flex-1 justify-center',
                tab.disabled && 'opacity-50 cursor-not-allowed',
                isActive
                  ? 'text-white'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-blue-600 rounded-lg"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-2">
                {tab.icon && <tab.icon className={iconSizeClasses[size]} />}
                {tab.label}
                {tab.badge !== undefined && (
                  <span className={cn(
                    'px-1.5 py-0.5 text-xs rounded-full',
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                  )}>
                    {tab.badge}
                  </span>
                )}
              </span>
            </button>
          )
        })}
      </div>
    )
  }

  if (variant === 'underline') {
    return (
      <div className={cn(
        'flex border-b border-gray-200 dark:border-gray-700',
        fullWidth && 'w-full',
        className
      )}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => !tab.disabled && onChange(tab.id)}
              disabled={tab.disabled}
              className={cn(
                'relative flex items-center gap-2 font-medium transition-colors',
                sizeClasses[size],
                fullWidth && 'flex-1 justify-center',
                tab.disabled && 'opacity-50 cursor-not-allowed',
                isActive
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              )}
            >
              {tab.icon && <tab.icon className={iconSizeClasses[size]} />}
              {tab.label}
              {tab.badge !== undefined && (
                <span className="px-1.5 py-0.5 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full">
                  {tab.badge}
                </span>
              )}
              {isActive && (
                <motion.div
                  layoutId="activeTabUnderline"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
            </button>
          )
        })}
      </div>
    )
  }

  if (variant === 'cards') {
    return (
      <div className={cn(
        'grid gap-3',
        fullWidth ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4' : 'flex flex-wrap',
        className
      )}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => !tab.disabled && onChange(tab.id)}
              disabled={tab.disabled}
              className={cn(
                'relative flex items-center gap-3 p-4 rounded-xl border-2 transition-all',
                tab.disabled && 'opacity-50 cursor-not-allowed',
                isActive
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 bg-white dark:bg-gray-800'
              )}
            >
              {tab.icon && (
                <div className={cn(
                  'p-2 rounded-lg',
                  isActive
                    ? 'bg-blue-100 dark:bg-blue-800/50'
                    : 'bg-gray-100 dark:bg-gray-700'
                )}>
                  <tab.icon className={cn(
                    'h-5 w-5',
                    isActive
                      ? 'text-blue-600 dark:text-blue-400'
                      : 'text-gray-600 dark:text-gray-400'
                  )} />
                </div>
              )}
              <div className="text-right">
                <p className={cn(
                  'font-medium',
                  isActive
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-gray-900 dark:text-white'
                )}>
                  {tab.label}
                </p>
                {tab.badge !== undefined && (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {tab.badge} مورد
                  </p>
                )}
              </div>
            </button>
          )
        })}
      </div>
    )
  }

  // Default variant
  return (
    <div className={cn(
      'flex gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg',
      fullWidth && 'w-full',
      className
    )}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id
        return (
          <button
            key={tab.id}
            onClick={() => !tab.disabled && onChange(tab.id)}
            disabled={tab.disabled}
            className={cn(
              'flex items-center gap-2 rounded-md font-medium transition-all',
              sizeClasses[size],
              fullWidth && 'flex-1 justify-center',
              tab.disabled && 'opacity-50 cursor-not-allowed',
              isActive
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            )}
          >
            {tab.icon && <tab.icon className={iconSizeClasses[size]} />}
            {tab.label}
            {tab.badge !== undefined && (
              <span className={cn(
                'px-1.5 py-0.5 text-xs rounded-full',
                isActive
                  ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                  : 'bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-400'
              )}>
                {tab.badge}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}

export default TabsNav
