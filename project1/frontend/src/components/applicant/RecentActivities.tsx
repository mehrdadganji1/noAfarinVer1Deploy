import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  FileText,
  Upload,
  Calendar,
  MessageSquare,
  CheckCircle2,
  Clock,
  XCircle
} from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { useRecentActivities } from '@/hooks/useActivities'

interface RecentActivitiesProps {
  limit?: number
}

export default function RecentActivities({ 
  limit = 10 
}: RecentActivitiesProps) {
  const { data: activities = [], isLoading } = useRecentActivities({ limit })
  const getActivityIcon = (type: string, status?: string) => {
    switch (type) {
      case 'application':
        return FileText
      case 'document':
        return Upload
      case 'interview':
        return Calendar
      case 'message':
        return MessageSquare
      case 'status':
        return status === 'success' ? CheckCircle2 : status === 'error' ? XCircle : Clock
      case 'profile':
        return CheckCircle2
      case 'notification':
        return MessageSquare
      default:
        return Clock
    }
  }

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'success':
        return { label: 'موفق', variant: 'default' as const, className: 'bg-green-100 text-green-700' }
      case 'error':
        return { label: 'خطا', variant: 'destructive' as const, className: '' }
      case 'pending':
        return { label: 'در انتظار', variant: 'secondary' as const, className: '' }
      default:
        return null
    }
  }

  if (isLoading) {
    return (
      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-br from-[#00D9FF] via-[#7209B7] to-[#FF006E] rounded-xl p-[2px]">
          <div className="w-full h-full bg-white rounded-xl" />
        </div>
        
        <Card className="relative border-transparent shadow-[0_0_12px_rgba(0,217,255,0.08),0_0_20px_rgba(114,9,183,0.06)]">
          <CardHeader className="pb-2 bg-gradient-to-r from-neutral-50/50 to-white">
            <CardTitle className="flex items-center gap-1.5">
              <div className="p-1 bg-gradient-to-br from-[#00D9FF]/15 to-[#7209B7]/15 rounded-lg">
                <Clock className="h-3.5 w-3.5 text-[#7209B7]" />
              </div>
              <span className="text-sm sm:text-base font-bold">فعالیت‌های اخیر</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-3">
            <div className="space-y-1.5">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex gap-2 sm:gap-3 p-2 sm:p-3 animate-pulse">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 bg-gradient-to-br from-[#7209B7]/10 to-[#7209B7]/5 rounded-lg flex-shrink-0"></div>
                  <div className="flex-1 space-y-1.5 sm:space-y-2 min-w-0">
                    <div className="h-2.5 sm:h-3 bg-neutral-200 rounded w-3/4"></div>
                    <div className="h-2 sm:h-2.5 bg-neutral-200 rounded w-full"></div>
                    <div className="h-1.5 sm:h-2 bg-neutral-200 rounded w-1/3"></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (activities.length === 0) {
    return (
      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-br from-[#00D9FF] via-[#7209B7] to-[#FF006E] rounded-xl p-[2px]">
          <div className="w-full h-full bg-white rounded-xl" />
        </div>
        
        <Card className="relative border-transparent shadow-[0_0_12px_rgba(0,217,255,0.08),0_0_20px_rgba(114,9,183,0.06)]">
          <CardHeader className="pb-2 bg-gradient-to-r from-neutral-50/50 to-white">
            <CardTitle className="flex items-center gap-1.5">
              <div className="p-1 bg-gradient-to-br from-[#00D9FF]/15 to-[#7209B7]/15 rounded-lg">
                <Clock className="h-3.5 w-3.5 text-[#7209B7]" />
              </div>
              <span className="text-sm sm:text-base font-bold">فعالیت‌های اخیر</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-6">
              <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-[#7209B7]/10 to-[#00D9FF]/10 rounded-full flex items-center justify-center">
                <Clock className="h-6 w-6 text-[#7209B7]" />
              </div>
              <p className="font-semibold text-neutral-900 text-sm">هنوز فعالیتی ثبت نشده است</p>
              <p className="text-[10px] text-neutral-600 mt-1 px-4">
                فعالیت‌های شما در اینجا نمایش داده می‌شود
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="relative group">
      {/* Gradient Border */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#00D9FF] via-[#7209B7] to-[#FF006E] rounded-xl p-[2px]">
        <div className="w-full h-full bg-white rounded-xl" />
      </div>
      
      <Card className="relative border-transparent shadow-[0_0_12px_rgba(0,217,255,0.08),0_0_20px_rgba(114,9,183,0.06)]">
        <CardHeader className="pb-2 bg-gradient-to-r from-neutral-50/50 to-white">
          <CardTitle className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 min-w-0">
              <div className="p-1 bg-gradient-to-br from-[#00D9FF]/15 to-[#7209B7]/15 rounded-lg flex-shrink-0">
                <Clock className="h-3.5 w-3.5 text-[#7209B7]" />
              </div>
              <span className="text-sm sm:text-base font-bold truncate">فعالیت‌های اخیر</span>
            </div>
            <Badge 
              variant="outline" 
              className="border-[#7209B7]/30 text-[#7209B7] bg-[#7209B7]/5 text-[10px] flex-shrink-0 px-1.5"
            >
              {activities.length}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-3">
          <div className="space-y-1.5">
            {activities.map((activity, index) => {
              const Icon = getActivityIcon(activity.type, activity.status)
              const statusBadge = getStatusBadge(activity.status)
              
              return (
                <div 
                  key={activity._id || index}
                  className="relative group/item"
                >
                  {/* Gradient Border on Hover */}
                  <div className="absolute -inset-[1px] bg-gradient-to-r from-[#00D9FF]/0 via-[#7209B7]/0 to-[#FF006E]/0 group-hover/item:from-[#00D9FF]/30 group-hover/item:via-[#7209B7]/30 group-hover/item:to-[#FF006E]/30 rounded-lg transition-all duration-300 blur-sm" />
                  
                  <div className="relative flex gap-2 p-2 rounded-lg bg-white group-hover/item:bg-gradient-to-r group-hover/item:from-neutral-50 group-hover/item:to-white border border-transparent group-hover/item:border-[#7209B7]/20 transition-all duration-200 group-hover/item:shadow-sm">
                    {/* Icon with gradient background */}
                    <div className={`
                      flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center
                      transition-all duration-300 group-hover/item:scale-110
                      ${
                        activity.status === 'success' 
                          ? 'bg-gradient-to-br from-[#00D9FF]/15 to-[#00D9FF]/5 group-hover/item:from-[#00D9FF]/25 group-hover/item:to-[#00D9FF]/10'
                          : activity.status === 'error'
                          ? 'bg-gradient-to-br from-[#FF006E]/15 to-[#FF006E]/5 group-hover/item:from-[#FF006E]/25 group-hover/item:to-[#FF006E]/10'
                          : 'bg-gradient-to-br from-[#7209B7]/15 to-[#7209B7]/5 group-hover/item:from-[#7209B7]/25 group-hover/item:to-[#7209B7]/10'
                      }
                    `}>
                      <Icon className={`h-3.5 w-3.5 ${
                        activity.status === 'success'
                          ? 'text-[#00D9FF]'
                          : activity.status === 'error'
                          ? 'text-[#FF006E]'
                          : 'text-[#7209B7]'
                      }`} />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-1 mb-0.5">
                        <h4 className="font-semibold text-neutral-900 text-xs leading-tight truncate">
                          {activity.title}
                        </h4>
                        {statusBadge && (
                          <Badge 
                            variant={statusBadge.variant} 
                            className={`text-[9px] px-1.5 py-0.5 flex-shrink-0 whitespace-nowrap ${
                              activity.status === 'success'
                                ? 'bg-[#00D9FF]/10 text-[#00D9FF] border-[#00D9FF]/30'
                                : activity.status === 'error'
                                ? 'bg-[#FF006E]/10 text-[#FF006E] border-[#FF006E]/30'
                                : 'bg-[#7209B7]/10 text-[#7209B7] border-[#7209B7]/30'
                            }`}
                          >
                            {statusBadge.label}
                          </Badge>
                        )}
                      </div>
                      <p className="text-[10px] text-neutral-600 leading-tight line-clamp-1">
                        {activity.description}
                      </p>
                      <p className="text-[9px] text-neutral-500 mt-1 flex items-center gap-0.5">
                        <Clock className="h-2.5 w-2.5 flex-shrink-0" />
                        <span className="truncate">{formatDate(new Date(activity.createdAt))}</span>
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
          
          {activities.length > 5 && (
            <div className="mt-2 pt-2 border-t border-neutral-100">
              <button className="w-full text-[10px] font-medium text-[#7209B7] hover:text-[#00D9FF] transition-colors flex items-center justify-center gap-0.5 group py-1">
                <span className="whitespace-nowrap">مشاهده همه</span>
                <span className="group-hover:translate-x-0.5 transition-transform">←</span>
              </button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
