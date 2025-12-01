import { FC, ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApplicationStatus } from '@/hooks/useApplicationStatus';
import { useAuthStore } from '@/store/authStore';
import { motion } from 'framer-motion';
import { Loader2, Rocket } from 'lucide-react';

interface ApplicantDashboardGuardProps {
  children: ReactNode;
}

/**
 * Dashboard Guard for Applicant Dashboard
 * Blocks access to dashboard until user completes AACO registration (submits application)
 * This is MANDATORY - no localStorage bypass allowed
 */
export const ApplicantDashboardGuard: FC<ApplicantDashboardGuardProps> = ({ children }) => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { data: applicationData, isLoading } = useApplicationStatus();

  useEffect(() => {
    // Only check for applicants
    if (!user || !user.role.includes('applicant')) {
      return;
    }

    // Don't check while loading
    if (isLoading) {
      return;
    }

    // Check if user has submitted application
    const hasSubmittedApplication = applicationData?.hasApplication && 
                                    applicationData.status !== 'not_submitted';

    console.log('🔒 Dashboard Guard Check:', {
      hasApplication: applicationData?.hasApplication,
      applicationStatus: applicationData?.status,
      hasSubmittedApplication,
    });

    // If user hasn't submitted application, redirect to application form
    if (!hasSubmittedApplication) {
      console.log('🚫 No application - Redirecting to application form');
      console.log('⚠️  User MUST complete AACO registration before accessing dashboard');
      
      // Redirect to application form
      navigate('/application-form', { replace: true });
      return;
    }

    // Check if application is accepted
    const isAccepted = applicationData.status === 'accepted';
    
    if (!isAccepted) {
      // Redirect to pending dashboard for non-accepted applications
      console.log('⏳ Application not accepted - Redirecting to pending dashboard');
      console.log('   Status:', applicationData.status);
      navigate('/pending', { replace: true });
    } else {
      console.log('✅ Application accepted - Access granted');
    }
  }, [applicationData, isLoading, user, navigate]);

  // Show loading state while checking
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-2xl shadow-lg mb-6">
            <Rocket className="w-10 h-10 text-purple-600 animate-bounce" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            در حال بررسی دسترسی...
          </h2>
          <p className="text-gray-600 mb-4">
            لطفاً صبر کنید
          </p>
          <Loader2 className="w-8 h-8 text-purple-600 animate-spin mx-auto" />
        </motion.div>
      </div>
    );
  }

  // Check if user has submitted application
  const hasSubmittedApplication = applicationData?.hasApplication && 
                                  applicationData.status !== 'not_submitted';

  // If no application, don't render children (will redirect in useEffect)
  if (!hasSubmittedApplication) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-2xl shadow-lg mb-6">
            <Rocket className="w-10 h-10 text-purple-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            در حال انتقال به فرم ثبت‌نام...
          </h2>
          <p className="text-gray-600">
            برای دسترسی به داشبورد، ابتدا باید در رویداد AACO ثبت‌نام کنید
          </p>
        </motion.div>
      </div>
    );
  }

  // User has submitted application - allow access
  return <>{children}</>;
};
