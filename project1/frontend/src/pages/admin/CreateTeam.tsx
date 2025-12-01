import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Users, Lightbulb } from 'lucide-react'
import { FormPageLayout, FormSection, FormInput, FormTextarea, InfoCard } from '@/components/forms'
import api from '@/lib/api'
import { toast } from '@/components/ui/toast'

export default function CreateTeam() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    ideaTitle: '',
    ideaDescription: '',
    problemStatement: '',
    solution: '',
    targetMarket: '',
    technology: '',
  })

  const createTeamMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await api.post('/teams', {
        ...data,
        technology: data.technology.split(',').map((t: string) => t.trim()).filter(Boolean),
      })
      return response.data
    },
    onSuccess: () => {
      toast.success('تیم با موفقیت ایجاد شد')
      queryClient.invalidateQueries({ queryKey: ['teams'] })
      navigate('/teams')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'خطا در ایجاد تیم')
    },
  })

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault()
    createTeamMutation.mutate(formData)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  return (
    <FormPageLayout
      title="ایجاد تیم جدید"
      description="اطلاعات تیم و ایده را وارد کنید"
      icon={Users}
      gradient="var(--tw-gradient-from), var(--tw-gradient-to, rgba(255, 237, 213, 0)) from-orange-600, via-red-600, to-pink-600"
      onBack={() => navigate('/teams')}
      onCancel={() => navigate('/teams')}
      onSubmit={handleSubmit}
      submitLabel={createTeamMutation.isPending ? 'در حال ایجاد...' : 'ایجاد تیم'}
      isSubmitting={createTeamMutation.isPending}
    >
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Right Column - Team Info */}
        <FormSection title="اطلاعات تیم" icon={Users} iconColor="from-orange-500 to-pink-500" delay={1}>
          <FormInput
            label="نام تیم"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="نام تیم"
            required
          />

          <FormTextarea
            label="توضیحات تیم"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="درباره تیم خود بنویسید"
            required
            rows={4}
            maxLength={1000}
            showCount
          />

          <FormInput
            label="عنوان ایده"
            name="ideaTitle"
            value={formData.ideaTitle}
            onChange={handleChange}
            placeholder="عنوان ایده"
            required
          />

          <FormTextarea
            label="توضیحات ایده"
            name="ideaDescription"
            value={formData.ideaDescription}
            onChange={handleChange}
            placeholder="ایده خود را توضیح دهید"
            required
            rows={4}
            maxLength={2000}
            showCount
          />

          <FormInput
            label="فناوری‌ها"
            name="technology"
            value={formData.technology}
            onChange={handleChange}
            placeholder="React, Node.js (با کاما جدا کنید)"
            hint="فناوری‌ها را با کاما جدا کنید"
          />
        </FormSection>

        {/* Left Column - Idea Details */}
        <FormSection title="جزئیات ایده" icon={Lightbulb} iconColor="from-yellow-500 to-orange-500" delay={2}>
          <FormTextarea
            label="مشکل"
            name="problemStatement"
            value={formData.problemStatement}
            onChange={handleChange}
            placeholder="چه مشکلی را حل می‌کنید؟"
            required
            rows={4}
            maxLength={1000}
          />

          <FormTextarea
            label="راه‌حل"
            name="solution"
            value={formData.solution}
            onChange={handleChange}
            placeholder="راه‌حل شما چیست؟"
            required
            rows={4}
            maxLength={2000}
          />

          <FormTextarea
            label="بازار هدف"
            name="targetMarket"
            value={formData.targetMarket}
            onChange={handleChange}
            placeholder="مشتریان هدف شما چه کسانی هستند؟"
            required
            rows={4}
            maxLength={500}
          />

          <InfoCard
            title="نکات مهم"
            variant="info"
            items={[
              'فیلدهای دارای * الزامی هستند',
              'توضیحات کامل و دقیق بنویسید',
              'ایده باید نوآورانه و قابل اجرا باشد',
              'بازار هدف را به وضوح مشخص کنید'
            ]}
          />
        </FormSection>
      </form>
    </FormPageLayout>
  )
}
