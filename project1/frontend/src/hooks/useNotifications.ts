import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

export interface Notification {
  _id: string;
  userId: string;
  type: string;
  priority: string;
  title: string;
  message: string;
  link?: string;
  metadata?: Record<string, any>;
  isRead: boolean;
  readAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

interface NotificationsResponse {
  success: boolean;
  data: Notification[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

interface UnreadCountResponse {
  success: boolean;
  count: number;
}

/**
 * Hook to fetch notifications
 */
export function useNotifications(page = 1, limit = 20) {
  return useQuery<NotificationsResponse, Error>({
    queryKey: ['notifications', page, limit],
    queryFn: async () => {
      const response = await api.get(`/notifications?page=${page}&limit=${limit}`);
      return response.data;
    },
    staleTime: 30000, // 30 seconds
  });
}

/**
 * Hook to get unread notifications count
 */
export function useUnreadCount() {
  return useQuery<number, Error>({
    queryKey: ['unread-count'],
    queryFn: async () => {
      try {
        const response = await api.get<UnreadCountResponse>('/notifications/unread-count');
        return response.data.count || 0;
      } catch (error) {
        console.warn('Failed to fetch unread count:', error);
        return 0; // Return 0 instead of undefined
      }
    },
    staleTime: 10000, // 10 seconds
    refetchInterval: 30000, // Refetch every 30 seconds
    retry: false,
  });
}

/**
 * Hook to mark notification as read
 */
export function useMarkAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (notificationId: string) => {
      const response = await api.patch(`/notifications/${notificationId}/read`);
      return response.data;
    },
    onSuccess: () => {
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['unread-count'] });
    },
  });
}

/**
 * Hook to mark all notifications as read
 */
export function useMarkAllAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await api.patch('/notifications/mark-all-read');
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['unread-count'] });
    },
  });
}

/**
 * Hook to delete a notification
 */
export function useDeleteNotification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (notificationId: string) => {
      const response = await api.delete(`/notifications/${notificationId}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['unread-count'] });
    },
  });
}
