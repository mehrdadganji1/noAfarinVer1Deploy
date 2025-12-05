import { motion } from 'framer-motion'
import { Users, Clock, CheckCircle2, UserCheck, Calendar, FolderKanban, Award, Building2 } from 'lucide-react'
import { MetricCard } from '../base'
import { AdminStats } from '@/hooks/useAdminStats'
import { ANIMATION_VARIANTS } from '../constants'

interface MetricsGridProps {
  stats: AdminStats | undefined
  isLoading: boolean
}

export function MetricsGrid({ stats, isLoading }: MetricsGridProps) {
  const primaryMetrics = [
    {
      title: 'کل کاربران',
      value: stats?.users.total || 0,
      change: stats?.users.growth || 0,
      icon: Users,
      theme: 'users' as const,
      subtitle: `${stats?.users.active || 0} کاربر فعال`,
    },
    {
      title: 'درخواست‌های در انتظار',
      value: stats?.applications.pending || 0,
      icon: Clock,
      theme: 'applications' as const,
      subtitle: `از ${stats?.applications.total || 0} درخواست`,
    },
    {
      title: 'نرخ تایید',
      value: `${stats?.applications.approvalRate || 0}%`,
      icon: CheckCircle2,
      theme: 'success' as const,
      subtitle: `${stats?.applications.approved || 0} تایید شده`,
    },
    {
      title: 'اعضای باشگاه',
      value: stats?.users.clubMembers || 0,
      icon: UserCheck,
      theme: 'members' as const,
      subtitle: `از ${stats?.users.total || 0} کاربر`,
    },
  ]

  const secondaryMetrics = [
    {
      title: 'رویدادهای آینده',
      value: stats?.events.upcoming || 0,
      icon: Calendar,
      theme: 'events' as const,
      subtitle: `از ${stats?.events.total || 0} رویداد`,
    },
    {
      title: 'تیم‌های فعال',
      value: stats?.teams.active || 0,
      icon: Building2,
      theme: 'teams' as const,
      subtitle: `از ${stats?.teams.total || 0} تیم`,
    },
    {
      title: 'پروژه‌های فعال',
      value: stats?.projects.active || 0,
      icon: FolderKanban,
      theme: 'members' as const,
      subtitle: `از ${stats?.projects.total || 0} پروژه`,
    },
    {
      title: 'میانگین حضور',
      value: stats?.events.avgAttendance || 0,
      icon: Award,
      theme: 'success' as const,
      subtitle: 'نفر در هر رویداد',
    },
  ]

  return (
    <div className="space-y-6">
      {/* Primary Metrics */}
      <motion.div
        variants={ANIMATION_VARIANTS.stagger}
        initial="initial"
        animate="animate"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {primaryMetrics.map((metric, index) => (
          <MetricCard
            key={metric.title}
            {...metric}
            loading={isLoading}
            delay={index * 0.1}
          />
        ))}
      </motion.div>

      {/* Secondary Metrics */}
      <motion.div
        variants={ANIMATION_VARIANTS.stagger}
        initial="initial"
        animate="animate"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {secondaryMetrics.map((metric, index) => (
          <MetricCard
            key={metric.title}
            {...metric}
            loading={isLoading}
            delay={0.4 + index * 0.1}
          />
        ))}
      </motion.div>
    </div>
  )
}

export default MetricsGrid
