import { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { LucideIcon, Plus, Download, Filter, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

export interface PageHeaderProps {
  title: string
  subtitle?: string
  icon?: LucideIcon
  iconColor?: string
  gradient?: string
  searchPlaceholder?: string
  searchValue?: string
  onSearchChange?: (value: string) => void
  onAdd?: () => void
  addLabel?: string
  onExport?: () => void
  onFilter?: () => void
  showFilters?: boolean
  actions?: ReactNode
  className?: string
}

export function PageHeader({
  title,
  subtitle,
  icon: Icon,
  iconColor = 'text-blue-600',
  gradient = 'from-blue-600 via-purple-600 to-indigo-600',
  searchPlaceholder = 'جستجو...',
  searchValue,
  onSearchChange,
  onAdd,
  addLabel = 'افزودن',
  onExport,
  onFilter,
  showFilters,
  actions,
  className,
}: PageHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'relative overflow-hidden rounded-2xl p-6 text-white shadow-xl',
        `bg-gradient-to-br ${gradient}`,
        className
      )}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
      </div>

      <div className="relative z-10">
        {/* Top Row - Title & Actions */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            {Icon && (
              <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                <Icon className="h-7 w-7" />
              </div>
            )}
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">{title}</h1>
              {subtitle && (
                <p className="text-white/80 text-sm mt-1">{subtitle}</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onExport && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onExport}
                className="text-white hover:bg-white/20"
              >
                <Download className="h-4 w-4 ml-2" />
                خروجی
              </Button>
            )}
            {onAdd && (
              <Button
                onClick={onAdd}
                className="bg-white text-gray-900 hover:bg-white/90"
              >
                <Plus className="h-4 w-4 ml-2" />
                {addLabel}
              </Button>
            )}
            {actions}
          </div>
        </div>

        {/* Bottom Row - Search & Filters */}
        {(onSearchChange || onFilter) && (
          <div className="flex flex-col sm:flex-row gap-3">
            {onSearchChange && (
              <div className="relative flex-1 max-w-md">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder={searchPlaceholder}
                  value={searchValue}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="pr-10 bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:bg-white/20"
                />
              </div>
            )}
            {onFilter && (
              <Button
                variant="ghost"
                onClick={onFilter}
                className={cn(
                  'text-white hover:bg-white/20',
                  showFilters && 'bg-white/20'
                )}
              >
                <Filter className="h-4 w-4 ml-2" />
                فیلترها
              </Button>
            )}
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default PageHeader
