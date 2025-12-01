import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog'
import { Button } from './ui/button'
import { Input } from './ui/input'
import api from '@/lib/api'
import { toast } from './ui/toast'

interface CreateTeamModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateTeamModal({ open, onOpenChange }: CreateTeamModalProps) {
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
      onOpenChange(false)
      setFormData({
        name: '',
        description: '',
        ideaTitle: '',
        ideaDescription: '',
        problemStatement: '',
        solution: '',
        targetMarket: '',
        technology: '',
      })
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'خطا در ایجاد تیم')
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    createTeamMutation.mutate(formData)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>ایجاد تیم جدید</DialogTitle>
          <DialogDescription>
            اطلاعات تیم و ایده خود را وارد کنید
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Team Info */}
          <div>
            <label className="block text-sm font-medium mb-1">نام تیم *</label>
            <Input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="نام تیم را وارد کنید"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">توضیحات تیم *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="درباره تیم خود بنویسید"
              className="w-full px-3 py-2 border rounded-md"
              rows={3}
              required
              maxLength={1000}
            />
          </div>

          {/* Idea Info */}
          <div className="border-t pt-4">
            <h3 className="font-medium mb-3">اطلاعات ایده</h3>
            
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1">عنوان ایده *</label>
                <Input
                  name="ideaTitle"
                  value={formData.ideaTitle}
                  onChange={handleChange}
                  placeholder="عنوان ایده"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">توضیحات ایده *</label>
                <textarea
                  name="ideaDescription"
                  value={formData.ideaDescription}
                  onChange={handleChange}
                  placeholder="ایده خود را توضیح دهید"
                  className="w-full px-3 py-2 border rounded-md"
                  rows={3}
                  required
                  maxLength={2000}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">مشکل *</label>
                <textarea
                  name="problemStatement"
                  value={formData.problemStatement}
                  onChange={handleChange}
                  placeholder="چه مشکلی را حل می‌کنید؟"
                  className="w-full px-3 py-2 border rounded-md"
                  rows={2}
                  required
                  maxLength={1000}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">راه‌حل *</label>
                <textarea
                  name="solution"
                  value={formData.solution}
                  onChange={handleChange}
                  placeholder="راه‌حل شما چیست؟"
                  className="w-full px-3 py-2 border rounded-md"
                  rows={2}
                  required
                  maxLength={2000}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">بازار هدف *</label>
                <Input
                  name="targetMarket"
                  value={formData.targetMarket}
                  onChange={handleChange}
                  placeholder="مشتریان هدف شما چه کسانی هستند؟"
                  required
                  maxLength={500}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">فناوری‌ها</label>
                <Input
                  name="technology"
                  value={formData.technology}
                  onChange={handleChange}
                  placeholder="React, Node.js, Python (با کاما جدا کنید)"
                />
                <p className="text-xs text-gray-500 mt-1">فناوری‌ها را با کاما جدا کنید</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={createTeamMutation.isPending}
            >
              انصراف
            </Button>
            <Button
              type="submit"
              disabled={createTeamMutation.isPending}
            >
              {createTeamMutation.isPending ? 'در حال ایجاد...' : 'ایجاد تیم'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
