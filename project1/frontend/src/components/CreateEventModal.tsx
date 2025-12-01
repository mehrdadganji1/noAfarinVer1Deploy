import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { PersianDatePicker } from './ui/persian-datepicker'
import api from '@/lib/api'
import { toast } from './ui/toast'

interface CreateEventModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateEventModal({ open, onOpenChange }: CreateEventModalProps) {
  const queryClient = useQueryClient()
  const [startDate, setStartDate] = useState<Date | null>(null)
  const [endDate, setEndDate] = useState<Date | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'workshop',
    location: '',
    isOnline: false,
    meetingLink: '',
    capacity: '',
  })

  const createEventMutation = useMutation({
    mutationFn: async () => {
      if (!startDate || !endDate) {
        throw new Error('تاریخ شروع و پایان الزامی است')
      }
      
      // Calculate duration in hours
      const durationMs = endDate.getTime() - startDate.getTime()
      const durationHours = Math.max(0.5, durationMs / (1000 * 60 * 60))
      
      // Extract time from startDate
      const timeStr = startDate.toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })
      
      // Format data to match backend Event model
      const eventData = {
        title: formData.title,
        description: formData.description,
        type: formData.type,
        date: startDate.toISOString(),
        time: timeStr,
        duration: parseFloat(durationHours.toFixed(2)),
        capacity: formData.capacity ? parseInt(formData.capacity) : 50,
        location: formData.isOnline ? 'آنلاین' : (formData.location || ''),
        onlineLink: formData.isOnline ? formData.meetingLink : undefined,
        status: 'upcoming',
      }
      
      console.log('📤 Sending event data:', eventData)
      const response = await api.post('/events', eventData)
      return response.data
    },
    onSuccess: () => {
      toast.success('رویداد با موفقیت ایجاد شد')
      queryClient.invalidateQueries({ queryKey: ['events'] })
      onOpenChange(false)
      setStartDate(null)
      setEndDate(null)
      setFormData({
        title: '',
        description: '',
        type: 'workshop',
        location: '',
        isOnline: false,
        meetingLink: '',
        capacity: '',
      })
    },
    onError: (error: any) => {
      console.error('❌ Event creation error:', error.response?.data || error.message)
      const errorMessage = error.response?.data?.error || error.message || 'خطا در ایجاد رویداد'
      toast.error(errorMessage)
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    createEventMutation.mutate()
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>ایجاد رویداد جدید</DialogTitle>
          <DialogDescription>
            اطلاعات رویداد را وارد کنید
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">عنوان رویداد *</label>
            <Input
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="عنوان رویداد"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">توضیحات *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="درباره رویداد بنویسید"
              className="w-full px-3 py-2 border rounded-md"
              rows={3}
              required
              maxLength={2000}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">نوع رویداد *</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md"
              required
            >
              <option value="workshop">کارگاه</option>
              <option value="networking">شبکه‌سازی</option>
              <option value="seminar">سمینار</option>
              <option value="webinar">وبینار</option>
              <option value="industrial_visit">بازدید صنعتی</option>
              <option value="pitch_session">جلسه پیچینگ</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1">تاریخ و ساعت شروع (شمسی) *</label>
              <PersianDatePicker
                selected={startDate}
                onChange={setStartDate}
                showTimeSelect
                placeholder="تاریخ و ساعت شروع را انتخاب کنید"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">تاریخ و ساعت پایان (شمسی) *</label>
              <PersianDatePicker
                selected={endDate}
                onChange={setEndDate}
                showTimeSelect
                placeholder="تاریخ و ساعت پایان را انتخاب کنید"
                required
                minDate={startDate || undefined}
              />
            </div>
          </div>

          <div>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="isOnline"
                checked={formData.isOnline}
                onChange={handleChange}
                className="w-4 h-4"
              />
              <span className="text-sm font-medium">رویداد آنلاین</span>
            </label>
          </div>

          {formData.isOnline ? (
            <div>
              <label className="block text-sm font-medium mb-1">لینک جلسه</label>
              <Input
                name="meetingLink"
                value={formData.meetingLink}
                onChange={handleChange}
                placeholder="https://meet.google.com/..."
              />
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium mb-1">مکان</label>
              <Input
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="آدرس محل برگزاری"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-1">ظرفیت</label>
            <Input
              type="number"
              name="capacity"
              value={formData.capacity}
              onChange={handleChange}
              placeholder="تعداد شرکت‌کنندگان"
              min="1"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={createEventMutation.isPending}
            >
              انصراف
            </Button>
            <Button
              type="submit"
              disabled={createEventMutation.isPending}
            >
              {createEventMutation.isPending ? 'در حال ایجاد...' : 'ایجاد رویداد'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
