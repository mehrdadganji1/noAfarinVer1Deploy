import { 
  Home, 
  Users, 
  Calendar, 
  GraduationCap,
  ClipboardCheck,
  Trophy,
  DollarSign, 
  User,
  Shield,
  Settings,
  BarChart3,
  Bell,
  Award,
  FileText,
  UserCheck,
  // MessageSquare,  // Disabled for now
  // BookOpen,  // Removed - not used after applicant navigation simplification
  // HelpCircle,  // Removed - not used after applicant navigation simplification
  FolderKanban,
  Lightbulb,
  UsersRound,
  Target,
  TrendingUp,
  Activity,
  PieChart
} from 'lucide-react'
import { UserRole, Permission } from '@/types/roles'

export interface NavigationItem {
  label: string
  path: string
  icon: React.ComponentType<{ className?: string }>
  roles?: UserRole[]
  permissions?: Permission[]
  badge?: string
  children?: NavigationItem[]
}

export interface NavigationGroup {
  title: string
  items: NavigationItem[]
  roles?: UserRole[]
}

export const navigationConfig: NavigationGroup[] = [
  // عضو باشگاه نوآفرینان
  {
    title: 'خانه',
    roles: [UserRole.CLUB_MEMBER],
    items: [
      {
        label: 'داشبورد',
        path: '/club-member/dashboard',
        icon: Home,
      },
      {
        label: 'پروفایل',
        path: '/club-member/profile',
        icon: User,
      },
      {
        label: 'اعلانات',
        path: '/club-member/notifications',
        icon: Bell,
      },
    ],
  },

  // فعالیت‌های عضو باشگاه
  {
    title: 'فعالیت‌ها',
    roles: [UserRole.CLUB_MEMBER],
    items: [
      {
        label: 'رویدادها',
        path: '/club-member/events',
        icon: Calendar,
      },
      {
        label: 'پروژه‌ها',
        path: '/club-member/projects',
        icon: FolderKanban,
      },
      {
        label: 'دوره‌ها',
        path: '/club-member/courses',
        icon: GraduationCap,
      },
    ],
  },

  // گیمیفیکیشن
  {
    title: 'پیشرفت و رقابت',
    roles: [UserRole.CLUB_MEMBER],
    items: [
      {
        label: 'گیمیفیکیشن',
        path: '/club-member/gamification',
        icon: Trophy,
      },
      {
        label: 'دستاوردها',
        path: '/club-member/achievements',
        icon: Award,
      },
      {
        label: 'جدول رتبه‌بندی',
        path: '/club-member/leaderboard',
        icon: BarChart3,
      },
      {
        label: 'فروشگاه پاداش‌ها',
        path: '/club-member/rewards',
        icon: DollarSign,
      },
      {
        label: 'چالش‌ها',
        path: '/club-member/challenges',
        icon: Target,
      },
    ],
  },

  // شبکه‌سازی و همکاری
  {
    title: 'شبکه و همکاری',
    roles: [UserRole.CLUB_MEMBER],
    items: [
      {
        label: 'شبکه اعضا',
        path: '/club-member/community',
        icon: UsersRound,
      },
      {
        label: 'تیم‌ها',
        path: '/club-member/teams',
        icon: Users,
      },
      {
        label: 'بانک ایده‌ها',
        path: '/club-member/ideas',
        icon: Lightbulb,
      },
    ],
  },

  // مدیرکل - ADMIN
  {
    title: 'داشبورد ادمین',
    roles: [UserRole.ADMIN],
    items: [
      {
        label: 'داشبورد اصلی',
        path: '/admin/dashboard',
        icon: Home,
      },
      {
        label: 'آمار و تحلیل‌ها',
        path: '/admin/analytics',
        icon: TrendingUp,
      },
      {
        label: 'گزارشات پیشرفته',
        path: '/admin/reports',
        icon: PieChart,
      },
      {
        label: 'فعالیت‌های سیستم',
        path: '/admin/activity',
        icon: Activity,
      },
    ],
  },

  // مدیریت کاربران - ADMIN
  {
    title: 'کاربران (ادمین)',
    roles: [UserRole.ADMIN],
    items: [
      {
        label: 'کاربران سیستم',
        path: '/admin/users',
        icon: Shield,
        permissions: [Permission.MANAGE_USERS],
      },
      {
        label: 'درخواست‌های عضویت',
        path: '/admin/applications',
        icon: UserCheck,
        permissions: [Permission.REVIEW_APPLICATIONS, Permission.APPROVE_APPLICATIONS],
      },
      {
        label: 'درخواست‌های AACO',
        path: '/admin/aaco-applications',
        icon: ClipboardCheck,
        permissions: [Permission.REVIEW_APPLICATIONS, Permission.APPROVE_APPLICATIONS],
        badge: 'جدید',
      },
      {
        label: 'بررسی مدارک',
        path: '/admin/documents',
        icon: FileText,
        permissions: [Permission.REVIEW_APPLICATIONS, Permission.APPROVE_APPLICATIONS],
      },
    ],
  },

  // مدیریت محتوا - ADMIN
  {
    title: 'محتوا (ادمین)',
    roles: [UserRole.ADMIN],
    items: [
      {
        label: 'تیم‌ها',
        path: '/admin/teams',
        icon: Users,
      },
      {
        label: 'رویدادها',
        path: '/admin/events',
        icon: Calendar,
      },
      {
        label: 'دوره‌های آموزشی',
        path: '/admin/trainings',
        icon: GraduationCap,
      },
      {
        label: 'تسهیلات',
        path: '/admin/fundings',
        icon: DollarSign,
      },
    ],
  },

  // تنظیمات سیستم - ADMIN
  {
    title: 'تنظیمات (ادمین)',
    roles: [UserRole.ADMIN],
    items: [
      {
        label: 'تنظیمات سیستم',
        path: '/admin/settings',
        icon: Settings,
        permissions: [Permission.SYSTEM_SETTINGS],
      },
      {
        label: 'اعلانات',
        path: '/admin/notifications',
        icon: Bell,
      },
    ],
  },

  // مدیرکل - Director Dashboard (دسترسی کامل)
  {
    title: 'داشبورد مدیرکل',
    roles: [UserRole.DIRECTOR],
    items: [
      {
        label: 'داشبورد مدیرکل',
        path: '/director/dashboard',
        icon: Shield,
      },
      {
        label: 'آمار و تحلیل پیشرفته',
        path: '/director/analytics',
        icon: BarChart3,
      },
      {
        label: 'گزارشات مدیریتی',
        path: '/director/reports',
        icon: FileText,
      },
      {
        label: 'لاگ فعالیت‌ها',
        path: '/director/activity',
        icon: Activity,
      },
    ],
  },

  // مدیریت کاربران - Director
  {
    title: 'کاربران (مدیرکل)',
    roles: [UserRole.DIRECTOR],
    items: [
      {
        label: 'کاربران',
        path: '/director/users',
        icon: Users,
      },
      {
        label: 'درخواست‌های عضویت',
        path: '/director/applications',
        icon: ClipboardCheck,
      },
      {
        label: 'درخواست‌های رویداد AACO',
        path: '/director/aaco-event-applications',
        icon: Calendar,
      },
      {
        label: 'بررسی مدارک',
        path: '/director/documents',
        icon: FileText,
      },
    ],
  },

  // مدیریت محتوا - Director
  {
    title: 'محتوا (مدیرکل)',
    roles: [UserRole.DIRECTOR],
    items: [
      {
        label: 'تیم‌ها',
        path: '/director/teams',
        icon: Users,
      },
      {
        label: 'رویدادها',
        path: '/director/events',
        icon: Calendar,
      },
      {
        label: 'دوره‌های آموزشی',
        path: '/director/trainings',
        icon: GraduationCap,
      },
      {
        label: 'تسهیلات',
        path: '/director/fundings',
        icon: DollarSign,
      },
    ],
  },

  // تنظیمات سیستم - Director
  {
    title: 'تنظیمات (مدیرکل)',
    roles: [UserRole.DIRECTOR],
    items: [
      {
        label: 'تنظیمات سیستم',
        path: '/director/settings',
        icon: Settings,
      },
      {
        label: 'اعلانات',
        path: '/director/notifications',
        icon: Bell,
      },
    ],
  },

  // مدیران - Manager, Coordinator
  {
    title: 'داشبورد مدیریت',
    roles: [UserRole.COORDINATOR, UserRole.MANAGER],
    items: [
      {
        label: 'داشبورد اصلی',
        path: '/dashboard',
        icon: Home,
      },
      {
        label: 'آمار و گزارشات',
        path: '/dashboard/analytics',
        icon: TrendingUp,
        roles: [UserRole.MANAGER],
      },
      {
        label: 'فعالیت‌های سیستم',
        path: '/dashboard/activity',
        icon: Activity,
        roles: [UserRole.MANAGER],
      },
    ],
  },

  // مدیریت محتوا - Manager, Coordinator
  {
    title: 'محتوا (مدیریت)',
    roles: [UserRole.COORDINATOR, UserRole.MANAGER],
    items: [
      {
        label: 'تیم‌ها',
        path: '/dashboard/teams',
        icon: Users,
      },
      {
        label: 'رویدادها',
        path: '/dashboard/events',
        icon: Calendar,
      },
      {
        label: 'دوره‌های آموزشی',
        path: '/dashboard/trainings',
        icon: GraduationCap,
      },
      {
        label: 'تسهیلات',
        path: '/dashboard/fundings',
        icon: DollarSign,
      },
    ],
  },

  // منتورها و داوران
  {
    title: 'منتورینگ',
    roles: [UserRole.MENTOR, UserRole.JUDGE],
    items: [
      {
        label: 'داشبورد',
        path: '/dashboard',
        icon: Home,
      },
      {
        label: 'تیم‌های من',
        path: '/mentor/teams',
        icon: Users,
        roles: [UserRole.MENTOR],
      },
      {
        label: 'پنل داوری',
        path: '/judge/panel',
        icon: ClipboardCheck,
        roles: [UserRole.JUDGE],
      },
    ],
  },

  // متقاضی در انتظار - Pending Applicant (Limited access)
  {
    title: 'پنل متقاضی',
    roles: [UserRole.APPLICANT],
    items: [
      {
        label: 'داشبورد',
        path: '/applicant/pending/dashboard',
        icon: Home,
      },
      {
        label: 'پروفایل',
        path: '/applicant/profile',
        icon: User,
      },
      {
        label: 'اعلانات',
        path: '/applicant/notifications',
        icon: Bell,
      },
    ],
  },

  // متقاضی - Applicant Dashboard (Approved applicants)
  {
    title: 'خانه',
    roles: [UserRole.APPLICANT],
    items: [
      {
        label: 'داشبورد',
        path: '/applicant/dashboard',
        icon: Home,
      },
      {
        label: 'پروفایل',
        path: '/applicant/profile',
        icon: User,
      },
      {
        label: 'اعلانات',
        path: '/applicant/notifications',
        icon: Bell,
      },
    ],
  },

  // مدیریت کاربران - Manager
  {
    title: 'کاربران و دسترسی',
    roles: [UserRole.MANAGER],
    items: [
      {
        label: 'مدیریت کاربران',
        path: '/admin/users',
        icon: Shield,
        permissions: [Permission.MANAGE_USERS],
      },
      {
        label: 'درخواست‌های عضویت',
        path: '/admin/applications',
        icon: UserCheck,
        permissions: [Permission.REVIEW_APPLICATIONS, Permission.APPROVE_APPLICATIONS],
      },
      {
        label: 'بررسی مدارک',
        path: '/admin/documents',
        icon: FileText,
        permissions: [Permission.REVIEW_APPLICATIONS, Permission.APPROVE_APPLICATIONS],
      },
    ],
  },

  // تنظیمات و گزارشات - Manager
  {
    title: 'گزارشات',
    roles: [UserRole.MANAGER],
    items: [
      {
        label: 'گزارشات تحلیلی',
        path: '/admin/reports',
        icon: PieChart,
      },
      {
        label: 'تایید تسهیلات',
        path: '/admin/fundings',
        icon: DollarSign,
        permissions: [Permission.APPROVE_FUNDING],
      },
    ],
  },
]

