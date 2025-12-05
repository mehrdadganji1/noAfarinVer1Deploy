import { useState } from 'react'
import { motion } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Users,
  Plus,
  Search,
  Eye,
  Edit,
  ChevronLeft,
  ChevronRight,
  Target,
  Rocket,
  CheckCircle2,
  Clock,
  RefreshCw,
  Award
} from 'lucide-react'
import { PageSkeleton } from '@/components/ui/page-skeleton'
import api from '@/lib/api'

interface Team {
  _id: string
  name: string
  description: string
  phase: string
  status: 'active' | 'inactive' | 'graduated'
  members: any[]
  leader?: any
  project?: string
  techStack?: string[]
  createdAt: string
}

export default function Teams() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [phaseFilter, setPhaseFilter] = useState('all')
  const [page, setPage] = useState(1)

  const { data, isLoading, refetch, isFetching } = useQuery({
    queryKey: ['admin-teams', page, statusFilter, phaseFilter, search],
    queryFn: async () => {
      const params = new URLSearchParams()
      params.append('page', page.toString())
      params.append('limit', '12')
      if (statusFilter !== 'all') params.append('status', statusFilter)
      if (phaseFilter !== 'all') params.append('phase', phaseFilter)
      if (search) params.append('search', search)

      const response = await api.get(`/teams?${params.toString()}`)
      return response.data
    },
  })

  // Handle different API response structures - ensure teams is always an array
  const rawTeams = data?.data?.teams || data?.teams || (Array.isArray(data?.data) ? data?.data : [])
  const teams: Team[] = Array.isArray(rawTeams) ? rawTeams : []
  const pagination = data?.data?.pagination || data?.pagination || { page: 1, pages: 1, total: 0 }

  const stats = {
    total: pagination.total || teams.length,
    active: Array.isArray(teams) ? teams.filter(t => t.status === 'active').length : 0,
    graduated: Array.isArray(teams) ? teams.filter(t => t.status === 'graduated').length : 0,
    totalMembers: Array.isArray(teams) ? teams.reduce((sum, t) => sum + (t.members?.length || 0), 0) : 0,
  }

  const getStatusBadge = (status: string) => {
    const config: Record<string, { label: string; className: string }> = {
      active: { label: 'فعال', className: 'bg-green-100 text-green-800' },
      inactive: { label: 'غیرفعال', className: 'bg-gray-100 text-gray-800' },
      graduated: { label: 'فارغ‌التحصیل', className: 'bg-purple-100 text-purple-800' },
    }
    const c = config[status] || config.active
    return <Badge className={c.className}>{c.label}</Badge>
  }

  const getPhaseBadge = (phase: string) => {
    const config: Record<string, { label: string; className: string }> = {
      ideation: { label: 'ایده‌پردازی', className: 'bg-blue-100 text-blue-800' },
      validation: { label: 'اعتبارسنجی', className: 'bg-yellow-100 text-yellow-800' },
      mvp: { label: 'MVP', className: 'bg-orange-100 text-orange-800' },
      growth: { label: 'رشد', className: 'bg-green-100 text-green-800' },
      scale: { label: 'مقیاس‌پذیری', className: 'bg-purple-100 text-purple-800' },
    }
    const c = config[phase] || { label: phase, className: 'bg-gray-100 text-gray-800' }
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
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-orange-600 via-red-600 to-pink-600 p-8 text-white shadow-2xl"
      >
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
        </div>

        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
                <Users className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-4xl font-bold">مدیریت تیم‌ها</h1>
                <p className="text-white/90 text-lg mt-1">مشاهده و مدیریت تیم‌های استارتاپی</p>
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
                onClick={() => navigate('/admin/teams/create')}
                className="bg-white text-orange-600 hover:bg-white/90 shadow-lg"
              >
                <Plus className="ml-2 h-5 w-5" />
                تیم جدید
              </Button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'کل تیم‌ها', value: stats.total, icon: Users, gradient: 'from-orange-50 to-red-50', color: 'text-orange-600', delay: 0 },
          { label: 'تیم‌های فعال', value: stats.active, icon: CheckCircle2, gradient: 'from-green-50 to-emerald-50', color: 'text-green-600', delay: 0.1 },
          { label: 'فارغ‌التحصیل', value: stats.graduated, icon: Award, gradient: 'from-purple-50 to-pink-50', color: 'text-purple-600', delay: 0.2 },
          { label: 'کل اعضا', value: stats.totalMembers, icon: Target, gradient: 'from-blue-50 to-cyan-50', color: 'text-blue-600', delay: 0.3 }
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
                  placeholder="جستجو در تیم‌ها..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pr-10"
                />
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              {[
                { value: 'all', label: 'همه وضعیت‌ها' },
                { value: 'active', label: 'فعال' },
                { value: 'inactive', label: 'غیرفعال' },
                { value: 'graduated', label: 'فارغ‌التحصیل' }
              ].map((option) => (
                <Button
                  key={option.value}
                  variant={statusFilter === option.value ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setStatusFilter(option.value)}
                  className={statusFilter === option.value ? 'bg-gradient-to-r from-orange-600 to-red-600' : ''}
                >
                  {option.label}
                </Button>
              ))}
            </div>
            <div className="flex gap-2 flex-wrap">
              {[
                { value: 'all', label: 'همه فازها' },
                { value: 'ideation', label: 'ایده‌پردازی' },
                { value: 'validation', label: 'اعتبارسنجی' },
                { value: 'mvp', label: 'MVP' },
                { value: 'growth', label: 'رشد' },
                { value: 'scale', label: 'مقیاس‌پذیری' }
              ].map((option) => (
                <Button
                  key={option.value}
                  variant={phaseFilter === option.value ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setPhaseFilter(option.value)}
                  className={phaseFilter === option.value ? 'bg-gradient-to-r from-purple-600 to-pink-600' : ''}
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Teams Grid */}
      {teams.length === 0 ? (
        <Card className="border-0 shadow-lg">
          <CardContent className="p-12 text-center">
            <Users className="h-16 w-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">تیمی یافت نشد</h3>
            <p className="text-gray-500 mb-4">
              {search || statusFilter !== 'all' ? 'با فیلترهای انتخاب شده تیمی وجود ندارد' : 'هنوز تیمی ایجاد نشده است'}
            </p>
            <Button onClick={() => navigate('/admin/teams/create')}>
              <Plus className="ml-2 h-4 w-4" />
              ایجاد تیم جدید
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teams.map((team, index) => (
            <motion.div
              key={team._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="border-0 shadow-lg hover:shadow-xl transition-all h-full flex flex-col">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <CardTitle className="text-lg line-clamp-1">{team.name}</CardTitle>
                      <div className="flex gap-2 mt-2">
                        {getStatusBadge(team.status)}
                        {team.phase && getPhaseBadge(team.phase)}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <p className="text-sm text-gray-600 line-clamp-2 mb-4">{team.description}</p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Users className="h-4 w-4" />
                      <span>{team.members?.length || 0} عضو</span>
                    </div>
                    
                    {team.leader && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Target className="h-4 w-4" />
                        <span>لیدر: {team.leader.firstName} {team.leader.lastName}</span>
                      </div>
                    )}
                    
                    {team.project && (
                      <div className="flex items-center gap-2 text-sm text-blue-600">
                        <Rocket className="h-4 w-4" />
                        <span className="line-clamp-1">{team.project}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="h-4 w-4" />
                      <span>{new Date(team.createdAt).toLocaleDateString('fa-IR')}</span>
                    </div>
                  </div>

                  {team.techStack && team.techStack.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {team.techStack.slice(0, 3).map((tech, i) => (
                        <Badge key={i} variant="outline" className="text-xs">{tech}</Badge>
                      ))}
                      {team.techStack.length > 3 && (
                        <Badge variant="outline" className="text-xs">+{team.techStack.length - 3}</Badge>
                      )}
                    </div>
                  )}

                  <div className="flex gap-2 mt-auto">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => navigate(`/admin/teams/${team._id}`)}
                    >
                      <Eye className="h-4 w-4 ml-1" />
                      مشاهده
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => navigate(`/admin/teams/${team._id}/edit`)}
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
