import { Button } from '@/components/ui/button'
import { ArrowRight, Download } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import NotificationAnalytics from '@/components/notifications/NotificationAnalytics'

export default function NotificationAnalyticsPage() {
  const navigate = useNavigate()

  const handleExport = () => {
    // TODO: Implement export functionality
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/notifications')}
              className="gap-2"
            >
              <ArrowRight className="h-4 w-4" />
              بازگشت
            </Button>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">
            آمار و تحلیل اعلانات
          </h1>
          <p className="text-gray-600 mt-2">
            بررسی عملکرد و تعامل شما با اعلانات
          </p>
        </div>

        <Button onClick={handleExport} className="gap-2">
          <Download className="h-4 w-4" />
          دانلود گزارش
        </Button>
      </div>

      {/* Analytics Component */}
      <NotificationAnalytics />
    </div>
  )
}
