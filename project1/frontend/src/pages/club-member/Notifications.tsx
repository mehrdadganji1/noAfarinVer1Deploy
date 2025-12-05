import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Bell,
  Search,
  CheckCircle2,
  Trash2,
  Settings,
  BarChart3,
  Trophy,
  FolderKanban,
  Target,
  Users,
  Calendar,
  BookOpen,
  MessageSquare,
  Clock,
  ChevronLeft,
  ChevronRight,
  Inbox,
  BellOff,
  Eye,
  Zap,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import api from '@/lib/api'
import { toast } from '@/components/ui/toast'

const AACO = { primary: '#7209B7', secondary: '#AB47BC', accent: '#FF006E' }

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

const typeConfig: Record<string, { icon: React.ElementType; color: string; label: string }> = {
  achievement: { icon: Trophy, color: 'from-amber-500 to-amber-600', label: 'دستاورد' },
  project: { icon: FolderKanban, color: 'from-blue-500 to-blue-600', label: 'پروژه' },
  milestone: { icon: Target, color: 'from-green-500 to-green-600', label: 'نقطه عطف' },
  team: { icon: Users, color: 'from-purple-500 to-purple-600', label: 'تیم' },
  event: { icon: Calendar, color: 'from-pink-500 to-pink-600', label: 'رویداد' },
  course: { icon: BookOpen, color: 'from-cyan-500 to-cyan-600', label: 'دوره' },
  message: { icon: MessageSquare, color: 'from-indigo-500 to-indigo-600', label: 'پیام' },
  default: { icon: Bell, color: 'from-gray-500 to-gray-600', label: 'اعلان' },
}

const priorityConfig: Record<string, { color: string; label: string }> = {
  urgent: { color: 'bg-red-100 text-red-700 border-red-200', label: 'فوری' },
  high: { color: 'bg-orange-100 text-orange-700 border-orange-200', label: 'مهم' },
  normal: { color: 'bg-blue-100 text-blue-700 border-blue-200', label: 'عادی' },
  low: { color: 'bg-gray-100 text-gray-700 border-gray-200', label: 'کم' },
}

