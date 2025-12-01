import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowUpRight, ArrowDownRight, TrendingUp } from 'lucide-react'

interface ComparisonData {
  label: string
  current: number
  previous: number
  unit?: string
}

interface ComparisonCardProps {
  title: string
  data: ComparisonData[]
  bgGradient?: string
}

export default function ComparisonCard({ 
  title, 
  data,
  bgGradient = 'from-indigo-50 to-purple-50'
}: ComparisonCardProps) {
  
  const calculateChange = (current: number, previous: number) => {
    if (previous === 0) return 0
    return ((current - previous) / previous) * 100
  }

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
              <TrendingUp className="h-5 w-5" />
            </div>
            <span>{title}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-4">
            {data.map((item, index) => {
              const change = calculateChange(item.current, item.previous)
              const isPositive = change >= 0
              
              return (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-medium text-gray-700">{item.label}</p>
                    <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
                      isPositive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {isPositive ? (
                        <ArrowUpRight className="h-3 w-3" />
                      ) : (
                        <ArrowDownRight className="h-3 w-3" />
                      )}
                      {Math.abs(change).toFixed(1)}%
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">دوره فعلی</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {item.current}
                        {item.unit && <span className="text-sm text-gray-500 mr-1">{item.unit}</span>}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">دوره قبل</p>
                      <p className="text-2xl font-bold text-gray-500">
                        {item.previous}
                        {item.unit && <span className="text-sm text-gray-400 mr-1">{item.unit}</span>}
                      </p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-3 relative w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min((item.current / (item.current + item.previous)) * 100, 100)}%` }}
                      transition={{ delay: 0.3 + index * 0.1, duration: 0.8 }}
                      className={`h-2 rounded-full ${isPositive ? 'bg-green-500' : 'bg-red-500'}`}
                    />
                  </div>
                </motion.div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
