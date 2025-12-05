import { useState } from 'react'
import { motion } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  GraduationCap,
  Plus,
  Search,
  Clock,
  Users,
  Eye,
  Edit,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Video,
  CheckCircle2,
  PlayCircle,
  RefreshCw
} from 'lucide-react'
import { PageSkeleton } from '@/components/ui/page-skeleton'
import api from '@/lib/api'

interface Training {
  _id: string
  title: string
  description: string
  category: string
  instructor: string
  duration: number
  level: 'beginner' | 'intermediate' | 'advanced'
  isOnline: boolean
  capacity?: number
  enrolledCount?: number
  status: 'draft' | 'published' | 'archived'
  startDate?: string
  createdAt: string
}

export default function Trainings() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [levelFilter, setLevelFilter] = useState('all')
  const [page, setPage] = useState(1)

  const { data, isLoading, refetch, isFetching } = useQuery({
    queryKey: ['admin-trainings', page, statusFilter, levelFilter, search],
    queryFn: async () => {
      const params = new URLSearchParams()
      params.append('page', page.toString())
      params.append('limit', '12')
      if (statusFilter !== 'all') params.append('status', statusFilter)
      if (levelFilter !== 'all') params.append('level', levelFilter)
      if (search) params.append('search', search)

      const response = await api.get(`/trainings?${params.toString()}`)
      return response.data
    },
  })

  // Handle different API response structures - ensure trainings is always an array
  const rawTrainings = data?.data?.trainings || data?.trainings || (Array.isArray(data?.data) ? data?.data : [])
  const trainings: Training[] = Array.isArray(rawTrainings) ? rawTrainings : []
  const pagination = data?.data?.pagination || data?.pagination || { page: 1, pages: 1, total: 0 }

  const stats = {
    total: pagination.total || trainings.length,
    published: Array.isArray(trainings) ? trainings.filter(t => t.status === 'published').length : 0,
    draft: Array.isArray(trainings) ? trainings.filter(t => t.status === 'draft').length : 0,
    totalEnrolled: Array.isArray(trainings) ? trainings.reduce((sum, t) => sum + (t.enrolledCount || 0), 0) : 0,
  }

  const getStatusBadge = (status: string) => {
    const config: Record<string, { label: string; className: string }> = {
      draft: { label: 'پیش‌نویس', className: 'bg-yellow-100 text-yellow-800' },
      published: { label: 'منتشر شده', className: 'bg-green-100 text-green-800' },
      archived: { label: 'آرشیو شده', className: 'bg-gray-100 text-gray-800' },
    }
    const c = config[status] || config.draft
    return <Badge className={c.className}>{c.label}</Badge>
  }

  const getLevelBadge = (level: string) => {
    const config: Record<string, { label: string; className: string }> = {
      beginner: { label: 'مقدماتی', className: 'bg-blue-100 text-blue-800' },
      intermediate: { label: 'متوسط', className: 'bg-purple-100 text-purple-800' },
      advanced: { label: 'پیشرفته', className: 'bg-red-100 text-red-800' },
    }
    const c = config[level] || config.beginner
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
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 p-8 text-white shadow-2xl"
      >
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
        </div>

        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
                <GraduationCap className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-4xl font-bold">مدیریت دوره‌های آموزشی</h1>
                <p className="text-white/90 text-lg mt-1">ایجاد و مدیریت دوره‌های آموزشی</p>
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
                onClick={() => navigate('/admin/trainings/create')}
                className="bg-white text-teal-600 hover:bg-white/90 shadow-lg"
              >
                <Plus className="ml-2 h-5 w-5" />
                دوره جدید
              </Button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'کل دوره‌ها', value: stats.total, icon: GraduationCap, gradient: 'from-teal-50 to-cyan-50', color: 'text-teal-600', delay: 0 },
          { label: 'منتشر شده', value: stats.published, icon: CheckCircle2, gradient: 'from-green-50 to-emerald-50', color: 'text-green-600', delay: 0.1 },
          { label: 'پیش‌نویس', value: stats.draft, icon: BookOpen, gradient: 'from-yellow-50 to-amber-50', color: 'text-yellow-600', delay: 0.2 },
          { label: 'کل ثبت‌نام‌ها', value: stats.totalEnrolled, icon: Users, gradient: 'from-purple-50 to-pink-50', color: 'text-purple-600', delay: 0.3 }
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
                  placeholder="جستجو در دوره‌ها..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pr-10"
                />
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              {[
                { value: 'all', label: 'همه وضعیت‌ها' },
                { value: 'published', label: 'منتشر شده' },
                { value: 'draft', label: 'پیش‌نویس' },
                { value: 'archived', label: 'آرشیو' }
              ].map((option) => (
                <Button
                  key={option.value}
                  variant={statusFilter === option.value ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setStatusFilter(option.value)}
                  className={statusFilter === option.value ? 'bg-gradient-to-r from-teal-600 to-cyan-600' : ''}
                >
                  {option.label}
                </Button>
              ))}
            </div>
            <div className="flex gap-2 flex-wrap">
              {[
                { value: 'all', label: 'همه سطوح' },
                { value: 'beginner', label: 'مقدماتی' },
                { value: 'intermediate', label: 'متوسط' },
                { value: 'advanced', label: 'پیشرفته' }
              ].map((option) => (
                <Button
                  key={option.value}
                  variant={levelFilter === option.value ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setLevelFilter(option.value)}
                  className={levelFilter === option.value ? 'bg-gradient-to-r from-purple-600 to-pink-600' : ''}
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>


      {/* Trainings Grid */}
      {trainings.length === 0 ? (
        <Card className="border-0 shadow-lg">
          <CardContent className="p-12 text-center">
            <GraduationCap className="h-16 w-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">دوره‌ای یافت نشد</h3>
            <p className="text-gray-500 mb-4">
              {search || statusFilter !== 'all' ? 'با فیلترهای انتخاب شده دوره‌ای وجود ندارد' : 'هنوز دوره‌ای ایجاد نشده است'}
            </p>
            <Button onClick={() => navigate('/admin/trainings/create')}>
              <Plus className="ml-2 h-4 w-4" />
              ایجاد دوره جدید
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trainings.map((training, index) => (
            <motion.div
              key={training._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="border-0 shadow-lg hover:shadow-xl transition-all h-full flex flex-col">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <CardTitle className="text-lg line-clamp-1">{training.title}</CardTitle>
                      <div className="flex gap-2 mt-2">
                        {getStatusBadge(training.status)}
                        {getLevelBadge(training.level)}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <p className="text-sm text-gray-600 line-clamp-2 mb-4">{training.description}</p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Users className="h-4 w-4" />
                      <span>مدرس: {training.instructor}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="h-4 w-4" />
                      <span>{training.duration} ساعت</span>
                    </div>
                    
                    {training.isOnline ? (
                      <div className="flex items-center gap-2 text-sm text-blue-600">
                        <Video className="h-4 w-4" />
                        <span>آنلاین</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-sm text-green-600">
                        <PlayCircle className="h-4 w-4" />
                        <span>حضوری</span>
                      </div>
                    )}
                    
                    {training.capacity && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Users className="h-4 w-4" />
                        <span>{training.enrolledCount || 0} / {training.capacity} نفر</span>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 mt-auto">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => navigate(`/admin/trainings/${training._id}`)}
                    >
                      <Eye className="h-4 w-4 ml-1" />
                      مشاهده
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => navigate(`/admin/trainings/${training._id}/edit`)}
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
