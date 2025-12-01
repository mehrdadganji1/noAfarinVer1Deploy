import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Download, Filter } from 'lucide-react'

type TimeRange = 'today' | 'week' | 'month' | 'year'

interface TimeRangeSelectorProps {
  selectedRange: TimeRange
  onRangeChange: (range: TimeRange) => void
  onExport?: () => void
}

export default function TimeRangeSelector({ 
  selectedRange, 
  onRangeChange,
  onExport 
}: TimeRangeSelectorProps) {
  const ranges = [
    { value: 'today' as TimeRange, label: 'امروز' },
    { value: 'week' as TimeRange, label: 'این هفته' },
    { value: 'month' as TimeRange, label: 'این ماه' },
    { value: 'year' as TimeRange, label: 'امسال' },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="border-0 shadow-lg">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            {/* Filter Icon & Label */}
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Filter className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">بازه زمانی تحلیل</p>
                <p className="text-xs text-gray-500">انتخاب دوره برای مشاهده آمار</p>
              </div>
            </div>

            {/* Range Buttons */}
            <div className="flex gap-2">
              {ranges.map((range, index) => (
                <motion.div
                  key={range.value}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Button
                    variant={selectedRange === range.value ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => onRangeChange(range.value)}
                    className={`transition-all ${
                      selectedRange === range.value
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg'
                        : 'hover:border-purple-300 hover:bg-purple-50'
                    }`}
                  >
                    {range.label}
                  </Button>
                </motion.div>
              ))}
            </div>

            {/* Export Button */}
            {onExport && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onExport}
                  className="border-2 border-green-300 hover:bg-green-50 hover:border-green-400"
                >
                  <Download className="h-4 w-4 ml-2" />
                  دریافت گزارش
                </Button>
              </motion.div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
