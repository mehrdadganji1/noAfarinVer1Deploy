import { useState } from 'react'
import { CheckCircle, XCircle, Clock, AlertTriangle } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { 
  AACOApplication, 
  AACOApplicationStatus,
  getStatusLabel 
} from '@/hooks/useAACOAdminApplications'
import { ApprovalNextStepsInfo } from './ApprovalNextStepsInfo'

type ActionType = 'approve' | 'reject' | 'review'

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
          description: `آیا از تایید درخواست ${application.firstName} ${application.lastName} اطمینان دارید؟`,
          icon: CheckCircle,
          iconColor: 'text-green-500',
          bgColor: 'bg-green-50 dark:bg-green-900/20',
          borderColor: 'border-green-200 dark:border-green-800',
          buttonColor: 'bg-green-600 hover:bg-green-700',
          buttonText: 'تایید درخواست',
          status: AACOApplicationStatus.APPROVED,
          notesLabel: 'یادداشت تایید (اختیاری)',
          notesPlaceholder: 'توضیحات یا پیام برای متقاضی...',
        }
      case 'reject':
        return {
          title: 'رد درخواست',
          description: `آیا از رد درخواست ${application.firstName} ${application.lastName} اطمینان دارید؟`,
          icon: XCircle,
          iconColor: 'text-red-500',
          bgColor: 'bg-red-50 dark:bg-red-900/20',
          borderColor: 'border-red-200 dark:border-red-800',
          buttonColor: 'bg-red-600 hover:bg-red-700',
          buttonText: 'رد درخواست',
          status: AACOApplicationStatus.REJECTED,
          notesLabel: 'دلیل رد (الزامی)',
          notesPlaceholder: 'لطفاً دلیل رد درخواست را وارد کنید...',
          notesRequired: true,
        }
      case 'review':
        return {
          title: 'شروع بررسی',
          description: `درخواست ${application.firstName} ${application.lastName} به حالت "در حال بررسی" تغییر می‌کند.`,
          icon: Clock,
          iconColor: 'text-yellow-500',
          bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
          borderColor: 'border-yellow-200 dark:border-yellow-800',
          buttonColor: 'bg-yellow-600 hover:bg-yellow-700',
          buttonText: 'شروع بررسی',
          status: AACOApplicationStatus.UNDER_REVIEW,
          notesLabel: 'یادداشت (اختیاری)',
          notesPlaceholder: 'یادداشت‌های اولیه بررسی...',
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

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Icon className={`h-5 w-5 ${config.iconColor}`} />
            {config.title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Warning/Info Box */}
          <div className={`p-4 rounded-lg ${config.bgColor} border ${config.borderColor}`}>
            <div className="flex items-start gap-3">
              <AlertTriangle className={`h-5 w-5 mt-0.5 ${config.iconColor}`} />
              <div>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  {config.description}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  وضعیت فعلی: {getStatusLabel(application.status)}
                </p>
              </div>
            </div>
          </div>

          {/* Applicant Info */}
          <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                {application.firstName?.[0]}{application.lastName?.[0]}
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  {application.firstName} {application.lastName}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {application.email}
                </p>
              </div>
            </div>
          </div>

          {/* Next Steps Info - Only for Approval */}
          {action === 'approve' && (
            <ApprovalNextStepsInfo 
              applicantName={`${application.firstName} ${application.lastName}`} 
            />
          )}

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">
              {config.notesLabel}
              {isNotesRequired && <span className="text-red-500 mr-1">*</span>}
            </Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={config.notesPlaceholder}
              rows={3}
              className="resize-none"
            />
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={handleClose} disabled={loading}>
            انصراف
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!canSubmit || loading}
            className={config.buttonColor}
          >
            {loading ? 'در حال پردازش...' : config.buttonText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
