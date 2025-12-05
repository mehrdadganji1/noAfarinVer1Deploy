import { motion } from 'framer-motion'
import { Calendar, Download, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export type TimeRange = 'today' | 'week' | 'month' | 'quarter' | 'year' | 'all'

export interface TimeRangeFilterProps {
  value: TimeRange
  onChange: (range: TimeRange) => void
  onRefresh?: () => void
  onExport?: () => void
  isRefreshing?: boolean
  showExport?: boolean
  className?: string
}

const ranges: Array<{ value: TimeRange; label: string }> = [
  { value: 'today', label: 'امروز' },
  { value: 'week', label: 'این هفته' },
  { value: 'month', label: 'این ماه' },
  { value: 'quarter', label: 'سه ماهه' },
  { value: 'year', label: 'امسال' },
  { value: 'all', label: 'همه' },
]

export function TimeRangeFilter({
  value,
  onChange,
  onRefresh,
  onExport,
  isRefreshing = false,
  showExport = true,
  className,
}: TimeRangeFilterProps) {
  return (
    <div className={cn(
      'flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4',
      'p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700',
      className
    )}>
      {/* Time Range Buttons */}
      <div className="flex items-center gap-2 flex-wrap">
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 ml-2">
          <Calendar className="h-4 w-4" />
          <span>بازه زمانی:</span>
        </div>
        <div className="flex gap-1 p-1 bg-gray-100 dark:bg-gray-700 rounded-lg">
          {ranges.map((range) => (
            <button
              key={range.value}
              onClick={() => onChange(range.value)}
              className={cn(
                'relative px-3 py-1.5 text-sm font-medium rounded-md transition-all',
                value === range.value
                  ? 'text-white'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              )}
            >
              {value === range.value && (
                <motion.div
                  layoutId="timeRangeActive"
                  className="absolute inset-0 bg-blue-600 rounded-md"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
              <span className="relative z-10">{range.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        {onRefresh && (
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={cn('h-4 w-4 ml-2', isRefreshing && 'animate-spin')} />
            بروزرسانی
          </Button>
        )}
        {showExport && onExport && (
          <Button
            variant="outline"
            size="sm"
            onClick={onExport}
          >
            <Download className="h-4 w-4 ml-2" />
            خروجی
          </Button>
        )}
      </div>
    </div>
  )
}

export default TimeRangeFilter
