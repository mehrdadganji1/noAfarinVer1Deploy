import { motion } from 'framer-motion'
import { Bell, CheckCircle, Search, Filter } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface NotificationEmptyStateProps {
  type: 'no-notifications' | 'no-results' | 'all-read'
  onReset?: () => void
}

export default function NotificationEmptyState({ type, onReset }: NotificationEmptyStateProps) {
  const configs = {
    'no-notifications': {
      icon: Bell,
      title: 'هیچ اعلانی وجود ندارد',
      description: 'شما هنوز هیچ اعلانی دریافت نکرده‌اید',
      color: 'text-gray-400',
      showReset: false
    },
    'no-results': {
      icon: Search,
      title: 'نتیجه‌ای یافت نشد',
      description: 'با فیلترها یا جستجوی دیگری امتحان کنید',
      color: 'text-blue-400',
      showReset: true
    },
    'all-read': {
      icon: CheckCircle,
      title: 'همه اعلانات خوانده شده!',
      description: 'شما تمام اعلانات خود را بررسی کرده‌اید',
      color: 'text-green-400',
      showReset: false
    }
  }

  const config = configs[type]
  const Icon = config.icon

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center py-16 px-4"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.1, type: 'spring' }}
        className={`w-24 h-24 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center mb-6`}
      >
        <Icon className={`w-12 h-12 ${config.color}`} />
      </motion.div>

      <h3 className="text-xl font-bold text-gray-900 mb-2">{config.title}</h3>
      <p className="text-gray-600 text-center mb-6 max-w-md">{config.description}</p>

      {config.showReset && onReset && (
        <Button
          onClick={onReset}
          variant="outline"
          className="gap-2"
        >
          <Filter className="w-4 h-4" />
          حذف فیلترها
        </Button>
      )}
    </motion.div>
  )
}
