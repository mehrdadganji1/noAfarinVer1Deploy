import { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3013/api';

interface Resource {
  id: string;
  title: string;
  description: string;
  category: 'foundation' | 'hacker' | 'hustler' | 'hipster';
  readTime: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  order: number;
  tags: string[];
  views: number;
  likes: number;
  bookmarks: number;
  nextResourceId?: string;
  prevResourceId?: string;
  metadata: {
    estimatedMinutes: number;
    sections: number;
    exercises: number;
    quizzes: number;
  };
  userProgress?: {
    status: 'not_started' | 'in_progress' | 'completed';
    progress: number;
    bookmarked: boolean;
    liked: boolean;
  };
}

interface ResourceDetail extends Resource {
  content: string;
  htmlContent: string;
  userProgress?: {
    status: 'not_started' | 'in_progress' | 'completed';
    progress: number;
    timeSpent: number;
    bookmarked: boolean;
    liked: boolean;
    notes: string;
  };
}

interface UserStats {
  totalResources: number;
  completed: number;
  inProgress: number;
  notStarted: number;
  totalTimeSpent: number;
  bookmarked: number;
  progressPercentage: number;
}

export const useLearningResources = (filters?: {
  category?: string;
  difficulty?: string;
  search?: string;
}) => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchResources();
  }, [filters]);

  const fetchResources = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters?.category && filters.category !== 'all') params.append('category', filters.category);
      if (filters?.difficulty) params.append('difficulty', filters.difficulty);
      if (filters?.search) params.append('search', filters.search);

      const response = await axios.get(`${API_BASE_URL}/resources?${params}`, {
        headers: {
          'x-user-id': localStorage.getItem('userId') || 'guest'
        }
      });

      setResources(response.data.data);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { resources, loading, error, refetch: fetchResources };
};

export const useResourceDetail = (resourceId: string) => {
  const [resource, setResource] = useState<ResourceDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (resourceId) {
      fetchResource();
    }
  }, [resourceId]);

  const fetchResource = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/resources/${resourceId}`, {
        headers: {
          'x-user-id': localStorage.getItem('userId') || 'guest'
        }
      });

      setResource(response.data.data);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateProgress = async (progress: number, timeSpent: number, status?: string) => {
    try {
      await axios.put(
        `${API_BASE_URL}/resources/${resourceId}/progress`,
        { progress, timeSpent, status },
        {
          headers: {
            'x-user-id': localStorage.getItem('userId') || 'guest'
          }
        }
      );
      fetchResource();
    } catch (err: any) {
      console.error('Error updating progress:', err);
    }
  };

  const toggleBookmark = async () => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/resources/${resourceId}/bookmark`,
        {},
        {
          headers: {
            'x-user-id': localStorage.getItem('userId') || 'guest'
          }
        }
      );
      
      if (resource && resource.userProgress) {
        setResource({
          ...resource,
          userProgress: {
            ...resource.userProgress,
            bookmarked: response.data.bookmarked
          }
        });
      }
    } catch (err: any) {
      console.error('Error toggling bookmark:', err);
    }
  };

  const toggleLike = async () => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/resources/${resourceId}/like`,
        {},
        {
          headers: {
            'x-user-id': localStorage.getItem('userId') || 'guest'
          }
        }
      );
      
      if (resource && resource.userProgress) {
        setResource({
          ...resource,
          userProgress: {
            ...resource.userProgress,
            liked: response.data.liked
          }
        });
      }
    } catch (err: any) {
      console.error('Error toggling like:', err);
    }
  };

  return {
    resource,
    loading,
    error,
    updateProgress,
    toggleBookmark,
    toggleLike,
    refetch: fetchResource
  };
};

export const useUserStats = () => {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/resources/stats`, {
        headers: {
          'x-user-id': localStorage.getItem('userId') || 'guest'
        }
      });

      setStats(response.data.data);
    } catch (err: any) {
      console.error('Error fetching stats:', err);
    } finally {
      setLoading(false);
    }
  };

  return { stats, loading, refetch: fetchStats };
};
