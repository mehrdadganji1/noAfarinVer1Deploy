import { motion } from 'framer-motion'
import { ClipboardCheck, TrendingUp } from 'lucide-react'

export default function ApplicationsHeader() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-between"
    >
      <div className="flex items-center gap-4">
        <div className="p-3 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl shadow-lg">
          <ClipboardCheck className="h-8 w-8 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            درخواست‌های عضویت
          </h1>
          <p className="text-gray-600 mt-1">
            مدیریت و بررسی درخواست‌های عضویت در باشگاه نوآفرینان
          </p>
        </div>
      </div>
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-sm border-2 border-blue-100"
      >
        <TrendingUp className="h-5 w-5 text-blue-600" />
        <span className="text-sm font-medium text-gray-700">پنل مدیرکل</span>
      </motion.div>
    </motion.div>
  )
}
