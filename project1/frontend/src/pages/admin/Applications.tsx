import { useState } from 'react'
import { motion } from 'framer-motion'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Clock,
  CheckCircle2,
  XCircle,
  FileSearch,
  Search,
  Eye,
  ThumbsUp,
  ThumbsDown,
  Users
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import api from '@/lib/api'
import { toast } from '@/components/ui/toast'
import { PageSkeleton } from '@/components/ui/page-skeleton'

export default function Applications() {
  const queryClient = useQueryClient()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [selectedApplication, setSelectedApplication] = useState<any>(null)
  const [detailsModalOpen, setDetailsModalOpen] = useState(false)
  const [actionModalOpen, setActionModalOpen] = useState(false)
  const [actionType, setActionType] = useState<'approve' | 'reject' | 'review'>('approve')
  const [reviewNotes, setReviewNotes] = useState('')
  const [page] = useState(1)

  // Fetch applications
  const { data, isLoading } = useQuery({
    queryKey: ['applications', statusFilter, search, page],
    queryFn: async () => {
      const params = new URLSearchParams()
      if (statusFilter !== 'all') params.append('status', statusFilter)
      if (search) params.append('search', search)
      params.append('page', page.toString())
      params.append('limit', '20')

      const response = await api.get(`/applications?${params.toString()}`)
      return response.data
    },
  })

  // Fetch stats
  const { data: stats } = useQuery({
    queryKey: ['application-stats'],
    queryFn: async () => {
      const response = await api.get('/applications/stats')
      return response.data.data
    },
  })

  // Review mutation
  const reviewMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await api.patch(`/api/applications/${id}/review`)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] })
      queryClient.invalidateQueries({ queryKey: ['application-stats'] })
      toast.success('وضعیت به "در حال بررسی" تغییر کرد')
      setActionModalOpen(false)
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'خطا در تغییر وضعیت')
    },
  })

  // Approve mutation
  const approveMutation = useMutation({
    mutationFn: async ({ id, notes }: { id: string; notes: string }) => {
      const response = await api.patch(`/api/applications/${id}/approve`, {
        reviewNotes: notes
      })
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] })
      queryClient.invalidateQueries({ queryKey: ['application-stats'] })
      toast.success('درخواست با موفقیت تایید شد')
      setActionModalOpen(false)
      setSelectedApplication(null)
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'خطا در تایید درخواست')
    },
  })

  // Reject mutation
  const rejectMutation = useMutation({
    mutationFn: async ({ id, notes }: { id: string; notes: string }) => {
      const response = await api.patch(`/api/applications/${id}/reject`, {
        reviewNotes: notes
      })
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] })
      queryClient.invalidateQueries({ queryKey: ['application-stats'] })
      toast.success('درخواست رد شد')
      setActionModalOpen(false)
      setSelectedApplication(null)
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'خطا در رد درخواست')
    },
  })



  // Handlers
  const handleAction = () => {
    if (!selectedApplication) return

    if (actionType === 'review') {
      reviewMutation.mutate(selectedApplication._id)
    } else if (actionType === 'approve') {
      approveMutation.mutate({ id: selectedApplication._id, notes: reviewNotes })
    } else if (actionType === 'reject') {
      if (!reviewNotes) {
        toast.error('لطفاً دلیل رد را وارد کنید')
        return
      }
      rejectMutation.mutate({ id: selectedApplication._id, notes: reviewNotes })
    }
  }

  const openActionModal = (application: any, type: 'approve' | 'reject' | 'review') => {
    setSelectedApplication(application)
    setActionType(type)
    setReviewNotes('')
    setActionModalOpen(true)
  }

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { label: string; className: string }> = {
      'pending': { label: 'در انتظار', className: 'bg-yellow-100 text-yellow-800' },
      'under-review': { label: 'در حال بررسی', className: 'bg-blue-100 text-blue-800' },
      'approved': { label: 'تایید شده', className: 'bg-green-100 text-green-800' },
      'rejected': { label: 'رد شده', className: 'bg-red-100 text-red-800' }
    }
    const config = statusConfig[status] || statusConfig['pending']
    return <Badge className={config.className}>{config.label}</Badge>
  }

  // Show skeleton while loading
  if (isLoading && !data) {
    return <PageSkeleton showHeader showStats statsCount={5} showFilters itemsCount={10} />
  }

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-green-600 via-emerald-600 to-teal-600 p-8 text-white shadow-2xl"
      >
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
              <FileSearch className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">مدیریت درخواست‌ها</h1>
              <p className="text-white/90 text-lg mt-1">بررسی و تایید درخواست‌های عضویت</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Statistics */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {[
            { label: 'کل درخواست‌ها', value: stats.total, icon: Users, gradient: 'from-blue-50 to-cyan-50', color: 'text-blue-600', delay: 0 },
            { label: 'در انتظار', value: stats.pending, icon: Clock, gradient: 'from-yellow-50 to-amber-50', color: 'text-yellow-600', delay: 0.1 },
            { label: 'در حال بررسی', value: stats.underReview, icon: FileSearch, gradient: 'from-blue-50 to-indigo-50', color: 'text-blue-600', delay: 0.2 },
            { label: 'تایید شده', value: stats.approved, icon: CheckCircle2, gradient: 'from-green-50 to-emerald-50', color: 'text-green-600', delay: 0.3 },
            { label: 'رد شده', value: stats.rejected, icon: XCircle, gradient: 'from-red-50 to-rose-50', color: 'text-red-600', delay: 0.4 }
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
      )}

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="border-0 shadow-lg">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    placeholder="جستجو در درخواست‌ها..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pr-10"
                  />
                </div>
              </div>
              <div className="flex gap-2 flex-wrap">
                {[
                  { value: 'all', label: 'همه' },
                  { value: 'pending', label: 'در انتظار' },
                  { value: 'under-review', label: 'در حال بررسی' },
                  { value: 'approved', label: 'تایید شده' },
                  { value: 'rejected', label: 'رد شده' }
                ].map((option) => (
                  <Button
                    key={option.value}
                    variant={statusFilter === option.value ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setStatusFilter(option.value)}
                    className={statusFilter === option.value ? 'bg-gradient-to-r from-green-600 to-teal-600' : ''}
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Applications List */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-green-50 to-teal-50 rounded-t-xl">
          <div className="flex items-center justify-between">
            <CardTitle>لیست درخواست‌ها</CardTitle>
            <div className="px-4 py-2 bg-green-600 text-white rounded-full text-sm font-bold shadow-lg">
              {data?.pagination?.total || data?.applications?.length || 0} درخواست
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          {isLoading ? (
            <div className="text-center py-12">در حال بارگذاری...</div>
          ) : !data?.applications || data.applications.length === 0 ? (
            <div className="text-center py-12">
              <FileSearch className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">درخواستی یافت نشد</p>
            </div>
          ) : (
            <div className="space-y-4">
              {data.applications.map((application: any) => (
                <Card key={application._id} className="hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-bold text-lg">{application.firstName} {application.lastName}</h3>
                        <p className="text-sm text-gray-600">{application.email}</p>
                        <p className="text-sm text-gray-500 mt-1">{application.university} - {application.major}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        {getStatusBadge(application.status)}
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => {
                            setSelectedApplication(application)
                            setDetailsModalOpen(true)
                          }}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          {application.status === 'pending' && (
                            <>
                              <Button size="sm" onClick={() => openActionModal(application, 'approve')} className="bg-green-600 hover:bg-green-700">
                                <ThumbsUp className="h-4 w-4" />
                              </Button>
                              <Button size="sm" onClick={() => openActionModal(application, 'reject')} className="bg-red-600 hover:bg-red-700">
                                <ThumbsDown className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Details Modal */}
      <Dialog open={detailsModalOpen} onOpenChange={setDetailsModalOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          {selectedApplication && (
            <>
              <DialogHeader>
                <DialogTitle>جزئیات درخواست</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>نام</Label>
                    <p className="text-sm">{selectedApplication.firstName}</p>
                  </div>
                  <div>
                    <Label>نام خانوادگی</Label>
                    <p className="text-sm">{selectedApplication.lastName}</p>
                  </div>
                  <div>
                    <Label>ایمیل</Label>
                    <p className="text-sm">{selectedApplication.email}</p>
                  </div>
                  <div>
                    <Label>شماره تماس</Label>
                    <p className="text-sm">{selectedApplication.phoneNumber}</p>
                  </div>
                  <div>
                    <Label>دانشگاه</Label>
                    <p className="text-sm">{selectedApplication.university}</p>
                  </div>
                  <div>
                    <Label>رشته تحصیلی</Label>
                    <p className="text-sm">{selectedApplication.major}</p>
                  </div>
                </div>
                {selectedApplication.motivation && (
                  <div>
                    <Label>انگیزه</Label>
                    <p className="text-sm whitespace-pre-wrap">{selectedApplication.motivation}</p>
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDetailsModalOpen(false)}>بستن</Button>
                {selectedApplication.status === 'pending' && (
                  <>
                    <Button onClick={() => openActionModal(selectedApplication, 'approve')} className="bg-green-600 hover:bg-green-700">تایید</Button>
                    <Button onClick={() => openActionModal(selectedApplication, 'reject')} className="bg-red-600 hover:bg-red-700">رد</Button>
                  </>
                )}
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Action Modal */}
      <Dialog open={actionModalOpen} onOpenChange={setActionModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionType === 'approve' && 'تایید درخواست'}
              {actionType === 'reject' && 'رد درخواست'}
              {actionType === 'review' && 'بررسی درخواست'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>یادداشت {actionType === 'reject' ? '(الزامی)' : '(اختیاری)'}</Label>
              <Textarea
                value={reviewNotes}
                onChange={(e) => setReviewNotes(e.target.value)}
                placeholder="یادداشت خود را وارد کنید..."
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setActionModalOpen(false)}>انصراف</Button>
            <Button onClick={handleAction} disabled={reviewMutation.isPending || approveMutation.isPending || rejectMutation.isPending}>
              {reviewMutation.isPending || approveMutation.isPending || rejectMutation.isPending ? 'در حال انجام...' : (
                actionType === 'approve' ? 'تایید' : actionType === 'reject' ? 'رد' : 'بررسی'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
