import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { 
  X, 
  User, 
  Mail, 
  Phone, 
  GraduationCap, 
  Calendar,
  CheckCircle,
  XCircle,
  FileText,
  Award,
  MapPin,
  Edit,
  RefreshCw
} from 'lucide-react'
import EditApplicationModal from './EditApplicationModal'
import ChangeStatusModal from './ChangeStatusModal'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Application } from '@/pages/director/Applications'
import { toast } from '@/components/ui/toast'
import api from '@/lib/api'
import { format } from 'date-fns'
import { faIR } from 'date-fns/locale'

interface ModalProps {
  application: Application
  onClose: () => void
}

export default function ApplicationDetailsModal({ application, onClose }: ModalProps) {
  const queryClient = useQueryClient()
  const [reviewNotes, setReviewNotes] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showStatusModal, setShowStatusModal] = useState(false)

  // Format date safely
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'تاریخ نامشخص'
    try {
      const date = new Date(dateString)
      if (isNaN(date.getTime())) return 'تاریخ نامعتبر'
      return format(date, 'dd MMMM yyyy', { locale: faIR })
    } catch {
      return 'تاریخ نامعتبر'
    }
  }

  // Approve mutation
  const approveMutation = useMutation({
    mutationFn: async () => {
      const response = await api.patch(`/applications/${application._id}/approve`, {
        reviewNotes: reviewNotes,
      })
      return response.data
    },
    onSuccess: () => {
      toast({
        title: 'موفقیت',
        description: 'درخواست با موفقیت تایید شد',
      })
      queryClient.invalidateQueries({ queryKey: ['director-applications'] })
      queryClient.invalidateQueries({ queryKey: ['applications-stats'] })
      onClose()
    },
    onError: (error: any) => {
      toast({
        title: 'خطا',
        description: error.response?.data?.error || 'خطا در تایید درخواست',
        variant: 'destructive',
      })
    },
  })

  // Reject mutation
  const rejectMutation = useMutation({
    mutationFn: async () => {
      const response = await api.patch(`/applications/${application._id}/reject`, {
        reviewNotes: reviewNotes,
      })
      return response.data
    },
    onSuccess: () => {
      toast({
        title: 'موفقیت',
        description: 'درخواست رد شد',
      })
      queryClient.invalidateQueries({ queryKey: ['director-applications'] })
      queryClient.invalidateQueries({ queryKey: ['applications-stats'] })
      onClose()
    },
    onError: (error: any) => {
      toast({
        title: 'خطا',
        description: error.response?.data?.error || 'خطا در رد درخواست',
        variant: 'destructive',
      })
    },
  })

  const handleApprove = () => {
    if (!reviewNotes.trim()) {
      toast({
        title: 'هشدار',
        description: 'لطفاً یادداشت بررسی را وارد کنید',
        variant: 'destructive',
      })
      return
    }
    setIsProcessing(true)
    approveMutation.mutate()
  }

  const handleReject = () => {
    if (!reviewNotes.trim()) {
      toast({
        title: 'هشدار',
        description: 'لطفاً دلیل رد درخواست را وارد کنید',
        variant: 'destructive',
      })
      return
    }
    setIsProcessing(true)
    rejectMutation.mutate()
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-4 flex-1">
                <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-2xl font-bold flex-shrink-0">
                  {(application.firstName || application.userId?.firstName || 'N')[0]}
                  {(application.lastName || application.userId?.lastName || 'A')[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-2xl font-bold truncate">
                    {application.firstName || application.userId?.firstName || 'نامشخص'}{' '}
                    {application.lastName || application.userId?.lastName || 'نامشخص'}
                  </h2>
                  <p className="text-blue-100 text-sm truncate">{application.email || application.userId?.email || 'نامشخص'}</p>
                  
                  {/* Action Buttons - Below name */}
                  <div className="flex items-center gap-2 mt-3">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        setShowEditModal(true)
                      }}
                      className="px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-lg transition-colors flex items-center gap-2 text-sm"
                    >
                      <Edit className="h-4 w-4" />
                      <span>ویرایش</span>
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        setShowStatusModal(true)
                      }}
                      className="px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-lg transition-colors flex items-center gap-2 text-sm"
                    >
                      <RefreshCw className="h-4 w-4" />
                      <span>تغییر وضعیت</span>
                    </button>
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-full transition-colors flex-shrink-0"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Personal Info */}
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                    <User className="h-5 w-5 text-blue-600" />
                    اطلاعات شخصی
                  </h3>
                  <div className="space-y-3">
                    <InfoRow icon={Mail} label="ایمیل" value={application.email || 'نامشخص'} />
                    <InfoRow icon={Phone} label="تلفن" value={application.phoneNumber || 'نامشخص'} />
                    <InfoRow icon={Calendar} label="تاریخ ثبت" value={formatDate(application.submittedAt)} />
                  </div>
                </CardContent>
              </Card>

              {/* Academic Info */}
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                    <GraduationCap className="h-5 w-5 text-purple-600" />
                    اطلاعات تحصیلی
                  </h3>
                  <div className="space-y-3">
                    <InfoRow icon={MapPin} label="دانشگاه" value={application.university} />
                    <InfoRow icon={Award} label="رشته" value={application.major} />
                    <InfoRow icon={FileText} label="مقطع" value={application.degree} />
                    <InfoRow icon={FileText} label="شماره دانشجویی" value={application.studentId} />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Review Notes */}
            {application.status !== 'pending' && application.reviewNotes && (
              <Card className="mt-6">
                <CardContent className="p-4">
                  <h3 className="font-bold text-lg mb-2">یادداشت بررسی</h3>
                  <p className="text-gray-700">{application.reviewNotes}</p>
                  {application.reviewedAt && (
                    <p className="text-sm text-gray-500 mt-2">
                      بررسی شده در: {formatDate(application.reviewedAt)}
                    </p>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Action Section - Only for pending */}
            {application.status === 'pending' && (
              <Card className="mt-6 border-2 border-blue-200">
                <CardContent className="p-4">
                  <h3 className="font-bold text-lg mb-4">بررسی و تصمیم‌گیری</h3>
                  <textarea
                    value={reviewNotes}
                    onChange={(e) => setReviewNotes(e.target.value)}
                    placeholder="یادداشت بررسی خود را وارد کنید..."
                    className="w-full p-3 border-2 rounded-lg focus:border-blue-300 focus:outline-none min-h-[100px]"
                  />
                  <div className="flex gap-3 mt-4">
                    <Button
                      type="button"
                      onClick={handleApprove}
                      disabled={isProcessing}
                      className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                    >
                      <CheckCircle className="h-5 w-5 ml-2" />
                      تایید درخواست
                    </Button>
                    <Button
                      type="button"
                      onClick={handleReject}
                      disabled={isProcessing}
                      className="flex-1 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700"
                    >
                      <XCircle className="h-5 w-5 ml-2" />
                      رد درخواست
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </motion.div>

      </div>

      {/* Edit Modal - Outside main modal */}
      {showEditModal && (
        <EditApplicationModal
          application={application}
          onClose={() => {
            setShowEditModal(false)
            onClose() // Close parent modal too
          }}
        />
      )}

      {/* Change Status Modal - Outside main modal */}
      {showStatusModal && (
        <ChangeStatusModal
          application={application}
          onClose={() => {
            setShowStatusModal(false)
            onClose() // Close parent modal too
          }}
        />
      )}
    </AnimatePresence>
  )
}

function InfoRow({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <Icon className="h-5 w-5 text-gray-400 mt-0.5" />
      <div className="flex-1">
        <p className="text-xs text-gray-500">{label}</p>
        <p className="text-sm font-medium text-gray-900">{value}</p>
      </div>
    </div>
  )
}