/**
 * Filter navigation items based on user role and permissions
 */
export function filterNavigationByRole(
  userRoles: UserRole[],
  userPermissions: Permission[]
): NavigationGroup[] {
  // اگر کاربر ADMIN یا MANAGER است، آیتم‌های APPLICANT را نشان نده
  const isAdminOrManager = userRoles.includes(UserRole.ADMIN) || userRoles.includes(UserRole.MANAGER)
  
  return navigationConfig
    .map(group => {
      // اگر کاربر ADMIN/MANAGER است و گروه فقط برای APPLICANT است، نشان نده
      if (isAdminOrManager && group.roles?.includes(UserRole.APPLICANT) && group.roles.length === 1) {
        return null
      }
      
      // Check if group is allowed for user roles
      if (group.roles && !group.roles.some(role => userRoles.includes(role))) {
        return null
      }

      // Filter items in group
      const filteredItems = group.items.filter(item => {
        // اگر کاربر ADMIN/MANAGER است و آیتم فقط برای APPLICANT است، نشان نده
        if (isAdminOrManager && item.roles?.includes(UserRole.APPLICANT) && item.roles.length === 1) {
          return false
        }
        
        // Check role restriction
        if (item.roles && !item.roles.some(role => userRoles.includes(role))) {
          return false
        }

        // Check permission restriction (user needs at least one)
        if (item.permissions && !item.permissions.some(perm => userPermissions.includes(perm))) {
          return false
        }

        return true
      })

      if (filteredItems.length === 0) {
        return null
      }

      return {
        ...group,
        items: filteredItems,
      }
    })
    .filter((group): group is NavigationGroup => group !== null)
}
