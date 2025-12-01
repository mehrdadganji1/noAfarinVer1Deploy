import { motion } from 'framer-motion'
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Eye,
  Users
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { AACOStats } from '@/hooks/useAACOAdminApplications'

interface AACOApplicationStatsProps {
  stats: AACOStats
  loading?: boolean
}

export function AACOApplicationStats({ stats, loading }: AACOApplicationStatsProps) {
  const statItems = [
    {
      label: 'کل درخواست‌ها',
      value: stats.total,
      icon: Users,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    },
    {
      label: 'ارسال شده',
      value: stats.submitted,
      icon: FileText,
      color: 'from-indigo-500 to-indigo-600',
      bgColor: 'bg-indigo-50 dark:bg-indigo-900/20',
    },
    {
      label: 'در حال بررسی',
      value: stats.underReview,
      icon: Eye,
      color: 'from-yellow-500 to-orange-500',
      bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
    },
    {
      label: 'تایید شده',
      value: stats.approved,
      icon: CheckCircle,
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
    },
    {
      label: 'رد شده',
      value: stats.rejected,
      icon: XCircle,
      color: 'from-red-500 to-rose-500',
      bgColor: 'bg-red-50 dark:bg-red-900/20',
    },
    {
      label: 'پیش‌نویس',
      value: stats.draft,
      icon: Clock,
      color: 'from-gray-500 to-gray-600',
      bgColor: 'bg-gray-50 dark:bg-gray-900/20',
    },
  ]

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4">
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {statItems.map((item, index) => {
        const Icon = item.icon
        return (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className={`${item.bgColor} border-0 shadow-sm hover:shadow-md transition-shadow`}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className={`p-2 rounded-lg bg-gradient-to-br ${item.color}`}>
                    <Icon className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">
                    {item.value}
                  </span>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                  {item.label}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        )
      })}
    </div>
  )
}
