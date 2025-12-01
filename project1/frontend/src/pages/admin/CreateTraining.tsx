import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { GraduationCap, BookOpen } from 'lucide-react'
import { FormPageLayout, FormSection, FormInput, FormTextarea, FormSelect, FormFieldGroup, InfoCard } from '@/components/forms'
import api from '@/lib/api'
import { toast } from '@/components/ui/toast'

export default function CreateTraining() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'course',
    instructor: '',
    duration: '',
    level: 'beginner',
    topics: '',
    capacity: '',
    status: 'active',
    prerequisites: '',
    objectives: '',
    startDate: '',
    endDate: '',
  })

  const createTrainingMutation = useMutation({
    mutationFn: async () => {
      const trainingData = {
        title: formData.title,
        description: formData.description,
        type: formData.type,
        instructor: formData.instructor,
        duration: parseInt(formData.duration),
        level: formData.level,
        topics: formData.topics.split(',').map(t => t.trim()).filter(Boolean),
        capacity: formData.capacity ? parseInt(formData.capacity) : undefined,
        status: formData.status,
        prerequisites: formData.prerequisites.split(',').map(p => p.trim()).filter(Boolean),
        objectives: formData.objectives.split(',').map(o => o.trim()).filter(Boolean),
        startDate: formData.startDate || undefined,
        endDate: formData.endDate || undefined,
      }
      const response = await api.post('/trainings', trainingData)
      return response.data
    },
    onSuccess: () => {
      toast.success('دوره آموزشی با موفقیت ایجاد شد')
      queryClient.invalidateQueries({ queryKey: ['trainings'] })
      navigate('/trainings')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'خطا در ایجاد دوره آموزشی')
    },
  })

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault()
    createTrainingMutation.mutate()
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const trainingTypeOptions = [
    { value: 'course', label: 'دوره' },
    { value: 'workshop', label: 'کارگاه' },
    { value: 'seminar', label: 'سمینار' },
    { value: 'bootcamp', label: 'بوت‌کمپ' },
  ]

  const levelOptions = [
    { value: 'beginner', label: 'مبتدی' },
    { value: 'intermediate', label: 'متوسط' },
    { value: 'advanced', label: 'پیشرفته' },
  ]

  const statusOptions = [
    { value: 'active', label: 'فعال' },
    { value: 'draft', label: 'پیش‌نویس' },
    { value: 'completed', label: 'تکمیل شده' },
  ]

  return (
    <FormPageLayout
      title="ایجاد دوره آموزشی جدید"
      description="اطلاعات دوره آموزشی را وارد کنید"
      icon={GraduationCap}
      gradient="var(--tw-gradient-from), var(--tw-gradient-to, rgba(236, 253, 245, 0)) from-green-600, via-emerald-600, to-teal-600"
      onBack={() => navigate('/trainings')}
      onCancel={() => navigate('/trainings')}
      onSubmit={handleSubmit}
      submitLabel={createTrainingMutation.isPending ? 'در حال ایجاد...' : 'ایجاد دوره'}
      isSubmitting={createTrainingMutation.isPending}
    >
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Right Column - Basic Info */}
        <FormSection title="اطلاعات پایه" icon={GraduationCap} iconColor="from-green-500 to-emerald-500" delay={1}>
          <FormInput
            label="عنوان دوره"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="عنوان دوره"
            required
          />

          <FormTextarea
            label="توضیحات"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="توضیحات دوره"
            required
            rows={3}
          />

          <FormFieldGroup>
            <FormSelect
              label="نوع دوره"
              name="type"
              value={formData.type}
              onChange={(value) => handleSelectChange('type', value)}
              options={trainingTypeOptions}
              required
            />

            <FormSelect
              label="سطح"
              name="level"
              value={formData.level}
              onChange={(value) => handleSelectChange('level', value)}
              options={levelOptions}
              required
            />
          </FormFieldGroup>

          <FormFieldGroup>
            <FormInput
              label="مدرس"
              name="instructor"
              value={formData.instructor}
              onChange={handleChange}
              placeholder="نام مدرس"
              required
            />

            <FormInput
              label="مدت زمان (ساعت)"
              name="duration"
              type="number"
              value={formData.duration}
              onChange={handleChange}
              placeholder="مدت زمان"
              required
              min={1}
            />
          </FormFieldGroup>

          <FormFieldGroup>
            <FormInput
              label="تاریخ شروع"
              name="startDate"
              type="datetime-local"
              value={formData.startDate}
              onChange={handleChange}
            />

            <FormInput
              label="تاریخ پایان"
              name="endDate"
              type="datetime-local"
              value={formData.endDate}
              onChange={handleChange}
            />
          </FormFieldGroup>

          <FormFieldGroup>
            <FormInput
              label="ظرفیت"
              name="capacity"
              type="number"
              value={formData.capacity}
              onChange={handleChange}
              placeholder="تعداد شرکت‌کنندگان"
              min={1}
            />

            <FormSelect
              label="وضعیت"
              name="status"
              value={formData.status}
              onChange={(value) => handleSelectChange('status', value)}
              options={statusOptions}
              required
            />
          </FormFieldGroup>
        </FormSection>

        {/* Left Column - Details */}
        <FormSection title="جزئیات بیشتر" icon={BookOpen} iconColor="from-blue-500 to-cyan-500" delay={2}>
          <FormInput
            label="موضوعات"
            name="topics"
            value={formData.topics}
            onChange={handleChange}
            placeholder="React, JavaScript, TypeScript"
            hint="موضوعات را با کاما جدا کنید"
          />

          <FormInput
            label="پیش‌نیازها"
            name="prerequisites"
            value={formData.prerequisites}
            onChange={handleChange}
            placeholder="HTML, CSS, JavaScript"
            hint="پیش‌نیازها را با کاما جدا کنید"
          />

          <FormTextarea
            label="اهداف"
            name="objectives"
            value={formData.objectives}
            onChange={handleChange}
            placeholder="یادگیری React, ساخت اپلیکیشن"
            rows={4}
            hint="اهداف را با کاما جدا کنید"
          />

          <InfoCard
            title="نکات مهم"
            variant="success"
            items={[
              'فیلدهای دارای * الزامی هستند',
              'مدت زمان را به ساعت وارد کنید',
              'موضوعات و پیش‌نیازها را با کاما جدا کنید',
              'سطح دوره را متناسب با محتوا انتخاب کنید'
            ]}
          />

          <div className="p-3 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border border-green-100">
            <div className="text-xs text-green-900">
              <p className="font-semibold mb-1">📚 توصیه</p>
              <p>برای دوره‌های طولانی، محتوا را به بخش‌های کوچک‌تر تقسیم کنید</p>
            </div>
          </div>
        </FormSection>
      </form>
    </FormPageLayout>
  )
}
