import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import projectRoutes from './routes/projectRoutes';
import teamRoutes from './routes/teamRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('combined'));

mongoose.connect(process.env.MONGODB_URI!)
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.error('❌ MongoDB error:', err));

app.get('/health', (req, res) => {
  res.json({ success: true, message: 'Team/Project Service is running' });
});

app.use('/api/projects', projectRoutes);
app.use('/api/teams', teamRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Team Service running on port ${PORT}`);
});
