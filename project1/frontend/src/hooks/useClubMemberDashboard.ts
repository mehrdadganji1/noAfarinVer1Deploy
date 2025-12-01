import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';

export interface DashboardStats {
  overview: {
    totalXP: number;
    level: string;
    rank: number | null;
    points: number;
    memberSince: Date;
  };
  activities: {
    eventsAttended: number;
    projectsCompleted: number;
    coursesCompleted: number;
    achievementsEarned: number;
  };
  progress: {
    weeklyXP: number;
    monthlyXP: number;
    streak: number;
    nextLevelXP: number;
  };
  quickStats: {
    upcomingEvents: number;
    activeProjects: number;
    pendingTasks: number;
    newNotifications: number;
  };
}

export interface ActivityItem {
  id: string;
  type: 'event' | 'achievement' | 'project' | 'course';
  title: string;
  description: string;
  timestamp: Date;
  icon: string;
  points: number;
  category: string;
}

export interface QuickStats {
  upcomingEvents: number;
  activeProjects: number;
  pendingTasks: number;
  newNotifications: number;
  todayXP: number;
  weekStreak: number;
}

/**
 * Hook to fetch dashboard stats
 */
export const useDashboardStats = () => {
  return useQuery({
    queryKey: ['club-member-dashboard-stats'],
    queryFn: async () => {
      const { data } = await api.get<{ success: boolean; data: DashboardStats }>(
        '/club-member/dashboard/stats'
      );
      return data.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 2,
  });
};

/**
 * Hook to fetch activity timeline
 */
export const useActivityTimeline = (limit = 10, page = 1) => {
  return useQuery({
    queryKey: ['club-member-activity-timeline', limit, page],
    queryFn: async () => {
      const { data } = await api.get<{
        success: boolean;
        data: {
          activities: ActivityItem[];
          pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
          };
        };
      }>('/club-member/dashboard/timeline', {
        params: { limit, page },
      });
      return data.data;
    },
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};

/**
 * Hook to fetch quick stats
 */
export const useQuickStats = () => {
  return useQuery({
    queryKey: ['club-member-quick-stats'],
    queryFn: async () => {
      const { data } = await api.get<{ success: boolean; data: QuickStats }>(
        '/club-member/dashboard/quick-stats'
      );
      return data.data;
    },
    staleTime: 1000 * 60, // 1 minute
    refetchInterval: 1000 * 60, // Refetch every minute
  });
};

