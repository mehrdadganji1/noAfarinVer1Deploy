import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Calendar, Clock, CheckCircle2, TrendingUp, Sparkles, ArrowUpRight } from 'lucide-react'

interface EventStats {
  total: number
  upcoming: number
  ongoing: number
  completed: number
}

interface EventStatsCardsProps {
  stats?: EventStats
  isLoading: boolean
}

export default function EventStatsCards({ stats, isLoading }: EventStatsCardsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="animate-pulse border-0 shadow-lg">
            <CardContent className="pt-6">
              <div className="space-y-3">
                <div className="h-12 w-12 bg-gray-200 rounded-2xl"></div>
                <div className="h-4 bg-gray-200 rounded w-24"></div>
                <div className="h-8 bg-gray-200 rounded w-16"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  const cards = [
    {
      label: 'کل رویدادها',
      value: stats?.total || 0,
      icon: Calendar,
      bgGradient: 'from-blue-50 to-cyan-50',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      textColor: 'text-blue-600',
      accentGradient: 'from-blue-500 to-cyan-500',
      badge: 'همه',
      delay: 0
    },
    {
      label: 'رویدادهای آینده',
      value: stats?.upcoming || 0,
      icon: Clock,
      bgGradient: 'from-purple-50 to-pink-50',
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600',
      textColor: 'text-purple-600',
      accentGradient: 'from-purple-500 to-pink-500',
      badge: 'آینده',
      delay: 0.1
    },
    {
      label: 'در حال برگزاری',
      value: stats?.ongoing || 0,
      icon: TrendingUp,
      bgGradient: 'from-green-50 to-emerald-50',
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
      textColor: 'text-green-600',
      accentGradient: 'from-green-500 to-emerald-500',
      badge: 'فعال',
      delay: 0.2
    },
    {
      label: 'برگزار شده',
      value: stats?.completed || 0,
      icon: CheckCircle2,
      bgGradient: 'from-orange-50 to-amber-50',
      iconBg: 'bg-orange-100',
      iconColor: 'text-orange-600',
      textColor: 'text-orange-600',
      accentGradient: 'from-orange-500 to-amber-500',
      badge: 'تکمیل',
      delay: 0.3
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card) => (
        <motion.div
          key={card.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: card.delay, duration: 0.4, type: 'spring' }}
          whileHover={{ y: -8, scale: 1.03 }}
        >
          <Card className={`border-0 shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden bg-gradient-to-br ${card.bgGradient} group relative`}>
            {/* Top Accent Line */}
            <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${card.accentGradient}`} />
            
            <CardContent className="pt-6 relative">
              <div className="flex items-start justify-between mb-4">
                <motion.div
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                  className={`p-3 ${card.iconBg} rounded-2xl shadow-md group-hover:shadow-lg transition-shadow`}
                >
                  <card.icon className={`h-6 w-6 ${card.iconColor}`} />
                </motion.div>
                <div className={`px-2 py-1 rounded-full text-xs font-semibold ${card.iconBg} ${card.iconColor} flex items-center gap-1`}>
                  <Sparkles className="h-3 w-3" />
                  {card.badge}
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-600">{card.label}</p>
                <div className="flex items-end justify-between">
                  <motion.p
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: card.delay + 0.2, type: 'spring' }}
                    className={`text-4xl font-bold ${card.textColor}`}
                  >
                    {card.value}
                  </motion.p>
                  <ArrowUpRight className={`h-5 w-5 ${card.iconColor} opacity-0 group-hover:opacity-100 transition-opacity`} />
                </div>
              </div>

              {/* Shine Effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}
