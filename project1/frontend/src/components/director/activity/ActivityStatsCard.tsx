import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { LucideIcon } from 'lucide-react'

interface ActivityStatsCardProps {
  label: string
  value: number
  icon: LucideIcon
  bgGradient: string
  iconColor: string
  delay?: number
}

export default function ActivityStatsCard({
  label,
  value,
  icon: Icon,
  bgGradient,
  iconColor,
  delay = 0
}: ActivityStatsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.3 }}
      whileHover={{ scale: 1.05, y: -5 }}
    >
      <Card className={`border-0 shadow-lg hover:shadow-xl transition-all overflow-hidden bg-gradient-to-br ${bgGradient}`}>
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white/80 backdrop-blur-sm rounded-xl shadow-md">
              <Icon className={`h-5 w-5 ${iconColor}`} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">{label}</p>
              <p className="text-2xl font-bold text-gray-900">{value}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
