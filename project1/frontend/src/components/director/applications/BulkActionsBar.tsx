import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { 
  CheckCircle, 
  XCircle, 
  Download, 
  Mail,
  X,
  AlertCircle
} from 'lucide-react'

interface BulkActionsBarProps {
  selectedCount: number
  onApproveAll: () => void
  onRejectAll: () => void
  onExport: () => void
  onSendEmail: () => void
  onClear: () => void
  isProcessing?: boolean
}

export default function BulkActionsBar({
  selectedCount,
  onApproveAll,
  onRejectAll,
  onExport,
  onSendEmail,
  onClear,
  isProcessing = false
}: BulkActionsBarProps) {
  return (
    <AnimatePresence>
      {selectedCount > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40"
        >
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-2xl p-4 flex items-center gap-4 text-white">
            {/* Selection Info */}
            <div className="flex items-center gap-2 px-4 border-l border-white/20">
              <AlertCircle className="h-5 w-5" />
              <span className="font-bold">{selectedCount} مورد انتخاب شده</span>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <Button
                onClick={onApproveAll}
                disabled={isProcessing}
                size="sm"
                className="bg-green-500 hover:bg-green-600 text-white"
              >
                <CheckCircle className="h-4 w-4 ml-2" />
                تایید همه
              </Button>

              <Button
                onClick={onRejectAll}
                disabled={isProcessing}
                size="sm"
                className="bg-red-500 hover:bg-red-600 text-white"
              >
                <XCircle className="h-4 w-4 ml-2" />
                رد همه
              </Button>

              <Button
                onClick={onSendEmail}
                disabled={isProcessing}
                size="sm"
                className="bg-blue-500 hover:bg-blue-600 text-white"
              >
                <Mail className="h-4 w-4 ml-2" />
                ارسال ایمیل
              </Button>

              <Button
                onClick={onExport}
                disabled={isProcessing}
                size="sm"
                className="bg-purple-500 hover:bg-purple-600 text-white"
              >
                <Download className="h-4 w-4 ml-2" />
                خروجی
              </Button>

              <button
                onClick={onClear}
                className="p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
