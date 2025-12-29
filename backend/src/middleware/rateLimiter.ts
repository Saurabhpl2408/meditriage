// Rate Limiting Middleware

import rateLimit from 'express-rate-limit';
import { API_CONFIG } from '../config/constants';

/**
 * General API rate limiter
 * 100 requests per 15 minutes
 */
export const apiLimiter = rateLimit({
  windowMs: API_CONFIG.RATE_LIMIT.WINDOW_MS,
  max: API_CONFIG.RATE_LIMIT.MAX_REQUESTS,
  message: {
    success: false,
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many requests, please try again later'
    }
  },
  standardHeaders: true,
  legacyHeaders: false,
  // Skip rate limiting in test environment
  skip: () => process.env.NODE_ENV === 'test'
});

/**
 * Strict rate limiter for triage endpoint
 * 20 requests per 15 minutes (more CPU intensive)
 */
export const triageLimiter = rateLimit({
  windowMs: 900000, // 15 minutes
  max: 20,
  message: {
    success: false,
    error: {
      code: 'TRIAGE_RATE_LIMIT_EXCEEDED',
      message: 'Too many triage requests, please wait before trying again'
    }
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => process.env.NODE_ENV === 'test'
});

/**
 * Lenient rate limiter for symptom search
 * 200 requests per 15 minutes (less intensive)
 */
export const searchLimiter = rateLimit({
  windowMs: 900000, // 15 minutes
  max: 200,
  message: {
    success: false,
    error: {
      code: 'SEARCH_RATE_LIMIT_EXCEEDED',
      message: 'Too many search requests, please slow down'
    }
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => process.env.NODE_ENV === 'test'
});