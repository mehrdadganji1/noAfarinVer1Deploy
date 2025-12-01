import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import achievementRoutes from './routes/achievementRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3004;

app.use(helmet());
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI!)
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.error('❌ MongoDB error:', err));

app.get('/health', (req, res) => {
  res.json({ success: true, message: 'Evaluation/Achievement Service is running' });
});

app.use('/api', achievementRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Evaluation Service running on port ${PORT}`);
});
