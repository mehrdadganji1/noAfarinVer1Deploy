import { motion } from 'framer-motion'
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react'
import { Card } from '@/components/ui/card'

interface Metric {
  id: string
  label: string
  value: string | number
  change?: number
  changeLabel?: string
  icon: LucideIcon
  color: string
  bgGradient: string
}

interface MetricsGridProps {
  metrics: Metric[]
}

export default function MetricsGrid({ metrics }: MetricsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric, index) => (
        <motion.div
          key={metric.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
            {/* Background Gradient */}
            <div className={`absolute inset-0 ${metric.bgGradient} opacity-5 group-hover:opacity-10 transition-opacity`} />
            
            <div className="relative p-6">
              {/* Icon */}
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 ${metric.bgGradient} rounded-2xl shadow-lg`}>
                  <metric.icon className="h-6 w-6 text-white" />
                </div>
                
                {/* Change Indicator */}
                {metric.change !== undefined && (
                  <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
                    metric.change >= 0 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {metric.change >= 0 ? (
                      <TrendingUp className="h-3 w-3" />
                    ) : (
                      <TrendingDown className="h-3 w-3" />
                    )}
                    {Math.abs(metric.change)}%
                  </div>
                )}
              </div>

              {/* Value */}
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-600">{metric.label}</p>
                <p className="text-3xl font-bold text-gray-900">{metric.value}</p>
                {metric.changeLabel && (
                  <p className="text-xs text-gray-500">{metric.changeLabel}</p>
                )}
              </div>

              {/* Hover Effect Line */}
              <div className={`absolute bottom-0 left-0 right-0 h-1 ${metric.bgGradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300`} />
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}
