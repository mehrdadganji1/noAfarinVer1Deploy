import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Filter, 
  X, 
  Calendar,
  GraduationCap,
  MapPin,
  ChevronDown,
  ChevronUp
} from 'lucide-react'

interface AdvancedFiltersProps {
  onFilterChange: (filters: FilterValues) => void
  onReset: () => void
}

export interface FilterValues {
  university?: string
  major?: string
  degree?: string
  dateFrom?: string
  dateTo?: string
}

export default function AdvancedFilters({ onFilterChange, onReset }: AdvancedFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [filters, setFilters] = useState<FilterValues>({})

  const handleFilterChange = (key: keyof FilterValues, value: string) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  const handleReset = () => {
    setFilters({})
    onReset()
  }

  const activeFiltersCount = Object.values(filters).filter(v => v).length

  return (
    <div className="space-y-2">
      {/* Toggle Button */}
      <Button
        onClick={() => setIsExpanded(!isExpanded)}
        variant="outline"
        className="w-full justify-between"
      >
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          <span>فیلترهای پیشرفته</span>
          {activeFiltersCount > 0 && (
            <span className="bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full">
              {activeFiltersCount}
            </span>
          )}
        </div>
        {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </Button>

      {/* Filters Panel */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <Card>
              <CardContent className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* University Filter */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium mb-2">
                      <MapPin className="h-4 w-4 text-blue-500" />
                      دانشگاه
                    </label>
                    <input
                      type="text"
                      value={filters.university || ''}
                      onChange={(e) => handleFilterChange('university', e.target.value)}
                      placeholder="نام دانشگاه..."
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  {/* Major Filter */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium mb-2">
                      <GraduationCap className="h-4 w-4 text-purple-500" />
                      رشته تحصیلی
                    </label>
                    <input
                      type="text"
                      value={filters.major || ''}
                      onChange={(e) => handleFilterChange('major', e.target.value)}
                      placeholder="نام رشته..."
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  {/* Degree Filter */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium mb-2">
                      <GraduationCap className="h-4 w-4 text-green-500" />
                      مقطع تحصیلی
                    </label>
                    <select
                      value={filters.degree || ''}
                      onChange={(e) => handleFilterChange('degree', e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">همه مقاطع</option>
                      <option value="کارشناسی">کارشناسی</option>
                      <option value="کارشناسی ارشد">کارشناسی ارشد</option>
                      <option value="دکتری">دکتری</option>
                    </select>
                  </div>

                  {/* Date From */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium mb-2">
                      <Calendar className="h-4 w-4 text-orange-500" />
                      از تاریخ
                    </label>
                    <input
                      type="date"
                      value={filters.dateFrom || ''}
                      onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  {/* Date To */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium mb-2">
                      <Calendar className="h-4 w-4 text-red-500" />
                      تا تاریخ
                    </label>
                    <input
                      type="date"
                      value={filters.dateTo || ''}
                      onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  {/* Reset Button */}
                  <div className="flex items-end">
                    <Button
                      onClick={handleReset}
                      variant="outline"
                      className="w-full"
                    >
                      <X className="h-4 w-4 ml-2" />
                      پاک کردن فیلترها
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
