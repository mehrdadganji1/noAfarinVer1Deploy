import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Loader2, Briefcase, Building2, MapPin, Calendar, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { WorkExperience } from '@/types/profile'

interface AddExperienceModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (experience: WorkExperience) => Promise<void>
  initialData?: WorkExperience
}

export default function AddExperienceModal({
  isOpen,
  onClose,
  onSubmit,
  initialData
}: AddExperienceModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<WorkExperience>({
    company: '',
    position: '',
    startDate: '',
    endDate: '',
    current: false,
    description: '',
    location: ''
  })

  useEffect(() => {
    if (initialData) {
      setFormData(initialData)
    } else {
      setFormData({
        company: '',
        position: '',
        startDate: '',
        endDate: '',
        current: false,
        description: '',
        location: ''
      })
    }
  }, [initialData, isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      await onSubmit(formData)
      onClose()
    } catch (error) {
      console.error('Error submitting experience:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" dir="rtl">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', duration: 0.5 }}
            className="relative bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden"
          >
            {/* Header with gradient */}
            <div className="relative bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 px-8 py-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                    <Briefcase className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">
                      {initialData ? 'ویرایش سابقه شغلی' : 'افزودن سابقه شغلی'}
                    </h2>
                    <p className="text-white/80 text-sm mt-1">
                      تجربیات کاری خود را به پروفایل اضافه کنید
                    </p>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="text-white/80 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </motion.button>
              </div>
            </div>

            {/* Form Content */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <Label className="flex items-center gap-2 text-gray-700 mb-1.5 text-sm">
                    <Briefcase className="w-3.5 h-3.5 text-purple-600" />
                    عنوان شغلی <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    name="position"
                    value={formData.position}
                    onChange={handleChange}
                    placeholder="مثال: توسعه‌دهنده فرانت‌اند"
                    className="h-10"
                    required
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 }}
                >
                  <Label className="flex items-center gap-2 text-gray-700 mb-1.5 text-sm">
                    <Building2 className="w-3.5 h-3.5 text-purple-600" />
                    نام شرکت <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    placeholder="مثال: شرکت فناوری"
                    className="h-10"
                    required
                  />
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Label className="flex items-center gap-2 text-gray-700 mb-1.5 text-sm">
                  <MapPin className="w-3.5 h-3.5 text-purple-600" />
                  موقعیت مکانی
                </Label>
                <Input
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="مثال: تهران، ایران"
                  className="h-10"
                />
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.25 }}
                >
                  <Label className="flex items-center gap-2 text-gray-700 mb-1.5 text-sm">
                    <Calendar className="w-3.5 h-3.5 text-purple-600" />
                    تاریخ شروع <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    className="h-10"
                    required
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <Label className="flex items-center gap-2 text-gray-700 mb-1.5 text-sm">
                    <Calendar className="w-3.5 h-3.5 text-purple-600" />
                    تاریخ پایان
                  </Label>
                  <Input
                    type="date"
                    name="endDate"
                    value={formData.endDate || ''}
                    onChange={handleChange}
                    disabled={formData.current}
                    className="h-10"
                  />
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className="flex items-center gap-2 p-3 bg-purple-50 rounded-lg"
              >
                <input
                  type="checkbox"
                  id="current"
                  name="current"
                  checked={formData.current}
                  onChange={handleChange}
                  className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                />
                <label htmlFor="current" className="text-xs text-gray-700 font-medium">
                  در حال حاضر در این شرکت مشغول به کار هستم
                </label>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Label className="flex items-center gap-2 text-gray-700 mb-1.5 text-sm">
                  <FileText className="w-3.5 h-3.5 text-purple-600" />
                  توضیحات
                </Label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  placeholder="شرح وظایف و دستاوردها..."
                />
              </motion.div>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45 }}
                className="flex gap-3 pt-2"
              >
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 h-10 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                      در حال ذخیره...
                    </>
                  ) : (
                    initialData ? 'به‌روزرسانی' : 'افزودن'
                  )}
                </Button>
                <Button
                  type="button"
                  onClick={onClose}
                  variant="outline"
                  disabled={isSubmitting}
                  className="px-6 h-10 rounded-lg"
                >
                  انصراف
                </Button>
              </motion.div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
