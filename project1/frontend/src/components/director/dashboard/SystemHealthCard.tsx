import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Server, Zap, CheckCircle2, AlertCircle } from 'lucide-react'

interface SystemStatus {
  name: string
  status: 'healthy' | 'warning' | 'error'
  uptime: string
  responseTime?: string
}

interface SystemHealthCardProps {
  systems?: SystemStatus[]
}

export default function SystemHealthCard({ systems }: SystemHealthCardProps) {
  const defaultSystems: SystemStatus[] = systems || [
    { name: 'API Gateway', status: 'healthy', uptime: '99.9%', responseTime: '45ms' },
    { name: 'User Service', status: 'healthy', uptime: '99.8%', responseTime: '32ms' },
    { name: 'Application Service', status: 'healthy', uptime: '99.7%', responseTime: '58ms' },
    { name: 'Database', status: 'healthy', uptime: '100%', responseTime: '12ms' },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-600 bg-green-100'
      case 'warning': return 'text-yellow-600 bg-yellow-100'
      case 'error': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return CheckCircle2
      case 'warning': return AlertCircle
      case 'error': return AlertCircle
      default: return CheckCircle2
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <Card className="border-0 shadow-xl overflow-hidden dark:bg-gray-800">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20">
          <CardTitle className="flex items-center gap-2">
            <div className="p-2 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-lg shadow-lg">
              <Server className="h-5 w-5 text-white" />
            </div>
            <span className="dark:text-white">وضعیت سیستم</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-3">
            {defaultSystems.map((system, index) => {
              const StatusIcon = getStatusIcon(system.status)
              return (
                <motion.div
                  key={system.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  whileHover={{ x: 4 }}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${getStatusColor(system.status)} transition-transform group-hover:scale-110`}>
                      <StatusIcon className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">{system.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Uptime: {system.uptime}</p>
                    </div>
                  </div>
                  {system.responseTime && (
                    <div className="text-left">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">{system.responseTime}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">زمان پاسخ</p>
                    </div>
                  )}
                </motion.div>
              )
            })}
          </div>

          {/* Overall Status */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="mt-6 p-5 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl border-2 border-green-200 dark:border-green-800"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-green-600 to-emerald-600 rounded-lg shadow-lg">
                  <Zap className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="font-bold text-gray-900 dark:text-white">وضعیت کلی</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">همه سرویس‌ها عملکرد مطلوب دارند</p>
                </div>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-full text-sm font-semibold shadow-lg">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                آنلاین
              </div>
            </div>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
