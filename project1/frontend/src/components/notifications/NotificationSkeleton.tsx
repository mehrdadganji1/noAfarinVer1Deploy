import { Card, CardContent } from '@/components/ui/card'

export default function NotificationSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i} className="animate-pulse">
          <CardContent className="p-2">
            <div className="flex items-start gap-2">
              {/* Icon skeleton */}
              <div className="flex-shrink-0 w-8 h-8 bg-gray-200 rounded-lg" />

              {/* Content skeleton */}
              <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="h-3 bg-gray-200 rounded w-32" />
                  <div className="flex gap-1">
                    <div className="h-6 w-6 bg-gray-200 rounded" />
                    <div className="h-6 w-6 bg-gray-200 rounded" />
                  </div>
                </div>
                <div className="h-2 bg-gray-200 rounded w-full" />
                <div className="h-2 bg-gray-200 rounded w-3/4" />
                <div className="h-2 bg-gray-100 rounded w-20" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
