import express, { Application, Request, Response } from 'express';
import http from 'http';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import dotenv from 'dotenv';
import axios from 'axios';
import { createProxyMiddleware } from 'http-proxy-middleware';
import rateLimit from 'express-rate-limit';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'path';
import { setupSocketIO } from './socket';

dotenv.config();

const app: Application = express();
const httpServer = http.createServer(app);
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(compression());
app.use(morgan('combined'));

// File Service proxy MUST come BEFORE body parsers
// to handle multipart/form-data correctly
app.use(
  '/api/files',
  createProxyMiddleware({
    target: process.env.FILE_SERVICE_URL || 'http://localhost:3007',
    changeOrigin: true,
    pathRewrite: { '^/api/files': '/api/files' },
    logLevel: 'debug',
    timeout: 120000, // 2 minutes for large file uploads
    proxyTimeout: 120000,
    onProxyReq: (proxyReq: any, req: any, res: any) => {
      console.log(`[File Proxy] → ${req.method} ${req.path}`);
      console.log(`[File Proxy] → Headers:`, req.headers);
      // Copy authorization header
      if (req.headers.authorization) {
        proxyReq.setHeader('Authorization', req.headers.authorization);
      }
    },
    onProxyRes: (proxyRes: any, req: any, res: any) => {
      console.log(`[File Proxy] ← ${proxyRes.statusCode} for ${req.path}`);
      console.log(`[File Proxy] ← Response Headers:`, proxyRes.headers);

      // Log response body for debugging
      let body = '';
      proxyRes.on('data', (chunk: any) => {
        body += chunk;
      });
      proxyRes.on('end', () => {
        if (body) {
          console.log(`[File Proxy] ← Response Body:`, body.substring(0, 500));
        }
      });
    },
    onError: (err: Error, req: any, res: any) => {
      console.error('[File Proxy] Error:', err.message);
      if (!res.headersSent) {
        res.status(503).json({
          success: false,
          error: 'File Service temporarily unavailable',
        });
      }
    },
  })
);

// Body parsers (after file proxy)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting (disabled in development)
if (process.env.NODE_ENV === 'production') {
  const limiter = rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'),
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
    message: 'Too many requests from this IP, please try again later.',
  });
  app.use('/api/', limiter);
  console.log('✅ Rate limiting enabled');
} else {
  console.log('⚠️ Rate limiting disabled (development mode)');
}

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API Gateway is running',
    timestamp: new Date().toISOString(),
  });
});

// Swagger documentation
try {
  const swaggerDocument = YAML.load(path.join(__dirname, '../swagger.yaml'));
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
} catch (error) {
  console.log('Swagger documentation not available');
}

// Service proxies
const serviceProxyConfig = {
  changeOrigin: true,
  logLevel: 'debug' as const,
  timeout: 60000, // 60 seconds timeout
  proxyTimeout: 60000,
  followRedirects: true,
  onError: (err: Error, req: any, res: any) => {
    console.error('[Proxy] Error:', {
      message: err.message,
      path: req.path,
      method: req.method,
    });
    if (!res.headersSent) {
      res.status(503).json({
        success: false,
        error: 'Service temporarily unavailable',
        details: process.env.NODE_ENV === 'development' ? err.message : undefined,
      });
    }
  },
  onProxyReq: (proxyReq: any, req: any, res: any) => {
    console.log(`[Proxy] → ${req.method} ${req.path} to ${proxyReq.path}`);
    // Copy headers
    if (req.headers.authorization) {
      proxyReq.setHeader('Authorization', req.headers.authorization);
    }
  },
  onProxyRes: (proxyRes: any, req: any, res: any) => {
    console.log(`[Proxy] ← ${proxyRes.statusCode} for ${req.path}`);
  },
};

// Auth - Proxy to User Service
app.all('/api/auth/*', async (req: Request, res: Response) => {
  const targetPath = req.path; // Keep /api/auth as-is
  const targetUrl = `${process.env.USER_SERVICE_URL}${targetPath}${req.url.includes('?') ? req.url.substring(req.url.indexOf('?')) : ''}`;

  console.log(`[Auth] → ${req.method} ${targetPath}`);
  console.log(`[Auth] Target URL: ${targetUrl}`);

  try {
    const cleanHeaders: any = {};
    Object.keys(req.headers).forEach(key => {
      if (!['host', 'connection', 'content-length', 'transfer-encoding'].includes(key.toLowerCase())) {
        cleanHeaders[key] = req.headers[key];
      }
    });
    cleanHeaders['host'] = new URL(process.env.USER_SERVICE_URL!).host;

    const response = await axios({
      method: req.method,
      url: targetUrl,
      data: req.body,
      headers: cleanHeaders,
      timeout: 15000,
      validateStatus: () => true,
    });

    console.log(`[Auth] ← ${response.status}`);
    res.status(response.status).json(response.data);
  } catch (error: any) {
    console.error('[Auth Proxy Error]:', error.message);
    if (error.response) {
      res.status(error.response.status).json(error.response.data);
    } else {
      res.status(503).json({ success: false, error: 'User Service unavailable' });
    }
  }
});

// Mobile Auth - Proxy to User Service
app.all('/api/mobile-auth/*', async (req: Request, res: Response) => {
  const targetPath = req.path; // Keep /api/mobile-auth as-is
  const targetUrl = `${process.env.USER_SERVICE_URL}${targetPath}${req.url.includes('?') ? req.url.substring(req.url.indexOf('?')) : ''}`;

  console.log(`[Mobile Auth] → ${req.method} ${targetPath}`);
  console.log(`[Mobile Auth] Target URL: ${targetUrl}`);

  try {
    const cleanHeaders: any = {};
    Object.keys(req.headers).forEach(key => {
      if (!['host', 'connection', 'content-length', 'transfer-encoding'].includes(key.toLowerCase())) {
        cleanHeaders[key] = req.headers[key];
      }
    });
    cleanHeaders['host'] = new URL(process.env.USER_SERVICE_URL!).host;

    const response = await axios({
      method: req.method,
      url: targetUrl,
      data: req.body,
      headers: cleanHeaders,
      timeout: 15000,
      validateStatus: () => true,
    });

    console.log(`[Mobile Auth] ← ${response.status}`);
    res.status(response.status).json(response.data);
  } catch (error: any) {
    console.error('[Mobile Auth Proxy Error]:', error.message);
    if (error.response) {
      res.status(error.response.status).json(error.response.data);
    } else {
      res.status(503).json({ success: false, error: 'User Service unavailable' });
    }
  }
});

// Notifications - Proxy to User Service
app.all('/api/notifications*', async (req: Request, res: Response) => {
  const targetPath = req.path;
  const targetUrl = `${process.env.USER_SERVICE_URL}${targetPath}${req.url.includes('?') ? req.url.substring(req.url.indexOf('?')) : ''}`;

  console.log(`[Notifications] → ${req.method} ${targetPath}`);

  try {
    const cleanHeaders: any = {};
    Object.keys(req.headers).forEach(key => {
      if (!['host', 'connection', 'content-length', 'transfer-encoding'].includes(key.toLowerCase())) {
        cleanHeaders[key] = req.headers[key];
      }
    });
    cleanHeaders['host'] = new URL(process.env.USER_SERVICE_URL!).host;

    const response = await axios({
      method: req.method,
      url: targetUrl,
      data: req.body,
      headers: cleanHeaders,
      timeout: 15000,
      validateStatus: () => true,
    });

    console.log(`[Notifications] ← ${response.status}`);
    res.status(response.status).json(response.data);
  } catch (error: any) {
    console.error('[Notifications Proxy Error]:', error.message);
    if (error.response) {
      res.status(error.response.status).json(error.response.data);
    } else {
      res.status(503).json({ success: false, error: 'User Service unavailable' });
    }
  }
});

