import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { X, CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Application } from '@/pages/director/Applications'
import { toast } from '@/components/ui/toast'
import api from '@/lib/api'

interface ChangeStatusModalProps {
  application: Application
  onClose: () => void
}

type StatusType = 'pending' | 'approved' | 'rejected' | 'under-review'

export default function ChangeStatusModal({ application, onClose }: ChangeStatusModalProps) {
  const queryClient = useQueryClient()
  const [selectedStatus, setSelectedStatus] = useState<StatusType>(application.status)
  const [reviewNotes, setReviewNotes] = useState(application.reviewNotes || '')

  const statusOptions = [
    {
      value: 'pending' as StatusType,
      label: 'در انتظار بررسی',
      icon: Clock,
      color: 'yellow',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-500',
      textColor: 'text-yellow-700',
      description: 'درخواست در صف بررسی قرار دارد'
    },
    {
      value: 'under-review' as StatusType,
      label: 'در حال بررسی',
      icon: AlertCircle,
      color: 'blue',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-500',
      textColor: 'text-blue-700',
      description: 'درخواست در حال بررسی توسط تیم است'
    },
    {
      value: 'approved' as StatusType,
      label: 'تایید شده',
      icon: CheckCircle,
      color: 'green',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-500',
      textColor: 'text-green-700',
      description: 'درخواست تایید و پذیرفته شده است'
    },
    {
      value: 'rejected' as StatusType,
      label: 'رد شده',
      icon: XCircle,
      color: 'red',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-500',
      textColor: 'text-red-700',
      description: 'درخواست رد شده است'
    },
  ]

  const changeStatusMutation = useMutation({
    mutationFn: async () => {
      const response = await api.patch(`/applications/${application._id}/status`, {
        status: selectedStatus,
        reviewNotes: reviewNotes
      })
      return response.data
    },
    onSuccess: () => {
      toast({
        title: 'موفقیت',
        description: 'وضعیت درخواست با موفقیت تغییر کرد',
      })
      queryClient.invalidateQueries({ queryKey: ['director-applications'] })
      queryClient.invalidateQueries({ queryKey: ['applications-stats'] })
      onClose()
    },
    onError: (error: any) => {
      toast({
        title: 'خطا',
        description: error.response?.data?.error || 'خطا در تغییر وضعیت',
        variant: 'destructive',
      })
    },
  })

  const handleSubmit = () => {
    if (!reviewNotes.trim() && selectedStatus !== application.status) {
      toast({
        title: 'هشدار',
        description: 'لطفاً دلیل تغییر وضعیت را وارد کنید',
        variant: 'destructive',
      })
      return
    }
    changeStatusMutation.mutate()
  }

  const currentStatusOption = statusOptions.find(opt => opt.value === application.status)

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 backdrop-blur-sm rounded-xl">
                  <AlertCircle className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">تغییر وضعیت درخواست</h2>
                  <p className="text-blue-100 text-sm">
                    {application.firstName} {application.lastName}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
            {/* Current Status */}
            <Card className="mb-6 border-2 border-gray-200">
              <CardContent className="p-4">
                <h3 className="font-bold text-sm text-gray-600 mb-3">وضعیت فعلی</h3>
                <div className={`flex items-center gap-3 p-3 rounded-lg ${currentStatusOption?.bgColor}`}>
                  {currentStatusOption && (
                    <>
                      <currentStatusOption.icon className={`h-6 w-6 ${currentStatusOption.textColor}`} />
                      <div>
                        <p className={`font-bold ${currentStatusOption.textColor}`}>
                          {currentStatusOption.label}
                        </p>
                        <p className="text-xs text-gray-600">{currentStatusOption.description}</p>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Status Options */}
            <div className="mb-6">
              <h3 className="font-bold text-lg mb-4">انتخاب وضعیت جدید</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {statusOptions.map((option) => {
                  const Icon = option.icon
                  const isSelected = selectedStatus === option.value
                  const isCurrent = application.status === option.value

                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setSelectedStatus(option.value)}
                      disabled={isCurrent}
                      className={`relative p-4 rounded-xl border-2 transition-all text-right ${
                        isSelected
                          ? `${option.borderColor} ${option.bgColor} shadow-lg scale-105`
                          : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                      } ${isCurrent ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                    >
                      {isCurrent && (
                        <div className="absolute top-2 left-2 bg-gray-500 text-white text-xs px-2 py-1 rounded-full">
                          فعلی
                        </div>
                      )}
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg ${option.bgColor}`}>
                          <Icon className={`h-5 w-5 ${option.textColor}`} />
                        </div>
                        <div className="flex-1">
                          <p className={`font-bold ${isSelected ? option.textColor : 'text-gray-900'}`}>
                            {option.label}
                          </p>
                          <p className="text-xs text-gray-600 mt-1">{option.description}</p>
                        </div>
                      </div>
                      {isSelected && (
                        <div className="absolute top-2 right-2">
                          <CheckCircle className={`h-5 w-5 ${option.textColor}`} />
                        </div>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Review Notes */}
            <Card className="border-2 border-blue-200">
              <CardContent className="p-4">
                <h3 className="font-bold text-lg mb-3">یادداشت تغییر وضعیت</h3>
                <textarea
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  placeholder="دلیل تغییر وضعیت را توضیح دهید..."
                  className="w-full p-3 border-2 rounded-lg focus:border-blue-300 focus:outline-none min-h-[120px]"
                />
                <p className="text-xs text-gray-500 mt-2">
                  این یادداشت در تاریخچه درخواست ثبت می‌شود
                </p>
              </CardContent>
            </Card>

            {/* Warning */}
            {selectedStatus !== application.status && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-4 bg-yellow-50 border-2 border-yellow-200 rounded-lg"
              >
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-yellow-800 text-sm">توجه</p>
                    <p className="text-xs text-yellow-700 mt-1">
                      با تغییر وضعیت، اطلاعیه‌ای به متقاضی ارسال می‌شود و این تغییر در تاریخچه ثبت خواهد شد.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Actions */}
            <div className="flex gap-3 mt-6">
              <Button
                onClick={handleSubmit}
                disabled={changeStatusMutation.isPending || selectedStatus === application.status}
                className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
              >
                {changeStatusMutation.isPending ? 'در حال ذخیره...' : 'تایید و ذخیره'}
              </Button>
              <Button
                onClick={onClose}
                variant="outline"
                className="flex-1"
              >
                انصراف
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
