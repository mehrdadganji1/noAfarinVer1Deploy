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

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB (Achievement Service)');
    app.listen(PORT, () => {
      console.log(`🚀 Achievement Service running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  });

export default app;
