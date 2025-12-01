import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { PersianDatePicker } from './ui/persian-datepicker'
import api from '@/lib/api'
import { toast } from './ui/toast'

interface CreateTrainingModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateTrainingModal({ open, onOpenChange }: CreateTrainingModalProps) {
  const queryClient = useQueryClient()
  const [startDate, setStartDate] = useState<Date | null>(null)
  const [endDate, setEndDate] = useState<Date | null>(null)
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
        startDate: startDate?.toISOString(),
        endDate: endDate?.toISOString(),
      }
      const response = await api.post('/trainings', trainingData)
      return response.data
    },
    onSuccess: () => {
      toast.success('دوره با موفقیت ایجاد شد')
      queryClient.invalidateQueries({ queryKey: ['trainings'] })
      onOpenChange(false)
      setStartDate(null)
      setEndDate(null)
      setFormData({
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
      })
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'خطا در ایجاد دوره')
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    createTrainingMutation.mutate()
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>ایجاد دوره آموزشی جدید</DialogTitle>
          <DialogDescription>
            اطلاعات دوره را وارد کنید
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Basic Info */}
          <div>
            <label className="block text-sm font-medium mb-1">عنوان دوره *</label>
            <Input
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="عنوان دوره"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">توضیحات *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="توضیحات دوره"
              className="w-full px-3 py-2 border rounded-md"
              rows={3}
              required
              maxLength={2000}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1">نوع دوره *</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md"
                required
              >
                <option value="course">دوره</option>
                <option value="workshop">کارگاه</option>
                <option value="webinar">وبینار</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">سطح *</label>
              <select
                name="level"
                value={formData.level}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md"
                required
              >
                <option value="beginner">مبتدی</option>
                <option value="intermediate">متوسط</option>
                <option value="advanced">پیشرفته</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1">مدرس *</label>
              <Input
                name="instructor"
                value={formData.instructor}
                onChange={handleChange}
                placeholder="نام مدرس"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">مدت (ساعت) *</label>
              <Input
                type="number"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                placeholder="مثلاً: 40"
                required
                min="1"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">موضوعات</label>
            <Input
              name="topics"
              value={formData.topics}
              onChange={handleChange}
              placeholder="React, Node.js, MongoDB (با کاما جدا کنید)"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1">تاریخ شروع</label>
              <PersianDatePicker
                selected={startDate}
                onChange={setStartDate}
                showTimeSelect={false}
                placeholder="تاریخ شروع"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">تاریخ پایان</label>
              <PersianDatePicker
                selected={endDate}
                onChange={setEndDate}
                showTimeSelect={false}
                placeholder="تاریخ پایان"
                minDate={startDate || undefined}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">ظرفیت</label>
            <Input
              type="number"
              name="capacity"
              value={formData.capacity}
              onChange={handleChange}
              placeholder="تعداد دانشجویان"
              min="1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">پیش‌نیازها</label>
            <Input
              name="prerequisites"
              value={formData.prerequisites}
              onChange={handleChange}
              placeholder="HTML, CSS (با کاما جدا کنید)"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">اهداف آموزشی</label>
            <textarea
              name="objectives"
              value={formData.objectives}
              onChange={handleChange}
              placeholder="هدف 1, هدف 2 (با کاما جدا کنید)"
              className="w-full px-3 py-2 border rounded-md"
              rows={2}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={createTrainingMutation.isPending}
            >
              انصراف
            </Button>
            <Button
              type="submit"
              disabled={createTrainingMutation.isPending}
            >
              {createTrainingMutation.isPending ? 'در حال ایجاد...' : 'ایجاد دوره'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
