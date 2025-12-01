import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  FileCheck,
  MessageSquare,
  Eye,
  CheckCircle2,
  XCircle,
  Clock,
  Search
} from 'lucide-react'
import { toast } from '@/components/ui/toast'
import { API_BASE_URL } from '@/config/api'
import DocumentPreview from '@/components/admin/DocumentPreview'
import StatusBadge from '@/components/applicant/StatusBadge'

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

export default function DocumentReview() {
  const queryClient = useQueryClient()
  const [selectedDoc, setSelectedDoc] = useState<PendingDocument | null>(null)
  const [action, setAction] = useState<'verify' | 'reject' | 'request' | null>(null)
  const [notes, setNotes] = useState('')
  const [rejectionReason, setRejectionReason] = useState('')
  const [requestMessage, setRequestMessage] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [page, setPage] = useState(1)

  // Fetch pending documents
  const { data, isLoading, error } = useQuery({
    queryKey: ['pending-documents', page],
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

  // Verify document mutation
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
      queryClient.invalidateQueries({ queryKey: ['pending-documents'] })
      toast.success('مدرک با موفقیت تایید شد')
      handleCloseDialog()
    },
    onError: (error: any) => {
      toast.error(error.message || 'خطا در تایید مدرک')
    },
  })

  // Reject document mutation
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
      queryClient.invalidateQueries({ queryKey: ['pending-documents'] })
      toast.success('مدرک رد شد')
      handleCloseDialog()
    },
    onError: (error: any) => {
      toast.error(error.message || 'خطا در رد مدرک')
    },
  })

  // Request info mutation
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

  const handleActionClick = (doc: PendingDocument, actionType: 'verify' | 'reject' | 'request') => {
    setSelectedDoc(doc)
    setAction(actionType)
  }

  const documents = data?.data || []
  const pagination = data?.pagination

  const filteredDocuments = documents.filter((doc: PendingDocument) =>
    searchQuery
      ? doc.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.applicant.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.applicant.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.applicant.email.toLowerCase().includes(searchQuery.toLowerCase())
      : true
  )

  if (error) {
    return (
      <Alert variant="destructive">
        <XCircle className="h-4 w-4" />
        <AlertDescription>خطا در بارگذاری مدارک</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">بررسی مدارک</h1>
        <p className="text-gray-500 mt-2">تایید یا رد مدارک در انتظار بررسی</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">در انتظار بررسی</p>
                <p className="text-3xl font-bold text-yellow-600">
                  {documents.length}
                </p>
              </div>
              <Clock className="h-12 w-12 text-yellow-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">تایید شده امروز</p>
                <p className="text-3xl font-bold text-green-600">0</p>
              </div>
              <CheckCircle2 className="h-12 w-12 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">رد شده امروز</p>
                <p className="text-3xl font-bold text-red-600">0</p>
              </div>
              <XCircle className="h-12 w-12 text-red-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="جستجو در مدارک، متقاضی..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pr-10"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Documents List */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-gray-600">در حال بارگذاری...</p>
          </div>
        </div>
      ) : filteredDocuments.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <FileCheck className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">
                {searchQuery ? 'مدرکی یافت نشد' : 'هیچ مدرکی در انتظار بررسی نیست'}
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredDocuments.map((doc: PendingDocument) => (
            <Card key={doc._id} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between gap-4">
                  {/* Document Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="font-semibold text-lg truncate">{doc.type}</h3>
                      <StatusBadge status={doc.status} />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-gray-600">متقاضی:</span>{' '}
                        <span className="font-medium">
                          {doc.applicant.firstName} {doc.applicant.lastName}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">ایمیل:</span>{' '}
                        <span className="font-medium">{doc.applicant.email}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">نام فایل:</span>{' '}
                        <span className="font-medium truncate">{doc.fileName}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">تاریخ آپلود:</span>{' '}
                        <span className="font-medium">
                          {new Date(doc.uploadedAt).toLocaleDateString('fa-IR')}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2 shrink-0">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedDoc(doc)}
                      className="whitespace-nowrap"
                    >
                      <Eye className="ml-1 h-4 w-4" />
                      مشاهده
                    </Button>
                    <Button
                      size="sm"
                      variant="default"
                      onClick={() => handleActionClick(doc, 'verify')}
                      className="whitespace-nowrap bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle2 className="ml-1 h-4 w-4" />
                      تایید
                    </Button>
                    <Button
                      size="sm"
                      variant="default"
                      onClick={() => handleActionClick(doc, 'reject')}
                      className="whitespace-nowrap bg-red-600 hover:bg-red-700 text-white"
                    >
                      <XCircle className="ml-1 h-4 w-4" />
                      رد
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleActionClick(doc, 'request')}
                      className="whitespace-nowrap"
                    >
                      <MessageSquare className="ml-1 h-4 w-4" />
                      درخواست
                    </Button>
                  </div>
                </div>

                {/* Preview when selected */}
                {selectedDoc?._id === doc._id && !action && (
                  <div className="mt-4 pt-4 border-t">
                    <DocumentPreview
                      fileId={doc.fileId}
                      fileName={doc.fileName}
                      mimeType={doc.mimeType}
                      onClose={() => setSelectedDoc(null)}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination && pagination.pages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            قبلی
          </Button>
          <span className="text-sm text-gray-600">
            صفحه {page} از {pagination.pages}
          </span>
          <Button
            variant="outline"
            onClick={() => setPage(p => Math.min(pagination.pages, p + 1))}
            disabled={page === pagination.pages}
          >
            بعدی
          </Button>
        </div>
      )}

      {/* Action Dialogs */}
      {/* Verify Dialog */}
      <Dialog open={action === 'verify'} onOpenChange={() => handleCloseDialog()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>تایید مدرک</DialogTitle>
            <DialogDescription>
              آیا از تایید این مدرک اطمینان دارید؟
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label>یادداشت (اختیاری)</Label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="یادداشت‌های بررسی..."
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleCloseDialog}>
              انصراف
            </Button>
            <Button
              onClick={handleVerify}
              disabled={verifyMutation.isPending}
              className="bg-green-600 hover:bg-green-700"
            >
              {verifyMutation.isPending ? 'در حال تایید...' : 'تایید'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={action === 'reject'} onOpenChange={() => handleCloseDialog()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>رد مدرک</DialogTitle>
            <DialogDescription>
              لطفاً دلیل رد مدرک را مشخص کنید
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label>دلیل رد *</Label>
              <Textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="دلیل رد مدرک..."
                rows={3}
                required
              />
            </div>
            <div>
              <Label>یادداشت (اختیاری)</Label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="یادداشت‌های بررسی..."
                rows={2}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleCloseDialog}>
              انصراف
            </Button>
            <Button
              variant="default"
              onClick={handleReject}
              disabled={rejectMutation.isPending || !rejectionReason.trim()}
              className="bg-red-600 hover:bg-red-700 text-white"
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
            <DialogTitle>درخواست اطلاعات تکمیلی</DialogTitle>
            <DialogDescription>
              پیام خود را برای متقاضی وارد کنید
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label>پیام *</Label>
              <Textarea
                value={requestMessage}
                onChange={(e) => setRequestMessage(e.target.value)}
                placeholder="لطفاً اطلاعات بیشتری در مورد... ارائه دهید"
                rows={4}
                required
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleCloseDialog}>
              انصراف
            </Button>
            <Button
              onClick={handleRequestInfo}
              disabled={requestInfoMutation.isPending || !requestMessage.trim()}
            >
              {requestInfoMutation.isPending ? 'در حال ارسال...' : 'ارسال درخواست'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
