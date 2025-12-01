import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { toast } from '@/lib/toast';
import type {
  User,
  ConnectionStatus,
  PaginatedResponse,
  ApiResponse
} from '../types/community';

// =====================================================
// FOLLOW/UNFOLLOW
// =====================================================

/**
 * Follow a member
 */
export const useFollowMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId: string) => {
      const { data } = await api.post<ApiResponse<void>>(
        `/community/connections/follow/${userId}`
      );
      return data;
    },
    onSuccess: (_, userId) => {
      queryClient.invalidateQueries({ queryKey: ['connectionStatus', userId] });
      queryClient.invalidateQueries({ queryKey: ['followers'] });
      queryClient.invalidateQueries({ queryKey: ['following'] });
      queryClient.invalidateQueries({ queryKey: ['member', userId] });
      toast.success('با موفقیت دنبال شد');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'خطا در دنبال کردن');
    }
  });
};

/**
 * Unfollow a member
 */
export const useUnfollowMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId: string) => {
      const { data } = await api.delete<ApiResponse<void>>(
        `/community/connections/unfollow/${userId}`
      );
      return data;
    },
    onSuccess: (_, userId) => {
      queryClient.invalidateQueries({ queryKey: ['connectionStatus', userId] });
      queryClient.invalidateQueries({ queryKey: ['followers'] });
      queryClient.invalidateQueries({ queryKey: ['following'] });
      queryClient.invalidateQueries({ queryKey: ['member', userId] });
      toast.success('دنبال کردن لغو شد');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'خطا در لغو دنبال کردن');
    }
  });
};

// =====================================================
// FOLLOWERS & FOLLOWING
// =====================================================

/**
 * Get my followers
 */
export const useMyFollowers = (page: number = 1, limit: number = 20) => {
  return useQuery({
    queryKey: ['followers', page, limit],
    queryFn: async () => {
      const { data } = await api.get<PaginatedResponse<User>>(
        '/community/connections/followers',
        { params: { page, limit } }
      );
      return data;
    }
  });
};

/**
 * Get my following
 */
export const useMyFollowing = (page: number = 1, limit: number = 20) => {
  return useQuery({
    queryKey: ['following', page, limit],
    queryFn: async () => {
      const { data } = await api.get<PaginatedResponse<User>>(
        '/community/connections/following',
        { params: { page, limit } }
      );
      return data;
    }
  });
};

/**
 * Get user's followers
 */
export const useUserFollowers = (userId: string | undefined, page: number = 1, limit: number = 20) => {
  return useQuery({
    queryKey: ['userFollowers', userId, page, limit],
    queryFn: async () => {
      if (!userId) throw new Error('User ID is required');
      const { data } = await api.get<PaginatedResponse<User>>(
        `/community/connections/${userId}/followers`,
        { params: { page, limit } }
      );
      return data;
    },
    enabled: !!userId
  });
};

/**
 * Get user's following
 */
export const useUserFollowing = (userId: string | undefined, page: number = 1, limit: number = 20) => {
  return useQuery({
    queryKey: ['userFollowing', userId, page, limit],
    queryFn: async () => {
      if (!userId) throw new Error('User ID is required');
      const { data } = await api.get<PaginatedResponse<User>>(
        `/community/connections/${userId}/following`,
        { params: { page, limit } }
      );
      return data;
    },
    enabled: !!userId
  });
};

// =====================================================
// CONNECTION STATUS
// =====================================================

/**
 * Get connection status with a user
 */
export const useConnectionStatus = (userId: string | undefined) => {
  return useQuery({
    queryKey: ['connectionStatus', userId],
    queryFn: async () => {
      if (!userId) throw new Error('User ID is required');
      const { data } = await api.get<ApiResponse<ConnectionStatus>>(
        `/community/connections/status/${userId}`
      );
      return data.data!;
    },
    enabled: !!userId,
    staleTime: 2 * 60 * 1000 // 2 minutes
  });
};

/**
 * Get mutual connections
 */
export const useMutualConnections = () => {
  return useQuery({
    queryKey: ['mutualConnections'],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<User[]>>(
        '/community/connections/mutual'
      );
      return data.data!;
    }
  });
};

// =====================================================
// BLOCK
// =====================================================

/**
 * Block a member
 */
export const useBlockMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId: string) => {
      const { data } = await api.post<ApiResponse<void>>(
        `/community/connections/block/${userId}`
      );
      return data;
    },
    onSuccess: (_, userId) => {
      queryClient.invalidateQueries({ queryKey: ['connectionStatus', userId] });
      queryClient.invalidateQueries({ queryKey: ['followers'] });
      queryClient.invalidateQueries({ queryKey: ['following'] });
      toast.success('کاربر مسدود شد');
    },
    onError: (error) => {
      toast.error((error as any).response?.data?.message || 'خطا در مسدود کردن');
    }
  });
};

export default {
  useFollowMember,
  useUnfollowMember,
  useMyFollowers,
  useMyFollowing,
  useUserFollowers,
  useUserFollowing,
  useConnectionStatus,
  useMutualConnections,
  useBlockMember
};
