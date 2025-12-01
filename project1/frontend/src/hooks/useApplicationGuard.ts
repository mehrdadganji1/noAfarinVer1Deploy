import { useApplicationStatus } from './useApplicationStatus';

/**
 * Hook to check if applicant has completed mandatory AACO registration
 * Returns true if user has submitted application, false otherwise
 */
export function useApplicationGuard() {
  const { data: applicationData, isLoading } = useApplicationStatus();

  // Check if user has submitted application
  const hasSubmittedApplication = applicationData?.hasApplication && 
                                  applicationData.status !== 'not_submitted';

  return {
    hasSubmittedApplication,
    isLoading,
    applicationStatus: applicationData?.status || 'not_submitted'
  };
}
