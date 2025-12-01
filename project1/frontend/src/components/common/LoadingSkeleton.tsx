import { Card, CardContent, CardHeader } from '@/components/ui/card';

interface LoadingSkeletonProps {
  type?: 'card' | 'list' | 'stat' | 'table';
  count?: number;
  className?: string;
}

export default function LoadingSkeleton({
  type = 'card',
  count = 3,
  className = '',
}: LoadingSkeletonProps) {
  if (type === 'stat') {
    return (
      <div className={`grid grid-cols-1 md:grid-cols-4 gap-4 ${className}`}>
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-8 w-8 bg-gray-200 rounded-lg mb-2 mx-auto" />
              <div className="h-8 bg-gray-200 rounded mb-2" />
              <div className="h-4 bg-gray-200 rounded w-2/3 mx-auto" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (type === 'list') {
    return (
      <div className={`space-y-4 ${className}`}>
        {Array.from({ length: count }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 bg-gray-200 rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/4" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (type === 'table') {
    return (
      <Card className={`animate-pulse ${className}`}>
        <CardContent className="p-6">
          <div className="space-y-3">
            {Array.from({ length: count }).map((_, i) => (
              <div key={i} className="flex gap-4">
                <div className="h-4 bg-gray-200 rounded flex-1" />
                <div className="h-4 bg-gray-200 rounded flex-1" />
                <div className="h-4 bg-gray-200 rounded flex-1" />
                <div className="h-4 bg-gray-200 rounded w-20" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Default: card type
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i} className="animate-pulse">
          <CardHeader>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="h-3 bg-gray-200 rounded w-1/2" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="h-3 bg-gray-200 rounded" />
              <div className="h-3 bg-gray-200 rounded" />
              <div className="h-3 bg-gray-200 rounded w-5/6" />
              <div className="flex gap-2 mt-4">
                <div className="h-6 bg-gray-200 rounded w-16" />
                <div className="h-6 bg-gray-200 rounded w-16" />
                <div className="h-6 bg-gray-200 rounded w-16" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