// Profile - Proxy to User Service
app.all('/api/profile*', async (req: Request, res: Response) => {
  const targetPath = req.path;
  const targetUrl = `${process.env.USER_SERVICE_URL}${targetPath}${req.url.includes('?') ? req.url.substring(req.url.indexOf('?')) : ''}`;

  console.log(`[Profile] → ${req.method} ${targetPath}`);
  console.log(`[Profile] Target URL: ${targetUrl}`);
  console.log(`[Profile] Body type:`, typeof req.body);
  console.log(`[Profile] Body keys:`, req.body ? Object.keys(req.body) : 'none');
  if (req.body && req.body.avatar) {
    console.log(`[Profile] Avatar length:`, req.body.avatar.length);
  }

  try {
    const cleanHeaders: any = {};
    Object.keys(req.headers).forEach(key => {
      if (!['host', 'connection', 'content-length', 'transfer-encoding'].includes(key.toLowerCase())) {
        cleanHeaders[key] = req.headers[key];
      }
    });
    cleanHeaders['host'] = new URL(process.env.USER_SERVICE_URL!).host;

    const response = await axios({
      method: req.method,
      url: targetUrl,
      data: req.body,
      headers: cleanHeaders,
      timeout: 15000,
      validateStatus: () => true,
    });

    console.log(`[Profile] ← ${response.status}`);
    if (response.status >= 400) {
      console.error(`[Profile] Error response:`, response.data);
    }
    res.status(response.status).json(response.data);
  } catch (error: any) {
    console.error('[Profile Proxy Error]:', error.message);
    console.error('[Profile Proxy Error] Stack:', error.stack);
    if (error.response) {
      console.error('[Profile Proxy Error] Response:', error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      res.status(503).json({ success: false, error: 'User Service unavailable' });
    }
  }
});

// User Service - Manual proxy for better control
app.all('/api/users*', async (req: Request, res: Response) => {
  const targetPath = req.path; // Keep /api/users path as is
  const targetUrl = `${process.env.USER_SERVICE_URL}${targetPath}${req.url.includes('?') ? req.url.substring(req.url.indexOf('?')) : ''}`;

  console.log(`[User] → ${req.method} ${targetPath}`);
  console.log(`[User] Target URL: ${targetUrl}`);

  try {
    // Remove problematic headers
    const cleanHeaders: any = {};
    Object.keys(req.headers).forEach(key => {
      if (!['host', 'connection', 'content-length', 'transfer-encoding'].includes(key.toLowerCase())) {
        cleanHeaders[key] = req.headers[key];
      }
    });
    cleanHeaders['host'] = new URL(process.env.USER_SERVICE_URL!).host;

    const response = await axios({
      method: req.method,
      url: targetUrl,
      data: req.body,
      headers: cleanHeaders,
      timeout: 15000,
      validateStatus: () => true,
    });

    console.log(`[User] ← ${response.status}`);
    res.status(response.status).json(response.data);
  } catch (error: any) {
    console.error('[User Proxy Error]:', error.message);
    if (error.response) {
      res.status(error.response.status).json(error.response.data);
    } else {
      res.status(503).json({ success: false, error: 'User Service unavailable' });
    }
  }
});

// Roles - Proxy to User Service
app.all('/api/roles*', async (req: Request, res: Response) => {
  const targetPath = req.path;
  const targetUrl = `${process.env.USER_SERVICE_URL}${targetPath}${req.url.includes('?') ? req.url.substring(req.url.indexOf('?')) : ''}`;

  console.log(`[Roles] → ${req.method} ${targetPath}`);

  try {
    const cleanHeaders: any = {};
    Object.keys(req.headers).forEach(key => {
      if (!['host', 'connection', 'content-length', 'transfer-encoding'].includes(key.toLowerCase())) {
        cleanHeaders[key] = req.headers[key];
      }
    });
    cleanHeaders['host'] = new URL(process.env.USER_SERVICE_URL!).host;

    const response = await axios({
      method: req.method,
      url: targetUrl,
      data: req.body,
      headers: cleanHeaders,
      timeout: 15000,
      validateStatus: () => true,
    });

    console.log(`[Roles] ← ${response.status}`);
    res.status(response.status).json(response.data);
  } catch (error: any) {
    console.error('[Roles Proxy Error]:', error.message);
    if (error.response) {
      res.status(error.response.status).json(error.response.data);
    } else {
      res.status(503).json({ success: false, error: 'User Service unavailable' });
    }
  }
});

// Users without /api prefix - Proxy to User Service
app.all('/users*', async (req: Request, res: Response) => {
  const targetPath = `/api${req.path}`; // Add /api prefix
  const targetUrl = `${process.env.USER_SERVICE_URL}${targetPath}${req.url.includes('?') ? req.url.substring(req.url.indexOf('?')) : ''}`;

  console.log(`[User-NoAPI] → ${req.method} ${req.path} => ${targetPath}`);
  console.log(`[User-NoAPI] Target URL: ${targetUrl}`);

  try {
    const cleanHeaders: any = {};
    Object.keys(req.headers).forEach(key => {
      if (!['host', 'connection', 'content-length', 'transfer-encoding'].includes(key.toLowerCase())) {
        cleanHeaders[key] = req.headers[key];
      }
    });
    cleanHeaders['host'] = new URL(process.env.USER_SERVICE_URL!).host;

    const response = await axios({
      method: req.method,
      url: targetUrl,
      data: req.body,
      headers: cleanHeaders,
      timeout: 15000,
      validateStatus: () => true,
    });

    console.log(`[User-NoAPI] ← ${response.status}`);
    res.status(response.status).json(response.data);
  } catch (error: any) {
    console.error('[User-NoAPI Proxy Error]:', error.message);
    if (error.response) {
      res.status(error.response.status).json(error.response.data);
    } else {
      res.status(503).json({ success: false, error: 'User Service unavailable' });
    }
  }
});

// Membership - Proxy to User Service
app.all('/api/membership*', async (req: Request, res: Response) => {
  const targetPath = req.path;  // Keep /api/membership
  const targetUrl = `${process.env.USER_SERVICE_URL}${targetPath}${req.url.includes('?') ? req.url.substring(req.url.indexOf('?')) : ''}`;

  console.log(`[Membership] → ${req.method} ${targetPath}`);
  console.log(`[Membership] Target URL: ${targetUrl}`);

  try {
    // Remove problematic headers
    const cleanHeaders: any = {};
    Object.keys(req.headers).forEach(key => {
      if (!['host', 'connection', 'content-length', 'transfer-encoding'].includes(key.toLowerCase())) {
        cleanHeaders[key] = req.headers[key];
      }
    });
    cleanHeaders['host'] = new URL(process.env.USER_SERVICE_URL!).host;

    const response = await axios({
      method: req.method,
      url: targetUrl,
      data: req.body,
      headers: cleanHeaders,
      timeout: 15000,
      validateStatus: () => true,
    });

    console.log(`[Membership] ← ${response.status}`);
    res.status(response.status).json(response.data);
  } catch (error: any) {
    console.error('[Membership Proxy Error]:', error.message);
    if (error.response) {
      res.status(error.response.status).json(error.response.data);
    } else {
      res.status(503).json({ success: false, error: 'User Service unavailable' });
    }
  }
});

// Applications - Proxy to User Service (NOT Application Service!)
app.all('/api/applications*', async (req: Request, res: Response) => {
  const targetPath = req.path;  // Keep /api/applications path as is
  const targetUrl = `${process.env.USER_SERVICE_URL}${targetPath}${req.url.includes('?') ? req.url.substring(req.url.indexOf('?')) : ''}`;

  console.log(`[Applications] → ${req.method} ${targetPath}`);
  console.log(`[Applications] Target URL: ${targetUrl}`);

  try {
    // Remove problematic headers
    const cleanHeaders: any = {};
    Object.keys(req.headers).forEach(key => {
      if (!['host', 'connection', 'content-length', 'transfer-encoding'].includes(key.toLowerCase())) {
        cleanHeaders[key] = req.headers[key];
      }
    });
    cleanHeaders['host'] = new URL(process.env.USER_SERVICE_URL!).host;

    const response = await axios({
      method: req.method,
      url: targetUrl,
      data: req.body,
      headers: cleanHeaders,
      timeout: 15000,
      validateStatus: () => true,
    });

    console.log(`[Applications] ← ${response.status}`);
    res.status(response.status).json(response.data);
  } catch (error: any) {
    console.error('[Applications Proxy Error]:', error.message);
    if (error.response) {
      res.status(error.response.status).json(error.response.data);
    } else {
      res.status(503).json({ success: false, error: 'User Service unavailable' });
    }
  }
});

// Notifications - Proxy to User Service
app.all('/api/notifications*', async (req: Request, res: Response) => {
  const targetPath = req.path.replace('/api/notifications', '/notifications');
  const targetUrl = `${process.env.USER_SERVICE_URL}${targetPath}${req.url.includes('?') ? req.url.substring(req.url.indexOf('?')) : ''}`;

  console.log(`[Notifications] → ${req.method} ${targetPath}`);

  try {
    const cleanHeaders: any = {};
    Object.keys(req.headers).forEach(key => {
      if (!['host', 'connection', 'content-length', 'transfer-encoding'].includes(key.toLowerCase())) {
        cleanHeaders[key] = req.headers[key];
      }
    });
    cleanHeaders['host'] = new URL(process.env.USER_SERVICE_URL!).host;

    const response = await axios({
      method: req.method,
      url: targetUrl,
      data: req.body,
      headers: cleanHeaders,
      timeout: 15000,
      validateStatus: () => true,
    });

    console.log(`[Notifications] ← ${response.status}`);
    res.status(response.status).json(response.data);
  } catch (error: any) {
    console.error('[Notifications Proxy Error]:', error.message);
    if (error.response) {
      res.status(error.response.status).json(error.response.data);
    } else {
      res.status(503).json({ success: false, error: 'User Service unavailable' });
    }
  }
});

// Profile - Proxy to User Service
app.all('/api/profile*', async (req: Request, res: Response) => {
  const targetPath = req.path; // Keep full path with /api/profile
  const targetUrl = `${process.env.USER_SERVICE_URL}${targetPath}${req.url.includes('?') ? req.url.substring(req.url.indexOf('?')) : ''}`;

  console.log(`[Profile] → ${req.method} ${targetPath}`);
  console.log(`[Profile] Target URL: ${targetUrl}`);

  try {
    const cleanHeaders: any = {};
    Object.keys(req.headers).forEach(key => {
      if (!['host', 'connection', 'content-length', 'transfer-encoding'].includes(key.toLowerCase())) {
        cleanHeaders[key] = req.headers[key];
      }
    });
    cleanHeaders['host'] = new URL(process.env.USER_SERVICE_URL!).host;

    const response = await axios({
      method: req.method,
      url: targetUrl,
      data: req.body,
      headers: cleanHeaders,
      timeout: 15000,
      validateStatus: () => true,
    });

    console.log(`[Profile] ← ${response.status}`);
    res.status(response.status).json(response.data);
  } catch (error: any) {
    console.error('[Profile Proxy Error]:', error.message);
    if (error.response) {
      res.status(error.response.status).json(error.response.data);
    } else {
      res.status(503).json({ success: false, error: 'User Service unavailable' });
    }
  }
});

// Activities - Proxy to User Service
app.all('/api/activities*', async (req: Request, res: Response) => {
  const targetPath = req.path.replace('/api/activities', '/activities');
  const targetUrl = `${process.env.USER_SERVICE_URL}${targetPath}${req.url.includes('?') ? req.url.substring(req.url.indexOf('?')) : ''}`;

  console.log(`[Activities] → ${req.method} ${targetPath}`);
  console.log(`[Activities] Target URL: ${targetUrl}`);

  try {
    const cleanHeaders: any = {};
    Object.keys(req.headers).forEach(key => {
      if (!['host', 'connection', 'content-length', 'transfer-encoding'].includes(key.toLowerCase())) {
        cleanHeaders[key] = req.headers[key];
      }
    });
    cleanHeaders['host'] = new URL(process.env.USER_SERVICE_URL!).host;

    const response = await axios({
      method: req.method,
      url: targetUrl,
      data: req.body,
      headers: cleanHeaders,
      timeout: 15000,
      validateStatus: () => true,
    });

    console.log(`[Activities] ← ${response.status}`);
    res.status(response.status).json(response.data);
  } catch (error: any) {
    console.error('[Activities Proxy Error]:', error.message);
    if (error.response) {
      res.status(error.response.status).json(error.response.data);
    } else {
      res.status(503).json({ success: false, error: 'User Service unavailable' });
    }
  }
});

// Community - Proxy to User Service
app.all('/api/community*', async (req: Request, res: Response) => {
  const targetPath = req.path;  // Keep /api/community
  const targetUrl = `${process.env.USER_SERVICE_URL}${targetPath}${req.url.includes('?') ? req.url.substring(req.url.indexOf('?')) : ''}`;

  console.log(`[Community] → ${req.method} ${targetPath}`);
  console.log(`[Community] Target URL: ${targetUrl}`);

  try {
    const cleanHeaders: any = {};
    Object.keys(req.headers).forEach(key => {
      if (!['host', 'connection', 'content-length', 'transfer-encoding'].includes(key.toLowerCase())) {
        cleanHeaders[key] = req.headers[key];
      }
    });
    cleanHeaders['host'] = new URL(process.env.USER_SERVICE_URL!).host;

    const response = await axios({
      method: req.method,
      url: targetUrl,
      data: req.body,
      headers: cleanHeaders,
      timeout: 15000,
      validateStatus: () => true,
    });

    console.log(`[Community] ← ${response.status}`);
    res.status(response.status).json(response.data);
  } catch (error: any) {
    console.error('[Community Proxy Error]:', error.message);
    if (error.response) {
      res.status(error.response.status).json(error.response.data);
    } else {
      res.status(503).json({ success: false, error: 'User Service unavailable' });
    }
  }
});

// Club Member Dashboard - Proxy to User Service
app.all('/api/club-member/dashboard*', async (req: Request, res: Response) => {
  const targetPath = req.path;  // Keep /api/club-member/dashboard
  const targetUrl = `${process.env.USER_SERVICE_URL}${targetPath}${req.url.includes('?') ? req.url.substring(req.url.indexOf('?')) : ''}`;

  console.log(`[ClubMemberDashboard] → ${req.method} ${targetPath}`);
  console.log(`[ClubMemberDashboard] Target URL: ${targetUrl}`);

  try {
    const cleanHeaders: any = {};
    Object.keys(req.headers).forEach(key => {
      if (!['host', 'connection', 'content-length', 'transfer-encoding'].includes(key.toLowerCase())) {
        cleanHeaders[key] = req.headers[key];
      }
    });
    cleanHeaders['host'] = new URL(process.env.USER_SERVICE_URL!).host;

    const response = await axios({
      method: req.method,
      url: targetUrl,
      data: req.body,
      headers: cleanHeaders,
      timeout: 15000,
      validateStatus: () => true,
    });

    console.log(`[ClubMemberDashboard] ← ${response.status}`);
    res.status(response.status).json(response.data);
  } catch (error: any) {
    console.error('[ClubMemberDashboard Proxy Error]:', error.message);
    if (error.response) {
      res.status(error.response.status).json(error.response.data);
    } else {
      res.status(503).json({ success: false, error: 'User Service unavailable' });
    }
  }
});

// Team Service - Manual proxy 
app.all('/api/teams*', async (req: Request, res: Response) => {
  // Keep /api/teams path for Team Service
  const targetPath = req.path;
  const targetUrl = `${process.env.TEAM_SERVICE_URL}${targetPath}${req.url.includes('?') ? req.url.substring(req.url.indexOf('?')) : ''}`;

  console.log(`[Team] → ${req.method} ${req.path}`);
  console.log(`[Team] Target URL: ${targetUrl}`);

  try {
    const cleanHeaders: any = {};
    Object.keys(req.headers).forEach(key => {
      if (!['host', 'connection', 'content-length', 'transfer-encoding'].includes(key.toLowerCase())) {
        cleanHeaders[key] = req.headers[key];
      }
    });
    cleanHeaders['host'] = new URL(process.env.TEAM_SERVICE_URL!).host;

    const response = await axios({
      method: req.method,
      url: targetUrl,
      data: req.body,
      headers: cleanHeaders,
      timeout: 15000,
      validateStatus: () => true,
    });

    console.log(`[Team] ← ${response.status}`);
    res.status(response.status).json(response.data);
  } catch (error: any) {
    console.error('[Team Proxy Error]:', error.message);
    if (error.response) {
      res.status(error.response.status).json(error.response.data);
    } else {
      res.status(503).json({ success: false, error: 'Team Service unavailable' });
    }
  }
});

// Event Service - Manual proxy with detailed logging
app.all('/api/events*', async (req: Request, res: Response) => {
  // Keep /api/events path for Event Service
  const targetPath = req.path;  // Don't strip /api/events!
  const targetUrl = `${process.env.EVENT_SERVICE_URL}${targetPath}${req.url.includes('?') ? req.url.substring(req.url.indexOf('?')) : ''}`;

  console.log(`[Event] → ${req.method} ${targetPath}`);
  console.log(`[Event] Target URL: ${targetUrl}`);
  console.log(`[Event] Body:`, req.body);

  try {
    // Remove problematic headers
    const cleanHeaders: any = {};
    Object.keys(req.headers).forEach(key => {
      if (!['host', 'connection', 'content-length', 'transfer-encoding'].includes(key.toLowerCase())) {
        cleanHeaders[key] = req.headers[key];
      }
    });
    cleanHeaders['host'] = new URL(process.env.EVENT_SERVICE_URL!).host;

    console.log(`[Event] Clean headers:`, Object.keys(cleanHeaders));

    const response = await axios({
      method: req.method,
      url: targetUrl,
      data: req.body,
      headers: cleanHeaders,
      timeout: 15000,
      validateStatus: () => true, // Accept any status
    });

    console.log(`[Event] ← ${response.status}`);
    res.status(response.status).json(response.data);
  } catch (error: any) {
    console.error('[Event Proxy Error - DETAILED]:', {
      message: error.message,
      code: error.code,
      stack: error.stack?.split('\n')[0],
    });
    if (error.response) {
      res.status(error.response.status).json(error.response.data);
    } else {
      res.status(503).json({ success: false, error: 'Event Service unavailable', details: error.message });
    }
  }
});

// Event Applications - Proxy to Event Service
app.all('/api/event-applications*', async (req: Request, res: Response) => {
  const targetPath = req.path;  // Keep /api/event-applications
  const targetUrl = `${process.env.EVENT_SERVICE_URL}${targetPath}${req.url.includes('?') ? req.url.substring(req.url.indexOf('?')) : ''}`;

  console.log(`[Event Applications] → ${req.method} ${targetPath}`);
  console.log(`[Event Applications] Target URL: ${targetUrl}`);

  try {
    const cleanHeaders: any = {};
    Object.keys(req.headers).forEach(key => {
      if (!['host', 'connection', 'content-length', 'transfer-encoding'].includes(key.toLowerCase())) {
        cleanHeaders[key] = req.headers[key];
      }
    });
    cleanHeaders['host'] = new URL(process.env.EVENT_SERVICE_URL!).host;

    const response = await axios({
      method: req.method,
      url: targetUrl,
      data: req.body,
      headers: cleanHeaders,
      timeout: 15000,
      validateStatus: () => true,
    });

    console.log(`[Event Applications] ← ${response.status}`);
    res.status(response.status).json(response.data);
  } catch (error: any) {
    console.error('[Event Applications Proxy Error]:', error.message);
    if (error.response) {
      res.status(error.response.status).json(error.response.data);
    } else {
      res.status(503).json({ success: false, error: 'Event Service unavailable' });
    }
  }
});

// AACo Applications - Proxy to Event Service
app.all('/api/aaco-applications*', async (req: Request, res: Response) => {
  const targetPath = req.path;  // Keep /api/aaco-applications
  const targetUrl = `${process.env.EVENT_SERVICE_URL}${targetPath}${req.url.includes('?') ? req.url.substring(req.url.indexOf('?')) : ''}`;

  console.log(`[AACo Applications] → ${req.method} ${targetPath}`);
  console.log(`[AACo Applications] Target URL: ${targetUrl}`);

  try {
    const cleanHeaders: any = {};
    Object.keys(req.headers).forEach(key => {
      if (!['host', 'connection', 'content-length', 'transfer-encoding'].includes(key.toLowerCase())) {
        cleanHeaders[key] = req.headers[key];
      }
    });
    cleanHeaders['host'] = new URL(process.env.EVENT_SERVICE_URL!).host;

    const response = await axios({
      method: req.method,
      url: targetUrl,
      data: req.body,
      headers: cleanHeaders,
      timeout: 15000,
      validateStatus: () => true,
    });

    console.log(`[AACo Applications] ← ${response.status}`);
    res.status(response.status).json(response.data);
  } catch (error: any) {
    console.error('[AACo Applications Proxy Error]:', error.message);
    if (error.response) {
      res.status(error.response.status).json(error.response.data);
    } else {
      res.status(503).json({ success: false, error: 'Event Service unavailable' });
    }
  }
});

// Projects Service (Club Member) - Manual proxy
app.all('/api/projects*', async (req: Request, res: Response) => {
  const targetPath = req.path;  // Keep /api/projects
  const targetUrl = `${process.env.PROJECT_SERVICE_URL || 'http://localhost:3010'}${targetPath}${req.url.includes('?') ? req.url.substring(req.url.indexOf('?')) : ''}`;

  console.log(`[Projects] → ${req.method} ${targetPath}`);
  console.log(`[Projects] Target URL: ${targetUrl}`);

  try {
    const cleanHeaders: any = {};
    Object.keys(req.headers).forEach(key => {
      if (!['host', 'connection', 'content-length', 'transfer-encoding'].includes(key.toLowerCase())) {
        cleanHeaders[key] = req.headers[key];
      }
    });
    cleanHeaders['host'] = new URL(process.env.PROJECT_SERVICE_URL || 'http://localhost:3010').host;

    const response = await axios({
      method: req.method,
      url: targetUrl,
      data: req.body,
      headers: cleanHeaders,
      timeout: 15000,
      validateStatus: () => true,
    });

    console.log(`[Projects] ← ${response.status}`);
    res.status(response.status).json(response.data);
  } catch (error: any) {
    console.error('[Projects Proxy Error]:', error.message);
    if (error.response) {
      res.status(error.response.status).json(error.response.data);
    } else {
      res.status(503).json({ success: false, error: 'Project Service unavailable' });
    }
  }
});

// My Projects route - special handling
app.all('/api/my-projects*', async (req: Request, res: Response) => {
  const targetPath = req.path;
  const targetUrl = `${process.env.PROJECT_SERVICE_URL || 'http://localhost:3010'}${targetPath}${req.url.includes('?') ? req.url.substring(req.url.indexOf('?')) : ''}`;

  console.log(`[My Projects] → ${req.method} ${targetPath}`);

  try {
    const cleanHeaders: any = {};
    Object.keys(req.headers).forEach(key => {
      if (!['host', 'connection', 'content-length', 'transfer-encoding'].includes(key.toLowerCase())) {
        cleanHeaders[key] = req.headers[key];
      }
    });
    cleanHeaders['host'] = new URL(process.env.PROJECT_SERVICE_URL || 'http://localhost:3010').host;

    const response = await axios({
      method: req.method,
      url: targetUrl,
      data: req.body,
      headers: cleanHeaders,
      timeout: 15000,
      validateStatus: () => true,
    });

    console.log(`[My Projects] ← ${response.status}`);
    res.status(response.status).json(response.data);
  } catch (error: any) {
    console.error('[My Projects Proxy Error]:', error.message);
    if (error.response) {
      res.status(error.response.status).json(error.response.data);
    } else {
      res.status(503).json({ success: false, error: 'Project Service unavailable' });
    }
  }
});

// Evaluation Service - Manual proxy with clean headers
app.all('/api/evaluations*', async (req: Request, res: Response) => {
  const targetPath = req.path.replace('/api/evaluations', '');
  const targetUrl = `${process.env.EVALUATION_SERVICE_URL}${targetPath}${req.url.includes('?') ? req.url.substring(req.url.indexOf('?')) : ''}`;

  console.log(`[Evaluation] → ${req.method} ${targetPath}`);

  try {
    // Remove problematic headers
    const cleanHeaders: any = {};
    Object.keys(req.headers).forEach(key => {
      if (!['host', 'connection', 'content-length', 'transfer-encoding'].includes(key.toLowerCase())) {
        cleanHeaders[key] = req.headers[key];
      }
    });
    cleanHeaders['host'] = new URL(process.env.EVALUATION_SERVICE_URL!).host;

    const response = await axios({
      method: req.method,
      url: targetUrl,
      data: req.body,
      headers: cleanHeaders,
      timeout: 15000,
      validateStatus: () => true,
    });

    console.log(`[Evaluation] ← ${response.status}`);
    res.status(response.status).json(response.data);
  } catch (error: any) {
    console.error('[Evaluation Proxy Error]:', error.message);
    if (error.response) {
      res.status(error.response.status).json(error.response.data);
    } else {
      res.status(503).json({ success: false, error: 'Evaluation Service unavailable' });
    }
  }
});

// Training/Course Service - Proxy to Event Service (trainings are handled there)
app.all('/api/trainings*', async (req: Request, res: Response) => {
  const targetPath = req.path; // Keep /api/trainings path
  const targetUrl = `${process.env.EVENT_SERVICE_URL}${targetPath}${req.url.includes('?') ? req.url.substring(req.url.indexOf('?')) : ''}`;

  console.log(`[Training] → ${req.method} ${targetPath}`);
  console.log(`[Training] Target URL: ${targetUrl}`);

  try {
    const cleanHeaders: any = {};
    Object.keys(req.headers).forEach(key => {
      if (!['host', 'connection', 'content-length', 'transfer-encoding'].includes(key.toLowerCase())) {
        cleanHeaders[key] = req.headers[key];
      }
    });
    cleanHeaders['host'] = new URL(process.env.EVENT_SERVICE_URL!).host;

    const response = await axios({
      method: req.method,
      url: targetUrl,
      data: req.body,
      headers: cleanHeaders,
      timeout: 15000,
      validateStatus: () => true,
    });

    console.log(`[Training] ← ${response.status}`);
    res.status(response.status).json(response.data);
  } catch (error: any) {
    console.error('[Training Proxy Error]:', error.message);
    if (error.response) {
      res.status(error.response.status).json(error.response.data);
    } else {
      res.status(503).json({ success: false, error: 'Training Service unavailable' });
    }
  }
});

// Courses - Proxy to Event Service (courses/trainings are handled there)
app.all('/api/courses*', async (req: Request, res: Response) => {
  const targetPath = req.path; // Keep /api/courses
  const targetUrl = `${process.env.EVENT_SERVICE_URL}${targetPath}${req.url.includes('?') ? req.url.substring(req.url.indexOf('?')) : ''}`;

  console.log(`[Courses] → ${req.method} ${targetPath}`);
  console.log(`[Courses] Target URL: ${targetUrl}`);

  try {
    const cleanHeaders: any = {};
    Object.keys(req.headers).forEach(key => {
      if (!['host', 'connection', 'content-length', 'transfer-encoding'].includes(key.toLowerCase())) {
        cleanHeaders[key] = req.headers[key];
      }
    });
    cleanHeaders['host'] = new URL(process.env.EVENT_SERVICE_URL!).host;

    const response = await axios({
      method: req.method,
      url: targetUrl,
      data: req.body,
      headers: cleanHeaders,
      timeout: 15000,
      validateStatus: () => true,
    });

    console.log(`[Courses] ← ${response.status}`);
    res.status(response.status).json(response.data);
  } catch (error: any) {
    console.error('[Courses Proxy Error]:', error.message);
    if (error.response) {
      res.status(error.response.status).json(error.response.data);
    } else {
      res.status(503).json({ success: false, error: 'Course Service unavailable' });
    }
  }
});

// Funding Service - Manual proxy with clean headers
app.all('/api/fundings*', async (req: Request, res: Response) => {
  const targetPath = req.path; // Keep /api/fundings path
  const targetUrl = `${process.env.FUNDING_SERVICE_URL}${targetPath}${req.url.includes('?') ? req.url.substring(req.url.indexOf('?')) : ''}`;

  console.log(`[Funding] → ${req.method} ${targetPath}`);

  try {
    // Remove problematic headers
    const cleanHeaders: any = {};
    Object.keys(req.headers).forEach(key => {
      if (!['host', 'connection', 'content-length', 'transfer-encoding'].includes(key.toLowerCase())) {
        cleanHeaders[key] = req.headers[key];
      }
    });
    cleanHeaders['host'] = new URL(process.env.FUNDING_SERVICE_URL!).host;

    const response = await axios({
      method: req.method,
      url: targetUrl,
      data: req.body,
      headers: cleanHeaders,
      timeout: 15000,
      validateStatus: () => true,
    });

    console.log(`[Funding] ← ${response.status}`);
    res.status(response.status).json(response.data);
  } catch (error: any) {
    console.error('[Funding Proxy Error]:', error.message);
    if (error.response) {
      res.status(error.response.status).json(error.response.data);
    } else {
      res.status(503).json({ success: false, error: 'Funding Service unavailable' });
    }
  }
});

// Application Service - Manual proxy for interviews, messages, resources, FAQs, support
app.all('/api/applicants*', async (req: Request, res: Response) => {
  const targetPath = req.path.replace('/api', '');
  const targetUrl = `${process.env.APPLICATION_SERVICE_URL || 'http://localhost:3008'}${targetPath}${req.url.includes('?') ? req.url.substring(req.url.indexOf('?')) : ''}`;

  console.log(`[Application] → ${req.method} ${targetPath}`);

  try {
    const cleanHeaders: any = {};
    Object.keys(req.headers).forEach(key => {
      if (!['host', 'connection', 'content-length', 'transfer-encoding'].includes(key.toLowerCase())) {
        cleanHeaders[key] = req.headers[key];
      }
    });
    cleanHeaders['host'] = new URL(process.env.APPLICATION_SERVICE_URL || 'http://localhost:3008').host;

    const response = await axios({
      method: req.method,
      url: targetUrl,
      data: req.body,
      headers: cleanHeaders,
      timeout: 15000,
      validateStatus: () => true,
    });

    console.log(`[Application] ← ${response.status}`);
    res.status(response.status).json(response.data);
  } catch (error: any) {
    console.error('[Application Proxy Error]:', error.message);
    if (error.response) {
      res.status(error.response.status).json(error.response.data);
    } else {
      res.status(503).json({ success: false, error: 'Application Service unavailable' });
    }
  }
});

app.all('/api/interviews*', async (req: Request, res: Response) => {
  const targetPath = req.path; // Keep /api prefix for Application Service
  const targetUrl = `${process.env.APPLICATION_SERVICE_URL || 'http://localhost:3008'}${targetPath}${req.url.includes('?') ? req.url.substring(req.url.indexOf('?')) : ''}`;

  console.log(`[Application] → ${req.method} ${targetPath}`);

  try {
    const cleanHeaders: any = {};
    Object.keys(req.headers).forEach(key => {
      if (!['host', 'connection', 'content-length', 'transfer-encoding'].includes(key.toLowerCase())) {
        cleanHeaders[key] = req.headers[key];
      }
    });
    cleanHeaders['host'] = new URL(process.env.APPLICATION_SERVICE_URL || 'http://localhost:3008').host;

    const response = await axios({
      method: req.method,
      url: targetUrl,
      data: req.body,
      headers: cleanHeaders,
      timeout: 15000,
      validateStatus: () => true,
    });

    console.log(`[Application] ← ${response.status}`);
    res.status(response.status).json(response.data);
  } catch (error: any) {
    console.error('[Application Proxy Error]:', error.message);
    if (error.response) {
      res.status(error.response.status).json(error.response.data);
    } else {
      res.status(503).json({ success: false, error: 'Application Service unavailable' });
    }
  }
});

app.all('/api/messages*', async (req: Request, res: Response) => {
  const targetPath = req.path; // Keep /api prefix for Application Service
  const targetUrl = `${process.env.APPLICATION_SERVICE_URL || 'http://localhost:3008'}${targetPath}${req.url.includes('?') ? req.url.substring(req.url.indexOf('?')) : ''}`;

  console.log(`[Application] → ${req.method} ${targetPath}`);

  try {
    const cleanHeaders: any = {};
    Object.keys(req.headers).forEach(key => {
      if (!['host', 'connection', 'content-length', 'transfer-encoding'].includes(key.toLowerCase())) {
        cleanHeaders[key] = req.headers[key];
      }
    });
    cleanHeaders['host'] = new URL(process.env.APPLICATION_SERVICE_URL || 'http://localhost:3008').host;

    const response = await axios({
      method: req.method,
      url: targetUrl,
      data: req.body,
      headers: cleanHeaders,
      timeout: 15000,
      validateStatus: () => true,
    });

    console.log(`[Application] ← ${response.status}`);
    res.status(response.status).json(response.data);
  } catch (error: any) {
    console.error('[Application Proxy Error]:', error.message);
    if (error.response) {
      res.status(error.response.status).json(error.response.data);
    } else {
      res.status(503).json({ success: false, error: 'Application Service unavailable' });
    }
  }
});

app.all('/api/resources*', async (req: Request, res: Response) => {
  const targetPath = req.path; // Keep /api/resources path as is
  const targetUrl = `${process.env.APPLICATION_SERVICE_URL || 'http://localhost:3008'}${targetPath}${req.url.includes('?') ? req.url.substring(req.url.indexOf('?')) : ''}`;

  console.log(`[Resources] → ${req.method} ${targetPath}`);

  try {
    const cleanHeaders: any = {};
    Object.keys(req.headers).forEach(key => {
      if (!['host', 'connection', 'content-length', 'transfer-encoding'].includes(key.toLowerCase())) {
        cleanHeaders[key] = req.headers[key];
      }
    });
    cleanHeaders['host'] = new URL(process.env.APPLICATION_SERVICE_URL || 'http://localhost:3008').host;

    const response = await axios({
      method: req.method,
      url: targetUrl,
      data: req.body,
      headers: cleanHeaders,
      timeout: 15000,
      validateStatus: () => true,
    });

    console.log(`[Application] ← ${response.status}`);
    res.status(response.status).json(response.data);
  } catch (error: any) {
    console.error('[Application Proxy Error]:', error.message);
    if (error.response) {
      res.status(error.response.status).json(error.response.data);
    } else {
      res.status(503).json({ success: false, error: 'Application Service unavailable' });
    }
  }
});

app.all('/api/faqs*', async (req: Request, res: Response) => {
  const targetPath = req.path.replace('/api', '');
  const targetUrl = `${process.env.APPLICATION_SERVICE_URL || 'http://localhost:3008'}${targetPath}${req.url.includes('?') ? req.url.substring(req.url.indexOf('?')) : ''}`;

  console.log(`[Application] → ${req.method} ${targetPath}`);

  try {
    const cleanHeaders: any = {};
    Object.keys(req.headers).forEach(key => {
      if (!['host', 'connection', 'content-length', 'transfer-encoding'].includes(key.toLowerCase())) {
        cleanHeaders[key] = req.headers[key];
      }
    });
    cleanHeaders['host'] = new URL(process.env.APPLICATION_SERVICE_URL || 'http://localhost:3008').host;

    const response = await axios({
      method: req.method,
      url: targetUrl,
      data: req.body,
      headers: cleanHeaders,
      timeout: 15000,
      validateStatus: () => true,
    });

    console.log(`[Application] ← ${response.status}`);
    res.status(response.status).json(response.data);
  } catch (error: any) {
    console.error('[Application Proxy Error]:', error.message);
    if (error.response) {
      res.status(error.response.status).json(error.response.data);
    } else {
      res.status(503).json({ success: false, error: 'Application Service unavailable' });
    }
  }
});

app.all('/api/support*', async (req: Request, res: Response) => {
  const targetPath = req.path.replace('/api', '');
  const targetUrl = `${process.env.APPLICATION_SERVICE_URL || 'http://localhost:3008'}${targetPath}${req.url.includes('?') ? req.url.substring(req.url.indexOf('?')) : ''}`;

  console.log(`[Application] → ${req.method} ${targetPath}`);

  try {
    const cleanHeaders: any = {};
    Object.keys(req.headers).forEach(key => {
      if (!['host', 'connection', 'content-length', 'transfer-encoding'].includes(key.toLowerCase())) {
        cleanHeaders[key] = req.headers[key];
      }
    });
    cleanHeaders['host'] = new URL(process.env.APPLICATION_SERVICE_URL || 'http://localhost:3008').host;

    const response = await axios({
      method: req.method,
      url: targetUrl,
      data: req.body,
      headers: cleanHeaders,
      timeout: 15000,
      validateStatus: () => true,
    });

    console.log(`[Application] ← ${response.status}`);
    res.status(response.status).json(response.data);
  } catch (error: any) {
    console.error('[Application Proxy Error]:', error.message);
    if (error.response) {
      res.status(error.response.status).json(error.response.data);
    } else {
      res.status(503).json({ success: false, error: 'Application Service unavailable' });
    }
  }
});

// Documents - Proxy to Application Service
app.all('/api/documents*', async (req: Request, res: Response) => {
  const targetPath = req.path.replace('/api', '');
  const targetUrl = `${process.env.APPLICATION_SERVICE_URL || 'http://localhost:3008'}${targetPath}${req.url.includes('?') ? req.url.substring(req.url.indexOf('?')) : ''}`;

  console.log(`[Application] → ${req.method} ${targetPath}`);

  try {
    const cleanHeaders: any = {};
    Object.keys(req.headers).forEach(key => {
      if (!['host', 'connection', 'content-length', 'transfer-encoding'].includes(key.toLowerCase())) {
        cleanHeaders[key] = req.headers[key];
      }
    });
    cleanHeaders['host'] = new URL(process.env.APPLICATION_SERVICE_URL || 'http://localhost:3008').host;

    const response = await axios({
      method: req.method,
      url: targetUrl,
      data: req.body,
      headers: cleanHeaders,
      timeout: 15000,
      validateStatus: () => true,
    });

    console.log(`[Application] ← ${response.status}`);
    res.status(response.status).json(response.data);
  } catch (error: any) {
    console.error('[Application Proxy Error]:', error.message);
    if (error.response) {
      res.status(error.response.status).json(error.response.data);
    } else {
      res.status(503).json({ success: false, error: 'Application Service unavailable' });
    }
  }
});

// Conversations - Proxy to Application Service
app.all('/api/conversations*', async (req: Request, res: Response) => {
  const targetPath = req.path.replace('/api', '');
  const targetUrl = `${process.env.APPLICATION_SERVICE_URL || 'http://localhost:3008'}${targetPath}${req.url.includes('?') ? req.url.substring(req.url.indexOf('?')) : ''}`;

  console.log(`[Application] → ${req.method} ${targetPath}`);

  try {
    const cleanHeaders: any = {};
    Object.keys(req.headers).forEach(key => {
      if (!['host', 'connection', 'content-length', 'transfer-encoding'].includes(key.toLowerCase())) {
        cleanHeaders[key] = req.headers[key];
      }
    });
    cleanHeaders['host'] = new URL(process.env.APPLICATION_SERVICE_URL || 'http://localhost:3008').host;

    const response = await axios({
      method: req.method,
      url: targetUrl,
      data: req.body,
      headers: cleanHeaders,
      timeout: 15000,
      validateStatus: () => true,
    });

    console.log(`[Application] ← ${response.status}`);
    res.status(response.status).json(response.data);
  } catch (error: any) {
    console.error('[Application Proxy Error]:', error.message);
    if (error.response) {
      res.status(error.response.status).json(error.response.data);
    } else {
      res.status(503).json({ success: false, error: 'Application Service unavailable' });
    }
  }
});

// Achievements - Proxy to Achievement Service
app.all('/api/achievements*', async (req: Request, res: Response) => {
  const targetPath = req.path; // Keep /api/achievements as-is
  const targetUrl = `${process.env.ACHIEVEMENT_SERVICE_URL || 'http://localhost:3006'}${targetPath}${req.url.includes('?') ? req.url.substring(req.url.indexOf('?')) : ''}`;

  console.log(`[Achievements] → ${req.method} ${targetPath}`);
  console.log(`[Achievements] Target URL: ${targetUrl}`);

  try {
    const cleanHeaders: any = {};
    Object.keys(req.headers).forEach(key => {
      if (!['host', 'connection', 'content-length', 'transfer-encoding'].includes(key.toLowerCase())) {
        cleanHeaders[key] = req.headers[key];
      }
    });
    cleanHeaders['host'] = new URL(process.env.ACHIEVEMENT_SERVICE_URL || 'http://localhost:3006').host;

    const response = await axios({
      method: req.method,
      url: targetUrl,
      data: req.body,
      headers: cleanHeaders,
      timeout: 15000,
      validateStatus: () => true,
    });

    console.log(`[Achievements] ← ${response.status}`);
    res.status(response.status).json(response.data);
  } catch (error: any) {
    console.error('[Achievements Proxy Error]:', error.message);
    if (error.response) {
      res.status(error.response.status).json(error.response.data);
    } else {
      res.status(503).json({ success: false, error: 'Achievement Service unavailable' });
    }
  }
});

// XP - Proxy to XP Service
app.all('/api/xp*', async (req: Request, res: Response) => {
  const targetPath = req.path; // Keep /api/xp as-is
  const targetUrl = `${process.env.XP_SERVICE_URL || 'http://localhost:3011'}${targetPath}${req.url.includes('?') ? req.url.substring(req.url.indexOf('?')) : ''}`;

  console.log(`[XP] → ${req.method} ${targetPath}`);
  console.log(`[XP] Target URL: ${targetUrl}`);

  try {
    const cleanHeaders: any = {};
    Object.keys(req.headers).forEach((key) => {
      if (!['host', 'connection', 'content-length'].includes(key.toLowerCase())) {
        cleanHeaders[key] = req.headers[key];
      }
    });
    cleanHeaders['host'] = new URL(process.env.XP_SERVICE_URL || 'http://localhost:3011').host;

    const response = await axios({
      method: req.method,
      url: targetUrl,
      data: req.body,
      headers: cleanHeaders,
      validateStatus: () => true,
    });

    console.log(`[XP] ← ${response.status}`);
    res.status(response.status).json(response.data);
  } catch (error: any) {
    console.error('[XP Proxy Error]:', error.message);
    if (error.response) {
      res.status(error.response.status).json(error.response.data);
    } else {
      res.status(503).json({ success: false, error: 'XP Service unavailable' });
    }
  }
});

// Streaks - Proxy to XP Service (Streak endpoints)
app.all('/api/streaks*', async (req: Request, res: Response) => {
  const targetPath = req.path; // Keep /api/streaks as-is
  const targetUrl = `${process.env.XP_SERVICE_URL || 'http://localhost:3011'}${targetPath}${req.url.includes('?') ? req.url.substring(req.url.indexOf('?')) : ''}`;

  console.log(`[Streaks] → ${req.method} ${targetPath}`);

  try {
    const cleanHeaders: any = {};
    Object.keys(req.headers).forEach((key) => {
      if (!['host', 'connection', 'content-length'].includes(key.toLowerCase())) {
        cleanHeaders[key] = req.headers[key];
      }
    });
    cleanHeaders['host'] = new URL(process.env.XP_SERVICE_URL || 'http://localhost:3011').host;

    const response = await axios({
      method: req.method,
      url: targetUrl,
      data: req.body,
      headers: cleanHeaders,
      validateStatus: () => true,
    });

    console.log(`[Streaks] ← ${response.status}`);
    res.status(response.status).json(response.data);
  } catch (error: any) {
    console.error('[Streaks Proxy Error]:', error.message);
    if (error.response) {
      res.status(error.response.status).json(error.response.data);
    } else {
      res.status(503).json({ success: false, error: 'Streak Service unavailable' });
    }
  }
});

// Challenges - Proxy to XP Service (Challenge endpoints)
app.all('/api/challenges*', async (req: Request, res: Response) => {
  const targetPath = req.path;
  const targetUrl = `${process.env.XP_SERVICE_URL || 'http://localhost:3011'}${targetPath}${req.url.includes('?') ? req.url.substring(req.url.indexOf('?')) : ''}`;

  console.log(`[Challenges] → ${req.method} ${targetPath}`);

  try {
    const cleanHeaders: any = {};
    Object.keys(req.headers).forEach((key) => {
      if (!['host', 'connection', 'content-length'].includes(key.toLowerCase())) {
        cleanHeaders[key] = req.headers[key];
      }
    });
    cleanHeaders['host'] = new URL(process.env.XP_SERVICE_URL || 'http://localhost:3011').host;

    const response = await axios({
      method: req.method,
      url: targetUrl,
      data: req.body,
      headers: cleanHeaders,
      validateStatus: () => true,
    });

    console.log(`[Challenges] ← ${response.status}`);
    res.status(response.status).json(response.data);
  } catch (error: any) {
    console.error('[Challenges Proxy Error]:', error.message);
    if (error.response) {
      res.status(error.response.status).json(error.response.data);
    } else {
      res.status(503).json({ success: false, error: 'Challenge Service unavailable' });
    }
  }
});

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
    error: 'Internal server error',
  });
});