export default function ClubMemberNotifications() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [page, setPage] = useState(1)

  const { data: stats } = useQuery({
    queryKey: ['notifications-stats'],
    queryFn: async () => {
      try {
        const res = await api.get('/notifications/stats')
        return res.data.data
      } catch { return { total: 0, unread: 0, read: 0, priorityDistribution: {} } }
    },
  })

  const { data: notificationsData, isLoading } = useQuery({
    queryKey: ['notifications', page, activeTab, typeFilter, searchQuery],
    queryFn: async () => {
      const params = new URLSearchParams({ page: page.toString(), limit: '10' })
      if (typeFilter !== 'all') params.append('type', typeFilter)
      if (activeTab === 'unread') params.append('isRead', 'false')
      if (activeTab === 'read') params.append('isRead', 'true')
      if (searchQuery) params.append('search', searchQuery)
      try {
        const res = await api.get(`/api/notifications?${params}`)
        return res.data.data
      } catch { return { notifications: [], pagination: { page: 1, totalPages: 1 } } }
    },
  })

  const markAsRead = useMutation({
    mutationFn: (id: string) => api.patch(`/api/notifications/${id}/read`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
      queryClient.invalidateQueries({ queryKey: ['notifications-stats'] })
    },
  })

  const markAllAsRead = useMutation({
    mutationFn: () => api.patch('/notifications/mark-all-read'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
      queryClient.invalidateQueries({ queryKey: ['notifications-stats'] })
      toast.success('همه اعلان‌ها خوانده شدند')
    },
  })

  const deleteNotif = useMutation({
    mutationFn: (id: string) => api.delete(`/api/notifications/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
      queryClient.invalidateQueries({ queryKey: ['notifications-stats'] })
    },
  })

  const formatTime = (date: string) => {
    const diff = Date.now() - new Date(date).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 1) return 'همین الان'
    if (mins < 60) return `${mins} دقیقه پیش`
    const hours = Math.floor(mins / 60)
    if (hours < 24) return `${hours} ساعت پیش`
    const days = Math.floor(hours / 24)
    if (days < 7) return `${days} روز پیش`
    return new Date(date).toLocaleDateString('fa-IR')
  }

  const notifications = notificationsData?.notifications || []
  const pagination = notificationsData?.pagination

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50/30 to-pink-50/30 p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl p-8 text-white"
        style={{ background: `linear-gradient(135deg, ${AACO.primary}, ${AACO.secondary}, ${AACO.accent})` }}
      >
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        </div>
        <div className="relative z-10 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-white/20 backdrop-blur-sm rounded-2xl">
              <Bell className="h-10 w-10" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">اعلان‌ها</h1>
              <p className="text-white/80 mt-1">مدیریت و پیگیری اعلان‌های شما</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button onClick={() => navigate('/notifications/analytics')} className="bg-white/20 hover:bg-white/30 border-0">
              <BarChart3 className="ml-2 h-5 w-5" />آمار
            </Button>
            <Button onClick={() => navigate('/notifications/settings')} className="bg-white/20 hover:bg-white/30 border-0">
              <Settings className="ml-2 h-5 w-5" />تنظیمات
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'کل', value: stats?.total || 0, icon: Bell, color: AACO.primary },
          { label: 'خوانده نشده', value: stats?.unread || 0, icon: BellOff, color: AACO.accent },
          { label: 'خوانده شده', value: stats?.read || 0, icon: Eye, color: '#10b981' },
          { label: 'فوری', value: (stats?.priorityDistribution?.urgent || 0) + (stats?.priorityDistribution?.high || 0), icon: Zap, color: '#ef4444' },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <Card className="border-0 shadow-lg">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-3 rounded-xl" style={{ backgroundColor: `${s.color}15` }}>
                  <s.icon className="h-5 w-5" style={{ color: s.color }} />
                </div>
                <div>
                  <p className="text-sm text-gray-600">{s.label}</p>
                  <p className="text-2xl font-bold" style={{ color: s.color }}>{s.value}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <Card className="border-0 shadow-lg">
        <CardContent className="p-4 space-y-4">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3 w-full max-w-md">
              <TabsTrigger value="all">همه</TabsTrigger>
              <TabsTrigger value="unread">خوانده نشده</TabsTrigger>
              <TabsTrigger value="read">خوانده شده</TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="flex flex-col md:flex-row gap-3 items-start md:items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input placeholder="جستجو..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pr-10" />
            </div>
            <div className="flex gap-2 flex-wrap">
              <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="px-3 py-2 border rounded-lg text-sm">
                <option value="all">همه انواع</option>
                <option value="achievement">دستاوردها</option>
                <option value="project">پروژه‌ها</option>
                <option value="team">تیم</option>
                <option value="event">رویدادها</option>
                <option value="course">دوره‌ها</option>
              </select>
              {(stats?.unread || 0) > 0 && (
                <Button variant="outline" size="sm" onClick={() => markAllAsRead.mutate()}>
                  <CheckCircle2 className="h-4 w-4 ml-1" />علامت همه
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* List */}
      {isLoading ? (
        <div className="space-y-4">{[1,2,3,4,5].map(i => <div key={i} className="animate-pulse h-24 bg-white rounded-xl shadow" />)}</div>
      ) : notifications.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-4">
            <Inbox className="h-10 w-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">اعلانی یافت نشد</h3>
        </motion.div>
      ) : (
        <AnimatePresence mode="popLayout">
          <div className="space-y-3">
            {notifications.map((n: Notification, idx: number) => {
              const cfg = typeConfig[n.type] || typeConfig.default
              const Icon = cfg.icon
              const pri = priorityConfig[n.priority]
              return (
                <motion.div key={n._id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ delay: idx * 0.05 }} layout>
                  <Card
                    className={`border-0 shadow-md hover:shadow-lg transition-all cursor-pointer group ${!n.isRead ? 'bg-gradient-to-l from-purple-50/50 to-white ring-1 ring-purple-200' : 'bg-white'}`}
                    onClick={() => { if (!n.isRead) markAsRead.mutate(n._id); if (n.link) navigate(n.link) }}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <div className={`flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br ${cfg.color} flex items-center justify-center`}>
                          <Icon className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <h3 className={`font-bold ${!n.isRead ? 'text-gray-900' : 'text-gray-600'}`}>{n.title}</h3>
                              <div className="flex items-center gap-2 mt-1 flex-wrap">
                                {!n.isRead && <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-[10px]">جدید</Badge>}
                                <Badge variant="outline" className="text-[10px]">{cfg.label}</Badge>
                                {pri && n.priority !== 'low' && <Badge variant="outline" className={`${pri.color} text-[10px]`}>{pri.label}</Badge>}
                                <span className="text-[10px] text-gray-500 flex items-center gap-1"><Clock className="h-3 w-3" />{formatTime(n.createdAt)}</span>
                              </div>
                            </div>
                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              {!n.isRead && (
                                <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); markAsRead.mutate(n._id) }} className="h-8 w-8 p-0">
                                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                                </Button>
                              )}
                              <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); deleteNotif.mutate(n._id) }} className="h-8 w-8 p-0">
                                <Trash2 className="h-4 w-4 text-red-600" />
                              </Button>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 mt-2 line-clamp-2">{n.message}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </AnimatePresence>
      )}

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <Card className="border-0 shadow-lg">
          <CardContent className="p-4 flex items-center justify-between">
            <span className="text-sm text-gray-600">صفحه {pagination.page} از {pagination.totalPages}</span>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>
                <ChevronRight className="h-4 w-4" />قبلی
              </Button>
              <Button variant="outline" size="sm" onClick={() => setPage(p => p + 1)} disabled={page >= pagination.totalPages}>
                بعدی<ChevronLeft className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export { ClubMemberNotifications }
