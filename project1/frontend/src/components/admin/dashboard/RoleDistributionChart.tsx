import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users } from 'lucide-react'
import { AdminStats } from '@/hooks/useAdminStats'

interface RoleDistributionChartProps {
  stats: AdminStats | undefined
}

export default function RoleDistributionChart({ stats }: RoleDistributionChartProps) {
  const roles = [
    { name: 'متقاضیان', value: stats?.users.applicants || 0, color: 'bg-yellow-500' },
    { name: 'اعضای باشگاه', value: stats?.users.clubMembers || 0, color: 'bg-purple-500' },
    { name: 'مدیران', value: stats?.users.admins || 0, color: 'bg-red-500' },
  ]

  const total = roles.reduce((sum, role) => sum + role.value, 0)

  return (
    <Card className="border-2">
      <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-t-lg">
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5 text-purple-600" />
          توزیع نقش‌ها
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        {/* Circular Progress */}
        <div className="flex items-center justify-center mb-6">
          <div className="relative w-48 h-48">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="96"
                cy="96"
                r="80"
                fill="none"
                stroke="#e5e7eb"
                strokeWidth="16"
              />
              {roles.map((role, index) => {
                const percentage = total > 0 ? (role.value / total) * 100 : 0
                const circumference = 2 * Math.PI * 80
                const offset = circumference - (percentage / 100) * circumference
                const prevPercentages = roles.slice(0, index).reduce((sum, r) => sum + (total > 0 ? (r.value / total) * 100 : 0), 0)
                const rotation = (prevPercentages / 100) * 360

                return (
                  <circle
                    key={role.name}
                    cx="96"
                    cy="96"
                    r="80"
                    fill="none"
                    className={role.color.replace('bg-', 'stroke-')}
                    strokeWidth="16"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    style={{
                      transform: `rotate(${rotation}deg)`,
                      transformOrigin: '96px 96px',
                    }}
                  />
                )
              })}
            </svg>
            <div className="absolute inset-0 flex items-center justify-center flex-col">
              <p className="text-3xl font-bold text-gray-900">{total}</p>
              <p className="text-sm text-gray-600">کل کاربران</p>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="space-y-3">
          {roles.map((role) => {
            const percentage = total > 0 ? Math.round((role.value / total) * 100) : 0
            return (
              <div key={role.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-4 h-4 ${role.color} rounded-full`}></div>
                  <span className="text-sm font-medium text-gray-700">{role.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-gray-900">{role.value}</span>
                  <span className="text-xs text-gray-500">({percentage}%)</span>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
