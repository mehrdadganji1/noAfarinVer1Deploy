import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Eye, EyeOff } from 'lucide-react'
import api from '@/lib/api'
import { toast } from './ui/toast'

interface ChangePasswordModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function ChangePasswordModal({ open, onOpenChange }: ChangePasswordModalProps) {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  })

  const changePasswordMutation = useMutation({
    mutationFn: async () => {
      if (formData.newPassword !== formData.confirmPassword) {
        throw new Error('رمزهای عبور جدید مطابقت ندارند')
      }
      if (formData.newPassword.length < 6) {
        throw new Error('رمز عبور باید حداقل 6 کاراکتر باشد')
      }
      const response = await api.post('/auth/change-password', {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      })
      return response.data
    },
    onSuccess: () => {
      toast.success('رمز عبور با موفقیت تغییر کرد')
      onOpenChange(false)
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      })
    },
    onError: (error: any) => {
      toast.error(error.message || error.response?.data?.error || 'خطا در تغییر رمز عبور')
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    changePasswordMutation.mutate()
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
          <DialogTitle>تغییر رمز عبور</DialogTitle>
          <DialogDescription>
            رمز عبور جدید خود را وارد کنید
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">رمز عبور فعلی *</label>
            <div className="relative">
              <Input
                type={showPasswords.current ? 'text' : 'password'}
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
                placeholder="رمز عبور فعلی"
                required
              />
              <button
                type="button"
                onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                className="absolute left-3 top-1/2 transform -translate-y-1/2"
              >
                {showPasswords.current ? (
                  <EyeOff className="h-4 w-4 text-gray-500" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-500" />
                )}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">رمز عبور جدید *</label>
            <div className="relative">
              <Input
                type={showPasswords.new ? 'text' : 'password'}
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                placeholder="رمز عبور جدید (حداقل 6 کاراکتر)"
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                className="absolute left-3 top-1/2 transform -translate-y-1/2"
              >
                {showPasswords.new ? (
                  <EyeOff className="h-4 w-4 text-gray-500" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-500" />
                )}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">تکرار رمز عبور جدید *</label>
            <div className="relative">
              <Input
                type={showPasswords.confirm ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="تکرار رمز عبور جدید"
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                className="absolute left-3 top-1/2 transform -translate-y-1/2"
              >
                {showPasswords.confirm ? (
                  <EyeOff className="h-4 w-4 text-gray-500" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-500" />
                )}
              </button>
            </div>
          </div>

          {formData.newPassword && formData.confirmPassword && formData.newPassword !== formData.confirmPassword && (
            <p className="text-sm text-red-600">رمزهای عبور مطابقت ندارند</p>
          )}

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={changePasswordMutation.isPending}
            >
              انصراف
            </Button>
            <Button
              type="submit"
              disabled={changePasswordMutation.isPending || (formData.newPassword !== formData.confirmPassword)}
            >
              {changePasswordMutation.isPending ? 'در حال تغییر...' : 'تغییر رمز'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
