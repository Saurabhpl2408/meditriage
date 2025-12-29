// MediTriage MCP Server - Main Entry Point

import express, { Application, Request, Response } from 'express';
import * as dotenv from 'dotenv';
import { handleRequest, handleBatchRequest } from './handlers/jsonRpcHandler';
import { MCPRequest } from './types/mcp.types';
import logger from './utils/logger';
import backendClient from './clients/backendClient';

// Load environment variables
dotenv.config();

// Create Express app
const app: Application = express();
const PORT = process.env.MCP_PORT || 3001;

// ============================================
// MIDDLEWARE
// ============================================

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.http('HTTP Request', {
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      duration: `${duration}ms`
    });
  });
  
  next();
});

// ============================================
// ROUTES
// ============================================

/**
 * Health check endpoint
 */
app.get('/health', async (req: Request, res: Response) => {
  try {
    // Check backend connectivity
    const backendHealth = await backendClient.healthCheck();
    
    res.json({
      status: 'healthy',
      mcp: {
        name: process.env.MCP_SERVER_NAME || 'meditriage-mcp',
        version: process.env.MCP_SERVER_VERSION || '1.0.0',
        protocolVersion: process.env.MCP_PROTOCOL_VERSION || '2024-11-05'
      },
      backend: {
        status: 'connected',
        url: backendClient.getBaseURL()
      },
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    res.status(503).json({
      status: 'unhealthy',
      error: 'Backend connection failed',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * Root endpoint - Server info
 */
app.get('/', (req: Request, res: Response) => {
  res.json({
    name: 'MediTriage MCP Server',
    version: '1.0.0',
    protocol: 'Model Context Protocol (MCP)',
    description: 'Medical triage tools for AI assistants',
    endpoints: {
      health: '/health',
      rpc: '/rpc (POST)'
    },
    tools: [
      'search_symptoms',
      'perform_triage',
      'check_red_flags',
      'lookup_condition',
      'get_self_care_advice'
    ],
    documentation: 'https://github.com/yourusername/meditriage'
  });
});

/**
 * JSON-RPC 2.0 endpoint
 */
app.post('/rpc', async (req: Request, res: Response) => {
  try {
    const requestBody = req.body;

    // Check if it's a batch request
    if (Array.isArray(requestBody)) {
      const responses = await handleBatchRequest(requestBody as MCPRequest[]);
      res.json(responses);
    } else {
      const response = await handleRequest(requestBody as MCPRequest);
      res.json(response);
    }
  } catch (error: any) {
    logger.error('RPC endpoint error', { error });

    res.status(500).json({
      jsonrpc: '2.0',
      id: null,
      error: {
        code: -32700,
        message: 'Parse error',
        data: error.message
      }
    });
  }
});

/**
 * 404 handler
 */
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.path} not found`,
    availableEndpoints: ['/', '/health', '/rpc']
  });
});

// ============================================
// SERVER INITIALIZATION
// ============================================

/**
 * Start the server
 */
async function startServer() {
  try {
    console.log('🎙️ Starting MediTriage MCP Server...');
    console.log('Environment:', process.env.NODE_ENV || 'development');

    // Test backend connection
    try {
      const backendHealth = await backendClient.healthCheck();
      console.log('✅ Backend connected:', backendClient.getBaseURL());
      logger.info('Backend connection established', {
        url: backendClient.getBaseURL()
      });
    } catch (error) {
      console.warn('⚠️  Backend connection failed (will retry on requests)');
      logger.warn('Backend connection failed', { error });
    }

    // Start listening
    const server = app.listen(PORT, () => {
      console.log('');
      console.log('════════════════════════════════════════');
      console.log('🎙️ MediTriage MCP Server is RUNNING!');
      console.log('════════════════════════════════════════');
      console.log(`Port:     ${PORT}`);
      console.log(`Protocol: MCP ${process.env.MCP_PROTOCOL_VERSION}`);
      console.log(`Backend:  ${backendClient.getBaseURL()}`);
      console.log('');
      console.log('📍 Endpoints:');
      console.log(`   http://localhost:${PORT}/`);
      console.log(`   http://localhost:${PORT}/health`);
      console.log(`   http://localhost:${PORT}/rpc (JSON-RPC 2.0)`);
      console.log('');
      console.log('🔧 Available Tools: 5');
      console.log('   - search_symptoms');
      console.log('   - perform_triage');
      console.log('   - check_red_flags');
      console.log('   - lookup_condition');
      console.log('   - get_self_care_advice');
      console.log('════════════════════════════════════════');
      console.log('');

      logger.info('MCP server started', {
        port: PORT,
        protocol: process.env.MCP_PROTOCOL_VERSION
      });
    });

    // Graceful shutdown
    const gracefulShutdown = (signal: string) => {
      console.log(`\n${signal} received, shutting down gracefully...`);
      logger.info(`${signal} received, starting graceful shutdown`);

      server.close(() => {
        console.log('✅ Server closed');
        logger.info('Server closed');
        process.exit(0);
      });

      setTimeout(() => {
        console.error('❌ Forced shutdown after timeout');
        logger.error('Forced shutdown after timeout');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

    process.on('uncaughtException', (error: Error) => {
      console.error('Uncaught Exception:', error);
      logger.error('Uncaught Exception', { error });
      process.exit(1);
    });

    process.on('unhandledRejection', (reason: any) => {
      console.error('Unhandled Rejection:', reason);
      logger.error('Unhandled Rejection', { reason });
      process.exit(1);
    });

  } catch (error) {
    console.error('❌ Failed to start server:', error);
    logger.error('Failed to start server', { error });
    process.exit(1);
  }
}

// Start server if run directly
if (require.main === module) {
  startServer().catch((error) => {
    console.error('Failed to start server:', error);
    process.exit(1);
  });
}

export default app;