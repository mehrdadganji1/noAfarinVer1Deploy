import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '@/store/authStore';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
});

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within SocketProvider');
  }
  return context;
};

interface SocketProviderProps {
  children: ReactNode;
}

export function SocketProvider({ children }: SocketProviderProps) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const { user, token } = useAuthStore();

  useEffect(() => {
    console.log('🔌 SocketContext effect triggered:', {
      hasToken: !!token,
      hasUser: !!user,
      hasSocket: !!socket
    })

    if (!token || !user) {
      console.log('⚠️ No token or user, disconnecting socket')
      if (socket) {
        socket.disconnect();
        setSocket(null);
        setIsConnected(false);
      }
      return;
    }

    console.log('🔌 Creating new socket connection...')
    const newSocket = io(import.meta.env.VITE_API_URL || 'http://localhost:3002', {
      auth: { token },
      transports: ['websocket', 'polling'],
      path: '/socket.io',
    });

    newSocket.on('connect', () => {
      console.log('✅ Socket.io connected');
      setIsConnected(true);
    });

    newSocket.on('disconnect', () => {
      console.log('❌ Socket.io disconnected');
      setIsConnected(false);
    });

    newSocket.on('connect_error', (error) => {
      console.error('🚨 Socket connection error:', error);
      setIsConnected(false);
    });

    setSocket(newSocket);

    return () => {
      console.log('🔌 Cleaning up socket connection')
      newSocket.close();
    };
  }, [token, user]);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
}
