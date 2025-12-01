import { Card, CardContent } from '@/components/ui/card'
import {
  FileCheck,
  Calendar,
  MessageSquare,
  CheckCircle2,
  Clock
} from 'lucide-react'
import { useApplicationStats } from '@/hooks/useApplicationStats'

interface StatisticsCardsProps {
  userId?: string
}

export default function StatisticsCards({ userId }: StatisticsCardsProps) {
  const { data: stats, isLoading } = useApplicationStats(userId)

  if (isLoading || !stats) {
    return (
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-2 sm:gap-3">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
            <CardContent className="p-3 space-y-2">
              {/* Shimmer overlay */}
              <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/40 to-transparent"></div>
              
              {/* Skeleton content */}
              <div className="flex justify-between items-start">
                <div className="space-y-1.5 flex-1">
                  <div className="h-2 bg-gray-200/80 rounded-full w-16"></div>
                  <div className="h-6 bg-gray-300/80 rounded w-20"></div>
                </div>
                <div className="h-8 w-8 bg-gray-200/80 rounded-lg flex-shrink-0"></div>
              </div>
              <div className="h-1.5 bg-gray-200/80 rounded-full w-24"></div>
              <div className="h-1.5 bg-gray-200/80 rounded-full"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  const cards = [
    {
      title: 'مدارک',
      value: `${stats.documentsUploaded}/${stats.documentsRequired}`,
      subtitle: `${stats.documentsVerified} تایید شده`,
      icon: FileCheck,
      gradient: 'from-info-500 to-info-600',
      glowColor: 'shadow-neon-cyan-md',
      bgGradient: 'from-info-50 to-info-100',
      iconBg: 'bg-info-500/10',
      iconColor: 'text-info-600',
      progress: (stats.documentsUploaded / stats.documentsRequired) * 100,
      progressColor: 'bg-gradient-to-r from-info-400 to-info-600',
    },
    {
      title: 'مصاحبه‌ها',
      value: stats.interviewsScheduled,
      subtitle: `${stats.interviewsCompleted} انجام شده`,
      icon: Calendar,
      gradient: 'from-primary-500 to-primary-600',
      glowColor: 'shadow-neon-purple-md',
      bgGradient: 'from-primary-50 to-primary-100',
      iconBg: 'bg-primary-500/10',
      iconColor: 'text-primary-600',
      highlight: stats.interviewsScheduled > 0,
      pulseColor: 'bg-primary-500',
    },
    {
      title: 'پیام‌ها',
      value: stats.unreadMessages,
      subtitle: stats.unreadMessages > 0 ? 'پیام خوانده نشده' : 'همه خوانده شد',
      icon: MessageSquare,
      gradient: 'from-accent-500 to-accent-600',
      glowColor: 'shadow-neon-pink-md',
      bgGradient: 'from-accent-50 to-accent-100',
      iconBg: 'bg-accent-500/10',
      iconColor: 'text-accent-600',
      highlight: stats.unreadMessages > 0,
      pulseColor: 'bg-accent-500',
    },
    {
      title: 'تکمیل پروفایل',
      value: `${stats.profileCompletion}%`,
      subtitle: stats.profileCompletion === 100 ? 'کامل است' : 'نیاز به تکمیل',
      icon: stats.profileCompletion === 100 ? CheckCircle2 : Clock,
      gradient: stats.profileCompletion === 100 ? 'from-green-500 to-green-600' : 'from-orange-500 to-orange-600',
      glowColor: stats.profileCompletion === 100 ? 'shadow-md' : 'shadow-md',
      bgGradient: stats.profileCompletion === 100 ? 'from-green-50 to-green-100' : 'from-orange-50 to-orange-100',
      iconBg: stats.profileCompletion === 100 ? 'bg-green-500/10' : 'bg-orange-500/10',
      iconColor: stats.profileCompletion === 100 ? 'text-green-600' : 'text-orange-600',
      progress: stats.profileCompletion,
      progressColor: stats.profileCompletion === 100 ? 'bg-gradient-to-r from-green-400 to-green-600' : 'bg-gradient-to-r from-orange-400 to-orange-600',
    },
  ]

  return (
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-2 sm:gap-3">
      {cards.map((card, index) => {
        const Icon = card.icon
        return (
          <div key={index} className="relative group/stat">
            {/* Gradient border */}
            <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} rounded-xl p-[2px]`}>
              <div className="w-full h-full bg-white rounded-xl" />
            </div>
            
            <Card className={`
              relative border-transparent overflow-hidden
              bg-gradient-to-br ${card.bgGradient}
              transition-all duration-200
              hover:shadow-md
              ${card.highlight ? 'ring-1 ring-offset-1 ring-' + card.iconColor : ''}
            `}>
              {/* Gradient overlay on hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-0 group-hover/stat:opacity-5 transition-opacity duration-300`}></div>
              
              <CardContent className="p-3 relative z-10">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-bold text-gray-600 mb-1 tracking-wide uppercase truncate">
                      {card.title}
                    </p>
                    <div className="flex items-baseline gap-1.5">
                      <p className={`text-2xl font-black bg-gradient-to-r ${card.gradient} bg-clip-text text-transparent`}>
                        {card.value}
                      </p>
                      {card.highlight && (
                        <span className="relative flex h-2.5 w-2.5">
                          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${card.pulseColor} opacity-75`}></span>
                          <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${card.pulseColor}`}></span>
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {/* Icon */}
                  <div className={`p-2 rounded-lg ${card.iconBg} border border-white/30 group-hover/stat:scale-110 transition-transform flex-shrink-0`}>
                    <Icon className={`h-4 w-4 ${card.iconColor}`} />
                  </div>
                </div>
                
                <p className="text-[9px] font-semibold text-gray-600 mb-2 truncate">
                  {card.subtitle}
                </p>
                
                {/* Progress bar with gradient */}
                {card.progress !== undefined && (
                  <div className="relative">
                    <div className="h-1.5 bg-white/50 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${card.progressColor} rounded-full transition-all duration-700 ease-out`}
                        style={{ width: `${card.progress}%` }}
                      ></div>
                    </div>
                    <span className="text-[9px] font-bold text-gray-600 mt-0.5 block text-left">{Math.round(card.progress)}%</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )
      })}
    </div>
  )
}
