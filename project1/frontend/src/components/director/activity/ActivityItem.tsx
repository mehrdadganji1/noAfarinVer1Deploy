import { motion } from 'framer-motion'
import { LucideIcon, Users, Clock } from 'lucide-react'

interface ActivityItemProps {
  id: string
  type: 'user' | 'application' | 'event' | 'team' | 'system' | 'error' | 'success'
  title: string
  description: string
  user: string
  timestamp: string
  status: 'success' | 'warning' | 'error' | 'info'
  icon: LucideIcon
  statusIcon: LucideIcon
  typeColor: string
  statusColor: string
  delay?: number
}

export default function ActivityItem({
  title,
  description,
  user,
  timestamp,
  icon: Icon,
  statusIcon: StatusIcon,
  typeColor,
  statusColor,
  delay = 0
}: ActivityItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.3 }}
      whileHover={{ scale: 1.01, x: 5 }}
      className="flex items-start gap-4 p-5 bg-gradient-to-r from-white to-gray-50 rounded-xl hover:shadow-lg transition-all duration-300 border-2 border-gray-100 hover:border-purple-200 group"
    >
      {/* Icon */}
      <div className={`p-3 ${typeColor} rounded-xl group-hover:scale-110 transition-transform shadow-sm`}>
        <Icon className="h-5 w-5" />
      </div>
      
      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between mb-2">
          <h4 className="font-semibold text-gray-900 group-hover:text-purple-700 transition-colors">
            {title}
          </h4>
          <div className={`flex items-center gap-1 px-3 py-1 ${statusColor} rounded-full shadow-sm`}>
            <StatusIcon className="h-3 w-3" />
          </div>
        </div>
        
        <p className="text-sm text-gray-600 mb-3 leading-relaxed">{description}</p>
        
        <div className="flex items-center gap-4 text-xs text-gray-500">
          <span className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-full">
            <Users className="h-3 w-3" />
            {user}
          </span>
          <span className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-full">
            <Clock className="h-3 w-3" />
            {timestamp}
          </span>
        </div>
      </div>
    </motion.div>
  )
}
