import { motion } from 'framer-motion'
import { TrendingUp, ArrowUpRight } from 'lucide-react'
import { ChartCard } from '../base'
import { cn } from '@/lib/utils'

interface GrowthChartProps {
  loading?: boolean
  delay?: number
}

export function GrowthChart({ loading = false, delay = 0 }: GrowthChartProps) {
  // Mock data - در پروژه واقعی از API دریافت می‌شود
  const months = [
    { name: 'فروردین', value: 45, growth: 0 },
    { name: 'اردیبهشت', value: 52, growth: 15.5 },
    { name: 'خرداد', value: 61, growth: 17.3 },
    { name: 'تیر', value: 73, growth: 19.7 },
    { name: 'مرداد', value: 89, growth: 21.9 },
    { name: 'شهریور', value: 105, growth: 18.0 },
  ]

  const maxValue = Math.max(...months.map(m => m.value))
  const avgGrowth = months.slice(1).reduce((sum, m) => sum + m.growth, 0) / (months.length - 1)

  return (
    <ChartCard
      title="رشد کاربران"
      subtitle="روند ثبت‌نام کاربران جدید"
      icon={TrendingUp}
      iconColor="text-blue-600 dark:text-blue-400"
      headerGradient="from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20"
      loading={loading}
      delay={delay}
    >
      <div className="space-y-4">
        {months.map((month, index) => (
          <motion.div
            key={month.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: delay + 0.1 + index * 0.08 }}
            className="space-y-2"
          >
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <span className="text-gray-600 dark:text-gray-400">{month.name}</span>
                {month.growth > 0 && (
                  <span className="flex items-center text-xs text-emerald-600 dark:text-emerald-400">
                    <ArrowUpRight className="h-3 w-3" />
                    {month.growth.toFixed(1)}%
                  </span>
                )}
              </div>
              <span className="font-bold text-gray-900 dark:text-white">
                {month.value.toLocaleString('fa-IR')} کاربر
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(month.value / maxValue) * 100}%` }}
                transition={{ delay: delay + 0.2 + index * 0.08, duration: 0.6, ease: 'easeOut' }}
                className="bg-gradient-to-r from-blue-500 to-cyan-500 h-3 rounded-full"
              />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Summary Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: delay + 0.8 }}
        className="mt-6 p-4 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl border border-blue-200 dark:border-blue-800"
      >
        <div className="flex items-center justify-between">
          <div>
            <span className="text-sm text-gray-600 dark:text-gray-400">میانگین رشد ماهانه</span>
            <div className="flex items-center gap-2 mt-1">
              <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                +{avgGrowth.toFixed(1)}%
              </span>
            </div>
          </div>
          <div className="text-left">
            <span className="text-sm text-gray-600 dark:text-gray-400">کل کاربران جدید</span>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
              {(months[months.length - 1].value - months[0].value).toLocaleString('fa-IR')}
            </p>
          </div>
        </div>
      </motion.div>
    </ChartCard>
  )
}

export default GrowthChart
