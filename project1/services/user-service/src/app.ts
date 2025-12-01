import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';

import authRoutes from './routes/authRoutes';
import mobileAuthRoutes from './routes/mobileAuthRoutes';
import userRoutes from './routes/userRoutes';
import roleRoutes from './routes/roleRoutes';
import applicationRoutes from './routes/applicationRoutes';
import notificationRoutes from './routes/notificationRoutes';
import profileRoutes from './routes/profileRoutes';
import activityRoutes from './routes/activityRoutes';
import membershipRoutes from './routes/membershipRoutes';
import communityRoutes from './routes/communityRoutes';
import seedRoutes from './routes/seedRoutes';
import statsRoutes from './routes/statsRoutes';
import directorRoutes from './routes/directorRoutes';
import clubMemberDashboardRoutes from './routes/clubMemberDashboardRoutes';

const app: Application = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' })); // Increase limit for base64 images
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files (uploaded avatars)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Only use morgan in non-test environment
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('combined'));
}

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'User Service is running',
    timestamp: new Date().toISOString(),
  });
});

// Routes (with /api prefix for gateway compatibility)
app.use('/api/auth', authRoutes);
app.use('/api/mobile-auth', mobileAuthRoutes);
app.use('/api/users', userRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/membership', membershipRoutes);
app.use('/api/community', communityRoutes);
app.use('/api/seed', seedRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/director', directorRoutes);
app.use('/api/club-member/dashboard', clubMemberDashboardRoutes);

// Legacy routes (backward compatibility)
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/roles', roleRoutes);
app.use('/applications', applicationRoutes);
app.use('/notifications', notificationRoutes);
app.use('/profile', profileRoutes);
app.use('/activities', activityRoutes);
app.use('/membership', membershipRoutes);
app.use('/community', communityRoutes);
app.use('/stats', statsRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
  });
});

export default app;
