import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Users,
  Target,
  Rocket,
  Edit,
  Trash2,
  ArrowRight,
  AlertCircle,
  User,
  Mail,
  Phone,
  RefreshCw,
  Calendar,
  Code,
  Lightbulb,
  TrendingUp,
  Award,
  UserPlus,
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

interface TeamMember {
  _id: string
  firstName: string
  lastName: string
  email: string
  phoneNumber?: string
  role: string[]
  joinedAt?: string
}

interface Team {
  _id: string
  name: string
  description: string
  phase: string
  status: 'active' | 'inactive' | 'graduated'
  members: TeamMember[]
  leader?: TeamMember
  project?: string
  techStack?: string[]
  ideaTitle?: string
  ideaDescription?: string
  problemStatement?: string
  solution?: string
  targetMarket?: string
  createdAt: string
  updatedAt: string
}

export default function TeamDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  const { data: team, isLoading, refetch, isFetching } = useQuery<Team>({
    queryKey: ['team', id],
    queryFn: async () => {
      const response = await api.get(`/teams/${id}`)
      return response.data.data
    },
    enabled: !!id,
  })

  const deleteMutation = useMutation({
    mutationFn: async () => {
      await api.delete(`/teams/${id}`)
    },
    onSuccess: () => {
      toast.success('تیم با موفقیت حذف شد')
      queryClient.invalidateQueries({ queryKey: ['teams'] })
      navigate('/admin/teams')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'خطا در حذف تیم')
    },
  })

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
    const config: Record<string, { label: string; className: string; icon: any }> = {
      ideation: { label: 'ایده‌پردازی', className: 'bg-blue-100 text-blue-800', icon: Lightbulb },
      validation: { label: 'اعتبارسنجی', className: 'bg-yellow-100 text-yellow-800', icon: Target },
      mvp: { label: 'MVP', className: 'bg-orange-100 text-orange-800', icon: Rocket },
      growth: { label: 'رشد', className: 'bg-green-100 text-green-800', icon: TrendingUp },
      scale: { label: 'مقیاس‌پذیری', className: 'bg-purple-100 text-purple-800', icon: Award },
    }
    const c = config[phase] || { label: phase, className: 'bg-gray-100 text-gray-800', icon: Target }
    return (
      <Badge className={`${c.className} flex items-center gap-1`}>
        <c.icon className="h-3 w-3" />
        {c.label}
      </Badge>
    )
  }

  if (isLoading) {
    return <PageSkeleton showHeader showStats statsCount={4} showFilters={false} itemsCount={3} />
  }

  if (!team) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <div className="text-center space-y-4">
          <AlertCircle className="w-16 h-16 mx-auto text-red-400" />
          <h2 className="text-2xl font-bold text-gray-700">تیم یافت نشد</h2>
          <Button onClick={() => navigate('/admin/teams')}>
            <ArrowRight className="ml-2 h-4 w-4" />
            بازگشت به لیست
          </Button>
        </div>
      </div>
    )
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
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate('/admin/teams')}
                className="text-white hover:bg-white/20"
              >
                <ArrowRight className="h-5 w-5" />
              </Button>
              <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
                <Users className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">{team.name}</h1>
                <div className="flex gap-2 mt-2">
                  {getStatusBadge(team.status)}
                  {team.phase && getPhaseBadge(team.phase)}
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
                onClick={() => navigate(`/admin/teams/${id}/edit`)}
                className="bg-white text-orange-600 hover:bg-white/90"
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
          { label: 'اعضای تیم', value: team.members?.length || 0, icon: Users, gradient: 'from-orange-50 to-red-50', color: 'text-orange-600' },
          { label: 'فاز فعلی', value: team.phase || 'نامشخص', icon: Target, gradient: 'from-blue-50 to-cyan-50', color: 'text-blue-600' },
          { label: 'تکنولوژی‌ها', value: team.techStack?.length || 0, icon: Code, gradient: 'from-purple-50 to-pink-50', color: 'text-purple-600' },
          { label: 'تاریخ ایجاد', value: new Date(team.createdAt).toLocaleDateString('fa-IR'), icon: Calendar, gradient: 'from-green-50 to-emerald-50', color: 'text-green-600' },
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
        {/* Team Details */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-0 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-orange-50 to-red-50 rounded-t-xl">
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-orange-600" />
                اطلاعات تیم
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">توضیحات</h4>
                <p className="text-gray-900 whitespace-pre-wrap">{team.description}</p>
              </div>

              {team.project && (
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">پروژه</h4>
                  <p className="text-gray-900">{team.project}</p>
                </div>
              )}

              {team.techStack && team.techStack.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">تکنولوژی‌ها</h4>
                  <div className="flex flex-wrap gap-2">
                    {team.techStack.map((tech, i) => (
                      <Badge key={i} variant="outline" className="bg-gray-50">
                        <Code className="h-3 w-3 ml-1" />
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Idea Details */}
          {(team.ideaTitle || team.ideaDescription) && (
            <Card className="border-0 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-t-xl">
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-yellow-600" />
                  ایده استارتاپ
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                {team.ideaTitle && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-1">عنوان ایده</h4>
                    <p className="text-lg font-semibold text-gray-900">{team.ideaTitle}</p>
                  </div>
                )}

                {team.ideaDescription && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-1">توضیحات ایده</h4>
                    <p className="text-gray-900 whitespace-pre-wrap">{team.ideaDescription}</p>
                  </div>
                )}

                {team.problemStatement && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-1">مشکل</h4>
                    <p className="text-gray-900 whitespace-pre-wrap">{team.problemStatement}</p>
                  </div>
                )}

                {team.solution && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-1">راه‌حل</h4>
                    <p className="text-gray-900 whitespace-pre-wrap">{team.solution}</p>
                  </div>
                )}

                {team.targetMarket && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-1">بازار هدف</h4>
                    <p className="text-gray-900 whitespace-pre-wrap">{team.targetMarket}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Team Members */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-t-xl">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-green-600" />
                  اعضای تیم ({team.members?.length || 0})
                </CardTitle>
                <Button variant="outline" size="sm">
                  <UserPlus className="h-4 w-4 ml-1" />
                  افزودن عضو
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              {!team.members || team.members.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                  <p className="text-gray-500">هنوز عضوی اضافه نشده است</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {team.leader && (
                    <div className="flex items-center justify-between p-3 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg border border-orange-200">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white font-bold">
                          {team.leader.firstName?.[0] || '?'}
                        </div>
                        <div>
                          <p className="font-medium">{team.leader.firstName || ''} {team.leader.lastName || ''}</p>
                          <div className="flex items-center gap-3 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              {team.leader.email || 'نامشخص'}
                            </span>
                          </div>
                        </div>
                      </div>
                      <Badge className="bg-orange-100 text-orange-800">لیدر تیم</Badge>
                    </div>
                  )}

                  {(team.members || []).filter(m => m._id !== team.leader?._id).map((member) => (
                    <div
                      key={member._id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                          {member.firstName?.[0] || '?'}
                        </div>
                        <div>
                          <p className="font-medium">{member.firstName || ''} {member.lastName || ''}</p>
                          <div className="flex items-center gap-3 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              {member.email || 'نامشخص'}
                            </span>
                            {member.phoneNumber && (
                              <span className="flex items-center gap-1">
                                <Phone className="h-3 w-3" />
                                {member.phoneNumber}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <Badge variant="outline">عضو</Badge>
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
                <p className="text-xs text-gray-500">شناسه تیم</p>
                <p className="text-sm font-mono bg-gray-100 p-2 rounded mt-1">{team._id}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">تاریخ ایجاد</p>
                <p className="text-sm">{new Date(team.createdAt).toLocaleDateString('fa-IR')}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">آخرین بروزرسانی</p>
                <p className="text-sm">{new Date(team.updatedAt).toLocaleDateString('fa-IR')}</p>
              </div>
            </CardContent>
          </Card>

          {/* Phase Progress */}
          <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-red-50">
            <CardContent className="pt-6">
              <h4 className="text-sm font-medium text-gray-700 mb-4">پیشرفت فاز</h4>
              <div className="space-y-2">
                {['ideation', 'validation', 'mvp', 'growth', 'scale'].map((phase, index) => {
                  const phases = ['ideation', 'validation', 'mvp', 'growth', 'scale']
                  const currentIndex = phases.indexOf(team.phase || 'ideation')
                  const isCompleted = index <= currentIndex
                  const isCurrent = index === currentIndex

                  return (
                    <div key={phase} className="flex items-center gap-2">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        isCompleted ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-500'
                      } ${isCurrent ? 'ring-2 ring-orange-300' : ''}`}>
                        {index + 1}
                      </div>
                      <span className={`text-sm ${isCompleted ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
                        {getPhaseBadge(phase).props.children[1]}
                      </span>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <Trash2 className="h-5 w-5" />
              حذف تیم
            </DialogTitle>
            <DialogDescription>
              آیا از حذف تیم "{team.name}" اطمینان دارید؟ این عملیات قابل بازگشت نیست.
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
              {deleteMutation.isPending ? 'در حال حذف...' : 'حذف تیم'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