// XP Service - Proxy to XP Service
app.all('/api/xp*', async (req: Request, res: Response) => {
  const targetPath = req.path; // Keep /api/xp as-is
  const targetUrl = `${process.env.XP_SERVICE_URL || 'http://localhost:3002'}${targetPath}${req.url.includes('?') ? req.url.substring(req.url.indexOf('?')) : ''}`;

  console.log(`[XP] → ${req.method} ${targetPath}`);
  console.log(`[XP] Target URL: ${targetUrl}`);

  try {
    const cleanHeaders: any = {};
    Object.keys(req.headers).forEach(key => {
      if (!['host', 'connection', 'content-length', 'transfer-encoding'].includes(key.toLowerCase())) {
        cleanHeaders[key] = req.headers[key];
      }
    });
    cleanHeaders['host'] = new URL(process.env.XP_SERVICE_URL || 'http://localhost:3002').host;

    const response = await axios({
      method: req.method,
      url: targetUrl,
      data: req.body,
      headers: cleanHeaders,
      timeout: 15000,
      validateStatus: () => true,
    });

    console.log(`[XP] ← ${response.status}`);
    res.status(response.status).json(response.data);
  } catch (error: any) {
    console.error('[XP Proxy Error]:', error.message);
    if (error.response) {
      res.status(error.response.status).json(error.response.data);
    } else {
      res.status(503).json({ success: false, error: 'XP Service unavailable' });
    }
  }
});

