import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { LucideIcon } from 'lucide-react'

interface ReportStatsCardProps {
  label: string
  value: string | number
  icon: LucideIcon
  bgGradient: string
  iconColor: string
  delay?: number
}

export default function ReportStatsCard({
  label,
  value,
  icon: Icon,
  bgGradient,
  iconColor,
  delay = 0
}: ReportStatsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.3 }}
      whileHover={{ scale: 1.05 }}
    >
      <Card className={`border-0 shadow-lg hover:shadow-xl transition-all overflow-hidden bg-gradient-to-br ${bgGradient}`}>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-700 mb-1">{label}</p>
              <p className="text-3xl font-bold text-gray-900">{value}</p>
            </div>
            <div className="p-3 bg-white/50 backdrop-blur-sm rounded-2xl shadow-lg">
              <Icon className={`h-8 w-8 ${iconColor}`} />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
