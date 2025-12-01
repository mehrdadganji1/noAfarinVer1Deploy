import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Settings, Eye, Bell, Globe } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'

interface ProfileSettingsModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function ProfileSettingsModal({ isOpen, onClose }: ProfileSettingsModalProps) {
  const [settings, setSettings] = useState({
    profileVisibility: 'public',
    showEmail: true,
    showPhone: true,
    showProjects: true,
    showAchievements: true,
    emailNotifications: true,
    pushNotifications: false,
  })

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
            className="relative bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden"
          >
            {/* Header */}
            <div className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 px-8 py-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                    <Settings className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">تنظیمات پروفایل</h2>
                    <p className="text-white/80 text-sm mt-1">مدیریت حریم خصوصی و نمایش اطلاعات</p>
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

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Profile Visibility */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Label className="flex items-center gap-2 text-gray-700 mb-3">
                  <Globe className="w-4 h-4 text-indigo-600" />
                  نمایش پروفایل
                </Label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { value: 'public', label: 'عمومی', desc: 'همه' },
                    { value: 'members', label: 'اعضا', desc: 'فقط اعضا' },
                    { value: 'private', label: 'خصوصی', desc: 'فقط من' },
                  ].map((option) => (
                    <motion.button
                      key={option.value}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSettings({ ...settings, profileVisibility: option.value })}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        settings.profileVisibility === option.value
                          ? 'border-indigo-500 bg-indigo-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <p className="font-medium text-sm">{option.label}</p>
                      <p className="text-xs text-gray-500 mt-1">{option.desc}</p>
                    </motion.button>
                  ))}
                </div>
              </motion.div>

              {/* Privacy Settings */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Label className="flex items-center gap-2 text-gray-700 mb-3">
                  <Eye className="w-4 h-4 text-indigo-600" />
                  نمایش اطلاعات
                </Label>
                <div className="space-y-2">
                  {[
                    { key: 'showEmail', label: 'نمایش ایمیل', icon: Eye },
                    { key: 'showPhone', label: 'نمایش شماره تماس', icon: Eye },
                    { key: 'showProjects', label: 'نمایش پروژه‌ها', icon: Eye },
                    { key: 'showAchievements', label: 'نمایش دستاوردها', icon: Eye },
                  ].map((item) => {
                    const Icon = item.icon
                    const isEnabled = settings[item.key as keyof typeof settings]
                    return (
                      <motion.div
                        key={item.key}
                        whileHover={{ scale: 1.01 }}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center gap-2">
                          <Icon className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-700 font-medium">{item.label}</span>
                        </div>
                        <button
                          onClick={() =>
                            setSettings({ ...settings, [item.key]: !isEnabled })
                          }
                          className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 overflow-hidden ${
                            isEnabled ? 'bg-indigo-600' : 'bg-gray-300'
                          }`}
                        >
                          <motion.div
                            animate={{ x: isEnabled ? 18 : 2 }}
                            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                            className="absolute top-1 left-0 w-4 h-4 bg-white rounded-full shadow"
                          />
                        </button>
                      </motion.div>
                    )
                  })}
                </div>
              </motion.div>

              {/* Notification Settings */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Label className="flex items-center gap-2 text-gray-700 mb-3">
                  <Bell className="w-4 h-4 text-indigo-600" />
                  اعلان‌ها
                </Label>
                <div className="space-y-2">
                  {[
                    { key: 'emailNotifications', label: 'اعلان‌های ایمیل' },
                    { key: 'pushNotifications', label: 'اعلان‌های Push' },
                  ].map((item) => {
                    const isEnabled = settings[item.key as keyof typeof settings]
                    return (
                      <motion.div
                        key={item.key}
                        whileHover={{ scale: 1.01 }}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center gap-2">
                          <Bell className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-700 font-medium">{item.label}</span>
                        </div>
                        <button
                          onClick={() =>
                            setSettings({ ...settings, [item.key]: !isEnabled })
                          }
                          className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 overflow-hidden ${
                            isEnabled ? 'bg-indigo-600' : 'bg-gray-300'
                          }`}
                        >
                          <motion.div
                            animate={{ x: isEnabled ? 18 : 2 }}
                            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                            className="absolute top-1 left-0 w-4 h-4 bg-white rounded-full shadow"
                          />
                        </button>
                      </motion.div>
                    )
                  })}
                </div>
              </motion.div>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex gap-3 pt-4"
              >
                <Button
                  onClick={onClose}
                  className="flex-1 h-10 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium rounded-lg"
                >
                  ذخیره تنظیمات
                </Button>
                <Button
                  onClick={onClose}
                  variant="outline"
                  className="px-6 h-10 rounded-lg"
                >
                  انصراف
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
