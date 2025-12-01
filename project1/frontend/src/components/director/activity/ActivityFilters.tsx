import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, Filter } from 'lucide-react'

interface FilterOption {
  value: string
  label: string
}

interface ActivityFiltersProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  filterType: string
  onFilterChange: (type: string) => void
  filterOptions: FilterOption[]
}

export default function ActivityFilters({
  searchQuery,
  onSearchChange,
  filterType,
  onFilterChange,
  filterOptions
}: ActivityFiltersProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="border-0 shadow-lg">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  placeholder="جستجو در فعالیت‌ها..."
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="pr-10 h-11 border-2 focus:border-purple-300"
                />
              </div>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Filter className="h-5 w-5 text-purple-600" />
              </div>
              <div className="flex gap-2 flex-wrap">
                {filterOptions.map((option, index) => (
                  <motion.div
                    key={option.value}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Button
                      variant={filterType === option.value ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => onFilterChange(option.value)}
                      className={`transition-all ${
                        filterType === option.value
                          ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-md'
                          : 'hover:border-purple-300 hover:bg-purple-50'
                      }`}
                    >
                      {option.label}
                    </Button>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
