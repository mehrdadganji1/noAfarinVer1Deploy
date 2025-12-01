import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { toast } from '@/lib/toast';

interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastCheckIn: Date | null;
  totalCheckIns: number;
  canCheckInToday: boolean;
  nextMilestone: {
    days: number;
    xp: number;
    name: string;
  } | null;
  milestones: Array<{
    days: number;
    achievedAt: Date;
  }>;
}

interface CheckInResponse {
  streak: {
    currentStreak: number;
    longestStreak: number;
    totalCheckIns: number;
  };
  xp: {
    awarded: number;
    total: number;
    level: number;
    leveledUp: boolean;
  };
  streakMaintained: boolean;
  streakBroken: boolean;
  milestonesAchieved: Array<{
    days: number;
    name: string;
    xp: number;
  }>;
}

interface LeaderboardEntry {
  rank: number;
  user: {
    _id: string;
    firstName: string;
    lastName: string;
    avatar?: string;
  };
  streak: number;
  totalCheckIns: number;
}

interface StreakHistory {
  date: Date;
  maintained: boolean;
}

// Get current user's streak
export const useMyStreak = () => {
  return useQuery({
    queryKey: ['my-streak'],
    queryFn: async () => {
      const { data } = await api.get<{ success: boolean; data: StreakData }>(
        '/api/streaks/my-streak'
      );
      return data.data;
    },
    staleTime: 1000 * 60, // 1 minute
    refetchInterval: 1000 * 60 * 5, // Refetch every 5 minutes
  });
};

// Check in for today
export const useCheckIn = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const { data } = await api.post<{ success: boolean; message: string; data: CheckInResponse }>(
        '/api/streaks/check-in'
      );
      return data.data;
    },
    onSuccess: (data) => {
      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: ['my-streak'] });
      queryClient.invalidateQueries({ queryKey: ['my-xp'] });
      queryClient.invalidateQueries({ queryKey: ['streak-history'] });

      // Show success message
      let message = `حضور ثبت شد! +${data.xp.awarded} XP`;
      
      if (data.streakMaintained) {
        message += ` | استریک ${data.streak.currentStreak} روزه`;
      }
      
      if (data.milestonesAchieved.length > 0) {
        const milestone = data.milestonesAchieved[0];
        message += ` | 🎉 ${milestone.name}!`;
      }
      
      if (data.xp.leveledUp) {
        message += ` | 🎊 Level Up! سطح ${data.xp.level}`;
      }

      toast.success(message);

      // Show milestone achievements
      data.milestonesAchieved.forEach((milestone) => {
        setTimeout(() => {
          toast.success(`🏆 ${milestone.name} - ${milestone.xp} XP اضافی!`);
        }, 1000);
      });
    },
    onError: (error: any) => {
      const message = error.response?.data?.error || 'خطا در ثبت حضور';
      toast.error(message);
    },
  });
};

// Get streak leaderboard
export const useStreakLeaderboard = (type: 'current' | 'longest' = 'current', limit = 100) => {
  return useQuery({
    queryKey: ['streak-leaderboard', type, limit],
    queryFn: async () => {
      const { data } = await api.get<{
        success: boolean;
        data: { type: string; leaderboard: LeaderboardEntry[] };
      }>('/api/streaks/leaderboard', {
        params: { type, limit },
      });
      return data.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Get streak history (calendar view)
export const useStreakHistory = (days = 30) => {
  return useQuery({
    queryKey: ['streak-history', days],
    queryFn: async () => {
      const { data } = await api.get<{
        success: boolean;
        data: {
          history: StreakHistory[];
          currentStreak: number;
          longestStreak: number;
        };
      }>('/api/streaks/history', {
        params: { days },
      });
      return data.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Get streak statistics
export const useStreakStats = () => {
  return useQuery({
    queryKey: ['streak-stats'],
    queryFn: async () => {
      const { data } = await api.get<{
        success: boolean;
        data: {
          totalUsers: number;
          activeStreaks: number;
          averages: {
            avgCurrent: number;
            avgLongest: number;
            maxCurrent: number;
            maxLongest: number;
          };
          distribution: Array<{
            _id: number;
            count: number;
          }>;
        };
      }>('/api/streaks/stats');
      return data.data;
    },
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
};
