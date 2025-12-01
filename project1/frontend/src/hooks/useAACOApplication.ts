import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

interface AACOFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city: string;
  university: string;
  major: string;
  degree: string;
  graduationYear: string;
  startupIdea: string;
  businessModel: string;
  targetMarket: string;
  teamSize: string;
  teamMembers: string;
  skills: string[];
  motivation: string;
  goals: string;
  experience: string;
  expectations: string;
}

export const useAACOApplication = () => {
  const queryClient = useQueryClient();

  // Check if user has submitted application
  const { data: statusData, isLoading: isCheckingStatus } = useQuery({
    queryKey: ['aaco-application-status'],
    queryFn: async () => {
      try {
        const response = await api.get('/aaco-applications/check-status');
        return response.data;
      } catch (error: any) {
        console.error('Error checking AACO status:', error);
        // Return default values on error
        return { hasApplication: false, status: null, submittedAt: null };
      }
    },
    retry: 1,
    staleTime: 30000, // 30 seconds
  });

  // Get user's application
  const { data: applicationData, isLoading: isLoadingApplication } = useQuery({
    queryKey: ['aaco-application'],
    queryFn: async () => {
      try {
        const response = await api.get('/aaco-applications/my-application');
        return response.data;
      } catch (error: any) {
        console.error('Error loading AACO application:', error);
        // Return null on error (404 is expected if no application exists)
        if (error.response?.status === 404) {
          return { application: null };
        }
        throw error;
      }
    },
    enabled: statusData?.hasApplication === true,
    retry: 1,
    staleTime: 30000, // 30 seconds
  });

  // Submit application
  const submitMutation = useMutation({
    mutationFn: async (data: AACOFormData) => {
      const response = await api.post('/aaco-applications/submit', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['aaco-application-status'] });
      queryClient.invalidateQueries({ queryKey: ['aaco-application'] });
    },
  });

  return {
    hasApplication: statusData?.hasApplication || false,
    applicationStatus: statusData?.status,
    application: applicationData?.application,
    isCheckingStatus,
    isLoadingApplication,
    submitApplication: submitMutation.mutate,
    isSubmitting: submitMutation.isPending,
    submitError: submitMutation.error,
    submitSuccess: submitMutation.isSuccess,
  };
};
