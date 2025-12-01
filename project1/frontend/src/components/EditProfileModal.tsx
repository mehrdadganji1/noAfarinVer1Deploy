import { useState, useEffect } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { useAuthStore } from '@/store/authStore'
import api from '@/lib/api'
import { toast } from './ui/toast'

interface EditProfileModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function EditProfileModal({ open, onOpenChange }: EditProfileModalProps) {
  const { user, setUser } = useAuthStore()
  const queryClient = useQueryClient()
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    university: '',
    major: '',
    studentId: '',
    bio: '',
    expertise: '',
  })

  useEffect(() => {
    if (user && open) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        phoneNumber: (user as any).phoneNumber || '',
        university: (user as any).university || '',
        major: (user as any).major || '',
        studentId: (user as any).studentId || '',
        bio: (user as any).bio || '',
        expertise: ((user as any).expertise || []).join(', '),
      })
    }
  }, [user, open])

  const updateProfileMutation = useMutation({
    mutationFn: async () => {
      const updateData = {
        ...formData,
        expertise: formData.expertise.split(',').map(s => s.trim()).filter(Boolean),
      }
      const response = await api.put(`/users/${user?._id}`, updateData)
      return response.data
    },
    onSuccess: (data) => {
      toast.success('پروفایل با موفقیت بروزرسانی شد')
      setUser(data.data)
      queryClient.invalidateQueries({ queryKey: ['user'] })
      onOpenChange(false)
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'خطا در بروزرسانی پروفایل')
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    updateProfileMutation.mutate()
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>ویرایش پروفایل</DialogTitle>
          <DialogDescription>
            اطلاعات خود را بروزرسانی کنید
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">نام *</label>
              <Input
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="نام"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">نام خانوادگی *</label>
              <Input
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="نام خانوادگی"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">تلفن</label>
              <Input
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="09123456789"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">شماره دانشجویی</label>
              <Input
                name="studentId"
                value={formData.studentId}
                onChange={handleChange}
                placeholder="9812345"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">دانشگاه</label>
              <Input
                name="university"
                value={formData.university}
                onChange={handleChange}
                placeholder="دانشگاه تهران"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">رشته تحصیلی</label>
              <Input
                name="major"
                value={formData.major}
                onChange={handleChange}
                placeholder="مهندسی کامپیوتر"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">بیوگرافی</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder="درباره خودتان بنویسید..."
              className="w-full px-3 py-2 border rounded-md"
              rows={3}
              maxLength={500}
            />
            <p className="text-xs text-gray-500 mt-1">حداکثر 500 کاراکتر</p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">مهارت‌ها و تخصص‌ها</label>
            <Input
              name="expertise"
              value={formData.expertise}
              onChange={handleChange}
              placeholder="React, Node.js, Python (با کاما جدا کنید)"
            />
            <p className="text-xs text-gray-500 mt-1">مهارت‌های خود را با کاما از هم جدا کنید</p>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={updateProfileMutation.isPending}
            >
              انصراف
            </Button>
            <Button
              type="submit"
              disabled={updateProfileMutation.isPending}
            >
              {updateProfileMutation.isPending ? 'در حال بروزرسانی...' : 'ذخیره تغییرات'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
