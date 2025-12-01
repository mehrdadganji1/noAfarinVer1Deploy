import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { toast } from '@/lib/toast';
import type {
  MemberProfile,
  UpdateProfileInput,
  ProfileSearchFilters,
  PaginatedResponse,
  ApiResponse,
  VisibilitySettings,
  Skill,
  User,
  ConnectionStatus,
  ConnectionCounts
} from '../types/community';

// =====================================================
// MEMBER PROFILES
// =====================================================

/**
 * Get all member profiles با فیلتر
 */
export const useMembers = (filters?: ProfileSearchFilters) => {
  return useQuery({
    queryKey: ['members', filters],
    queryFn: async () => {
      const { data } = await api.get<PaginatedResponse<MemberProfile>>(
        '/api/community/profiles',
        { params: filters }
      );
      return data;
    },
    staleTime: 5 * 60 * 1000 // 5 minutes
  });
};

/**
 * Get specific member profile
 */
export const useMemberProfile = (userId: string | undefined) => {
  return useQuery({
    queryKey: ['member', userId],
    queryFn: async () => {
      if (!userId) throw new Error('User ID is required');
      const { data } = await api.get<ApiResponse<{
        profile: MemberProfile;
        isFollowing: boolean;
        isOwnProfile: boolean;
      }>>(`/api/community/profiles/${userId}`);
      return data.data!;
    },
    enabled: !!userId,
    staleTime: 2 * 60 * 1000 // 2 minutes
  });
};

/**
 * Get my profile
 */
export const useMyProfile = () => {
  return useQuery({
    queryKey: ['myProfile'],
    queryFn: async () => {
      // Get current user ID from auth
      const userId = localStorage.getItem('userId');
      if (!userId) throw new Error('Not authenticated');
      
      const { data } = await api.get<ApiResponse<{
        profile: MemberProfile;
        isFollowing: boolean;
        isOwnProfile: boolean;
      }>>(`/community/profiles/${userId}`);
      return data.data?.profile;
    }
  });
};

/**
 * Update my profile
 */
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: UpdateProfileInput) => {
      const { data } = await api.put<ApiResponse<MemberProfile>>(
        '/community/profiles/me',
        input
      );
      return data.data!;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['myProfile'] });
      queryClient.invalidateQueries({ queryKey: ['member', data.userId._id] });
      toast.success('پروفایل با موفقیت به‌روزرسانی شد');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'خطا در به‌روزرسانی پروفایل');
    }
  });
};

/**
 * Update visibility settings
 */
export const useUpdateVisibility = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (settings: Partial<VisibilitySettings>) => {
      const { data } = await api.put<ApiResponse<VisibilitySettings>>(
        '/community/profiles/me/visibility',
        settings
      );
      return data.data!;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myProfile'] });
      toast.success('تنظیمات حریم خصوصی به‌روزرسانی شد');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'خطا در به‌روزرسانی تنظیمات');
    }
  });
};

/**
 * Get profile stats
 */
export const useProfileStats = (userId: string | undefined) => {
  return useQuery({
    queryKey: ['profileStats', userId],
    queryFn: async () => {
      if (!userId) throw new Error('User ID is required');
      const { data } = await api.get<ApiResponse<any>>(
        `/community/profiles/${userId}/stats`
      );
      return data.data!;
    },
    enabled: !!userId
  });
};

/**
 * Record profile view
 */
export const useRecordProfileView = () => {
  return useMutation({
    mutationFn: async (userId: string) => {
      await api.post(`/community/profiles/${userId}/view`);
    }
  });
};

// =====================================================
// SKILLS & ENDORSEMENTS
// =====================================================

/**
 * Add skill to profile
 */
export const useAddSkill = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (skill: Pick<Skill, 'name' | 'level'>) => {
      const { data } = await api.post<ApiResponse<Skill[]>>(
        '/community/profiles/me/skills',
        skill
      );
      return data.data!;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myProfile'] });
      toast.success('مهارت اضافه شد');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'خطا در افزودن مهارت');
    }
  });
};

/**
 * Endorse a skill
 */
