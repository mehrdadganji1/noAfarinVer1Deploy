import { LucideIcon, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import { type ColorName, getColorConfig } from '@/styles/design-tokens'

export interface SectionHeaderProps {
  /** عنوان اصلی */
  title: string
  
  /** زیرعنوان */
  subtitle?: string
  
  /** آیکون */
  icon?: LucideIcon
  
  /** رنگ آیکون */
  iconColor?: ColorName
  
  /** اکشن (دکمه سمت راست) */
  action?: {
    label: string
    onClick: () => void
    icon?: LucideIcon
  }
  
  /** Badge */
  badge?: string | number
  
  /** رنگ Badge */
  badgeColor?: ColorName
  
  /** سایز */
  size?: 'sm' | 'md' | 'lg'
  
  /** Divider پایین */
  divider?: boolean
  
  /** کلاس CSS */
  className?: string
}

export default function SectionHeader({
  title,
  subtitle,
  icon: Icon,
  iconColor = 'purple',
  action,
  badge,
  badgeColor = 'purple',
  size = 'md',
  divider = false,
  className,
}: SectionHeaderProps) {
  const iconConfig = getColorConfig(iconColor)
  const badgeConfig = getColorConfig(badgeColor)

  const sizes = {
    sm: {
      container: 'py-2',
      icon: 'w-8 h-8',
      iconSize: 'h-4 w-4',
      title: 'text-lg',
      subtitle: 'text-xs',
    },
    md: {
      container: 'py-3',
      icon: 'w-10 h-10',
      iconSize: 'h-5 w-5',
      title: 'text-xl',
      subtitle: 'text-sm',
    },
    lg: {
      container: 'py-4',
      icon: 'w-12 h-12',
      iconSize: 'h-6 w-6',
      title: 'text-2xl',
      subtitle: 'text-base',
    },
  }

  const sizeConfig = sizes[size]

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn('flex items-center justify-between', sizeConfig.container, className)}
    >
      {/* Left Side: Icon + Title + Subtitle */}
      <div className="flex items-center gap-3 flex-1">
        {/* Icon */}
        {Icon && (
          <div
            className={cn(
              'rounded-xl flex items-center justify-center flex-shrink-0',
              `bg-gradient-to-br ${iconConfig.bgGradient}`,
              `border-2 border-${iconColor}-200`,
              sizeConfig.icon
            )}
          >
            <Icon className={cn(sizeConfig.iconSize, iconConfig.iconColor)} />
          </div>
        )}

        {/* Title + Subtitle */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h2
              className={cn(
                'font-bold text-gray-900 truncate',
                sizeConfig.title
              )}
            >
              {title}
            </h2>

            {/* Badge */}
            {badge !== undefined && (
              <Badge
                className={cn(
                  'shrink-0',
                  `bg-${badgeColor}-100 text-${badgeColor}-700 hover:bg-${badgeColor}-200`
                )}
              >
                {badge}
              </Badge>
            )}
          </div>

          {/* Subtitle */}
          {subtitle && (
            <p className={cn('text-gray-600 mt-0.5', sizeConfig.subtitle)}>
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Right Side: Action Button */}
      {action && (
        <Button
          onClick={action.onClick}
          variant="ghost"
          size={size === 'sm' ? 'sm' : 'default'}
          className={cn(
            'gap-2 shrink-0',
            `text-${iconColor}-600 hover:text-${iconColor}-700 hover:bg-${iconColor}-50`
          )}
        >
          {action.label}
          {action.icon ? (
            <action.icon className="h-4 w-4" />
          ) : (
            <ArrowLeft className="h-4 w-4" />
          )}
        </Button>
      )}

      {/* Divider */}
      {divider && (
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
      )}
    </motion.div>
  )
}

// ============================================
// SECTION CONTAINER
// ============================================

export interface SectionContainerProps {
  header: SectionHeaderProps
  children: React.ReactNode
  className?: string
  spacing?: 'sm' | 'md' | 'lg'
}

export function SectionContainer({
  header,
  children,
  className,
  spacing = 'md',
}: SectionContainerProps) {
  const spacings = {
    sm: 'space-y-3',
    md: 'space-y-4',
    lg: 'space-y-6',
  }

  return (
    <section className={cn(spacings[spacing], className)}>
      <SectionHeader {...header} />
      <div>{children}</div>
    </section>
  )
}
