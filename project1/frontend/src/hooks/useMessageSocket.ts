import { useEffect, useRef, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '@/store/authStore';
import { toast } from '@/lib/toast';

interface Message {
  _id: string;
  conversationId: string;
  senderId: string;
  recipientId: string;
  content: string;
  isRead: boolean;
  createdAt: string;
}

interface TypingUser {
  userId: string;
  userName: string;
  conversationId: string;
}

interface UseMessageSocketOptions {
  onMessageReceived?: (message: Message) => void;
  onMessageSent?: (message: Message) => void;
  onUserTyping?: (data: TypingUser) => void;
  onUserStoppedTyping?: (userId: string) => void;
  onUserOnline?: (userId: string) => void;
  onUserOffline?: (userId: string) => void;
}

export function useMessageSocket(options: UseMessageSocketOptions = {}) {
  const user = useAuthStore((state) => state.user);
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());

  // Connect to Socket.io server
  useEffect(() => {
    if (!user?._id) return;

    const socket = io('http://localhost:3008', {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('✅ Socket connected:', socket.id);
      setIsConnected(true);
      
      // Join as user
      socket.emit('user:join', user._id);
    });

    socket.on('disconnect', () => {
      console.log('❌ Socket disconnected');
      setIsConnected(false);
    });

    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      setIsConnected(false);
    });

    // Message received
    socket.on('message:received', ({ message }: { message: Message }) => {
      console.log('📩 Message received:', message);
      options.onMessageReceived?.(message);
      
      // Show toast notification
      toast.info('پیام جدید دریافت شد');
    });

    // Message sent confirmation
    socket.on('message:sent', ({ message }: { message: Message }) => {
      console.log('✅ Message sent:', message);
      options.onMessageSent?.(message);
    });

    // Message error
    socket.on('message:error', ({ error }: { error: string }) => {
      console.error('Message error:', error);
      toast.error('خطا در ارسال پیام');
    });

    // Typing indicators
    socket.on('user:typing', (data: TypingUser) => {
      console.log('⌨️ User typing:', data);
      options.onUserTyping?.(data);
    });

    socket.on('user:stopped-typing', ({ userId }: { userId: string }) => {
      options.onUserStoppedTyping?.(userId);
    });

    // Online/Offline status
    socket.on('user:online', ({ userId }: { userId: string }) => {
      setOnlineUsers(prev => new Set(prev).add(userId));
      options.onUserOnline?.(userId);
    });

    socket.on('user:offline', ({ userId }: { userId: string }) => {
      setOnlineUsers(prev => {
        const newSet = new Set(prev);
        newSet.delete(userId);
        return newSet;
      });
      options.onUserOffline?.(userId);
    });

    // Cleanup on unmount
    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?._id]); // فقط user._id - callbacks از options استفاده می‌شوند بدون نیاز به dependency

  // Send message
  const sendMessage = useCallback((data: {
    conversationId: string;
    recipientId: string;
    content: string;
  }) => {
    if (!socketRef.current || !user?._id) {
      console.error('Socket not connected or user not logged in');
      return;
    }

    socketRef.current.emit('message:send', {
      ...data,
      senderId: user._id,
    });
  }, [user?._id]);

  // Start typing
  const startTyping = useCallback((conversationId: string) => {
    if (!socketRef.current || !user) return;

    socketRef.current.emit('typing:start', {
      conversationId,
      userId: user._id,
      userName: user.email || 'کاربر',
    });
  }, [user]);

  // Stop typing
  const stopTyping = useCallback((conversationId: string) => {
    if (!socketRef.current || !user) return;

    socketRef.current.emit('typing:stop', {
      conversationId,
      userId: user._id,
      userName: user.email || 'کاربر',
    });
  }, [user]);

  // Join conversation
  const joinConversation = useCallback((conversationId: string) => {
    if (!socketRef.current) return;
    socketRef.current.emit('conversation:join', conversationId);
  }, []);

  // Leave conversation
  const leaveConversation = useCallback((conversationId: string) => {
    if (!socketRef.current) return;
    socketRef.current.emit('conversation:leave', conversationId);
  }, []);

  // Mark message as read
  const markAsRead = useCallback((messageId: string) => {
    if (!socketRef.current) return;
    socketRef.current.emit('message:read', messageId);
  }, []);

  // Check if user is online
  const isUserOnline = useCallback((userId: string) => {
    return onlineUsers.has(userId);
  }, [onlineUsers]);

  return {
    isConnected,
    onlineUsers: Array.from(onlineUsers),
    sendMessage,
    startTyping,
    stopTyping,
    joinConversation,
    leaveConversation,
    markAsRead,
    isUserOnline,
    socket: socketRef.current,
  };
}
