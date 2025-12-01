import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import eventRoutes from './routes/eventRoutes';
import trainingRoutes from './routes/trainingRoutes';
import eventApplicationRoutes from './routes/eventApplicationRoutes';
import aacoApplicationRoutes from './routes/aacoApplicationRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3005;

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('combined'));

mongoose.connect(process.env.MONGODB_URI!)
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.error('❌ MongoDB error:', err));

app.get('/health', (req, res) => {
  res.json({ success: true, message: 'Event Service is running' });
});

app.use('/api/events', eventRoutes);
app.use('/api/trainings', trainingRoutes);
app.use('/api', eventApplicationRoutes); // Event applications routes
app.use('/api/aaco-applications', aacoApplicationRoutes); // AACo applications routes

// Prevent multiple instances
let isServerRunning = false;

const server = app.listen(PORT, () => {
  if (isServerRunning) {
    console.log('⚠️  Server already running, skipping...');
    return;
  }
  isServerRunning = true;
  console.log(`🚀 Event Service running on port ${PORT}`);
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

// Graceful shutdown
const gracefulShutdown = async (signal: string) => {
  if (!isServerRunning) return;
  console.log(`\n⚠️  ${signal} received. Shutting down...`);
  isServerRunning = false;
  
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

  setTimeout(() => {
    console.error('⚠️  Forced shutdown');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
