// Error Handling Middleware

import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';

export interface AppError extends Error {
  statusCode?: number;
  code?: string;
  details?: any;
}

/**
 * Global error handler middleware
 */
export function errorHandler(
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  // Log the error
  logger.error('Application error', {
    error: {
      message: err.message,
      stack: err.stack,
      code: err.code
    },
    request: {
      method: req.method,
      path: req.path,
      query: req.query,
      body: req.body
    }
  });

  // Determine status code
  const statusCode = err.statusCode || 500;

  // Don't expose internal errors in production
  const message =
    process.env.NODE_ENV === 'production' && statusCode === 500
      ? 'An internal server error occurred'
      : err.message;

  // Send error response
  res.status(statusCode).json({
    success: false,
    error: {
      code: err.code || 'INTERNAL_ERROR',
      message,
      ...(process.env.NODE_ENV === 'development' && {
        stack: err.stack,
        details: err.details
      })
    },
    meta: {
      timestamp: new Date().toISOString()
    }
  });
}

/**
 * 404 Not Found handler
 */
export function notFoundHandler(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: `Route ${req.method} ${req.path} not found`
    },
    meta: {
      timestamp: new Date().toISOString()
    }
  });
}

/**
 * Async error wrapper
 * Wraps async route handlers to catch errors
 */
export function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

/**
 * Create custom error
 */
export function createError(
  message: string,
  statusCode: number = 500,
  code?: string,
  details?: any
): AppError {
  const error = new Error(message) as AppError;
  error.statusCode = statusCode;
  error.code = code;
  error.details = details;
  return error;
}