import { Server as SocketIOServer } from 'socket.io';
import { Server as HTTPServer } from 'http';
import jwt from 'jsonwebtoken';

interface SocketUser {
  id: string;
  email: string;
  role: string;
}

export function setupSocketIO(httpServer: HTTPServer) {
  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: process.env.FRONTEND_URL || 'http://localhost:5173',
      credentials: true,
    },
    path: '/socket.io',
  });

  // Authentication middleware
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;

    if (!token) {
      return next(new Error('Authentication error: No token provided'));
    }

    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production'
      ) as SocketUser;

      socket.data.user = decoded;
      next();
    } catch (error) {
      next(new Error('Authentication error: Invalid token'));
    }
  });

  // Connection handler
  io.on('connection', (socket) => {
    const user = socket.data.user as SocketUser;
    console.log(`✅ User connected: ${user.email} (${socket.id})`);

    // Join user-specific room
    const userRoom = `user:${user.id}`;
    socket.join(userRoom);
    console.log(`👤 User ${user.email} joined room: ${userRoom}`);

    // Handle join event (optional, for explicit room joining)
    socket.on('join', (data: { userId: string }) => {
      const room = `user:${data.userId}`;
      socket.join(room);
      console.log(`📥 User joined room: ${room}`);
    });

    // Handle notification read
    socket.on('notification:read', (data: { notificationId: string }) => {
      console.log(`📖 Notification read: ${data.notificationId}`);
      // Broadcast to user's other devices
      socket.to(userRoom).emit('notification:updated', {
        notificationId: data.notificationId,
        isRead: true,
      });
    });

    // Handle notification delete
    socket.on('notification:delete', (data: { notificationId: string }) => {
      console.log(`🗑️ Notification deleted: ${data.notificationId}`);
      // Broadcast to user's other devices
      socket.to(userRoom).emit('notification:deleted', {
        notificationId: data.notificationId,
      });
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      console.log(`❌ User disconnected: ${user.email} (${socket.id})`);
    });

    // Handle errors
    socket.on('error', (error) => {
      console.error(`⚠️ Socket error for ${user.email}:`, error);
    });
  });

  // Helper function to send notification to specific user
  const sendNotificationToUser = (userId: string, notification: any) => {
    const room = `user:${userId}`;
    io.to(room).emit('notification:new', notification);
    console.log(`📨 Notification sent to user ${userId}`);
  };

  // Helper function to send achievement unlock notification
  const sendAchievementUnlock = (userId: string, achievement: any) => {
    const room = `user:${userId}`;
    io.to(room).emit('achievement:unlocked', achievement);
    console.log(`🏆 Achievement unlock sent to user ${userId}`);
  };

  // Helper function to broadcast to all users
  const broadcastToAll = (event: string, data: any) => {
    io.emit(event, data);
    console.log(`📢 Broadcast: ${event}`);
  };

  console.log('✅ Socket.IO server initialized');

  return {
    io,
    sendNotificationToUser,
    sendAchievementUnlock,
    broadcastToAll,
  };
}
