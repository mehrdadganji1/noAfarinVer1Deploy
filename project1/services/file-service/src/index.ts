import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';

import fileRoutes from './routes/fileRoutes';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3007;

// Middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  contentSecurityPolicy: false,
}));
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, or file://)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'http://localhost:5173', 
      'http://localhost:3000',
      'null' // for file:// protocol
    ];
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(null, true); // Allow all in development
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(morgan('combined'));

// Don't use body parsers globally - they interfere with multipart/form-data
// If needed, add them to specific routes only

// Serve static files (uploads)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Database connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI!, {
      maxPoolSize: 10,
      minPoolSize: 5,
    });
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

// Routes
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'File Service is running',
    timestamp: new Date().toISOString(),
  });
});

// Debug endpoint
app.post('/api/files/test', (req, res) => {
  console.log('Test endpoint hit!');
  console.log('Headers:', req.headers);
  console.log('Body:', req.body);
  res.status(200).json({
    success: true,
    message: 'Test endpoint working',
    headers: req.headers,
  });
});

app.use('/api/files', fileRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
  });
});

// Error handler
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    error: err.message || 'Internal server error',
  });
});

// Start server
const startServer = async () => {
  await connectDB();
  
  app.listen(PORT, () => {
    console.log(`🚀 File Service is running on port ${PORT}`);
  });
};

startServer();
