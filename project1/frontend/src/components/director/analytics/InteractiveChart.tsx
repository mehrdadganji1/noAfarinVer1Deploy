import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LucideIcon } from 'lucide-react'
import { useState } from 'react'

interface ChartDataPoint {
  label: string
  value: number
  color: string
  details?: string
}

interface InteractiveChartProps {
  title: string
  icon: LucideIcon
  data: ChartDataPoint[]
  type?: 'bar' | 'progress'
  bgGradient?: string
}

export default function InteractiveChart({ 
  title, 
  icon: Icon, 
  data,
  type = 'bar',
  bgGradient = 'from-purple-50 to-pink-50'
}: InteractiveChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const maxValue = Math.max(...data.map(d => d.value))

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
        <CardHeader className={`bg-gradient-to-r ${bgGradient} rounded-t-xl`}>
          <CardTitle className="flex items-center gap-2">
            <div className="p-2 bg-white/50 backdrop-blur-sm rounded-lg">
              <Icon className="h-5 w-5" />
            </div>
            <span>{title}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-4">
            {data.map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: 1, scaleX: 1 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                className="space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">{item.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-gray-900">{item.value}</span>
                    {hoveredIndex === index && item.details && (
                      <motion.span
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-xs text-gray-500"
                      >
                        {item.details}
                      </motion.span>
                    )}
                  </div>
                </div>
                <div className="relative w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(item.value / maxValue) * 100}%` }}
                    transition={{ delay: 0.2 + index * 0.1, duration: 0.8, ease: 'easeOut' }}
                    className={`h-4 rounded-full relative overflow-hidden ${item.color} ${
                      hoveredIndex === index ? 'shadow-lg' : ''
                    }`}
                    style={{
                      transform: hoveredIndex === index ? 'scaleY(1.2)' : 'scaleY(1)',
                      transition: 'transform 0.2s ease'
                    }}
                  >
                    {/* Shimmer Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer" />
                    
                    {/* Value Label */}
                    {item.value > 0 && (
                      <div className="absolute inset-0 flex items-center justify-end pr-3">
                        <span className="text-xs font-bold text-white drop-shadow-md">
                          {Math.round((item.value / maxValue) * 100)}%
                        </span>
                      </div>
                    )}
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Summary */}
          <div className="mt-6 p-4 bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600">مجموع</p>
                <p className="text-xl font-bold text-gray-900">
                  {data.reduce((acc, d) => acc + d.value, 0)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600">میانگین</p>
                <p className="text-xl font-bold text-gray-900">
                  {Math.round(data.reduce((acc, d) => acc + d.value, 0) / data.length)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600">بیشترین</p>
                <p className="text-xl font-bold text-gray-900">{maxValue}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
