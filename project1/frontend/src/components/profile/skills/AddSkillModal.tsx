import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Loader2, Zap, TrendingUp, Award, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { getSkillLevelLabel, getSkillLevelColor, type Skill } from '@/types/profile'

interface AddSkillModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (skill: Skill) => Promise<void>
  initialData?: Skill
}

export default function AddSkillModal({
  isOpen,
  onClose,
  onSubmit,
  initialData
}: AddSkillModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<Skill>({
    name: '',
    level: 'beginner',
    endorsements: 0,
    endorsedBy: []
  })

  useEffect(() => {
    if (initialData) {
      setFormData(initialData)
    } else {
      setFormData({
        name: '',
        level: 'beginner',
        endorsements: 0,
        endorsedBy: []
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
      console.error('Error submitting skill:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  if (!isOpen) return null

  const levels: Skill['level'][] = ['beginner', 'intermediate', 'advanced', 'expert']
  
  const levelIcons = {
    beginner: TrendingUp,
    intermediate: Zap,
    advanced: Award,
    expert: Star
  }

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
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', duration: 0.5 }}
            className="relative bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden"
          >
            {/* Header with gradient */}
            <div className="relative bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 px-8 py-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">
                      {initialData ? 'ویرایش مهارت' : 'افزودن مهارت جدید'}
                    </h2>
                    <p className="text-white/80 text-sm mt-1">
                      مهارت‌های خود را به نمایش بگذارید
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
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Label className="flex items-center gap-2 text-gray-700 mb-1.5 text-sm">
                  <Zap className="w-3.5 h-3.5 text-purple-600" />
                  نام مهارت <span className="text-red-500">*</span>
                </Label>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="مثال: React، Python، UI/UX Design"
                  className="h-10"
                  required
                  disabled={!!initialData}
                />
                {initialData && (
                  <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                    <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                    نام مهارت قابل تغییر نیست
                  </p>
                )}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Label className="flex items-center gap-2 text-gray-700 mb-3">
                  <TrendingUp className="w-4 h-4 text-purple-600" />
                  سطح مهارت <span className="text-red-500">*</span>
                </Label>
                
                <div className="grid grid-cols-2 gap-3">
                  {levels.map((level, index) => {
                    const Icon = levelIcons[level]
                    const color = getSkillLevelColor(level)
                    const isSelected = formData.level === level
                    
                    return (
                      <motion.button
                        key={level}
                        type="button"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 + index * 0.05 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setFormData(prev => ({ ...prev, level }))}
                        className={`relative p-4 rounded-xl border-2 transition-all ${
                          isSelected
                            ? `border-${color}-500 bg-${color}-50 shadow-lg`
                            : 'border-gray-200 hover:border-gray-300 bg-white'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            isSelected ? `bg-${color}-100` : 'bg-gray-100'
                          }`}>
                            <Icon className={`w-5 h-5 ${
                              isSelected ? `text-${color}-600` : 'text-gray-400'
                            }`} />
                          </div>
                          <div className="text-right">
                            <p className={`font-medium ${
                              isSelected ? `text-${color}-700` : 'text-gray-700'
                            }`}>
                              {getSkillLevelLabel(level)}
                            </p>
                          </div>
                        </div>
                        {isSelected && (
                          <motion.div
                            layoutId="selectedLevel"
                            className={`absolute inset-0 border-2 border-${color}-500 rounded-xl`}
                            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                          />
                        )}
                      </motion.button>
                    )
                  })}
                </div>
              </motion.div>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
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
