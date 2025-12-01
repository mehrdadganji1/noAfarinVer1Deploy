import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FileText, Target, Lightbulb, Users as UsersIcon } from 'lucide-react'

interface TeamInfoCardProps {
  team: any
}

export default function TeamInfoCard({ team }: TeamInfoCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05 }}
    >
      <Card className="border-0 shadow">
        <CardHeader className="pb-3 bg-purple-50">
          <CardTitle className="text-sm flex items-center gap-2">
            <FileText className="h-4 w-4" />
            درباره تیم
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-3 space-y-3">
          <div>
            <div className="flex items-center gap-2 text-xs text-gray-600 mb-1">
              <FileText className="h-3 w-3" />
              <span className="font-semibold">توضیحات</span>
            </div>
            <p className="text-sm text-gray-700">{team?.description || 'توضیحاتی ثبت نشده است'}</p>
          </div>

          <div className="border-t pt-3">
            <div className="flex items-center gap-2 text-xs text-gray-600 mb-1">
              <Target className="h-3 w-3" />
              <span className="font-semibold">مشکل</span>
            </div>
            <p className="text-sm text-gray-700">{team?.problemStatement || 'مشکلی تعریف نشده است'}</p>
          </div>

          <div className="border-t pt-3">
            <div className="flex items-center gap-2 text-xs text-gray-600 mb-1">
              <Lightbulb className="h-3 w-3" />
              <span className="font-semibold">راه‌حل</span>
            </div>
            <p className="text-sm text-gray-700">{team?.solution || 'راه‌حلی ارائه نشده است'}</p>
          </div>

          <div className="border-t pt-3">
            <div className="flex items-center gap-2 text-xs text-gray-600 mb-1">
              <UsersIcon className="h-3 w-3" />
              <span className="font-semibold">بازار هدف</span>
            </div>
            <p className="text-sm text-gray-700">{team?.targetMarket || 'بازار هدف مشخص نشده است'}</p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
