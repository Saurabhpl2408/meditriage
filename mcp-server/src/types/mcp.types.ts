// MCP (Model Context Protocol) Type Definitions

export interface MCPRequest {
  jsonrpc: '2.0';
  id: string | number;
  method: string;
  params?: any;
}

export interface MCPResponse {
  jsonrpc: '2.0';
  id: string | number;
  result?: any;
  error?: MCPError;
}

export interface MCPError {
  code: number;
  message: string;
  data?: any;
}

export interface MCPToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: 'object' | string;
    properties: Record<string, any>;
    required?: string[];
  };
}

export interface MCPToolCall {
  name: string;
  arguments: Record<string, any>;
}

export interface MCPToolResult {
  content: Array<{
    type: 'text' | 'image' | 'resource';
    text?: string;
    data?: string;
    mimeType?: string;
  }>;
  isError?: boolean;
}

// Medical Tool Types
export interface SymptomSearchParams {
  query: string;
  limit?: number;
  bodySystem?: string;
  redFlagOnly?: boolean;
}

export interface TriageAnalysisParams {
  symptoms: Array<{
    symptomName: string;
    severity: 'MILD' | 'MODERATE' | 'SEVERE' | 'CRITICAL';
    duration?: string;
    notes?: string;
  }>;
  ageGroup?: string;
  existingConditions?: string[];
  medications?: string[];
}

export interface RedFlagCheckParams {
  symptoms: string[];
}

export interface ConditionLookupParams {
  conditionName: string;
  includeSymptoms?: boolean;
}

export interface SelfCareParams {
  symptomName: string;
  severity: string;
}

// MCP Server Configuration
export interface MCPServerConfig {
  name: string;
  version: string;
  protocolVersion: string;
  capabilities: {
    tools: boolean;
    prompts: boolean;
    resources: boolean;
  };
}

// Tool Handler Type
export type ToolHandler = (params: any) => Promise<MCPToolResult>;

// Error Codes (JSON-RPC 2.0 standard)
export enum MCPErrorCode {
  PARSE_ERROR = -32700,
  INVALID_REQUEST = -32600,
  METHOD_NOT_FOUND = -32601,
  INVALID_PARAMS = -32602,
  INTERNAL_ERROR = -32603,
  SERVER_ERROR = -32000,
  TOOL_ERROR = -32001,
  BACKEND_ERROR = -32002
}