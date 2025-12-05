import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { X, Save, User, Mail, Phone, GraduationCap, FileText, MapPin, Award } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Application } from '@/pages/director/Applications'
import { toast } from '@/components/ui/toast'
import api from '@/lib/api'

interface EditApplicationModalProps {
  application: Application
  onClose: () => void
}

export default function EditApplicationModal({ application, onClose }: EditApplicationModalProps) {
  const queryClient = useQueryClient()
  const [formData, setFormData] = useState({
    firstName: application.firstName || application.userId?.firstName || '',
    lastName: application.lastName || application.userId?.lastName || '',
    email: application.email || application.userId?.email || '',
    phoneNumber: application.phoneNumber || '',
    university: application.university || '',
    major: application.major || '',
    degree: application.degree || '',
    studentId: application.studentId || '',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const updateMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const response = await api.patch(`/applications/${application._id}`, data)
      return response.data
    },
    onSuccess: () => {
      toast({ title: 'موفقیت', description: 'درخواست با موفقیت ویرایش شد' })
      queryClient.invalidateQueries({ queryKey: ['director-applications'] })
      onClose()
    },
    onError: (error: any) => {
      toast({
        title: 'خطا',
        description: error.response?.data?.error || 'خطا در ویرایش درخواست',
        variant: 'destructive',
      })
    },
  })

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }))
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.firstName.trim()) newErrors.firstName = 'نام الزامی است'
    if (!formData.lastName.trim()) newErrors.lastName = 'نام خانوادگی الزامی است'
    if (!formData.email.trim()) newErrors.email = 'ایمیل الزامی است'
    if (!formData.phoneNumber.trim()) newErrors.phoneNumber = 'شماره تلفن الزامی است'
    if (!formData.university.trim()) newErrors.university = 'دانشگاه الزامی است'
    if (!formData.major.trim()) newErrors.major = 'رشته تحصیلی الزامی است'
    if (!formData.degree.trim()) newErrors.degree = 'مقطع تحصیلی الزامی است'
    if (!formData.studentId.trim()) newErrors.studentId = 'شماره دانشجویی الزامی است'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) updateMutation.mutate(formData)
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
        >
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 backdrop-blur-sm rounded-xl">
                  <FileText className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">ویرایش درخواست</h2>
                  <p className="text-blue-100 text-sm">ویرایش اطلاعات درخواست عضویت</p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition-colors">
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
            <div className="space-y-6">
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                    <User className="h-5 w-5 text-blue-600" />
                    اطلاعات شخصی
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField label="نام" icon={User} value={formData.firstName} onChange={(v: string) => handleChange('firstName', v)} error={errors.firstName} />
                    <FormField label="نام خانوادگی" icon={User} value={formData.lastName} onChange={(v: string) => handleChange('lastName', v)} error={errors.lastName} />
                    <FormField label="ایمیل" icon={Mail} type="email" value={formData.email} onChange={(v: string) => handleChange('email', v)} error={errors.email} />
                    <FormField label="شماره تلفن" icon={Phone} value={formData.phoneNumber} onChange={(v: string) => handleChange('phoneNumber', v)} error={errors.phoneNumber} />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                    <GraduationCap className="h-5 w-5 text-purple-600" />
                    اطلاعات تحصیلی
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField label="دانشگاه" icon={MapPin} value={formData.university} onChange={(v: string) => handleChange('university', v)} error={errors.university} />
                    <FormField label="رشته تحصیلی" icon={Award} value={formData.major} onChange={(v: string) => handleChange('major', v)} error={errors.major} />
                    <div>
                      <label className="block text-sm font-medium mb-2">مقطع تحصیلی *</label>
                      <select value={formData.degree} onChange={(e) => handleChange('degree', e.target.value)} className={`w-full px-3 py-2 border rounded-lg ${errors.degree ? 'border-red-500' : 'border-gray-300'}`}>
                        <option value="">انتخاب کنید</option>
                        <option value="کارشناسی">کارشناسی</option>
                        <option value="کارشناسی ارشد">کارشناسی ارشد</option>
                        <option value="دکتری">دکتری</option>
                      </select>
                      {errors.degree && <p className="text-red-500 text-xs mt-1">{errors.degree}</p>}
                    </div>
                    <FormField label="شماره دانشجویی" icon={FileText} value={formData.studentId} onChange={(v: string) => handleChange('studentId', v)} error={errors.studentId} />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="flex gap-3 mt-6">
              <Button type="submit" disabled={updateMutation.isPending} className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600">
                <Save className="h-5 w-5 ml-2" />
                {updateMutation.isPending ? 'در حال ذخیره...' : 'ذخیره تغییرات'}
              </Button>
              <Button type="button" onClick={onClose} variant="outline" className="flex-1">انصراف</Button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

function FormField({ label, icon: Icon, type = 'text', value, onChange, error }: any) {
  return (
    <div>
      <label className="block text-sm font-medium mb-2 flex items-center gap-2">
        {Icon && <Icon className="h-4 w-4 text-blue-500" />}
        {label} <span className="text-red-500">*</span>
      </label>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} className={`w-full px-3 py-2 border rounded-lg ${error ? 'border-red-500' : 'border-gray-300'}`} />
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  )
}