// Streaks - Proxy to XP Service
app.all('/api/streaks*', async (req: Request, res: Response) => {
  const targetPath = req.path; // Keep /api/streaks as-is
  const targetUrl = `${process.env.XP_SERVICE_URL || 'http://localhost:3002'}${targetPath}${req.url.includes('?') ? req.url.substring(req.url.indexOf('?')) : ''}`;

  console.log(`[Streaks] → ${req.method} ${targetPath}`);
  console.log(`[Streaks] Target URL: ${targetUrl}`);

  try {
    const cleanHeaders: any = {};
    Object.keys(req.headers).forEach(key => {
      if (!['host', 'connection', 'content-length', 'transfer-encoding'].includes(key.toLowerCase())) {
        cleanHeaders[key] = req.headers[key];
      }
    });
    cleanHeaders['host'] = new URL(process.env.XP_SERVICE_URL || 'http://localhost:3002').host;

    const response = await axios({
      method: req.method,
      url: targetUrl,
      data: req.body,
      headers: cleanHeaders,
      timeout: 15000,
      validateStatus: () => true,
    });

    console.log(`[Streaks] ← ${response.status}`);
    res.status(response.status).json(response.data);
  } catch (error: any) {
    console.error('[Streaks Proxy Error]:', error.message);
    if (error.response) {
      res.status(error.response.status).json(error.response.data);
    } else {
      res.status(503).json({ success: false, error: 'Streaks Service unavailable' });
    }
  }
});

