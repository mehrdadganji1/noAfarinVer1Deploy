import { useState, useEffect, useRef } from 'react'
import { useInfiniteQuery, useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Calendar, Plus, Search, Download, Users, MapPin, 
  Edit, Trash2, Eye, MoreVertical
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { PageSkeleton } from '@/components/ui/page-skeleton'
import api from '@/lib/api'

type EventStatus = 'upcoming' | 'ongoing' | 'completed' | 'cancelled'
type EventType = 'workshop' | 'seminar' | 'competition' | 'social' | 'training'

interface Event {
  _id: string
  title: string
  description: string
  type: EventType
  status: EventStatus
  date: string
  endDate?: string
  location: string
  capacity: number
  registered: number
  attendees: string[]
  organizers: string[]
  image?: string
  tags?: string[]
  createdAt: string
}

export default function DirectorEvents() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const observerTarget = useRef<HTMLDivElement>(null)
  
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState<EventType | 'ALL'>('ALL')
  const [statusFilter, setStatusFilter] = useState<EventStatus | 'ALL'>('ALL')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 500)
    return () => clearTimeout(timer)
  }, [searchQuery])

  // Fetch stats
  const { data: stats } = useQuery({
    queryKey: ['events-stats'],
    queryFn: async () => {
      const response = await api.get('/events/stats')
      return response.data.data
    },
  })

  // Fetch events with infinite scroll
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ['director-events', typeFilter, statusFilter, debouncedSearch],
    queryFn: async ({ pageParam = 1 }) => {
      const params = new URLSearchParams({
        page: pageParam.toString(),
        limit: '20',
      })
      
      if (typeFilter !== 'ALL') params.append('type', typeFilter)
      if (statusFilter !== 'ALL') params.append('status', statusFilter)
      if (debouncedSearch) params.append('search', debouncedSearch)
      
      const response = await api.get(`/events?${params.toString()}`)
      return {
        events: response.data.data.events || [],
        pagination: response.data.data
      }
    },
    getNextPageParam: (lastPage) => {
      if (lastPage.pagination.page < lastPage.pagination.totalPages) {
        return lastPage.pagination.page + 1
      }
      return undefined
    },
    initialPageParam: 1,
  })

  const allEvents = data?.pages.flatMap(page => page.events) || []

  // Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage()
        }
      },
      { threshold: 0.1 }
    )

    const currentTarget = observerTarget.current
    if (currentTarget) observer.observe(currentTarget)
    return () => { if (currentTarget) observer.unobserve(currentTarget) }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage])

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (eventId: string) => {
      await api.delete(`/events/${eventId}`)
    },
    onSuccess: () => {
      console.log('رویداد با موفقیت حذف شد')
      queryClient.invalidateQueries({ queryKey: ['director-events'] })
      queryClient.invalidateQueries({ queryKey: ['events-stats'] })
    },
  })

  if (isLoading) {
    return <PageSkeleton showHeader showStats statsCount={4} showFilters itemsCount={10} />
  }

  return (
    <div className="h-[calc(100vh-4rem)] w-full max-w-full overflow-x-hidden overflow-y-auto p-3 flex flex-col gap-2" dir="rtl">
      {/* Compact Header with Stats */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 p-3 text-white shadow-lg flex-shrink-0"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 backdrop-blur-sm rounded-xl">
              <Calendar className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">مدیریت رویدادها</h1>
              <p className="text-white/80 text-sm">مدیریت و نظارت بر رویدادها</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-xl">
              <p className="text-2xl font-bold">{stats?.total || 0}</p>
              <p className="text-xs opacity-80">کل رویدادها</p>
            </div>
            <div className="text-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-xl">
              <p className="text-2xl font-bold text-blue-300">{stats?.upcoming || 0}</p>
              <p className="text-xs opacity-80">آینده</p>
            </div>
            <div className="text-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-xl">
              <p className="text-2xl font-bold text-green-300">{stats?.ongoing || 0}</p>
              <p className="text-xs opacity-80">در حال برگزاری</p>
            </div>
            <Button 
              onClick={() => navigate('/director/events/new')}
              className="bg-white text-blue-600 hover:bg-white/90"
              size="sm"
            >
              <Plus className="h-4 w-4 ml-2" />
              رویداد جدید
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Filters Bar - Compact */}
      <Card className="border-0 shadow flex-shrink-0">
        <CardContent className="p-2">
          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="جستجو رویدادها..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pr-10 pl-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as EventType | 'ALL')}
              className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
            >
              <option value="ALL">همه انواع</option>
              <option value="workshop">کارگاه</option>
              <option value="seminar">سمینار</option>
              <option value="competition">مسابقه</option>
              <option value="social">اجتماعی</option>
              <option value="training">آموزشی</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as EventStatus | 'ALL')}
              className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
            >
              <option value="ALL">همه وضعیت‌ها</option>
              <option value="upcoming">آینده</option>
              <option value="ongoing">در حال برگزاری</option>
              <option value="completed">پایان یافته</option>
              <option value="cancelled">لغو شده</option>
            </select>

            <div className="flex gap-1">
              <Button
                onClick={() => setViewMode('grid')}
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
              >
                شبکه‌ای
              </Button>
              <Button
                onClick={() => setViewMode('list')}
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
              >
                لیستی
              </Button>
            </div>

            <Button size="sm" variant="outline">
              <Download className="h-4 w-4 ml-2" />
              خروجی
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Events Grid/List */}
      <Card className="border-0 shadow flex-1 flex flex-col overflow-hidden">
        <CardContent className="flex-1 overflow-hidden p-3">
          <div className="h-full overflow-y-auto">
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {allEvents.map((event: Event, index: number) => (
                  <EventCard
                    key={event._id}
                    event={event}
                    index={index}
                    onEdit={() => navigate(`/director/events/${event._id}/edit`)}
                    onDelete={() => deleteMutation.mutate(event._id)}
                    onView={() => navigate(`/director/events/${event._id}`)}
                  />
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {allEvents.map((event: Event, index: number) => (
                  <EventListItem
                    key={event._id}
                    event={event}
                    index={index}
                    onEdit={() => navigate(`/director/events/${event._id}/edit`)}
                    onDelete={() => deleteMutation.mutate(event._id)}
                    onView={() => navigate(`/director/events/${event._id}`)}
                  />
                ))}
              </div>
            )}

            {allEvents.length === 0 && (
              <div className="text-center py-16">
                <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">رویدادی یافت نشد</h3>
                <p className="text-gray-600">فیلترها را تغییر دهید یا رویداد جدید ایجاد کنید</p>
              </div>
            )}

            {/* Infinite Scroll Trigger */}
            <div ref={observerTarget} className="h-10 flex items-center justify-center">
              {isFetchingNextPage && (
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-purple-600" />
                  <span>در حال بارگذاری...</span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function EventCard({ event, index, onEdit, onDelete, onView }: any) {
  const [showActions, setShowActions] = useState(false)

  const getStatusColor = (status: EventStatus) => {
    const colors = {
      upcoming: 'bg-blue-100 text-blue-800',
      ongoing: 'bg-green-100 text-green-800',
      completed: 'bg-gray-100 text-gray-800',
      cancelled: 'bg-red-100 text-red-800',
    }
    return colors[status]
  }

  const getTypeColor = (type: EventType) => {
    const colors = {
      workshop: 'bg-blue-100 text-blue-800',
      seminar: 'bg-purple-100 text-purple-800',
      competition: 'bg-red-100 text-red-800',
      social: 'bg-green-100 text-green-800',
      training: 'bg-yellow-100 text-yellow-800',
    }
    return colors[type]
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.02 }}
      whileHover={{ y: -2 }}
      className="relative"
    >
      <Card className="overflow-hidden hover:shadow-lg transition-all h-full">
        <CardContent className="p-0">
          <div className="h-32 bg-gradient-to-br from-blue-500 to-purple-600 relative">
            <div className="absolute top-2 right-2 flex gap-1">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(event.status)}`}>
                {event.status === 'upcoming' ? 'آینده' : 
                 event.status === 'ongoing' ? 'در حال برگزاری' :
                 event.status === 'completed' ? 'پایان یافته' : 'لغو شده'}
              </span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(event.type)}`}>
                {event.type === 'workshop' ? 'کارگاه' :
                 event.type === 'seminar' ? 'سمینار' :
                 event.type === 'competition' ? 'مسابقه' :
                 event.type === 'social' ? 'اجتماعی' : 'آموزشی'}
              </span>
            </div>
            <div className="absolute top-2 left-2">
              <button
                onClick={() => setShowActions(!showActions)}
                className="p-1.5 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors"
              >
                <MoreVertical className="h-4 w-4 text-white" />
              </button>
              {showActions && (
                <div className="absolute left-0 top-10 bg-white rounded-lg shadow-lg py-1 w-32 z-10">
                  <button onClick={onView} className="w-full px-3 py-1.5 text-right hover:bg-gray-100 flex items-center gap-2 text-sm">
                    <Eye className="h-3 w-3" />
                    مشاهده
                  </button>
                  <button onClick={onEdit} className="w-full px-3 py-1.5 text-right hover:bg-gray-100 flex items-center gap-2 text-sm">
                    <Edit className="h-3 w-3" />
                    ویرایش
                  </button>
                  <button onClick={onDelete} className="w-full px-3 py-1.5 text-right hover:bg-gray-100 flex items-center gap-2 text-red-600 text-sm">
                    <Trash2 className="h-3 w-3" />
                    حذف
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="p-3">
            <h3 className="text-base font-bold text-gray-900 mb-1 line-clamp-1">{event.title}</h3>
            <p className="text-gray-600 text-xs mb-3 line-clamp-2">{event.description}</p>

            <div className="space-y-1.5 mb-3">
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <Calendar className="h-3 w-3" />
                {new Date(event.date).toLocaleDateString('fa-IR')}
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <MapPin className="h-3 w-3" />
                {event.location}
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <Users className="h-3 w-3" />
                {event.registered} / {event.capacity} نفر
              </div>
            </div>

            <div className="mb-3">
              <div className="flex justify-between text-xs text-gray-600 mb-1">
                <span>ظرفیت</span>
                <span>{Math.round((event.registered / event.capacity) * 100)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div
                  className="bg-gradient-to-r from-blue-500 to-purple-600 h-1.5 rounded-full transition-all"
                  style={{ width: `${Math.min((event.registered / event.capacity) * 100, 100)}%` }}
                />
              </div>
            </div>

            <Button onClick={onView} className="w-full" variant="outline" size="sm">
              مشاهده جزئیات
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

function EventListItem({ event, index, onEdit, onDelete, onView }: any) {
  const getStatusColor = (status: EventStatus) => {
    const colors = {
      upcoming: 'bg-blue-100 text-blue-800',
      ongoing: 'bg-green-100 text-green-800',
      completed: 'bg-gray-100 text-gray-800',
      cancelled: 'bg-red-100 text-red-800',
    }
    return colors[status]
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.02 }}
    >
      <Card className="hover:shadow-md transition-all">
        <CardContent className="p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                {new Date(event.date).getDate()}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-sm font-bold text-gray-900">{event.title}</h3>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(event.status)}`}>
                    {event.status === 'upcoming' ? 'آینده' : 
                     event.status === 'ongoing' ? 'در حال برگزاری' :
                     event.status === 'completed' ? 'پایان یافته' : 'لغو شده'}
                  </span>
                </div>
                <p className="text-xs text-gray-600 mb-1 line-clamp-1">{event.description}</p>
                <div className="flex items-center gap-3 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {event.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {event.registered}/{event.capacity}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <Button onClick={onView} size="sm" variant="outline">
                <Eye className="h-3 w-3 ml-1" />
                مشاهده
              </Button>
              <Button onClick={onEdit} size="sm" variant="outline">
                <Edit className="h-3 w-3" />
              </Button>
              <Button onClick={onDelete} size="sm" variant="outline" className="text-red-600 hover:bg-red-50">
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
