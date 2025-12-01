import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'

interface PageSkeletonProps {
  showHeader?: boolean
  showStats?: boolean
  statsCount?: number
  showFilters?: boolean
  itemsCount?: number
}

export function PageSkeleton({
  showHeader = true,
  showStats = true,
  statsCount = 4,
  showFilters = true,
  itemsCount = 5,
}: PageSkeletonProps) {
  return (
    <div className="space-y-6 pb-8">
      {/* Header Skeleton */}
      {showHeader && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-200 via-gray-300 to-gray-200 p-8 shadow-2xl animate-pulse"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 bg-white/30 rounded-2xl" />
              <div className="space-y-2">
                <div className="h-8 w-48 bg-white/30 rounded-lg" />
                <div className="h-4 w-64 bg-white/20 rounded" />
              </div>
            </div>
            <div className="flex gap-2">
              <div className="h-10 w-32 bg-white/30 rounded-lg" />
            </div>
          </div>
        </motion.div>
      )}

      {/* Stats Skeleton */}
      {showStats && (
        <div className={`grid grid-cols-1 md:grid-cols-${statsCount} gap-4`}>
          {Array.from({ length: statsCount }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1, duration: 0.3 }}
            >
              <Card className="border-0 shadow-lg overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 animate-pulse">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-200 rounded-xl" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3 w-20 bg-gray-200 rounded" />
                      <div className="h-6 w-16 bg-gray-300 rounded" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Filters Skeleton */}
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="border-0 shadow-lg animate-pulse">
            <CardContent className="pt-6">
              <div className="flex gap-2 flex-wrap">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-8 w-24 bg-gray-200 rounded-lg" />
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Items Skeleton */}
      <div className="space-y-4">
        {Array.from({ length: itemsCount }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + i * 0.05 }}
          >
            <Card className="border-0 shadow-lg animate-pulse">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-gray-200 to-gray-300 rounded-2xl" />
                  <div className="flex-1 space-y-3">
                    <div className="h-5 w-3/4 bg-gray-200 rounded" />
                    <div className="h-4 w-1/2 bg-gray-100 rounded" />
                    <div className="h-3 w-full bg-gray-100 rounded" />
                  </div>
                  <div className="flex gap-2">
                    <div className="h-8 w-20 bg-gray-200 rounded-full" />
                    <div className="h-8 w-24 bg-gray-200 rounded-lg" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

// Specialized skeletons for different page types
export function DashboardSkeleton() {
  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200 p-8 shadow-2xl animate-pulse"
      >
        <div className="flex items-center gap-3">
          <div className="w-20 h-20 bg-white/40 rounded-2xl" />
          <div className="space-y-3">
            <div className="h-10 w-64 bg-white/40 rounded-lg" />
            <div className="h-5 w-96 bg-white/30 rounded" />
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="border-0 shadow-lg animate-pulse">
              <CardContent className="pt-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="h-4 w-24 bg-gray-200 rounded" />
                    <div className="w-10 h-10 bg-gray-200 rounded-xl" />
                  </div>
                  <div className="h-8 w-20 bg-gray-300 rounded" />
                  <div className="h-2 w-full bg-gray-100 rounded-full" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[1, 2].map((i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + i * 0.1 }}
          >
            <Card className="border-0 shadow-lg animate-pulse">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="h-6 w-40 bg-gray-200 rounded" />
                  <div className="h-64 bg-gradient-to-t from-gray-100 to-gray-50 rounded-lg" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export function TableSkeleton({ rows = 10 }: { rows?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: rows }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.03 }}
          className="h-16 bg-gray-100 rounded-lg animate-pulse"
        />
      ))}
    </div>
  )
}
