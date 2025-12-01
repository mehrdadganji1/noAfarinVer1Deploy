import { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Save, LucideIcon, Sparkles } from 'lucide-react'

interface FormPageLayoutProps {
  title: string
  description: string
  icon: LucideIcon
  gradient: string
  onBack: () => void
  onCancel: () => void
  onSubmit: (e?: React.FormEvent) => void
  submitLabel: string
  isSubmitting?: boolean
  children: ReactNode
}

export function FormPageLayout({
  title,
  description,
  icon: Icon,
  gradient,
  onBack,
  onCancel,
  onSubmit,
  submitLabel,
  isSubmitting = false,
  children,
}: FormPageLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Premium Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-2xl bg-gradient-to-r p-8 shadow-2xl"
          style={{ backgroundImage: `linear-gradient(to right, ${gradient})` }}
        >
          {/* Animated Background */}
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -mr-48 -mt-48"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full -ml-32 -mb-32"></div>
          
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onBack}
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm"
                >
                  <ArrowLeft className="ml-2 h-4 w-4" />
                  بازگشت
                </Button>
                <div>
                  <h1 className="text-3xl font-bold text-white">{title}</h1>
                  <p className="text-white/90 mt-1">{description}</p>
                </div>
              </div>
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                className="p-3 bg-white/20 backdrop-blur-sm rounded-xl"
              >
                <Icon className="h-8 w-8 text-white" />
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Form Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {children}
        </motion.div>

        {/* Sticky Action Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="sticky bottom-6 z-50"
        >
          <div className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl border border-gray-200 p-4">
            <div className="flex items-center justify-between max-w-7xl mx-auto">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Sparkles className="h-4 w-4 text-yellow-500" />
                <span>همه تغییرات به صورت خودکار ذخیره می‌شود</span>
              </div>
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onCancel}
                  disabled={isSubmitting}
                  className="border-gray-300 hover:bg-gray-50"
                >
                  انصراف
                </Button>
                <Button
                  onClick={(e) => {
                    e.preventDefault()
                    onSubmit(e)
                  }}
                  disabled={isSubmitting}
                  className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white shadow-lg"
                >
                  <Save className="ml-2 h-4 w-4" />
                  {submitLabel}
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
