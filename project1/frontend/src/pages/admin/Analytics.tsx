import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Users,
  BarChart3,
  Activity,
  Target,
  Zap,
  FileText,
  UserCheck
} from 'lucide-react'
import { useAdminStats } from '@/hooks/useAdminStats'
import {
  AdvancedMetricsCard,
  InteractiveChart,
  ComparisonCard,
  TimeRangeSelector
} from '@/components/director/analytics'
import { MetricsGrid } from '@/components/director/dashboard'
import { DashboardSkeleton } from '@/components/ui/page-skeleton'

type TimeRange = 'today' | 'week' | 'month' | 'year'

export default function Analytics() {
  const [timeRange, setTimeRange] = useState<TimeRange>('month')
  const { data: stats, isLoading } = useAdminStats(timeRange)

  if (isLoading) {
    return <DashboardSkeleton />
  }

  // Prepare metrics for overview
  const overviewMetrics = [
    {
      id: 'total-users',
      label: 'کل کاربران',
      value: stats?.users.total || 0,
      change: stats?.users.growth || 0,
      changeLabel: 'نسبت به دوره قبل',
      icon: Users,
      color: 'blue',
      bgGradient: 'bg-gradient-to-br from-blue-500 to-cyan-500'
    },
    {
      id: 'active-users',
      label: 'کاربران فعال',
      value: stats?.activity.monthlyActiveUsers || 0,
      change: 12,
      changeLabel: 'فعالیت ماهانه',
      icon: Activity,
      color: 'green',
      bgGradient: 'bg-gradient-to-br from-green-500 to-emerald-500'
    },
    {
      id: 'approval-rate',
      label: 'نرخ تایید',
      value: `${stats?.applications.approvalRate || 0}%`,
      change: 5,
      changeLabel: 'بهبود عملکرد',
      icon: Target,
      color: 'purple',
      bgGradient: 'bg-gradient-to-br from-purple-500 to-pink-500'
    },
    {
      id: 'engagement',
      label: 'نرخ تعامل',
      value: '87%',
      change: 8,
      changeLabel: 'افزایش مشارکت',
      icon: Zap,
      color: 'orange',
      bgGradient: 'bg-gradient-to-br from-orange-500 to-amber-500'
    }
  ]

  // User metrics
  const userMetrics = [
    { label: 'کل کاربران', value: stats?.users.total || 0, change: stats?.users.growth, trend: 'up' as const, color: 'text-blue-600' },
    { label: 'اعضای باشگاه', value: stats?.users.clubMembers || 0, change: 15, trend: 'up' as const, color: 'text-green-600' },
    { label: 'متقاضیان', value: stats?.users.applicants || 0, change: 8, trend: 'up' as const, color: 'text-purple-600' },
    { label: 'مدیران', value: stats?.users.admins || 0, change: 0, trend: 'stable' as const, color: 'text-orange-600' }
  ]

  // Application metrics
  const applicationMetrics = [
    { label: 'کل درخواست‌ها', value: stats?.applications.total || 0, change: 12, trend: 'up' as const, color: 'text-blue-600' },
    { label: 'در انتظار بررسی', value: stats?.applications.pending || 0, change: -5, trend: 'down' as const, color: 'text-yellow-600' },
    { label: 'تایید شده', value: stats?.applications.approved || 0, change: 18, trend: 'up' as const, color: 'text-green-600' },
    { label: 'رد شده', value: stats?.applications.rejected || 0, change: -3, trend: 'down' as const, color: 'text-red-600' }
  ]

  // Activity chart data
  const activityData = [
    { label: 'فروردین', value: 145, color: 'bg-blue-500', details: '145 کاربر فعال' },
    { label: 'اردیبهشت', value: 162, color: 'bg-purple-500', details: '162 کاربر فعال' },
    { label: 'خرداد', value: 178, color: 'bg-pink-500', details: '178 کاربر فعال' },
    { label: 'تیر', value: 195, color: 'bg-orange-500', details: '195 کاربر فعال' },
    { label: 'مرداد', value: 212, color: 'bg-green-500', details: '212 کاربر فعال' },
    { label: 'شهریور', value: 235, color: 'bg-cyan-500', details: '235 کاربر فعال' }
  ]

  // Role distribution data
  const roleData = [
    { label: 'اعضای باشگاه', value: stats?.users.clubMembers || 0, color: 'bg-green-500', details: 'فعال‌ترین گروه' },
    { label: 'متقاضیان', value: stats?.users.applicants || 0, color: 'bg-blue-500', details: 'در حال بررسی' },
    { label: 'مدیران', value: stats?.users.admins || 0, color: 'bg-purple-500', details: 'دسترسی کامل' },
    { label: 'سایر کاربران', value: (stats?.users.total || 0) - (stats?.users.clubMembers || 0) - (stats?.users.applicants || 0) - (stats?.users.admins || 0), color: 'bg-orange-500', details: 'سایر نقش‌ها' }
  ]

  // Comparison data
  const comparisonData = [
    { label: 'کاربران جدید', current: 145, previous: 128, unit: 'نفر' },
    { label: 'درخواست‌های جدید', current: 89, previous: 76, unit: 'مورد' },
    { label: 'رویدادهای برگزار شده', current: 12, previous: 9, unit: 'رویداد' },
    { label: 'پروژه‌های تکمیل شده', current: 8, previous: 6, unit: 'پروژه' }
  ]

  const handleExport = () => {
    console.log('Exporting analytics report...')
    // Implement export functionality
  }

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
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
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
              <BarChart3 className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">آمار و تحلیل‌های پیشرفته</h1>
              <p className="text-white/90 text-lg mt-1">تحلیل جامع عملکرد سیستم و کاربران</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Time Range Selector */}
      <TimeRangeSelector 
        selectedRange={timeRange}
        onRangeChange={setTimeRange}
        onExport={handleExport}
      />

      {/* Overview Metrics */}
      <MetricsGrid metrics={overviewMetrics} />

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Metrics */}
        <AdvancedMetricsCard
          title="آمار کاربران"
          icon={Users}
          metrics={userMetrics}
          bgGradient="from-blue-50 to-cyan-50"
        />

        {/* Application Metrics */}
        <AdvancedMetricsCard
          title="آمار درخواست‌ها"
          icon={FileText}
          metrics={applicationMetrics}
          bgGradient="from-purple-50 to-pink-50"
        />
      </div>

      {/* Interactive Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Activity Chart */}
        <InteractiveChart
          title="فعالیت کاربران (6 ماه اخیر)"
          icon={Activity}
          data={activityData}
          bgGradient="from-green-50 to-emerald-50"
        />

        {/* Role Distribution */}
        <InteractiveChart
          title="توزیع نقش‌های کاربری"
          icon={UserCheck}
          data={roleData}
          bgGradient="from-orange-50 to-amber-50"
        />
      </div>

      {/* Comparison Card */}
      <ComparisonCard
        title="مقایسه با دوره قبل"
        data={comparisonData}
        bgGradient="from-indigo-50 to-purple-50"
      />
    </div>
  )
}
