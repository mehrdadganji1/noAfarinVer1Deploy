import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

export interface LoadingStateProps {
  variant?: 'spinner' | 'dots' | 'pulse' | 'skeleton'
  size?: 'sm' | 'md' | 'lg'
  text?: string
  className?: string
}

export function LoadingState({
  variant = 'spinner',
  size = 'md',
  text,
  className,
}: LoadingStateProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  }

  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  }

  return (
    <div className={cn('flex flex-col items-center justify-center gap-3', className)}>
      {variant === 'spinner' && (
        <div className={cn(
          'animate-spin rounded-full border-2 border-gray-200 dark:border-gray-700',
          'border-t-blue-600 dark:border-t-blue-400',
          sizeClasses[size]
        )} />
      )}

      {variant === 'dots' && (
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className={cn(
                'rounded-full bg-blue-600 dark:bg-blue-400',
                size === 'sm' && 'h-1.5 w-1.5',
                size === 'md' && 'h-2 w-2',
                size === 'lg' && 'h-3 w-3'
              )}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </div>
      )}

      {variant === 'pulse' && (
        <div className="relative">
          <div className={cn(
            'rounded-full bg-blue-600/20 dark:bg-blue-400/20',
            sizeClasses[size]
          )} />
          <motion.div
            className={cn(
              'absolute inset-0 rounded-full bg-blue-600 dark:bg-blue-400',
              sizeClasses[size]
            )}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.5, 0, 0.5],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
            }}
          />
        </div>
      )}

      {variant === 'skeleton' && (
        <div className="w-full space-y-3">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-3/4" />
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-1/2" />
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-2/3" />
        </div>
      )}

      {text && (
        <p className={cn(
          'text-gray-500 dark:text-gray-400',
          textSizeClasses[size]
        )}>
          {text}
        </p>
      )}
    </div>
  )
}

export interface PageLoadingProps {
  title?: string
  showHeader?: boolean
  showStats?: boolean
  statsCount?: number
  showFilters?: boolean
  itemsCount?: number
  itemsPerRow?: number
}

export function PageLoading({
  title = 'در حال بارگذاری...',
  showHeader = true,
  showStats = true,
  statsCount = 4,
  showFilters = true,
  itemsCount = 6,
  itemsPerRow = 3,
}: PageLoadingProps) {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header Skeleton */}
      {showHeader && (
        <div className="h-32 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 rounded-2xl" />
      )}

      {/* Stats Skeleton */}
      {showStats && (
        <div className={`grid grid-cols-2 md:grid-cols-${statsCount} gap-4`}>
          {Array.from({ length: statsCount }).map((_, i) => (
            <div key={i} className="h-24 bg-gray-200 dark:bg-gray-800 rounded-xl" />
          ))}
        </div>
      )}

      {/* Filters Skeleton */}
      {showFilters && (
        <div className="h-16 bg-gray-200 dark:bg-gray-800 rounded-xl" />
      )}

      {/* Items Skeleton */}
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${itemsPerRow} gap-6`}>
        {Array.from({ length: itemsCount }).map((_, i) => (
          <div key={i} className="h-64 bg-gray-200 dark:bg-gray-800 rounded-xl" />
        ))}
      </div>
    </div>
  )
}

export default LoadingState
