import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from '@/lib/toast';
import type {
  Message,
  Conversation,
  SendMessageInput,
  ApiResponse,
  PaginatedResponse
} from '../types/community';

// =====================================================
// AXIOS INSTANCE
// =====================================================

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// =====================================================
// CONVERSATIONS
// =====================================================

/**
 * Get my conversations
 */
export const useConversations = () => {
  return useQuery({
    queryKey: ['conversations'],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<Conversation[]>>(
        '/api/community/messages/conversations'
      );
      return data.data!;
    },
    staleTime: 1 * 60 * 1000, // 1 minute
    refetchInterval: 10 * 1000 // Refetch every 10 seconds for real-time feel
  });
};

/**
 * Get conversation messages
 */
export const useConversationMessages = (
  conversationId: string | undefined,
  page: number = 1,
  limit: number = 50
) => {
  return useQuery({
    queryKey: ['conversationMessages', conversationId, page, limit],
    queryFn: async () => {
      if (!conversationId) throw new Error('Conversation ID is required');
      const { data } = await api.get<PaginatedResponse<Message>>(
        `/api/community/messages/conversations/${conversationId}`,
        { params: { page, limit } }
      );
      return data;
    },
    enabled: !!conversationId,
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 5 * 1000 // Refetch every 5 seconds
  });
};

// =====================================================
// SEND & MANAGE MESSAGES
// =====================================================

/**
 * Send a message
 */
export const useSendMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: SendMessageInput) => {
      const { data } = await api.post<ApiResponse<Message>>(
        '/api/community/messages/send',
        input
      );
      return data.data!;
    },
    onSuccess: (message) => {
      // Invalidate conversations list
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
      
      // Invalidate conversation messages
      queryClient.invalidateQueries({ 
        queryKey: ['conversationMessages', message.conversationId] 
      });
      
      // Don't show toast for sending messages (better UX)
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'خطا در ارسال پیام');
    }
  });
};

/**
 * Mark message as read
 */
export const useMarkAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (messageId: string) => {
      const { data } = await api.put<ApiResponse<void>>(
        `/api/community/messages/${messageId}/read`
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
      queryClient.invalidateQueries({ queryKey: ['conversationMessages'] });
      queryClient.invalidateQueries({ queryKey: ['unreadCount'] });
    }
  });
};

/**
 * Mark conversation as read
 */
export const useMarkConversationAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (conversationId: string) => {
      const { data } = await api.put<ApiResponse<void>>(
        `/api/community/messages/conversation/${conversationId}/read`
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
      queryClient.invalidateQueries({ queryKey: ['unreadCount'] });
    }
  });
};

/**
 * Delete message
 */
export const useDeleteMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (messageId: string) => {
      const { data } = await api.delete<ApiResponse<void>>(
        `/api/community/messages/${messageId}`
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
      queryClient.invalidateQueries({ queryKey: ['conversationMessages'] });
      toast.success('پیام حذف شد');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'خطا در حذف پیام');
    }
  });
};

// =====================================================
// UNREAD COUNT
// =====================================================

/**
 * Get unread messages count
 */
export const useUnreadCount = () => {
  return useQuery({
    queryKey: ['unreadCount'],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<{ count: number }>>(
        '/api/community/messages/unread/count'
      );
      return data.data!.count;
    },
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 15 * 1000 // Refetch every 15 seconds
  });
};

// =====================================================
// SEARCH
// =====================================================

/**
 * Search messages
 */
export const useSearchMessages = (query: string) => {
  return useQuery({
    queryKey: ['searchMessages', query],
    queryFn: async () => {
      if (!query || query.trim().length === 0) return [];
      const { data } = await api.post<ApiResponse<Message[]>>(
        '/api/community/messages/search',
        { query, limit: 50 }
      );
      return data.data!;
    },
    enabled: query.trim().length > 0
  });
};

export default {
  useConversations,
  useConversationMessages,
  useSendMessage,
  useMarkAsRead,
  useMarkConversationAsRead,
  useDeleteMessage,
  useUnreadCount,
  useSearchMessages
};
