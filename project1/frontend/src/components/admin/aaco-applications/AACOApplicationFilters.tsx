import { Search, Filter, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
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
    { value: ALL_STATUS_VALUE, label: 'همه وضعیت‌ها' },
    {
      value: AACOApplicationStatus.SUBMITTED,
      label: getStatusLabel(AACOApplicationStatus.SUBMITTED),
    },
    {
      value: AACOApplicationStatus.UNDER_REVIEW,
      label: getStatusLabel(AACOApplicationStatus.UNDER_REVIEW),
    },
    {
      value: AACOApplicationStatus.APPROVED,
      label: getStatusLabel(AACOApplicationStatus.APPROVED),
    },
    {
      value: AACOApplicationStatus.REJECTED,
      label: getStatusLabel(AACOApplicationStatus.REJECTED),
    },
    {
      value: AACOApplicationStatus.DRAFT,
      label: getStatusLabel(AACOApplicationStatus.DRAFT),
    },
  ]

  const hasActiveFilters = filters.status || filters.search

  const clearFilters = () => {
    onFilterChange({ status: '', search: '' })
  }

  const handleStatusChange = (value: string) => {
    // Convert 'all' back to empty string for the filter
    const statusValue = value === ALL_STATUS_VALUE ? '' : (value as AACOApplicationStatus)
    onFilterChange({ status: statusValue })
  }

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
      {/* Search */}
      <div className="relative flex-1 w-full sm:max-w-xs">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="جستجو نام، ایمیل..."
          value={filters.search || ''}
          onChange={(e) => onFilterChange({ search: e.target.value })}
          className="pr-10"
        />
      </div>

      {/* Status Filter */}
      <div className="flex items-center gap-2">
        <Filter className="h-4 w-4 text-gray-400" />
        <Select
          value={filters.status || ALL_STATUS_VALUE}
          onValueChange={handleStatusChange}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="وضعیت" />
          </SelectTrigger>
          <SelectContent>
            {statusOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
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
          className="text-gray-500 hover:text-gray-700"
        >
          <X className="h-4 w-4 ml-1" />
          پاک کردن فیلترها
        </Button>
      )}
    </div>
  )
}