// Challenges - Proxy to XP Service
app.all('/api/challenges*', async (req: Request, res: Response) => {
  const targetPath = req.path; // Keep /api/challenges as-is
  const targetUrl = `${process.env.XP_SERVICE_URL || 'http://localhost:3002'}${targetPath}${req.url.includes('?') ? req.url.substring(req.url.indexOf('?')) : ''}`;

  console.log(`[Challenges] → ${req.method} ${targetPath}`);
  console.log(`[Challenges] Target URL: ${targetUrl}`);

  try {
    const cleanHeaders: any = {};
    Object.keys(req.headers).forEach(key => {
      if (!['host', 'connection', 'content-length', 'transfer-encoding'].includes(key.toLowerCase())) {
        cleanHeaders[key] = req.headers[key];
      }
    });
    cleanHeaders['host'] = new URL(process.env.XP_SERVICE_URL || 'http://localhost:3002').host;

    const response = await axios({
      method: req.method,
      url: targetUrl,
      data: req.body,
      headers: cleanHeaders,
      timeout: 15000,
      validateStatus: () => true,
    });

    console.log(`[Challenges] ← ${response.status}`);
    res.status(response.status).json(response.data);
  } catch (error: any) {
    console.error('[Challenges Proxy Error]:', error.message);
    if (error.response) {
      res.status(error.response.status).json(error.response.data);
    } else {
      res.status(503).json({ success: false, error: 'Challenges Service unavailable' });
    }
  }
});

