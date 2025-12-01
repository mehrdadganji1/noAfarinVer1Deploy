import { ReactNode } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface InfoCardProps {
  title?: string
  children: ReactNode
  icon?: LucideIcon
  variant?: 'info' | 'success' | 'warning' | 'error'
  className?: string
}

const variantStyles = {
  info: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
    titleColor: 'text-blue-900',
  },
  success: {
    bg: 'bg-green-50',
    border: 'border-green-200',
    iconBg: 'bg-green-100',
    iconColor: 'text-green-600',
    titleColor: 'text-green-900',
  },
  warning: {
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-600',
    titleColor: 'text-amber-900',
  },
  error: {
    bg: 'bg-red-50',
    border: 'border-red-200',
    iconBg: 'bg-red-100',
    iconColor: 'text-red-600',
    titleColor: 'text-red-900',
  },
}

export default function InfoCard({
  title,
  children,
  icon: Icon,
  variant = 'info',
  className,
}: InfoCardProps) {
  const styles = variantStyles[variant]

  return (
    <Card className={cn('border', styles.bg, styles.border, className)}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          {Icon && (
            <div className={cn('p-2 rounded-lg flex-shrink-0', styles.iconBg)}>
              <Icon className={cn('h-4 w-4', styles.iconColor)} />
            </div>
          )}
          
          <div className="flex-1 space-y-1">
            {title && (
              <h4 className={cn('text-sm font-semibold', styles.titleColor)}>
                {title}
              </h4>
            )}
            <div className="text-sm text-neutral-700">{children}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
