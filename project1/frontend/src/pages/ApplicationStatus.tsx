/**
 * Application Status Page - Tab-based Version
 * Clean, professional dashboard with tabs for viewing AACO application status
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, ArrowRight, AlertCircle, User, GraduationCap, Lightbulb, Heart, FileText } from 'lucide-react';
import { useAACOApplicationStatus } from '@/hooks/useAACOApplicationStatus';
import { toPersianDate } from '@/utils/dateUtils';
import {
  StatusOverviewCard,
  PersonalInfoCard,
  EducationalInfoCard,
  StartupIdeaCard,
  MotivationCard,
  StatusTimeline,
  QuickActionsPanel,
  StatusPageHeader
} from '@/components/application-status';

export default function ApplicationStatus() {
  const navigate = useNavigate();
  const { application: aacoApplication, isLoading: aacoLoading } = useAACOApplicationStatus();
  const [activeTab, setActiveTab] = useState('overview');

  const formatDate = (date: string | Date) => {
    return toPersianDate(date, 'full');
  };

  // Loading State
  if (aacoLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto text-violet-600 mb-4" />
          <p className="text-gray-600 font-medium">در حال بارگذاری...</p>
        </div>
      </div>
    );
  }

  // No Application State
  if (!aacoApplication) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full"
        >
          <div className="bg-white rounded-2xl shadow-2xl border-2 border-gray-200 overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500" />
            <div className="p-8 text-center">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-orange-100 to-amber-100 flex items-center justify-center">
                <AlertCircle className="h-10 w-10 text-orange-600" />
              </div>
              <h1 className="text-2xl font-black text-gray-900 mb-2">
                درخواستی یافت نشد
              </h1>
              <p className="text-gray-600 mb-6">
                شما هنوز درخواست AACo ثبت نکرده‌اید
              </p>
              <div className="space-y-3">
                <Button
                  onClick={() => navigate('/pending/application-form')}
                  className="w-full bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700"
                >
                  ثبت درخواست AACo
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate('/pending')}
                  className="w-full"
                >
                  <ArrowRight className="ml-2 h-4 w-4" />
                  بازگشت به داشبورد
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // Main Application Status View with Tabs
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* New Attractive Header */}
        <StatusPageHeader 
          applicationStatus={aacoApplication.status}
          submittedDate={aacoApplication.submittedAt ? formatDate(aacoApplication.submittedAt) : undefined}
        />

        {/* Tabs Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">
          {/* Main Content with Tabs */}
          <div className="lg:col-span-8">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="flex w-full h-auto p-1 bg-white border-2 shadow-md flex-row-reverse">
                <TabsTrigger 
                  value="overview" 
                  className="flex-1 flex flex-col items-center gap-1 py-3 data-[state=active]:bg-gradient-to-br data-[state=active]:from-violet-500 data-[state=active]:to-fuchsia-500 data-[state=active]:text-white"
                >
                  <FileText className="h-4 w-4" />
                  <span className="text-xs font-semibold">خلاصه</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="personal" 
                  className="flex-1 flex flex-col items-center gap-1 py-3 data-[state=active]:bg-gradient-to-br data-[state=active]:from-blue-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white"
                >
                  <User className="h-4 w-4" />
                  <span className="text-xs font-semibold">شخصی</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="education" 
                  className="flex-1 flex flex-col items-center gap-1 py-3 data-[state=active]:bg-gradient-to-br data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white"
                >
                  <GraduationCap className="h-4 w-4" />
                  <span className="text-xs font-semibold">تحصیلی</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="startup" 
                  className="flex-1 flex flex-col items-center gap-1 py-3 data-[state=active]:bg-gradient-to-br data-[state=active]:from-green-500 data-[state=active]:to-emerald-500 data-[state=active]:text-white"
                >
                  <Lightbulb className="h-4 w-4" />
                  <span className="text-xs font-semibold">ایده</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="motivation" 
                  className="flex-1 flex flex-col items-center gap-1 py-3 data-[state=active]:bg-gradient-to-br data-[state=active]:from-orange-500 data-[state=active]:to-amber-500 data-[state=active]:text-white"
                >
                  <Heart className="h-4 w-4" />
                  <span className="text-xs font-semibold">انگیزه</span>
                </TabsTrigger>
              </TabsList>

              <div className="mt-4">
                <AnimatePresence mode="wait">
                  <TabsContent value="overview" className="mt-0">
                    <motion.div
                      key="overview"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.2 }}
                    >
                      <StatusOverviewCard 
                        application={aacoApplication} 
                        formatDate={formatDate}
                      />
                    </motion.div>
                  </TabsContent>

                  <TabsContent value="personal" className="mt-0">
                    <motion.div
                      key="personal"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.2 }}
                    >
                      <PersonalInfoCard application={aacoApplication} />
                    </motion.div>
                  </TabsContent>

                  <TabsContent value="education" className="mt-0">
                    <motion.div
                      key="education"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.2 }}
                    >
                      <EducationalInfoCard application={aacoApplication} />
                    </motion.div>
                  </TabsContent>

                  <TabsContent value="startup" className="mt-0">
                    <motion.div
                      key="startup"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.2 }}
                    >
                      <StartupIdeaCard application={aacoApplication} />
                    </motion.div>
                  </TabsContent>

                  <TabsContent value="motivation" className="mt-0">
                    <motion.div
                      key="motivation"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.2 }}
                    >
                      <MotivationCard application={aacoApplication} />
                    </motion.div>
                  </TabsContent>
                </AnimatePresence>
              </div>
            </Tabs>
          </div>

          {/* Sidebar - Sticky */}
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-4 space-y-4">
              <StatusTimeline status={aacoApplication.status as any} />
              <QuickActionsPanel />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
