import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Calendar,
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  Download,
  Eye,
  UserCheck,
  AlertCircle,
  TrendingUp,
  Mail,
  Phone,
  MapPin
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import api from '@/lib/api'
import { toast } from '@/components/ui/toast'
import { PageHeader } from '@/components/shared/PageHeader'

interface EventApplication {
  _id: string
  eventId: {
    _id: string
    title: string
    startDate: string
    endDate: string
    location: string
  }
  userId: {
    _id: string
    email: string
    firstName?: string
    lastName?: string
  }
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
  motivation: string
  experience?: string
  expectations?: string
  teamName?: string
  teamMembers?: string[]
  status: 'pending' | 'under-review' | 'approved' | 'rejected' | 'waitlist'
  reviewedBy?: {
    firstName: string
    lastName: string
  }
  reviewedAt?: string
  reviewNotes?: string
  submittedAt: string
  createdAt: string
}

interface Stats {
  total: number
  pending: number
  underReview: number
  approved: number
  rejected: number
  waitlist: number
  approvalRate: number
}

const statusConfig = {
  pending: {
    label: 'در انتظار بررسی',
    color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    icon: Clock,
  },
  'under-review': {
    label: 'در حال بررسی',
    color: 'bg-blue-100 text-blue-800 border-blue-200',
    icon: Eye,
  },
  approved: {
    label: 'تایید شده',
    color: 'bg-green-100 text-green-800 border-green-200',
    icon: CheckCircle2,
  },
  rejected: {
    label: 'رد شده',
    color: 'bg-red-100 text-red-800 border-red-200',
    icon: XCircle,
  },
  waitlist: {
    label: 'لیست انتظار',
    color: 'bg-purple-100 text-purple-800 border-purple-200',
    icon: AlertCircle,
  },
}

