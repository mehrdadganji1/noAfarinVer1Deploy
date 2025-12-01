import { FC, ReactNode, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApplicationStatus } from '@/hooks/useApplicationStatus';
import { useAuthStore } from '@/store/authStore';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

interface ApplicantApprovalGuardProps {
  children: ReactNode;
}

/**
 * Redirect Guard for Applicants
 *
 * جریان پذیرش:
 * 1. ثبت‌نام → applicant role
 * 2. پر کردن فرم AACO → وضعیت submitted
 * 3. تایید پیش ثبت‌نام → وضعیت approved (همچنان در pending می‌ماند)
 * 4. مصاحبه → وضعیت interview_scheduled
 * 5. تایید نهایی → وضعیت accepted → نقش به club_member تغییر می‌کند
 *
 * تایید AACO (approved) به معنی تایید نهایی نیست!
 * کاربر فقط وقتی به داشبورد اصلی دسترسی پیدا می‌کند که:
 * - وضعیت regular application = accepted باشد
 * - یا نقش کاربر club_member باشد
 */
export const ApplicantApprovalGuard: FC<ApplicantApprovalGuardProps> = ({
  children,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuthStore();
  const { data: applicationData, isLoading } = useApplicationStatus();

  // Only check for applicants
  if (!user || !user.role.includes('applicant')) {
    return <>{children}</>;
  }

  // Show loading state while checking
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <Loader2 className="w-12 h-12 text-purple-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">در حال بررسی وضعیت...</p>
        </motion.div>
      </div>
    );
  }

  // فقط وضعیت accepted در regular application به معنی تایید نهایی است
  // تایید AACO (approved) فقط به معنی تایید پیش ثبت‌نام است و کاربر وارد مرحله مصاحبه می‌شود
  const regularStatus = applicationData?.status || 'not_submitted';
  const isFinallyApproved = regularStatus === 'accepted';

  // Redirect pending applicants to /pending
  useEffect(() => {
    if (!isFinallyApproved && !location.pathname.startsWith('/pending')) {
      console.log('⏳ Application not finally approved - redirecting to /pending');
      console.log('📋 Regular status:', regularStatus);
      navigate('/pending', { replace: true });
    }
  }, [isFinallyApproved, location.pathname, navigate, regularStatus]);

  // If finally approved, show normal layout (children = Layout component)
  if (isFinallyApproved) {
    console.log('✅ Application finally approved - showing full layout');
    return <>{children}</>;
  }

  // If pending and not on /pending route, show loading while redirecting
  if (!location.pathname.startsWith('/pending')) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <Loader2 className="w-12 h-12 text-purple-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">در حال انتقال...</p>
        </motion.div>
      </div>
    );
  }

  // Should not reach here, but just in case
  return null;
};
