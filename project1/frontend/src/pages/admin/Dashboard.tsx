import { motion } from 'framer-motion'
import { Shield, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useAdminStats } from '@/hooks/useAdminStats'

// New Design System Components
import { DashboardHeader } from '@/components/admin/dashboard/base'
import {
  MetricsGrid,
  ActivityFeed,
  UserActivityChart,
  RoleDistribution,
  GrowthChart,
  PendingApplicationsWidget,
  QuickActions,
} from '@/components/admin/dashboard/widgets'

export default function AdminDashboard() {
  const { data: stats, isLoading, isError, error, refetch, isFetching } = useAdminStats('month')

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <DashboardHeader
        title="داشبورد مدیر سیستم"
        subtitle="مدیریت کامل سیستم و دسترسی به تمام بخش‌ها"
        icon={Shield}
        badge="مدیر سیستم"
        gradient="primary"
        onRefresh={refetch}
        isRefreshing={isFetching}
      />

      {/* Error State */}
      {isError && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800">
            <CardContent className="p-4 flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
              <div className="flex-1">
                <p className="text-red-600 dark:text-red-400 font-medium">خطا در دریافت آمار</p>
                <p className="text-red-500 dark:text-red-300 text-sm">
                  {error instanceof Error ? error.message : 'لطفاً دوباره تلاش کنید'}
                </p>
              </div>
              <Button variant="outline" size="sm" onClick={() => refetch()}>
                تلاش مجدد
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Metrics Grid */}
      <MetricsGrid stats={stats} isLoading={isLoading} />

      {/* Quick Actions */}
      <QuickActions delay={0.5} />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          <PendingApplicationsWidget delay={0.6} />
          <UserActivityChart stats={stats} delay={0.7} />
        </div>

        {/* Middle Column */}
        <div className="space-y-6">
          <RoleDistribution stats={stats} delay={0.8} />
          <GrowthChart delay={0.9} />
        </div>

        {/* Right Column */}
        <div>
          <ActivityFeed delay={1.0} />
        </div>
      </div>
    </div>
  )
}
