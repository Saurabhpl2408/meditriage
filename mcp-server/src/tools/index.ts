// Medical Tools Registry

import * as symptomSearch from './symptomSearch';
import * as triageAnalysis from './triageAnalysis';
import * as redFlagDetection from './redFlagDetection';
import * as conditionLookup from './conditionLookup';
import * as selfCareRecommendations from './selfCareRecommendations';

import { MCPToolDefinition, ToolHandler } from '../types/mcp.types';

export interface ToolRegistration {
  definition: MCPToolDefinition;
  handler: ToolHandler;
}

// Registry of all available tools
export const TOOLS: Record<string, ToolRegistration> = {
  search_symptoms: {
    definition: symptomSearch.TOOL_DEFINITION,
    handler: symptomSearch.handler
  },
  perform_triage: {
    definition: triageAnalysis.TOOL_DEFINITION,
    handler: triageAnalysis.handler
  },
  check_red_flags: {
    definition: redFlagDetection.TOOL_DEFINITION,
    handler: redFlagDetection.handler
  },
  lookup_condition: {
    definition: conditionLookup.TOOL_DEFINITION,
    handler: conditionLookup.handler
  },
  get_self_care_advice: {
    definition: selfCareRecommendations.TOOL_DEFINITION,
    handler: selfCareRecommendations.handler
  }
};

// Get all tool definitions
export function getAllToolDefinitions(): MCPToolDefinition[] {
  return Object.values(TOOLS).map(tool => tool.definition);
}

// Get tool handler by name
export function getToolHandler(toolName: string): ToolHandler | null {
  const tool = TOOLS[toolName];
  return tool ? tool.handler : null;
}

// Check if tool exists
export function toolExists(toolName: string): boolean {
  return toolName in TOOLS;
}