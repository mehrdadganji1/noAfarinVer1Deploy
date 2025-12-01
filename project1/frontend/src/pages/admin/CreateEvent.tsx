import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Calendar, MapPin, Video } from 'lucide-react'
import { FormPageLayout, FormSection, FormInput, FormTextarea, FormSelect, FormFieldGroup, FormSwitch, InfoCard } from '@/components/forms'
import { toast } from '@/components/ui/toast'
import api from '@/lib/api'

export default function CreateEvent() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: '',
    startDate: '',
    endDate: '',
    location: '',
    isOnline: false,
    meetingLink: '',
    capacity: '',
    agenda: '',
    status: 'upcoming',
  })

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await api.post('/events', data)
      return response.data
    },
    onSuccess: (data) => {
      toast.success('رویداد با موفقیت ایجاد شد')
      queryClient.invalidateQueries({ queryKey: ['events'] })
      navigate(`/admin/events/${data.data._id}`)
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'خطا در ایجاد رویداد')
    },
  })

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault()

    if (!formData.title || !formData.description || !formData.type || !formData.startDate) {
      toast.error('لطفاً فیلدهای الزامی را پر کنید')
      return
    }

    createMutation.mutate({
      ...formData,
      capacity: formData.capacity ? parseInt(formData.capacity) : undefined,
    })
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const eventTypeOptions = [
    { value: 'aaco', label: 'رویداد AACO' },
    { value: 'workshop', label: 'کارگاه' },
    { value: 'industrial_visit', label: 'بازدید صنعتی' },
    { value: 'training', label: 'دوره آموزشی' },
    { value: 'pitch_session', label: 'جلسه پیچینگ' },
    { value: 'closing_ceremony', label: 'مراسم اختتامیه' },
  ]

  return (
    <FormPageLayout
      title="ایجاد رویداد جدید"
      description="اطلاعات رویداد را وارد کنید"
      icon={Calendar}
      gradient="var(--tw-gradient-from), var(--tw-gradient-to, rgba(219, 234, 254, 0)) from-blue-600, via-indigo-600, to-purple-600"
      onBack={() => navigate(-1)}
      onCancel={() => navigate(-1)}
      onSubmit={handleSubmit}
      submitLabel={createMutation.isPending ? 'در حال ایجاد...' : 'ایجاد رویداد'}
      isSubmitting={createMutation.isPending}
    >
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Right Column - Basic Info */}
        <FormSection title="اطلاعات اصلی" icon={Calendar} iconColor="from-blue-500 to-indigo-500" delay={1}>
          <FormInput
            label="عنوان رویداد"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="عنوان رویداد"
            required
          />

          <FormTextarea
            label="توضیحات"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="توضیحات کامل رویداد"
            required
            rows={3}
          />

          <FormSelect
            label="نوع رویداد"
            name="type"
            value={formData.type}
            onChange={(value) => handleSelectChange('type', value)}
            placeholder="انتخاب کنید"
            options={eventTypeOptions}
            required
          />

          <FormFieldGroup>
            <FormInput
              label="تاریخ شروع"
              name="startDate"
              type="datetime-local"
              value={formData.startDate}
              onChange={handleChange}
              required
            />

            <FormInput
              label="تاریخ پایان"
              name="endDate"
              type="datetime-local"
              value={formData.endDate}
              onChange={handleChange}
            />
          </FormFieldGroup>

          <FormInput
            label="ظرفیت"
            name="capacity"
            type="number"
            value={formData.capacity}
            onChange={handleChange}
            placeholder="تعداد نفر"
            min={1}
          />

          <FormTextarea
            label="دستور جلسه"
            name="agenda"
            value={formData.agenda}
            onChange={handleChange}
            placeholder="برنامه زمان‌بندی رویداد"
            rows={3}
          />
        </FormSection>

        {/* Left Column - Location */}
        <FormSection title="محل برگزاری" icon={MapPin} iconColor="from-purple-500 to-pink-500" delay={2}>
          <FormSwitch
            label="رویداد آنلاین"
            name="isOnline"
            checked={formData.isOnline}
            onChange={(checked) => setFormData(prev => ({ ...prev, isOnline: checked }))}
            icon={Video}
          />

          {formData.isOnline ? (
            <FormInput
              label="لینک جلسه آنلاین"
              name="meetingLink"
              type="url"
              value={formData.meetingLink}
              onChange={handleChange}
              placeholder="https://meet.google.com/..."
            />
          ) : (
            <FormTextarea
              label="آدرس محل برگزاری"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="آدرس کامل"
              rows={3}
            />
          )}

          <InfoCard
            title="نکات مهم"
            variant="info"
            items={[
              'فیلدهای دارای * الزامی هستند',
              'تاریخ پایان باید بعد از شروع باشد',
              'برای رویدادهای آنلاین، لینک وارد کنید',
              'ظرفیت را بر اساس امکانات تعیین کنید'
            ]}
          />

          <div className="p-3 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
            <div className="text-xs text-blue-900">
              <p className="font-semibold mb-1">💡 پیشنهاد</p>
              <p>برای رویدادهای مهم، حداقل 2 هفته قبل اطلاع‌رسانی کنید</p>
            </div>
          </div>
        </FormSection>
      </form>
    </FormPageLayout>
  )
}
