import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { toast } from '@/components/ui/toast';
import type { UserXP, XPHistory, LevelInfo, XPGainResult, LeaderboardEntry, MyRank } from '@/types/xp';

/**
 * دریافت XP کاربر
 */
export const useMyXP = () => {
  return useQuery<UserXP>({
    queryKey: ['my-xp'],
    queryFn: async () => {
      const response = await api.get('/xp/my/xp');
      return response.data.data;
    },
    retry: false,
    staleTime: 30000, // 30 seconds
  });
};

/**
 * اضافه کردن XP
 */
export const useAddXP = () => {
  const queryClient = useQueryClient();

  return useMutation<XPGainResult, Error, { amount: number; source: string; sourceId?: string; description?: string }>({
    mutationFn: async (data) => {
      const response = await api.post('/xp/add', data);
      return response.data.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['my-xp'] });
      queryClient.invalidateQueries({ queryKey: ['xp-history'] });
      
      if (data.leveledUp) {
        toast.success(`🎉 تبریک! به سطح ${data.newLevel} رسیدید!`);
      } else {
        toast.success(`+${data.xpGained} XP دریافت کردید`);
      }
    },
    onError: () => {
      toast.error('خطا در اضافه کردن XP');
    },
  });
};

/**
 * دریافت تاریخچه XP
 */
export const useXPHistory = (page = 1, limit = 20, source?: string) => {
  return useQuery<XPHistory>({
    retry: false,
    queryKey: ['xp-history', page, limit, source],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });
      if (source) params.append('source', source);
      
      const response = await api.get(`/api/xp/history?${params.toString()}`);
      return response.data.data;
    },
  });
};

/**
 * دریافت Leaderboard
 */
export const useXPLeaderboard = (limit = 50) => {
  return useQuery<{ leaderboard: LeaderboardEntry[]; pagination: any }>({
    queryKey: ['xp-leaderboard', limit],
    queryFn: async () => {
      const response = await api.get(`/api/xp/leaderboard?limit=${limit}`);
      return response.data.data;
    },
    retry: false,
    staleTime: 60000, // 1 minute
  });
};

/**
 * دریافت اطلاعات سطح
 */
export const useLevelInfo = (level: number) => {
  return useQuery<LevelInfo>({
    queryKey: ['level-info', level],
    queryFn: async () => {
      const response = await api.get(`/api/xp/level-info/${level}`);
      return response.data.data;
    },
    enabled: level > 0,
    retry: false,
  });
};

/**
 * دریافت رتبه کاربر
 */
export const useMyRank = () => {
  return useQuery<MyRank>({
    queryKey: ['my-rank'],
    queryFn: async () => {
      const response = await api.get('/xp/my/rank');
      return response.data.data;
    },
    retry: false,
    staleTime: 60000, // 1 minute
  });
};
