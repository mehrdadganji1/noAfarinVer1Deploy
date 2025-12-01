import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog'
import { Button } from './ui/button'
import { Input } from './ui/input'
import api from '@/lib/api'
import { toast } from './ui/toast'

interface CreateFundingModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateFundingModal({ open, onOpenChange }: CreateFundingModalProps) {
  const queryClient = useQueryClient()
  const [formData, setFormData] = useState({
    teamId: '',
    amount: '',
    type: 'loan',
    purpose: '',
    duration: '12',
    collateral: '',
  })

  const createFundingMutation = useMutation({
    mutationFn: async () => {
      // Build terms string
      const termsText = `مدت: ${formData.duration} ماه\nهدف: ${formData.purpose}${formData.collateral ? `\nوثیقه: ${formData.collateral}` : ''}`
      
      const fundingData = {
        teamId: formData.teamId,
        amount: parseFloat(formData.amount),
        type: formData.type,
        terms: termsText,
        documents: [],
      }
      const response = await api.post('/fundings', fundingData)
      return response.data
    },
    onSuccess: () => {
      toast.success('درخواست تسهیلات با موفقیت ثبت شد')
      queryClient.invalidateQueries({ queryKey: ['fundings'] })
      onOpenChange(false)
      resetForm()
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'خطا در ثبت درخواست')
    },
  })

  const resetForm = () => {
    setFormData({
      teamId: '',
      amount: '',
      type: 'loan',
      purpose: '',
      duration: '12',
      collateral: '',
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validation
    if (parseFloat(formData.amount) < 1000000) {
      toast.error('مبلغ درخواستی باید حداقل 1,000,000 تومان باشد')
      return
    }
    
    if (parseFloat(formData.amount) > 1000000000) {
      toast.error('مبلغ درخواستی نمی‌تواند بیش از 1,000,000,000 تومان باشد')
      return
    }
    
    createFundingMutation.mutate()
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  const formatNumber = (value: string) => {
    const number = value.replace(/[^0-9]/g, '')
    return new Intl.NumberFormat('fa-IR').format(parseInt(number) || 0)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>درخواست تسهیلات مالی</DialogTitle>
          <DialogDescription>
            فرم درخواست تسهیلات را تکمیل کنید
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-1">شناسه تیم *</label>
              <Input
                name="teamId"
                value={formData.teamId}
                onChange={handleChange}
                placeholder="507f1f77bcf86cd799439011"
                required
              />
              <p className="text-xs text-gray-500 mt-1">MongoDB ObjectId تیم</p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">مبلغ (تومان) *</label>
              <Input
                name="amount"
                type="text"
                value={formData.amount}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9]/g, '')
                  setFormData(prev => ({ ...prev, amount: value }))
                }}
                placeholder="10000000"
                required
              />
              {formData.amount && (
                <p className="text-xs text-primary mt-1">
                  {formatNumber(formData.amount)} تومان
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">نوع تسهیلات *</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md"
                required
              >
                <option value="loan">وام</option>
                <option value="grant">کمک بلاعوض</option>
                <option value="investment">سرمایه‌گذاری</option>
              </select>
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium mb-1">هدف از دریافت *</label>
              <textarea
                name="purpose"
                value={formData.purpose}
                onChange={handleChange}
                placeholder="توضیح دهید که این تسهیلات برای چه منظوری نیاز است..."
                className="w-full px-3 py-2 border rounded-md"
                rows={3}
                required
                maxLength={500}
              />
              <p className="text-xs text-gray-500 mt-1">
                {formData.purpose.length}/500 کاراکتر
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">مدت بازپرداخت (ماه) *</label>
              <Input
                name="duration"
                type="number"
                value={formData.duration}
                onChange={handleChange}
                min="1"
                max="120"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                {formData.duration} ماه ({Math.ceil(parseInt(formData.duration) / 12)} سال)
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">وثیقه (اختیاری)</label>
              <Input
                name="collateral"
                value={formData.collateral}
                onChange={handleChange}
                placeholder="مثال: سند ملک، چک، سفته"
              />
            </div>
          </div>

          {/* Preview */}
          <div className="bg-gray-50 p-4 rounded-md border">
            <h4 className="font-medium mb-2">پیش‌نمایش درخواست</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-gray-600">مبلغ:</span>
                <span className="font-medium mr-2">
                  {formData.amount ? formatNumber(formData.amount) : '0'} تومان
                </span>
              </div>
              <div>
                <span className="text-gray-600">مدت:</span>
                <span className="font-medium mr-2">{formData.duration} ماه</span>
              </div>
              <div>
                <span className="text-gray-600">قسط ماهانه (تقریبی):</span>
                <span className="font-medium mr-2">
                  {formData.amount && formData.duration
                    ? formatNumber((parseFloat(formData.amount) / parseInt(formData.duration)).toString())
                    : '0'} تومان
                </span>
              </div>
              <div>
                <span className="text-gray-600">نوع:</span>
                <span className="font-medium mr-2">
                  {formData.type === 'loan' ? 'وام' :
                   formData.type === 'grant' ? 'کمک بلاعوض' : 'سرمایه‌گذاری'}
                </span>
              </div>
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 p-3 rounded-md text-sm">
            <p className="text-blue-800">
              ℹ️ درخواست شما پس از ثبت توسط تیم مالی بررسی و نتیجه به شما اعلام خواهد شد.
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={createFundingMutation.isPending}
            >
              انصراف
            </Button>
            <Button
              type="submit"
              disabled={createFundingMutation.isPending}
            >
              {createFundingMutation.isPending ? 'در حال ثبت...' : 'ثبت درخواست'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
