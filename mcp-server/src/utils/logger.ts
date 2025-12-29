// MCP Server Logger

import winston from 'winston';

const { combine, timestamp, printf, colorize } = winston.format;

const logFormat = printf(({ level, message, timestamp, ...metadata }) => {
  let msg = `${timestamp} [${level}]: ${message}`;
  if (Object.keys(metadata).length > 0) {
    msg += ` ${JSON.stringify(metadata)}`;
  }
  return msg;
});

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.json()
  ),
  defaultMeta: {
    service: 'meditriage-mcp-server'
  },
  transports: []
});

// Console transport for all environments
logger.add(new winston.transports.Console({
  format: combine(
    colorize(),
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    logFormat
  )
}));

// Helper functions
export const logToolCall = (toolName: string, params: any, duration: number) => {
  logger.info('Tool called', {
    tool: toolName,
    params,
    duration,
    event: 'tool_call'
  });
};

export const logToolError = (toolName: string, error: Error) => {
  logger.error('Tool error', {
    tool: toolName,
    error: {
      message: error.message,
      stack: error.stack
    },
    event: 'tool_error'
  });
};

export const logMCPRequest = (method: string, id: string | number) => {
  logger.debug('MCP request received', {
    method,
    id,
    event: 'mcp_request'
  });
};

export const logMCPResponse = (id: string | number, success: boolean, duration: number) => {
  logger.debug('MCP response sent', {
    id,
    success,
    duration,
    event: 'mcp_response'
  });
};

export default logger;