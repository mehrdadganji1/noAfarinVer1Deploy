import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
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
  Calendar,
  MapPin,
  Users,
  FileText,
  Video,
  Sparkles,
  AlertCircle,
} from 'lucide-react'
import { toast } from '@/components/ui/toast'
import api from '@/lib/api'
import { PageSkeleton } from '@/components/ui/page-skeleton'

export default function EditEvent() {
  const { id } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: '',
    startDate: '',
    endDate: '',
    location: '',
    isOnline: false,
    meetingLink: '',
    capacity: '',
    agenda: '',
    status: 'upcoming',
  })

  const { data: event, isLoading } = useQuery({
    queryKey: ['event', id],
    queryFn: async () => {
      const response = await api.get(`/events/${id}`)
      return response.data.data
    },
    enabled: !!id,
  })

  useEffect(() => {
    if (event) {
      setFormData({
        title: event.title || '',
        description: event.description || '',
        type: event.type || '',
        startDate: event.startDate ? new Date(event.startDate).toISOString().slice(0, 16) : '',
        endDate: event.endDate ? new Date(event.endDate).toISOString().slice(0, 16) : '',
        location: event.location || '',
        isOnline: event.isOnline || false,
        meetingLink: event.meetingLink || '',
        capacity: event.capacity?.toString() || '',
        agenda: event.agenda || '',
        status: event.status || 'upcoming',
      })
    }
  }, [event])

  const updateMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await api.put(`/events/${id}`, data)
      return response.data
    },
    onSuccess: () => {
      toast.success('رویداد با موفقیت به‌روزرسانی شد')
      queryClient.invalidateQueries({ queryKey: ['event', id] })
      queryClient.invalidateQueries({ queryKey: ['events'] })
      navigate(`/admin/events/${id}`)
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'خطا در به‌روزرسانی رویداد')
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title || !formData.description || !formData.type || !formData.startDate) {
      toast.error('لطفاً فیلدهای الزامی را پر کنید')
      return
    }

    updateMutation.mutate({
      ...formData,
      capacity: formData.capacity ? parseInt(formData.capacity) : undefined,
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
        className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 p-8 shadow-2xl"
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
                <h1 className="text-3xl font-bold text-white">ویرایش رویداد</h1>
                <p className="text-white/90 mt-1">ویرایش اطلاعات رویداد</p>
              </div>
            </div>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="p-3 bg-white/20 backdrop-blur-sm rounded-xl"
            >
              <Sparkles className="h-8 w-8 text-white" />
            </motion.div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -ml-24 -mb-24"></div>
      </motion.div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-purple-600" />
                    اطلاعات اصلی
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="title">عنوان رویداد *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => handleChange('title', e.target.value)}
                      placeholder="عنوان رویداد را وارد کنید"
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
                      placeholder="توضیحات کامل رویداد"
                      rows={4}
                      className="mt-2"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="type">نوع رویداد *</Label>
                    <Select value={formData.type} onValueChange={(value) => handleChange('type', value)}>
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="نوع رویداد را انتخاب کنید" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="aaco">رویداد AACO</SelectItem>
                        <SelectItem value="workshop">کارگاه</SelectItem>
                        <SelectItem value="industrial_visit">بازدید صنعتی</SelectItem>
                        <SelectItem value="training">دوره آموزشی</SelectItem>
                        <SelectItem value="pitch_session">جلسه پیچینگ</SelectItem>
                        <SelectItem value="closing_ceremony">مراسم اختتامیه</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="agenda">دستور جلسه</Label>
                    <Textarea
                      id="agenda"
                      value={formData.agenda}
                      onChange={(e) => handleChange('agenda', e.target.value)}
                      placeholder="برنامه زمان‌بندی رویداد"
                      rows={4}
                      className="mt-2"
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Date & Time */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-blue-600" />
                    تاریخ و زمان
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="startDate">تاریخ و ساعت شروع *</Label>
                    <Input
                      id="startDate"
                      type="datetime-local"
                      value={formData.startDate}
                      onChange={(e) => handleChange('startDate', e.target.value)}
                      className="mt-2"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="endDate">تاریخ و ساعت پایان</Label>
                    <Input
                      id="endDate"
                      type="datetime-local"
                      value={formData.endDate}
                      onChange={(e) => handleChange('endDate', e.target.value)}
                      className="mt-2"
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Location */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-green-600" />
                    محل برگزاری
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Video className="h-5 w-5 text-gray-600" />
                      <Label htmlFor="isOnline" className="cursor-pointer">رویداد آنلاین</Label>
                    </div>
                    <Switch
                      id="isOnline"
                      checked={formData.isOnline}
                      onCheckedChange={(checked) => handleChange('isOnline', checked)}
                    />
                  </div>

                  {formData.isOnline ? (
                    <div>
                      <Label htmlFor="meetingLink">لینک جلسه آنلاین</Label>
                      <Input
                        id="meetingLink"
                        type="url"
                        value={formData.meetingLink}
                        onChange={(e) => handleChange('meetingLink', e.target.value)}
                        placeholder="https://meet.google.com/..."
                        className="mt-2"
                      />
                    </div>
                  ) : (
                    <div>
                      <Label htmlFor="location">آدرس محل برگزاری</Label>
                      <Input
                        id="location"
                        value={formData.location}
                        onChange={(e) => handleChange('location', e.target.value)}
                        placeholder="آدرس کامل"
                        className="mt-2"
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status & Capacity */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-pink-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-purple-600" />
                    تنظیمات
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="status">وضعیت رویداد</Label>
                    <Select value={formData.status} onValueChange={(value) => handleChange('status', value)}>
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="upcoming">آینده</SelectItem>
                        <SelectItem value="ongoing">در حال برگزاری</SelectItem>
                        <SelectItem value="completed">پایان یافته</SelectItem>
                        <SelectItem value="cancelled">لغو شده</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="capacity">ظرفیت (تعداد نفر)</Label>
                    <Input
                      id="capacity"
                      type="number"
                      value={formData.capacity}
                      onChange={(e) => handleChange('capacity', e.target.value)}
                      placeholder="مثال: 50"
                      className="mt-2"
                      min="1"
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card className="border-0 shadow-lg">
                <CardContent className="pt-6 space-y-3">
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
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
            </motion.div>

            {/* Help Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-cyan-50">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-gray-700">
                      <p className="font-semibold mb-2">نکات مهم:</p>
                      <ul className="space-y-1 text-xs">
                        <li>• فیلدهای دارای * الزامی هستند</li>
                        <li>• تاریخ پایان باید بعد از تاریخ شروع باشد</li>
                        <li>• برای رویدادهای آنلاین، لینک جلسه را وارد کنید</li>
                        <li>• ظرفیت را بر اساس امکانات تعیین کنید</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </form>
    </div>
  )
}
