import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { LucideIcon, Download, Eye, Calendar } from 'lucide-react'

interface ReportCardProps {
  title: string
  description: string
  icon: LucideIcon
  items: string[]
  bgGradient: string
  iconColor: string
  onView?: () => void
  onDownload?: () => void
  lastUpdated?: string
}

export default function ReportCard({
  title,
  description,
  icon: Icon,
  items,
  bgGradient,
  iconColor,
  onView,
  onDownload,
  lastUpdated = 'امروز'
}: ReportCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="border-0 shadow-lg hover:shadow-2xl transition-all overflow-hidden group h-full">
        {/* Header with Gradient */}
        <CardHeader className={`bg-gradient-to-r ${bgGradient} rounded-t-xl relative overflow-hidden`}>
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full blur-2xl" />
          </div>
          
          <CardTitle className="flex items-center gap-3 relative z-10">
            <div className="p-3 bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg group-hover:scale-110 transition-transform">
              <Icon className={`h-6 w-6 ${iconColor}`} />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-white">{title}</h3>
              <p className="text-xs text-white/80 mt-1 flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                آخرین بروزرسانی: {lastUpdated}
              </p>
            </div>
          </CardTitle>
        </CardHeader>

        <CardContent className="pt-6">
          {/* Description */}
          <p className="text-sm text-gray-600 mb-4">{description}</p>
          
          {/* Items List */}
          <div className="space-y-2 mb-6">
            {items.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className={`w-2 h-2 rounded-full ${bgGradient}`} />
                <span className="text-sm text-gray-700">{item}</span>
              </motion.div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              className="flex-1 border-2 hover:bg-gray-50"
              onClick={onView}
            >
              <Eye className="h-4 w-4 ml-2" />
              مشاهده
            </Button>
            <Button 
              className={`flex-1 ${bgGradient} text-white hover:opacity-90 shadow-lg`}
              onClick={onDownload}
            >
              <Download className="h-4 w-4 ml-2" />
              دانلود
            </Button>
          </div>
        </CardContent>

        {/* Bottom Accent */}
        <div className={`h-1 ${bgGradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300`} />
      </Card>
    </motion.div>
  )
}
