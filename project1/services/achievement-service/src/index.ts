import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import achievementRoutes from './routes/achievementRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3012;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'achievement-service' });
});

// Routes - Mount at /api, routes will handle /achievements
app.use('/api', achievementRoutes);

// MongoDB Connection
const MONGODB_URI =
  process.env.MONGODB_URI || 'mongodb://localhost:27017/noafarin-achievements';

// Prevent multiple instances
let isServerRunning = false;
let server: any;

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB (Achievement Service)');
    server = app.listen(PORT, () => {
      if (isServerRunning) {
        console.log('⚠️  Server already running, skipping...');
        return;
      }
      isServerRunning = true;
      console.log(`🚀 Achievement Service running on port ${PORT}`);
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
