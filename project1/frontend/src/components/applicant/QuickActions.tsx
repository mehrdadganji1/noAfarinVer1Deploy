import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Upload,
  Calendar,
  BookOpen,
  HelpCircle,
  FileText,
  ArrowRight,
  Zap
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'

interface QuickAction {
  title: string
  description: string
  icon: any
  path: string
  color: 'cyan' | 'purple' | 'pink' | 'green' | 'orange'
  highlight?: boolean
}

interface QuickActionsProps {
  hasApplication?: boolean
  upcomingInterviews?: number
}

export default function QuickActions({
  hasApplication = false,
  upcomingInterviews = 0,
}: QuickActionsProps) {
  const navigate = useNavigate()

  const getColorClasses = (color: string) => {
    const colors = {
      cyan: {
        gradient: 'from-[#00D9FF] to-[#00B8D9]',
        iconBg: 'bg-[#00D9FF]/10',
        iconColor: 'text-[#00D9FF]',
        borderHover: 'group-hover/action:border-[#00D9FF]/30',
        textHover: 'group-hover/action:text-[#00D9FF]',
      },
      purple: {
        gradient: 'from-[#7209B7] to-[#AB47BC]',
        iconBg: 'bg-[#7209B7]/10',
        iconColor: 'text-[#7209B7]',
        borderHover: 'group-hover/action:border-[#7209B7]/30',
        textHover: 'group-hover/action:text-[#7209B7]',
      },
      pink: {
        gradient: 'from-[#FF006E] to-[#FF4DA7]',
        iconBg: 'bg-[#FF006E]/10',
        iconColor: 'text-[#FF006E]',
        borderHover: 'group-hover/action:border-[#FF006E]/30',
        textHover: 'group-hover/action:text-[#FF006E]',
      },
      green: {
        gradient: 'from-green-500 to-green-600',
        iconBg: 'bg-green-500/10',
        iconColor: 'text-green-600',
        borderHover: 'group-hover/action:border-green-300',
        textHover: 'group-hover/action:text-green-600',
      },
      orange: {
        gradient: 'from-orange-500 to-orange-600',
        iconBg: 'bg-orange-500/10',
        iconColor: 'text-orange-600',
        borderHover: 'group-hover/action:border-orange-300',
        textHover: 'group-hover/action:text-orange-600',
      },
    }
    return colors[color as keyof typeof colors] || colors.cyan
  }

  const actions: QuickAction[] = [
    {
      title: hasApplication ? 'مشاهده درخواست' : 'ثبت درخواست',
      description: hasApplication 
        ? 'پیگیری وضعیت درخواست خود' 
        : 'شروع فرآیند ثبت‌نام',
      icon: FileText,
      path: hasApplication ? '/applicant/application-status' : '/applicant/application-form',
      color: 'pink',
      highlight: !hasApplication,
    },
    {
      title: 'مدیریت مدارک',
      description: 'آپلود و پیگیری مدارک',
      icon: Upload,
      path: '/applicant/documents',
      color: 'cyan',
      highlight: hasApplication && !upcomingInterviews,
    },
    {
      title: 'مصاحبه‌ها',
      description: upcomingInterviews > 0 
        ? `${upcomingInterviews} مصاحبه آینده` 
        : 'مشاهده برنامه مصاحبه',
      icon: Calendar,
      path: '/applicant/interviews',
      color: 'purple',
      highlight: upcomingInterviews > 0,
    },
    {
      title: 'منابع آموزشی',
      description: 'دسترسی به راهنماها و مقالات',
      icon: BookOpen,
      path: '/applicant/resources',
      color: 'green',
    },
    {
      title: 'راهنما و سوالات',
      description: 'پاسخ به سوالات متداول',
      icon: HelpCircle,
      path: '/applicant/help',
      color: 'orange',
    },
  ]

  return (
    <div className="relative group">
      {/* Main gradient border */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#00D9FF] via-[#7209B7] to-[#FF006E] rounded-xl p-[2px]">
        <div className="w-full h-full bg-white rounded-xl" />
      </div>
      
      <Card className="relative border-transparent shadow-[0_0_12px_rgba(0,217,255,0.08),0_0_20px_rgba(114,9,183,0.06)]">
        <CardHeader className="pb-2 bg-gradient-to-r from-neutral-50/50 to-white">
          <CardTitle className="flex items-center gap-1.5">
            <div className="p-1 bg-gradient-to-br from-[#00D9FF]/15 to-[#7209B7]/15 rounded-lg">
              <Zap className="h-3.5 w-3.5 text-[#7209B7]" />
            </div>
            <span className="text-sm sm:text-base font-bold">دسترسی سریع</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-2 sm:gap-3">
            {actions.map((action, index) => {
              const Icon = action.icon
              const colorClasses = getColorClasses(action.color)
              
              return (
                <div
                  key={index}
                  className="relative group/action"
                >
                  {/* Gradient border on hover */}
                  <div className={`absolute -inset-[1px] bg-gradient-to-br ${colorClasses.gradient} opacity-0 group-hover/action:opacity-100 rounded-lg p-[2px] transition-opacity duration-300`}>
                    <div className="w-full h-full bg-white rounded-lg" />
                  </div>
                  
                  <button
                    onClick={() => navigate(action.path)}
                    className={`
                      relative w-full p-2 rounded-lg
                      bg-white border border-neutral-200
                      ${colorClasses.borderHover}
                      hover:shadow-md
                      transition-all duration-200
                      text-left
                      group-hover/action:scale-[1.01]
                    `}
                  >
                    {/* Highlight indicator */}
                    {action.highlight && (
                      <div className="absolute top-1.5 right-1.5 flex h-2 w-2">
                        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${colorClasses.iconBg} opacity-75`}></span>
                        <span className={`relative inline-flex rounded-full h-2 w-2 ${colorClasses.iconBg.replace('/10', '')}`}></span>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-2">
                      {/* Icon */}
                      <div className={`
                        flex-shrink-0 p-1.5 rounded-lg
                        ${colorClasses.iconBg}
                        group-hover/action:scale-110
                        transition-transform duration-300
                      `}>
                        <Icon className={`h-4 w-4 ${colorClasses.iconColor}`} />
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <h4 className={`
                          font-semibold text-neutral-900 text-xs mb-0.5
                          ${colorClasses.textHover}
                          transition-colors truncate
                        `}>
                          {action.title}
                        </h4>
                        <p className="text-[10px] text-neutral-600 leading-tight line-clamp-1">
                          {action.description}
                        </p>
                      </div>
                      
                      {/* Arrow */}
                      <ArrowRight className={`
                        flex-shrink-0 h-3.5 w-3.5
                        ${colorClasses.iconColor}
                        group-hover/action:translate-x-0.5
                        transition-transform duration-200
                      `} />
                    </div>
                  </button>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
