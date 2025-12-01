import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { ArrowRight, Mail, Phone, Calendar, GraduationCap, Building2, User as UserIcon, Shield, Crown, Users, FileText, Briefcase, Save, X, Check } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { PageSkeleton } from '@/components/ui/page-skeleton'
import { toast } from '@/components/ui/toast'
import api from '@/lib/api'
import { getUsersListPath } from '@/utils/navigation'
import { UserRole } from '@/types/roles'

interface User {
  _id: string
  firstName: string
  lastName: string
  email: string
  phoneNumber?: string
  role: UserRole | UserRole[]
  university?: string
  major?: string
  studentId?: string
  isActive: boolean
  isVerified: boolean
  expertise?: string[]
  createdAt: string
}

export default function UserProfile() {
  const { userId } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [selectedRoles, setSelectedRoles] = useState<UserRole[]>([])
  const [isEditingRoles, setIsEditingRoles] = useState(false)

  // Fetch user details
  const { data: user, isLoading, error } = useQuery<User>({
    queryKey: ['user', userId],
    queryFn: async () => {
      const response = await api.get(`/users/${userId}`)
      return response.data.data
    }
  })

  // Update selected roles when user data changes
  useEffect(() => {
    if (user) {
      setSelectedRoles(Array.isArray(user.role) ? user.role : [user.role])
    }
  }, [user])

  // Update roles mutation
  const updateRolesMutation = useMutation({
    mutationFn: async (roles: UserRole[]) => {
      const response = await api.patch(`/users/${userId}/roles`, { roles })
      return response.data
    },
    onSuccess: () => {
      toast({
        title: 'موفقیت',
        description: 'نقش‌های کاربر با موفقیت بروزرسانی شد',
      })
      queryClient.invalidateQueries({ queryKey: ['user', userId] })
      setIsEditingRoles(false)
    },
    onError: (error: any) => {
      toast({
        title: 'خطا',
        description: error.response?.data?.error || 'خطا در بروزرسانی نقش‌ها',
        variant: 'destructive',
      })
    },
  })

  const roleOptions = [
    {
      value: 'director' as UserRole,
      label: 'مدیرکل',
      description: 'بالاترین سطح دسترسی',
      icon: Crown,
      gradient: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-300',
      textColor: 'text-purple-700'
    },
    {
      value: 'admin' as UserRole,
      label: 'مدیر سیستم',
      description: 'مدیریت کامل سیستم',
      icon: Shield,
      gradient: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-300',
      textColor: 'text-blue-700'
    },
    {
      value: 'manager' as UserRole,
      label: 'مدیر',
      description: 'نظارت و مدیریت',
      icon: Briefcase,
      gradient: 'from-cyan-500 to-teal-500',
      bgColor: 'bg-cyan-50',
      borderColor: 'border-cyan-300',
      textColor: 'text-cyan-700'
    },
    {
      value: 'club_member' as UserRole,
      label: 'عضو باشگاه',
      description: 'دسترسی اعضا',
      icon: Users,
      gradient: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-300',
      textColor: 'text-green-700'
    },
    {
      value: 'applicant' as UserRole,
      label: 'متقاضی',
      description: 'درخواست عضویت',
      icon: FileText,
      gradient: 'from-orange-500 to-amber-500',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-300',
      textColor: 'text-orange-700'
    }
  ]

  const handleToggleRole = (role: UserRole) => {
    setSelectedRoles(prev =>
      prev.includes(role)
        ? prev.filter(r => r !== role)
        : [...prev, role]
    )
  }

  const handleSaveRoles = () => {
    if (selectedRoles.length === 0) {
      toast({
        title: 'خطا',
        description: 'حداقل یک نقش باید انتخاب شود',
        variant: 'destructive',
      })
      return
    }
    updateRolesMutation.mutate(selectedRoles)
  }

  const handleCancelEdit = () => {
    if (user) {
      setSelectedRoles(Array.isArray(user.role) ? user.role : [user.role])
    }
    setIsEditingRoles(false)
  }

  console.log('UserProfile - userId:', userId)
  console.log('UserProfile - user:', user)
  console.log('UserProfile - error:', error)

  if (isLoading) {
    return <PageSkeleton showHeader itemsCount={6} />
  }

  if (error) {
    const errorStatus = (error as any)?.response?.status
    const errorMessage = (error as any)?.response?.data?.error || 'خطا در دریافت اطلاعات'

    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-2xl mx-4"
        >
          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center shadow-lg">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mb-3">دسترسی غیرمجاز</h2>
            <p className="text-lg text-gray-600 mb-6">{errorMessage}</p>

            {errorStatus === 403 && (
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-300 rounded-2xl p-6 mb-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <div className="text-right flex-1">
                    <h3 className="font-bold text-yellow-900 mb-2">چرا این خطا رخ داده؟</h3>
                    <p className="text-sm text-yellow-800 mb-3">
                      برای مشاهده پروفایل کاربران دیگر، شما باید یکی از نقش‌های زیر را داشته باشید:
                    </p>
                    <div className="flex flex-wrap gap-2 justify-center mb-3">
                      <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold">👑 Director</span>
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">🔧 Admin</span>
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">📊 Manager</span>
                    </div>
                    <p className="text-sm text-yellow-800">
                      لطفاً با یک حساب کاربری مناسب وارد شوید یا از مدیر سیستم دسترسی لازم را درخواست کنید.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {errorStatus === 404 && (
              <div className="bg-gray-50 border-2 border-gray-200 rounded-2xl p-6 mb-6">
                <p className="text-gray-700">
                  کاربر مورد نظر در سیستم یافت نشد. ممکن است حذف شده یا شناسه آن اشتباه باشد.
                </p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                onClick={() => navigate(-1)}
                className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800"
              >
                <ArrowRight className="h-4 w-4 ml-2" />
                بازگشت
              </Button>

              {errorStatus === 403 && (
                <>
                  <Button
                    onClick={() => navigate(getUsersListPath())}
                    className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                  >
                    لیست کاربران
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      localStorage.removeItem('token')
                      localStorage.removeItem('user')
                      navigate('/login')
                    }}
                    className="border-2 border-red-300 text-red-700 hover:bg-red-50"
                  >
                    خروج و ورود مجدد
                  </Button>
                </>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">کاربر یافت نشد</h2>
          <Button onClick={() => navigate('/admin/users')}>بازگشت به لیست کاربران</Button>
        </div>
      </div>
    )
  }

  const roles = Array.isArray(user.role) ? user.role : [user.role]

  return (
    <div className="h-[calc(100vh-4rem)] overflow-hidden p-4">
      {/* Compact Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 p-4 text-white shadow-lg mb-4"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-2xl font-bold">
              {user.firstName?.[0]}{user.lastName?.[0]}
            </div>
            <div>
              <h1 className="text-2xl font-bold">{user.firstName} {user.lastName}</h1>
              <div className="flex items-center gap-2 mt-1">
                {roles.slice(0, 2).map((role: string) => (
                  <span key={role} className="px-3 py-0.5 rounded-full text-xs font-semibold bg-white/20">
                    {role}
                  </span>
                ))}
                {roles.length > 2 && <span className="text-xs">+{roles.length - 2}</span>}
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(getUsersListPath())}
            className="text-white hover:bg-white/20"
          >
            <ArrowRight className="h-4 w-4 ml-1" />
            بازگشت
          </Button>
        </div>
      </motion.div>

      {/* Main Content: 2 Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-[calc(100%-6rem)]">
        {/* Left Column: User Info (2/3 width) */}
        <div className="lg:col-span-2 space-y-4 overflow-y-auto pr-2">
          {/* Contact & Education in one row */}
          <div className="grid grid-cols-2 gap-4">
            {/* Contact Information */}
            <Card className="border-0 shadow">
              <CardHeader className="pb-3 bg-blue-50">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  اطلاعات تماس
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-3 space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-blue-600" />
                  <span className="text-gray-900">{user.email}</span>
                </div>
                {user.phoneNumber && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-green-600" />
                    <span>{user.phoneNumber}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-purple-600" />
                  <span>{new Date(user.createdAt).toLocaleDateString('fa-IR')}</span>
                </div>
              </CardContent>
            </Card>

            {/* Educational Information */}
            <Card className="border-0 shadow">
              <CardHeader className="pb-3 bg-purple-50">
                <CardTitle className="text-sm flex items-center gap-2">
                  <GraduationCap className="h-4 w-4" />
                  اطلاعات تحصیلی
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-3 space-y-2">
                {user.university ? (
                  <>
                    <div className="flex items-center gap-2 text-sm">
                      <Building2 className="h-4 w-4 text-indigo-600" />
                      <span>{user.university}</span>
                    </div>
                    {user.major && (
                      <div className="flex items-center gap-2 text-sm">
                        <GraduationCap className="h-4 w-4 text-purple-600" />
                        <span>{user.major}</span>
                      </div>
                    )}
                    {user.studentId && (
                      <div className="flex items-center gap-2 text-sm">
                        <UserIcon className="h-4 w-4 text-pink-600" />
                        <span>{user.studentId}</span>
                      </div>
                    )}
                  </>
                ) : (
                  <p className="text-sm text-gray-500">اطلاعات ثبت نشده</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Account Status & Expertise */}
          <Card className="border-0 shadow">
            <CardHeader className="pb-3 bg-gray-50">
              <CardTitle className="text-sm">وضعیت حساب</CardTitle>
            </CardHeader>
            <CardContent className="pt-3">
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="text-center p-2 bg-gray-50 rounded">
                  <p className="text-gray-600 mb-1">وضعیت</p>
                  <p className={`font-bold ${user.isActive ? 'text-green-600' : 'text-red-600'}`}>
                    {user.isActive ? 'فعال' : 'غیرفعال'}
                  </p>
                </div>
                <div className="text-center p-2 bg-gray-50 rounded">
                  <p className="text-gray-600 mb-1">تایید</p>
                  <p className={`font-bold ${user.isVerified ? 'text-green-600' : 'text-orange-600'}`}>
                    {user.isVerified ? 'شده' : 'نشده'}
                  </p>
                </div>
              </div>
              {user.expertise && user.expertise.length > 0 && (
                <div className="mt-3 pt-3 border-t">
                  <p className="text-xs text-gray-600 mb-2">تخصص‌ها:</p>
                  <div className="flex flex-wrap gap-1">
                    {user.expertise.slice(0, 4).map((skill: string, i: number) => (
                      <span key={i} className="px-2 py-1 rounded-full bg-orange-100 text-orange-700 text-xs">
                        {skill}
                      </span>
                    ))}
                    {user.expertise.length > 4 && (
                      <span className="px-2 py-1 text-xs text-gray-500">+{user.expertise.length - 4}</span>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Role Management (1/3 width) */}
        <div className="lg:col-span-1 overflow-y-auto">
          <Card className="border-0 shadow-lg h-full">
            <CardHeader className="pb-3 bg-gradient-to-r from-purple-50 to-pink-50 sticky top-0 z-10">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Shield className="h-4 w-4 text-purple-600" />
                  مدیریت نقش‌ها
                </CardTitle>
                {!isEditingRoles && (
                  <Button
                    size="sm"
                    onClick={() => setIsEditingRoles(true)}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 h-8"
                  >
                    <Shield className="h-3 w-3 ml-1" />
                    ویرایش
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              {isEditingRoles ? (
                <div className="space-y-3">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-2">
                    <p className="text-xs text-blue-800">
                      💡 چند نقش را همزمان انتخاب کنید
                    </p>
                  </div>

                  <div className="space-y-2">
                    {roleOptions.map((option) => {
                      const Icon = option.icon
                      const isSelected = selectedRoles.includes(option.value)

                      return (
                        <button
                          key={option.value}
                          onClick={() => handleToggleRole(option.value)}
                          className={`relative w-full p-3 rounded-lg border-2 transition-all text-right ${isSelected
                            ? `${option.bgColor} ${option.borderColor} shadow-md`
                            : 'bg-white border-gray-200 hover:border-gray-300'
                            }`}
                        >
                          {isSelected && (
                            <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                              <Check className="h-3 w-3 text-white" />
                            </div>
                          )}

                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${option.gradient} flex items-center justify-center flex-shrink-0`}>
                              <Icon className="h-5 w-5 text-white" />
                            </div>
                            <div className="text-right flex-1">
                              <h3 className={`font-bold text-sm ${isSelected ? option.textColor : 'text-gray-900'}`}>
                                {option.label}
                              </h3>
                              <p className={`text-xs ${isSelected ? option.textColor : 'text-gray-600'}`}>
                                {option.description}
                              </p>
                            </div>
                          </div>
                        </button>
                      )
                    })}
                  </div>

                  <div className="flex gap-2 pt-2 border-t">
                    <Button
                      onClick={handleSaveRoles}
                      disabled={updateRolesMutation.isPending || selectedRoles.length === 0}
                      className="flex-1 h-9 text-sm bg-gradient-to-r from-green-600 to-emerald-600"
                    >
                      {updateRolesMutation.isPending ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                      ) : (
                        <>
                          <Save className="h-3 w-3 ml-1" />
                          ذخیره ({selectedRoles.length})
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCancelEdit}
                      disabled={updateRolesMutation.isPending}
                      className="h-9"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-xs text-gray-600 mb-3">نقش‌های فعلی:</p>
                  {roleOptions
                    .filter(option => roles.includes(option.value))
                    .map((option) => {
                      const Icon = option.icon
                      return (
                        <div
                          key={option.value}
                          className={`p-3 rounded-lg border-2 ${option.bgColor} ${option.borderColor}`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${option.gradient} flex items-center justify-center flex-shrink-0`}>
                              <Icon className="h-5 w-5 text-white" />
                            </div>
                            <div className="text-right">
                              <h3 className={`font-bold text-sm ${option.textColor}`}>
                                {option.label}
                              </h3>
                              <p className={`text-xs ${option.textColor}`}>
                                {option.description}
                              </p>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>


    </div>
  )
}
