// Health Check Controller

import { Request, Response } from 'express';
import { healthCheck } from '../config/database';
import { validateRedFlagConfiguration } from '../services/redFlagService';
import logger from '../utils/logger';

/**
 * GET /health
 * Basic health check
 */
export async function getHealth(req: Request, res: Response): Promise<void> {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'meditriage-backend',
    version: process.env.npm_package_version || '1.0.0'
  });
}

/**
 * GET /health/detailed
 * Detailed health check with database and dependencies
 */
export async function getDetailedHealth(
  req: Request,
  res: Response
): Promise<void> {
  try {
    // Check database
    const dbHealth = await healthCheck();

    // Check red flag configuration
    const redFlagValidation = await validateRedFlagConfiguration();

    const isHealthy = 
      dbHealth.status === 'healthy' && 
      redFlagValidation.valid;

    const statusCode = isHealthy ? 200 : 503;

    res.status(statusCode).json({
      status: isHealthy ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      service: 'meditriage-backend',
      version: process.env.npm_package_version || '1.0.0',
      checks: {
        database: {
          status: dbHealth.status,
          latency: `${dbHealth.latency}ms`,
          pool: dbHealth.poolStatus
        },
        redFlagConfiguration: {
          status: redFlagValidation.valid ? 'valid' : 'invalid',
          issues: redFlagValidation.issues
        }
      }
    });
  } catch (error) {
    logger.error('Detailed health check failed', { error });
    
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: 'Health check failed'
    });
  }
}

/**
 * GET /health/ready
 * Readiness probe for Kubernetes
 */
export async function getReadiness(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const dbHealth = await healthCheck();
    
    if (dbHealth.status === 'healthy') {
      res.status(200).json({ ready: true });
    } else {
      res.status(503).json({ ready: false });
    }
  } catch (error) {
    res.status(503).json({ ready: false });
  }
}

/**
 * GET /health/live
 * Liveness probe for Kubernetes
 */
export async function getLiveness(
  req: Request,
  res: Response
): Promise<void> {
  res.status(200).json({ alive: true });
}