import { Search, Filter, X, SlidersHorizontal } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  AACOApplicationStatus,
  AACOApplicationFilters as FilterType,
  getStatusLabel,
} from '@/hooks/useAACOAdminApplications'
import { cn } from '@/lib/utils'

interface AACOApplicationFiltersProps {
  filters: FilterType
  onFilterChange: (filters: Partial<FilterType>) => void
}

const ALL_STATUS_VALUE = 'all'

export function AACOApplicationFilters({
  filters,
  onFilterChange,
}: AACOApplicationFiltersProps) {
  const statusOptions = [
    { 
      value: ALL_STATUS_VALUE, 
      label: 'همه وضعیت‌ها',
      color: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
    },
    {
      value: AACOApplicationStatus.SUBMITTED,
      label: getStatusLabel(AACOApplicationStatus.SUBMITTED),
      color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
    },
    {
      value: AACOApplicationStatus.UNDER_REVIEW,
      label: getStatusLabel(AACOApplicationStatus.UNDER_REVIEW),
      color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
    },
    {
      value: AACOApplicationStatus.APPROVED,
      label: getStatusLabel(AACOApplicationStatus.APPROVED),
      color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
    },
    {
      value: AACOApplicationStatus.REJECTED,
      label: getStatusLabel(AACOApplicationStatus.REJECTED),
      color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
    },
    {
      value: AACOApplicationStatus.DRAFT,
      label: getStatusLabel(AACOApplicationStatus.DRAFT),
      color: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
    },
  ]

  const hasActiveFilters = filters.status || filters.search

  const clearFilters = () => {
    onFilterChange({ status: '', search: '' })
  }

  const handleStatusChange = (value: string) => {
    const statusValue = value === ALL_STATUS_VALUE ? '' : (value as AACOApplicationStatus)
    onFilterChange({ status: statusValue })
  }

  const activeFiltersCount = [filters.status, filters.search].filter(Boolean).length

  return (
    <div className="space-y-4">
      {/* Main Filters Row */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        {/* Search */}
        <div className="relative flex-1 w-full sm:max-w-sm">
          <div className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-gray-100 dark:bg-gray-800">
            <Search className="h-4 w-4 text-gray-500 dark:text-gray-400" />
          </div>
          <Input
            placeholder="جستجو نام، ایمیل، دانشگاه..."
            value={filters.search || ''}
            onChange={(e) => onFilterChange({ search: e.target.value })}
            className="pr-12 h-11 rounded-xl border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-blue-500/20"
          />
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 p-1.5 rounded-lg bg-gray-100 dark:bg-gray-800">
            <SlidersHorizontal className="h-4 w-4 text-gray-500 dark:text-gray-400" />
          </div>
          <Select
            value={filters.status || ALL_STATUS_VALUE}
            onValueChange={handleStatusChange}
          >
            <SelectTrigger className="w-[200px] h-11 rounded-xl border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
              <SelectValue placeholder="وضعیت" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              {statusOptions.map((option) => (
                <SelectItem 
                  key={option.value} 
                  value={option.value}
                  className="rounded-lg"
                >
                  <div className="flex items-center gap-2">
                    <div className={cn(
                      "w-2 h-2 rounded-full",
                      option.value === ALL_STATUS_VALUE && "bg-gray-400",
                      option.value === AACOApplicationStatus.SUBMITTED && "bg-blue-500",
                      option.value === AACOApplicationStatus.UNDER_REVIEW && "bg-yellow-500",
                      option.value === AACOApplicationStatus.APPROVED && "bg-green-500",
                      option.value === AACOApplicationStatus.REJECTED && "bg-red-500",
                      option.value === AACOApplicationStatus.DRAFT && "bg-gray-400",
                    )} />
                    {option.label}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-xl"
          >
            <X className="h-4 w-4 ml-1.5" />
            پاک کردن
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="mr-2 h-5 w-5 p-0 flex items-center justify-center rounded-full text-xs">
                {activeFiltersCount}
              </Badge>
            )}
          </Button>
        )}
      </div>

      {/* Active Filters Tags */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {filters.search && (
            <Badge 
              variant="secondary" 
              className="px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-0"
            >
              <Search className="h-3 w-3 ml-1.5" />
              جستجو: {filters.search}
              <button
                onClick={() => onFilterChange({ search: '' })}
                className="mr-2 hover:bg-blue-100 dark:hover:bg-blue-900/40 rounded p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {filters.status && (
            <Badge 
              variant="secondary" 
              className={cn(
                "px-3 py-1.5 rounded-lg border-0",
                statusOptions.find(s => s.value === filters.status)?.color
              )}
            >
              <Filter className="h-3 w-3 ml-1.5" />
              {getStatusLabel(filters.status as AACOApplicationStatus)}
              <button
                onClick={() => onFilterChange({ status: '' })}
                className="mr-2 hover:opacity-70 rounded p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
        </div>
      )}
    </div>
  )
}
