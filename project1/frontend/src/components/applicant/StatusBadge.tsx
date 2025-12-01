import { Badge } from '@/components/ui/badge'
import { 
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  Calendar,
  UserCheck,
  LucideIcon
} from 'lucide-react'

export interface ApplicationStatus {
  value: string
  label: string
  color: string
  bgColor: string
  icon: LucideIcon
  description: string
}

export const APPLICATION_STATUSES: Record<string, ApplicationStatus> = {
  'not_submitted': {
    value: 'not_submitted',
    label: 'ثبت نشده',
    color: 'text-gray-600',
    bgColor: 'bg-gray-100',
    icon: FileText,
    description: 'هنوز درخواست خود را ثبت نکرده‌اید'
  },
  'submitted': {
    value: 'submitted',
    label: 'ثبت شده',
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    icon: Clock,
    description: 'درخواست شما ثبت شد و در انتظار بررسی است'
  },
  'pending': {
    value: 'pending',
    label: 'در انتظار بررسی',
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100',
    icon: Clock,
    description: 'درخواست شما در صف بررسی قرار دارد'
  },
  'under_review': {
    value: 'under_review',
    label: 'در حال بررسی',
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
    icon: UserCheck,
    description: 'مدارک شما در حال بررسی توسط کارشناسان است'
  },
  'interview_scheduled': {
    value: 'interview_scheduled',
    label: 'مصاحبه برنامه‌ریزی شد',
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-100',
    icon: Calendar,
    description: 'زمان مصاحبه شما تعیین شده است'
  },
  'approved': {
    value: 'approved',
    label: 'تایید شده',
    color: 'text-green-600',
    bgColor: 'bg-green-100',
    icon: CheckCircle2,
    description: 'تبریک! درخواست شما تایید شد'
  },
  'rejected': {
    value: 'rejected',
    label: 'رد شده',
    color: 'text-red-600',
    bgColor: 'bg-red-100',
    icon: XCircle,
    description: 'متاسفانه درخواست شما تایید نشد'
  }
}

interface StatusBadgeProps {
  status: string
  size?: 'sm' | 'md' | 'lg'
  showIcon?: boolean
  className?: string
}

export default function StatusBadge({ 
  status, 
  size = 'md', 
  showIcon = true,
  className = '' 
}: StatusBadgeProps) {
  const statusInfo = APPLICATION_STATUSES[status] || APPLICATION_STATUSES['not_submitted']
  const Icon = statusInfo.icon

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-2'
  }

  return (
    <Badge 
      className={`
        ${statusInfo.bgColor} 
        ${statusInfo.color} 
        border-0
        ${sizeClasses[size]}
        ${className}
      `}
    >
      {showIcon && <Icon className="h-3 w-3 ml-1" />}
      {statusInfo.label}
    </Badge>
  )
}
