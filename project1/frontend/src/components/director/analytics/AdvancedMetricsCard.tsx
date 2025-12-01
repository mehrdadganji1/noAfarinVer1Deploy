import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LucideIcon, TrendingUp, TrendingDown, Minus } from 'lucide-react'

interface Metric {
  label: string
  value: string | number
  change?: number
  trend?: 'up' | 'down' | 'stable'
  color: string
}

interface AdvancedMetricsCardProps {
  title: string
  icon: LucideIcon
  metrics: Metric[]
  bgGradient?: string
}

export default function AdvancedMetricsCard({ 
  title, 
  icon: Icon, 
  metrics,
  bgGradient = 'from-blue-50 to-cyan-50'
}: AdvancedMetricsCardProps) {
  
  const getTrendIcon = (trend?: string) => {
    switch (trend) {
      case 'up': return TrendingUp
      case 'down': return TrendingDown
      default: return Minus
    }
  }

  const getTrendColor = (trend?: string) => {
    switch (trend) {
      case 'up': return 'text-green-600 bg-green-100'
      case 'down': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
        <CardHeader className={`bg-gradient-to-r ${bgGradient} rounded-t-xl`}>
          <CardTitle className="flex items-center gap-2">
            <div className="p-2 bg-white/50 backdrop-blur-sm rounded-lg">
              <Icon className="h-5 w-5" />
            </div>
            <span>{title}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-4">
            {metrics.map((metric, index) => {
              const TrendIcon = getTrendIcon(metric.trend)
              return (
                <motion.div
                  key={metric.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 mb-1">{metric.label}</p>
                    <p className={`text-2xl font-bold ${metric.color}`}>{metric.value}</p>
                  </div>
                  {metric.change !== undefined && (
                    <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold ${getTrendColor(metric.trend)}`}>
                      <TrendIcon className="h-4 w-4" />
                      {Math.abs(metric.change)}%
                    </div>
                  )}
                </motion.div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
