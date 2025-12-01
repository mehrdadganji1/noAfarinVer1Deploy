import { useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';

interface Training {
  _id: string;
  title: string;
  description: string;
  type: string;
  level: string;
  instructor: string;
  startDate: string;
  endDate: string;
  duration: number;
  status: string;
  capacity: number;
  participants: string[];
  location: string;
  isOnline: boolean;
  rating: number;
  reviews: number;
  price: number;
  certificate: boolean;
}

interface UseTrainingsReturn {
  trainings: Training[];
  loading: boolean;
  error: string | null;
  stats: {
    total: number;
    active: number;
    upcoming: number;
    completed: number;
  };
  hasMore: boolean;
  fetchTrainings: (reset?: boolean) => Promise<void>;
  fetchStats: () => Promise<void>;
  page: number;
  setPage: (page: number) => void;
}

export const useTrainings = (
  search: string,
  typeFilter: string,
  statusFilter: string,
  levelFilter: string
): UseTrainingsReturn => {
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    upcoming: 0,
    completed: 0,
  });

  const fetchTrainings = useCallback(
    async (reset = false) => {
      try {
        setLoading(true);
        setError(null);
        const currentPage = reset ? 1 : page;

        const params = new URLSearchParams({
          page: currentPage.toString(),
          limit: '12',
        });

        if (search) params.append('search', search);
        if (typeFilter) params.append('type', typeFilter);
        if (statusFilter) params.append('status', statusFilter);
        if (levelFilter) params.append('level', levelFilter);

        const response = await api.get(`/trainings?${params}`);

        if (reset) {
          setTrainings(response.data.trainings);
          setPage(1);
        } else {
          setTrainings((prev) => [...prev, ...response.data.trainings]);
        }

        setHasMore(
          response.data.pagination.page < response.data.pagination.pages
        );
      } catch (err: any) {
        setError(err.response?.data?.error || 'خطا در دریافت دوره‌ها');
        console.error('Error fetching trainings:', err);
      } finally {
        setLoading(false);
      }
    },
    [page, search, typeFilter, statusFilter, levelFilter]
  );

  const fetchStats = async () => {
    try {
      const response = await api.get('/trainings/analytics');
      setStats(response.data.overview);
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchTrainings(true);
    }, 300);

    return () => clearTimeout(timer);
  }, [search, typeFilter, statusFilter, levelFilter]);

  return {
    trainings,
    loading,
    error,
    stats,
    hasMore,
    fetchTrainings,
    fetchStats,
    page,
    setPage,
  };
};
