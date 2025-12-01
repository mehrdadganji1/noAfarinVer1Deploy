import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import projectRoutes from './routes/projectRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3010;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('combined'));

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI!)
  .then(() => console.log('✅ MongoDB connected - Project Service'))
  .catch((err) => console.error('❌ MongoDB error:', err));

// Health check
app.get('/health', (req, res) => {
  res.json({ success: true, message: 'Project Service is running', timestamp: new Date() });
});

// Routes
app.use('/api', projectRoutes);

// Error handling
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'خطای سرور',
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Project Service running on port ${PORT}`);
});
