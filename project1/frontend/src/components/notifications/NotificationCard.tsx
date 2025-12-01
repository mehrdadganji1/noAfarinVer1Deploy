import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Bell,
  CheckCircle,
  Trash2,
  FileText,
  Users,
  Calendar,
  GraduationCap,
  ClipboardCheck,
  DollarSign,
  Shield,
  AlertCircle,
  Trophy,
  FolderKanban,
  Target,
  MessageSquare,
  Settings as SettingsIcon,
} from 'lucide-react'

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

interface NotificationCardProps {
  notification: Notification
  onMarkAsRead: (id: string) => void
  onDelete: (id: string) => void
  onClick?: (notification: Notification) => void
  index?: number
}

const typeConfig = {
  achievement: { icon: Trophy, color: 'from-amber-500 to-amber-600', bg: 'from-amber-500/10 to-amber-600/5', text: 'text-amber-600' },
  project: { icon: FolderKanban, color: 'from-blue-500 to-blue-600', bg: 'from-blue-500/10 to-blue-600/5', text: 'text-blue-600' },
  milestone: { icon: Target, color: 'from-green-500 to-green-600', bg: 'from-green-500/10 to-green-600/5', text: 'text-green-600' },
  team: { icon: Users, color: 'from-purple-500 to-purple-600', bg: 'from-purple-500/10 to-purple-600/5', text: 'text-purple-600' },
  event: { icon: Calendar, color: 'from-cyan-500 to-cyan-600', bg: 'from-cyan-500/10 to-cyan-600/5', text: 'text-cyan-600' },
  course: { icon: GraduationCap, color: 'from-indigo-500 to-indigo-600', bg: 'from-indigo-500/10 to-indigo-600/5', text: 'text-indigo-600' },
  community: { icon: MessageSquare, color: 'from-pink-500 to-pink-600', bg: 'from-pink-500/10 to-pink-600/5', text: 'text-pink-600' },
  application: { icon: FileText, color: 'from-gray-500 to-gray-600', bg: 'from-gray-500/10 to-gray-600/5', text: 'text-gray-600' },
  training: { icon: GraduationCap, color: 'from-teal-500 to-teal-600', bg: 'from-teal-500/10 to-teal-600/5', text: 'text-teal-600' },
  evaluation: { icon: ClipboardCheck, color: 'from-orange-500 to-orange-600', bg: 'from-orange-500/10 to-orange-600/5', text: 'text-orange-600' },
  funding: { icon: DollarSign, color: 'from-emerald-500 to-emerald-600', bg: 'from-emerald-500/10 to-emerald-600/5', text: 'text-emerald-600' },
  'role-change': { icon: Shield, color: 'from-violet-500 to-violet-600', bg: 'from-violet-500/10 to-violet-600/5', text: 'text-violet-600' },
  'status-change': { icon: AlertCircle, color: 'from-rose-500 to-rose-600', bg: 'from-rose-500/10 to-rose-600/5', text: 'text-rose-600' },
  system: { icon: SettingsIcon, color: 'from-slate-500 to-slate-600', bg: 'from-slate-500/10 to-slate-600/5', text: 'text-slate-600' },
  default: { icon: Bell, color: 'from-gray-500 to-gray-600', bg: 'from-gray-500/10 to-gray-600/5', text: 'text-gray-600' },
}

const priorityConfig = {
  urgent: { badge: 'فوری', color: 'bg-red-100 text-red-700 border-red-200' },
  high: { badge: 'مهم', color: 'bg-orange-100 text-orange-700 border-orange-200' },
  medium: { badge: 'متوسط', color: 'bg-blue-100 text-blue-700 border-blue-200' },
  low: { badge: 'کم', color: 'bg-gray-100 text-gray-700 border-gray-200' },
}

export default function NotificationCard({
  notification,
  onMarkAsRead,
  onDelete,
  onClick,
  index = 0,
}: NotificationCardProps) {
  const config = typeConfig[notification.type as keyof typeof typeConfig] || typeConfig.default
  const Icon = config.icon
  const priority = priorityConfig[notification.priority as keyof typeof priorityConfig]

  const formatTime = (date: string) => {
    try {
      const now = new Date()
      const notificationDate = new Date(date)
      const diffMs = now.getTime() - notificationDate.getTime()
      const diffMins = Math.floor(diffMs / 60000)
      const diffHours = Math.floor(diffMins / 60)
      const diffDays = Math.floor(diffHours / 24)

      if (diffMins < 1) return 'همین الان'
      if (diffMins < 60) return `${diffMins} دقیقه پیش`
      if (diffHours < 24) return `${diffHours} ساعت پیش`
      if (diffDays < 7) return `${diffDays} روز پیش`
      return notificationDate.toLocaleDateString('fa-IR')
    } catch {
      return new Date(date).toLocaleDateString('fa-IR')
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      className="group"
    >
      <Card 
        className={`
          hover:shadow-lg transition-all duration-300 cursor-pointer
          border-r-4 ${config.text.replace('text-', 'border-')}
          ${!notification.isRead ? 'bg-gradient-to-l from-blue-50/30 to-transparent' : ''}
        `}
        onClick={() => onClick?.(notification)}
      >
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            {/* Icon */}
            <div className={`
              flex-shrink-0 w-12 h-12 rounded-xl 
              bg-gradient-to-br ${config.bg}
              flex items-center justify-center
              group-hover:scale-110 transition-transform duration-300
            `}>
              <Icon className={`h-6 w-6 ${config.text}`} />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              {/* Header */}
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex-1 min-w-0">
                  <h3 className={`
                    font-bold text-sm leading-tight mb-1
                    ${!notification.isRead ? 'text-gray-900' : 'text-gray-600'}
                  `}>
                    {notification.title}
                  </h3>
                  <div className="flex items-center gap-2 flex-wrap">
                    {!notification.isRead && (
                      <Badge className="bg-gradient-to-r from-blue-500 to-blue-600 text-white text-[10px] px-2 py-0.5">
                        جدید
                      </Badge>
                    )}
                    {notification.priority !== 'low' && priority && (
                      <Badge variant="outline" className={`${priority.color} text-[10px] px-2 py-0.5`}>
                        {priority.badge}
                      </Badge>
                    )}
                    <span className="text-[10px] text-gray-500">
                      {formatTime(notification.createdAt)}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {!notification.isRead && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        onMarkAsRead(notification._id)
                      }}
                      className="h-8 w-8 p-0 hover:bg-green-50 hover:text-green-600"
                      title="علامت به عنوان خوانده شده"
                    >
                      <CheckCircle className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      onDelete(notification._id)
                    }}
                    className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600"
                    title="حذف"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Message */}
              <p className="text-sm text-gray-600 leading-relaxed line-clamp-2">
                {notification.message}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
