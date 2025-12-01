import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog'
import { Button } from './ui/button'
import { CheckCircle, XCircle, DollarSign, Calendar, Clock, FileText, Shield } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import api from '@/lib/api'
import { toast } from './ui/toast'

interface Funding {
  _id: string
  teamId: string
  amount: number
  type: 'loan' | 'grant' | 'seed_funding'
  terms?: string
  status: 'pending' | 'under_review' | 'approved' | 'rejected' | 'disbursed'
  createdAt: string
  applicationDate?: string
  approvalDate?: string
  disbursementDate?: string
  reviewerId?: string
  reviewNotes?: string
  documents?: string[]
}

interface FundingDetailModalProps {
  funding: Funding
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function FundingDetailModal({ funding, open, onOpenChange }: FundingDetailModalProps) {
  const queryClient = useQueryClient()
  const { user } = useAuthStore()
  const isAdmin = user?.role.includes('admin')

  const approveMutation = useMutation({
    mutationFn: async () => {
      const response = await api.put(`/fundings/${funding._id}/status`, {
        status: 'approved',
        reviewNotes: 'تایید شده'
      })
      return response.data
    },
    onSuccess: () => {
      toast.success('تسهیلات تایید شد')
      queryClient.invalidateQueries({ queryKey: ['fundings'] })
      onOpenChange(false)
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'خطا در تایید')
    },
  })

  const rejectMutation = useMutation({
    mutationFn: async () => {
      const response = await api.put(`/fundings/${funding._id}/status`, {
        status: 'rejected',
        reviewNotes: 'رد شده'
      })
      return response.data
    },
    onSuccess: () => {
      toast.success('تسهیلات رد شد')
      queryClient.invalidateQueries({ queryKey: ['fundings'] })
      onOpenChange(false)
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'خطا در رد کردن')
    },
  })

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('fa-IR').format(amount) + ' تومان'
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fa-IR')
  }

  const getStatusConfig = () => {
    const configs = {
      pending: { label: 'در انتظار بررسی', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      under_review: { label: 'در حال بررسی', color: 'bg-blue-100 text-blue-800', icon: Clock },
      approved: { label: 'تایید شده', color: 'bg-green-100 text-green-800', icon: CheckCircle },
      rejected: { label: 'رد شده', color: 'bg-red-100 text-red-800', icon: XCircle },
      disbursed: { label: 'پرداخت شده', color: 'bg-purple-100 text-purple-800', icon: CheckCircle },
    }
    return configs[funding.status] || configs.pending
  }

  const getTypeLabel = () => {
    const types = {
      loan: 'وام',
      grant: 'کمک بلاعوض',
      seed_funding: 'سرمایه اولیه',
    }
    return types[funding.type] || funding.type
  }

  const statusConfig = getStatusConfig()
  const StatusIcon = statusConfig.icon

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl">جزئیات تسهیلات</DialogTitle>
            <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm ${statusConfig.color}`}>
              <StatusIcon className="h-4 w-4" />
              {statusConfig.label}
            </span>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Amount Card */}
          <div className="bg-gradient-to-br from-primary to-primary/80 text-white p-6 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">مبلغ درخواستی</p>
                <h2 className="text-4xl font-bold mt-2">{formatAmount(funding.amount)}</h2>
                <p className="text-sm opacity-90 mt-2">{getTypeLabel()}</p>
              </div>
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <DollarSign className="h-8 w-8" />
              </div>
            </div>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="border rounded-lg p-4">
              <div className="flex items-center gap-2 text-gray-600 mb-1">
                <Calendar className="h-4 w-4" />
                <span className="text-sm">تاریخ درخواست</span>
              </div>
              <p className="text-lg font-medium">{formatDate(funding.createdAt)}</p>
            </div>

            <div className="border rounded-lg p-4">
              <div className="flex items-center gap-2 text-gray-600 mb-1">
                <FileText className="h-4 w-4" />
                <span className="text-sm">شناسه تیم</span>
              </div>
              <p className="text-sm font-mono break-all">{funding.teamId}</p>
            </div>
          </div>

          {/* Terms */}
          {funding.terms && (
            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-2 flex items-center gap-2">
                <FileText className="h-4 w-4" />
                شرایط و جزئیات
              </h3>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">{funding.terms}</p>
            </div>
          )}

          {/* Documents */}
          {funding.documents && funding.documents.length > 0 && (
            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-2 flex items-center gap-2">
                <Shield className="h-4 w-4" />
                مدارک پیوست
              </h3>
              <div className="flex flex-wrap gap-2">
                {funding.documents.map((_, idx) => (
                  <span key={idx} className="text-sm px-3 py-1 bg-gray-100 rounded">
                    سند {idx + 1}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Approval/Rejection Info */}
          {funding.approvalDate && (
            <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
              <p className="text-green-800">
                ✓ این تسهیلات در تاریخ {formatDate(funding.approvalDate)} تایید شده است
              </p>
              {funding.reviewNotes && (
                <p className="text-green-700 mt-2 text-sm">
                  یادداشت: {funding.reviewNotes}
                </p>
              )}
            </div>
          )}

          {funding.status === 'rejected' && (
            <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
              <p className="text-red-800 font-medium">
                ✗ این تسهیلات رد شده است
              </p>
              {funding.reviewNotes && (
                <p className="text-red-700 mt-2 text-sm">
                  دلیل: {funding.reviewNotes}
                </p>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-between items-center pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              بستن
            </Button>

            {isAdmin && funding.status === 'pending' && (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="text-red-600 border-red-600 hover:bg-red-50"
                  onClick={() => rejectMutation.mutate()}
                  disabled={rejectMutation.isPending}
                >
                  <XCircle className="ml-2 h-4 w-4" />
                  رد درخواست
                </Button>
                <Button
                  className="bg-green-600 hover:bg-green-700"
                  onClick={() => approveMutation.mutate()}
                  disabled={approveMutation.isPending}
                >
                  <CheckCircle className="ml-2 h-4 w-4" />
                  تایید درخواست
                </Button>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
