// Symptom Search Tool

import backendClient from '../clients/backendClient';
import { MCPToolResult, SymptomSearchParams } from '../types/mcp.types';
import logger from '../utils/logger';

export const TOOL_DEFINITION = {
  name: 'search_symptoms',
  description: 'Search for medical symptoms by name or keywords. Returns matching symptoms with details about severity, body system, and red flag status.',
  inputSchema: {
    type: 'object',
    properties: {
      query: {
        type: 'string',
        description: 'Search query (symptom name or keyword). Examples: "fever", "chest pain", "headache"'
      },
      limit: {
        type: 'number',
        description: 'Maximum number of results to return (default: 10)',
        minimum: 1,
        maximum: 50
      },
      bodySystem: {
        type: 'string',
        description: 'Filter by body system',
        enum: [
          'cardiovascular',
          'respiratory',
          'gastrointestinal',
          'neurological',
          'musculoskeletal',
          'dermatological',
          'urologic',
          'general'
        ]
      },
      redFlagOnly: {
        type: 'boolean',
        description: 'Only return red flag (emergency) symptoms'
      }
    },
    required: ['query']
  }
};

export async function handler(params: SymptomSearchParams): Promise<MCPToolResult> {
  const startTime = Date.now();

  try {
    logger.info('Searching symptoms', { query: params.query });

    // Call backend API
    const response = await backendClient.searchSymptoms({
      query: params.query,
      limit: params.limit || 10,
      bodySystem: params.bodySystem,
      redFlagOnly: params.redFlagOnly
    });

    if (!response.success) {
      throw new Error(response.error?.message || 'Search failed');
    }

    const symptoms = response.data.symptoms;
    const duration = Date.now() - startTime;

    logger.info('Symptom search completed', {
      query: params.query,
      resultCount: symptoms.length,
      duration
    });

    // Format results as text
    let resultText = `Found ${symptoms.length} symptom(s) matching "${params.query}":\n\n`;

    if (symptoms.length === 0) {
      resultText += 'No symptoms found. Try a different search term or check spelling.';
    } else {
      symptoms.forEach((symptom: any, index: number) => {
        resultText += `${index + 1}. **${symptom.name}**\n`;
        resultText += `   - Description: ${symptom.description}\n`;
        resultText += `   - Body System: ${symptom.bodySystem}\n`;
        resultText += `   - Default Severity: ${symptom.defaultSeverity}\n`;
        
        if (symptom.isRedFlag) {
          resultText += `   - ⚠️ **RED FLAG - Emergency Symptom**\n`;
        }
        
        if (symptom.commonNames && symptom.commonNames.length > 0) {
          resultText += `   - Also known as: ${symptom.commonNames.join(', ')}\n`;
        }
        
        resultText += '\n';
      });
    }

    return {
      content: [{
        type: 'text',
        text: resultText
      }]
    };
  } catch (error: any) {
    logger.error('Symptom search failed', { error, params });

    return {
      content: [{
        type: 'text',
        text: `Error searching symptoms: ${error.message}`
      }],
      isError: true
    };
  }
}