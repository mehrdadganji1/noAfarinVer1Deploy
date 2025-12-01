import { motion } from 'framer-motion'
import { useAuthStore } from '@/store/authStore'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, Eye, Mail, Phone, Briefcase, GraduationCap, Zap } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

export default function PublicProfileView() {
  const user = useAuthStore((state) => state.user) as any
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50/30 via-pink-50/20 to-blue-50/30 p-4 md:p-6" dir="rtl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-[1200px] mx-auto space-y-6"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              onClick={() => navigate('/club-member/profile')}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              <ArrowRight className="w-4 h-4" />
              بازگشت
            </Button>
            <div className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-purple-600" />
              <h1 className="text-2xl font-bold text-gray-900">پیش‌نمایش پروفایل</h1>
            </div>
          </div>
          <Badge className="bg-purple-100 text-purple-700 border-purple-200">
            نمای عمومی
          </Badge>
        </div>

        <Card className="border-2 border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Eye className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-purple-900">
                  این نمایی است که سایر اعضای باشگاه از پروفایل شما می‌بینند
                </p>
                <p className="text-xs text-purple-700 mt-1">
                  برای تغییر تنظیمات حریم خصوصی، از دکمه "تنظیمات" در صفحه پروفایل استفاده کنید
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg overflow-hidden">
          <div className="h-32 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500" />
          <CardContent className="relative pt-0 pb-6">
            <div className="flex flex-col md:flex-row items-start md:items-end gap-4 -mt-16 md:-mt-12">
              <div className="relative">
                <div className="w-32 h-32 rounded-2xl bg-white p-2 shadow-xl">
                  <div className="w-full h-full rounded-xl bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white text-4xl font-bold">
                    {user?.firstName?.[0]}{user?.lastName?.[0]}
                  </div>
                </div>
                <Badge className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-purple-500">
                  عضو باشگاه
                </Badge>
              </div>
              <div className="flex-1 md:mr-4">
                <h2 className="text-3xl font-bold text-gray-900">
                  {user?.firstName} {user?.lastName}
                </h2>
                <p className="text-gray-600 mt-1">{user?.email}</p>
                {user?.bio && (
                  <p className="text-gray-700 mt-3 leading-relaxed">{user.bio}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardContent className="p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Phone className="w-5 h-5 text-purple-600" />
              اطلاعات تماس
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Mail className="w-5 h-5 text-purple-600" />
                <div>
                  <p className="text-xs text-gray-500">ایمیل</p>
                  <p className="text-sm font-medium text-gray-900">{user?.email}</p>
                </div>
              </div>
              {user?.phone && (
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Phone className="w-5 h-5 text-purple-600" />
                  <div>
                    <p className="text-xs text-gray-500">شماره تماس</p>
                    <p className="text-sm font-medium text-gray-900">{user.phone}</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {user?.educationHistory && user.educationHistory.length > 0 && (
          <Card className="border-0 shadow-md">
            <CardContent className="p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-purple-600" />
                تحصیلات
              </h3>
              <div className="space-y-3">
                {user.educationHistory.map((edu: any, index: number) => (
                  <div key={index} className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
                    <p className="font-bold text-gray-900">{edu.degree} - {edu.major}</p>
                    <p className="text-sm text-gray-600 mt-1">{edu.institution}</p>
                    <p className="text-xs text-gray-500 mt-2">
                      {new Date(edu.startDate).toLocaleDateString('fa-IR')}
                      {edu.endDate && ` - ${new Date(edu.endDate).toLocaleDateString('fa-IR')}`}
                      {edu.current && ' - در حال تحصیل'}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {user?.workExperience && user.workExperience.length > 0 && (
          <Card className="border-0 shadow-md">
            <CardContent className="p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-purple-600" />
                تجربیات کاری
              </h3>
              <div className="space-y-3">
                {user.workExperience.map((exp: any, index: number) => (
                  <div key={index} className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
                    <p className="font-bold text-gray-900">{exp.position}</p>
                    <p className="text-sm text-gray-600 mt-1">{exp.company}</p>
                    {exp.description && (
                      <p className="text-sm text-gray-700 mt-2">{exp.description}</p>
                    )}
                    <p className="text-xs text-gray-500 mt-2">
                      {new Date(exp.startDate).toLocaleDateString('fa-IR')}
                      {exp.endDate && ` - ${new Date(exp.endDate).toLocaleDateString('fa-IR')}`}
                      {exp.current && ' - در حال کار'}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {user?.skills && user.skills.length > 0 && (
          <Card className="border-0 shadow-md">
            <CardContent className="p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-purple-600" />
                مهارت‌ها
              </h3>
              <div className="flex flex-wrap gap-2">
                {user.skills.map((skill: any, index: number) => (
                  <Badge
                    key={index}
                    className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                  >
                    {skill.name}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </motion.div>
    </div>
  )
}
