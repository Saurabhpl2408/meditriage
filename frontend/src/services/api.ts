import axios, { AxiosInstance, AxiosError } from 'axios';

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1';
export const MCP_BASE_URL = import.meta.env.VITE_MCP_BASE_URL || 'http://localhost:3001/rpc';
export const RAG_BASE_URL = import.meta.env.VITE_RAG_BASE_URL || 'http://localhost:8000';

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
});

export const mcpClient: AxiosInstance = axios.create({
  baseURL: MCP_BASE_URL,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
});

export const ragClient: AxiosInstance = axios.create({
  baseURL: RAG_BASE_URL,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
});

[apiClient, mcpClient, ragClient].forEach(client => {
  client.interceptors.response.use(
    response => response,
    (error: AxiosError) => {
      if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
        const service = error.config?.baseURL?.includes('3000') ? 'Backend API (3000)' :
                       error.config?.baseURL?.includes('3001') ? 'MCP Server (3001)' :
                       'RAG Service (8000)';
        throw new Error(`Cannot connect to ${service}. Is it running?`);
      }
      return Promise.reject(error);
    }
  );
});

export function handleApiError(error: unknown): string {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.error?.message || error.message;
  }
  if (error instanceof Error) return error.message;
  return 'An unexpected error occurred';
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  meta?: {
    timestamp: string;
    responseTime?: string;
    sessionId?: string;
  };
}

export interface MCPRequest {
  jsonrpc: '2.0';
  id: number;
  method: string;
  params?: any;
}

export interface MCPResponse<T> {
  jsonrpc: '2.0';
  id: number;
  result?: T;
  error?: {
    code: number;
    message: string;
    data?: any;
  };
}