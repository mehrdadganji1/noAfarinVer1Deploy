import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp, BarChart3 } from 'lucide-react'

interface ChartData {
  label: string
  value: number
  color: string
}

interface AnalyticsChartProps {
  title: string
  data?: ChartData[]
  type?: 'bar' | 'line'
}

export default function AnalyticsChart({ title, data, type = 'bar' }: AnalyticsChartProps) {
  const defaultData: ChartData[] = data || [
    { label: 'فروردین', value: 45, color: 'bg-blue-500' },
    { label: 'اردیبهشت', value: 62, color: 'bg-purple-500' },
    { label: 'خرداد', value: 78, color: 'bg-pink-500' },
    { label: 'تیر', value: 85, color: 'bg-orange-500' },
    { label: 'مرداد', value: 92, color: 'bg-green-500' },
    { label: 'شهریور', value: 105, color: 'bg-cyan-500' },
  ]

  const maxValue = Math.max(...defaultData.map(d => d.value))

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <Card className="border-0 shadow-xl overflow-hidden dark:bg-gray-800">
        <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20">
          <CardTitle className="flex items-center gap-2">
            <div className="p-2 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg shadow-lg">
              <BarChart3 className="h-5 w-5 text-white" />
            </div>
            <span className="dark:text-white">{title}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-5">
            {defaultData.map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: 1, scaleX: 1 }}
                transition={{ delay: 0.4 + index * 0.1, duration: 0.5 }}
                className="space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{item.label}</span>
                  <span className="text-lg font-bold text-gray-900 dark:text-white">{item.value}</span>
                </div>
                <div className="relative w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 overflow-hidden shadow-inner">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(item.value / maxValue) * 100}%` }}
                    transition={{ delay: 0.5 + index * 0.1, duration: 0.8, ease: 'easeOut' }}
                    className={`${item.color} h-4 rounded-full relative overflow-hidden shadow-lg`}
                  >
                    {/* Shimmer Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Summary Stats */}
          <div className="mt-8 grid grid-cols-3 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-2xl border-2 border-blue-200 dark:border-blue-800"
            >
              <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">میانگین</p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {Math.round(defaultData.reduce((acc, d) => acc + d.value, 0) / defaultData.length)}
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1 }}
              className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl border-2 border-green-200 dark:border-green-800"
            >
              <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">بیشترین</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">{maxValue}</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
              className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl border-2 border-purple-200 dark:border-purple-800"
            >
              <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">رشد</p>
              <div className="flex items-center gap-1">
                <TrendingUp className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">+24%</p>
              </div>
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
