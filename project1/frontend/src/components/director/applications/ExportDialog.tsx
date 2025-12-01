import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { 
  X, 
  Download, 
  FileSpreadsheet,
  FileText,
  CheckSquare
} from 'lucide-react'

interface ExportDialogProps {
  isOpen: boolean
  onClose: () => void
  onExport: (format: 'excel' | 'csv' | 'pdf', fields: string[]) => void
  totalCount: number
}

const AVAILABLE_FIELDS = [
  { key: 'firstName', label: 'نام' },
  { key: 'lastName', label: 'نام خانوادگی' },
  { key: 'email', label: 'ایمیل' },
  { key: 'phoneNumber', label: 'تلفن' },
  { key: 'university', label: 'دانشگاه' },
  { key: 'major', label: 'رشته' },
  { key: 'degree', label: 'مقطع' },
  { key: 'studentId', label: 'شماره دانشجویی' },
  { key: 'status', label: 'وضعیت' },
  { key: 'submittedAt', label: 'تاریخ ثبت' },
  { key: 'reviewNotes', label: 'یادداشت بررسی' },
]

export default function ExportDialog({ isOpen, onClose, onExport, totalCount }: ExportDialogProps) {
  const [selectedFormat, setSelectedFormat] = useState<'excel' | 'csv' | 'pdf'>('excel')
  const [selectedFields, setSelectedFields] = useState<string[]>(
    AVAILABLE_FIELDS.map(f => f.key)
  )

  const toggleField = (field: string) => {
    setSelectedFields(prev =>
      prev.includes(field)
        ? prev.filter(f => f !== field)
        : [...prev, field]
    )
  }

  const toggleAll = () => {
    if (selectedFields.length === AVAILABLE_FIELDS.length) {
      setSelectedFields([])
    } else {
      setSelectedFields(AVAILABLE_FIELDS.map(f => f.key))
    }
  }

  const handleExport = () => {
    onExport(selectedFormat, selectedFields)
    onClose()
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white rounded-t-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Download className="h-6 w-6" />
                <div>
                  <h2 className="text-xl font-bold">خروجی گرفتن از درخواست‌ها</h2>
                  <p className="text-sm text-blue-100">{totalCount} درخواست</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Format Selection */}
            <div>
              <h3 className="font-bold text-lg mb-3">فرمت خروجی</h3>
              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={() => setSelectedFormat('excel')}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    selectedFormat === 'excel'
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-green-300'
                  }`}
                >
                  <FileSpreadsheet className={`h-8 w-8 mx-auto mb-2 ${
                    selectedFormat === 'excel' ? 'text-green-600' : 'text-gray-400'
                  }`} />
                  <p className="font-medium text-sm">Excel</p>
                  <p className="text-xs text-gray-500">.xlsx</p>
                </button>

                <button
                  onClick={() => setSelectedFormat('csv')}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    selectedFormat === 'csv'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <FileText className={`h-8 w-8 mx-auto mb-2 ${
                    selectedFormat === 'csv' ? 'text-blue-600' : 'text-gray-400'
                  }`} />
                  <p className="font-medium text-sm">CSV</p>
                  <p className="text-xs text-gray-500">.csv</p>
                </button>

                <button
                  onClick={() => setSelectedFormat('pdf')}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    selectedFormat === 'pdf'
                      ? 'border-red-500 bg-red-50'
                      : 'border-gray-200 hover:border-red-300'
                  }`}
                >
                  <FileText className={`h-8 w-8 mx-auto mb-2 ${
                    selectedFormat === 'pdf' ? 'text-red-600' : 'text-gray-400'
                  }`} />
                  <p className="font-medium text-sm">PDF</p>
                  <p className="text-xs text-gray-500">.pdf</p>
                </button>
              </div>
            </div>

            {/* Fields Selection */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-lg">فیلدهای خروجی</h3>
                <Button
                  onClick={toggleAll}
                  variant="outline"
                  size="sm"
                >
                  <CheckSquare className="h-4 w-4 ml-2" />
                  {selectedFields.length === AVAILABLE_FIELDS.length ? 'لغو انتخاب همه' : 'انتخاب همه'}
                </Button>
              </div>

              <Card>
                <CardContent className="p-4">
                  <div className="grid grid-cols-2 gap-3 max-h-60 overflow-y-auto">
                    {AVAILABLE_FIELDS.map(field => (
                      <label
                        key={field.key}
                        className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={selectedFields.includes(field.key)}
                          onChange={() => toggleField(field.key)}
                          className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                        />
                        <span className="text-sm">{field.label}</span>
                      </label>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <p className="text-sm text-gray-500 mt-2">
                {selectedFields.length} فیلد انتخاب شده
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button
                onClick={handleExport}
                disabled={selectedFields.length === 0}
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <Download className="h-5 w-5 ml-2" />
                دانلود فایل
              </Button>
              <Button
                onClick={onClose}
                variant="outline"
                className="flex-1"
              >
                انصراف
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
