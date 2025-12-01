import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import {
  Camera, Upload, X, Check, Palette,
  Image as ImageIcon, Loader2
} from 'lucide-react'

interface ProfileCustomizationProps {
  currentAvatar?: string
  currentCover?: string
  currentThemeColor?: string
  onAvatarChange: (file: File) => Promise<void>
  onCoverChange: (file: File) => Promise<void>
  onThemeColorChange: (color: string) => void
}

const ProfileCustomization = ({
  currentAvatar,
  currentCover,
  currentThemeColor = '#3b82f6',
  onAvatarChange,
  onCoverChange,
  onThemeColorChange
}: ProfileCustomizationProps) => {
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [coverPreview, setCoverPreview] = useState<string | null>(null)
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false)
  const [isUploadingCover, setIsUploadingCover] = useState(false)
  const [selectedColor, setSelectedColor] = useState(currentThemeColor)

  const avatarInputRef = useRef<HTMLInputElement>(null)
  const coverInputRef = useRef<HTMLInputElement>(null)

  const themeColors = [
    { name: 'آبی', value: '#3b82f6' },
    { name: 'سبز', value: '#10b981' },
    { name: 'بنفش', value: '#8b5cf6' },
    { name: 'صورتی', value: '#ec4899' },
    { name: 'نارنجی', value: '#f59e0b' },
    { name: 'قرمز', value: '#ef4444' },
    { name: 'فیروزه‌ای', value: '#06b6d4' },
    { name: 'یاسی', value: '#6366f1' }
  ]

  const handleAvatarSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // بررسی سایز فایل (حداکثر 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('حجم فایل نباید بیشتر از 5 مگابایت باشد')
        return
      }

      // بررسی نوع فایل
      if (!file.type.startsWith('image/')) {
        alert('لطفا یک فایل تصویری انتخاب کنید')
        return
      }

      // نمایش پیش‌نمایش
      const reader = new FileReader()
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleCoverSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // بررسی سایز فایل (حداکثر 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert('حجم فایل نباید بیشتر از 10 مگابایت باشد')
        return
      }

      // بررسی نوع فایل
      if (!file.type.startsWith('image/')) {
        alert('لطفا یک فایل تصویری انتخاب کنید')
        return
      }

      // نمایش پیش‌نمایش
      const reader = new FileReader()
      reader.onloadend = () => {
        setCoverPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleAvatarUpload = async () => {
    const file = avatarInputRef.current?.files?.[0]
    if (file) {
      setIsUploadingAvatar(true)
      try {
        await onAvatarChange(file)
        setAvatarPreview(null)
      } catch (error) {
        console.error('Error uploading avatar:', error)
        alert('خطا در آپلود تصویر')
      } finally {
        setIsUploadingAvatar(false)
      }
    }
  }

  const handleCoverUpload = async () => {
    const file = coverInputRef.current?.files?.[0]
    if (file) {
      setIsUploadingCover(true)
      try {
        await onCoverChange(file)
        setCoverPreview(null)
      } catch (error) {
        console.error('Error uploading cover:', error)
        alert('خطا در آپلود تصویر')
      } finally {
        setIsUploadingCover(false)
      }
    }
  }

  const handleColorChange = (color: string) => {
    setSelectedColor(color)
    onThemeColorChange(color)
  }

  return (
    <div className="space-y-6">
      {/* Avatar Upload */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl p-6 border-2 border-gray-100"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Camera className="w-5 h-5 text-blue-600" />
          تصویر پروفایل
        </h3>

        <div className="flex items-center gap-6">
          {/* Current/Preview Avatar */}
          <div className="relative">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-200">
              <img
                src={avatarPreview || currentAvatar || 'https://via.placeholder.com/150'}
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            </div>
            {avatarPreview && (
              <button
                onClick={() => setAvatarPreview(null)}
                className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Upload Controls */}
          <div className="flex-1">
            <input
              ref={avatarInputRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarSelect}
              className="hidden"
            />

            <div className="space-y-3">
              <button
                onClick={() => avatarInputRef.current?.click()}
                disabled={isUploadingAvatar}
                className="w-full px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors flex items-center justify-center gap-2 font-medium"
              >
                <Upload className="w-4 h-4" />
                انتخاب تصویر جدید
              </button>

              {avatarPreview && (
                <button
                  onClick={handleAvatarUpload}
                  disabled={isUploadingAvatar}
                  className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 font-medium disabled:opacity-50"
                >
                  {isUploadingAvatar ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      در حال آپلود...
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      تایید و آپلود
                    </>
                  )}
                </button>
              )}

              <p className="text-xs text-gray-500">
                فرمت‌های مجاز: JPG, PNG, GIF (حداکثر 5MB)
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Cover Photo Upload */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl p-6 border-2 border-gray-100"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <ImageIcon className="w-5 h-5 text-purple-600" />
          تصویر کاور
        </h3>

        <div className="space-y-4">
          {/* Current/Preview Cover */}
          <div className="relative w-full h-48 rounded-xl overflow-hidden border-2 border-gray-200">
            <img
              src={coverPreview || currentCover || 'https://via.placeholder.com/1200x400'}
              alt="Cover"
              className="w-full h-full object-cover"
            />
            {coverPreview && (
              <button
                onClick={() => setCoverPreview(null)}
                className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          </div>

          {/* Upload Controls */}
          <input
            ref={coverInputRef}
            type="file"
            accept="image/*"
            onChange={handleCoverSelect}
            className="hidden"
          />

          <div className="flex gap-3">
            <button
              onClick={() => coverInputRef.current?.click()}
              disabled={isUploadingCover}
              className="flex-1 px-4 py-2 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition-colors flex items-center justify-center gap-2 font-medium"
            >
              <Upload className="w-4 h-4" />
              انتخاب تصویر جدید
            </button>

            {coverPreview && (
              <button
                onClick={handleCoverUpload}
                disabled={isUploadingCover}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 font-medium disabled:opacity-50"
              >
                {isUploadingCover ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    در حال آپلود...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    تایید و آپلود
                  </>
                )}
              </button>
            )}
          </div>

          <p className="text-xs text-gray-500">
            فرمت‌های مجاز: JPG, PNG (حداکثر 10MB) - ابعاد پیشنهادی: 1200x400
          </p>
        </div>
      </motion.div>

      {/* Theme Color Selector */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-xl p-6 border-2 border-gray-100"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Palette className="w-5 h-5 text-pink-600" />
          رنگ تم پروفایل
        </h3>

        <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
          {themeColors.map((color) => (
            <button
              key={color.value}
              onClick={() => handleColorChange(color.value)}
              className="relative group"
              title={color.name}
            >
              <div
                className={`w-12 h-12 rounded-lg transition-all ${
                  selectedColor === color.value
                    ? 'ring-4 ring-offset-2 scale-110'
                    : 'hover:scale-105'
                }`}
                style={{
                  backgroundColor: color.value,
                  boxShadow: selectedColor === color.value ? `0 0 0 4px ${color.value}40` : undefined
                }}
              >
                {selectedColor === color.value && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Check className="w-6 h-6 text-white drop-shadow-lg" />
                  </div>
                )}
              </div>
              <p className="text-xs text-gray-600 mt-1 text-center">{color.name}</p>
            </button>
          ))}
        </div>

        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">
            💡 رنگ انتخابی در هدر پروفایل و برخی المان‌ها نمایش داده می‌شود
          </p>
        </div>
      </motion.div>
    </div>
  )
}

export default ProfileCustomization
