import { useState } from 'react'
import { motion } from 'framer-motion'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Bell, ChevronLeft, ChevronRight, Inbox, Settings, Activity, BellOff, Check, AlertTriangle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import api from '@/lib/api'
import { toast } from '@/components/ui/toast'
import { PageSkeleton } from '@/components/ui/page-skeleton'

// Components
import NotificationFilters from '@/components/notifications/NotificationFilters'
import NotificationCard from '@/components/notifications/NotificationCard'
import NotificationSearch from '@/components/notifications/NotificationSearch'

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

export default function Notifications() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  // Filter states
  const [typeFilter, setTypeFilter] = useState('all')
  const [readFilter, setReadFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [page, setPage] = useState(1)
  const [limit] = useState(10)

  // Fetch notifications stats
  const { data: stats } = useQuery({
    queryKey: ['notifications-stats'],
    queryFn: async () => {
      const response = await api.get('/notifications/stats')
      return response.data.data
    },
  })

  // Fetch notifications with filters
  const { data: notificationsData, isLoading: notificationsLoading } = useQuery({
    queryKey: ['notifications', page, limit, typeFilter, readFilter, searchQuery],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      })

      if (typeFilter !== 'all') params.append('type', typeFilter)
      if (readFilter !== 'all') params.append('isRead', readFilter === 'read' ? 'true' : 'false')
      if (searchQuery) params.append('search', searchQuery)

      const response = await api.get(`/notifications?${params.toString()}`)
      return response.data.data
    },
  })

  // Mark as read mutation
  const markAsReadMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await api.patch(`/notifications/${id}/read`)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
      queryClient.invalidateQueries({ queryKey: ['notifications-stats'] })
      toast.success('اعلان به عنوان خوانده شده علامت‌گذاری شد')
    },
    onError: () => {
      toast.error('خطا در علامت‌گذاری اعلان')
    },
  })

  // Mark all as read mutation
  const markAllAsReadMutation = useMutation({
    mutationFn: async () => {
      const response = await api.patch('/notifications/mark-all-read')
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
      queryClient.invalidateQueries({ queryKey: ['notifications-stats'] })
      toast.success('همه اعلان‌ها به عنوان خوانده شده علامت‌گذاری شدند')
    },
    onError: () => {
      toast.error('خطا در علامت‌گذاری اعلان‌ها')
    },
  })

  // Delete notification mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete(`/notifications/${id}`)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
      queryClient.invalidateQueries({ queryKey: ['notifications-stats'] })
      toast.success('اعلان حذف شد')
    },
    onError: () => {
      toast.error('خطا در حذف اعلان')
    },
  })

  // Delete all read mutation
  const deleteAllReadMutation = useMutation({
    mutationFn: async () => {
      const response = await api.delete('/notifications/read/all')
      return response.data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
      queryClient.invalidateQueries({ queryKey: ['notifications-stats'] })
      toast.success(data.message || 'اعلان‌های خوانده شده حذف شدند')
    },
    onError: () => {
      toast.error('خطا در حذف اعلان‌ها')
    },
  })

  // Handlers
  const handleNotificationClick = (notification: Notification) => {
    // Mark as read if not already
    if (!notification.isRead) {
      markAsReadMutation.mutate(notification._id)
    }

    // Navigate to link if available
    if (notification.link) {
      navigate(notification.link)
    }
  }

  const handleMarkAllAsRead = () => {
    if (confirm('آیا می‌خواهید همه اعلان‌ها را به عنوان خوانده شده علامت‌گذاری کنید؟')) {
      markAllAsReadMutation.mutate()
    }
  }

  const handleDeleteAllRead = () => {
    if (confirm('آیا از حذف همه اعلان‌های خوانده شده اطمینان دارید؟')) {
      deleteAllReadMutation.mutate()
    }
  }

  const handleDelete = (id: string) => {
    if (confirm('آیا از حذف این اعلان اطمینان دارید؟')) {
      deleteMutation.mutate(id)
    }
  }

  const urgentCount = stats?.priorityDistribution?.urgent || 0
  const highCount = stats?.priorityDistribution?.high || 0

  // Show skeleton while loading
  if (notificationsLoading && !notificationsData) {
    return <PageSkeleton showHeader showStats statsCount={4} showFilters itemsCount={8} />
  }

  return (
    <>
      <div className="space-y-6 pb-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 p-8 text-white shadow-2xl"
        >
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
          </div>
          
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
                  <Bell className="h-8 w-8" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold">اعلان‌ها</h1>
                  <p className="text-white/90 text-lg mt-1">مدیریت و مشاهده اعلان‌های شما</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => navigate('/admin/notifications/analytics')}
                  variant="outline"
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                >
                  <Activity className="ml-2 h-5 w-5" />
                  آمار
                </Button>
                <Button
                  onClick={() => navigate('/admin/notifications/settings')}
                  variant="outline"
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                >
                  <Settings className="ml-2 h-5 w-5" />
                  تنظیمات
                </Button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: 'کل اعلان‌ها', value: stats?.total || 0, icon: Bell, gradient: 'from-blue-50 to-cyan-50', color: 'text-blue-600', delay: 0 },
            { label: 'خوانده نشده', value: stats?.unread || 0, icon: BellOff, gradient: 'from-orange-50 to-amber-50', color: 'text-orange-600', delay: 0.1 },
            { label: 'خوانده شده', value: stats?.read || 0, icon: Check, gradient: 'from-green-50 to-emerald-50', color: 'text-green-600', delay: 0.2 },
            { label: 'اعلان‌های مهم', value: urgentCount + highCount, icon: AlertTriangle, gradient: 'from-red-50 to-rose-50', color: 'text-red-600', delay: 0.3 }
          ].map((stat) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: stat.delay, duration: 0.3 }}
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <Card className={`border-0 shadow-lg hover:shadow-xl transition-all overflow-hidden bg-gradient-to-br ${stat.gradient}`}>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-white/80 backdrop-blur-sm rounded-xl shadow-md">
                      <stat.icon className={`h-5 w-5 ${stat.color}`} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-700">{stat.label}</p>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Search & Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="border-0 shadow-lg">
            <CardContent className="pt-6 space-y-4">
              {/* Search */}
              <NotificationSearch
                onSearch={setSearchQuery}
                placeholder="جستجو در عنوان و متن اعلانات..."
              />
              
              {/* Filters */}
              <NotificationFilters
                typeFilter={typeFilter}
                readFilter={readFilter}
                onTypeChange={setTypeFilter}
                onReadFilterChange={setReadFilter}
                onMarkAllAsRead={handleMarkAllAsRead}
                onDeleteAllRead={handleDeleteAllRead}
                hasUnread={(stats?.unread || 0) > 0}
              />
            </CardContent>
          </Card>
        </motion.div>

        {/* Content */}
        {notificationsLoading ? (
          <div className="grid grid-cols-1 gap-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="animate-pulse h-32 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
        ) : notificationsData?.notifications.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-4">
              <Inbox className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">اعلانی یافت نشد</h3>
            <p className="text-gray-600">
              {readFilter === 'unread'
                ? 'اعلان خوانده نشده‌ای وجود ندارد'
                : 'هیچ اعلانی در این بخش وجود ندارد'}
            </p>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {notificationsData?.notifications.map((notification: Notification, index: number) => (
              <NotificationCard
                key={notification._id}
                notification={notification}
                onMarkAsRead={(id) => markAsReadMutation.mutate(id)}
                onDelete={handleDelete}
                onClick={handleNotificationClick}
                index={index}
              />
            ))}

            {/* Pagination */}
            {notificationsData?.pagination && notificationsData.pagination.totalPages > 1 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <Card className="border-0 shadow-lg">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-600">
                        صفحه {notificationsData.pagination.page} از{' '}
                        {notificationsData.pagination.totalPages}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setPage((p) => Math.max(1, p - 1))}
                          disabled={page === 1}
                        >
                          <ChevronRight className="h-4 w-4" />
                          قبلی
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setPage((p) => p + 1)}
                          disabled={page >= notificationsData.pagination.totalPages}
                        >
                          بعدی
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>
        )}
      </div>
    </>
  )
}
