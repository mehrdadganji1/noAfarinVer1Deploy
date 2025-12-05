import { cn } from '@/lib/utils'

export interface StatusBadgeProps {
  status: string
  variant?: 'default' | 'dot' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const statusConfig: Record<string, { label: string; color: string; dotColor: string }> = {
  // General statuses
  active: { label: 'فعال', color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400', dotColor: 'bg-emerald-500' },
  inactive: { label: 'غیرفعال', color: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300', dotColor: 'bg-gray-500' },
  pending: { label: 'در انتظار', color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400', dotColor: 'bg-amber-500' },
  approved: { label: 'تایید شده', color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400', dotColor: 'bg-emerald-500' },
  rejected: { label: 'رد شده', color: 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400', dotColor: 'bg-rose-500' },
  
  // Event statuses
  upcoming: { label: 'آینده', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400', dotColor: 'bg-blue-500' },
  ongoing: { label: 'در حال برگزاری', color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400', dotColor: 'bg-emerald-500' },
  completed: { label: 'برگزار شده', color: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300', dotColor: 'bg-gray-500' },
  cancelled: { label: 'لغو شده', color: 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400', dotColor: 'bg-rose-500' },
  
  // Application statuses
  submitted: { label: 'ارسال شده', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400', dotColor: 'bg-blue-500' },
  'under-review': { label: 'در حال بررسی', color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400', dotColor: 'bg-amber-500' },
  
  // Team statuses
  graduated: { label: 'فارغ‌التحصیل', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400', dotColor: 'bg-purple-500' },
  
  // Phases
  ideation: { label: 'ایده‌پردازی', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400', dotColor: 'bg-blue-500' },
  validation: { label: 'اعتبارسنجی', color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400', dotColor: 'bg-amber-500' },
  mvp: { label: 'MVP', color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400', dotColor: 'bg-orange-500' },
  growth: { label: 'رشد', color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400', dotColor: 'bg-emerald-500' },
  scale: { label: 'مقیاس‌پذیری', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400', dotColor: 'bg-purple-500' },
  
  // Event types
  aaco: { label: 'AACO', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400', dotColor: 'bg-purple-500' },
  workshop: { label: 'کارگاه', color: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400', dotColor: 'bg-indigo-500' },
  industrial_visit: { label: 'بازدید صنعتی', color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400', dotColor: 'bg-orange-500' },
  training: { label: 'آموزشی', color: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-400', dotColor: 'bg-cyan-500' },
  pitch_session: { label: 'پیچینگ', color: 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-400', dotColor: 'bg-pink-500' },
  closing_ceremony: { label: 'اختتامیه', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400', dotColor: 'bg-yellow-500' },
}

const sizeClasses = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-xs',
  lg: 'px-3 py-1.5 text-sm',
}

export function StatusBadge({ status, variant = 'default', size = 'md', className }: StatusBadgeProps) {
  const config = statusConfig[status] || { 
    label: status, 
    color: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
    dotColor: 'bg-gray-500'
  }

  if (variant === 'dot') {
    return (
      <span className={cn('inline-flex items-center gap-1.5', sizeClasses[size], className)}>
        <span className={cn('w-2 h-2 rounded-full', config.dotColor)} />
        <span className="text-gray-700 dark:text-gray-300">{config.label}</span>
      </span>
    )
  }

  if (variant === 'outline') {
    return (
      <span className={cn(
        'inline-flex items-center rounded-full border font-medium',
        'border-current',
        config.color.replace('bg-', 'text-').split(' ')[0],
        sizeClasses[size],
        className
      )}>
        {config.label}
      </span>
    )
  }

  return (
    <span className={cn(
      'inline-flex items-center rounded-full font-medium',
      config.color,
      sizeClasses[size],
      className
    )}>
      {config.label}
    </span>
  )
}

export interface RoleBadgeProps {
  role: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const roleConfig: Record<string, { label: string; color: string }> = {
  admin: { label: 'مدیر', color: 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400' },
  director: { label: 'مدیر ارشد', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400' },
  club_member: { label: 'عضو باشگاه', color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400' },
  applicant: { label: 'متقاضی', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' },
  pending_applicant: { label: 'متقاضی در انتظار', color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400' },
}

export function RoleBadge({ role, size = 'md', className }: RoleBadgeProps) {
  const config = roleConfig[role] || { label: role, color: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300' }

  return (
    <span className={cn(
      'inline-flex items-center rounded-full font-medium',
      config.color,
      sizeClasses[size],
      className
    )}>
      {config.label}
    </span>
  )
}

export default StatusBadge
