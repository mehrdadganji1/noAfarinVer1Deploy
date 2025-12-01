import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { toast } from '@/lib/toast';

export enum ChallengeType {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  SPECIAL = 'special',
}

export enum ChallengeCategory {
  PROJECTS = 'projects',
  EVENTS = 'events',
  COURSES = 'courses',
  SOCIAL = 'social',
  PROFILE = 'profile',
  GENERAL = 'general',
}

export enum ChallengeDifficulty {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard',
}

export interface Challenge {
  _id: string;
  title: string;
  description: string;
  type: ChallengeType;
  category: ChallengeCategory;
  difficulty: ChallengeDifficulty;
  requirements: {
    action: string;
    count: number;
    metadata?: any;
  };
  rewards: {
    xp: number;
    badge?: string;
    title?: string;
  };
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  userProgress?: {
    progress: number;
    targetCount: number;
    completed: boolean;
    completedAt: Date | null;
    claimedReward: boolean;
    percentage: number;
  };
}

interface ChallengesResponse {
  challenges: Challenge[];
  count: number;
}

interface MyProgressResponse {
  challenges: Challenge[];
  stats: {
    total: number;
    completed: number;
    inProgress: number;
  };
}

interface ClaimRewardResponse {
  xp: {
    awarded: number;
    total: number;
    level: number;
    leveledUp: boolean;
  };
  rewards: {
    xp: number;
    badge?: string;
    title?: string;
  };
}

// Get active challenges
export const useChallenges = (type: ChallengeType = ChallengeType.DAILY) => {
  return useQuery({
    queryKey: ['challenges', type],
    queryFn: async () => {
      const { data } = await api.get<{ success: boolean; data: ChallengesResponse }>(
        '/api/challenges',
        {
          params: { type },
        }
      );
      return data.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Get user's challenge progress
export const useMyProgress = (type: ChallengeType = ChallengeType.DAILY) => {
  return useQuery({
    queryKey: ['my-progress', type],
    queryFn: async () => {
      const { data } = await api.get<{ success: boolean; data: MyProgressResponse }>(
        '/api/challenges/my-progress',
        {
          params: { type },
        }
      );
      return data.data;
    },
    staleTime: 1000 * 60, // 1 minute
    refetchInterval: 1000 * 60 * 2, // Refetch every 2 minutes
  });
};

// Claim challenge reward
export const useClaimReward = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (challengeId: string) => {
      const { data } = await api.post<{
        success: boolean;
        message: string;
        data: ClaimRewardResponse;
      }>(`/api/challenges/${challengeId}/claim`);
      return data.data;
    },
    onSuccess: (data) => {
      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: ['my-progress'] });
      queryClient.invalidateQueries({ queryKey: ['challenges'] });
      queryClient.invalidateQueries({ queryKey: ['my-xp'] });

      // Show success message
      let message = `جایزه دریافت شد! +${data.xp.awarded} XP`;

      if (data.xp.leveledUp) {
        message += ` | 🎊 Level Up! سطح ${data.xp.level}`;
      }

      if (data.rewards.badge) {
        message += ` | 🏅 ${data.rewards.badge}`;
      }

      toast.success(message);

      // Show level up notification
      if (data.xp.leveledUp) {
        setTimeout(() => {
          toast.success(`🎉 تبریک! به سطح ${data.xp.level} رسیدید!`);
        }, 1000);
      }
    },
    onError: (error: any) => {
      const message = error.response?.data?.error || 'خطا در دریافت جایزه';
      toast.error(message);
    },
  });
};

// Get challenge statistics
export const useChallengeStats = () => {
  return useQuery({
    queryKey: ['challenge-stats'],
    queryFn: async () => {
      const { data } = await api.get<{
        success: boolean;
        data: {
          totalActive: number;
          totalCompleted: number;
          totalInProgress: number;
          completionByDifficulty: Array<{
            _id: string;
            total: number;
            completions: number;
          }>;
        };
      }>('/api/challenges/stats');
      return data.data;
    },
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
};
