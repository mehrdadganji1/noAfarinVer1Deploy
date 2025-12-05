import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  GraduationCap,
  Clock,
  Users,
  Edit,
  Trash2,
  ArrowRight,
  AlertCircle,
  User,
  Mail,
  RefreshCw,
  Calendar,
  BookOpen,
  Video,
  PlayCircle,
  CheckCircle2,
  Target,
  Download,
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { PageSkeleton } from '@/components/ui/page-skeleton'
import { toast } from '@/components/ui/toast'
import api from '@/lib/api'

interface Participant {
  _id: string
  firstName: string
  lastName: string
  email: string
  enrolledAt: string
  progress?: number
  completed?: boolean
}

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
  participants?: Participant[]
  status: 'draft' | 'published' | 'archived'
  topics?: string[]
  prerequisites?: string[]
  objectives?: string[]
  startDate?: string
  endDate?: string
  createdAt: string
  updatedAt: string
}

export default function TrainingDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  const { data: training, isLoading, refetch, isFetching } = useQuery<Training>({
    queryKey: ['training', id],
    queryFn: async () => {
      const response = await api.get(`/trainings/${id}`)
      return response.data.data
    },
    enabled: !!id,
  })

  const deleteMutation = useMutation({
    mutationFn: async () => {
      await api.delete(`/trainings/${id}`)
    },
    onSuccess: () => {
      toast.success('دوره با موفقیت حذف شد')
      queryClient.invalidateQueries({ queryKey: ['trainings'] })
      navigate('/admin/trainings')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'خطا در حذف دوره')
    },
  })

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

  if (isLoading) {
    return <PageSkeleton showHeader showStats statsCount={4} showFilters={false} itemsCount={3} />
  }

  if (!training) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <div className="text-center space-y-4">
          <AlertCircle className="w-16 h-16 mx-auto text-red-400" />
          <h2 className="text-2xl font-bold text-gray-700">دوره یافت نشد</h2>
          <Button onClick={() => navigate('/admin/trainings')}>
            <ArrowRight className="ml-2 h-4 w-4" />
            بازگشت به لیست
          </Button>
        </div>
      </div>
    )
  }

  const participantsCount = training.participants?.length || training.enrolledCount || 0
  const completedCount = training.participants?.filter(p => p.completed).length || 0

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
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate('/admin/trainings')}
                className="text-white hover:bg-white/20"
              >
                <ArrowRight className="h-5 w-5" />
              </Button>
              <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
                <GraduationCap className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">{training.title}</h1>
                <div className="flex gap-2 mt-2">
                  {getStatusBadge(training.status)}
                  {getLevelBadge(training.level)}
                </div>
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
                onClick={() => navigate(`/admin/trainings/${id}/edit`)}
                className="bg-white text-teal-600 hover:bg-white/90"
              >
                <Edit className="ml-2 h-4 w-4" />
                ویرایش
              </Button>
              <Button
                variant="outline"
                onClick={() => setDeleteDialogOpen(true)}
                className="bg-red-500/20 hover:bg-red-500/30 text-white border-0"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </motion.div>


      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'ثبت‌نام شده', value: participantsCount, icon: Users, gradient: 'from-teal-50 to-cyan-50', color: 'text-teal-600' },
          { label: 'تکمیل کرده', value: completedCount, icon: CheckCircle2, gradient: 'from-green-50 to-emerald-50', color: 'text-green-600' },
          { label: 'مدت زمان', value: `${training.duration} ساعت`, icon: Clock, gradient: 'from-purple-50 to-pink-50', color: 'text-purple-600' },
          { label: 'ظرفیت', value: training.capacity || '∞', icon: Users, gradient: 'from-orange-50 to-amber-50', color: 'text-orange-600' },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className={`border-0 shadow-lg bg-gradient-to-br ${stat.gradient}`}>
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

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Training Details */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-0 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-t-xl">
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-teal-600" />
                اطلاعات دوره
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">توضیحات</h4>
                <p className="text-gray-900 whitespace-pre-wrap">{training.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">مدرس</p>
                    <p className="text-sm font-medium">{training.instructor}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {training.isOnline ? (
                    <>
                      <Video className="h-4 w-4 text-blue-600" />
                      <div>
                        <p className="text-xs text-gray-500">نوع برگزاری</p>
                        <p className="text-sm font-medium text-blue-600">آنلاین</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <PlayCircle className="h-4 w-4 text-green-600" />
                      <div>
                        <p className="text-xs text-gray-500">نوع برگزاری</p>
                        <p className="text-sm font-medium text-green-600">حضوری</p>
                      </div>
                    </>
                  )}
                </div>

                {training.startDate && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">تاریخ شروع</p>
                      <p className="text-sm font-medium">{new Date(training.startDate).toLocaleDateString('fa-IR')}</p>
                    </div>
                  </div>
                )}

                {training.endDate && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">تاریخ پایان</p>
                      <p className="text-sm font-medium">{new Date(training.endDate).toLocaleDateString('fa-IR')}</p>
                    </div>
                  </div>
                )}
              </div>

              {training.topics && training.topics.length > 0 && (
                <div className="pt-4 border-t">
                  <h4 className="text-sm font-medium text-gray-500 mb-2">موضوعات</h4>
                  <div className="flex flex-wrap gap-2">
                    {training.topics.map((topic, i) => (
                      <Badge key={i} variant="outline" className="bg-teal-50">
                        <BookOpen className="h-3 w-3 ml-1" />
                        {topic}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {training.prerequisites && training.prerequisites.length > 0 && (
                <div className="pt-4 border-t">
                  <h4 className="text-sm font-medium text-gray-500 mb-2">پیش‌نیازها</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                    {training.prerequisites.map((prereq, i) => (
                      <li key={i}>{prereq}</li>
                    ))}
                  </ul>
                </div>
              )}

              {training.objectives && training.objectives.length > 0 && (
                <div className="pt-4 border-t">
                  <h4 className="text-sm font-medium text-gray-500 mb-2">اهداف دوره</h4>
                  <ul className="space-y-2">
                    {training.objectives.map((obj, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                        <Target className="h-4 w-4 text-teal-600 mt-0.5 flex-shrink-0" />
                        {obj}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Participants List */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-t-xl">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-green-600" />
                  شرکت‌کنندگان ({participantsCount})
                </CardTitle>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 ml-1" />
                  خروجی اکسل
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              {!training.participants || training.participants.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                  <p className="text-gray-500">هنوز کسی ثبت‌نام نکرده است</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {training.participants.map((participant) => (
                    <div
                      key={participant._id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold">
                          {participant.firstName[0]}
                        </div>
                        <div>
                          <p className="font-medium">{participant.firstName} {participant.lastName}</p>
                          <div className="flex items-center gap-3 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              {participant.email}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {participant.progress !== undefined && (
                          <div className="text-sm text-gray-600">
                            {participant.progress}%
                          </div>
                        )}
                        {participant.completed ? (
                          <Badge className="bg-green-100 text-green-800">تکمیل شده</Badge>
                        ) : (
                          <Badge variant="outline">در حال یادگیری</Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card className="border-0 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-t-xl">
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-purple-600" />
                اطلاعات سیستمی
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div>
                <p className="text-xs text-gray-500">شناسه دوره</p>
                <p className="text-sm font-mono bg-gray-100 p-2 rounded mt-1">{training._id}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">دسته‌بندی</p>
                <p className="text-sm">{training.category || 'مشخص نشده'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">تاریخ ایجاد</p>
                <p className="text-sm">{new Date(training.createdAt).toLocaleDateString('fa-IR')}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">آخرین بروزرسانی</p>
                <p className="text-sm">{new Date(training.updatedAt).toLocaleDateString('fa-IR')}</p>
              </div>
            </CardContent>
          </Card>

          {/* Completion Rate */}
          <Card className="border-0 shadow-lg bg-gradient-to-br from-teal-50 to-cyan-50">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-teal-600 mb-2">
                  {participantsCount > 0 ? Math.round((completedCount / participantsCount) * 100) : 0}%
                </div>
                <p className="text-sm text-gray-600">نرخ تکمیل دوره</p>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                  <div
                    className="bg-gradient-to-r from-teal-500 to-cyan-500 h-2 rounded-full transition-all"
                    style={{ width: `${participantsCount > 0 ? Math.min((completedCount / participantsCount) * 100, 100) : 0}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Capacity */}
          {training.capacity && (
            <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-amber-50">
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-4xl font-bold text-orange-600 mb-2">
                    {Math.round((participantsCount / training.capacity) * 100)}%
                  </div>
                  <p className="text-sm text-gray-600">ظرفیت پر شده</p>
                  <p className="text-xs text-gray-500 mt-1">{participantsCount} از {training.capacity} نفر</p>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                    <div
                      className="bg-gradient-to-r from-orange-500 to-amber-500 h-2 rounded-full transition-all"
                      style={{ width: `${Math.min((participantsCount / training.capacity) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <Trash2 className="h-5 w-5" />
              حذف دوره
            </DialogTitle>
            <DialogDescription>
              آیا از حذف دوره "{training.title}" اطمینان دارید؟ این عملیات قابل بازگشت نیست.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              انصراف
            </Button>
            <Button
              variant="outline"
              onClick={() => deleteMutation.mutate()}
              disabled={deleteMutation.isPending}
              className="bg-red-500 hover:bg-red-600 text-white border-0"
            >
              {deleteMutation.isPending ? 'در حال حذف...' : 'حذف دوره'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
