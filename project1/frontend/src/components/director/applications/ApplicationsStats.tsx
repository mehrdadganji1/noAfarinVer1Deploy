import { motion } from 'framer-motion'
import { ClipboardCheck, Clock, CheckCircle, XCircle, TrendingUp } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

interface StatsProps {
  stats?: {
    total: number
    pending: number
    approved: number
    rejected: number
    approvalRate?: number
  }
}

export default function ApplicationsStats({ stats }: StatsProps) {
  const statsData = [
    {
      label: 'کل درخواست‌ها',
      value: stats?.total || 0,
      icon: ClipboardCheck,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
    },
    {
      label: 'در انتظار بررسی',
      value: stats?.pending || 0,
      icon: Clock,
      color: 'from-yellow-500 to-orange-600',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-600',
    },
    {
      label: 'تایید شده',
      value: stats?.approved || 0,
      icon: CheckCircle,
      color: 'from-green-500 to-emerald-600',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
    },
    {
      label: 'رد شده',
      value: stats?.rejected || 0,
      icon: XCircle,
      color: 'from-red-500 to-rose-600',
      bgColor: 'bg-red-50',
      textColor: 'text-red-600',
    },
    {
      label: 'نرخ تایید',
      value: `${stats?.approvalRate || 0}%`,
      icon: TrendingUp,
      color: 'from-purple-500 to-pink-600',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600',
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {statsData.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card className="border-2 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm text-gray-600 mb-2">{stat.label}</p>
                  <p className="text-3xl font-bold bg-gradient-to-r bg-clip-text text-transparent" style={{
                    backgroundImage: `linear-gradient(to right, var(--tw-gradient-stops))`,
                  }}>
                    <span className={stat.textColor}>{stat.value}</span>
                  </p>
                </div>
                <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                  <stat.icon className={`h-6 w-6 ${stat.textColor}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}