export const useEndorseSkill = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, skillName }: { userId: string; skillName: string }) => {
      const { data } = await api.post<ApiResponse<Skill[]>>(
        `/community/profiles/${userId}/endorse`,
        { skillName }
      );
      return data.data!;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['member', variables.userId] });
      toast.success('مهارت تایید شد');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'خطا در تایید مهارت');
    }
  });
};

/**
 * Get endorsers list
 */
export const useEndorsers = (userId: string | undefined) => {
  return useQuery({
    queryKey: ['endorsers', userId],
    queryFn: async () => {
      if (!userId) throw new Error('User ID is required');
      const { data } = await api.get<ApiResponse<User[]>>(
        `/community/profiles/${userId}/endorsers`
      );
      return data.data!;
    },
    enabled: !!userId
  });
};

// =====================================================
// SEARCH & SUGGESTIONS
// =====================================================

/**
 * Advanced member search
 */
export const useSearchMembers = (query: string) => {
  return useQuery({
    queryKey: ['searchMembers', query],
    queryFn: async () => {
      if (!query || query.trim().length === 0) return [];
      const { data } = await api.get<ApiResponse<MemberProfile[]>>(
        '/community/search',
        { params: { query } }
      );
      return data.data!;
    },
    enabled: query.trim().length > 0
  });
};

/**
 * Get connection suggestions
 */
export const useConnectionSuggestions = (limit: number = 10) => {
  return useQuery({
    queryKey: ['connectionSuggestions', limit],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<User[]>>(
        '/community/suggestions',
        { params: { limit } }
      );
      return data.data!;
    },
    staleTime: 10 * 60 * 1000 // 10 minutes
  });
};

// =====================================================
// CONNECTIONS
// =====================================================

/**
 * Get connection status
 */
export const useConnectionStatus = (userId: string | undefined) => {
  return useQuery({
    queryKey: ['connectionStatus', userId],
    queryFn: async () => {
      if (!userId) throw new Error('User ID is required');
      const { data } = await api.get<ApiResponse<ConnectionStatus>>(
        `/community/connections/${userId}/status`
      );
      return data.data!;
    },
    enabled: !!userId
  });
};

/**
 * Send connection request
 */
export const useSendConnectionRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId: string) => {
      const { data } = await api.post<ApiResponse<ConnectionStatus>>(
        `/community/connections/${userId}/request`
      );
      return data.data!;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['connectionStatus', variables] });
      toast.success('درخواست اتصال ارسال شد');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'خطا در ارسال درخواست اتصال');
    }
  });
};

/**
 * Accept connection request
 */
export const useAcceptConnectionRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId: string) => {
      const { data } = await api.post<ApiResponse<ConnectionStatus>>(
        `/community/connections/${userId}/accept`
      );
      return data.data!;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['connectionStatus', variables] });
      toast.success('درخواست اتصال تایید شد');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'خطا در تایید درخواست اتصال');
    }
  });
};

/**
 * Decline connection request
 */
export const useDeclineConnectionRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId: string) => {
      const { data } = await api.post<ApiResponse<ConnectionStatus>>(
        `/community/connections/${userId}/decline`
      );
      return data.data!;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['connectionStatus', variables] });
      toast.success('درخواست اتصال رد شد');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'خطا در رد درخواست اتصال');
    }
  });
};

/**
 * Get connection counts
 */
export const useConnectionCounts = () => {
  return useQuery({
    queryKey: ['connectionCounts'],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<ConnectionCounts>>(
        '/community/connections/counts'
      );
      return data.data!;
    },
    staleTime: 10 * 60 * 1000 // 10 minutes
  });
};

export default {
  useMembers,
  useMemberProfile,
  useMyProfile,
  useUpdateProfile,
  useUpdateVisibility,
  useProfileStats,
  useRecordProfileView,
  useAddSkill,
  useEndorseSkill,
  useEndorsers,
  useSearchMembers,
  useConnectionSuggestions,
  useConnectionStatus,
  useSendConnectionRequest,
  useAcceptConnectionRequest,
  useDeclineConnectionRequest,
  useConnectionCounts
};
