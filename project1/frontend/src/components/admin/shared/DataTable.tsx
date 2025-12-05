import { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export interface Column<T> {
  key: string
  header: string
  width?: string
  align?: 'right' | 'center' | 'left'
  render?: (item: T, index: number) => ReactNode
}

export interface DataTableProps<T> {
  columns: Column<T>[]
  data: T[]
  loading?: boolean
  emptyMessage?: string
  emptyIcon?: ReactNode
  onRowClick?: (item: T) => void
  selectedIds?: string[]
  onSelect?: (ids: string[]) => void
  idKey?: keyof T
  pagination?: {
    page: number
    pageSize: number
    total: number
    onPageChange: (page: number) => void
  }
  className?: string
}

export function DataTable<T extends Record<string, any>>({
  columns,
  data,
  loading = false,
  emptyMessage = 'داده‌ای یافت نشد',
  emptyIcon,
  onRowClick,
  selectedIds = [],
  onSelect,
  idKey = '_id' as keyof T,
  pagination,
  className,
}: DataTableProps<T>) {
  const totalPages = pagination ? Math.ceil(pagination.total / pagination.pageSize) : 1

  const handleSelectAll = () => {
    if (!onSelect) return
    if (selectedIds.length === data.length) {
      onSelect([])
    } else {
      onSelect(data.map(item => String(item[idKey])))
    }
  }

  const handleSelectRow = (id: string) => {
    if (!onSelect) return
    if (selectedIds.includes(id)) {
      onSelect(selectedIds.filter(i => i !== id))
    } else {
      onSelect([...selectedIds, id])
    }
  }

  if (loading) {
    return (
      <div className={cn('rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden', className)}>
        <div className="bg-gray-50 dark:bg-gray-800 p-4">
          <div className="flex gap-4">
            {columns.map((col, i) => (
              <div key={i} className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" style={{ width: col.width || '100px' }} />
            ))}
          </div>
        </div>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="p-4 flex gap-4">
              {columns.map((col, j) => (
                <div key={j} className="h-4 bg-gray-100 dark:bg-gray-800 rounded animate-pulse" style={{ width: col.width || '100px' }} />
              ))}
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className={cn(
        'rounded-xl border border-gray-200 dark:border-gray-700 p-12 text-center',
        className
      )}>
        {emptyIcon && <div className="mb-4">{emptyIcon}</div>}
        <p className="text-gray-500 dark:text-gray-400">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className={cn('rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden', className)}>
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              {onSelect && (
                <th className="p-4 w-12">
                  <input
                    type="checkbox"
                    checked={selectedIds.length === data.length && data.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 dark:border-gray-600"
                  />
                </th>
              )}
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={cn(
                    'p-4 text-sm font-semibold text-gray-700 dark:text-gray-300',
                    col.align === 'center' && 'text-center',
                    col.align === 'left' && 'text-left',
                    !col.align && 'text-right'
                  )}
                  style={{ width: col.width }}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {data.map((item, index) => (
              <motion.tr
                key={String(item[idKey]) || index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
                onClick={() => onRowClick?.(item)}
                className={cn(
                  'bg-white dark:bg-gray-900',
                  'hover:bg-gray-50 dark:hover:bg-gray-800',
                  onRowClick && 'cursor-pointer',
                  selectedIds.includes(String(item[idKey])) && 'bg-blue-50 dark:bg-blue-900/20'
                )}
              >
                {onSelect && (
                  <td className="p-4 w-12" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(String(item[idKey]))}
                      onChange={() => handleSelectRow(String(item[idKey]))}
                      className="rounded border-gray-300 dark:border-gray-600"
                    />
                  </td>
                )}
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={cn(
                      'p-4 text-sm text-gray-900 dark:text-gray-100',
                      col.align === 'center' && 'text-center',
                      col.align === 'left' && 'text-left',
                      !col.align && 'text-right'
                    )}
                  >
                    {col.render ? col.render(item, index) : item[col.key]}
                  </td>
                ))}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && totalPages > 1 && (
        <div className="flex items-center justify-between p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            نمایش {((pagination.page - 1) * pagination.pageSize) + 1} تا{' '}
            {Math.min(pagination.page * pagination.pageSize, pagination.total)} از{' '}
            {pagination.total} مورد
          </p>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => pagination.onPageChange(1)}
              disabled={pagination.page === 1}
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => pagination.onPageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <span className="px-3 text-sm text-gray-600 dark:text-gray-400">
              صفحه {pagination.page} از {totalPages}
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => pagination.onPageChange(pagination.page + 1)}
              disabled={pagination.page === totalPages}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => pagination.onPageChange(totalPages)}
              disabled={pagination.page === totalPages}
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

export default DataTable
