import { ReactNode, forwardRef } from 'react'
import { motion, HTMLMotionProps } from 'framer-motion'
import { cn } from '@/lib/utils'
import { ANIMATION_VARIANTS, TRANSITIONS, CARD_VARIANTS } from '../constants'

export interface DashboardCardProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  children: ReactNode
  variant?: keyof typeof CARD_VARIANTS
  gradient?: string
  noPadding?: boolean
  hover?: boolean
  delay?: number
  className?: string
}

export const DashboardCard = forwardRef<HTMLDivElement, DashboardCardProps>(
  ({ 
    children, 
    variant = 'elevated', 
    gradient,
    noPadding = false,
    hover = true,
    delay = 0,
    className,
    ...props 
  }, ref) => {
    const baseStyles = cn(
      'rounded-2xl overflow-hidden',
      variant === 'gradient' && gradient 
        ? `bg-gradient-to-br ${gradient}` 
        : CARD_VARIANTS[variant],
      hover && 'hover:shadow-xl transition-all duration-300',
      !noPadding && 'p-6',
      className
    )

    return (
      <motion.div
        ref={ref}
        variants={ANIMATION_VARIANTS.slideUp}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ ...TRANSITIONS.normal, delay }}
        className={baseStyles}
        {...props}
      >
        {children}
      </motion.div>
    )
  }
)

DashboardCard.displayName = 'DashboardCard'
