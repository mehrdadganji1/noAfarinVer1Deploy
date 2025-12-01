import { FC, ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useApplicationStatus } from '@/hooks/useApplicationStatus';
import { useAuthStore } from '@/store/authStore';

interface PendingApplicantGuardProps {
  children: ReactNode;
}

/**
 * Guard that restricts pending applicants to only allowed routes
 * Pending applicants can ONLY access:
 * - /applicant/dashboard
 * - /application-status
 * - /applicant/profile
 * - /applicant/help
 */
export const PendingApplicantGuard: FC<PendingApplicantGuardProps> = ({ children }) => {
  const { user } = useAuthStore();
  const { data: applicationData, isLoading } = useApplicationStatus();
  const location = useLocation();

  // Only check for applicants
  if (!user || !user.role.includes('applicant')) {
    return <>{children}</>;
  }

  // Wait for data to load
  if (isLoading) {
    return <>{children}</>;
  }

  const status = applicationData?.status || 'not_submitted';
  const isApproved = status === 'accepted';

  // If application is accepted, redirect to full dashboard
  if (isApproved) {
    console.log('✅ Application accepted - Redirecting to applicant dashboard');
    return <Navigate to="/applicant/dashboard" replace />;
  }

  console.log('⏳ Application pending - Checking route restrictions');
  console.log('   Status:', status);

  // List of ALLOWED routes for pending applicants
  const allowedRoutes = [
    '/pending',
    '/application-form',
  ];

  // Check if current route is allowed
  const isAllowedRoute = allowedRoutes.some(route => 
    location.pathname === route || location.pathname.startsWith(route + '/')
  );

  // If trying to access a restricted route, redirect to pending dashboard
  if (!isAllowedRoute) {
    console.log('🚫 Pending applicant tried to access restricted route:', location.pathname);
    return <Navigate to="/pending" replace />;
  }

  // Route is allowed
  return <>{children}</>;
};
