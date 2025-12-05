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
  Users,
  Lightbulb,
  Code,
  Target,
  AlertCircle,
} from 'lucide-react'
import { toast } from '@/components/ui/toast'
import api from '@/lib/api'
import { PageSkeleton } from '@/components/ui/page-skeleton'

export default function EditTeam() {
  const { id } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    phase: 'ideation',
    status: 'active',
    project: '',
    techStack: '',
    ideaTitle: '',
    ideaDescription: '',
    problemStatement: '',
    solution: '',
    targetMarket: '',
  })

  const { data: team, isLoading } = useQuery({
    queryKey: ['team', id],
    queryFn: async () => {
      const response = await api.get(`/teams/${id}`)
      return response.data.data
    },
    enabled: !!id,
  })

  useEffect(() => {
    if (team) {
      setFormData({
        name: team.name || '',
        description: team.description || '',
        phase: team.phase || 'ideation',
        status: team.status || 'active',
        project: team.project || '',
        techStack: team.techStack?.join(', ') || '',
        ideaTitle: team.ideaTitle || '',
        ideaDescription: team.ideaDescription || '',
        problemStatement: team.problemStatement || '',
        solution: team.solution || '',
        targetMarket: team.targetMarket || '',
      })
    }
  }, [team])

  const updateMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await api.put(`/teams/${id}`, data)
      return response.data
    },
    onSuccess: () => {
      toast.success('تیم با موفقیت به‌روزرسانی شد')
      queryClient.invalidateQueries({ queryKey: ['team', id] })
      queryClient.invalidateQueries({ queryKey: ['teams'] })
      navigate(`/admin/teams/${id}`)
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'خطا در به‌روزرسانی تیم')
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name || !formData.description) {
      toast.error('لطفاً فیلدهای الزامی را پر کنید')
      return
    }

    updateMutation.mutate({
      ...formData,
      techStack: formData.techStack.split(',').map(t => t.trim()).filter(Boolean),
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
        className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 p-8 shadow-2xl"
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
                <h1 className="text-3xl font-bold text-white">ویرایش تیم</h1>
                <p className="text-white/90 mt-1">ویرایش اطلاعات تیم {team?.name}</p>
              </div>
            </div>
            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
              <Users className="h-8 w-8 text-white" />
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
                  <Users className="h-5 w-5 text-orange-600" />
                  اطلاعات تیم
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="name">نام تیم *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    placeholder="نام تیم"
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
                    placeholder="توضیحات تیم"
                    rows={4}
                    className="mt-2"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="project">پروژه</Label>
                  <Input
                    id="project"
                    value={formData.project}
                    onChange={(e) => handleChange('project', e.target.value)}
                    placeholder="نام پروژه"
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="techStack">تکنولوژی‌ها</Label>
                  <Input
                    id="techStack"
                    value={formData.techStack}
                    onChange={(e) => handleChange('techStack', e.target.value)}
                    placeholder="React, Node.js, MongoDB (با کاما جدا کنید)"
                    className="mt-2"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Idea Details */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-yellow-600" />
                  جزئیات ایده
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="ideaTitle">عنوان ایده</Label>
                  <Input
                    id="ideaTitle"
                    value={formData.ideaTitle}
                    onChange={(e) => handleChange('ideaTitle', e.target.value)}
                    placeholder="عنوان ایده"
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="ideaDescription">توضیحات ایده</Label>
                  <Textarea
                    id="ideaDescription"
                    value={formData.ideaDescription}
                    onChange={(e) => handleChange('ideaDescription', e.target.value)}
                    placeholder="توضیحات ایده"
                    rows={3}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="problemStatement">مشکل</Label>
                  <Textarea
                    id="problemStatement"
                    value={formData.problemStatement}
                    onChange={(e) => handleChange('problemStatement', e.target.value)}
                    placeholder="چه مشکلی را حل می‌کنید؟"
                    rows={3}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="solution">راه‌حل</Label>
                  <Textarea
                    id="solution"
                    value={formData.solution}
                    onChange={(e) => handleChange('solution', e.target.value)}
                    placeholder="راه‌حل شما چیست؟"
                    rows={3}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="targetMarket">بازار هدف</Label>
                  <Textarea
                    id="targetMarket"
                    value={formData.targetMarket}
                    onChange={(e) => handleChange('targetMarket', e.target.value)}
                    placeholder="مشتریان هدف"
                    rows={2}
                    className="mt-2"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status & Phase */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-red-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-orange-600" />
                  وضعیت و فاز
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="status">وضعیت تیم</Label>
                  <Select value={formData.status} onValueChange={(value) => handleChange('status', value)}>
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">فعال</SelectItem>
                      <SelectItem value="inactive">غیرفعال</SelectItem>
                      <SelectItem value="graduated">فارغ‌التحصیل</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="phase">فاز فعلی</Label>
                  <Select value={formData.phase} onValueChange={(value) => handleChange('phase', value)}>
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ideation">ایده‌پردازی</SelectItem>
                      <SelectItem value="validation">اعتبارسنجی</SelectItem>
                      <SelectItem value="mvp">MVP</SelectItem>
                      <SelectItem value="growth">رشد</SelectItem>
                      <SelectItem value="scale">مقیاس‌پذیری</SelectItem>
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
                  className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white"
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
                      <li>• تکنولوژی‌ها را با کاما جدا کنید</li>
                      <li>• فاز تیم را متناسب با پیشرفت تنظیم کنید</li>
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
