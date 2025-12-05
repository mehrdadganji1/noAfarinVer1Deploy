import { ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export interface FilterPanelProps {
  isOpen: boolean
  onClose: () => void
  onReset?: () => void
  children: ReactNode
  title?: string
  className?: string
}

export function FilterPanel({
  isOpen,
  onClose,
  onReset,
  children,
  title = 'فیلترها',
  className,
}: FilterPanelProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2 }}
          className={cn(
            'overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700',
            'bg-white dark:bg-gray-800',
            className
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-gray-900 dark:text-white">{title}</h3>
            <div className="flex items-center gap-2">
              {onReset && (
                <Button variant="ghost" size="sm" onClick={onReset}>
                  <RotateCcw className="h-4 w-4 ml-2" />
                  بازنشانی
                </Button>
              )}
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Content */}
          <div className="p-4">
            {children}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export interface FilterGroupProps {
  label: string
  children: ReactNode
  className?: string
}

export function FilterGroup({ label, children, className }: FilterGroupProps) {
  return (
    <div className={cn('space-y-2', className)}>
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </label>
      {children}
    </div>
  )
}

export interface FilterChipProps {
  label: string
  value: string
  isSelected: boolean
  onClick: () => void
}

export function FilterChip({ label, value, isSelected, onClick }: FilterChipProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'px-3 py-1.5 rounded-full text-sm font-medium transition-all',
        isSelected
          ? 'bg-blue-600 text-white'
          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
      )}
    >
      {label}
    </button>
  )
}

export default FilterPanel
