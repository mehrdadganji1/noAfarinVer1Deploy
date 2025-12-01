import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { 
  ArrowRight, Save, Edit, X, CheckCircle, XCircle, Clock, AlertCircle,
  User, Mail, Phone, GraduationCap, MapPin, Award, FileText, Calendar
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import api from '@/lib/api'

type StatusType = 'pending' | 'approved' | 'rejected' | 'under-review'

export default function ApplicationDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    university: '',
    major: '',
    degree: '',
    studentId: '',
  })
  const [selectedStatus, setSelectedStatus] = useState<StatusType>('pending')
  const [reviewNotes, setReviewNotes] = useState('')

  // Fetch application
  const { data: application, isLoading } = useQuery({
    queryKey: ['application', id],
    queryFn: async () => {
      const response = await api.get(`/applications/${id}`)
      const app = response.data.data
      setFormData({
        firstName: app.firstName || app.userId?.firstName || '',
        lastName: app.lastName || app.userId?.lastName || '',
        email: app.email || app.userId?.email || '',
        phoneNumber: app.phoneNumber || '',
        university: app.university || '',
        major: app.major || '',
        degree: app.degree || '',
        studentId: app.studentId || '',
      })
      setSelectedStatus(app.status)
      setReviewNotes(app.reviewNotes || '')
      return app
    },
  })

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const response = await api.patch(`/applications/${id}`, data)
      return response.data
    },
    onSuccess: () => {
      console.log('اطلاعات با موفقیت ویرایش شد')
      setIsEditing(false)
      queryClient.invalidateQueries({ queryKey: ['application', id] })
      queryClient.invalidateQueries({ queryKey: ['director-applications'] })
    },
    onError: (error: any) => {
      console.error('خطا در ویرایش:', error.response?.data?.error || 'خطا در ویرایش')
    },
  })

  // Change status mutation
  const changeStatusMutation = useMutation({
    mutationFn: async () => {
      const response = await api.patch(`/applications/${id}/status`, {
        status: selectedStatus,
        reviewNotes: reviewNotes
      })
      return response.data
    },
    onSuccess: () => {
      console.log('وضعیت با موفقیت تغییر کرد')
      queryClient.invalidateQueries({ queryKey: ['application', id] })
      queryClient.invalidateQueries({ queryKey: ['director-applications'] })
      queryClient.invalidateQueries({ queryKey: ['applications-stats'] })
    },
    onError: (error: any) => {
      console.error('خطا در تغییر وضعیت:', error.response?.data?.error || 'خطا در تغییر وضعیت')
    },
  })

  const statusOptions = [
    { value: 'pending' as StatusType, label: 'در انتظار', icon: Clock, color: 'yellow' },
    { value: 'under-review' as StatusType, label: 'در حال بررسی', icon: AlertCircle, color: 'blue' },
    { value: 'approved' as StatusType, label: 'تایید شده', icon: CheckCircle, color: 'green' },
    { value: 'rejected' as StatusType, label: 'رد شده', icon: XCircle, color: 'red' },
  ]

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'نامشخص'
    try {
      return new Date(dateString).toLocaleDateString('fa-IR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch {
      return 'نامعتبر'
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!application) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">درخواست یافت نشد</h2>
          <Button onClick={() => navigate('/director/applications')}>بازگشت به لیست</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 shadow-lg">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/director/applications')}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <ArrowRight className="h-6 w-6" />
              </button>
              <div>
                <h1 className="text-3xl font-bold">
                  {application.firstName} {application.lastName}
                </h1>
                <p className="text-blue-100 mt-1">{application.email}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {!isEditing ? (
                <Button
                  onClick={() => setIsEditing(true)}
                  className="bg-white/20 hover:bg-white/30"
                >
                  <Edit className="h-4 w-4 ml-2" />
                  ویرایش اطلاعات
                </Button>
              ) : (
                <>
                  <Button
                    onClick={() => {
                      updateMutation.mutate(formData)
                    }}
                    disabled={updateMutation.isPending}
                    className="bg-green-500 hover:bg-green-600"
                  >
                    <Save className="h-4 w-4 ml-2" />
                    ذخیره
                  </Button>
                  <Button
                    onClick={() => setIsEditing(false)}
                    className="bg-white/20 hover:bg-white/30"
                  >
                    <X className="h-4 w-4 ml-2" />
                    انصراف
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content - 2 columns */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Info */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <User className="h-5 w-5 text-blue-600" />
                  اطلاعات شخصی
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    label="نام"
                    icon={User}
                    value={formData.firstName}
                    onChange={(v) => setFormData(prev => ({ ...prev, firstName: v }))}
                    disabled={!isEditing}
                  />
                  <FormField
                    label="نام خانوادگی"
                    icon={User}
                    value={formData.lastName}
                    onChange={(v) => setFormData(prev => ({ ...prev, lastName: v }))}
                    disabled={!isEditing}
                  />
                  <FormField
                    label="ایمیل"
                    icon={Mail}
                    type="email"
                    value={formData.email}
                    onChange={(v) => setFormData(prev => ({ ...prev, email: v }))}
                    disabled={!isEditing}
                  />
                  <FormField
                    label="تلفن"
                    icon={Phone}
                    value={formData.phoneNumber}
                    onChange={(v) => setFormData(prev => ({ ...prev, phoneNumber: v }))}
                    disabled={!isEditing}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Academic Info */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-purple-600" />
                  اطلاعات تحصیلی
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    label="دانشگاه"
                    icon={MapPin}
                    value={formData.university}
                    onChange={(v) => setFormData(prev => ({ ...prev, university: v }))}
                    disabled={!isEditing}
                  />
                  <FormField
                    label="رشته"
                    icon={Award}
                    value={formData.major}
                    onChange={(v) => setFormData(prev => ({ ...prev, major: v }))}
                    disabled={!isEditing}
                  />
                  <div>
                    <label className="block text-sm font-medium mb-2">مقطع</label>
                    <select
                      value={formData.degree}
                      onChange={(e) => setFormData(prev => ({ ...prev, degree: e.target.value }))}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border rounded-lg disabled:bg-gray-100"
                    >
                      <option value="کارشناسی">کارشناسی</option>
                      <option value="کارشناسی ارشد">کارشناسی ارشد</option>
                      <option value="دکتری">دکتری</option>
                    </select>
                  </div>
                  <FormField
                    label="شماره دانشجویی"
                    icon={FileText}
                    value={formData.studentId}
                    onChange={(v) => setFormData(prev => ({ ...prev, studentId: v }))}
                    disabled={!isEditing}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Review Notes */}
            {application.reviewNotes && (
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold mb-4">یادداشت بررسی</h2>
                  <p className="text-gray-700 leading-relaxed">{application.reviewNotes}</p>
                  {application.reviewedAt && (
                    <p className="text-sm text-gray-500 mt-3">
                      <Calendar className="h-4 w-4 inline ml-1" />
                      {formatDate(application.reviewedAt)}
                    </p>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar - 1 column */}
          <div className="space-y-6">
            {/* Status Card */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-4">وضعیت درخواست</h2>
                
                <div className="space-y-3 mb-4">
                  {statusOptions.map((option) => {
                    const Icon = option.icon
                    const isSelected = selectedStatus === option.value
                    const isCurrent = application.status === option.value
                    
                    return (
                      <button
                        key={option.value}
                        onClick={() => setSelectedStatus(option.value)}
                        disabled={isCurrent}
                        className={`w-full p-3 rounded-lg border-2 transition-all text-right ${
                          isSelected
                            ? (option.color === 'yellow' ? 'border-yellow-500 bg-yellow-50' :
                               option.color === 'blue' ? 'border-blue-500 bg-blue-50' :
                               option.color === 'green' ? 'border-green-500 bg-green-50' :
                               'border-red-500 bg-red-50')
                            : 'border-gray-200 hover:border-gray-300'
                        } ${isCurrent ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className={`h-5 w-5 ${
                            option.color === 'yellow' ? 'text-yellow-600' :
                            option.color === 'blue' ? 'text-blue-600' :
                            option.color === 'green' ? 'text-green-600' :
                            'text-red-600'
                          }`} />
                          <span className="font-medium">{option.label}</span>
                          {isCurrent && (
                            <span className="mr-auto text-xs bg-gray-500 text-white px-2 py-1 rounded-full">
                              فعلی
                            </span>
                          )}
                        </div>
                      </button>
                    )
                  })}
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">یادداشت</label>
                  <textarea
                    value={reviewNotes}
                    onChange={(e) => setReviewNotes(e.target.value)}
                    placeholder="یادداشت خود را وارد کنید..."
                    className="w-full p-3 border rounded-lg min-h-[100px]"
                  />
                </div>

                <Button
                  onClick={() => changeStatusMutation.mutate()}
                  disabled={changeStatusMutation.isPending || selectedStatus === application.status}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600"
                >
                  ذخیره تغییرات
                </Button>
              </CardContent>
            </Card>

            {/* Timeline */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-4">تاریخچه</h2>
                <div className="space-y-4">
                  <TimelineItem
                    icon={FileText}
                    title="ثبت درخواست"
                    date={formatDate(application.submittedAt)}
                    color="blue"
                  />
                  {application.reviewedAt && (
                    <TimelineItem
                      icon={application.status === 'approved' ? CheckCircle : XCircle}
                      title={application.status === 'approved' ? 'تایید شد' : 'رد شد'}
                      date={formatDate(application.reviewedAt)}
                      color={application.status === 'approved' ? 'green' : 'red'}
                    />
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

function FormField({ label, icon: Icon, type = 'text', value, onChange, disabled }: {
  label: string
  icon?: any
  type?: string
  value: string
  onChange: (value: string) => void
  disabled: boolean
}) {
  return (
    <div>
      <label className="block text-sm font-medium mb-2 flex items-center gap-2">
        {Icon && <Icon className="h-4 w-4 text-gray-500" />}
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="w-full px-3 py-2 border rounded-lg disabled:bg-gray-100 disabled:cursor-not-allowed"
      />
    </div>
  )
}

function TimelineItem({ icon: Icon, title, date, color }: any) {
  const bgClass = color === 'blue' ? 'bg-blue-100' : color === 'green' ? 'bg-green-100' : 'bg-red-100'
  const textClass = color === 'blue' ? 'text-blue-600' : color === 'green' ? 'text-green-600' : 'text-red-600'
  
  return (
    <div className="flex items-start gap-3">
      <div className={`w-8 h-8 rounded-full ${bgClass} flex items-center justify-center flex-shrink-0`}>
        <Icon className={`h-4 w-4 ${textClass}`} />
      </div>
      <div>
        <p className="font-medium text-gray-900">{title}</p>
        <p className="text-sm text-gray-500">{date}</p>
      </div>
    </div>
  )
}
