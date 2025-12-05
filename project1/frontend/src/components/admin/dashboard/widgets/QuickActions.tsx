import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { 
  UserPlus, 
  Calendar, 
  Users, 
  FileText, 
  Settings, 
  BarChart3,
  GraduationCap,
  FolderKanban,
  LucideIcon
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { ChartCard } from '../base'
import { ANIMATION_VARIANTS } from '../constants'

interface QuickAction {
  icon: LucideIcon
  label: string
  description: string
  path: string
  color: string
  bgColor: string
}

interface QuickActionsProps {
  delay?: number
}

const actions: QuickAction[] = [
  {
    icon: UserPlus,
    label: 'کاربر جدید',
    description: 'افزودن کاربر',
    path: '/admin/users',
    color: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-100 dark:bg-blue-900/30 hover:bg-blue-200 dark:hover:bg-blue-900/50',
  },
  {
    icon: Calendar,
    label: 'رویداد جدید',
    description: 'ایجاد رویداد',
    path: '/admin/events/create',
    color: 'text-purple-600 dark:text-purple-400',
    bgColor: 'bg-purple-100 dark:bg-purple-900/30 hover:bg-purple-200 dark:hover:bg-purple-900/50',
  },
  {
    icon: Users,
    label: 'تیم جدید',
    description: 'ایجاد تیم',
    path: '/admin/teams/create',
    color: 'text-emerald-600 dark:text-emerald-400',
    bgColor: 'bg-emerald-100 dark:bg-emerald-900/30 hover:bg-emerald-200 dark:hover:bg-emerald-900/50',
  },
  {
    icon: GraduationCap,
    label: 'دوره جدید',
    description: 'ایجاد دوره آموزشی',
    path: '/admin/trainings/create',
    color: 'text-amber-600 dark:text-amber-400',
    bgColor: 'bg-amber-100 dark:bg-amber-900/30 hover:bg-amber-200 dark:hover:bg-amber-900/50',
  },
  {
    icon: FileText,
    label: 'درخواست‌ها',
    description: 'بررسی درخواست‌ها',
    path: '/admin/aaco-applications',
    color: 'text-rose-600 dark:text-rose-400',
    bgColor: 'bg-rose-100 dark:bg-rose-900/30 hover:bg-rose-200 dark:hover:bg-rose-900/50',
  },
  {
    icon: BarChart3,
    label: 'گزارش‌ها',
    description: 'مشاهده گزارش‌ها',
    path: '/admin/reports',
    color: 'text-cyan-600 dark:text-cyan-400',
    bgColor: 'bg-cyan-100 dark:bg-cyan-900/30 hover:bg-cyan-200 dark:hover:bg-cyan-900/50',
  },
  {
    icon: FolderKanban,
    label: 'پروژه‌ها',
    description: 'مدیریت پروژه‌ها',
    path: '/admin/projects',
    color: 'text-indigo-600 dark:text-indigo-400',
    bgColor: 'bg-indigo-100 dark:bg-indigo-900/30 hover:bg-indigo-200 dark:hover:bg-indigo-900/50',
  },
  {
    icon: Settings,
    label: 'تنظیمات',
    description: 'تنظیمات سیستم',
    path: '/admin/settings',
    color: 'text-gray-600 dark:text-gray-400',
    bgColor: 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600',
  },
]

export function QuickActions({ delay = 0 }: QuickActionsProps) {
  const navigate = useNavigate()

  return (
    <ChartCard
      title="دسترسی سریع"
      subtitle="اقدامات پرکاربرد"
      delay={delay}
      contentClassName="p-4"
    >
      <motion.div
        variants={ANIMATION_VARIANTS.stagger}
        initial="initial"
        animate="animate"
        className="grid grid-cols-4 gap-3"
      >
        {actions.map((action, index) => (
          <motion.button
            key={action.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: delay + 0.1 + index * 0.05 }}
            onClick={() => navigate(action.path)}
            className={cn(
              'flex flex-col items-center gap-2 p-4 rounded-xl',
              'transition-all duration-300',
              'hover:shadow-md hover:scale-105',
              action.bgColor
            )}
          >
            <action.icon className={cn('h-6 w-6', action.color)} />
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              {action.label}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400 hidden sm:block">
              {action.description}
            </span>
          </motion.button>
        ))}
      </motion.div>
    </ChartCard>
  )
}

export default QuickActions
