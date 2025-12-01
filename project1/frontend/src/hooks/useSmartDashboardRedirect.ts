import { useMemo } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useApplicationStatus } from './useApplicationStatus';
import { getDashboardPathWithStatus } from '@/utils/roleUtils';

/**
 * Result interface for the smart dashboard redirect hook
 */
export interface SmartDashboardRedirectResult {
  /** The determined dashboard path based on role and status */
  dashboardPath: string;
  /** Whether data is still loading */
  isLoading: boolean;
  /** Any error that occurred during data fetching */
  error: Error | null;
  /** Whether a redirect should be performed */
  shouldRedirect: boolean;
}

/**
 * Hook to determine the correct dashboard path based on user role and application status
 * 
 * This hook combines user authentication state and application status to intelligently
 * determine which dashboard the user should be redirected to. It handles:
 * - Non-applicant roles (admin, director, club_member, etc.)
 * - Applicants without applications
 * - Applicants with pending applications
 * - Applicants with accepted applications
 * - Error states and loading states
 * 
 * @returns Dashboard path, loading state, error, and redirect flag
 * 
 * @example
 * ```tsx
 * function LoginComponent() {
 *   const { dashboardPath, isLoading, shouldRedirect } = useSmartDashboardRedirect();
 *   
 *   useEffect(() => {
 *     if (shouldRedirect && !isLoading) {
 *       navigate(dashboardPath, { replace: true });
 *     }
 *   }, [dashboardPath, isLoading, shouldRedirect]);
 * }
 * ```
 */
export function useSmartDashboardRedirect(): SmartDashboardRedirectResult {
  const { user } = useAuthStore();
  const { data: applicationData, isLoading, error } = useApplicationStatus();

  const dashboardPath = useMemo(() => {
    // If no user, redirect to login
    if (!user) {
      return '/login';
    }

    // For non-applicants, use standard routing (no need to check application status)
    if (!user.role.includes('applicant')) {
      return getDashboardPathWithStatus(user.role);
    }

    // For applicants, wait for application status to load
    if (isLoading) {
      return ''; // Empty string indicates loading
    }

    // Get application status (default to 'not_submitted' if no data)
    const applicationStatus = applicationData?.status || 'not_submitted';
    
    // Use smart routing with status
    return getDashboardPathWithStatus(user.role, applicationStatus);
  }, [user, applicationData, isLoading]);

  return {
    dashboardPath,
    isLoading: isLoading || !user,
    error: error as Error | null,
    shouldRedirect: !!dashboardPath && dashboardPath !== '' && dashboardPath !== '/login',
  };
}
