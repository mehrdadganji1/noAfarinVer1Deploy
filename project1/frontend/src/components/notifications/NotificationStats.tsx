import { Card, CardContent, CardTitle } from '@/components/ui/card'
import { Bell, BellOff, Check, AlertTriangle } from 'lucide-react'

interface NotificationStatsProps {
  stats: {
    total: number
    unread: number
    read: number
    priorityDistribution: Record<string, number>
  }
  isLoading?: boolean
}

export default function NotificationStats({ stats, isLoading }: NotificationStatsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-2 sm:gap-3">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-3 space-y-2">
              <div className="flex justify-between">
                <div className="h-2 bg-gray-200 rounded w-16"></div>
                <div className="h-7 w-7 bg-gray-200 rounded-lg"></div>
              </div>
              <div className="h-6 bg-gray-300 rounded w-12"></div>
              <div className="h-1.5 bg-gray-200 rounded w-20"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  const urgentCount = stats?.priorityDistribution?.urgent || 0
  const highCount = stats?.priorityDistribution?.high || 0

  return (
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-2 sm:gap-3">
      {/* Total */}
      <div className="relative group/stat">
        <div className="absolute inset-0 bg-gradient-to-br from-[#00D9FF] to-[#00B8D9] rounded-xl p-[2px]">
          <div className="w-full h-full bg-white rounded-xl" />
        </div>
        <Card className="relative border-transparent hover:shadow-md transition-all">
          <CardContent className="p-3">
            <div className="flex items-start justify-between mb-2">
              <CardTitle className="text-[10px] font-bold text-gray-600 uppercase truncate">کل اعلان‌ها</CardTitle>
              <div className="w-7 h-7 bg-gradient-to-br from-[#00D9FF]/15 to-[#00B8D9]/15 rounded-lg flex items-center justify-center flex-shrink-0">
                <Bell className="h-3.5 w-3.5 text-[#00D9FF]" />
              </div>
            </div>
            <div className="text-xl sm:text-2xl font-bold text-[#00D9FF] mb-1">
              {stats?.total || 0}
            </div>
            <p className="text-[9px] text-gray-500 truncate">اعلان در سیستم</p>
          </CardContent>
        </Card>
      </div>

      {/* Unread */}
      <div className="relative group/stat">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-[2px]">
          <div className="w-full h-full bg-white rounded-xl" />
        </div>
        <Card className="relative border-transparent hover:shadow-md transition-all">
          <CardContent className="p-3">
            <div className="flex items-start justify-between mb-2">
              <CardTitle className="text-[10px] font-bold text-gray-600 uppercase truncate">خوانده نشده</CardTitle>
              <div className="w-7 h-7 bg-gradient-to-br from-orange-500/15 to-orange-600/15 rounded-lg flex items-center justify-center flex-shrink-0">
                <BellOff className="h-3.5 w-3.5 text-orange-600" />
              </div>
            </div>
            <div className="text-xl sm:text-2xl font-bold text-orange-600 mb-1">
              {stats?.unread || 0}
            </div>
            <p className="text-[9px] text-gray-500 truncate">نیاز به بررسی</p>
          </CardContent>
        </Card>
      </div>

      {/* Read */}
      <div className="relative group/stat">
        <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-[2px]">
          <div className="w-full h-full bg-white rounded-xl" />
        </div>
        <Card className="relative border-transparent hover:shadow-md transition-all">
          <CardContent className="p-3">
            <div className="flex items-start justify-between mb-2">
              <CardTitle className="text-[10px] font-bold text-gray-600 uppercase truncate">خوانده شده</CardTitle>
              <div className="w-7 h-7 bg-gradient-to-br from-green-500/15 to-green-600/15 rounded-lg flex items-center justify-center flex-shrink-0">
                <Check className="h-3.5 w-3.5 text-green-600" />
              </div>
            </div>
            <div className="text-xl sm:text-2xl font-bold text-green-600 mb-1">
              {stats?.read || 0}
            </div>
            <p className="text-[9px] text-gray-500 truncate">بررسی شده</p>
          </CardContent>
        </Card>
      </div>

      {/* Important */}
      <div className="relative group/stat">
        <div className="absolute inset-0 bg-gradient-to-br from-red-500 to-red-600 rounded-xl p-[2px]">
          <div className="w-full h-full bg-white rounded-xl" />
        </div>
        <Card className="relative border-transparent hover:shadow-md transition-all">
          <CardContent className="p-3">
            <div className="flex items-start justify-between mb-2">
              <CardTitle className="text-[10px] font-bold text-gray-600 uppercase truncate">اعلان‌های مهم</CardTitle>
              <div className="w-7 h-7 bg-gradient-to-br from-red-500/15 to-red-600/15 rounded-lg flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="h-3.5 w-3.5 text-red-600" />
              </div>
            </div>
            <div className="text-xl sm:text-2xl font-bold text-red-600 mb-1">
              {urgentCount + highCount}
            </div>
            <p className="text-[9px] text-gray-500 truncate">
              فوری: {urgentCount} | مهم: {highCount}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
