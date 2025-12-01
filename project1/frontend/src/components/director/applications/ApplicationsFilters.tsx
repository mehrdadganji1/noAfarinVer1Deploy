import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, RotateCcw } from 'lucide-react'

interface FiltersProps {
  statusFilter: string
  searchQuery: string
  onStatusChange: (status: string) => void
  onSearchChange: (query: string) => void
  totalCount: number
  onReset?: () => void
}

export default function ApplicationsFilters({
  statusFilter,
  searchQuery,
  onStatusChange,
  onSearchChange,
  totalCount,
  onReset,
}: FiltersProps) {
  const statusOptions = [
    { value: 'all', label: 'همه', color: 'from-gray-600 to-gray-700' },
    { value: 'pending', label: 'در انتظار', color: 'from-yellow-600 to-orange-600' },
    { value: 'approved', label: 'تایید شده', color: 'from-green-600 to-emerald-600' },
    { value: 'rejected', label: 'رد شده', color: 'from-red-600 to-rose-600' },
  ]

  const handleReset = () => {
    if (onReset) {
      onReset()
    } else {
      onStatusChange('all')
      onSearchChange('')
    }
  }

  return (
    <div className="flex flex-col lg:flex-row items-center gap-3">
      {/* Search */}
      <div className="relative flex-1 w-full">
        <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="جستجو بر اساس نام، ایمیل، دانشگاه..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pr-10 h-9 border focus:border-blue-300 text-sm"
        />
      </div>

      {/* Status Filters */}
      <div className="flex gap-2 flex-wrap">
        {statusOptions.map((option) => (
          <Button
            key={option.value}
            type="button"
            variant={statusFilter === option.value ? 'default' : 'outline'}
            size="sm"
            onClick={() => onStatusChange(option.value)}
            className={`h-9 px-3 text-xs transition-all ${
              statusFilter === option.value
                ? `bg-gradient-to-r ${option.color} hover:opacity-90 text-white`
                : 'hover:border-blue-300 hover:bg-blue-50'
            }`}
          >
            {option.label}
          </Button>
        ))}
      </div>

      {/* Reset Button */}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={handleReset}
        className="h-9 px-3 text-xs border hover:border-red-300 hover:bg-red-50"
      >
        <RotateCcw className="h-3 w-3 ml-1" />
        بازنشانی
      </Button>

      {/* Count Badge */}
      <div className="px-3 py-1.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full text-xs font-bold shadow">
        {totalCount} درخواست
      </div>
    </div>
  )
}
