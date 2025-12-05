import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import courseRoutes from './routes/courseRoutes';
import trainingRoutes from './routes/trainingRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3005;

app.use(helmet());
app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ success: true, message: 'Training/Course Service is running' });
});

app.use('/api', courseRoutes);
app.use('/api', trainingRoutes);

// Prevent multiple instances
let isServerRunning = false;
let server: any;

mongoose.connect(process.env.MONGODB_URI!)
  .then(() => {
    console.log('✅ MongoDB connected');
    server = app.listen(PORT, () => {
      if (isServerRunning) {
        console.log('⚠️  Server already running, skipping...');
        return;
      }
      isServerRunning = true;
      console.log(`🚀 Training Service running on port ${PORT}`);
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
  .catch((err) => {
    console.error('❌ MongoDB error:', err);
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
