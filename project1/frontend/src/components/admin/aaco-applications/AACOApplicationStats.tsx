import { motion } from 'framer-motion'
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Eye,
  Users,
  TrendingUp,
  Sparkles
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { AACOStats } from '@/hooks/useAACOAdminApplications'
import { cn } from '@/lib/utils'

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
      gradient: 'from-blue-500 to-indigo-600',
      bgLight: 'bg-blue-50 dark:bg-blue-900/20',
      iconBg: 'bg-blue-100 dark:bg-blue-900/40',
      iconColor: 'text-blue-600 dark:text-blue-400',
      trend: '+12%',
      trendUp: true,
    },
    {
      label: 'ارسال شده',
      value: stats.submitted,
      icon: Sparkles,
      gradient: 'from-indigo-500 to-purple-600',
      bgLight: 'bg-indigo-50 dark:bg-indigo-900/20',
      iconBg: 'bg-indigo-100 dark:bg-indigo-900/40',
      iconColor: 'text-indigo-600 dark:text-indigo-400',
    },
    {
      label: 'در حال بررسی',
      value: stats.underReview,
      icon: Eye,
      gradient: 'from-yellow-500 to-orange-500',
      bgLight: 'bg-yellow-50 dark:bg-yellow-900/20',
      iconBg: 'bg-yellow-100 dark:bg-yellow-900/40',
      iconColor: 'text-yellow-600 dark:text-yellow-400',
    },
    {
      label: 'تایید شده',
      value: stats.approved,
      icon: CheckCircle,
      gradient: 'from-green-500 to-emerald-600',
      bgLight: 'bg-green-50 dark:bg-green-900/20',
      iconBg: 'bg-green-100 dark:bg-green-900/40',
      iconColor: 'text-green-600 dark:text-green-400',
    },
    {
      label: 'رد شده',
      value: stats.rejected,
      icon: XCircle,
      gradient: 'from-red-500 to-rose-600',
      bgLight: 'bg-red-50 dark:bg-red-900/20',
      iconBg: 'bg-red-100 dark:bg-red-900/40',
      iconColor: 'text-red-600 dark:text-red-400',
    },
    {
      label: 'پیش‌نویس',
      value: stats.draft,
      icon: Clock,
      gradient: 'from-gray-500 to-slate-600',
      bgLight: 'bg-gray-50 dark:bg-gray-800/50',
      iconBg: 'bg-gray-100 dark:bg-gray-800',
      iconColor: 'text-gray-600 dark:text-gray-400',
    },
  ]

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse border-0 shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-xl" />
                <div className="h-8 w-12 bg-gray-200 dark:bg-gray-700 rounded-lg" />
              </div>
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
        const percentage = stats.total > 0 ? Math.round((item.value / stats.total) * 100) : 0
        
        return (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, duration: 0.3 }}
          >
            <Card className={cn(
              "relative overflow-hidden border-0 shadow-sm hover:shadow-lg transition-all duration-300 group",
              item.bgLight
            )}>
              {/* Gradient Bar */}
              <div className={cn(
                "absolute top-0 left-0 right-0 h-1 bg-gradient-to-r",
                item.gradient
              )} />
              
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className={cn(
                    "p-2.5 rounded-xl transition-transform group-hover:scale-110",
                    item.iconBg
                  )}>
                    <Icon className={cn("h-5 w-5", item.iconColor)} />
                  </div>
                  <div className="text-left">
                    <span className="text-3xl font-bold text-gray-900 dark:text-white">
                      {item.value}
                    </span>
                    {item.trend && (
                      <div className={cn(
                        "flex items-center gap-0.5 text-xs mt-1",
                        item.trendUp ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                      )}>
                        <TrendingUp className="h-3 w-3" />
                        {item.trend}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {item.label}
                  </p>
                  
                  {/* Progress Bar */}
                  {index !== 0 && stats.total > 0 && (
                    <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ delay: index * 0.1 + 0.3, duration: 0.5 }}
                        className={cn("h-full rounded-full bg-gradient-to-r", item.gradient)}
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )
      })}
    </div>
  )
}
