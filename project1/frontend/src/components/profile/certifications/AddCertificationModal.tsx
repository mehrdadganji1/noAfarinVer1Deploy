import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Award, Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface Certification {
  name: string
  issuer: string
  date: string
  expiryDate?: string
  credentialId?: string
  url?: string
}

interface AddCertificationModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (cert: Certification) => Promise<void>
  initialData?: Certification
  isEdit?: boolean
}

export default function AddCertificationModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isEdit = false
}: AddCertificationModalProps) {
  const [formData, setFormData] = useState<Certification>({
    name: '',
    issuer: '',
    date: '',
    expiryDate: '',
    credentialId: '',
    url: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (initialData) {
      setFormData(initialData)
    } else {
      setFormData({
        name: '',
        issuer: '',
        date: '',
        expiryDate: '',
        credentialId: '',
        url: '',
      })
    }
  }, [initialData, isOpen])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.issuer || !formData.date) return

    setIsSubmitting(true)
    try {
      await onSubmit(formData)
      onClose()
    } catch (error) {
      console.error('Error submitting certification:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4" dir="rtl">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        >
          <div className="sticky top-0 bg-gradient-to-r from-amber-600 to-yellow-600 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <Award className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-bold text-white">
                {isEdit ? 'ویرایش گواهینامه' : 'افزودن گواهینامه'}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <Label htmlFor="name">نام گواهینامه *</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="مثال: AWS Certified Solutions Architect"
                required
              />
            </div>

            <div>
              <Label htmlFor="issuer">صادرکننده *</Label>
              <Input
                id="issuer"
                name="issuer"
                value={formData.issuer}
                onChange={handleChange}
                placeholder="مثال: Amazon Web Services"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="date">تاریخ صدور *</Label>
                <Input
                  id="date"
                  name="date"
                  type="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <Label htmlFor="expiryDate">تاریخ انقضا (اختیاری)</Label>
                <Input
                  id="expiryDate"
                  name="expiryDate"
                  type="date"
                  value={formData.expiryDate}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="credentialId">شناسه گواهینامه (اختیاری)</Label>
              <Input
                id="credentialId"
                name="credentialId"
                value={formData.credentialId}
                onChange={handleChange}
                placeholder="مثال: ABC123XYZ"
              />
            </div>

            <div>
              <Label htmlFor="url">لینک گواهینامه (اختیاری)</Label>
              <Input
                id="url"
                name="url"
                type="url"
                value={formData.url}
                onChange={handleChange}
                placeholder="https://..."
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-gradient-to-r from-amber-600 to-yellow-600"
              >
                {isSubmitting ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-4 h-4 border-2 border-white border-t-transparent rounded-full ml-2"
                    />
                    در حال ذخیره...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 ml-2" />
                    {isEdit ? 'ذخیره تغییرات' : 'افزودن گواهینامه'}
                  </>
                )}
              </Button>
              <Button
                type="button"
                onClick={onClose}
                variant="outline"
                disabled={isSubmitting}
              >
                انصراف
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
