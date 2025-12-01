import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import type {
  CommunityStats,
  TrendingMember,
  ActiveMember,
  EngagementStats,
  User,
  ApiResponse
} from '../types/community';

// =====================================================
// COMMUNITY STATISTICS
// =====================================================

/**
 * Get overall community statistics
 */
export const useCommunityStats = () => {
  return useQuery({
    queryKey: ['communityStats'],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<CommunityStats>>(
        '/api/community/stats'
      );
      return data.data!;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    refetchInterval: 5 * 60 * 1000 // Refetch every 5 minutes
  });
};

/**
 * Get trending members
 */
export const useTrendingMembers = (days: number = 7, limit: number = 10) => {
  return useQuery({
    queryKey: ['trendingMembers', days, limit],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<TrendingMember[]>>(
        '/api/community/stats/trending',
        { params: { days, limit } }
      );
      return data.data!;
    },
    staleTime: 15 * 60 * 1000 // 15 minutes
  });
};

/**
 * Get most active members
 */
export const useActiveMembers = (days: number = 30, limit: number = 10) => {
  return useQuery({
    queryKey: ['activeMembers', days, limit],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<ActiveMember[]>>(
        '/api/community/stats/active',
        { params: { days, limit } }
      );
      return data.data!;
    },
    staleTime: 15 * 60 * 1000 // 15 minutes
  });
};

/**
 * Get new members
 */
export const useNewMembers = (days: number = 30, limit: number = 10) => {
  return useQuery({
    queryKey: ['newMembers', days, limit],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<User[]>>(
        '/community/stats/new-members',
        { params: { days, limit } }
      );
      return data.data!;
    },
    staleTime: 30 * 60 * 1000 // 30 minutes
  });
};

/**
 * Get engagement statistics
 */
export const useEngagementStats = (days: number = 30) => {
  return useQuery({
    queryKey: ['engagementStats', days],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<EngagementStats>>(
        '/community/stats/engagement',
        { params: { days } }
      );
      return data.data!;
    },
    staleTime: 15 * 60 * 1000 // 15 minutes
  });
};

export default {
  useCommunityStats,
  useTrendingMembers,
  useActiveMembers,
  useNewMembers,
  useEngagementStats
};