// Stats - Proxy to User Service
app.all('/api/stats*', async (req: Request, res: Response) => {
  const targetPath = req.path; // Keep /api/stats
  const targetUrl = `${process.env.USER_SERVICE_URL}${targetPath}${req.url.includes('?') ? req.url.substring(req.url.indexOf('?')) : ''}`;

  console.log(`[Stats] → ${req.method} ${targetPath}`);
  console.log(`[Stats] Target URL: ${targetUrl}`);

  try {
    const cleanHeaders: any = {};
    Object.keys(req.headers).forEach(key => {
      if (!['host', 'connection', 'content-length', 'transfer-encoding'].includes(key.toLowerCase())) {
        cleanHeaders[key] = req.headers[key];
      }
    });
    cleanHeaders['host'] = new URL(process.env.USER_SERVICE_URL!).host;

    const response = await axios({
      method: req.method,
      url: targetUrl,
      data: req.body,
      headers: cleanHeaders,
      timeout: 15000,
      validateStatus: () => true,
    });

    console.log(`[Stats] ← ${response.status}`);
    res.status(response.status).json(response.data);
  } catch (error: any) {
    console.error('[Stats Proxy Error]:', error.message);
    if (error.response) {
      res.status(error.response.status).json(error.response.data);
    } else {
      res.status(503).json({ success: false, error: 'Stats Service unavailable' });
    }
  }
});

