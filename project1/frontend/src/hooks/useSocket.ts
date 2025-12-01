import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '@/store/authStore';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from '@/components/ui/toast';

const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:3002';

interface NotificationPayload {
  _id?: string;
  type: string;
  priority: string;
  title: string;
  message: string;
  link?: string;
  metadata?: Record<string, any>;
  isRead: boolean;
  createdAt: Date;
}

/**
 * Hook for managing Socket.io connection and real-time notifications
 */
export function useSocket() {
  const socketRef = useRef<Socket | null>(null);
  const hasConnected = useRef(false);
  const [isConnected, setIsConnected] = useState(false);
  
  const token = localStorage.getItem('token');
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const queryClient = useQueryClient();

  useEffect(() => {
    // Only connect if user is authenticated
    if (!isAuthenticated || !token) {
      if (socketRef.current) {
        console.log('🔌 Disconnecting socket (user not authenticated)');
        socketRef.current.disconnect();
        socketRef.current = null;
        hasConnected.current = false;
        setIsConnected(false);
      }
      return;
    }

    // Prevent duplicate connections in StrictMode
    if (hasConnected.current && socketRef.current) {
      console.log('⚠️ Socket already connected, skipping duplicate');
      return;
    }

    // Create socket connection
    console.log('🔌 Initializing socket connection...');
    hasConnected.current = true;
    socketRef.current = io(SOCKET_URL, {
      auth: { token },
      transports: ['websocket', 'polling'],
    });

    // Connection events
    socketRef.current.on('connect', () => {
      console.log('✅ Socket connected:', socketRef.current?.id);
      setIsConnected(true);
    });

    socketRef.current.on('connected', (data) => {
      console.log('✅ Received connection confirmation:', data);
    });

    socketRef.current.on('disconnect', (reason) => {
      console.log('🔌 Socket disconnected:', reason);
      setIsConnected(false);
    });

    socketRef.current.on('connect_error', (error) => {
      console.error('❌ Socket connection error:', error);
      setIsConnected(false);
    });

    // Notification event
    socketRef.current.on('notification', (notification: NotificationPayload) => {
      console.log('🔔 New notification received:', notification);
      
      // Invalidate notifications query to refresh the list
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['unread-count'] });
      
      // Show toast for high priority notifications
      if (notification.priority === 'HIGH' || notification.priority === 'URGENT') {
        toast.success(`${notification.title}: ${notification.message}`);
      } else {
        // Show subtle notification for normal priority
        toast.info(`${notification.title}: ${notification.message}`);
      }

      // Play sound (optional)
      // playNotificationSound();
    });

    // Cleanup on unmount
    return () => {
      if (socketRef.current) {
        // Silent cleanup - no logging to avoid noise in StrictMode
        socketRef.current.disconnect();
        socketRef.current = null;
        hasConnected.current = false;
      }
    };
  }, [isAuthenticated, token, queryClient]);

  // Helper function to emit events
  const emit = (event: string, data?: any) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit(event, data);
    } else {
      console.warn('⚠️ Socket not connected, cannot emit:', event);
    }
  };

  return {
    socket: socketRef.current,
    isConnected,
    emit,
  };
}
