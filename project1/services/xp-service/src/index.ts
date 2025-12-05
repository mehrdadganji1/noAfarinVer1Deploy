import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import xpRoutes from './routes/xpRoutes';
import webhookRoutes from './routes/webhookRoutes';
import streakRoutes from './routes/streakRoutes';
import challengeRoutes from './routes/challengeRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3011;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/noafarin-xp';

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({
    success: true,
    service: 'XP Service',
    status: 'healthy',
    timestamp: new Date().toISOString(),
  });
});

// Routes
app.use('/api/xp', xpRoutes);
app.use('/api/xp/webhooks', webhookRoutes);
app.use('/api/streaks', streakRoutes);
app.use('/api/challenges', challengeRoutes);

// Error handling
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    error: err.message || 'خطای سرور',
  });
});

// Prevent multiple instances
let isServerRunning = false;
let server: any;

// Connect to MongoDB and start server
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB (XP Service)');
    server = app.listen(PORT, () => {
      if (isServerRunning) {
        console.log('⚠️  Server already running, skipping...');
        return;
      }
      isServerRunning = true;
      console.log(`🚀 XP Service running on port ${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/health`);
      console.log(`🎮 XP API: http://localhost:${PORT}/api/xp`);
    }).on('error', (err: NodeJS.ErrnoException) => {
      if (err.code === 'EADDRINUSE') {
        console.error(`❌ Port ${PORT} is already in use!`);
        process.exit(1);
      } else {
        console.error('❌ Server error:', err);
        process.exit(1);
      }
    });
  })
  .catch((error) => {
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

export default app;
