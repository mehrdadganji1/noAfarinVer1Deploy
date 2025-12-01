import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Clock, User, FileText, CheckCircle, XCircle } from 'lucide-react'

interface Activity {
  id: string
  type: 'user' | 'application' | 'document' | 'approval' | 'rejection' | 'system'
  title: string
  description: string
  timestamp: string
  user?: string
  status?: 'success' | 'warning' | 'error' | 'info'
}

interface RecentActivityFeedProps {
  activities?: Activity[]
  isLoading?: boolean
}

const activityIcons = {
  user: User,
  application: FileText,
  document: FileText,
  approval: CheckCircle,
  rejection: XCircle,
  system: Clock,
}

const activityColors = {
  user: 'from-blue-500 to-cyan-500',
  application: 'from-orange-500 to-amber-500',
  document: 'from-purple-500 to-pink-500',
  approval: 'from-green-500 to-emerald-500',
  rejection: 'from-red-500 to-pink-500',
  system: 'from-gray-500 to-slate-500',
}

export default function RecentActivityFeed({ activities = [], isLoading }: RecentActivityFeedProps) {
  if (isLoading) {
    return (
      <Card className="border-0 shadow-xl dark:bg-gray-800">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-900/20 dark:to-slate-900/20">
          <CardTitle className="text-xl font-bold dark:text-white">فعالیت‌های اخیر</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="animate-pulse flex items-start gap-4">
                <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-0 shadow-xl overflow-hidden dark:bg-gray-800">
      <CardHeader className="bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-900/20 dark:to-slate-900/20">
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <div className="p-2 bg-gradient-to-br from-gray-600 to-slate-600 rounded-lg shadow-lg">
            <Clock className="h-5 w-5 text-white" />
          </div>
          <span className="dark:text-white">فعالیت‌های اخیر</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-3">
          {activities.length === 0 ? (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              <Clock className="h-16 w-16 mx-auto mb-3 opacity-30" />
              <p className="text-lg font-medium">فعالیتی ثبت نشده است</p>
            </div>
          ) : (
            activities.map((activity, index) => {
              const Icon = activityIcons[activity.type]
              const gradient = activityColors[activity.type]

              return (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ x: 4 }}
                  className="flex items-start gap-4 p-4 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all cursor-pointer group"
                >
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${gradient} shadow-lg flex-shrink-0 group-hover:scale-110 transition-transform`}>
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-gray-900 dark:text-white mb-1">{activity.title}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-2 leading-relaxed">{activity.description}</p>
                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                      <Clock className="h-3 w-3" />
                      <span>{activity.timestamp}</span>
                      {activity.user && (
                        <>
                          <span>•</span>
                          <span className="font-medium">{activity.user}</span>
                        </>
                      )}
                    </div>
                  </div>
                </motion.div>
              )
            })
          )}
        </div>
      </CardContent>
    </Card>
  )
}
