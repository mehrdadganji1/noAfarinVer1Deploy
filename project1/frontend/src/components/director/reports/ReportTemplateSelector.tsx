import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, Sparkles } from 'lucide-react'

import { Zap, BarChart3, TrendingUp, Palette, LucideIcon } from 'lucide-react'

interface Template {
  id: string
  name: string
  description: string
  icon: LucideIcon
  color: string
}

interface ReportTemplateSelectorProps {
  onCreateCustom?: () => void
}

export default function ReportTemplateSelector({ onCreateCustom }: ReportTemplateSelectorProps) {
  const templates: Template[] = [
    { id: '1', name: 'گزارش سریع', description: 'گزارش خلاصه از آمار کلیدی', icon: Zap, color: 'text-yellow-600' },
    { id: '2', name: 'گزارش جامع', description: 'تحلیل کامل تمام بخش‌ها', icon: BarChart3, color: 'text-blue-600' },
    { id: '3', name: 'گزارش مقایسه‌ای', description: 'مقایسه دوره‌های زمانی', icon: TrendingUp, color: 'text-green-600' },
    { id: '4', name: 'گزارش سفارشی', description: 'ایجاد گزارش با فیلدهای دلخواه', icon: Palette, color: 'text-purple-600' },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="border-0 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-t-xl">
          <CardTitle className="flex items-center gap-2">
            <div className="p-2 bg-purple-600 rounded-lg">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <span>ایجاد گزارش جدید</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {templates.map((template, index) => {
              const IconComponent = template.icon
              return (
                <motion.button
                  key={template.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onCreateCustom}
                  className="p-4 bg-gradient-to-br from-gray-50 to-white rounded-xl border-2 border-gray-200 hover:border-purple-300 hover:shadow-lg transition-all text-right"
                >
                  <div className="mb-3">
                    <IconComponent className={`h-10 w-10 ${template.color}`} />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-1">{template.name}</h4>
                  <p className="text-xs text-gray-600">{template.description}</p>
                </motion.button>
              )
            })}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-6"
          >
            <Button
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg"
              onClick={onCreateCustom}
            >
              <Plus className="h-5 w-5 ml-2" />
              ایجاد گزارش سفارشی پیشرفته
            </Button>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
