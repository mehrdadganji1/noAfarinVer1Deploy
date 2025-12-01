import { 
  FileText, 
  Calendar, 
  MessageSquare, 
  BookOpen,
  Bell,
  HelpCircle,
  Upload,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowLeft,
  Star,
  Zap
} from 'lucide-react';
import { DashboardLayout } from '@/components/applicant/dashboard/DashboardLayout';
import { WelcomeHeader } from '@/components/applicant/dashboard/WelcomeHeader';
import { ApplicationStatusCard } from '@/components/applicant/dashboard/ApplicationStatusCard';
import { StatsOverview } from '@/components/applicant/dashboard/StatsOverview';
import { UpcomingInterviews } from '@/components/applicant/dashboard/UpcomingInterviews';
import { AACoOnboarding } from '@/components/applicant/dashboard/AACoOnboarding';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useApplicationStatus } from '@/hooks/useApplicationStatus';
import { useUpcomingInterviews } from '@/hooks/useInterview';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

// Loading Skeleton Component
const DashboardSkeleton = () => (
  <DashboardLayout>
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header Skeleton */}
      <div className="bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 rounded-3xl p-8 border border-purple-100">
        <div className="h-10 w-80 bg-gray-200 rounded-xl animate-pulse mb-3" />
        <div className="h-5 w-64 bg-gray-200 rounded-lg animate-pulse" />
      </div>
      
      {/* Stats Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-2xl p-6 border-2 border-gray-200 shadow-sm">
            <div className="h-5 w-28 bg-gray-200 rounded-lg animate-pulse mb-4" />
            <div className="h-10 w-20 bg-gray-200 rounded-xl animate-pulse mb-3" />
            <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
          </div>
        ))}
      </div>
      
      {/* Content Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="h-80 bg-white rounded-2xl border-2 border-gray-200 animate-pulse shadow-sm" />
          <div className="h-96 bg-white rounded-2xl border-2 border-gray-200 animate-pulse shadow-sm" />
        </div>
        <div className="space-y-8">
          <div className="h-64 bg-white rounded-2xl border-2 border-gray-200 animate-pulse shadow-sm" />
          <div className="h-80 bg-white rounded-2xl border-2 border-gray-200 animate-pulse shadow-sm" />
        </div>
      </div>
    </div>
  </DashboardLayout>
);

export default function ApplicantDashboard() {
  const navigate = useNavigate();
  const { data: applicationData, isLoading: appLoading } = useApplicationStatus();
  const { interviews } = useUpcomingInterviews();
  const [showOnboarding, setShowOnboarding] = useState(false);

  // Check if user needs onboarding - MANDATORY for all applicants
  useEffect(() => {
    // Don't check until data is loaded
    if (appLoading) return;
    
    // CRITICAL BUSINESS RULE: ALL applicants MUST complete AACO/Training registration
    // This is MANDATORY and cannot be skipped via localStorage
    // Only check: Has the user submitted an application?
    const hasSubmittedApplication = applicationData?.hasApplication && 
                                    applicationData.status !== 'not_submitted';
    
    // Show onboarding if user hasn't submitted application
    // NO localStorage check - this is mandatory!
    const shouldShow = !hasSubmittedApplication;
    
    console.log('🔍 Mandatory Onboarding Check:', {
      hasApplication: applicationData?.hasApplication,
      applicationStatus: applicationData?.status,
      hasSubmittedApplication,
      shouldShowOnboarding: shouldShow,
      message: shouldShow ? 'User MUST complete AACO/Training registration' : 'User has submitted application'
    });
    
    setShowOnboarding(shouldShow);
  }, [applicationData, appLoading]);

  const handleOnboardingComplete = () => {
    // User completed the form and submitted application
    // The application status will be updated via API
    // No need to manually hide onboarding - it will hide automatically when data refreshes
    setShowOnboarding(false);
  };

  // Enhanced stats with better visuals
  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      draft: 'پیش‌نویس',
      submitted: 'ارسال شده',
      under_review: 'در حال بررسی',
      interview_scheduled: 'مصاحبه تعیین شده',
      accepted: 'پذیرفته شده',
      rejected: 'رد شده'
    };
    return labels[status] || 'نامشخص';
  };

  const stats = [
    {
      title: 'وضعیت درخواست',
      value: getStatusLabel(applicationData?.status || 'draft'),
      icon: FileText,
      color: 'purple' as const,
      trend: applicationData?.status === 'under_review' ? { value: 25, isPositive: true } : undefined,
      description: 'آخرین به‌روزرسانی امروز'
    },
    {
      title: 'مصاحبه‌های پیش رو',
      value: interviews?.length || 0,
      icon: Calendar,
      color: 'pink' as const,
      description: interviews?.length ? 'مصاحبه فعال' : 'بدون مصاحبه'
    },
    {
      title: 'پیام‌های جدید',
      value: 3,
      icon: MessageSquare,
      color: 'blue' as const,
      trend: { value: 12, isPositive: true },
      description: 'پاسخ سریع نیاز دارد'
    },
    {
      title: 'منابع آموزشی',
      value: 24,
      icon: BookOpen,
      color: 'green' as const,
      description: 'منبع در دسترس'
    }
  ];

  // Quick actions with luxury deep colors and badges
  const quickActions = [
    {
      title: 'مشاهده درخواست',
      description: 'وضعیت و جزئیات درخواست خود را ببینید',
      icon: FileText,
      path: '/applicant/application-status',
      color: 'text-purple-600',
      gradient: 'from-purple-600 to-blue-600',
      badge: applicationData?.status === 'under_review' ? 1 : undefined
    },
    {
      title: 'مصاحبه‌ها',
      description: 'برنامه مصاحبه‌های خود را مدیریت کنید',
      icon: Calendar,
      path: '/applicant/interviews',
      color: 'text-fuchsia-600',
      gradient: 'from-fuchsia-600 to-purple-700',
      badge: interviews?.length || undefined
    },
    {
      title: 'پیام‌ها',
      description: 'با تیم پشتیبانی در ارتباط باشید',
      icon: MessageSquare,
      path: '/applicant/messages',
      color: 'text-violet-600',
      gradient: 'from-violet-600 to-indigo-700',
      badge: 3
    },
    {
      title: 'منابع آموزشی',
      description: 'به راهنماها و مستندات دسترسی پیدا کنید',
      icon: BookOpen,
      path: '/applicant/resources',
      color: 'text-emerald-600',
      gradient: 'from-emerald-600 to-teal-700'
    },
    {
      title: 'اعلان‌ها',
      description: 'اعلان‌ها و به‌روزرسانی‌های مهم',
      icon: Bell,
      path: '/applicant/notifications',
      color: 'text-orange-600',
      gradient: 'from-orange-600 to-rose-600',
      badge: 2
    },
    {
      title: 'راهنما و پشتیبانی',
      description: 'سوالات متداول و تماس با پشتیبانی',
      icon: HelpCircle,
      path: '/applicant/help',
      color: 'text-blue-600',
      gradient: 'from-blue-600 to-cyan-600'
    }
  ];

  // Recent activities with dynamic data
  const recentActivities = [
    { 
      text: 'درخواست شما ارسال شد', 
      time: '2 ساعت پیش', 
      icon: CheckCircle2, 
      iconBg: 'bg-gradient-to-br from-emerald-100 to-teal-100', 
      iconColor: 'text-emerald-600',
      highlight: true
    },
    { 
      text: 'مدارک بارگذاری شد', 
      time: '5 ساعت پیش', 
      icon: Upload, 
      iconBg: 'bg-gradient-to-br from-blue-100 to-cyan-100', 
      iconColor: 'text-blue-600',
      highlight: false
    },
    { 
      text: 'پروفایل به‌روزرسانی شد', 
      time: '1 روز پیش', 
      icon: FileText, 
      iconBg: 'bg-gradient-to-br from-slate-100 to-gray-100', 
      iconColor: 'text-slate-600',
      highlight: false
    },
    { 
      text: 'پیام جدید از پشتیبانی', 
      time: '2 روز پیش', 
      icon: MessageSquare, 
      iconBg: 'bg-gradient-to-br from-purple-100 to-pink-100', 
      iconColor: 'text-purple-600',
      highlight: false
    }
  ];

  if (appLoading) {
    return <DashboardSkeleton />;
  }

  // If onboarding is needed, show ONLY the onboarding component
  // This is MANDATORY - user cannot access dashboard without completing registration
  if (showOnboarding) {
    return (
      <DashboardLayout>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="min-h-[calc(100vh-200px)] flex items-center justify-center"
        >
          <AACoOnboarding 
            onComplete={handleOnboardingComplete}
          />
        </motion.div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-4">
        {/* Compact Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 via-blue-600/10 to-pink-600/10 rounded-2xl" />
          <div className="absolute top-0 right-0 w-48 h-48 bg-purple-400/20 rounded-full blur-3xl" />
          
          <div className="relative p-4 rounded-2xl border border-purple-200/50 backdrop-blur-sm">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <WelcomeHeader />
              
              {/* Quick Stats Bar - Inline */}
              <div className="flex flex-wrap gap-2">
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/80 backdrop-blur-sm rounded-lg border border-purple-200 shadow-sm">
                  <Star className="w-3.5 h-3.5 text-yellow-500" />
                  <span className="text-xs font-medium text-gray-700">امتیاز: 95</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/80 backdrop-blur-sm rounded-lg border border-blue-200 shadow-sm">
                  <Zap className="w-3.5 h-3.5 text-blue-500" />
                  <span className="text-xs font-medium text-gray-700">سطح: پیشرفته</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/80 backdrop-blur-sm rounded-lg border border-emerald-200 shadow-sm">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="text-xs font-medium text-gray-700">تکمیل: {applicationData?.profileCompletion || 0}%</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Overview - Compact */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <StatsOverview stats={stats} />
        </motion.div>

        {/* Main Content Grid - Compact */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-4">
            {/* Application Status */}
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <ApplicationStatusCard
                status={(applicationData?.status || 'draft') as 'draft' | 'submitted' | 'under_review' | 'interview_scheduled' | 'accepted' | 'rejected'}
                progress={applicationData?.profileCompletion || 0}
                submittedAt={applicationData?.application?.createdAt}
                interviewDate={interviews?.[0]?.interviewDate}
              />
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              <Card className="bg-white rounded-xl border border-gray-200 hover:border-purple-300 hover:shadow-lg transition-all duration-300">
                <CardHeader className="pb-2 pt-3 px-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg">
                        <Sparkles className="w-4 h-4 text-purple-600" />
                      </div>
                      <CardTitle className="text-base font-bold">دسترسی سریع</CardTitle>
                    </div>
                    <Badge variant="secondary" className="gap-1 text-xs">
                      <Zap className="w-3 h-3" />
                      {quickActions.length}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="px-4 pb-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {quickActions.map((action, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        className="justify-start gap-3 h-auto py-3 px-4 hover:bg-purple-50 hover:border-purple-300 transition-all"
                        onClick={() => navigate(action.path)}
                      >
                        <div className="p-2 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg">
                          <action.icon className="w-4 h-4 text-purple-600" />
                        </div>
                        <div className="text-right flex-1">
                          <div className="font-semibold text-sm">{action.title}</div>
                          <div className="text-xs text-gray-500">{action.description}</div>
                        </div>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            {/* Upcoming Interviews */}
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <UpcomingInterviews interviews={(interviews || []) as any} />
            </motion.div>

            {/* Recent Activity - Compact */}
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              <Card className="bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 rounded-xl border border-blue-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300">
                <CardHeader className="pb-2 pt-3 px-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-lg">
                        <Clock className="w-4 h-4 text-blue-600" />
                      </div>
                      <CardTitle className="text-base font-bold">فعالیت‌های اخیر</CardTitle>
                    </div>
                    <Badge variant="secondary" className="bg-blue-100 text-blue-700 border-blue-200 text-xs">
                      {recentActivities.length}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="px-4 pb-3">
                  <div className="space-y-2">
                    {recentActivities.slice(0, 3).map((activity, index) => {
                      const Icon = activity.icon;
                      return (
                        <div
                          key={index}
                          className={`
                            flex items-center gap-2.5 p-2.5 rounded-lg 
                            hover:bg-white/80 transition-all duration-200
                            ${activity.highlight ? 'bg-white/80 border border-emerald-200' : 'bg-white/40'}
                            cursor-pointer
                          `}
                        >
                          <div className={`p-2 rounded-lg ${activity.iconBg}`}>
                            <Icon className={`w-3.5 h-3.5 ${activity.iconColor}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-foreground font-medium truncate">
                              {activity.text}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {activity.time}
                            </p>
                          </div>
                          {activity.highlight && (
                            <Badge className="bg-emerald-500 text-white border-0 text-[10px] px-1.5 py-0.5">
                              جدید
                            </Badge>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full mt-2 h-8 text-xs hover:bg-blue-50"
                    onClick={() => navigate('/applicant/activity')}
                  >
                    مشاهده همه
                    <ArrowLeft className="w-3.5 h-3.5 mr-1" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
