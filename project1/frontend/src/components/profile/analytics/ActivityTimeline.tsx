import { motion } from 'framer-motion'
import {
  GraduationCap, Award, Code,
  Users, BookOpen, Trophy, Star,
  GitBranch, MessageSquare, Heart, Share2
} from 'lucide-react'

interface Activity {
  id: string
  type: 'project' | 'education' | 'certification' | 'skill' | 'achievement' | 'course' | 'collaboration' | 'endorsement'
  title: string
  description: string
  date: string
  icon?: any
  color?: string
}

interface ActivityTimelineProps {
  activities?: Activity[]
  limit?: number
}

const ActivityTimeline = ({ activities, limit = 10 }: ActivityTimelineProps) => {
  // داده‌های نمونه
  const defaultActivities: Activity[] = [
    {
      id: '1',
      type: 'project',
      title: 'پروژه جدید ایجاد شد',
      description: 'سیستم مدیریت باشگاه فناوری',
      date: '2 ساعت پیش'
    },
    {
      id: '2',
      type: 'achievement',
      title: 'دستاورد جدید',
      description: 'نشان "توسعه‌دهنده حرفه‌ای" دریافت شد',
      date: '5 ساعت پیش'
    },
    {
      id: '3',
      type: 'skill',
      title: 'مهارت جدید',
      description: 'React.js به مهارت‌ها اضافه شد',
      date: 'دیروز'
    },
    {
      id: '4',
      type: 'endorsement',
      title: 'تاییدیه دریافت شد',
      description: 'علی محمدی مهارت TypeScript شما را تایید کرد',
      date: 'دیروز'
    },
    {
      id: '5',
      type: 'course',
      title: 'دوره تکمیل شد',
      description: 'دوره پیشرفته React با موفقیت به پایان رسید',
      date: '2 روز پیش'
    },
    {
      id: '6',
      type: 'certification',
      title: 'گواهینامه جدید',
      description: 'AWS Certified Developer - Associate',
      date: '3 روز پیش'
    },
    {
      id: '7',
      type: 'collaboration',
      title: 'همکاری جدید',
      description: 'به پروژه "سیستم یادگیری هوشمند" پیوست',
      date: '4 روز پیش'
    },
    {
      id: '8',
      type: 'education',
      title: 'سابقه تحصیلی',
      description: 'کارشناسی مهندسی کامپیوتر به پروفایل اضافه شد',
      date: '1 هفته پیش'
    }
  ]

  const displayActivities = (activities || defaultActivities).slice(0, limit)

  const getActivityConfig = (type: Activity['type']) => {
    const configs = {
      project: {
        icon: Code,
        color: 'blue',
        bgColor: 'bg-blue-50',
        iconColor: 'text-blue-600',
        borderColor: 'border-blue-200'
      },
      education: {
        icon: GraduationCap,
        color: 'purple',
        bgColor: 'bg-purple-50',
        iconColor: 'text-purple-600',
        borderColor: 'border-purple-200'
      },
      certification: {
        icon: Award,
        color: 'amber',
        bgColor: 'bg-amber-50',
        iconColor: 'text-amber-600',
        borderColor: 'border-amber-200'
      },
      skill: {
        icon: Star,
        color: 'green',
        bgColor: 'bg-green-50',
        iconColor: 'text-green-600',
        borderColor: 'border-green-200'
      },
      achievement: {
        icon: Trophy,
        color: 'yellow',
        bgColor: 'bg-yellow-50',
        iconColor: 'text-yellow-600',
        borderColor: 'border-yellow-200'
      },
      course: {
        icon: BookOpen,
        color: 'indigo',
        bgColor: 'bg-indigo-50',
        iconColor: 'text-indigo-600',
        borderColor: 'border-indigo-200'
      },
      collaboration: {
        icon: Users,
        color: 'pink',
        bgColor: 'bg-pink-50',
        iconColor: 'text-pink-600',
        borderColor: 'border-pink-200'
      },
      endorsement: {
        icon: Heart,
        color: 'red',
        bgColor: 'bg-red-50',
        iconColor: 'text-red-600',
        borderColor: 'border-red-200'
      }
    }
    return configs[type]
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <GitBranch className="w-5 h-5 text-blue-600" />
          تایم‌لاین فعالیت
        </h3>
        <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
          مشاهده همه
        </button>
      </div>

      <div className="relative">
        {/* Timeline Line */}
        <div className="absolute right-[19px] top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-200 via-purple-200 to-pink-200" />

        {/* Activities */}
        <div className="space-y-6">
          {displayActivities.map((activity, index) => {
            const config = getActivityConfig(activity.type)
            const Icon = config.icon

            return (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative flex gap-4"
              >
                {/* Icon */}
                <div className={`relative z-10 flex-shrink-0 w-10 h-10 ${config.bgColor} rounded-full flex items-center justify-center border-2 ${config.borderColor}`}>
                  <Icon className={`w-5 h-5 ${config.iconColor}`} />
                </div>

                {/* Content */}
                <div className="flex-1 pb-6">
                  <div className={`${config.bgColor} rounded-xl p-4 border-2 ${config.borderColor} hover:shadow-md transition-shadow`}>
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-gray-900">{activity.title}</h4>
                      <span className="text-xs text-gray-500">{activity.date}</span>
                    </div>
                    <p className="text-sm text-gray-600">{activity.description}</p>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-3 mt-3 pt-3 border-t border-gray-200">
                      <button className="flex items-center gap-1 text-xs text-gray-500 hover:text-blue-600 transition-colors">
                        <Heart className="w-3.5 h-3.5" />
                        <span>پسندیدن</span>
                      </button>
                      <button className="flex items-center gap-1 text-xs text-gray-500 hover:text-blue-600 transition-colors">
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>نظر</span>
                      </button>
                      <button className="flex items-center gap-1 text-xs text-gray-500 hover:text-blue-600 transition-colors">
                        <Share2 className="w-3.5 h-3.5" />
                        <span>اشتراک</span>
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Load More */}
      {displayActivities.length >= limit && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="w-full py-3 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
        >
          بارگذاری فعالیت‌های بیشتر
        </motion.button>
      )}
    </div>
  )
}

export default ActivityTimeline