// Director - Proxy to User Service (Director endpoints)
app.all('/api/director*', async (req: Request, res: Response) => {
  const targetPath = req.path; // Keep /api/director as-is
  const targetUrl = `${process.env.USER_SERVICE_URL}${targetPath}${req.url.includes('?') ? req.url.substring(req.url.indexOf('?')) : ''}`;

  console.log(`[Director] → ${req.method} ${targetPath}`);
  console.log(`[Director] Target URL: ${targetUrl}`);

  try {
    const cleanHeaders: any = {};
    Object.keys(req.headers).forEach(key => {
      if (!['host', 'connection', 'content-length', 'transfer-encoding'].includes(key.toLowerCase())) {
        cleanHeaders[key] = req.headers[key];
      }
    });
    cleanHeaders['host'] = new URL(process.env.USER_SERVICE_URL!).host;

    const response = await axios({
      method: req.method,
      url: targetUrl,
      data: req.body,
      headers: cleanHeaders,
      timeout: 15000,
      validateStatus: () => true,
    });

    console.log(`[Director] ← ${response.status}`);
    res.status(response.status).json(response.data);
  } catch (error: any) {
    console.error('[Director Proxy Error]:', error.message);
    if (error.response) {
      res.status(error.response.status).json(error.response.data);
    } else {
      res.status(503).json({ success: false, error: 'Director Service unavailable' });
    }
  }
});

