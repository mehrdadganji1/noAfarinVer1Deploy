import { useState } from 'react'
import { motion } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Calendar,
  Plus,
  Search,
  MapPin,
  Users,
  Clock,
  Eye,
  Edit,
  ChevronLeft,
  ChevronRight,
  Video,
  CheckCircle2,
  XCircle,
  RefreshCw
} from 'lucide-react'
import { PageSkeleton } from '@/components/ui/page-skeleton'
import api from '@/lib/api'

interface Event {
  _id: string
  title: string
  description: string
  type: string
  startDate: string
  endDate?: string
  location?: string
  isOnline: boolean
  meetingLink?: string
  capacity?: number
  registeredTeams?: string[]
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled'
  createdAt: string
}

export default function Events() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [page, setPage] = useState(1)

  const { data, isLoading, refetch, isFetching } = useQuery({
    queryKey: ['admin-events', page, statusFilter, typeFilter, search],
    queryFn: async () => {
      const params = new URLSearchParams()
      params.append('page', page.toString())
      params.append('limit', '12')
      if (statusFilter !== 'all') params.append('status', statusFilter)
      if (typeFilter !== 'all') params.append('type', typeFilter)
      if (search) params.append('search', search)

      const response = await api.get(`/events?${params.toString()}`)
      return response.data
    },
  })

  // Handle different API response structures - ensure events is always an array
  const rawEvents = data?.data?.events || data?.events || (Array.isArray(data?.data) ? data?.data : [])
  const events: Event[] = Array.isArray(rawEvents) ? rawEvents : []
  const pagination = data?.data?.pagination || data?.pagination || { page: 1, pages: 1, total: 0 }

  const stats = {
    total: pagination.total || events.length,
    upcoming: events.filter(e => e.status === 'upcoming').length,
    ongoing: events.filter(e => e.status === 'ongoing').length,
    completed: events.filter(e => e.status === 'completed').length,
  }

  const getStatusBadge = (status: string) => {
    const config: Record<string, { label: string; className: string }> = {
      upcoming: { label: 'آینده', className: 'bg-blue-100 text-blue-800' },
      ongoing: { label: 'در حال برگزاری', className: 'bg-green-100 text-green-800' },
      completed: { label: 'برگزار شده', className: 'bg-gray-100 text-gray-800' },
      cancelled: { label: 'لغو شده', className: 'bg-red-100 text-red-800' },
    }
    const c = config[status] || config.upcoming
    return <Badge className={c.className}>{c.label}</Badge>
  }

  const getTypeBadge = (type: string) => {
    const config: Record<string, { label: string; className: string }> = {
      aaco: { label: 'AACO', className: 'bg-purple-100 text-purple-800' },
      workshop: { label: 'کارگاه', className: 'bg-indigo-100 text-indigo-800' },
      industrial_visit: { label: 'بازدید صنعتی', className: 'bg-orange-100 text-orange-800' },
      training: { label: 'آموزشی', className: 'bg-cyan-100 text-cyan-800' },
      pitch_session: { label: 'پیچینگ', className: 'bg-pink-100 text-pink-800' },
      closing_ceremony: { label: 'اختتامیه', className: 'bg-yellow-100 text-yellow-800' },
    }
    const c = config[type] || { label: type, className: 'bg-gray-100 text-gray-800' }
    return <Badge className={c.className}>{c.label}</Badge>
  }

  if (isLoading && !data) {
    return <PageSkeleton showHeader showStats statsCount={4} showFilters itemsCount={6} />
  }


  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 p-8 text-white shadow-2xl"
      >
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
        </div>

        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
                <Calendar className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-4xl font-bold">مدیریت رویدادها</h1>
                <p className="text-white/90 text-lg mt-1">ایجاد و مدیریت رویدادها و کارگاه‌ها</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => refetch()}
                disabled={isFetching}
                className="bg-white/20 hover:bg-white/30 text-white border-0"
              >
                <RefreshCw className={`h-4 w-4 ml-2 ${isFetching ? 'animate-spin' : ''}`} />
                بروزرسانی
              </Button>
              <Button
                onClick={() => navigate('/admin/events/create')}
                className="bg-white text-indigo-600 hover:bg-white/90 shadow-lg"
              >
                <Plus className="ml-2 h-5 w-5" />
                رویداد جدید
              </Button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'کل رویدادها', value: stats.total, icon: Calendar, gradient: 'from-blue-50 to-cyan-50', color: 'text-blue-600', delay: 0 },
          { label: 'آینده', value: stats.upcoming, icon: Clock, gradient: 'from-indigo-50 to-purple-50', color: 'text-indigo-600', delay: 0.1 },
          { label: 'در حال برگزاری', value: stats.ongoing, icon: CheckCircle2, gradient: 'from-green-50 to-emerald-50', color: 'text-green-600', delay: 0.2 },
          { label: 'برگزار شده', value: stats.completed, icon: XCircle, gradient: 'from-gray-50 to-slate-50', color: 'text-gray-600', delay: 0.3 }
        ].map((stat) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: stat.delay }}
            whileHover={{ scale: 1.05, y: -5 }}
          >
            <Card className={`border-0 shadow-lg hover:shadow-xl transition-all bg-gradient-to-br ${stat.gradient}`}>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-white/80 backdrop-blur-sm rounded-xl shadow-md">
                    <stat.icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <Card className="border-0 shadow-lg">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="جستجو در رویدادها..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pr-10"
                />
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              {[
                { value: 'all', label: 'همه وضعیت‌ها' },
                { value: 'upcoming', label: 'آینده' },
                { value: 'ongoing', label: 'در حال برگزاری' },
                { value: 'completed', label: 'برگزار شده' }
              ].map((option) => (
                <Button
                  key={option.value}
                  variant={statusFilter === option.value ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setStatusFilter(option.value)}
                  className={statusFilter === option.value ? 'bg-gradient-to-r from-blue-600 to-indigo-600' : ''}
                >
                  {option.label}
                </Button>
              ))}
            </div>
            <div className="flex gap-2 flex-wrap">
              {[
                { value: 'all', label: 'همه انواع' },
                { value: 'aaco', label: 'AACO' },
                { value: 'workshop', label: 'کارگاه' },
                { value: 'industrial_visit', label: 'بازدید صنعتی' },
                { value: 'training', label: 'آموزشی' },
                { value: 'pitch_session', label: 'پیچینگ' }
              ].map((option) => (
                <Button
                  key={option.value}
                  variant={typeFilter === option.value ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setTypeFilter(option.value)}
                  className={typeFilter === option.value ? 'bg-gradient-to-r from-purple-600 to-pink-600' : ''}
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>


      {/* Events Grid */}
      {events.length === 0 ? (
        <Card className="border-0 shadow-lg">
          <CardContent className="p-12 text-center">
            <Calendar className="h-16 w-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">رویدادی یافت نشد</h3>
            <p className="text-gray-500 mb-4">
              {search || statusFilter !== 'all' ? 'با فیلترهای انتخاب شده رویدادی وجود ندارد' : 'هنوز رویدادی ایجاد نشده است'}
            </p>
            <Button onClick={() => navigate('/admin/events/create')}>
              <Plus className="ml-2 h-4 w-4" />
              ایجاد رویداد جدید
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event, index) => (
            <motion.div
              key={event._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="border-0 shadow-lg hover:shadow-xl transition-all h-full flex flex-col">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <CardTitle className="text-lg line-clamp-1">{event.title}</CardTitle>
                      <div className="flex gap-2 mt-2">
                        {getStatusBadge(event.status)}
                        {getTypeBadge(event.type)}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <p className="text-sm text-gray-600 line-clamp-2 mb-4">{event.description}</p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="h-4 w-4" />
                      <span>{new Date(event.startDate).toLocaleDateString('fa-IR')}</span>
                    </div>
                    
                    {event.isOnline ? (
                      <div className="flex items-center gap-2 text-sm text-blue-600">
                        <Video className="h-4 w-4" />
                        <span>آنلاین</span>
                      </div>
                    ) : event.location && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="h-4 w-4" />
                        <span className="line-clamp-1">{event.location}</span>
                      </div>
                    )}
                    
                    {event.capacity && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Users className="h-4 w-4" />
                        <span>{event.registeredTeams?.length || 0} / {event.capacity} نفر</span>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 mt-auto">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => navigate(`/admin/events/${event._id}`)}
                    >
                      <Eye className="h-4 w-4 ml-1" />
                      مشاهده
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => navigate(`/admin/events/${event._id}/edit`)}
                    >
                      <Edit className="h-4 w-4 ml-1" />
                      ویرایش
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination.pages > 1 && (
        <Card className="border-0 shadow-lg">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                <ChevronRight className="h-4 w-4 ml-1" />
                قبلی
              </Button>
              <span className="text-sm text-gray-600">
                صفحه {page} از {pagination.pages}
              </span>
              <Button
                variant="outline"
                onClick={() => setPage(p => Math.min(pagination.pages, p + 1))}
                disabled={page >= pagination.pages}
              >
                بعدی
                <ChevronLeft className="h-4 w-4 mr-1" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
