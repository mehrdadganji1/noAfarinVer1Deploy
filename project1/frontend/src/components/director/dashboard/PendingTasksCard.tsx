import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle2, Clock, AlertTriangle, ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

interface Task {
  id: string
  title: string
  count: number
  priority: 'high' | 'medium' | 'low'
  path: string
}

interface PendingTasksCardProps {
  tasks?: Task[]
}

export default function PendingTasksCard({ tasks }: PendingTasksCardProps) {
  const navigate = useNavigate()

  const defaultTasks: Task[] = tasks || [
    { id: '1', title: 'درخواست‌های عضویت', count: 12, priority: 'high', path: '/admin/applications' },
    { id: '2', title: 'بررسی مدارک', count: 8, priority: 'high', path: '/admin/documents' },
    { id: '3', title: 'تایید رویدادها', count: 5, priority: 'medium', path: '/admin/events' },
    { id: '4', title: 'پیام‌های پشتیبانی', count: 3, priority: 'low', path: '/admin/support' },
  ]

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700 border-red-200'
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200'
      case 'low': return 'bg-blue-100 text-blue-700 border-blue-200'
      default: return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return AlertTriangle
      case 'medium': return Clock
      case 'low': return CheckCircle2
      default: return Clock
    }
  }

  const totalTasks = defaultTasks.reduce((acc, task) => acc + task.count, 0)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      <Card className="border-0 shadow-xl overflow-hidden dark:bg-gray-800">
        <CardHeader className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <div className="p-2 bg-gradient-to-br from-red-600 to-orange-600 rounded-lg shadow-lg">
                <AlertTriangle className="h-5 w-5 text-white" />
              </div>
              <span className="dark:text-white">وظایف در انتظار</span>
            </CardTitle>
            <div className="px-4 py-2 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-full text-sm font-bold shadow-lg">
              {totalTasks} مورد
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-3">
            {defaultTasks.map((task, index) => {
              const PriorityIcon = getPriorityIcon(task.priority)
              return (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  whileHover={{ x: 4 }}
                >
                  <Button
                    variant="outline"
                    className="w-full h-auto p-4 border-2 hover:border-purple-300 dark:hover:border-purple-600 hover:shadow-lg transition-all group dark:bg-gray-700/50 dark:border-gray-600"
                    onClick={() => navigate(task.path)}
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg border transition-transform group-hover:scale-110 ${getPriorityColor(task.priority)}`}>
                          <PriorityIcon className="h-4 w-4" />
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900 dark:text-white">{task.title}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {task.count} مورد نیاز به بررسی
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-gray-900 dark:text-white">{task.count}</span>
                        <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-purple-600 group-hover:translate-x-1 transition-all" />
                      </div>
                    </div>
                  </Button>
                </motion.div>
              )
            })}
          </div>

          {/* Quick Action */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="mt-6 p-5 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl border-2 border-purple-200 dark:border-purple-800"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-gray-900 dark:text-white">آماده برای شروع؟</p>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">بیایید وظایف معلق را بررسی کنیم</p>
              </div>
              <Button
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg hover:shadow-xl transition-all"
                onClick={() => navigate('/admin/applications')}
              >
                شروع بررسی
              </Button>
            </div>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