// Uploads - Proxy to User Service (for avatar images)
app.all('/uploads/*', async (req: Request, res: Response) => {
  const targetPath = req.path; // Keep /uploads path
  const targetUrl = `${process.env.USER_SERVICE_URL}${targetPath}`;

  console.log(`[Uploads] → ${req.method} ${targetPath}`);
  console.log(`[Uploads] Target URL: ${targetUrl}`);

  try {
    const response = await axios({
      method: req.method,
      url: targetUrl,
      responseType: 'arraybuffer', // For binary data (images)
      timeout: 15000,
      validateStatus: () => true,
    });

    console.log(`[Uploads] ← ${response.status}`);
    
    // Set content type from response
    if (response.headers['content-type']) {
      res.setHeader('Content-Type', response.headers['content-type']);
    }
    
    res.status(response.status).send(response.data);
  } catch (error: any) {
    console.error('[Uploads Proxy Error]:', error.message);
    res.status(503).json({ success: false, error: 'File not found' });
  }
});


// Setup Socket.IO
const socketHelpers = setupSocketIO(httpServer);

// Export socket helpers for use in other parts of the application
export const { io, sendNotificationToUser, sendAchievementUnlock, broadcastToAll } = socketHelpers;

// Start server
httpServer.listen(PORT, () => {
  console.log(`🚀 API Gateway is running on port ${PORT}`);
  console.log(`📚 API Documentation: http://localhost:${PORT}/api-docs`);
  console.log(`🔌 Socket.IO server is ready`);
});
