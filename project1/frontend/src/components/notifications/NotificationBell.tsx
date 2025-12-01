import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import {
  Bell, BellRing, CheckCircle2, Settings,
  Trophy, FolderKanban, Users, Calendar, BookOpen, MessageSquare,
  Clock, ChevronLeft, X
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import api from '@/lib/api'

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

const typeIcons: Record<string, any> = {
  achievement: Trophy,
  project: FolderKanban,
  team: Users,
  event: Calendar,
  course: BookOpen,
  community: MessageSquare,
  default: Bell,
}

const typeColors: Record<string, string> = {
  achievement: 'text-amber-500',
  project: 'text-blue-500',
  team: 'text-purple-500',
  event: 'text-cyan-500',
  course: 'text-indigo-500',
  community: 'text-pink-500',
  default: 'text-gray-500',
}

export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Fetch unread count
  const { data: unreadCount = 0 } = useQuery({
    queryKey: ['unread-count'],
    queryFn: async () => {
      try {
        const res = await api.get('/notifications/unread-count')
        return res.data.count || 0
      } catch { return 0 }
    },
    refetchInterval: 30000,
  })

  // Fetch recent notifications
  const { data: notifications = [] } = useQuery({
    queryKey: ['recent-notifications'],
    queryFn: async () => {
      try {
        const res = await api.get('/notifications?limit=5')
        return res.data.data?.notifications || []
      } catch { return [] }
    },
    enabled: isOpen,
  })

  // Mark as read
  const markAsRead = useMutation({
    mutationFn: (id: string) => api.patch(`/notifications/${id}/read`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recent-notifications'] })
      queryClient.invalidateQueries({ queryKey: ['unread-count'] })
    },
  })

  // Mark all as read
  const markAllAsRead = useMutation({
    mutationFn: () => api.patch('/notifications/mark-all-read'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recent-notifications'] })
      queryClient.invalidateQueries({ queryKey: ['unread-count'] })
    },
  })

  const formatTime = (date: string) => {
    const diff = Date.now() - new Date(date).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 1) return 'الان'
    if (mins < 60) return `${mins}د`
    const hours = Math.floor(mins / 60)
    if (hours < 24) return `${hours}س`
    return `${Math.floor(hours / 24)}ر`
  }

  const handleNotificationClick = (n: Notification) => {
    if (!n.isRead) markAsRead.mutate(n._id)
    if (n.link) {
      setIsOpen(false)
      navigate(n.link)
    }
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <Button
        variant="ghost"
        size="sm"
        className="relative p-2 hover:bg-gray-100 rounded-full"
        onClick={() => setIsOpen(!isOpen)}
      >
        <motion.div
          animate={unreadCount > 0 ? { rotate: [0, -10, 10, -10, 10, 0] } : {}}
          transition={{ duration: 0.5, repeat: unreadCount > 0 ? Infinity : 0, repeatDelay: 5 }}
        >
          {unreadCount > 0 ? (
            <BellRing className="h-5 w-5 text-gray-700" />
          ) : (
            <Bell className="h-5 w-5 text-gray-700" />
          )}
        </motion.div>
        
        {/* Badge */}
        <AnimatePresence>
          {unreadCount > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center"
            >
              <span className="text-[10px] font-bold text-white px-1">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </Button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute left-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50"
          >
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  <span className="font-bold">اعلان‌ها</span>
                  {unreadCount > 0 && (
                    <Badge className="bg-white/20 text-white text-[10px]">
                      {unreadCount} جدید
                    </Badge>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-white hover:bg-white/20"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Actions */}
            {unreadCount > 0 && (
              <div className="px-4 py-2 border-b bg-gray-50 flex items-center justify-between">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs text-purple-600 hover:text-purple-700"
                  onClick={() => markAllAsRead.mutate()}
                >
                  <CheckCircle2 className="h-3 w-3 ml-1" />
                  علامت همه به عنوان خوانده شده
                </Button>
              </div>
            )}

            {/* Notifications List */}
            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-8 text-center">
                  <Bell className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 text-sm">اعلانی وجود ندارد</p>
                </div>
              ) : (
                <div className="divide-y">
                  {notifications.map((n: Notification) => {
                    const Icon = typeIcons[n.type] || typeIcons.default
                    const color = typeColors[n.type] || typeColors.default
                    
                    return (
                      <motion.div
                        key={n._id}
                        whileHover={{ backgroundColor: 'rgba(139, 92, 246, 0.05)' }}
                        className={`p-3 cursor-pointer transition-colors ${!n.isRead ? 'bg-purple-50/50' : ''}`}
                        onClick={() => handleNotificationClick(n)}
                      >
                        <div className="flex gap-3">
                          <div className={`flex-shrink-0 w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center ${color}`}>
                            <Icon className="h-5 w-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <p className={`text-sm font-medium truncate ${!n.isRead ? 'text-gray-900' : 'text-gray-600'}`}>
                                {n.title}
                              </p>
                              <span className="text-[10px] text-gray-400 flex items-center gap-0.5 flex-shrink-0">
                                <Clock className="h-3 w-3" />
                                {formatTime(n.createdAt)}
                              </span>
                            </div>
                            <p className="text-xs text-gray-500 truncate mt-0.5">{n.message}</p>
                            {!n.isRead && (
                              <div className="w-2 h-2 bg-purple-500 rounded-full absolute top-3 right-3" />
                            )}
                          </div>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-3 border-t bg-gray-50 flex items-center justify-between">
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-gray-600"
                onClick={() => { setIsOpen(false); navigate('/notifications/settings') }}
              >
                <Settings className="h-3 w-3 ml-1" />
                تنظیمات
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-purple-600"
                onClick={() => { setIsOpen(false); navigate('/notifications') }}
              >
                مشاهده همه
                <ChevronLeft className="h-3 w-3 mr-1" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
