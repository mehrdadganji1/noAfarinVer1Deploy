import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { GraduationCap, Clock, CheckCircle, Users } from 'lucide-react'

interface TrainingStats {
  total: number
  upcoming: number
  ongoing: number
  completed: number
}

interface TrainingStatsCardsProps {
  stats?: TrainingStats
  isLoading: boolean
}

export default function TrainingStatsCards({ stats, isLoading }: TrainingStatsCardsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="animate-pulse border-0 shadow-lg">
            <CardContent className="pt-6">
              <div className="h-20 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  const cards = [
    {
      label: 'کل دوره‌ها',
      value: stats?.total || 0,
      icon: GraduationCap,
      bgGradient: 'from-green-50 to-emerald-50',
      iconColor: 'text-green-600',
      delay: 0
    },
    {
      label: 'دوره‌های آینده',
      value: stats?.upcoming || 0,
      icon: Clock,
      bgGradient: 'from-blue-50 to-cyan-50',
      iconColor: 'text-blue-600',
      delay: 0.1
    },
    {
      label: 'در حال برگزاری',
      value: stats?.ongoing || 0,
      icon: Users,
      bgGradient: 'from-purple-50 to-pink-50',
      iconColor: 'text-purple-600',
      delay: 0.2
    },
    {
      label: 'تکمیل شده',
      value: stats?.completed || 0,
      icon: CheckCircle,
      bgGradient: 'from-orange-50 to-amber-50',
      iconColor: 'text-orange-600',
      delay: 0.3
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <motion.div
          key={card.label}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: card.delay, duration: 0.3 }}
          whileHover={{ scale: 1.05, y: -5 }}
        >
          <Card className={`border-0 shadow-lg hover:shadow-xl transition-all overflow-hidden bg-gradient-to-br ${card.bgGradient}`}>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-white/80 backdrop-blur-sm rounded-xl shadow-md">
                  <card.icon className={`h-5 w-5 ${card.iconColor}`} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-700">{card.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}
