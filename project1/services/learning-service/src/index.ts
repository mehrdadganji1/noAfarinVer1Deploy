import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import resourceRoutes from './routes/resourceRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3013;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/resources', resourceRoutes);

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'learning-service' });
});

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/learning_db';

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB (Learning Service)');
    app.listen(PORT, () => {
      console.log(`🚀 Learning Service running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  });

export default app;