export default function AACoEventApplications() {
  const queryClient = useQueryClient()
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedApplication, setSelectedApplication] = useState<EventApplication | null>(null)
  const [selectedApplications, setSelectedApplications] = useState<string[]>([])

  // Fetch stats
  const { data: stats } = useQuery<Stats>({
    queryKey: ['event-application-stats'],
    queryFn: async () => {
      const response = await api.get('/event-applications/stats')
      return response.data.data
    },
  })

  // Fetch applications
  const { data: applicationsData, isLoading } = useQuery({
    queryKey: ['event-applications', selectedStatus, searchQuery],
    queryFn: async () => {
      const params: any = {}
      if (selectedStatus !== 'all') params.status = selectedStatus
      if (searchQuery) params.search = searchQuery

      const response = await api.get('/event-applications', { params })
      return response.data
    },
  })

  // Approve mutation
  const approveMutation = useMutation({
    mutationFn: async ({ id, reviewNotes }: { id: string; reviewNotes?: string }) => {
      const response = await api.patch(`/event-applications/${id}/approve`, { reviewNotes })
      return response.data
    },
    onSuccess: () => {
      toast.success('درخواست تایید شد')
      queryClient.invalidateQueries({ queryKey: ['event-applications'] })
      queryClient.invalidateQueries({ queryKey: ['event-application-stats'] })
      setSelectedApplication(null)
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'خطا در تایید درخواست')
    },
  })

  // Reject mutation
  const rejectMutation = useMutation({
    mutationFn: async ({ id, reviewNotes }: { id: string; reviewNotes: string }) => {
      const response = await api.patch(`/event-applications/${id}/reject`, { reviewNotes })
      return response.data
    },
    onSuccess: () => {
      toast.success('درخواست رد شد')
      queryClient.invalidateQueries({ queryKey: ['event-applications'] })
      queryClient.invalidateQueries({ queryKey: ['event-application-stats'] })
      setSelectedApplication(null)
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'خطا در رد درخواست')
    },
  })

  // Bulk approve mutation
  const bulkApproveMutation = useMutation({
    mutationFn: async (applicationIds: string[]) => {
      const response = await api.post('/event-applications/bulk-approve', {
        applicationIds,
        reviewNotes: 'تایید گروهی',
      })
      return response.data
    },
    onSuccess: () => {
      toast.success('درخواست‌ها تایید شدند')
      queryClient.invalidateQueries({ queryKey: ['event-applications'] })
      queryClient.invalidateQueries({ queryKey: ['event-application-stats'] })
      setSelectedApplications([])
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'خطا در تایید گروهی')
    },
  })

  const applications = applicationsData?.data || []

  const handleApprove = (id: string) => {
    if (confirm('آیا از تایید این درخواست اطمینان دارید؟')) {
      approveMutation.mutate({ id })
    }
  }

  const handleReject = (id: string) => {
    const reviewNotes = prompt('لطفاً دلیل رد درخواست را وارد کنید:')
    if (reviewNotes && reviewNotes.trim()) {
      rejectMutation.mutate({ id, reviewNotes })
    }
  }

  const handleBulkApprove = () => {
    if (selectedApplications.length === 0) {
      toast.error('لطفاً حداقل یک درخواست را انتخاب کنید')
      return
    }
    if (confirm(`آیا از تایید ${selectedApplications.length} درخواست اطمینان دارید؟`)) {
      bulkApproveMutation.mutate(selectedApplications)
    }
  }

  const toggleSelection = (id: string) => {
    setSelectedApplications(prev =>
      prev.includes(id) ? prev.filter(appId => appId !== id) : [...prev, id]
    )
  }

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <PageHeader
        title="درخواست‌های رویداد AACO"
        description="مدیریت و بررسی درخواست‌های شرکت در رویدادهای AACO"
        icon={Calendar}
        gradient="from-purple-600 to-indigo-600"
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl p-4 text-white shadow-lg"
        >
          <div className="flex items-center justify-between mb-2">
            <Users className="h-8 w-8 opacity-80" />
            <TrendingUp className="h-5 w-5" />
          </div>
          <p className="text-3xl font-bold">{stats?.total || 0}</p>
          <p className="text-sm opacity-90">کل درخواست‌ها</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl p-4 text-white shadow-lg cursor-pointer hover:scale-105 transition-transform"
          onClick={() => setSelectedStatus('pending')}
        >
          <div className="flex items-center justify-between mb-2">
            <Clock className="h-8 w-8 opacity-80" />
          </div>
          <p className="text-3xl font-bold">{stats?.pending || 0}</p>
          <p className="text-sm opacity-90">در انتظار بررسی</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl p-4 text-white shadow-lg cursor-pointer hover:scale-105 transition-transform"
          onClick={() => setSelectedStatus('under-review')}
        >
          <div className="flex items-center justify-between mb-2">
            <Eye className="h-8 w-8 opacity-80" />
          </div>
          <p className="text-3xl font-bold">{stats?.underReview || 0}</p>
          <p className="text-sm opacity-90">در حال بررسی</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl p-4 text-white shadow-lg cursor-pointer hover:scale-105 transition-transform"
          onClick={() => setSelectedStatus('approved')}
        >
          <div className="flex items-center justify-between mb-2">
            <CheckCircle2 className="h-8 w-8 opacity-80" />
          </div>
          <p className="text-3xl font-bold">{stats?.approved || 0}</p>
          <p className="text-sm opacity-90">تایید شده</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-br from-red-500 to-pink-500 rounded-xl p-4 text-white shadow-lg cursor-pointer hover:scale-105 transition-transform"
          onClick={() => setSelectedStatus('rejected')}
        >
          <div className="flex items-center justify-between mb-2">
            <XCircle className="h-8 w-8 opacity-80" />
          </div>
          <p className="text-3xl font-bold">{stats?.rejected || 0}</p>
          <p className="text-sm opacity-90">رد شده</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl p-4 text-white shadow-lg"
        >
          <div className="flex items-center justify-between mb-2">
            <UserCheck className="h-8 w-8 opacity-80" />
          </div>
          <p className="text-3xl font-bold">{stats?.approvalRate || 0}%</p>
          <p className="text-sm opacity-90">نرخ تایید</p>
        </motion.div>
      </div>

      {/* Filters and Actions */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                placeholder="جستجو بر اساس نام، ایمیل..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10"
              />
            </div>

            <div className="flex gap-2">
              <Button
                variant={selectedStatus === 'all' ? 'default' : 'outline'}
                onClick={() => setSelectedStatus('all')}
              >
                همه
              </Button>
              <Button
                variant={selectedStatus === 'pending' ? 'default' : 'outline'}
                onClick={() => setSelectedStatus('pending')}
              >
                در انتظار
              </Button>
              <Button
                variant={selectedStatus === 'approved' ? 'default' : 'outline'}
                onClick={() => setSelectedStatus('approved')}
              >
                تایید شده
              </Button>
            </div>

            {selectedApplications.length > 0 && (
              <Button
                onClick={handleBulkApprove}
                className="bg-green-600 hover:bg-green-700"
              >
                <CheckCircle2 className="ml-2 h-4 w-4" />
                تایید گروهی ({selectedApplications.length})
              </Button>
            )}

            <Button variant="outline">
              <Download className="ml-2 h-4 w-4" />
              خروجی Excel
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Applications List */}
      <Card>
        <CardHeader>
          <CardTitle>لیست درخواست‌ها</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-gray-600">در حال بارگذاری...</p>
            </div>
          ) : applications.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">درخواستی یافت نشد</p>
            </div>
          ) : (
            <div className="space-y-4">
              {applications.map((application: EventApplication) => {
                const StatusIcon = statusConfig[application.status].icon
                return (
                  <motion.div
                    key={application._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start gap-4">
                      <input
                        type="checkbox"
                        checked={selectedApplications.includes(application._id)}
                        onChange={() => toggleSelection(application._id)}
                        className="mt-1"
                      />

                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">
                              {application.firstName} {application.lastName}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {application.eventId.title}
                            </p>
                          </div>
                          <Badge className={statusConfig[application.status].color}>
                            <StatusIcon className="ml-1 h-3 w-3" />
                            {statusConfig[application.status].label}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Mail className="h-4 w-4" />
                            {application.email}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Phone className="h-4 w-4" />
                            {application.phoneNumber}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <MapPin className="h-4 w-4" />
                            {application.eventId.location}
                          </div>
                        </div>

                        <p className="text-sm text-gray-700 mb-3 line-clamp-2">
                          <strong>انگیزه:</strong> {application.motivation}
                        </p>

                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setSelectedApplication(application)}
                          >
                            <Eye className="ml-1 h-4 w-4" />
                            مشاهده جزئیات
                          </Button>

                          {application.status === 'pending' && (
                            <>
                              <Button
                                size="sm"
                                className="bg-green-600 hover:bg-green-700"
                                onClick={() => handleApprove(application._id)}
                              >
                                <CheckCircle2 className="ml-1 h-4 w-4" />
                                تایید
                              </Button>
                              <Button
                                size="sm"
                                className="bg-red-600 hover:bg-red-700 text-white"
                                onClick={() => handleReject(application._id)}
                              >
                                <XCircle className="ml-1 h-4 w-4" />
                                رد
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Application Detail Modal */}
      <AnimatePresence>
        {selectedApplication && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedApplication(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {selectedApplication.firstName} {selectedApplication.lastName}
                    </h2>
                    <p className="text-gray-600">{selectedApplication.eventId.title}</p>
                  </div>
                  <Badge className={statusConfig[selectedApplication.status].color}>
                    {statusConfig[selectedApplication.status].label}
                  </Badge>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">اطلاعات تماس</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-sm text-gray-600">ایمیل</p>
                        <p className="font-medium">{selectedApplication.email}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">تلفن</p>
                        <p className="font-medium">{selectedApplication.phoneNumber}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">انگیزه شرکت</h3>
                    <p className="text-gray-700">{selectedApplication.motivation}</p>
                  </div>

                  {selectedApplication.experience && (
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">تجربیات</h3>
                      <p className="text-gray-700">{selectedApplication.experience}</p>
                    </div>
                  )}

                  {selectedApplication.expectations && (
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">انتظارات</h3>
                      <p className="text-gray-700">{selectedApplication.expectations}</p>
                    </div>
                  )}

                  {selectedApplication.teamName && (
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">نام تیم</h3>
                      <p className="text-gray-700">{selectedApplication.teamName}</p>
                    </div>
                  )}

                  {selectedApplication.reviewNotes && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-gray-900 mb-2">یادداشت بررسی</h3>
                      <p className="text-gray-700">{selectedApplication.reviewNotes}</p>
                    </div>
                  )}
                </div>

                <div className="flex gap-3 mt-6">
                  <Button
                    variant="outline"
                    onClick={() => setSelectedApplication(null)}
                    className="flex-1"
                  >
                    بستن
                  </Button>
                  {selectedApplication.status === 'pending' && (
                    <>
                      <Button
                        className="flex-1 bg-green-600 hover:bg-green-700"
                        onClick={() => {
                          handleApprove(selectedApplication._id)
                        }}
                      >
                        <CheckCircle2 className="ml-2 h-4 w-4" />
                        تایید
                      </Button>
                      <Button
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                        onClick={() => {
                          handleReject(selectedApplication._id)
                        }}
                      >
                        <XCircle className="ml-2 h-4 w-4" />
                        رد
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
