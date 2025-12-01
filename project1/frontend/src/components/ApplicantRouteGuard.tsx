import { FC, ReactNode, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApplicationGuard } from '@/hooks/useApplicationGuard';
import { useAuthStore } from '@/store/authStore';

interface ApplicantRouteGuardProps {
  children: ReactNode;
}

/**
 * Route Guard for Applicant routes
 * Redirects to application-form if user hasn't submitted application
 * Allows access only to: /applicant/dashboard and /applicant/profile
 */
export const ApplicantRouteGuard: FC<ApplicantRouteGuardProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuthStore();
  const { hasSubmittedApplication, isLoading } = useApplicationGuard();

  // Allowed routes without application submission
  const allowedRoutes = [
    '/applicant/dashboard',
    '/applicant/profile',
    '/application-form',
    '/application-status'
  ];

  useEffect(() => {
    // Only check for applicants
    if (!user || !user.role.includes('applicant')) {
      return;
    }

    // Don't check while loading
    if (isLoading) {
      return;
    }

    // Check if current route is allowed
    const isAllowedRoute = allowedRoutes.some(route => 
      location.pathname.startsWith(route)
    );

    // If user hasn't submitted application and trying to access restricted route
    if (!hasSubmittedApplication && !isAllowedRoute) {
      console.log('🚫 Access denied - Redirecting to application form');
      console.log('Current path:', location.pathname);
      console.log('Has submitted application:', hasSubmittedApplication);
      
      // Redirect to application form
      navigate('/application-form', { replace: true });
    }
  }, [hasSubmittedApplication, isLoading, location.pathname, user, navigate]);

  // Show children if loading or has submitted application or on allowed route
  return <>{children}</>;
};
