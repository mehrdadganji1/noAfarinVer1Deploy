import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { createServer } from 'http';
import app from './app';
// TODO: Implement message socket
// import { setupMessageSocket } from './socket/messageSocket';

// Load environment variables
dotenv.config();
console.log('✅ Loaded environment variables');
console.log('🔍 Environment check:');
console.log(`   NODE_ENV: ${process.env.NODE_ENV}`);
console.log(`   PORT: ${process.env.PORT}`);
console.log(`   MONGODB_URI: ${process.env.MONGODB_URI ? '✅ Set' : '❌ Not set'}`);
console.log(`   JWT_SECRET: ${process.env.JWT_SECRET ? '✅ Set' : '❌ Not set'}`);

const PORT = process.env.PORT || 3008;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/noafarin_application';

// Create HTTP server (needed for Socket.io)
const httpServer = createServer(app);

// Prevent multiple instances
let isServerRunning = false;
let server: any;

// MongoDB connection
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    console.log(`📊 Database: ${MONGODB_URI}`);

    // TODO: Setup Socket.io for real-time messaging
    // setupMessageSocket(httpServer);

    // Start server
    server = httpServer.listen(PORT, () => {
      if (isServerRunning) {
        console.log('⚠️  Server already running, skipping...');
        return;
      }
      isServerRunning = true;
      console.log(`🚀 Application Service running on port ${PORT}`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🔗 Health check: http://localhost:${PORT}/health`);
      console.log(`📋 Interview API ready`);
    }).on('error', (err: NodeJS.ErrnoException) => {
      if (err.code === 'EADDRINUSE') {
        console.error(`❌ Port ${PORT} is already in use!`);
        console.error(`   Run: taskkill /F /IM node.exe`);
        process.exit(1);
      } else {
        console.error('❌ Server error:', err);
        process.exit(1);
      }
    });
  })
  .catch((error: any) => {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  });

// Graceful shutdown
const gracefulShutdown = async (signal: string) => {
  if (!isServerRunning) return;
  console.log(`\n⚠️  ${signal} received. Shutting down...`);
  isServerRunning = false;

  if (server) {
    server.close(async () => {
      console.log('✅ HTTP server closed');
      try {
        await mongoose.connection.close();
        console.log('✅ MongoDB closed');
        process.exit(0);
      } catch (error) {
        console.error('❌ Shutdown error:', error);
        process.exit(1);
      }
    });
  } else {
    await mongoose.connection.close();
    process.exit(0);
  }

  setTimeout(() => {
    console.error('⚠️  Forced shutdown');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
