import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react'

interface KPICardProps {
  title: string
  value: string | number
  change?: number
  icon: LucideIcon
  bgGradient: string
  iconColor: string
  trend?: 'up' | 'down'
  subtitle?: string
}

export default function KPICard({
  title,
  value,
  change,
  icon: Icon,
  bgGradient,
  iconColor,
  trend = 'up',
  subtitle
}: KPICardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="border-0 shadow-lg hover:shadow-xl transition-all overflow-hidden group">
        {/* Background Gradient */}
        <div className={`absolute inset-0 ${bgGradient} opacity-5 group-hover:opacity-10 transition-opacity`} />
        
        <CardContent className="relative pt-6">
          <div className="flex items-start justify-between mb-4">
            {/* Icon */}
            <div className={`p-3 ${bgGradient} rounded-2xl shadow-lg group-hover:scale-110 transition-transform`}>
              <Icon className={`h-6 w-6 ${iconColor}`} />
            </div>
            
            {/* Change Badge */}
            {change !== undefined && (
              <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${
                trend === 'up' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}>
                {trend === 'up' ? (
                  <TrendingUp className="h-3 w-3" />
                ) : (
                  <TrendingDown className="h-3 w-3" />
                )}
                {Math.abs(change)}%
              </div>
            )}
          </div>

          {/* Content */}
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-3xl font-bold text-gray-900">{value}</p>
            {subtitle && (
              <p className="text-xs text-gray-500">{subtitle}</p>
            )}
          </div>

          {/* Bottom Accent Line */}
          <div className={`absolute bottom-0 left-0 right-0 h-1 ${bgGradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300`} />
        </CardContent>
      </Card>
    </motion.div>
  )
}
