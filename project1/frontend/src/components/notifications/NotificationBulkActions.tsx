import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, Trash2, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface NotificationBulkActionsProps {
  selectedCount: number
  onMarkAsRead: () => void
  onDelete: () => void
  onClear: () => void
  isLoading?: boolean
}

export default function NotificationBulkActions({
  selectedCount,
  onMarkAsRead,
  onDelete,
  onClear,
  isLoading = false
}: NotificationBulkActionsProps) {
  if (selectedCount === 0) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
      >
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-full shadow-2xl px-6 py-4 flex items-center gap-4">
          <div className="flex items-center gap-2 text-white">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              <span className="text-sm font-bold">{selectedCount}</span>
            </div>
            <span className="text-sm font-medium">انتخاب شده</span>
          </div>

          <div className="w-px h-6 bg-white/30" />

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={onMarkAsRead}
              disabled={isLoading}
              className="text-white hover:bg-white/20 h-8"
            >
              <CheckCircle className="w-4 h-4 ml-1" />
              علامت خوانده
            </Button>

            <Button
              size="sm"
              variant="ghost"
              onClick={onDelete}
              disabled={isLoading}
              className="text-white hover:bg-white/20 h-8"
            >
              <Trash2 className="w-4 h-4 ml-1" />
              حذف
            </Button>

            <Button
              size="sm"
              variant="ghost"
              onClick={onClear}
              disabled={isLoading}
              className="text-white hover:bg-white/20 h-8 w-8 p-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
