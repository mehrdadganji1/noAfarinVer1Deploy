import { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { LucideIcon, RefreshCw } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ANIMATION_VARIANTS, TRANSITIONS, GRADIENTS, GradientType } from '../constants'

export interface DashboardHeaderProps {
  title: string
  subtitle?: string
  icon: LucideIcon
  badge?: string
  gradient?: GradientType
  onRefresh?: () => void
  isRefreshing?: boolean
  actions?: ReactNode
  className?: string
}

export function DashboardHeader({
  title,
  subtitle,
  icon: Icon,
  badge,
  gradient = 'primary',
  onRefresh,
  isRefreshing = false,
  actions,
  className,
}: DashboardHeaderProps) {
  return (
    <motion.div
      variants={ANIMATION_VARIANTS.slideDown}
      initial="initial"
      animate="animate"
      transition={TRANSITIONS.normal}
      className={cn(
        'relative overflow-hidden rounded-3xl p-8 text-white shadow-2xl',
        `bg-gradient-to-br ${GRADIENTS[gradient]}`,
        className
      )}
    >
      {/* Background Decorations */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-white rounded-full blur-2xl -translate-x-1/2 -translate-y-1/2 opacity-50" />
      </div>

      {/* Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      {/* Content */}
      <div className="relative z-10">
        <div className="flex items-start justify-between">
          {/* Left Side - Title & Icon */}
          <div className="flex-1">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="flex items-center gap-4 mb-3"
            >
              <div className="p-4 bg-white/20 backdrop-blur-sm rounded-2xl shadow-lg">
                <Icon className="h-10 w-10" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold">{title}</h1>
                {subtitle && (
                  <p className="text-white/90 text-lg mt-1">{subtitle}</p>
                )}
              </div>
            </motion.div>
          </div>

          {/* Right Side - Badge & Actions */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col items-end gap-3"
          >
            {badge && (
              <div className="flex items-center gap-2 px-5 py-3 bg-white/20 backdrop-blur-sm rounded-full">
                <Icon className="h-5 w-5" />
                <span className="text-sm font-semibold">{badge}</span>
              </div>
            )}

            <div className="flex items-center gap-2">
              {onRefresh && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onRefresh}
                  disabled={isRefreshing}
                  className="text-white hover:bg-white/20"
                >
                  <RefreshCw className={cn('h-4 w-4 ml-2', isRefreshing && 'animate-spin')} />
                  بروزرسانی
                </Button>
              )}
              {actions}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}

export default DashboardHeader
