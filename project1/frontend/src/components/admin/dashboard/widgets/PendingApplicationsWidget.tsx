import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { FileText, Clock, ArrowLeft, Users, CheckCircle, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ChartCard } from '../base'
import { api } from '@/lib/api'
import { cn } from '@/lib/utils'

interface PendingStats {
  total: number
  submitted: number
  underReview: number
  approved: number
  rejected: number
}

interface PendingApplicationsWidgetProps {
  loading?: boolean
  delay?: number
}

export function PendingApplicationsWidget({ loading: externalLoading, delay = 0 }: PendingApplicationsWidgetProps) {
  const navigate = useNavigate()
  const [stats, setStats] = useState<PendingStats>({ 
    total: 0, 
    submitted: 0, 
    underReview: 0,
    approved: 0,
    rejected: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/aaco-applications?limit=1000')
        const applications = response.data.applications || []
        
        setStats({
          total: applications.length,
          submitted: applications.filter((app: any) => app.status === 'submitted').length,
          underReview: applications.filter((app: any) => app.status === 'under-review').length,
          approved: applications.filter((app: any) => app.status === 'approved').length,
          rejected: applications.filter((app: any) => app.status === 'rejected').length,
        })
      } catch (error) {
        console.error('Error fetching AACO stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  const pendingCount = stats.submitted + stats.underReview
  const isLoading = externalLoading || loading

  const statItems = [
    {
      icon: Users,
      label: 'کل',
      value: stats.total,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-100 dark:bg-blue-900/30',
    },
    {
      icon: FileText,
      label: 'ارسال شده',
      value: stats.submitted,
      color: 'text-indigo-600 dark:text-indigo-400',
      bgColor: 'bg-indigo-100 dark:bg-indigo-900/30',
    },
    {
      icon: Clock,
      label: 'در حال بررسی',
      value: stats.underReview,
      color: 'text-amber-600 dark:text-amber-400',
      bgColor: 'bg-amber-100 dark:bg-amber-900/30',
    },
  ]

  return (
    <ChartCard
      title="درخواست‌های AACO"
      subtitle="وضعیت درخواست‌های عضویت"
      icon={FileText}
      iconColor="text-purple-600 dark:text-purple-400"
      headerGradient="from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20"
      loading={isLoading}
      delay={delay}
      actions={[
        { label: 'مدیریت درخواست‌ها', onClick: () => navigate('/admin/aaco-applications') },
      ]}
    >
      {/* Pending Badge */}
      {pendingCount > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: delay + 0.2 }}
          className="mb-4"
        >
          <Badge className="bg-rose-500 text-white px-4 py-2 text-sm">
            <motion.span
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="flex items-center gap-2"
            >
              <AlertCircle className="h-4 w-4" />
              {pendingCount} درخواست در انتظار بررسی
            </motion.span>
          </Badge>
        </motion.div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        {statItems.map((item, index) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: delay + 0.3 + index * 0.1 }}
            className="text-center p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"
          >
            <div className={cn('mx-auto w-10 h-10 rounded-lg flex items-center justify-center mb-2', item.bgColor)}>
              <item.icon className={cn('h-5 w-5', item.color)} />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {item.value.toLocaleString('fa-IR')}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{item.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: delay + 0.6 }}
          className="flex items-center gap-3 p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl"
        >
          <CheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
          <div>
            <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
              {stats.approved.toLocaleString('fa-IR')}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400">تایید شده</p>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: delay + 0.7 }}
          className="flex items-center gap-3 p-3 bg-rose-50 dark:bg-rose-900/20 rounded-xl"
        >
          <AlertCircle className="h-5 w-5 text-rose-600 dark:text-rose-400" />
          <div>
            <p className="text-lg font-bold text-rose-600 dark:text-rose-400">
              {stats.rejected.toLocaleString('fa-IR')}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400">رد شده</p>
          </div>
        </motion.div>
      </div>

      {/* Action Button */}
      <Button
        onClick={() => navigate('/admin/aaco-applications')}
        className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
      >
        مدیریت درخواست‌ها
        <ArrowLeft className="h-4 w-4 mr-2" />
      </Button>
    </ChartCard>
  )
}

export default PendingApplicationsWidget
