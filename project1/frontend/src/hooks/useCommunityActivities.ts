import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from '@/lib/toast';
import type {
  MemberActivity,
  CreateActivityInput,
  UpdateActivityInput,
  ReactionType,
  PaginatedResponse,
  ApiResponse,
  Comment
} from '../types/community';

// =====================================================
// AXIOS INSTANCE
// =====================================================

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// =====================================================
// ACTIVITY FEED
// =====================================================

/**
 * Get activity feed (from connections)
 */
export const useActivityFeed = (page: number = 1, limit: number = 20, filters?: {
  type?: string;
  visibility?: 'all' | 'connections' | 'public';
}) => {
  return useQuery({
    queryKey: ['activityFeed', page, limit, filters],
    queryFn: async () => {
      const { data } = await api.get<PaginatedResponse<MemberActivity>>(
        '/api/community/activities',
        { params: { page, limit, ...filters } }
      );
      return data;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchInterval: 30 * 1000 // Refetch every 30 seconds
  });
};

/**
 * Get public activities (explore)
 */
export const usePublicActivities = (page: number = 1, limit: number = 20, type?: string) => {
  return useQuery({
    queryKey: ['publicActivities', page, limit, type],
    queryFn: async () => {
      const { data } = await api.get<PaginatedResponse<MemberActivity>>(
        '/api/community/activities/public',
        { params: { page, limit, type } }
      );
      return data;
    },
    staleTime: 5 * 60 * 1000 // 5 minutes
  });
};

/**
 * Get trending activities
 */
export const useTrendingActivities = (days: number = 7, limit: number = 10) => {
  return useQuery({
    queryKey: ['trendingActivities', days, limit],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<MemberActivity[]>>(
        '/api/community/activities/trending',
        { params: { days, limit } }
      );
      return data.data!;
    },
    staleTime: 10 * 60 * 1000 // 10 minutes
  });
};

/**
 * Get user's activities
 */
export const useUserActivities = (
  userId: string | undefined,
  page: number = 1,
  limit: number = 20
) => {
  return useQuery({
    queryKey: ['userActivities', userId, page, limit],
    queryFn: async () => {
      if (!userId) throw new Error('User ID is required');
      const { data } = await api.get<PaginatedResponse<MemberActivity>>(
        `/api/community/activities/${userId}`,
        { params: { page, limit } }
      );
      return data;
    },
    enabled: !!userId,
    staleTime: 3 * 60 * 1000 // 3 minutes
  });
};

// =====================================================
// ACTIVITY MANAGEMENT
// =====================================================

/**
 * Create new activity
 */
export const useCreateActivity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateActivityInput) => {
      const { data } = await api.post<ApiResponse<MemberActivity>>(
        '/api/community/activities',
        input
      );
      return data.data!;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activityFeed'] });
      queryClient.invalidateQueries({ queryKey: ['userActivities'] });
      toast.success('فعالیت ایجاد شد');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'خطا در ایجاد فعالیت');
    }
  });
};

/**
 * Update activity
 */
export const useUpdateActivity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ activityId, input }: { activityId: string; input: UpdateActivityInput }) => {
      const { data } = await api.put<ApiResponse<MemberActivity>>(
        `/api/community/activities/${activityId}`,
        input
      );
      return data.data!;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activityFeed'] });
      queryClient.invalidateQueries({ queryKey: ['userActivities'] });
      toast.success('فعالیت به‌روزرسانی شد');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'خطا در به‌روزرسانی فعالیت');
    }
  });
};

/**
 * Delete activity
 */
export const useDeleteActivity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (activityId: string) => {
      const { data } = await api.delete<ApiResponse<void>>(
        `/api/community/activities/${activityId}`
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activityFeed'] });
      queryClient.invalidateQueries({ queryKey: ['userActivities'] });
      toast.success('فعالیت حذف شد');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'خطا در حذف فعالیت');
    }
  });
};

// =====================================================
// REACTIONS
// =====================================================

/**
 * React to activity (or remove reaction)
 */
export const useReactToActivity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ activityId, type }: { activityId: string; type: ReactionType }) => {
      const { data } = await api.post<ApiResponse<{ action: 'added' | 'removed' }>>(
        `/api/community/activities/${activityId}/react`,
        { type }
      );
      return data;
    },
    onSuccess: () => {
      // Invalidate all activity queries to update reaction counts
      queryClient.invalidateQueries({ queryKey: ['activityFeed'] });
      queryClient.invalidateQueries({ queryKey: ['publicActivities'] });
      queryClient.invalidateQueries({ queryKey: ['userActivities'] });
      queryClient.invalidateQueries({ queryKey: ['trendingActivities'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'خطا در ثبت واکنش');
    }
  });
};

// =====================================================
// COMMENTS
// =====================================================

/**
 * Add comment to activity
 */
export const useAddComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ activityId, content }: { activityId: string; content: string }) => {
      const { data } = await api.post<ApiResponse<Comment[]>>(
        `/api/community/activities/${activityId}/comment`,
        { content }
      );
      return data.data!;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activityFeed'] });
      queryClient.invalidateQueries({ queryKey: ['publicActivities'] });
      queryClient.invalidateQueries({ queryKey: ['userActivities'] });
      toast.success('نظر اضافه شد');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'خطا در افزودن نظر');
    }
  });
};

/**
 * Delete comment
 */
export const useDeleteComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ activityId, commentId }: { activityId: string; commentId: string }) => {
      const { data } = await api.delete<ApiResponse<void>>(
        `/api/community/activities/${activityId}/comment/${commentId}`
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activityFeed'] });
      queryClient.invalidateQueries({ queryKey: ['publicActivities'] });
      queryClient.invalidateQueries({ queryKey: ['userActivities'] });
      toast.success('نظر حذف شد');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'خطا در حذف نظر');
    }
  });
};

export default {
  useActivityFeed,
  usePublicActivities,
  useTrendingActivities,
  useUserActivities,
  useCreateActivity,
  useUpdateActivity,
  useDeleteActivity,
  useReactToActivity,
  useAddComment,
  useDeleteComment
};
