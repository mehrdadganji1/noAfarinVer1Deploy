import { useState } from 'react'
import { motion } from 'framer-motion'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  FileText,
  FileCheck,
  FileX,
  Clock,
  Search,
  Filter,
  Download,
  Eye,
  CheckCircle2,
  XCircle,
  MessageSquare,
  Calendar,
  User,
  Mail,
  FileType,
  TrendingUp,
} from 'lucide-react'
import { toast } from '@/components/ui/toast'
import { API_BASE_URL } from '@/config/api'
import { PageSkeleton } from '@/components/ui/page-skeleton'
import DocumentPreview from '@/components/admin/DocumentPreview'

interface PendingDocument {
  _id: string
  type: string
  fileName: string
  fileId: string
  fileSize?: number
  mimeType?: string
  status: string
  uploadedAt: string
  applicationId: string
  applicant: {
    _id: string
    email: string
    firstName: string
    lastName: string
  }
}

export default function Documents() {
  const queryClient = useQueryClient()
  const [selectedDoc, setSelectedDoc] = useState<PendingDocument | null>(null)
  const [action, setAction] = useState<'verify' | 'reject' | 'request' | 'preview' | null>(null)
  const [notes, setNotes] = useState('')
  const [rejectionReason, setRejectionReason] = useState('')
  const [requestMessage, setRequestMessage] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [page, setPage] = useState(1)

  const { data, isLoading } = useQuery({
    queryKey: ['admin-documents', page, statusFilter],
    queryFn: async () => {
      const token = localStorage.getItem('token')
      const res = await fetch(
        `${API_BASE_URL}/api/applications/documents/pending?page=${page}&limit=20`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      if (!res.ok) throw new Error('Failed to fetch documents')
      return res.json()
    },
  })

  const verifyMutation = useMutation({
    mutationFn: async ({ applicationId, documentId, notes }: any) => {
      const token = localStorage.getItem('token')
      const res = await fetch(
        `${API_BASE_URL}/api/applications/${applicationId}/documents/${documentId}/verify`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ notes }),
        }
      )
      if (!res.ok) throw new Error('Failed to verify document')
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-documents'] })
      toast.success('مدرک با موفقیت تایید شد')
      handleCloseDialog()
    },
    onError: (error: any) => {
      toast.error(error.message || 'خطا در تایید مدرک')
    },
  })

  const rejectMutation = useMutation({
    mutationFn: async ({ applicationId, documentId, rejectionReason, notes }: any) => {
      const token = localStorage.getItem('token')
      const res = await fetch(
        `${API_BASE_URL}/api/applications/${applicationId}/documents/${documentId}/reject`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ rejectionReason, notes }),
        }
      )
      if (!res.ok) throw new Error('Failed to reject document')
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-documents'] })
      toast.success('مدرک رد شد')
      handleCloseDialog()
    },
    onError: (error: any) => {
      toast.error(error.message || 'خطا در رد مدرک')
    },
  })

  const requestInfoMutation = useMutation({
    mutationFn: async ({ applicationId, documentId, message }: any) => {
      const token = localStorage.getItem('token')
      const res = await fetch(
        `${API_BASE_URL}/api/applications/${applicationId}/documents/${documentId}/request-info`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ message }),
        }
      )
      if (!res.ok) throw new Error('Failed to request info')
      return res.json()
    },
    onSuccess: () => {
      toast.success('درخواست اطلاعات ارسال شد')
      handleCloseDialog()
    },
    onError: (error: any) => {
      toast.error(error.message || 'خطا در ارسال درخواست')
    },
  })

  const handleVerify = () => {
    if (!selectedDoc) return
    verifyMutation.mutate({
      applicationId: selectedDoc.applicationId,
      documentId: selectedDoc._id,
      notes,
    })
  }

  const handleReject = () => {
    if (!selectedDoc || !rejectionReason.trim()) {
      toast.error('لطفاً دلیل رد را وارد کنید')
      return
    }
    rejectMutation.mutate({
      applicationId: selectedDoc.applicationId,
      documentId: selectedDoc._id,
      rejectionReason,
      notes,
    })
  }

  const handleRequestInfo = () => {
    if (!selectedDoc || !requestMessage.trim()) {
      toast.error('لطفاً پیام خود را وارد کنید')
      return
    }
    requestInfoMutation.mutate({
      applicationId: selectedDoc.applicationId,
      documentId: selectedDoc._id,
      message: requestMessage,
    })
  }

  const handleCloseDialog = () => {
    setSelectedDoc(null)
    setAction(null)
    setNotes('')
    setRejectionReason('')
    setRequestMessage('')
  }

  const handleActionClick = (doc: PendingDocument, actionType: 'verify' | 'reject' | 'request' | 'preview') => {
    setSelectedDoc(doc)
    setAction(actionType)
  }

  const documents = data?.data || []
  const pagination = data?.pagination

  const filteredDocuments = documents.filter((doc: PendingDocument) => {
    const matchesSearch = searchQuery
      ? doc.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.applicant.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.applicant.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.applicant.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.type.toLowerCase().includes(searchQuery.toLowerCase())
      : true

    const matchesStatus = statusFilter === 'all' || doc.status === statusFilter
    const matchesType = typeFilter === 'all' || doc.type === typeFilter

    return matchesSearch && matchesStatus && matchesType
  })

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { label: string; className: string }> = {
      pending: { label: 'در انتظار', className: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
      verified: { label: 'تایید شده', className: 'bg-green-100 text-green-800 border-green-200' },
      rejected: { label: 'رد شده', className: 'bg-red-100 text-red-800 border-red-200' },
      'info-requested': { label: 'نیاز به اطلاعات', className: 'bg-blue-100 text-blue-800 border-blue-200' },
    }
    const config = statusConfig[status] || statusConfig.pending
    return <Badge className={config.className}>{config.label}</Badge>
  }

  if (isLoading) {
    return <PageSkeleton />
  }

  return (
    <div className="space-y-6 p-6">
      {/* Modern Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-8 shadow-2xl"
      >
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="p-3 bg-white/20 backdrop-blur-sm rounded-xl"
              >
                <FileCheck className="h-8 w-8 text-white" />
              </motion.div>
              <div>
                <h1 className="text-3xl font-bold text-white mb-1">مدیریت مدارک</h1>
                <p className="text-indigo-100">بررسی و تایید مدارک متقاضیان</p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-3">
              <Button
                variant="outline"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm"
              >
                <Download className="ml-2 h-4 w-4" />
                دانلود گزارش
              </Button>
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -ml-24 -mb-24"></div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          {
            title: 'در انتظار بررسی',
            value: documents.length,
            icon: Clock,
            gradient: 'from-yellow-50 to-orange-50',
            iconBg: 'bg-yellow-100',
            iconColor: 'text-yellow-600',
            textColor: 'text-yellow-600',
            badge: 'نیاز به اقدام',
            delay: 0.1
          },
          {
            title: 'تایید شده',
            value: 0,
            icon: CheckCircle2,
            gradient: 'from-green-50 to-emerald-50',
            iconBg: 'bg-green-100',
            iconColor: 'text-green-600',
            textColor: 'text-green-600',
            badge: 'امروز',
            delay: 0.2
          },
          {
            title: 'رد شده',
            value: 0,
            icon: FileX,
            gradient: 'from-red-50 to-rose-50',
            iconBg: 'bg-red-100',
            iconColor: 'text-red-600',
            textColor: 'text-red-600',
            badge: 'امروز',
            delay: 0.3
          },
          {
            title: 'کل مدارک',
            value: documents.length,
            icon: FileText,
            gradient: 'from-blue-50 to-cyan-50',
            iconBg: 'bg-blue-100',
            iconColor: 'text-blue-600',
            textColor: 'text-blue-600',
            badge: 'این ماه',
            delay: 0.4
          }
        ].map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: stat.delay }}
          >
            <Card className={`border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br ${stat.gradient}`}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                    <p className={`text-3xl font-bold ${stat.textColor}`}>{stat.value}</p>
                    <div className="flex items-center gap-1 mt-2">
                      <TrendingUp className={`h-3 w-3 ${stat.textColor}`} />
                      <span className={`text-xs ${stat.textColor}`}>{stat.badge}</span>
                    </div>
                  </div>
                  <div className={`p-4 ${stat.iconBg} rounded-2xl`}>
                    <stat.icon className={`h-8 w-8 ${stat.iconColor}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-gray-600" />
              <h2 className="text-lg font-semibold">فیلتر و جستجو</h2>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="جستجو در مدارک، متقاضی، ایمیل..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pr-10 border-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="border-gray-200">
                  <SelectValue placeholder="وضعیت" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">همه وضعیت‌ها</SelectItem>
                  <SelectItem value="pending">در انتظار</SelectItem>
                  <SelectItem value="verified">تایید شده</SelectItem>
                  <SelectItem value="rejected">رد شده</SelectItem>
                  <SelectItem value="info-requested">نیاز به اطلاعات</SelectItem>
                </SelectContent>
              </Select>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="border-gray-200">
                  <SelectValue placeholder="نوع مدرک" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">همه انواع</SelectItem>
                  <SelectItem value="resume">رزومه</SelectItem>
                  <SelectItem value="id-card">کارت ملی</SelectItem>
                  <SelectItem value="certificate">گواهینامه</SelectItem>
                  <SelectItem value="transcript">ریز نمرات</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Documents List */}
      {filteredDocuments.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="border-0 shadow-lg">
            <CardContent className="pt-6">
              <div className="text-center py-16">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.7, type: "spring" }}
                  className="inline-flex p-6 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-full mb-4"
                >
                  <FileCheck className="h-16 w-16 text-indigo-400" />
                </motion.div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {searchQuery ? 'مدرکی یافت نشد' : 'هیچ مدرکی در انتظار بررسی نیست'}
                </h3>
                <p className="text-gray-500">
                  {searchQuery ? 'لطفاً عبارت جستجوی دیگری امتحان کنید' : 'همه مدارک بررسی شده‌اند'}
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ) : (
        <div className="space-y-4">
          {filteredDocuments.map((doc: PendingDocument, index: number) => (
            <motion.div
              key={doc._id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + index * 0.05 }}
            >
              <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
                <CardContent className="pt-6">
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Document Info */}
                    <div className="flex-1 space-y-4">
                      {/* Header */}
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="p-3 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl group-hover:scale-110 transition-transform">
                            <FileType className="h-6 w-6 text-indigo-600" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">{doc.type}</h3>
                            {getStatusBadge(doc.status)}
                          </div>
                        </div>
                      </div>

                      {/* Details Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <User className="h-4 w-4 text-gray-400" />
                          <div>
                            <p className="text-xs text-gray-500">متقاضی</p>
                            <p className="text-sm font-medium text-gray-900">
                              {doc.applicant.firstName} {doc.applicant.lastName}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <Mail className="h-4 w-4 text-gray-400" />
                          <div>
                            <p className="text-xs text-gray-500">ایمیل</p>
                            <p className="text-sm font-medium text-gray-900">{doc.applicant.email}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <FileText className="h-4 w-4 text-gray-400" />
                          <div>
                            <p className="text-xs text-gray-500">نام فایل</p>
                            <p className="text-sm font-medium text-gray-900 truncate">{doc.fileName}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <div>
                            <p className="text-xs text-gray-500">تاریخ آپلود</p>
                            <p className="text-sm font-medium text-gray-900">
                              {new Date(doc.uploadedAt).toLocaleDateString('fa-IR')}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex lg:flex-col gap-2 lg:w-48">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleActionClick(doc, 'preview')}
                        className="flex-1 lg:w-full border-indigo-200 text-indigo-600 hover:bg-indigo-50"
                      >
                        <Eye className="ml-2 h-4 w-4" />
                        مشاهده
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleActionClick(doc, 'verify')}
                        className="flex-1 lg:w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
                      >
                        <CheckCircle2 className="ml-2 h-4 w-4" />
                        تایید
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleActionClick(doc, 'reject')}
                        className="flex-1 lg:w-full bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white"
                      >
                        <XCircle className="ml-2 h-4 w-4" />
                        رد
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleActionClick(doc, 'request')}
                        className="flex-1 lg:w-full border-blue-200 text-blue-600 hover:bg-blue-50"
                      >
                        <MessageSquare className="ml-2 h-4 w-4" />
                        درخواست
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination && pagination.pages > 1 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Card className="border-0 shadow-lg">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <Button
                  variant="outline"
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="border-gray-200"
                >
                  صفحه قبل
                </Button>
                <span className="text-sm text-gray-600 font-medium">
                  صفحه {page} از {pagination.pages}
                </span>
                <Button
                  variant="outline"
                  onClick={() => setPage(p => Math.min(pagination.pages, p + 1))}
                  disabled={page === pagination.pages}
                  className="border-gray-200"
                >
                  صفحه بعد
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Preview Dialog */}
      <Dialog open={action === 'preview'} onOpenChange={() => handleCloseDialog()}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl">پیش‌نمایش مدرک</DialogTitle>
            <DialogDescription>
              {selectedDoc?.fileName}
            </DialogDescription>
          </DialogHeader>
          {selectedDoc && (
            <div className="mt-4">
              <DocumentPreview
                fileId={selectedDoc.fileId}
                fileName={selectedDoc.fileName}
                mimeType={selectedDoc.mimeType}
                onClose={() => handleCloseDialog()}
              />
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={handleCloseDialog}>
              بستن
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Verify Dialog */}
      <Dialog open={action === 'verify'} onOpenChange={() => handleCloseDialog()}>
        <DialogContent>
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle2 className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <DialogTitle className="text-xl">تایید مدرک</DialogTitle>
                <DialogDescription>
                  آیا از تایید این مدرک اطمینان دارید؟
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          {selectedDoc && (
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">نوع مدرک:</span>
                  <span className="font-medium">{selectedDoc.type}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">متقاضی:</span>
                  <span className="font-medium">
                    {selectedDoc.applicant.firstName} {selectedDoc.applicant.lastName}
                  </span>
                </div>
              </div>

              <div>
                <Label>یادداشت (اختیاری)</Label>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="یادداشت‌های بررسی..."
                  rows={3}
                  className="mt-2"
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={handleCloseDialog}>
              انصراف
            </Button>
            <Button
              onClick={handleVerify}
              disabled={verifyMutation.isPending}
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
            >
              {verifyMutation.isPending ? 'در حال تایید...' : 'تایید مدرک'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={action === 'reject'} onOpenChange={() => handleCloseDialog()}>
        <DialogContent>
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-red-100 rounded-lg">
                <XCircle className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <DialogTitle className="text-xl">رد مدرک</DialogTitle>
                <DialogDescription>
                  لطفاً دلیل رد مدرک را مشخص کنید
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          {selectedDoc && (
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">نوع مدرک:</span>
                  <span className="font-medium">{selectedDoc.type}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">متقاضی:</span>
                  <span className="font-medium">
                    {selectedDoc.applicant.firstName} {selectedDoc.applicant.lastName}
                  </span>
                </div>
              </div>

              <div>
                <Label>دلیل رد *</Label>
                <Textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="دلیل رد مدرک..."
                  rows={3}
                  required
                  className="mt-2"
                />
              </div>
              <div>
                <Label>یادداشت (اختیاری)</Label>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="یادداشت‌های بررسی..."
                  rows={2}
                  className="mt-2"
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={handleCloseDialog}>
              انصراف
            </Button>
            <Button
              onClick={handleReject}
              disabled={rejectMutation.isPending || !rejectionReason.trim()}
              className="bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white"
            >
              {rejectMutation.isPending ? 'در حال رد...' : 'رد مدرک'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Request Info Dialog */}
      <Dialog open={action === 'request'} onOpenChange={() => handleCloseDialog()}>
        <DialogContent>
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-100 rounded-lg">
                <MessageSquare className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <DialogTitle className="text-xl">درخواست اطلاعات تکمیلی</DialogTitle>
                <DialogDescription>
                  پیام خود را برای متقاضی وارد کنید
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          {selectedDoc && (
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">نوع مدرک:</span>
                  <span className="font-medium">{selectedDoc.type}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">متقاضی:</span>
                  <span className="font-medium">
                    {selectedDoc.applicant.firstName} {selectedDoc.applicant.lastName}
                  </span>
                </div>
              </div>

              <div>
                <Label>پیام *</Label>
                <Textarea
                  value={requestMessage}
                  onChange={(e) => setRequestMessage(e.target.value)}
                  placeholder="لطفاً اطلاعات بیشتری در مورد... ارائه دهید"
                  rows={4}
                  required
                  className="mt-2"
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={handleCloseDialog}>
              انصراف
            </Button>
            <Button
              onClick={handleRequestInfo}
              disabled={requestInfoMutation.isPending || !requestMessage.trim()}
              className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
            >
              {requestInfoMutation.isPending ? 'در حال ارسال...' : 'ارسال درخواست'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
