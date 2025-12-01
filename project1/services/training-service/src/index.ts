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

mongoose.connect(process.env.MONGODB_URI!)
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.error('❌ MongoDB error:', err));

app.get('/health', (req, res) => {
  res.json({ success: true, message: 'Training/Course Service is running' });
});

app.use('/api', courseRoutes);
app.use('/api', trainingRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Training Service running on port ${PORT}`);
});
