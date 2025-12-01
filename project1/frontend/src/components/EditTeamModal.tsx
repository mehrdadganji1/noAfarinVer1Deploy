import { useState, useEffect } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import { Dialog, DialogContent } from './ui/dialog'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { X, Save, Users, Lightbulb, Target, TrendingUp, Code, Building2 } from 'lucide-react'
import { toast } from './ui/toast'
import api from '@/lib/api'

interface Team {
  _id: string
  name: string
  description: string
  ideaTitle: string
  ideaDescription: string
  problemStatement: string
  solution: string
  targetMarket: string
  technology: string[]
  status: string
  phase: string
}

interface EditTeamModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  team: Team | null
}

export function EditTeamModal({ open, onOpenChange, team }: EditTeamModalProps) {
  const queryClient = useQueryClient()
  const [activeTab, setActiveTab] = useState<'basic' | 'idea' | 'status'>('basic')
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    ideaTitle: '',
    ideaDescription: '',
    problemStatement: '',
    solution: '',
    targetMarket: '',
    technology: '',
    status: '',
    phase: '',
  })

  useEffect(() => {
    if (team) {
      setFormData({
        name: team.name || '',
        description: team.description || '',
        ideaTitle: team.ideaTitle || '',
        ideaDescription: team.ideaDescription || '',
        problemStatement: team.problemStatement || '',
        solution: team.solution || '',
        targetMarket: team.targetMarket || '',
        technology: team.technology?.join(', ') || '',
        status: team.status || 'draft',
        phase: team.phase || 'ideation',
      })
    }
  }, [team])

  const updateTeamMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await api.put(`/teams/${team?._id}`, {
        ...data,
        technology: data.technology.split(',').map((t: string) => t.trim()).filter(Boolean),
      })
      return response.data
    },
    onSuccess: () => {
      toast.success('تیم با موفقیت بروزرسانی شد')
      queryClient.invalidateQueries({ queryKey: ['teams'] })
      queryClient.invalidateQueries({ queryKey: ['team', team?._id] })
      onOpenChange(false)
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'خطا در بروزرسانی تیم')
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    updateTeamMutation.mutate(formData)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const tabs = [
    { id: 'basic' as const, label: 'اطلاعات پایه', icon: Users },
    { id: 'idea' as const, label: 'ایده و راه‌حل', icon: Lightbulb },
    { id: 'status' as const, label: 'وضعیت', icon: TrendingUp },
  ]

  const statusOptions = [
    { value: 'draft', label: 'پیش‌نویس', color: 'bg-gray-100 text-gray-700' },
    { value: 'active', label: 'فعال', color: 'bg-green-100 text-green-700' },
    { value: 'in_evaluation', label: 'در حال ارزیابی', color: 'bg-yellow-100 text-yellow-700' },
    { value: 'selected', label: 'انتخاب شده', color: 'bg-blue-100 text-blue-700' },
    { value: 'rejected', label: 'رد شده', color: 'bg-red-100 text-red-700' },
    { value: 'graduated', label: 'فارغ‌التحصیل', color: 'bg-purple-100 text-purple-700' },
  ]

  const phaseOptions = [
    { value: 'ideation', label: 'ایده‌پردازی' },
    { value: 'aaco_event', label: 'رویداد AACO' },
    { value: 'training', label: 'توانمندسازی' },
    { value: 'mvp_development', label: 'توسعه MVP' },
    { value: 'pitch_preparation', label: 'آماده‌سازی پیچ' },
    { value: 'final_presentation', label: 'ارائه نهایی' },
    { value: 'park_entry', label: 'ورود به پارک' },
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl h-[85vh] p-0 overflow-hidden">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="relative overflow-hidden bg-gradient-to-r from-purple-600 to-pink-600 p-6 text-white">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
            </div>
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-1">ویرایش تیم</h2>
                <p className="text-white/80 text-sm">اطلاعات تیم خود را بروزرسانی کنید</p>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => onOpenChange(false)}
                className="text-white hover:bg-white/20"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mt-6 relative z-50">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      setActiveTab(tab.id)
                    }}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all cursor-pointer ${
                      activeTab === tab.id
                        ? 'bg-white text-purple-600 shadow-lg'
                        : 'bg-white/20 text-white hover:bg-white/30'
                    }`}
                  >
                    <Icon className="h-4 w-4 pointer-events-none" />
                    <span className="text-sm font-medium pointer-events-none">{tab.label}</span>
                  </button>
                )
              })}
            </div>
          </div>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6" dir="rtl">
            <AnimatePresence mode="wait">
              {activeTab === 'basic' && (
                <motion.div
                  key="basic"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-4"
                >
                  <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Users className="h-5 w-5 text-purple-600" />
                      <h3 className="font-bold text-purple-900">اطلاعات پایه تیم</h3>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          نام تیم <span className="text-red-500">*</span>
                        </label>
                        <Input
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="border-2 focus:border-purple-500"
                          placeholder="نام تیم خود را وارد کنید"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          توضیحات تیم <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          name="description"
                          value={formData.description}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border-2 rounded-lg focus:border-purple-500 focus:outline-none resize-none"
                          rows={4}
                          required
                          maxLength={1000}
                          placeholder="توضیحات کامل درباره تیم..."
                        />
                        <div className="text-xs text-gray-500 mt-1 text-left">
                          {formData.description.length}/1000
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'idea' && (
                <motion.div
                  key="idea"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-4"
                >
                  <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Lightbulb className="h-5 w-5 text-blue-600" />
                      <h3 className="font-bold text-blue-900">ایده</h3>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          عنوان ایده <span className="text-red-500">*</span>
                        </label>
                        <Input
                          name="ideaTitle"
                          value={formData.ideaTitle}
                          onChange={handleChange}
                          required
                          className="border-2 focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          توضیحات ایده <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          name="ideaDescription"
                          value={formData.ideaDescription}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border-2 rounded-lg focus:border-blue-500 focus:outline-none resize-none"
                          rows={3}
                          required
                          maxLength={2000}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-orange-50 border-2 border-orange-200 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Target className="h-5 w-5 text-orange-600" />
                      <h3 className="font-bold text-orange-900">مشکل و راه‌حل</h3>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          مشکل <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          name="problemStatement"
                          value={formData.problemStatement}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border-2 rounded-lg focus:border-orange-500 focus:outline-none resize-none"
                          rows={3}
                          required
                          maxLength={1000}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          راه‌حل <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          name="solution"
                          value={formData.solution}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border-2 rounded-lg focus:border-orange-500 focus:outline-none resize-none"
                          rows={3}
                          required
                          maxLength={2000}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Building2 className="h-5 w-5 text-green-600" />
                      <h3 className="font-bold text-green-900">بازار و فناوری</h3>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          بازار هدف <span className="text-red-500">*</span>
                        </label>
                        <Input
                          name="targetMarket"
                          value={formData.targetMarket}
                          onChange={handleChange}
                          required
                          maxLength={500}
                          className="border-2 focus:border-green-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                          <Code className="h-4 w-4" />
                          فناوری‌ها
                        </label>
                        <Input
                          name="technology"
                          value={formData.technology}
                          onChange={handleChange}
                          placeholder="React, Node.js, Python (با کاما جدا کنید)"
                          className="border-2 focus:border-green-500"
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'status' && (
                <motion.div
                  key="status"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-4"
                >
                  <div className="bg-indigo-50 border-2 border-indigo-200 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-4">
                      <TrendingUp className="h-5 w-5 text-indigo-600" />
                      <h3 className="font-bold text-indigo-900">وضعیت تیم</h3>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                          وضعیت فعلی
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                          {statusOptions.map((option) => (
                            <button
                              key={option.value}
                              type="button"
                              onClick={() => setFormData(prev => ({ ...prev, status: option.value }))}
                              className={`p-4 rounded-xl border-2 transition-all ${
                                formData.status === option.value
                                  ? 'border-indigo-500 shadow-lg scale-105'
                                  : 'border-gray-200 hover:border-indigo-300'
                              }`}
                            >
                              <div className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${option.color}`}>
                                {option.label}
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                          مرحله فعلی
                        </label>
                        <select
                          name="phase"
                          value={formData.phase}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border-2 rounded-lg focus:border-indigo-500 focus:outline-none font-medium"
                        >
                          {phaseOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Footer */}
          <div className="border-t bg-gray-50 p-4 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              {activeTab === 'basic' && '1/3 - اطلاعات پایه'}
              {activeTab === 'idea' && '2/3 - ایده و راه‌حل'}
              {activeTab === 'status' && '3/3 - وضعیت'}
            </div>
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={updateTeamMutation.isPending}
              >
                انصراف
              </Button>
              <Button
                type="submit"
                disabled={updateTeamMutation.isPending}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                {updateTeamMutation.isPending ? (
                  <>در حال ذخیره...</>
                ) : (
                  <>
                    <Save className="h-4 w-4 ml-2" />
                    ذخیره تغییرات
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
