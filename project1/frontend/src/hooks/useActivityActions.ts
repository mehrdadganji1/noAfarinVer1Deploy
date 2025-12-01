import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { toast } from 'react-hot-toast';

/**
 * React to an activity
 */
export const useReactToActivity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ activityId, type }: { activityId: string; type: 'like' | 'love' | 'clap' }) => {
      const { data } = await api.post(`/community/activities/${activityId}/react`, { type });
      return data.data;
    },
    onSuccess: () => {
      // Invalidate activities to refresh
      queryClient.invalidateQueries({ queryKey: ['community', 'activities'] });
      toast.success('واکنش شما ثبت شد');
    },
    onError: () => {
      toast.error('خطا در ثبت واکنش');
    }
  });
};

/**
 * Add comment to an activity
 */
export const useAddComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ activityId, content }: { activityId: string; content: string }) => {
      const { data } = await api.post(`/community/activities/${activityId}/comment`, { content });
      return data.data;
    },
    onSuccess: () => {
      // Invalidate activities to refresh
      queryClient.invalidateQueries({ queryKey: ['community', 'activities'] });
      toast.success('نظر شما ثبت شد');
    },
    onError: () => {
      toast.error('خطا در ثبت نظر');
    }
  });
};

/**
 * Delete comment from an activity
 */
export const useDeleteComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ activityId, commentId }: { activityId: string; commentId: string }) => {
      const { data } = await api.delete(`/community/activities/${activityId}/comment/${commentId}`);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['community', 'activities'] });
      toast.success('نظر حذف شد');
    },
    onError: () => {
      toast.error('خطا در حذف نظر');
    }
  });
};

export default {
  useReactToActivity,
  useAddComment,
  useDeleteComment
};
