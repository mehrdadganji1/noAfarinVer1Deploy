import { Server as SocketIOServer, Socket } from 'socket.io';
import { Server as HTTPServer } from 'http';
import Message from '../models/Message';

interface TypingData {
  conversationId: string;
  userId: string;
  userName: string;
}

interface MessageData {
  conversationId: string;
  senderId: string;
  recipientId: string;
  content: string;
}

export function setupMessageSocket(httpServer: HTTPServer) {
  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: ['http://localhost:5173', 'http://localhost:3000'],
      methods: ['GET', 'POST'],
      credentials: true,
    },
    path: '/socket.io',
  });

  // Store online users
  const onlineUsers = new Map<string, string>(); // userId -> socketId

  io.on('connection', (socket: Socket) => {
    console.log(`✅ Socket connected: ${socket.id}`);

    // User joins
    socket.on('user:join', (userId: string) => {
      onlineUsers.set(userId, socket.id);
      socket.join(`user:${userId}`);
      
      console.log(`👤 User ${userId} joined (socket: ${socket.id})`);
      
      // Broadcast user online status
      io.emit('user:online', { userId, socketId: socket.id });
    });

    // User typing
    socket.on('typing:start', (data: TypingData) => {
      // Broadcast to conversation room except sender
      socket.to(`conversation:${data.conversationId}`).emit('user:typing', {
        userId: data.userId,
        userName: data.userName,
        conversationId: data.conversationId,
      });
    });

    socket.on('typing:stop', (data: TypingData) => {
      socket.to(`conversation:${data.conversationId}`).emit('user:stopped-typing', {
        userId: data.userId,
        conversationId: data.conversationId,
      });
    });

    // Send message
    socket.on('message:send', async (data: MessageData) => {
      try {
        // Save message to database
        const message = new Message({
          conversationId: data.conversationId,
          senderId: data.senderId,
          recipientId: data.recipientId,
          content: data.content,
          isRead: false,
          createdAt: new Date(),
        });

        await message.save();

        // Broadcast to recipient
        const recipientSocketId = onlineUsers.get(data.recipientId);
        if (recipientSocketId) {
          io.to(recipientSocketId).emit('message:received', {
            message: message.toObject(),
          });
        }

        // Send confirmation to sender
        socket.emit('message:sent', {
          message: message.toObject(),
          tempId: data.conversationId, // For optimistic updates
        });

        console.log(`📨 Message sent from ${data.senderId} to ${data.recipientId}`);
      } catch (error) {
        console.error('Error sending message:', error);
        socket.emit('message:error', { error: 'Failed to send message' });
      }
    });

    // Mark message as read
    socket.on('message:read', async (messageId: string) => {
      try {
        await Message.findByIdAndUpdate(messageId, { isRead: true });
        
        // Notify sender
        const message = await Message.findById(messageId);
        if (message) {
          const senderSocketId = onlineUsers.get(message.senderId.toString());
          if (senderSocketId) {
            io.to(senderSocketId).emit('message:read-receipt', {
              messageId,
              readAt: new Date(),
            });
          }
        }
      } catch (error) {
        console.error('Error marking message as read:', error);
      }
    });

    // Join conversation room
    socket.on('conversation:join', (conversationId: string) => {
      socket.join(`conversation:${conversationId}`);
      console.log(`💬 Socket ${socket.id} joined conversation ${conversationId}`);
    });

    // Leave conversation room
    socket.on('conversation:leave', (conversationId: string) => {
      socket.leave(`conversation:${conversationId}`);
      console.log(`💬 Socket ${socket.id} left conversation ${conversationId}`);
    });

    // Disconnect
    socket.on('disconnect', () => {
      // Find and remove user from online users
      for (const [userId, socketId] of onlineUsers.entries()) {
        if (socketId === socket.id) {
          onlineUsers.delete(userId);
          io.emit('user:offline', { userId });
          console.log(`👤 User ${userId} disconnected`);
          break;
        }
      }
      
      console.log(`❌ Socket disconnected: ${socket.id}`);
    });
  });

  console.log('✅ Message Socket.io server initialized');
  
  return io;
}
