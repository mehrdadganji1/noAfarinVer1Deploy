import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, ChevronUp } from 'lucide-react'

interface Notification {
  _id: string
  type: string
  priority: string
  title: string
  message: string
  link?: string
  isRead: boolean
  createdAt: string
}

interface NotificationGroup {
  title: string
  notifications: Notification[]
  count: number
}

interface NotificationGroupsProps {
  notifications: Notification[]
  groupBy: 'date' | 'type'
  renderNotification: (notification: Notification) => React.ReactNode
}

export default function NotificationGroups({
  notifications,
  groupBy,
  renderNotification
}: NotificationGroupsProps) {
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set(['امروز', 'achievement']))

  const toggleGroup = (groupTitle: string) => {
    setExpandedGroups(prev => {
      const newSet = new Set(prev)
      if (newSet.has(groupTitle)) {
        newSet.delete(groupTitle)
      } else {
        newSet.add(groupTitle)
      }
      return newSet
    })
  }

  const groupNotifications = (): NotificationGroup[] => {
    if (groupBy === 'date') {
      const today = new Date()
      const yesterday = new Date(today)
      yesterday.setDate(yesterday.getDate() - 1)
      const lastWeek = new Date(today)
      lastWeek.setDate(lastWeek.getDate() - 7)

      const groups: Record<string, Notification[]> = {
        'امروز': [],
        'دیروز': [],
        'هفته گذشته': [],
        'قدیمی‌تر': []
      }

      notifications.forEach(notif => {
        const notifDate = new Date(notif.createdAt)
        if (notifDate.toDateString() === today.toDateString()) {
          groups['امروز'].push(notif)
        } else if (notifDate.toDateString() === yesterday.toDateString()) {
          groups['دیروز'].push(notif)
        } else if (notifDate >= lastWeek) {
          groups['هفته گذشته'].push(notif)
        } else {
          groups['قدیمی‌تر'].push(notif)
        }
      })

      return Object.entries(groups)
        .filter(([_, notifs]) => notifs.length > 0)
        .map(([title, notifs]) => ({
          title,
          notifications: notifs,
          count: notifs.length
        }))
    } else {
      const groups: Record<string, Notification[]> = {}
      
      notifications.forEach(notif => {
        if (!groups[notif.type]) {
          groups[notif.type] = []
        }
        groups[notif.type].push(notif)
      })

      const typeLabels: Record<string, string> = {
        achievement: 'دستاوردها',
        project: 'پروژه‌ها',
        milestone: 'مایلستون‌ها',
        team: 'تیم',
        event: 'رویدادها',
        course: 'دوره‌ها',
        community: 'انجمن',
        system: 'سیستمی'
      }

      return Object.entries(groups).map(([type, notifs]) => ({
        title: typeLabels[type] || type,
        notifications: notifs,
        count: notifs.length
      }))
    }
  }

  const groups = groupNotifications()

  return (
    <div className="space-y-4">
      {groups.map((group) => {
        const isExpanded = expandedGroups.has(group.title)
        
        return (
          <div key={group.title} className="border border-gray-200 rounded-lg overflow-hidden">
            {/* Group Header */}
            <button
              onClick={() => toggleGroup(group.title)}
              className="w-full px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <h3 className="font-semibold text-gray-900">{group.title}</h3>
                <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">
                  {group.count}
                </span>
              </div>
              {isExpanded ? (
                <ChevronUp className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-500" />
              )}
            </button>

            {/* Group Content */}
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="p-4 space-y-3 bg-white">
                    {group.notifications.map(notification => (
                      <div key={notification._id}>
                        {renderNotification(notification)}
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )
      })}
    </div>
  )
}
