import { motion } from 'framer-motion'
import { X, Bell, CheckCircle, AlertCircle, Info, Trophy } from 'lucide-react'

interface CustomToastProps {
  type: 'success' | 'error' | 'info' | 'achievement'
  title: string
  message?: string
  onClose: () => void
  onView?: () => void
}

export default function CustomToast({ type, title, message, onClose, onView }: CustomToastProps) {
  const getConfig = () => {
    switch (type) {
      case 'success':
        return {
          icon: CheckCircle,
          gradient: 'from-green-500 to-emerald-500',
          bg: 'from-green-50 to-emerald-50',
          iconColor: 'text-green-600'
        }
      case 'error':
        return {
          icon: AlertCircle,
          gradient: 'from-red-500 to-rose-500',
          bg: 'from-red-50 to-rose-50',
          iconColor: 'text-red-600'
        }
      case 'achievement':
        return {
          icon: Trophy,
          gradient: 'from-amber-500 to-yellow-500',
          bg: 'from-amber-50 to-yellow-50',
          iconColor: 'text-amber-600'
        }
      default:
        return {
          icon: Info,
          gradient: 'from-blue-500 to-cyan-500',
          bg: 'from-blue-50 to-cyan-50',
          iconColor: 'text-blue-600'
        }
    }
  }

  const config = getConfig()
  const Icon = config.icon

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      className="relative max-w-md w-full"
    >
      {/* Gradient border */}
      <div className={`absolute inset-0 bg-gradient-to-r ${config.gradient} rounded-lg p-[2px]`}>
        <div className="w-full h-full bg-white rounded-lg" />
      </div>

      {/* Content */}
      <div className={`relative bg-gradient-to-r ${config.bg} rounded-lg shadow-lg p-4`}>
        <div className="flex items-start gap-3">
          {/* Icon */}
          <div className={`flex-shrink-0 w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm`}>
            <Icon className={`w-5 h-5 ${config.iconColor}`} />
          </div>

          {/* Text */}
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-gray-900 text-sm">{title}</h4>
            {message && (
              <p className="text-xs text-gray-600 mt-1 line-clamp-2">{message}</p>
            )}
            {onView && (
              <button
                onClick={onView}
                className="text-xs font-medium text-blue-600 hover:text-blue-700 mt-2"
              >
                مشاهده →
              </button>
            )}
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  )
}
