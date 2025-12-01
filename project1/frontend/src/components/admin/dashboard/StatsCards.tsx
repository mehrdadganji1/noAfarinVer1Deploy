import { Card, CardContent } from '@/components/ui/card'
import { Users, UserCheck, Clock, CheckCircle2, TrendingUp, TrendingDown } from 'lucide-react'
import { AdminStats } from '@/hooks/useAdminStats'

interface StatsCardsProps {
  stats: AdminStats | undefined
  isLoading: boolean
}

export default function StatsCards({ stats, isLoading }: StatsCardsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="animate-pulse">
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
      title: 'کل کاربران',
      value: stats?.users.total || 0,
      change: stats?.users.growth || 0,
      icon: Users,
      color: 'blue',
      bgColor: 'bg-blue-100',
      iconColor: 'text-blue-600',
    },
    {
      title: 'درخواست‌های در انتظار',
      value: stats?.applications.pending || 0,
      subtitle: `از ${stats?.applications.total || 0} درخواست`,
      icon: Clock,
      color: 'yellow',
      bgColor: 'bg-yellow-100',
      iconColor: 'text-yellow-600',
    },
    {
      title: 'نرخ تایید',
      value: `${stats?.applications.approvalRate || 0}%`,
      subtitle: `${stats?.applications.approved || 0} تایید شده`,
      icon: CheckCircle2,
      color: 'green',
      bgColor: 'bg-green-100',
      iconColor: 'text-green-600',
    },
    {
      title: 'اعضای فعال',
      value: stats?.users.clubMembers || 0,
      subtitle: `از ${stats?.users.total || 0} کاربر`,
      icon: UserCheck,
      color: 'purple',
      bgColor: 'bg-purple-100',
      iconColor: 'text-purple-600',
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => (
        <Card 
          key={index}
          className="hover:shadow-lg transition-all duration-300 border-2 hover:border-opacity-50"
          style={{ borderColor: `var(--${card.color}-200)` }}
        >
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 ${card.bgColor} rounded-xl`}>
                <card.icon className={`h-6 w-6 ${card.iconColor}`} />
              </div>
              {card.change !== undefined && (
                <div className={`flex items-center gap-1 text-sm ${card.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {card.change >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                  <span className="font-semibold">{Math.abs(card.change)}%</span>
                </div>
              )}
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">{card.title}</p>
              <p className="text-3xl font-bold text-gray-900">{card.value}</p>
              {card.subtitle && (
                <p className="text-xs text-gray-500 mt-1">{card.subtitle}</p>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
