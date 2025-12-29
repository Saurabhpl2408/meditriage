// MediTriage Backend API - Main Entry Point

import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import dotenv from 'dotenv';
import routes from './routes';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import { apiLimiter } from './middleware/rateLimiter';
import { testConnection, closePool } from './config/database';
import logger from './utils/logger';
import { API_CONFIG } from './config/constants';

// Load environment variables
dotenv.config();

// Create Express app
const app: Application = express();
const PORT = process.env.PORT || 3000;

// ============================================
// MIDDLEWARE
// ============================================

// Security headers
if (process.env.ENABLE_HELMET !== 'false') {
  app.use(helmet());
}

// CORS
if (process.env.ENABLE_CORS !== 'false') {
  app.use(cors({
    origin: API_CONFIG.CORS.ORIGIN,
    methods: API_CONFIG.CORS.METHODS,
    allowedHeaders: API_CONFIG.CORS.ALLOWED_HEADERS,
    credentials: true
  }));
}

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Compression
app.use(compression());

// Rate limiting
app.use(apiLimiter);

// Request logging
app.use((req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.http('HTTP Request', {
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
      userAgent: req.get('user-agent')
    });
  });
  
  next();
});

// Trust proxy (for rate limiting behind reverse proxy)
if (process.env.TRUST_PROXY === 'true') {
  app.set('trust proxy', 1);
}

// ============================================
// ROUTES
// ============================================

app.use('/', routes);

// ============================================
// ERROR HANDLING
// ============================================

// 404 handler (must be after all routes)
app.use(notFoundHandler);

// Global error handler (must be last)
app.use(errorHandler);

// ============================================
// SERVER INITIALIZATION
// ============================================

/**
 * Start the server
 */
async function startServer() {
  try {
    // Log startup info (console for immediate feedback)
    console.log('🚀 Starting MediTriage API...');
    console.log('Environment:', process.env.NODE_ENV || 'development');
    console.log('Database:', process.env.DB_HOST, process.env.DB_NAME);
    
    logger.info('Starting MediTriage API...', {
      nodeEnv: process.env.NODE_ENV,
      dbHost: process.env.DB_HOST,
      dbPort: process.env.DB_PORT,
      dbName: process.env.DB_NAME
    });

    // Test database connection
    console.log('📊 Testing database connection...');
    logger.info('Testing database connection...');
    const dbConnected = await testConnection();
    
    if (!dbConnected) {
      console.error('❌ Failed to connect to database');
      logger.error('Failed to connect to database', {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        database: process.env.DB_NAME
      });
      logger.error('Please ensure PostgreSQL is running: docker-compose up -d postgres');
      process.exit(1);
    }
    
    console.log('✅ Database connected!');

    // Start listening
    const server = app.listen(PORT, () => {
      console.log('');
      console.log('════════════════════════════════════════');
      console.log('🚀 MediTriage API is RUNNING!');
      console.log('════════════════════════════════════════');
      console.log(`Port:        ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`Node:        ${process.version}`);
      console.log('');
      console.log('📍 Endpoints:');
      console.log(`   http://localhost:${PORT}/`);
      console.log(`   http://localhost:${PORT}/health`);
      console.log(`   http://localhost:${PORT}/api/v1/symptoms`);
      console.log(`   http://localhost:${PORT}/api/v1/triage`);
      console.log('════════════════════════════════════════');
      console.log('');
      
      logger.info(`🚀 MediTriage API started`, {
        port: PORT,
        environment: process.env.NODE_ENV || 'development',
        nodeVersion: process.version
      });
      
      logger.info('API Endpoints:', {
        root: `http://localhost:${PORT}/`,
        health: `http://localhost:${PORT}/health`,
        symptoms: `http://localhost:${PORT}/api/v1/symptoms`,
        triage: `http://localhost:${PORT}/api/v1/triage`
      });
    });

    // Graceful shutdown handlers
    const gracefulShutdown = async (signal: string) => {
      logger.info(`${signal} received, starting graceful shutdown...`);
      
      server.close(async () => {
        logger.info('HTTP server closed');
        
        try {
          await closePool();
          logger.info('Database connections closed');
          process.exit(0);
        } catch (error) {
          logger.error('Error during shutdown', { error });
          process.exit(1);
        }
      });

      // Force shutdown after 10 seconds
      setTimeout(() => {
        logger.error('Forced shutdown after timeout');
        process.exit(1);
      }, 10000);
    };

    // Handle shutdown signals
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

    // Handle uncaught errors
    process.on('uncaughtException', (error: Error) => {
      logger.error('Uncaught Exception', { error });
      process.exit(1);
    });

    process.on('unhandledRejection', (reason: any) => {
      logger.error('Unhandled Rejection', { reason });
      process.exit(1);
    });

  } catch (error) {
    console.error('❌ Failed to start server:', error);
    logger.error('Failed to start server', { error });
    process.exit(1);
  }
}

// Start the server if this file is run directly
if (require.main === module) {
  startServer().catch((error) => {
    console.error('Failed to start server:', error);
    process.exit(1);
  });
}

export default app;