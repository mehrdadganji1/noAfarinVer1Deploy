import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Avatar } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  ArrowRight, 
  Calendar, 
  Clock,
  Video,
  AlertCircle,
  CheckCircle2,
  Info,
  Sparkles,
  TrendingUp
} from 'lucide-react'
import { useApplicationStatus } from '@/hooks/useApplicationStatus'
import { useAuthStore } from '@/store/authStore'
import { 
  useUpcomingInterviews, 
  usePastInterviews,
  useNextInterview 
} from '@/hooks/useInterview'
import InterviewCard from '@/components/applicant/InterviewCard'
import { Interview as InterviewType } from '@/types/interview'

export default function Interview() {
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)
  const [, setActiveTab] = useState<'upcoming' | 'past'>('upcoming')

  const { data: applicationData, isLoading: isLoadingApp } = useApplicationStatus()

  const { interviews: upcomingInterviews, isLoading: isLoadingUpcoming } = useUpcomingInterviews(user?._id)
  const { interviews: pastInterviews, isLoading: isLoadingPast } = usePastInterviews(user?._id)
  const nextInterview = useNextInterview(user?._id)

  const handleViewDetails = (interview: InterviewType) => {
    console.log('View interview details:', interview)
  }

  if (isLoadingApp) {
    return (
      <div className="flex items-center justify-center h-96">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-3"
        >
          <div className="relative">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#7209B7]/20 border-t-[#7209B7] mx-auto"></div>
            <div className="absolute inset-0 rounded-full bg-[#7209B7]/5 blur-xl"></div>
          </div>
          <p className="text-sm font-semibold bg-gradient-to-r from-[#7209B7] to-[#FF006E] bg-clip-text text-transparent">
            در حال بارگذاری...
          </p>
        </motion.div>
      </div>
    )
  }

  // If no application yet
  if (!applicationData?.hasApplication) {
    return (
      <div className="space-y-3 max-w-[1600px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative group"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#00D9FF] via-[#7209B7] to-[#FF006E] rounded-lg p-[2px]">
            <div className="w-full h-full bg-white rounded-lg" />
          </div>
          <div className="relative bg-gradient-to-br from-white to-neutral-50/50 rounded-lg shadow-[0_0_12px_rgba(0,217,255,0.08)] p-3 sm:p-4">
            <div className="flex items-center gap-2">
              <Avatar className="h-10 w-10 border-2 border-[#7209B7]/20">
                <div className="w-full h-full bg-gradient-to-br from-[#7209B7] to-[#FF006E] flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-white" />
                </div>
              </Avatar>
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-gray-900">مصاحبه‌ها</h1>
                <p className="text-[10px] sm:text-xs text-gray-600 mt-0.5">برنامه مصاحبه‌ها</p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Alert className="border-0 bg-gradient-to-r from-orange-50 to-amber-50 shadow-[0_0_12px_rgba(251,146,60,0.08)]">
            <AlertCircle className="h-3.5 w-3.5 text-orange-600" />
            <AlertDescription className="text-xs">
              ابتدا باید فرم درخواست را تکمیل کنید تا بتوانید مصاحبه‌های خود را مشاهده کنید.
            </AlertDescription>
          </Alert>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Button 
            onClick={() => navigate('/application-form')} 
            size="sm" 
            className="h-8 text-xs bg-gradient-to-r from-[#7209B7] to-[#FF006E] hover:from-[#FF006E] hover:to-[#7209B7] shadow-[0_0_12px_rgba(114,9,183,0.3)]"
          >
            تکمیل فرم درخواست
          </Button>
        </motion.div>
      </div>
    )
  }

  const hasUpcoming = upcomingInterviews && upcomingInterviews.length > 0
  const hasPast = pastInterviews && pastInterviews.length > 0

  return (
    <div className="space-y-3 sm:space-y-4 font-primary max-w-[1600px] mx-auto">
      {/* Modern Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative group"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[#00D9FF] via-[#7209B7] to-[#FF006E] rounded-lg p-[2px]">
          <div className="w-full h-full bg-white rounded-lg" />
        </div>
        <div className="relative bg-gradient-to-br from-white to-neutral-50/50 rounded-lg shadow-[0_0_12px_rgba(0,217,255,0.08)] p-3 sm:p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <Avatar className="h-10 w-10 sm:h-12 sm:w-12 border-2 border-[#7209B7]/20 shadow-[0_0_12px_rgba(114,9,183,0.15)]">
                <div className="w-full h-full bg-gradient-to-br from-[#7209B7] to-[#FF006E] flex items-center justify-center">
                  <Calendar className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
              </Avatar>
              <div>
                <h1 className="text-base sm:text-lg font-bold text-gray-900 flex items-center gap-1.5">
                  مصاحبه‌های من
                  <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#FF006E]" />
                </h1>
                <p className="text-[10px] sm:text-xs text-gray-600 mt-0.5">مشاهده و مدیریت برنامه مصاحبه‌ها</p>
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate('/applicant/dashboard')}
              className="h-8 text-xs"
            >
              <ArrowRight className="ml-1 h-3.5 w-3.5" />
              داشبورد
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Next Interview Highlight */}
      {nextInterview && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="relative overflow-hidden border-0 shadow-[0_0_20px_rgba(114,9,183,0.15)] bg-gradient-to-br from-purple-50/50 to-pink-50/30">
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-[#7209B7]/10 to-transparent rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-[#FF006E]/10 to-transparent rounded-full blur-2xl" />
            <CardHeader className="relative">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#7209B7]/15 to-[#FF006E]/15 flex items-center justify-center relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#7209B7] to-[#FF006E] rounded-xl opacity-0 group-hover:opacity-10 transition-opacity" />
                    <Calendar className="h-6 w-6 text-[#7209B7] relative z-10" />
                  </div>
                  <div>
                    <CardTitle className="text-base sm:text-lg flex items-center gap-1.5">
                      مصاحبه بعدی شما
                      <Sparkles className="h-4 w-4 text-[#FF006E]" />
                    </CardTitle>
                    <p className="text-xs text-gray-600 mt-0.5">آماده باشید!</p>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="relative">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="flex items-center gap-2.5 p-3 bg-white/80 backdrop-blur-sm rounded-lg border border-purple-100 shadow-sm">
                  <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                    <Calendar className="h-4.5 w-4.5 text-[#7209B7]" />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-600">تاریخ</p>
                    <p className="text-sm font-semibold">{new Date(nextInterview.interviewDate).toLocaleDateString('fa-IR')}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2.5 p-3 bg-white/80 backdrop-blur-sm rounded-lg border border-purple-100 shadow-sm">
                  <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center">
                    <Clock className="h-4.5 w-4.5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-600">ساعت</p>
                    <p className="text-sm font-semibold">{nextInterview.interviewTime}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2.5 p-3 bg-white/80 backdrop-blur-sm rounded-lg border border-purple-100 shadow-sm">
                  <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-pink-100 to-rose-100 flex items-center justify-center">
                    <Video className="h-4.5 w-4.5 text-[#FF006E]" />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-600">نوع</p>
                    <p className="text-sm font-semibold">{nextInterview.meetingLink ? 'آنلاین' : 'حضوری'}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Statistics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="relative overflow-hidden border-0 shadow-[0_0_12px_rgba(0,217,255,0.08)] hover:shadow-[0_0_20px_rgba(0,217,255,0.15)] transition-all duration-300 group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[#00D9FF]/10 to-transparent rounded-full blur-2xl" />
            <CardContent className="p-3 sm:p-4 relative">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-600">پیش‌رو</p>
                  <p className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-[#00D9FF] to-[#00B8D9] bg-clip-text text-transparent">{upcomingInterviews?.length || 0}</p>
                </div>
                <div className="w-11 h-11 rounded-lg bg-gradient-to-br from-[#00D9FF]/15 to-[#00B8D9]/15 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Calendar className="h-5 w-5 text-[#00D9FF]" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <Card className="relative overflow-hidden border-0 shadow-[0_0_12px_rgba(34,197,94,0.08)] hover:shadow-[0_0_20px_rgba(34,197,94,0.15)] transition-all duration-300 group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-green-400/10 to-transparent rounded-full blur-2xl" />
            <CardContent className="p-3 sm:p-4 relative">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-600">انجام شده</p>
                  <p className="text-2xl sm:text-3xl font-bold text-green-600">{pastInterviews?.filter(i => i.status === 'completed').length || 0}</p>
                </div>
                <div className="w-11 h-11 rounded-lg bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="relative overflow-hidden border-0 shadow-[0_0_12px_rgba(114,9,183,0.08)] hover:shadow-[0_0_20px_rgba(114,9,183,0.15)] transition-all duration-300 group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[#7209B7]/10 to-transparent rounded-full blur-2xl" />
            <CardContent className="p-3 sm:p-4 relative">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-600">کل مصاحبه‌ها</p>
                  <p className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-[#7209B7] to-[#FF006E] bg-clip-text text-transparent">{((upcomingInterviews?.length || 0) + (pastInterviews?.length || 0))}</p>
                </div>
                <div className="w-11 h-11 rounded-lg bg-gradient-to-br from-[#7209B7]/15 to-[#FF006E]/15 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <TrendingUp className="h-5 w-5 text-[#7209B7]" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.35 }}
      >
        <Tabs defaultValue="upcoming" className="w-full" onValueChange={(value) => setActiveTab(value as 'upcoming' | 'past')}>
          <TabsList className="grid w-full grid-cols-2 bg-gradient-to-r from-gray-100 to-gray-50 p-1 h-auto">
            <TabsTrigger 
              value="upcoming" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#7209B7] data-[state=active]:to-[#FF006E] data-[state=active]:text-white data-[state=active]:shadow-[0_0_12px_rgba(114,9,183,0.3)] text-xs sm:text-sm py-2"
            >
              <Calendar className="ml-1.5 h-3.5 w-3.5" />
              پیش‌رو ({upcomingInterviews?.length || 0})
            </TabsTrigger>
            <TabsTrigger 
              value="past"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#00D9FF] data-[state=active]:to-[#00B8D9] data-[state=active]:text-white data-[state=active]:shadow-[0_0_12px_rgba(0,217,255,0.3)] text-xs sm:text-sm py-2"
            >
              <CheckCircle2 className="ml-1.5 h-3.5 w-3.5" />
              گذشته ({pastInterviews?.length || 0})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="mt-3 sm:mt-4 space-y-3 sm:space-y-4">
            {hasUpcoming ? (
              upcomingInterviews.map((interview, index) => (
                <motion.div
                  key={interview._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <InterviewCard
                    interview={interview}
                    onViewDetails={handleViewDetails}
                  />
                </motion.div>
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <Card className="border-2 border-dashed border-gray-200 bg-gradient-to-br from-gray-50/50 to-white">
                  <CardContent className="pt-10 pb-10 text-center">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center mx-auto mb-4">
                      <Calendar className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">
                      مصاحبه‌ای برنامه‌ریزی نشده
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600">
                      در حال حاضر مصاحبه‌ای برای شما برنامه‌ریزی نشده است.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </TabsContent>

          <TabsContent value="past" className="mt-3 sm:mt-4 space-y-3 sm:space-y-4">
            {hasPast ? (
              pastInterviews.map((interview, index) => (
                <motion.div
                  key={interview._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <InterviewCard
                    interview={interview}
                    onViewDetails={handleViewDetails}
                    showActions={false}
                  />
                </motion.div>
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <Card className="border-2 border-dashed border-gray-200 bg-gradient-to-br from-gray-50/50 to-white">
                  <CardContent className="pt-10 pb-10 text-center">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center mx-auto mb-4">
                      <CheckCircle2 className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">
                      مصاحبه‌ای انجام نشده
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600">
                      هنوز مصاحبه‌ای انجام نداده‌اید.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </TabsContent>
        </Tabs>
      </motion.div>

      {/* Help Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="relative overflow-hidden border-0 shadow-[0_0_12px_rgba(59,130,246,0.08)] bg-gradient-to-br from-blue-50/50 to-cyan-50/30">
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-blue-400/10 to-transparent rounded-full blur-3xl" />
          <CardHeader className="relative">
            <CardTitle className="flex items-center gap-2.5 text-base sm:text-lg">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center">
                <Info className="h-4.5 w-4.5 text-blue-600" />
              </div>
              نکات مهم برای مصاحبه
            </CardTitle>
          </CardHeader>
          <CardContent className="relative">
            <ul className="space-y-2 text-xs sm:text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <div className="w-5 h-5 rounded-md bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CheckCircle2 className="h-3 w-3 text-blue-600" />
                </div>
                <span>حداقل 10 دقیقه قبل از زمان مصاحبه آماده باشید</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-5 h-5 rounded-md bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CheckCircle2 className="h-3 w-3 text-purple-600" />
                </div>
                <span>برای مصاحبه‌های آنلاین، اتصال اینترنت و دوربین خود را چک کنید</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-5 h-5 rounded-md bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CheckCircle2 className="h-3 w-3 text-green-600" />
                </div>
                <span>مدارک و رزومه خود را آماده داشته باشید</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-5 h-5 rounded-md bg-gradient-to-br from-orange-100 to-amber-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CheckCircle2 className="h-3 w-3 text-orange-600" />
                </div>
                <span>در صورت عدم امکان حضور، حداقل 24 ساعت قبل اطلاع دهید</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
