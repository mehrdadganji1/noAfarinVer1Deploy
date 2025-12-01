import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';

export interface Activity {
  _id: string;
  type: 'application' | 'document' | 'interview' | 'message' | 'status' | 'profile' | 'notification';
  title: string;
  description: string;
  status: 'success' | 'pending' | 'error' | 'info';
  metadata?: Record<string, any>;
  relatedId?: string;
  createdAt: string;
  updatedAt: string;
}

interface GetActivitiesParams {
  limit?: number;
  type?: string;
  status?: string;
}

/**
 * Hook to fetch recent activities
 */
export function useRecentActivities(params: GetActivitiesParams = {}) {
  const { limit = 10, type, status } = params;

  return useQuery<Activity[], Error>({
    queryKey: ['activities', 'recent', limit, type, status],
    queryFn: async () => {
      const queryParams = new URLSearchParams();
      queryParams.append('limit', limit.toString());
      if (type) queryParams.append('type', type);
      if (status) queryParams.append('status', status);

      const response = await api.get(`/api/activities/recent?${queryParams.toString()}`);
      return response.data.data || [];
    },
    staleTime: 30000, // 30 seconds
    refetchOnWindowFocus: true,
  });
}

/**
 * Hook to fetch activity statistics
 */
export function useActivityStats() {
  return useQuery({
    queryKey: ['activities', 'stats'],
    queryFn: async () => {
      const response = await api.get('/activities/stats');
      return response.data.data;
    },
    staleTime: 60000, // 1 minute
  });
}

/**
 * Hook to fetch community activities (activity feed)
 */
export interface CommunityActivity {
  _id: string;
  userId: {
    _id: string;
    firstName: string;
    lastName: string;
    avatar?: string;
    membershipInfo?: {
      membershipLevel: 'bronze' | 'silver' | 'gold' | 'platinum';
    };
  };
  type: 'project_completed' | 'achievement_earned' | 'event_attended' | 
        'course_completed' | 'skill_added' | 'connection_made' | 
        'profile_updated' | 'post_created';
  title: string;
  description: string;
  content?: string;
  images?: string[];
  visibility: 'public' | 'connections' | 'private';
  reactions: Array<{
    userId: {
      _id: string;
      firstName: string;
      lastName: string;
    };
    type: 'like' | 'love' | 'clap';
    createdAt: string;
  }>;
  comments: Array<{
    userId: {
      _id: string;
      firstName: string;
      lastName: string;
    };
    content: string;
    _id: string;
    createdAt: string;
    updatedAt: string;
  }>;
  viewsCount: number;
  sharesCount: number;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface ActivitiesParams {
  page?: number;
  limit?: number;
  type?: string;
  visibility?: 'all' | 'public' | 'connections';
}

export function useActivities(params: ActivitiesParams = {}) {
  const { page = 1, limit = 20, type, visibility = 'all' } = params;

  return useQuery({
    queryKey: ['community', 'activities', page, limit, type, visibility],
    queryFn: async () => {
      const queryParams = new URLSearchParams();
      queryParams.append('page', page.toString());
      queryParams.append('limit', limit.toString());
      if (type) queryParams.append('type', type);
      if (visibility) queryParams.append('visibility', visibility);

      const response = await api.get(`/api/community/activities?${queryParams.toString()}`);
      return response.data;
    },
    staleTime: 30000, // 30 seconds
    refetchOnWindowFocus: true,
  });
}
