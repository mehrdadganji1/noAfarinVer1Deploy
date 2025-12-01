import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { toast } from '@/lib/toast';

export interface Message {
  _id: string;
  conversationId: string;
  senderId: {
    _id: string;
    firstName: string;
    lastName: string;
    avatar?: string;
  };
  receiverId: string;
  content: string;
  messageType: 'text' | 'file' | 'image' | 'system';
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
  isRead: boolean;
  readAt?: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Conversation {
  _id: string;
  participants: Array<{
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    avatar?: string;
  }>;
  lastMessage?: {
    content: string;
    senderId: string;
    createdAt: string;
  };
  unreadCount: Record<string, number>;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Get all conversations
 */
export const useConversations = () => {
  return useQuery({
    queryKey: ['conversations'],
    queryFn: async () => {
      const { data } = await api.get('/messages/conversations');
      return data.data as Conversation[];
    },
    retry: false,
  });
};

/**
 * Get messages for a conversation
 */
export const useMessages = (conversationId: string | undefined, page = 1, limit = 50) => {
  return useQuery({
    queryKey: ['messages', conversationId, page],
    queryFn: async () => {
      const { data } = await api.get(
        `/api/messages/conversations/${conversationId}/messages?page=${page}&limit=${limit}`
      );
      return {
        messages: data.data as Message[],
        pagination: data.pagination,
      };
    },
    enabled: !!conversationId,
    retry: false,
  });
};

/**
 * Send a message
 */
export const useSendMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: {
      receiverId: string;
      content: string;
      messageType?: 'text' | 'file' | 'image';
      fileUrl?: string;
      fileName?: string;
      fileSize?: number;
    }) => {
      const { data } = await api.post('/messages/send', payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
      queryClient.invalidateQueries({ queryKey: ['messages'] });
      queryClient.invalidateQueries({ queryKey: ['unread-messages-count'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'خطا در ارسال پیام');
    },
  });
};

/**
 * Mark message as read
 */
export const useMarkAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (messageId: string) => {
      const { data } = await api.put(`/api/messages/${messageId}/read`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] });
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
      queryClient.invalidateQueries({ queryKey: ['unread-messages-count'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'خطا در علامت‌گذاری پیام');
    },
  });
};

/**
 * Delete a message
 */
export const useDeleteMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (messageId: string) => {
      const { data } = await api.delete(`/api/messages/${messageId}`);
      return data;
    },
    onSuccess: (data: any) => {
      toast.success(data.message || 'پیام حذف شد');
      queryClient.invalidateQueries({ queryKey: ['messages'] });
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'خطا در حذف پیام');
    },
  });
};

/**
 * Get unread messages count
 */
export const useUnreadMessagesCount = () => {
  return useQuery({
    queryKey: ['unread-messages-count'],
    queryFn: async () => {
      const { data } = await api.get('/messages/unread-count');
      return data.data.count as number;
    },
    refetchInterval: 30000, // Refetch every 30 seconds
    retry: false,
  });
};
