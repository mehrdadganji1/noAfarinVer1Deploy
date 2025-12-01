import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import fundingRoutes from './routes/fundingRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3008;

app.use(helmet());
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI!)
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.error('❌ MongoDB error:', err));

app.get('/health', (req, res) => {
  res.json({ success: true, message: 'Funding Service is running' });
});

app.use('/api/fundings', fundingRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Funding Service running on port ${PORT}`);
});
