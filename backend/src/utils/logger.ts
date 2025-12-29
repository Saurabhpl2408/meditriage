import winston from 'winston';
import path from 'path';

const { combine, timestamp, printf, colorize, errors, json } = winston.format;

// Custom log format
const logFormat = printf(({ level, message, timestamp, ...metadata }) => {
  let msg = `${timestamp} [${level}]: ${message}`;
  
  if (Object.keys(metadata).length > 0) {
    msg += ` ${JSON.stringify(metadata)}`;
  }
  
  return msg;
});

// Determine log level from environment
const logLevel = process.env.LOG_LEVEL || 'info';

// Create logger instance
const logger = winston.createLogger({
  level: logLevel,
  format: combine(
    errors({ stack: true }),
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    json()
  ),
  defaultMeta: {
    service: 'meditriage-backend',
    environment: process.env.NODE_ENV || 'development'
  },
  transports: []  // Start with empty, add conditionally
});

// Add file transports (may fail in some environments)
try {
  logger.add(new winston.transports.File({
    filename: path.join('logs', 'error.log'),
    level: 'error',
    maxsize: 5242880, // 5MB
    maxFiles: 5
  }));
  
  logger.add(new winston.transports.File({
    filename: path.join('logs', 'combined.log'),
    maxsize: 5242880, // 5MB
    maxFiles: 5
  }));
} catch (error) {
  console.warn('Warning: Could not create log files, logging to console only');
}

// Add console transport for development
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: combine(
      colorize(),
      timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      logFormat
    )
  }));
}

// Create a stream for Morgan (HTTP request logging)
export const stream = {
  write: (message: string) => {
    logger.http(message.trim());
  }
};

// Log uncaught exceptions (if file transport works)
try {
  logger.exceptions.handle(
    new winston.transports.File({ 
      filename: path.join('logs', 'exceptions.log'),
      maxsize: 5242880,
      maxFiles: 5
    })
  );
} catch (error) {
  // Fallback to console
}

// Log unhandled promise rejections (if file transport works)
try {
  logger.rejections.handle(
    new winston.transports.File({ 
      filename: path.join('logs', 'rejections.log'),
      maxsize: 5242880,
      maxFiles: 5
    })
  );
} catch (error) {
  // Fallback to console
}

// Helper functions for structured logging
export const logTriageEvent = (
  sessionId: string,
  urgency: string,
  responseTime: number
) => {
  logger.info('Triage completed', {
    sessionId,
    urgency,
    responseTime,
    event: 'triage_complete'
  });
};

export const logRedFlagDetected = (
  sessionId: string,
  redFlags: string[]
) => {
  logger.warn('Red flags detected', {
    sessionId,
    redFlags,
    event: 'red_flag_detection'
  });
};

export const logApiRequest = (
  method: string,
  path: string,
  statusCode: number,
  responseTime: number
) => {
  logger.http('API request', {
    method,
    path,
    statusCode,
    responseTime,
    event: 'api_request'
  });
};

export const logError = (
  error: Error,
  context?: Record<string, any>
) => {
  logger.error('Application error', {
    error: {
      message: error.message,
      stack: error.stack,
      name: error.name
    },
    ...context,
    event: 'error'
  });
};

export default logger;