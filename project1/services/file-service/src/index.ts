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

// Prevent multiple instances
let isServerRunning = false;
let server: any;

// Start server
const startServer = async () => {
  await connectDB();
  
  server = app.listen(PORT, () => {
    if (isServerRunning) {
      console.log('⚠️  Server already running, skipping...');
      return;
    }
    isServerRunning = true;
    console.log(`🚀 File Service is running on port ${PORT}`);
  }).on('error', (err: NodeJS.ErrnoException) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`❌ Port ${PORT} is already in use!`);
      process.exit(1);
    } else {
      console.error('❌ Server error:', err);
      process.exit(1);
    }
  });
};

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

startServer();
