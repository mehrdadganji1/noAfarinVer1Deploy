import { motion } from 'framer-motion'
import { 
  Users, 
  ClipboardCheck,
  FileText,
  BarChart3,
  Shield,
  Crown,
  Target,
  Briefcase,
  DollarSign,
  Award,
  Globe,
  Rocket,
  Eye
} from 'lucide-react'
import { useDirectorStats } from '@/hooks/useDirectorStats'
import {
  MetricsGrid,
  QuickActionsPanel,
  SystemHealthCard,
  RecentActivityFeed,
  AnalyticsChart,
  PendingTasksCard
} from '@/components/director/dashboard'
import { DashboardSkeleton } from '@/components/ui/page-skeleton'
import { DashboardMetric, QuickAction } from '@/types/director.types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function DirectorDashboard() {
  // Fetch director stats with auto-refresh
  const { data: stats, isLoading, error } = useDirectorStats(30000)

  // Loading state
  if (isLoading) {
    return <DashboardSkeleton />
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="inline-block p-6 bg-red-100 dark:bg-red-900/20 rounded-full mb-4"
          >
            <Shield className="h-16 w-16 text-red-600 dark:text-red-400" />
          </motion.div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">خطا در بارگذاری داده‌ها</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">لطفاً دوباره تلاش کنید</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            تلاش مجدد
          </button>
        </div>
      </div>
    )
  }

  // Executive-Level Metrics (بالاترین سطح)
  const executiveMetrics: DashboardMetric[] = [
    {
      id: 'total-revenue',
      label: 'کل بودجه تخصیص یافته',
      value: '2.5M',
      change: 18.5,
      changeLabel: 'نسبت به سال قبل',
      icon: DollarSign,
      color: 'emerald',
      bgGradient: 'bg-gradient-to-br from-emerald-500 to-green-600'
    },
    {
      id: 'total-users',
      label: 'کل کاربران پلتفرم',
      value: stats?.users.total || 0,
      change: stats?.users.growth || 0,
      changeLabel: 'رشد ماهانه',
      icon: Users,
      color: 'blue',
      bgGradient: 'bg-gradient-to-br from-blue-500 to-cyan-500'
    },
    {
      id: 'success-rate',
      label: 'نرخ موفقیت تیم‌ها',
      value: '87%',
      change: 12,
      changeLabel: 'بهبود عملکرد',
      icon: Target,
      color: 'purple',
      bgGradient: 'bg-gradient-to-br from-purple-500 to-pink-500'
    },
    {
      id: 'active-projects',
      label: 'پروژه‌های فعال',
      value: 156,
      change: 24,
      changeLabel: 'پروژه جدید این ماه',
      icon: Rocket,
      color: 'orange',
      bgGradient: 'bg-gradient-to-br from-orange-500 to-red-500'
    },
    {
      id: 'satisfaction',
      label: 'رضایت کاربران',
      value: '4.8/5',
      change: 8,
      changeLabel: 'افزایش رضایت',
      icon: Award,
      color: 'yellow',
      bgGradient: 'bg-gradient-to-br from-yellow-500 to-amber-500'
    },
    {
      id: 'global-reach',
      label: 'دسترسی جغرافیایی',
      value: '31 شهر',
      changeLabel: 'در سراسر کشور',
      icon: Globe,
      color: 'indigo',
      bgGradient: 'bg-gradient-to-br from-indigo-500 to-blue-600'
    }
  ]

  // Strategic Quick Actions (دسترسی‌های استراتژیک)
  const strategicActions: QuickAction[] = [
    {
      id: 'analytics',
      label: 'آمار و تحلیل پیشرفته',
      description: 'داشبورد تحلیلی و KPI های کلیدی',
      icon: BarChart3,
      path: '/director/analytics',
      color: 'indigo',
      bgGradient: 'bg-gradient-to-br from-indigo-600 to-purple-600'
    },
    {
      id: 'reports',
      label: 'گزارشات مدیریتی',
      description: 'گزارش‌های جامع و تحلیلی',
      icon: FileText,
      path: '/director/reports',
      color: 'blue',
      bgGradient: 'bg-gradient-to-br from-blue-600 to-cyan-600'
    },
    {
      id: 'activity',
      label: 'لاگ فعالیت‌های سیستم',
      description: 'نظارت بر تمام فعالیت‌ها',
      icon: Eye,
      path: '/director/activity',
      color: 'purple',
      bgGradient: 'bg-gradient-to-br from-purple-600 to-pink-600'
    },
    {
      id: 'funding',
      label: 'تایید تسهیلات',
      description: 'بررسی و تایید درخواست‌های مالی',
      icon: DollarSign,
      path: '/admin/fundings',
      color: 'green',
      bgGradient: 'bg-gradient-to-br from-green-600 to-emerald-600'
    },
    {
      id: 'applications',
      label: 'تایید نهایی درخواست‌ها',
      description: 'تصمیم‌گیری نهایی درخواست‌های عضویت',
      icon: ClipboardCheck,
      path: '/admin/applications',
      color: 'orange',
      bgGradient: 'bg-gradient-to-br from-orange-600 to-red-600'
    },
    {
      id: 'strategic',
      label: 'برنامه‌ریزی استراتژیک',
      description: 'تعیین اهداف و استراتژی‌های کلان',
      icon: Target,
      path: '/director/strategy',
      color: 'rose',
      bgGradient: 'bg-gradient-to-br from-rose-600 to-pink-600'
    }
  ]

  // Key Performance Indicators
  const kpiData = [
    { label: 'نرخ تبدیل متقاضی به عضو', value: '68%', trend: 'up', change: '+5%' },
    { label: 'میانگین زمان بررسی درخواست', value: '3.2 روز', trend: 'down', change: '-12%' },
    { label: 'نرخ حضور در رویدادها', value: '82%', trend: 'up', change: '+8%' },
    { label: 'نرخ تکمیل پروژه‌ها', value: '74%', trend: 'up', change: '+15%' },
  ]

  return (
    <div className="space-y-6 pb-8">
      {/* Executive Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600 p-8 text-white shadow-2xl"
      >
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
        </div>

        <div className="relative z-10">
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="flex items-center gap-3 mb-3"
              >
                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
                  <Crown className="h-10 w-10" />
                </div>
                <div>
                  <h1 className="text-5xl font-bold">داشبورد مدیرکل</h1>
                  <p className="text-white/90 text-xl mt-2">
                    نظارت استراتژیک و تصمیم‌گیری کلان
                  </p>
                </div>
              </motion.div>
              
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-white/80 text-base max-w-3xl"
              >
                به پنل مدیریت ارشد نوآفرین خوش آمدید. از اینجا می‌توانید تمام جنبه‌های استراتژیک سازمان را نظارت و تصمیم‌گیری کنید.
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col gap-3"
            >
              <div className="flex items-center gap-2 px-5 py-3 bg-white/20 backdrop-blur-sm rounded-full">
                <Briefcase className="h-5 w-5" />
                <span className="text-sm font-semibold">مدیرکل سازمان</span>
              </div>
              <div className="flex items-center gap-2 px-5 py-3 bg-green-500/30 backdrop-blur-sm rounded-full">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-sm font-semibold">دسترسی کامل فعال</span>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Executive Metrics Grid */}
      <MetricsGrid metrics={executiveMetrics} />

      {/* Key Performance Indicators */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="border-0 shadow-xl dark:bg-gray-800">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20">
            <CardTitle className="flex items-center gap-2">
              <div className="p-2 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-lg shadow-lg">
                <Target className="h-5 w-5 text-white" />
              </div>
              <span className="dark:text-white">شاخص‌های کلیدی عملکرد (KPI)</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {kpiData.map((kpi, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-xl"
                >
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{kpi.label}</p>
                  <div className="flex items-end justify-between">
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{kpi.value}</p>
                    <span className={`text-sm font-semibold ${
                      kpi.trend === 'up' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {kpi.change}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Strategic Actions */}
      <QuickActionsPanel actions={strategicActions} />

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - 2/3 width */}
        <div className="lg:col-span-2 space-y-6">
          {/* Analytics Chart */}
          <AnalyticsChart title="رشد کاربران و پروژه‌ها (6 ماه اخیر)" />
          
          {/* Recent Activity */}
          <RecentActivityFeed 
            activities={stats?.recentActivities}
            isLoading={false}
          />
        </div>

        {/* Right Column - 1/3 width */}
        <div className="space-y-6">
          {/* Pending Strategic Decisions */}
          <PendingTasksCard tasks={stats?.pendingTasks} />
          
          {/* System Health */}
          <SystemHealthCard systems={stats?.systemHealth} />
        </div>
      </div>
    </div>
  )
}
