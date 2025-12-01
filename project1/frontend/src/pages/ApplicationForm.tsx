import React, { useState } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  FileText,
  User,
  GraduationCap,
  Lightbulb,
  Target,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Sparkles
} from 'lucide-react'
import api from '@/lib/api'
import { toast } from '@/components/ui/toast'
import { UserRole, RoleLabels, RoleDescriptions } from '@/types/roles'

const STEPS = [
  { id: 1, title: 'اطلاعات شخصی', icon: User },
  { id: 2, title: 'اطلاعات تحصیلی', icon: GraduationCap },
  { id: 3, title: 'مهارت‌ها و علایق', icon: Lightbulb },
  { id: 4, title: 'انگیزه و اهداف', icon: Target },
]

export default function ApplicationForm() {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(1)

  // Check if application already exists
  const { data: existingApplication, isLoading } = useQuery({
    queryKey: ['my-application'],
    queryFn: async () => {
      try {
        const response = await api.get('/applications/my-application')
        return response.data.data
      } catch (error: any) {
        if (error.response?.status === 404) {
          return null
        }
        throw error
      }
    },
  })

  const [formData, setFormData] = useState({
    // Personal Info
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    nationalId: '',
    dateOfBirth: '',

    // Educational Info
    university: '',
    major: '',
    degree: '',
    studentId: '',
    graduationYear: new Date().getFullYear(),

    // Professional Info
    hasStartupIdea: false,
    startupIdea: '',
    hasTeam: false,
    teamMembers: '',
    technicalSkills: '',
    interests: '',

    // Motivation
    whyJoin: '',
    goals: '',
    previousExperience: '',

    // Requested Role (CLUB_MEMBER after approval)
    requestedRole: UserRole.CLUB_MEMBER,
  })

  const submitMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await api.post('/applications/submit', {
        ...data,
        technicalSkills: data.technicalSkills.split(',').map((s: string) => s.trim()).filter(Boolean),
        interests: data.interests.split(',').map((s: string) => s.trim()).filter(Boolean),
      })
      return response.data
    },
    onSuccess: () => {
      toast.success('درخواست شما با موفقیت ثبت شد')
      navigate('/application-status')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'خطا در ثبت درخواست')
    },
  })

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        if (!formData.firstName || !formData.lastName || !formData.email || !formData.phoneNumber) {
          toast.error('لطفاً تمام فیلدهای ضروری را پر کنید')
          return false
        }
        return true
      case 2:
        if (!formData.university || !formData.major || !formData.degree) {
          toast.error('لطفاً اطلاعات تحصیلی را کامل کنید')
          return false
        }
        return true
      case 3:
        return true
      case 4:
        if (formData.whyJoin.length < 50 || formData.goals.length < 50) {
          toast.error('انگیزه و اهداف شما باید حداقل 50 کاراکتر باشد')
          return false
        }
        return true
      default:
        return true
    }
  }

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, STEPS.length))
    }
  }

  const handlePrev = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateStep(currentStep)) {
      return
    }

    submitMutation.mutate(formData)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target

    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">در حال بارگذاری...</p>
        </div>
      </div>
    )
  }

  if (existingApplication) {
    return (
      <div className="container mx-auto py-12 px-4">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <div className="flex items-center justify-center mb-4">
              <CheckCircle2 className="h-16 w-16 text-green-500" />
            </div>
            <CardTitle className="text-center text-2xl">درخواست شما قبلاً ثبت شده است</CardTitle>
            <CardDescription className="text-center text-lg">
              می‌توانید وضعیت درخواست خود را مشاهده کنید
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center gap-4">
              <Button onClick={() => navigate('/application-status')}>
                مشاهده وضعیت درخواست
              </Button>
              <Button variant="outline" onClick={() => navigate('/dashboard')}>
                برگشت به داشبورد
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">نام *</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="h-11"
                  required
                />
              </div>

              <div>
                <Label htmlFor="lastName">نام خانوادگی *</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="h-11"
                  required
                />
              </div>

              <div>
                <Label htmlFor="email">ایمیل *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="h-11"
                  required
                />
              </div>

              <div>
                <Label htmlFor="phoneNumber">شماره تماس *</Label>
                <Input
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  placeholder="09123456789"
                  className="h-11"
                  required
                />
              </div>

              <div>
                <Label htmlFor="nationalId">کد ملی *</Label>
                <Input
                  id="nationalId"
                  name="nationalId"
                  value={formData.nationalId}
                  onChange={handleChange}
                  maxLength={10}
                  className="h-11"
                  required
                />
              </div>

              <div>
                <Label htmlFor="dateOfBirth">تاریخ تولد *</Label>
                <Input
                  id="dateOfBirth"
                  name="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  className="h-11"
                  required
                />
              </div>
            </div>
          </motion.div>
        )

      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="university">دانشگاه *</Label>
                <Input
                  id="university"
                  name="university"
                  value={formData.university}
                  onChange={handleChange}
                  className="h-11"
                  required
                />
              </div>

              <div>
                <Label htmlFor="major">رشته تحصیلی *</Label>
                <Input
                  id="major"
                  name="major"
                  value={formData.major}
                  onChange={handleChange}
                  className="h-11"
                  required
                />
              </div>

              <div>
                <Label htmlFor="degree">مقطع تحصیلی *</Label>
                <select
                  id="degree"
                  name="degree"
                  value={formData.degree}
                  onChange={handleChange}
                  className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  required
                >
                  <option value="">انتخاب کنید</option>
                  <option value="دیپلم">دیپلم</option>
                  <option value="کاردانی">کاردانی</option>
                  <option value="کارشناسی">کارشناسی</option>
                  <option value="کارشناسی ارشد">کارشناسی ارشد</option>
                  <option value="دکتری">دکتری</option>
                </select>
              </div>

              <div>
                <Label htmlFor="graduationYear">سال فارغ‌التحصیلی *</Label>
                <Input
                  id="graduationYear"
                  name="graduationYear"
                  type="number"
                  value={formData.graduationYear}
                  onChange={handleChange}
                  min={2000}
                  max={2040}
                  className="h-11"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="studentId">شماره دانشجویی (اختیاری)</Label>
                <Input
                  id="studentId"
                  name="studentId"
                  value={formData.studentId}
                  onChange={handleChange}
                  className="h-11"
                />
              </div>
            </div>
          </motion.div>
        )

      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <div>
              <div className="flex items-center space-x-2 space-x-reverse mb-2">
                <input
                  type="checkbox"
                  id="hasStartupIdea"
                  name="hasStartupIdea"
                  checked={formData.hasStartupIdea}
                  onChange={handleChange}
                  className="rounded"
                />
                <Label htmlFor="hasStartupIdea">آیا ایده استارتاپی دارید؟</Label>
              </div>

              {formData.hasStartupIdea && (
                <Textarea
                  name="startupIdea"
                  value={formData.startupIdea}
                  onChange={handleChange}
                  placeholder="لطفاً ایده خود را به طور خلاصه توضیح دهید..."
                  rows={4}
                />
              )}
            </div>

            <div>
              <div className="flex items-center space-x-2 space-x-reverse mb-2">
                <input
                  type="checkbox"
                  id="hasTeam"
                  name="hasTeam"
                  checked={formData.hasTeam}
                  onChange={handleChange}
                  className="rounded"
                />
                <Label htmlFor="hasTeam">آیا تیم دارید؟</Label>
              </div>

              {formData.hasTeam && (
                <Textarea
                  name="teamMembers"
                  value={formData.teamMembers}
                  onChange={handleChange}
                  placeholder="نام و تخصص اعضای تیم را ذکر کنید..."
                  rows={3}
                />
              )}
            </div>

            <div>
              <Label htmlFor="technicalSkills">مهارت‌های فنی (با ویرگول جدا کنید)</Label>
              <Input
                id="technicalSkills"
                name="technicalSkills"
                value={formData.technicalSkills}
                onChange={handleChange}
                placeholder="مثال: React, Node.js, Python, UI/UX"
                className="h-11"
              />
            </div>

            <div>
              <Label htmlFor="interests">علایق و زمینه‌های مورد علاقه (با ویرگول جدا کنید)</Label>
              <Input
                id="interests"
                name="interests"
                value={formData.interests}
                onChange={handleChange}
                placeholder="مثال: هوش مصنوعی, اینترنت اشیا, بلاکچین"
                className="h-11"
              />
            </div>

            <div>
              <Label htmlFor="requestedRole">نقش مورد نظر *</Label>
              <select
                id="requestedRole"
                name="requestedRole"
                value={formData.requestedRole}
                onChange={handleChange}
                className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                required
              >
                <option value={UserRole.CLUB_MEMBER}>{RoleLabels[UserRole.CLUB_MEMBER]}</option>
                <option value={UserRole.TEAM_LEADER}>{RoleLabels[UserRole.TEAM_LEADER]}</option>
                <option value={UserRole.MENTOR}>{RoleLabels[UserRole.MENTOR]}</option>
                <option value={UserRole.JUDGE}>{RoleLabels[UserRole.JUDGE]}</option>
              </select>

              <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>توضیحات:</strong> {RoleDescriptions[formData.requestedRole as UserRole]}
                </p>
              </div>
            </div>
          </motion.div>
        )

      case 4:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <div>
              <Label htmlFor="whyJoin">چرا می‌خواهید به باشگاه نوآفرینان بپیوندید؟ * (حداقل 50 کاراکتر)</Label>
              <Textarea
                id="whyJoin"
                name="whyJoin"
                value={formData.whyJoin}
                onChange={handleChange}
                rows={5}
                required
                minLength={50}
                placeholder="انگیزه خود را به طور کامل توضیح دهید..."
              />
              <p className="text-sm text-gray-500 mt-1">
                {formData.whyJoin.length} / حداقل 50 کاراکتر
              </p>
            </div>

            <div>
              <Label htmlFor="goals">اهداف شما از عضویت در باشگاه چیست؟ * (حداقل 50 کاراکتر)</Label>
              <Textarea
                id="goals"
                name="goals"
                value={formData.goals}
                onChange={handleChange}
                rows={5}
                required
                minLength={50}
                placeholder="اهداف و انتظارات خود را بنویسید..."
              />
              <p className="text-sm text-gray-500 mt-1">
                {formData.goals.length} / حداقل 50 کاراکتر
              </p>
            </div>

            <div>
              <Label htmlFor="previousExperience">تجربیات قبلی در حوزه استارتاپ یا کارآفرینی (اختیاری)</Label>
              <Textarea
                id="previousExperience"
                name="previousExperience"
                value={formData.previousExperience}
                onChange={handleChange}
                rows={4}
                placeholder="در صورت داشتن تجربه، آن را شرح دهید..."
              />
            </div>
          </motion.div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-600 to-fuchsia-600 mb-4 shadow-lg">
            <Sparkles className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-black text-gray-900 mb-2">درخواست عضویت در باشگاه نوآفرینان</h1>
          <p className="text-gray-600">
            لطفاً فرم زیر را با دقت تکمیل کنید
          </p>
        </motion.div>

        {/* Progress Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            {STEPS.map((step, index) => {
              const Icon = step.icon
              const isActive = currentStep === step.id
              const isCompleted = currentStep > step.id

              return (
                <div key={step.id} className="flex items-center flex-1">
                  <div className="flex flex-col items-center flex-1">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className={`
                        w-12 h-12 rounded-xl flex items-center justify-center mb-2 transition-all
                        ${isActive ? 'bg-gradient-to-br from-violet-600 to-fuchsia-600 shadow-lg shadow-violet-500/30' : ''}
                        ${isCompleted ? 'bg-green-500' : ''}
                        ${!isActive && !isCompleted ? 'bg-gray-200' : ''}
                      `}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="h-6 w-6 text-white" />
                      ) : (
                        <Icon className={`h-6 w-6 ${isActive || isCompleted ? 'text-white' : 'text-gray-400'}`} />
                      )}
                    </motion.div>
                    <span className={`text-xs font-medium text-center ${isActive ? 'text-violet-600' : 'text-gray-500'}`}>
                      {step.title}
                    </span>
                  </div>

                  {index < STEPS.length - 1 && (
                    <div className={`h-1 flex-1 mx-2 rounded-full transition-all ${isCompleted ? 'bg-green-500' : 'bg-gray-200'
                      }`} />
                  )}
                </div>
              )
            })}
          </div>
        </motion.div>

        {/* Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="border-2 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-violet-50 to-fuchsia-50 border-b">
              <CardTitle className="flex items-center gap-2">
                {React.createElement(STEPS[currentStep - 1].icon, { className: "h-5 w-5 text-violet-600" })}
                {STEPS[currentStep - 1].title}
              </CardTitle>
              <CardDescription>
                مرحله {currentStep} از {STEPS.length}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit}>
                <AnimatePresence mode="wait">
                  {renderStepContent()}
                </AnimatePresence>

                {/* Navigation Buttons */}
                <div className="flex justify-between mt-8 pt-6 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handlePrev}
                    disabled={currentStep === 1}
                    className="h-11"
                  >
                    <ArrowRight className="ml-2 h-4 w-4" />
                    قبلی
                  </Button>

                  {currentStep < STEPS.length ? (
                    <Button
                      type="button"
                      onClick={handleNext}
                      className="h-11 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700"
                    >
                      بعدی
                      <ArrowLeft className="mr-2 h-4 w-4" />
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      disabled={submitMutation.isPending}
                      className="h-11 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                    >
                      {submitMutation.isPending ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          در حال ثبت...
                        </>
                      ) : (
                        <>
                          <FileText className="ml-2 h-5 w-5" />
                          ثبت درخواست
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

