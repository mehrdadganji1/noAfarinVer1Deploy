import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Video,
  Edit,
  Trash2,
  ArrowRight,
  CheckCircle2,
  XCircle,
  AlertCircle,
  User,
  Mail,
  Phone,
  RefreshCw,
  ExternalLink,
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
  phoneNumber?: string
  registeredAt: string
  attended?: boolean
}

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
  participants?: Participant[]
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled'
  agenda?: string
  createdAt: string
  updatedAt: string
}

export default function EventDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  const { data: event, isLoading, refetch, isFetching } = useQuery<Event>({
    queryKey: ['event', id],
    queryFn: async () => {
      const response = await api.get(`/events/${id}`)
      return response.data.data
    },
    enabled: !!id,
  })

  const deleteMutation = useMutation({
    mutationFn: async () => {
      await api.delete(`/events/${id}`)
    },
    onSuccess: () => {
      toast.success('رویداد با موفقیت حذف شد')
      queryClient.invalidateQueries({ queryKey: ['events'] })
      navigate('/admin/events')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'خطا در حذف رویداد')
    },
  })

  const markAttendanceMutation = useMutation({
    mutationFn: async (participantId: string) => {
      await api.post(`/events/${id}/attendance`, { participantId })
    },
    onSuccess: () => {
      toast.success('حضور ثبت شد')
      refetch()
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'خطا در ثبت حضور')
    },
  })

  const getStatusBadge = (status: string) => {
    const config: Record<string, { label: string; className: string; icon: any }> = {
      upcoming: { label: 'آینده', className: 'bg-blue-100 text-blue-800', icon: Clock },
      ongoing: { label: 'در حال برگزاری', className: 'bg-green-100 text-green-800', icon: CheckCircle2 },
      completed: { label: 'برگزار شده', className: 'bg-gray-100 text-gray-800', icon: CheckCircle2 },
      cancelled: { label: 'لغو شده', className: 'bg-red-100 text-red-800', icon: XCircle },
    }
    const c = config[status] || config.upcoming
    return (
      <Badge className={`${c.className} flex items-center gap-1`}>
        <c.icon className="h-3 w-3" />
        {c.label}
      </Badge>
    )
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

  if (isLoading) {
    return <PageSkeleton showHeader showStats statsCount={4} showFilters={false} itemsCount={3} />
  }

  if (!event) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <div className="text-center space-y-4">
          <AlertCircle className="w-16 h-16 mx-auto text-red-400" />
          <h2 className="text-2xl font-bold text-gray-700">رویداد یافت نشد</h2>
          <Button onClick={() => navigate('/admin/events')}>
            <ArrowRight className="ml-2 h-4 w-4" />
            بازگشت به لیست
          </Button>
        </div>
      </div>
    )
  }

  const participantsCount = event.participants?.length || 0
  const attendedCount = event.participants?.filter(p => p.attended).length || 0

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
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate('/admin/events')}
                className="text-white hover:bg-white/20"
              >
                <ArrowRight className="h-5 w-5" />
              </Button>
              <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
                <Calendar className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">{event.title}</h1>
                <div className="flex gap-2 mt-2">
                  {getStatusBadge(event.status)}
                  {getTypeBadge(event.type)}
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
                onClick={() => navigate(`/admin/events/${id}/edit`)}
                className="bg-white text-indigo-600 hover:bg-white/90"
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
          { label: 'ثبت‌نام شده', value: participantsCount, icon: Users, gradient: 'from-blue-50 to-cyan-50', color: 'text-blue-600' },
          { label: 'حاضرین', value: attendedCount, icon: CheckCircle2, gradient: 'from-green-50 to-emerald-50', color: 'text-green-600' },
          { label: 'ظرفیت', value: event.capacity || '∞', icon: Users, gradient: 'from-purple-50 to-pink-50', color: 'text-purple-600' },
          { label: 'نرخ حضور', value: participantsCount > 0 ? `${Math.round((attendedCount / participantsCount) * 100)}%` : '0%', icon: CheckCircle2, gradient: 'from-orange-50 to-amber-50', color: 'text-orange-600' },
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
        {/* Event Details */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-0 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-xl">
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-blue-600" />
                اطلاعات رویداد
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">توضیحات</h4>
                <p className="text-gray-900 whitespace-pre-wrap">{event.description}</p>
              </div>

              {event.agenda && (
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">دستور جلسه</h4>
                  <p className="text-gray-900 whitespace-pre-wrap">{event.agenda}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">تاریخ شروع</p>
                    <p className="text-sm font-medium">{new Date(event.startDate).toLocaleDateString('fa-IR', { dateStyle: 'full' })}</p>
                    <p className="text-xs text-gray-500">{new Date(event.startDate).toLocaleTimeString('fa-IR', { timeStyle: 'short' })}</p>
                  </div>
                </div>

                {event.endDate && (
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">تاریخ پایان</p>
                      <p className="text-sm font-medium">{new Date(event.endDate).toLocaleDateString('fa-IR', { dateStyle: 'full' })}</p>
                      <p className="text-xs text-gray-500">{new Date(event.endDate).toLocaleTimeString('fa-IR', { timeStyle: 'short' })}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t">
                {event.isOnline ? (
                  <div className="flex items-center gap-2">
                    <Video className="h-4 w-4 text-blue-600" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-blue-600">رویداد آنلاین</p>
                      {event.meetingLink && (
                        <a
                          href={event.meetingLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-500 hover:underline flex items-center gap-1"
                        >
                          لینک جلسه
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">محل برگزاری</p>
                      <p className="text-sm font-medium">{event.location || 'مشخص نشده'}</p>
                    </div>
                  </div>
                )}
              </div>
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
              {!event.participants || event.participants.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                  <p className="text-gray-500">هنوز کسی ثبت‌نام نکرده است</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {event.participants.map((participant) => (
                    <div
                      key={participant._id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                          {participant.firstName[0]}
                        </div>
                        <div>
                          <p className="font-medium">{participant.firstName} {participant.lastName}</p>
                          <div className="flex items-center gap-3 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              {participant.email}
                            </span>
                            {participant.phoneNumber && (
                              <span className="flex items-center gap-1">
                                <Phone className="h-3 w-3" />
                                {participant.phoneNumber}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {participant.attended ? (
                          <Badge className="bg-green-100 text-green-800">حاضر</Badge>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => markAttendanceMutation.mutate(participant._id)}
                            disabled={markAttendanceMutation.isPending}
                          >
                            <CheckCircle2 className="h-4 w-4 ml-1" />
                            ثبت حضور
                          </Button>
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
                <p className="text-xs text-gray-500">شناسه رویداد</p>
                <p className="text-sm font-mono bg-gray-100 p-2 rounded mt-1">{event._id}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">تاریخ ایجاد</p>
                <p className="text-sm">{new Date(event.createdAt).toLocaleDateString('fa-IR')}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">آخرین بروزرسانی</p>
                <p className="text-sm">{new Date(event.updatedAt).toLocaleDateString('fa-IR')}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">
                  {event.capacity ? Math.round((participantsCount / event.capacity) * 100) : 0}%
                </div>
                <p className="text-sm text-gray-600">ظرفیت پر شده</p>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full transition-all"
                    style={{ width: `${event.capacity ? Math.min((participantsCount / event.capacity) * 100, 100) : 0}%` }}
                  />
                </div>
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
              حذف رویداد
            </DialogTitle>
            <DialogDescription>
              آیا از حذف رویداد "{event.title}" اطمینان دارید؟ این عملیات قابل بازگشت نیست.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              انصراف
            </Button>
            <Button
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={() => deleteMutation.mutate()}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? 'در حال حذف...' : 'حذف رویداد'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
