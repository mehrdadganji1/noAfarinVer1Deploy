import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';
import { createServer } from 'http';
import app from './app';
import socketManager from './socket/socketManager';

// Load environment variables from .env file
const envPath = path.resolve(__dirname, '../.env');
const result = dotenv.config({ path: envPath });

if (result.error) {
  console.error('❌ Error loading .env file:', result.error);
  console.error(`   Tried path: ${envPath}`);
} else {
  console.log(`✅ Loaded .env from: ${envPath}`);
}

// Debug: Check if critical env vars are loaded
console.log('🔍 Environment Variables Check:');
console.log(`   NODE_ENV: ${process.env.NODE_ENV}`);
console.log(`   PORT: ${process.env.PORT}`);
console.log(`   SMTP_USER: ${process.env.SMTP_USER ? '✅ Set' : '❌ Missing'}`);
console.log(`   SMTP_PASS: ${process.env.SMTP_PASS ? '✅ Set (' + process.env.SMTP_PASS.substring(0, 4) + '...)' : '❌ Missing'}`);
console.log(`   EMAIL_ENABLED: ${process.env.EMAIL_ENABLED}`);
console.log(`   EMAIL_SILENT_FAIL: ${process.env.EMAIL_SILENT_FAIL}`);
console.log('');

const PORT = process.env.PORT || 3001;

// Database connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI!, {
      maxPoolSize: 10,
      minPoolSize: 5,
    });
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

// Prevent multiple instances
let isServerRunning = false;

// Start server
const startServer = async () => {
  if (isServerRunning) {
    console.log('⚠️  Server is already running, skipping...');
    return;
  }
  
  isServerRunning = true;
  
  await connectDB();
  
  // Create HTTP server
  const httpServer = createServer(app);
  
  // Initialize Socket.io
  socketManager.init(httpServer);
  
  // Start listening with error handling
  const server = httpServer.listen(PORT, () => {
    console.log(`🚀 User Service is running on port ${PORT}`);
    console.log(`🔌 Socket.io enabled for real-time notifications`);
  }).on('error', (err: NodeJS.ErrnoException) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`❌ Port ${PORT} is already in use!`);
      console.error(`   Please run: taskkill /F /IM node.exe`);
      isServerRunning = false;
      process.exit(1);
    } else {
      console.error('❌ Server error:', err);
      isServerRunning = false;
      process.exit(1);
    }
  });

  // Graceful shutdown
  const gracefulShutdown = async (signal: string) => {
    if (!isServerRunning) return;
    
    console.log(`\n⚠️  ${signal} received. Starting graceful shutdown...`);
    isServerRunning = false;
    
    server.close(async () => {
      console.log('✅ HTTP server closed');
      
      try {
        await mongoose.connection.close();
        console.log('✅ MongoDB connection closed');
        process.exit(0);
      } catch (error) {
        console.error('❌ Error during shutdown:', error);
        process.exit(1);
      }
    });

    // Force shutdown after 10 seconds
    setTimeout(() => {
      console.error('⚠️  Forced shutdown after timeout');
      process.exit(1);
    }, 10000);
  };

  // Handle shutdown signals
  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
  process.on('SIGINT', () => gracefulShutdown('SIGINT'));
  
  // Handle uncaught exceptions
  process.on('uncaughtException', (error) => {
    console.error('❌ Uncaught Exception:', error);
    gracefulShutdown('UNCAUGHT_EXCEPTION');
  });
};

startServer();
