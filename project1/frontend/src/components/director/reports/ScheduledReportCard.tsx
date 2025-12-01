import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { FileText, Settings, Clock, CheckCircle2, XCircle } from 'lucide-react'

interface ScheduledReport {
  id: string
  name: string
  schedule: string
  status: 'active' | 'inactive'
  nextRun?: string
}

interface ScheduledReportCardProps {
  report: ScheduledReport
  onSettings?: (id: string) => void
  onToggle?: (id: string) => void
}

export default function ScheduledReportCard({ 
  report, 
  onSettings,
  onToggle 
}: ScheduledReportCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      whileHover={{ scale: 1.01 }}
      className="flex items-center justify-between p-5 bg-gradient-to-r from-gray-50 to-white rounded-xl border-2 border-gray-200 hover:border-purple-300 transition-all shadow-sm hover:shadow-md"
    >
      <div className="flex items-center gap-4">
        {/* Icon */}
        <div className={`p-3 rounded-xl ${
          report.status === 'active' 
            ? 'bg-gradient-to-br from-green-100 to-emerald-100' 
            : 'bg-gray-100'
        }`}>
          <FileText className={`h-5 w-5 ${
            report.status === 'active' ? 'text-green-600' : 'text-gray-600'
          }`} />
        </div>
        
        {/* Info */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-1">{report.name}</h4>
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{report.schedule}</span>
            </div>
            {report.nextRun && (
              <div className="flex items-center gap-1 text-xs text-purple-600">
                <span>اجرای بعدی: {report.nextRun}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        {/* Status Badge */}
        <button
          onClick={() => onToggle?.(report.id)}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all ${
            report.status === 'active'
              ? 'bg-green-100 text-green-800 hover:bg-green-200'
              : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
          }`}
        >
          {report.status === 'active' ? (
            <>
              <CheckCircle2 className="h-3 w-3" />
              فعال
            </>
          ) : (
            <>
              <XCircle className="h-3 w-3" />
              غیرفعال
            </>
          )}
        </button>

        {/* Settings Button */}
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => onSettings?.(report.id)}
          className="border-2 hover:border-purple-300 hover:bg-purple-50"
        >
          <Settings className="h-4 w-4 ml-2" />
          تنظیمات
        </Button>
      </div>
    </motion.div>
  )
}
