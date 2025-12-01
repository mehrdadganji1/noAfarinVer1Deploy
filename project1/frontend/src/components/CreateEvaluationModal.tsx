import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog'
import { Button } from './ui/button'
import { Input } from './ui/input'
import api from '@/lib/api'
import { toast } from './ui/toast'

interface CreateEvaluationModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface Criterion {
  name: string
  score: number
  maxScore: number
  weight: number
}

export function CreateEvaluationModal({ open, onOpenChange }: CreateEvaluationModalProps) {
  const queryClient = useQueryClient()
  const [formData, setFormData] = useState({
    teamId: '',
    evaluationType: 'pitch',
    feedback: '',
  })
  
  const [criteria, setCriteria] = useState<Criterion[]>([
    { name: 'Innovation', score: 0, maxScore: 10, weight: 3 },
    { name: 'Team', score: 0, maxScore: 10, weight: 2 },
    { name: 'Market', score: 0, maxScore: 10, weight: 2 },
  ])

  const createEvaluationMutation = useMutation({
    mutationFn: async () => {
      const evaluationData = {
        teamId: formData.teamId,
        evaluationType: formData.evaluationType,
        criteria: criteria,
        feedback: formData.feedback,
        strengths: [],
        weaknesses: [],
        recommendations: [],
      }
      const response = await api.post('/evaluations', evaluationData)
      return response.data
    },
    onSuccess: () => {
      toast.success('ارزیابی با موفقیت ایجاد شد')
      queryClient.invalidateQueries({ queryKey: ['evaluations'] })
      onOpenChange(false)
      resetForm()
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'خطا در ایجاد ارزیابی')
    },
  })

  const resetForm = () => {
    setFormData({
      teamId: '',
      evaluationType: 'pitch',
      feedback: '',
    })
    setCriteria([
      { name: 'Innovation', score: 0, maxScore: 10, weight: 3 },
      { name: 'Team', score: 0, maxScore: 10, weight: 2 },
      { name: 'Market', score: 0, maxScore: 10, weight: 2 },
    ])
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    createEvaluationMutation.mutate()
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleCriteriaChange = (index: number, field: keyof Criterion, value: string | number) => {
    const newCriteria = [...criteria]
    newCriteria[index] = {
      ...newCriteria[index],
      [field]: typeof value === 'string' ? parseFloat(value) || 0 : value
    }
    setCriteria(newCriteria)
  }

  const calculateTotalScore = () => {
    let totalScore = 0
    let totalWeight = 0
    
    criteria.forEach(c => {
      const normalized = (c.score / c.maxScore) * 100
      totalScore += normalized * c.weight
      totalWeight += c.weight
    })
    
    return totalWeight > 0 ? (totalScore / totalWeight).toFixed(2) : '0'
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>ثبت ارزیابی جدید</DialogTitle>
          <DialogDescription>
            ارزیابی تیم را انجام دهید
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
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
            <label className="block text-sm font-medium mb-1">نوع ارزیابی *</label>
            <select
              name="evaluationType"
              value={formData.evaluationType}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md"
              required
            >
              <option value="pitch">پیچینگ</option>
              <option value="progress">پیشرفت</option>
              <option value="final">نهایی</option>
            </select>
          </div>

          {/* Criteria */}
          <div className="border-t pt-4">
            <h3 className="font-medium mb-3">معیارهای ارزیابی</h3>
            {criteria.map((criterion, index) => (
              <div key={index} className="mb-4 p-3 bg-gray-50 rounded-md">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs mb-1">نام معیار</label>
                    <Input
                      value={criterion.name}
                      onChange={(e) => handleCriteriaChange(index, 'name', e.target.value)}
                      placeholder="نام معیار"
                    />
                  </div>
                  <div>
                    <label className="block text-xs mb-1">امتیاز (0-{criterion.maxScore})</label>
                    <Input
                      type="number"
                      value={criterion.score}
                      onChange={(e) => handleCriteriaChange(index, 'score', e.target.value)}
                      min="0"
                      max={criterion.maxScore}
                    />
                  </div>
                  <div>
                    <label className="block text-xs mb-1">حداکثر امتیاز</label>
                    <Input
                      type="number"
                      value={criterion.maxScore}
                      onChange={(e) => handleCriteriaChange(index, 'maxScore', e.target.value)}
                      min="1"
                    />
                  </div>
                  <div>
                    <label className="block text-xs mb-1">ضریب</label>
                    <Input
                      type="number"
                      value={criterion.weight}
                      onChange={(e) => handleCriteriaChange(index, 'weight', e.target.value)}
                      min="0"
                      step="0.1"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Total Score Preview */}
          <div className="bg-primary/10 p-3 rounded-md">
            <div className="text-center">
              <p className="text-sm text-gray-600">امتیاز کل (پیش‌بینی)</p>
              <p className="text-3xl font-bold text-primary">{calculateTotalScore()}</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">بازخورد</label>
            <textarea
              name="feedback"
              value={formData.feedback}
              onChange={handleChange}
              placeholder="بازخورد خود را بنویسید"
              className="w-full px-3 py-2 border rounded-md"
              rows={3}
              maxLength={2000}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={createEvaluationMutation.isPending}
            >
              انصراف
            </Button>
            <Button
              type="submit"
              disabled={createEvaluationMutation.isPending}
            >
              {createEvaluationMutation.isPending ? 'در حال ثبت...' : 'ثبت ارزیابی'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
