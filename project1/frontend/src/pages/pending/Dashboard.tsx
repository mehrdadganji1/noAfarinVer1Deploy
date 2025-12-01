/**
 * Pending Dashboard Page
 * Main dashboard for applicants waiting for approval
 * Redesigned with modular, clean code architecture
 * Enhanced with smooth Framer Motion animations
 */

import { motion } from 'framer-motion';
import { useAuthStore } from '@/store/authStore';
import { useApplicationStatus } from '@/hooks/useApplicationStatus';
import { useAACOApplicationStatus } from '@/hooks/useAACOApplicationStatus';
import {
  WelcomeHero,
  AACORegistrationBanner,
  StatusCard,
  Timeline,
  QuickActions,
  InfoCards
} from '@/components/pending/dashboard';
import { Card, CardContent } from '@/components/ui/card';
import { ListChecks } from 'lucide-react';
import { DashboardSkeleton } from '@/components/pending/shared';

// Smooth stagger animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring' as const,
      stiffness: 300,
      damping: 24,
    },
  },
};

export default function PendingDashboard() {
  const { user } = useAuthStore();
  const { data: applicationData, isLoading: isAppLoading } = useApplicationStatus();
  const { application: aacoApplication, status: aacoStatus, isLoading: isAacoLoading } = useAACOApplicationStatus();

  // Show skeleton while loading
  const isLoading = isAppLoading || isAacoLoading;
  
  if (isLoading) {
    return <DashboardSkeleton />;
  }

  // Prioritize AACO application status if it exists
  const status = (aacoStatus || applicationData?.status || 'submitted') as import('@/components/pending/dashboard').ApplicationStatus;
  const trackingId = aacoApplication?._id?.slice(-8) || applicationData?.application?._id?.slice(-8);

  return (
    <motion.div 
      className="h-full w-[90%] mx-auto flex flex-col gap-3 md:gap-4 pb-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Welcome Hero - Top Banner */}
      <motion.div variants={itemVariants} className="flex-shrink-0">
        <WelcomeHero firstName={user?.firstName} delay={0} />
      </motion.div>

      {/* AACo Registration Banner - Prominent Call to Action */}
      <motion.div variants={itemVariants}>
        <AACORegistrationBanner delay={0} />
      </motion.div>

      {/* Main Dashboard Grid */}
      <div className="flex-1 flex flex-col gap-3 md:gap-4 min-h-0">
        
        {/* Main Grid: Left Column (StatusCard + QuickActions) | Right Column (Timeline + InfoCards) */}
        <motion.div 
          variants={itemVariants}
          className="flex-shrink-0 grid grid-cols-1 lg:grid-cols-3 gap-3 md:gap-4"
        >
          {/* Left Column - 2/3 width */}
          <div className="lg:col-span-2 flex flex-col gap-3 md:gap-4">
            <StatusCard 
              status={status} 
              trackingId={trackingId}
              delay={0} 
            />
            <QuickActions delay={0} />
          </div>
          
          {/* Right Column - 1/3 width */}
          <div className="lg:col-span-1 flex flex-col gap-3 md:gap-4">
            {/* Timeline Card */}
            <Card className="border-2 shadow-lg transition-all duration-300 hover:shadow-xl hover:border-purple-200">
              <CardContent className="p-4">
                <h3 className="font-bold text-gray-800 mb-3 text-base flex items-center gap-2">
                  <ListChecks className="w-5 h-5 text-blue-600" />
                  مراحل بررسی
                </h3>
                <Timeline currentStatus={status} />
              </CardContent>
            </Card>
            
            {/* Info Cards - Single Column below Timeline */}
            <InfoCards delay={0} singleColumn />
          </div>
        </motion.div>

      </div>
    </motion.div>
  );
}
