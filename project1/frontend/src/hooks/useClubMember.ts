import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  MemberListParams,
  MemberListResponse,
  MemberStatsResponse,
  PromotionResponse,
  PromotionHistoryResponse,
} from '@/types/clubMember';
import { toast } from '@/lib/toast';
import api from '@/lib/api';
import { useAuthStore } from '@/store/authStore';

/**
 * Hook to promote applicant to club member
 * Admin only
 */
export const usePromoteMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId: string): Promise<PromotionResponse> => {
      console.log('🔄 Promoting user:', userId);
      console.log('📍 Full URL will be:', `${import.meta.env.VITE_API_URL}/membership/promote/${userId}`);
      
      if (!userId || userId === 'undefined') {
        console.error('❌ Invalid userId:', userId);
        throw new Error('User ID is invalid or undefined');
      }
      
      try {
        const response = await api.post(`/membership/promote/${userId}`);
        console.log('✅ Promotion response:', response.data);
        return response.data;
      } catch (error: any) {
        console.error('❌ Promotion error full:', {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          url: error.config?.url,
          method: error.config?.method
        });
        throw error;
      }
    },
    onSuccess: async (data) => {
      toast.success(data.message || 'کاربر با موفقیت به عضو باشگاه ارتقا یافت');
      // Refetch all related queries to get fresh data
      await queryClient.refetchQueries({ queryKey: ['applications'] });
      await queryClient.refetchQueries({ queryKey: ['application-stats'] });
      await queryClient.refetchQueries({ queryKey: ['clubMembers'] });
      await queryClient.refetchQueries({ queryKey: ['promotionHistory'] });
    },
    onError: (error: any) => {
      console.error('❌ Full error:', error);
      const message = error.response?.data?.message || error.message || 'خطا در ارتقای کاربر';
      toast.error(message);
    },
  });
};

/**
 * Hook to get all club members with filters
 * Admin and ClubMember can access
 */
export const useClubMembers = (params?: MemberListParams) => {
  return useQuery({
    queryKey: ['clubMembers', params],
    queryFn: async (): Promise<MemberListResponse> => {
      const response = await api.get('/membership/members', { params });
      return response.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

/**
 * Hook to get member statistics
 * ClubMember (own) or Admin
 */
export const useMemberStats = (userId: string, enabled = true) => {
  return useQuery({
    queryKey: ['memberStats', userId],
    queryFn: async (): Promise<MemberStatsResponse> => {
      const response = await api.get(`/membership/stats/${userId}`);
      return response.data;
    },
    enabled: enabled && !!userId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

/**
 * Hook to update membership level
 * Admin only
 */
export const useUpdateMemberLevel = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      userId,
      level,
    }: {
      userId: string;
      level: string;
    }): Promise<any> => {
      const response = await api.put(`/membership/level/${userId}`, {
        level,
      });
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(data.message || 'سطح عضویت با موفقیت به‌روزرسانی شد');
      queryClient.invalidateQueries({ queryKey: ['clubMembers'] });
      queryClient.invalidateQueries({ queryKey: ['memberStats'] });
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'خطا در به‌روزرسانی سطح عضویت';
      toast.error(message);
    },
  });
};

/**
 * Hook to update membership status
 * Admin only
 */
export const useUpdateMemberStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      userId,
      status,
      reason,
    }: {
      userId: string;
      status: string;
      reason?: string;
    }): Promise<any> => {
      const response = await api.put(`/membership/status/${userId}`, {
        status,
        reason,
      });
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(data.message || 'وضعیت عضویت با موفقیت به‌روزرسانی شد');
      queryClient.invalidateQueries({ queryKey: ['clubMembers'] });
      queryClient.invalidateQueries({ queryKey: ['memberStats'] });
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'خطا در به‌روزرسانی وضعیت عضویت';
      toast.error(message);
    },
  });
};

/**
 * Hook to get promotion history
 * Admin only
 */
export const usePromotionHistory = (page = 1, limit = 20) => {
  return useQuery({
    queryKey: ['promotionHistory', page, limit],
    queryFn: async (): Promise<PromotionHistoryResponse> => {
      const response = await api.get('/membership/history', {
        params: { page, limit },
      });
      return response.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

/**
 * Hook to check if user is club member
 */
export const useIsClubMember = (userId?: string) => {
  return useQuery({
    queryKey: ['isClubMember', userId],
    queryFn: async (): Promise<boolean> => {
      if (!userId) return false;
      try {
        const response = await api.get(`/membership/stats/${userId}`);
        return response.data.success;
      } catch {
        return false;
      }
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
};

/**
 * Hook to get current user's membership info
 */
export const useMyMembership = () => {
  const user = useAuthStore((state) => state.user);
  const userId = user?._id;

  return useQuery({
    queryKey: ['myMembership', userId],
    queryFn: async (): Promise<MemberStatsResponse | null> => {
      if (!userId) {
        console.log('⚠️ useMyMembership: No userId available');
        return null;
      }
      try {
        console.log('🔍 useMyMembership: Fetching membership for user:', userId);
        const response = await api.get(`/membership/stats/${userId}`);
        console.log('✅ useMyMembership: Success', response.data);
        return response.data;
      } catch (error: any) {
        console.log('⚠️ useMyMembership: Failed to fetch membership', {
          status: error.response?.status,
          message: error.response?.data?.message
        });
        // Return null instead of throwing - this prevents logout
        return null;
      }
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: false, // Don't retry on failure
  });
};
