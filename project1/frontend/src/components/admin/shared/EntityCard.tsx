import { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { LucideIcon, MoreVertical, Eye, Edit, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'

export interface EntityCardProps {
  title: string
  subtitle?: string
  description?: string
  image?: string
  icon?: LucideIcon
  iconBg?: string
  iconColor?: string
  badges?: Array<{
    label: string
    variant?: 'default' | 'success' | 'warning' | 'error' | 'info'
  }>
  metadata?: Array<{
    icon: LucideIcon
    label: string
    value: string | number
    color?: string
  }>
  onView?: () => void
  onEdit?: () => void
  onDelete?: () => void
  actions?: Array<{
    icon: LucideIcon
    label: string
    onClick: () => void
    variant?: 'default' | 'destructive'
  }>
  footer?: ReactNode
  delay?: number
  className?: string
}

const badgeVariants = {
  default: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
  success: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
  warning: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
  error: 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400',
  info: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
}

export function EntityCard({
  title,
  subtitle,
  description,
  image,
  icon: Icon,
  iconBg = 'bg-blue-100 dark:bg-blue-900/30',
  iconColor = 'text-blue-600 dark:text-blue-400',
  badges = [],
  metadata = [],
  onView,
  onEdit,
  onDelete,
  actions = [],
  footer,
  delay = 0,
  className,
}: EntityCardProps) {
  const hasActions = onView || onEdit || onDelete || actions.length > 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={cn(
        'group relative rounded-xl overflow-hidden',
        'bg-white dark:bg-gray-800',
        'border border-gray-200 dark:border-gray-700',
        'hover:shadow-xl hover:border-gray-300 dark:hover:border-gray-600',
        'transition-all duration-300',
        className
      )}
    >
      {/* Image or Icon Header */}
      {(image || Icon) && (
        <div className="relative h-32 bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-900">
          {image ? (
            <img src={image} alt={title} className="w-full h-full object-cover" />
          ) : Icon && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className={cn('p-4 rounded-2xl', iconBg)}>
                <Icon className={cn('h-10 w-10', iconColor)} />
              </div>
            </div>
          )}
          
          {/* Actions Menu */}
          {hasActions && (
            <div className="absolute top-3 left-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-800"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {onView && (
                    <DropdownMenuItem onClick={onView}>
                      <Eye className="h-4 w-4 ml-2" />
                      مشاهده
                    </DropdownMenuItem>
                  )}
                  {onEdit && (
                    <DropdownMenuItem onClick={onEdit}>
                      <Edit className="h-4 w-4 ml-2" />
                      ویرایش
                    </DropdownMenuItem>
                  )}
                  {actions.map((action, index) => (
                    <DropdownMenuItem
                      key={index}
                      onClick={action.onClick}
                      className={action.variant === 'destructive' ? 'text-rose-600' : ''}
                    >
                      <action.icon className="h-4 w-4 ml-2" />
                      {action.label}
                    </DropdownMenuItem>
                  ))}
                  {onDelete && (
                    <DropdownMenuItem onClick={onDelete} className="text-rose-600">
                      <Trash2 className="h-4 w-4 ml-2" />
                      حذف
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>
      )}

      {/* Content */}
      <div className="p-4">
        {/* Badges */}
        {badges.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {badges.map((badge, index) => (
              <Badge
                key={index}
                className={cn('text-xs', badgeVariants[badge.variant || 'default'])}
              >
                {badge.label}
              </Badge>
            ))}
          </div>
        )}

        {/* Title & Subtitle */}
        <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-1 mb-1">
          {title}
        </h3>
        {subtitle && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
            {subtitle}
          </p>
        )}

        {/* Description */}
        {description && (
          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-4">
            {description}
          </p>
        )}

        {/* Metadata */}
        {metadata.length > 0 && (
          <div className="space-y-2 mb-4">
            {metadata.map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400"
              >
                <item.icon className={cn('h-4 w-4', item.color)} />
                <span className="truncate">{item.label}: {item.value}</span>
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        {footer && (
          <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
            {footer}
          </div>
        )}

        {/* Quick Actions */}
        {(onView || onEdit) && !footer && (
          <div className="flex gap-2 pt-3 border-t border-gray-200 dark:border-gray-700">
            {onView && (
              <Button variant="outline" size="sm" className="flex-1" onClick={onView}>
                <Eye className="h-4 w-4 ml-1" />
                مشاهده
              </Button>
            )}
            {onEdit && (
              <Button variant="outline" size="sm" className="flex-1" onClick={onEdit}>
                <Edit className="h-4 w-4 ml-1" />
                ویرایش
              </Button>
            )}
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default EntityCard
