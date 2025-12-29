// JSON-RPC 2.0 Handler

import { MCPRequest, MCPResponse, MCPError, MCPErrorCode } from '../types/mcp.types';
import { getToolHandler, getAllToolDefinitions, toolExists } from '../tools';
import logger, { logMCPRequest, logMCPResponse, logToolCall, logToolError } from '../utils/logger';
import backendClient from '../clients/backendClient';

/**
 * Handle JSON-RPC 2.0 request
 */
export async function handleRequest(request: MCPRequest): Promise<MCPResponse> {
  const startTime = Date.now();

  try {
    // Validate JSON-RPC version
    if (request.jsonrpc !== '2.0') {
      return createErrorResponse(
        request.id,
        MCPErrorCode.INVALID_REQUEST,
        'Invalid JSON-RPC version. Must be "2.0"'
      );
    }

    // Log request
    logMCPRequest(request.method, request.id);

    // Route to appropriate handler
    let result: any;

    switch (request.method) {
      case 'initialize':
        result = await handleInitialize(request.params);
        break;

      case 'tools/list':
        result = await handleToolsList();
        break;

      case 'tools/call':
        result = await handleToolCall(request.params);
        break;

      case 'ping':
        result = { status: 'pong', timestamp: new Date().toISOString() };
        break;

      default:
        return createErrorResponse(
          request.id,
          MCPErrorCode.METHOD_NOT_FOUND,
          `Method "${request.method}" not found`
        );
    }

    const duration = Date.now() - startTime;
    logMCPResponse(request.id, true, duration);

    return {
      jsonrpc: '2.0',
      id: request.id,
      result
    };
  } catch (error: any) {
    const duration = Date.now() - startTime;
    logMCPResponse(request.id, false, duration);

    logger.error('JSON-RPC request failed', {
      method: request.method,
      error: error.message
    });

    return createErrorResponse(
      request.id,
      MCPErrorCode.INTERNAL_ERROR,
      error.message,
      process.env.ENABLE_ERROR_DETAILS === 'true' ? error.stack : undefined
    );
  }
}

/**
 * Handle initialize method
 */
async function handleInitialize(params: any) {
  logger.info('MCP server initializing', { clientInfo: params });

  // Test backend connection
  try {
    await backendClient.healthCheck();
    logger.info('Backend connection verified');
  } catch (error) {
    logger.warn('Backend connection failed during initialization', { error });
  }

  return {
    protocolVersion: process.env.MCP_PROTOCOL_VERSION || '2024-11-05',
    capabilities: {
      tools: {
        listChanged: false
      }
    },
    serverInfo: {
      name: process.env.MCP_SERVER_NAME || 'meditriage-mcp',
      version: process.env.MCP_SERVER_VERSION || '1.0.0'
    },
    instructions: 'MediTriage Medical Triage System - Use tools to analyze symptoms and provide medical guidance. Always prioritize patient safety and recommend emergency care when appropriate.'
  };
}

/**
 * Handle tools/list method
 */
async function handleToolsList() {
  const tools = getAllToolDefinitions();

  logger.debug('Returning tool list', { count: tools.length });

  return {
    tools
  };
}

/**
 * Handle tools/call method
 */
async function handleToolCall(params: any) {
  const { name, arguments: args } = params;

  if (!name) {
    throw new Error('Tool name is required');
  }

  if (!toolExists(name)) {
    throw new Error(`Tool "${name}" not found. Available tools: ${Object.keys(getAllToolDefinitions()).join(', ')}`);
  }

  const handler = getToolHandler(name);
  if (!handler) {
    throw new Error(`Handler for tool "${name}" not found`);
  }

  logger.info('Calling tool', { tool: name, params: args });

  const toolStartTime = Date.now();

  try {
    const result = await handler(args || {});
    const toolDuration = Date.now() - toolStartTime;

    logToolCall(name, args, toolDuration);

    return result;
  } catch (error: any) {
    logToolError(name, error);
    throw error;
  }
}

/**
 * Create error response
 */
function createErrorResponse(
  id: string | number,
  code: MCPErrorCode,
  message: string,
  data?: any
): MCPResponse {
  const error: MCPError = {
    code,
    message,
    ...(data && { data })
  };

  return {
    jsonrpc: '2.0',
    id,
    error
  };
}

/**
 * Batch request handler
 */
export async function handleBatchRequest(requests: MCPRequest[]): Promise<MCPResponse[]> {
  logger.info('Handling batch request', { count: requests.length });

  const responses = await Promise.all(
    requests.map(request => handleRequest(request))
  );

  return responses;
}