import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Activity } from 'lucide-react'
import { AdminStats } from '@/hooks/useAdminStats'

interface ActivityChartProps {
  stats: AdminStats | undefined
}

export default function ActivityChart({ stats }: ActivityChartProps) {
  const activities = [
    { label: 'امروز', value: stats?.activity.dailyActiveUsers || 0, color: 'bg-green-500' },
    { label: 'این هفته', value: stats?.activity.weeklyActiveUsers || 0, color: 'bg-blue-500' },
    { label: 'این ماه', value: stats?.activity.monthlyActiveUsers || 0, color: 'bg-purple-500' },
  ]

  const maxValue = Math.max(...activities.map(a => a.value), 1)

  return (
    <Card className="border-2">
      <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-t-lg">
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-green-600" />
          کاربران فعال
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-6">
          {activities.map((activity) => (
            <div key={activity.label} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">{activity.label}</span>
                <span className="text-2xl font-bold text-gray-900">{activity.value}</span>
              </div>
              <div className="relative w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                <div
                  className={`${activity.color} h-4 rounded-full transition-all duration-500 flex items-center justify-end pr-2`}
                  style={{ width: `${(activity.value / maxValue) * 100}%` }}
                >
                  {activity.value > 0 && (
                    <span className="text-xs text-white font-semibold">
                      {Math.round((activity.value / maxValue) * 100)}%
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4">
          <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border border-green-200">
            <p className="text-xs text-gray-600 mb-1">نرخ فعالیت روزانه</p>
            <p className="text-xl font-bold text-green-600">
              {stats?.users.total ? Math.round((stats.activity.dailyActiveUsers / stats.users.total) * 100) : 0}%
            </p>
          </div>
          <div className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg border border-blue-200">
            <p className="text-xs text-gray-600 mb-1">نرخ فعالیت ماهانه</p>
            <p className="text-xl font-bold text-blue-600">
              {stats?.users.total ? Math.round((stats.activity.monthlyActiveUsers / stats.users.total) * 100) : 0}%
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
