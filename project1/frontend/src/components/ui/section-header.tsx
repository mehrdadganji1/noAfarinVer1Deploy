import { ReactNode } from 'react'
import { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SectionHeaderProps {
  title: string
  subtitle?: string
  icon?: LucideIcon
  action?: ReactNode
  className?: string
}

export default function SectionHeader({
  title,
  subtitle,
  icon: Icon,
  action,
  className,
}: SectionHeaderProps) {
  return (
    <div className={cn('flex items-center justify-between', className)}>
      <div className="flex items-center gap-3">
        {Icon && (
          <div className="p-2 bg-primary-50 rounded-lg">
            <Icon className="h-5 w-5 text-primary-600" />
          </div>
        )}
        <div>
          <h2 className="text-lg font-bold text-neutral-900">{title}</h2>
          {subtitle && (
            <p className="text-sm text-neutral-600 mt-0.5">{subtitle}</p>
          )}
        </div>
      </div>
      
      {action && <div>{action}</div>}
    </div>
  )
}
