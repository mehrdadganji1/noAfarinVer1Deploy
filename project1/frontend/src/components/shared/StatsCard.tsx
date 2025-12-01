import { motion } from 'framer-motion'
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

interface StatsCardProps {
  title: string
  value: string | number
  change?: string
  trend?: 'up' | 'down' | 'neutral'
  icon: LucideIcon
  gradient: string
  delay?: number
  subtitle?: string
}

export function StatsCard({
  title,
  value,
  change,
  trend = 'neutral',
  icon: Icon,
  gradient,
  delay = 0,
  subtitle,
}: StatsCardProps) {
  const trendColors = {
    up: 'text-green-600 bg-green-50',
    down: 'text-red-600 bg-red-50',
    neutral: 'text-gray-600 bg-gray-50',
  }

  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay * 0.1 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
    >
      <Card className="border-0 shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
              <h3 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                {value}
              </h3>
              {subtitle && (
                <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
              )}
            </div>
            <div
              className={`p-3 rounded-xl shadow-lg bg-gradient-to-br ${gradient}`}
            >
              <Icon className="h-6 w-6 text-white" />
            </div>
          </div>

          {change && (
            <div className="flex items-center gap-2">
              <span
                className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold ${trendColors[trend]}`}
              >
                {TrendIcon && <TrendIcon className="h-3 w-3" />}
                {change}
              </span>
              <span className="text-xs text-gray-500">از ماه قبل</span>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
