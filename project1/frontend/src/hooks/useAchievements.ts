import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import {
  Achievement,
  UserAchievementsResponse,
  AchievementCategory,
} from '../types/achievement';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Get all achievements
export const useAchievements = (category?: AchievementCategory) => {
  return useQuery({
    queryKey: ['achievements', category],
    queryFn: async () => {
      const params = category ? { category } : {};
      const response = await axios.get<{ success: boolean; data: Achievement[] }>(
        `${API_URL}/api/achievements`,
        { params }
      );
      return response.data.data;
    },
  });
};

// Get user's achievements
export const useUserAchievements = () => {
  return useQuery({
    queryKey: ['user-achievements'],
    queryFn: async () => {
      const token = localStorage.getItem('token');
      const response = await axios.get<{
        success: boolean;
        data: UserAchievementsResponse;
      }>(`${API_URL}/api/achievements/my/achievements`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.data;
    },
  });
};

// Unlock achievement
export const useUnlockAchievement = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      achievementId,
      progress,
    }: {
      achievementId: string;
      progress: number;
    }) => {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_URL}/api/achievements/${achievementId}/unlock`,
        { progress },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-achievements'] });
    },
  });
};
