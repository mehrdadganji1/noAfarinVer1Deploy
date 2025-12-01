import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Clock } from 'lucide-react'
import ActivityItem from './ActivityItem'

interface Activity {
  id: string
  type: 'user' | 'application' | 'event' | 'team' | 'system' | 'error' | 'success'
  title: string
  description: string
  user: string
  timestamp: string
  status: 'success' | 'warning' | 'error' | 'info'
}

interface ActivityTimelineProps {
  activities: Activity[]
  getIcon: (type: string) => any
  getStatusIcon: (status: string) => any
  getTypeColor: (type: string) => string
  getStatusColor: (status: string) => string
}

export default function ActivityTimeline({
  activities,
  getIcon,
  getStatusIcon,
  getTypeColor,
  getStatusColor
}: ActivityTimelineProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <Card className="border-0 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-t-xl">
          <CardTitle className="flex items-center gap-2">
            <div className="p-2 bg-indigo-600 rounded-lg">
              <Clock className="h-5 w-5 text-white" />
            </div>
            <span>تایم‌لاین فعالیت‌ها ({activities.length})</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          {activities.length === 0 ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                <Clock className="h-8 w-8 text-gray-400" />
              </div>
              <p className="text-gray-600">فعالیتی یافت نشد</p>
            </div>
          ) : (
            <div className="space-y-3">
              {activities.map((activity, index) => (
                <ActivityItem
                  key={activity.id}
                  {...activity}
                  icon={getIcon(activity.type)}
                  statusIcon={getStatusIcon(activity.status)}
                  typeColor={getTypeColor(activity.type)}
                  statusColor={getStatusColor(activity.status)}
                  delay={index * 0.05}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
