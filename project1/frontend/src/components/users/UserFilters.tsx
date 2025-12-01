import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, RotateCcw, LayoutGrid, List } from 'lucide-react'

interface UserFiltersProps {
  searchQuery: string
  roleFilter: string
  statusFilter: string
  viewMode: 'list' | 'grid'
  totalUsers: number
  onSearchChange: (query: string) => void
  onRoleChange: (role: string) => void
  onStatusChange: (status: string) => void
  onViewModeChange: (mode: 'list' | 'grid') => void
  onReset: () => void
}

export default function UserFilters({
  searchQuery,
  roleFilter,
  statusFilter,
  viewMode,
  totalUsers,
  onSearchChange,
  onRoleChange,
  onStatusChange,
  onViewModeChange,
  onReset
}: UserFiltersProps) {
  const roleOptions = [
    { value: 'all', label: 'همه نقش‌ها' },
    { value: 'admin', label: 'مدیر' },
    { value: 'club_member', label: 'عضو باشگاه' },
    { value: 'applicant', label: 'متقاضی' },
  ]

  const statusOptions = [
    { value: 'all', label: 'همه' },
    { value: 'active', label: 'فعال' },
    { value: 'inactive', label: 'غیرفعال' },
  ]

  return (
    <div className="flex items-center gap-4">
      {/* Search - Half Width */}
      <div className="relative flex-1 max-w-md">
        <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="جستجو بر اساس نام، ایمیل یا شماره دانشجویی..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pr-10 h-9 border-2 focus:border-purple-300 text-sm"
        />
      </div>

      {/* Role Filter */}
      <div className="flex gap-2">
        {roleOptions.map((option, index) => (
          <motion.div
            key={option.value}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.03 }}
          >
            <Button
              type="button"
              variant={roleFilter === option.value ? 'default' : 'outline'}
              size="sm"
              onClick={() => onRoleChange(option.value)}
              className={`h-9 px-3 text-xs transition-all ${
                roleFilter === option.value
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
                  : 'hover:border-purple-300 hover:bg-purple-50'
              }`}
            >
              {option.label}
            </Button>
          </motion.div>
        ))}
      </div>

      <div className="h-6 w-px bg-gray-300" />

      {/* Status Filter */}
      <div className="flex gap-2">
        {statusOptions.map((option, index) => (
          <motion.div
            key={option.value}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15 + index * 0.03 }}
          >
            <Button
              type="button"
              variant={statusFilter === option.value ? 'default' : 'outline'}
              size="sm"
              onClick={() => onStatusChange(option.value)}
              className={`h-9 px-3 text-xs transition-all ${
                statusFilter === option.value
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700'
                  : 'hover:border-blue-300 hover:bg-blue-50'
              }`}
            >
              {option.label}
            </Button>
          </motion.div>
        ))}
      </div>

      {/* Reset Button */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onReset}
          className="h-9 px-3 text-xs border-2 border-gray-300 hover:border-red-300 hover:bg-red-50"
        >
          <RotateCcw className="h-3.5 w-3.5 ml-1.5" />
          بازنشانی
        </Button>
      </motion.div>

      <div className="h-6 w-px bg-gray-300 mr-auto" />

      {/* View Mode Toggle */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1 bg-white rounded-lg p-0.5 shadow-sm border-2">
          <button
            type="button"
            onClick={() => onViewModeChange('list')}
            className={`p-1.5 rounded transition-all ${
              viewMode === 'list'
                ? 'bg-purple-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <List className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onViewModeChange('grid')}
            className={`p-1.5 rounded transition-all ${
              viewMode === 'grid'
                ? 'bg-purple-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <LayoutGrid className="h-3.5 w-3.5" />
          </button>
        </div>
        <div className="px-3 py-1 bg-purple-600 text-white rounded-full text-xs font-bold">
          {totalUsers}
        </div>
      </div>
    </div>
  )
}
