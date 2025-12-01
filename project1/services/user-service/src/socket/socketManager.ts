import { Server as SocketIOServer } from 'socket.io';
import { Server as HTTPServer } from 'http';
import jwt from 'jsonwebtoken';

/**
 * Socket Manager for handling real-time connections
 */
class SocketManager {
  private io: SocketIOServer | null = null;
  private userSockets: Map<string, string> = new Map(); // userId -> socketId

  /**
   * Initialize Socket.io server
   */
  init(server: HTTPServer): void {
    this.io = new SocketIOServer(server, {
      cors: {
        origin: process.env.FRONTEND_URL || 'http://localhost:5173',
        credentials: true,
        methods: ['GET', 'POST'],
      },
    });

    // Authentication middleware
    this.io.use((socket, next) => {
      const token = socket.handshake.auth.token;
      
      if (!token) {
        console.log('❌ Socket connection rejected: No token provided');
        return next(new Error('Authentication error: No token provided'));
      }

      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
        socket.data.userId = decoded.id;
        socket.data.user = decoded;
        console.log(`✅ Socket authenticated for user: ${decoded.id}`);
        next();
      } catch (err) {
        console.log('❌ Socket connection rejected: Invalid token');
        return next(new Error('Authentication error: Invalid token'));
      }
    });

    // Connection handler
    this.io.on('connection', (socket) => {
      const userId = socket.data.userId;
      this.userSockets.set(userId, socket.id);
      
      console.log(`🔌 User ${userId} connected (Socket ID: ${socket.id})`);
      console.log(`📊 Total connected users: ${this.userSockets.size}`);

      // Handle disconnection
      socket.on('disconnect', (reason) => {
        this.userSockets.delete(userId);
        console.log(`🔌 User ${userId} disconnected (Reason: ${reason})`);
        console.log(`📊 Total connected users: ${this.userSockets.size}`);
      });

      // Handle mark notification as read
      socket.on('mark-read', (notificationId: string) => {
        console.log(`📖 User ${userId} marked notification ${notificationId} as read`);
        // This will be handled by REST API, but we can track it here
      });

      // Handle mark all as read
      socket.on('mark-all-read', () => {
        console.log(`📖 User ${userId} marked all notifications as read`);
      });

      // Send welcome message
      socket.emit('connected', {
        message: 'Successfully connected to notification service',
        userId,
      });
    });

    console.log('🚀 Socket.io server initialized');
  }

  /**
   * Send notification to a specific user
   */
  sendNotification(userId: string, notification: any): boolean {
    if (!this.io) {
      console.error('❌ Socket.io not initialized');
      return false;
    }

    const socketId = this.userSockets.get(userId.toString());
    
    if (socketId) {
      this.io.to(socketId).emit('notification', notification);
      console.log(`✉️ Notification sent to user ${userId} (Socket: ${socketId})`);
      return true;
    } else {
      console.log(`⚠️ User ${userId} is not connected (notification saved to DB only)`);
      return false;
    }
  }

  /**
   * Send notification to multiple users
   */
  sendNotificationToMultiple(userIds: string[], notification: any): void {
    if (!this.io) {
      console.error('❌ Socket.io not initialized');
      return;
    }

    let sentCount = 0;
    userIds.forEach((userId) => {
      if (this.sendNotification(userId, notification)) {
        sentCount++;
      }
    });

    console.log(`📨 Sent notification to ${sentCount}/${userIds.length} online users`);
  }

  /**
   * Broadcast notification to all connected users
   */
  broadcast(notification: any): void {
    if (!this.io) {
      console.error('❌ Socket.io not initialized');
      return;
    }

    this.io.emit('notification', notification);
    console.log(`📢 Broadcast notification to all ${this.userSockets.size} connected users`);
  }

  /**
   * Check if user is online
   */
  isUserOnline(userId: string): boolean {
    return this.userSockets.has(userId.toString());
  }

  /**
   * Get number of connected users
   */
  getConnectedUsersCount(): number {
    return this.userSockets.size;
  }

  /**
   * Get all connected user IDs
   */
  getConnectedUserIds(): string[] {
    return Array.from(this.userSockets.keys());
  }

  /**
   * Disconnect a specific user
   */
  disconnectUser(userId: string): void {
    const socketId = this.userSockets.get(userId.toString());
    if (socketId && this.io) {
      const socket = this.io.sockets.sockets.get(socketId);
      if (socket) {
        socket.disconnect(true);
        console.log(`🔌 Force disconnected user ${userId}`);
      }
    }
  }

  /**
   * Get Socket.io instance
   */
  getIO(): SocketIOServer | null {
    return this.io;
  }

  /**
   * Emit activity event to all connected users
   */
  emitActivity(event: string, data: any): void {
    if (!this.io) {
      console.error('❌ Socket.io not initialized');
      return;
    }

    this.io.emit(event, data);
    console.log(`📡 Activity event emitted: ${event}`);
  }

  /**
   * Emit activity event to specific user
   */
  emitActivityToUser(userId: string, event: string, data: any): void {
    if (!this.io) {
      console.error('❌ Socket.io not initialized');
      return;
    }

    const socketId = this.userSockets.get(userId.toString());
    
    if (socketId) {
      this.io.to(socketId).emit(event, data);
      console.log(`📡 Activity event sent to user ${userId}: ${event}`);
    }
  }

  /**
   * Emit activity event to multiple users
   */
  emitActivityToMultiple(userIds: string[], event: string, data: any): void {
    if (!this.io) {
      console.error('❌ Socket.io not initialized');
      return;
    }

    userIds.forEach((userId) => {
      this.emitActivityToUser(userId, event, data);
    });
  }
}

// Export singleton instance
export default new SocketManager();
