import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertTriangle,
  Sparkles,
  ArrowLeft,
  Phone,
  Users
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { 
  AACOApplication, 
  AACOApplicationStatus,
  getStatusLabel,
  getStatusColor
} from '@/hooks/useAACOAdminApplications'
import { cn } from '@/lib/utils'

type ActionType = 'approve' | 'reject' | 'review' | 'resubmit'

interface AACOStatusChangeModalProps {
  application: AACOApplication | null
  action: ActionType | null
  open: boolean
  onClose: () => void
  onConfirm: (status: AACOApplicationStatus, notes?: string) => Promise<void>
  loading?: boolean
}

export function AACOStatusChangeModal({
  application,
  action,
  open,
  onClose,
  onConfirm,
  loading,
}: AACOStatusChangeModalProps) {
  const [notes, setNotes] = useState('')

  if (!application || !action) return null

  const getActionConfig = () => {
    switch (action) {
      case 'approve':
        return {
          title: 'تایید درخواست',
          description: 'با تایید این درخواست، متقاضی به مرحله بعدی منتقل می‌شود.',
          icon: CheckCircle,
          bgGradient: 'from-green-500 to-emerald-600',
          buttonGradient: 'from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700',
          buttonText: 'تایید درخواست',
          status: AACOApplicationStatus.APPROVED,
          notesLabel: 'یادداشت تایید (اختیاری)',
          notesPlaceholder: 'توضیحات یا پیام برای متقاضی...',
          showNextSteps: true,
        }
      case 'reject':
        return {
          title: 'رد درخواست',
          description: 'با رد این درخواست، متقاضی از فرآیند پذیرش خارج می‌شود.',
          icon: XCircle,
          bgGradient: 'from-red-500 to-rose-600',
          buttonGradient: 'from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700',
          buttonText: 'رد درخواست',
          status: AACOApplicationStatus.REJECTED,
          notesLabel: 'دلیل رد (الزامی)',
          notesPlaceholder: 'لطفاً دلیل رد درخواست را وارد کنید...',
          notesRequired: true,
        }
      case 'review':
        return {
          title: 'شروع بررسی',
          description: 'درخواست به حالت "در حال بررسی" تغییر می‌کند.',
          icon: Clock,
          bgGradient: 'from-yellow-500 to-orange-500',
          buttonGradient: 'from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600',
          buttonText: 'شروع بررسی',
          status: AACOApplicationStatus.UNDER_REVIEW,
          notesLabel: 'یادداشت (اختیاری)',
          notesPlaceholder: 'یادداشت‌های اولیه بررسی...',
        }
      case 'resubmit':
        return {
          title: 'بازگشت به ارسال شده',
          description: 'درخواست به حالت "ارسال شده" بازمی‌گردد و قابل بررسی مجدد خواهد بود.',
          icon: Sparkles,
          bgGradient: 'from-blue-500 to-indigo-600',
          buttonGradient: 'from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700',
          buttonText: 'بازگشت به ارسال شده',
          status: AACOApplicationStatus.SUBMITTED,
          notesLabel: 'دلیل بازگشت (اختیاری)',
          notesPlaceholder: 'توضیح دلیل بازگشت وضعیت...',
        }
      default:
        return null
    }
  }

  const config = getActionConfig()
  if (!config) return null

  const Icon = config.icon
  const isNotesRequired = 'notesRequired' in config && config.notesRequired
  const canSubmit = !isNotesRequired || notes.trim().length > 0

  const handleConfirm = async () => {
    await onConfirm(config.status, notes.trim() || undefined)
    setNotes('')
    onClose()
  }

  const handleClose = () => {
    setNotes('')
    onClose()
  }

  const nextSteps = [
    { icon: Phone, title: 'تماس دبیرخانه', color: 'blue' },
    { icon: Users, title: 'مصاحبه', color: 'purple' },
    { icon: CheckCircle, title: 'تایید نهایی', color: 'green' },
  ]

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg p-0 overflow-hidden bg-white dark:bg-gray-900 border-0 shadow-2xl">
        {/* Header */}
        <div className="relative overflow-hidden">
          <div className={cn("absolute inset-0 bg-gradient-to-br", config.bgGradient)} />
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 left-0 w-32 h-32 bg-white rounded-full blur-2xl -translate-x-1/2 -translate-y-1/2" />
          </div>
          <div className="relative p-6 text-white">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">{config.title}</h2>
                  <p className="text-white/80 text-sm">{config.description}</p>
                </div>
              </div>
              {/* Close Button */}
              <button
                onClick={handleClose}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
              >
                <XCircle className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-5">
          {/* Applicant Info */}
          <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700/50">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                {application.firstName?.[0]}{application.lastName?.[0]}
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 dark:text-white">
                  {application.firstName} {application.lastName}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{application.email}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge className={cn("text-xs", getStatusColor(application.status))}>
                    {getStatusLabel(application.status)}
                  </Badge>
                  <ArrowLeft className="h-3 w-3 text-gray-400" />
                  <Badge className={cn(
                    "text-xs",
                    action === 'approve' && "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
                    action === 'reject' && "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
                    action === 'review' && "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
                    action === 'resubmit' && "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
                  )}>
                    {getStatusLabel(config.status)}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Next Steps for Approval */}
          {config.showNextSteps && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-100 dark:border-blue-800/50"
            >
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                <h4 className="font-medium text-blue-900 dark:text-blue-200 text-sm">مراحل بعدی</h4>
              </div>
              <div className="flex items-center justify-between">
                {nextSteps.map((step, index) => {
                  const StepIcon = step.icon
                  return (
                    <div key={step.title} className="flex items-center">
                      <div className="flex flex-col items-center">
                        <div className={cn(
                          "p-2.5 rounded-xl",
                          step.color === 'blue' && "bg-blue-100 dark:bg-blue-900/40",
                          step.color === 'purple' && "bg-purple-100 dark:bg-purple-900/40",
                          step.color === 'green' && "bg-green-100 dark:bg-green-900/40",
                        )}>
                          <StepIcon className={cn(
                            "h-4 w-4",
                            step.color === 'blue' && "text-blue-600 dark:text-blue-400",
                            step.color === 'purple' && "text-purple-600 dark:text-purple-400",
                            step.color === 'green' && "text-green-600 dark:text-green-400",
                          )} />
                        </div>
                        <span className="text-xs text-gray-600 dark:text-gray-400 mt-1.5 text-center max-w-[70px]">
                          {step.title}
                        </span>
                      </div>
                      {index < nextSteps.length - 1 && (
                        <ArrowLeft className="h-3 w-3 text-gray-300 dark:text-gray-600 mx-3 mt-[-16px]" />
                      )}
                    </div>
                  )
                })}
              </div>
            </motion.div>
          )}

          {/* Warning for Reject */}
          {action === 'reject' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-2xl bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800/50"
            >
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
                <p className="text-sm text-red-700 dark:text-red-400">
                  با رد این درخواست، متقاضی از فرآیند پذیرش خارج می‌شود.
                </p>
              </div>
            </motion.div>
          )}

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes" className="text-gray-700 dark:text-gray-300">
              {config.notesLabel}
              {isNotesRequired && <span className="text-red-500 mr-1">*</span>}
            </Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={config.notesPlaceholder}
              rows={3}
              className="resize-none rounded-xl"
            />
          </div>
        </div>

        {/* Footer - RTL: cancel on right, action button on left */}
        <div className="p-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 flex items-center justify-between">
          <Button
            onClick={handleConfirm}
            disabled={!canSubmit || loading}
            className={cn("rounded-xl bg-gradient-to-r text-white shadow-lg", config.buttonGradient)}
          >
            {loading ? 'در حال پردازش...' : config.buttonText}
          </Button>
          <Button variant="outline" onClick={handleClose} disabled={loading} className="rounded-xl">
            انصراف
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
