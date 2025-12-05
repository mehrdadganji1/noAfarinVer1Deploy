import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  ArrowLeft,
  Save,
  GraduationCap,
  BookOpen,
  Clock,
  AlertCircle,
} from 'lucide-react'
import { toast } from '@/components/ui/toast'
import api from '@/lib/api'
import { PageSkeleton } from '@/components/ui/page-skeleton'

export default function EditTraining() {
  const { id } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    instructor: '',
    duration: '',
    level: 'beginner',
    status: 'draft',
    capacity: '',
    topics: '',
    prerequisites: '',
    objectives: '',
    startDate: '',
    endDate: '',
  })

  const { data: training, isLoading } = useQuery({
    queryKey: ['training', id],
    queryFn: async () => {
      const response = await api.get(`/trainings/${id}`)
      return response.data.data
    },
    enabled: !!id,
  })

  useEffect(() => {
    if (training) {
      setFormData({
        title: training.title || '',
        description: training.description || '',
        category: training.category || '',
        instructor: training.instructor || '',
        duration: training.duration?.toString() || '',
        level: training.level || 'beginner',
        status: training.status || 'draft',
        capacity: training.capacity?.toString() || '',
        topics: training.topics?.join(', ') || '',
        prerequisites: training.prerequisites?.join(', ') || '',
        objectives: training.objectives?.join(', ') || '',
        startDate: training.startDate ? new Date(training.startDate).toISOString().slice(0, 16) : '',
        endDate: training.endDate ? new Date(training.endDate).toISOString().slice(0, 16) : '',
      })
    }
  }, [training])

  const updateMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await api.put(`/trainings/${id}`, data)
      return response.data
    },
    onSuccess: () => {
      toast.success('دوره با موفقیت به‌روزرسانی شد')
      queryClient.invalidateQueries({ queryKey: ['training', id] })
      queryClient.invalidateQueries({ queryKey: ['trainings'] })
      navigate(`/admin/trainings/${id}`)
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'خطا در به‌روزرسانی دوره')
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title || !formData.description || !formData.instructor || !formData.duration) {
      toast.error('لطفاً فیلدهای الزامی را پر کنید')
      return
    }

    updateMutation.mutate({
      ...formData,
      duration: parseInt(formData.duration),
      capacity: formData.capacity ? parseInt(formData.capacity) : undefined,
      topics: formData.topics.split(',').map(t => t.trim()).filter(Boolean),
      prerequisites: formData.prerequisites.split(',').map(p => p.trim()).filter(Boolean),
      objectives: formData.objectives.split(',').map(o => o.trim()).filter(Boolean),
    })
  }

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  if (isLoading) {
    return <PageSkeleton />
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 p-8 shadow-2xl"
      >
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(-1)}
                className="bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm"
              >
                <ArrowLeft className="ml-2 h-4 w-4" />
                بازگشت
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-white">ویرایش دوره آموزشی</h1>
                <p className="text-white/90 mt-1">ویرایش اطلاعات دوره {training?.title}</p>
              </div>
            </div>
            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
              <GraduationCap className="h-8 w-8 text-white" />
            </div>
          </div>
        </div>
      </motion.div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-teal-600" />
                  اطلاعات پایه
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title">عنوان دوره *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleChange('title', e.target.value)}
                    placeholder="عنوان دوره"
                    className="mt-2"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="description">توضیحات *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                    placeholder="توضیحات دوره"
                    rows={4}
                    className="mt-2"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="instructor">مدرس *</Label>
                    <Input
                      id="instructor"
                      value={formData.instructor}
                      onChange={(e) => handleChange('instructor', e.target.value)}
                      placeholder="نام مدرس"
                      className="mt-2"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="category">دسته‌بندی</Label>
                    <Input
                      id="category"
                      value={formData.category}
                      onChange={(e) => handleChange('category', e.target.value)}
                      placeholder="دسته‌بندی"
                      className="mt-2"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="duration">مدت زمان (ساعت) *</Label>
                    <Input
                      id="duration"
                      type="number"
                      value={formData.duration}
                      onChange={(e) => handleChange('duration', e.target.value)}
                      placeholder="مدت زمان"
                      className="mt-2"
                      min="1"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="capacity">ظرفیت</Label>
                    <Input
                      id="capacity"
                      type="number"
                      value={formData.capacity}
                      onChange={(e) => handleChange('capacity', e.target.value)}
                      placeholder="تعداد نفر"
                      className="mt-2"
                      min="1"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="startDate">تاریخ شروع</Label>
                    <Input
                      id="startDate"
                      type="datetime-local"
                      value={formData.startDate}
                      onChange={(e) => handleChange('startDate', e.target.value)}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="endDate">تاریخ پایان</Label>
                    <Input
                      id="endDate"
                      type="datetime-local"
                      value={formData.endDate}
                      onChange={(e) => handleChange('endDate', e.target.value)}
                      className="mt-2"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Course Details */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-blue-600" />
                  جزئیات دوره
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="topics">موضوعات</Label>
                  <Input
                    id="topics"
                    value={formData.topics}
                    onChange={(e) => handleChange('topics', e.target.value)}
                    placeholder="React, JavaScript, TypeScript (با کاما جدا کنید)"
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="prerequisites">پیش‌نیازها</Label>
                  <Input
                    id="prerequisites"
                    value={formData.prerequisites}
                    onChange={(e) => handleChange('prerequisites', e.target.value)}
                    placeholder="HTML, CSS, JavaScript (با کاما جدا کنید)"
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="objectives">اهداف دوره</Label>
                  <Textarea
                    id="objectives"
                    value={formData.objectives}
                    onChange={(e) => handleChange('objectives', e.target.value)}
                    placeholder="یادگیری React, ساخت اپلیکیشن (با کاما جدا کنید)"
                    rows={3}
                    className="mt-2"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status & Level */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-teal-50 to-cyan-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-teal-600" />
                  وضعیت و سطح
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="status">وضعیت دوره</Label>
                  <Select value={formData.status} onValueChange={(value) => handleChange('status', value)}>
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">پیش‌نویس</SelectItem>
                      <SelectItem value="published">منتشر شده</SelectItem>
                      <SelectItem value="archived">آرشیو شده</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="level">سطح دوره</Label>
                  <Select value={formData.level} onValueChange={(value) => handleChange('level', value)}>
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">مقدماتی</SelectItem>
                      <SelectItem value="intermediate">متوسط</SelectItem>
                      <SelectItem value="advanced">پیشرفته</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <Card className="border-0 shadow-lg">
              <CardContent className="pt-6 space-y-3">
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white"
                  disabled={updateMutation.isPending}
                >
                  <Save className="ml-2 h-5 w-5" />
                  {updateMutation.isPending ? 'در حال ذخیره...' : 'ذخیره تغییرات'}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => navigate(-1)}
                >
                  انصراف
                </Button>
              </CardContent>
            </Card>

            {/* Help Card */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-cyan-50">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-gray-700">
                    <p className="font-semibold mb-2">نکات مهم:</p>
                    <ul className="space-y-1 text-xs">
                      <li>• فیلدهای دارای * الزامی هستند</li>
                      <li>• مدت زمان را به ساعت وارد کنید</li>
                      <li>• موضوعات و پیش‌نیازها را با کاما جدا کنید</li>
                      <li>• سطح دوره را متناسب با محتوا تنظیم کنید</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  )
}
