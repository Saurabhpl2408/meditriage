// Triage Analysis Tool

import backendClient from '../clients/backendClient';
import { MCPToolResult, TriageAnalysisParams } from '../types/mcp.types';
import logger from '../utils/logger';

export const TOOL_DEFINITION = {
  name: 'perform_triage',
  description: 'Perform medical triage analysis on patient symptoms. Analyzes urgency level, detects red flags, matches conditions, and provides recommendations. CRITICAL: Always use this tool when a patient describes their symptoms.',
  inputSchema: {
    type: 'object',
    properties: {
      symptoms: {
        type: 'array',
        description: 'Array of patient symptoms with severity',
        items: {
          type: 'object',
          properties: {
            symptomName: {
              type: 'string',
              description: 'Name of the symptom (e.g., "fever", "chest pain")'
            },
            severity: {
              type: 'string',
              enum: ['MILD', 'MODERATE', 'SEVERE', 'CRITICAL'],
              description: 'Severity level of the symptom'
            },
            duration: {
              type: 'string',
              description: 'How long the symptom has been present (optional)'
            },
            notes: {
              type: 'string',
              description: 'Additional notes about the symptom (optional)'
            }
          },
          required: ['symptomName', 'severity']
        }
      },
      ageGroup: {
        type: 'string',
        description: 'Patient age group',
        enum: ['infant', 'toddler', 'child', 'adolescent', 'adult', 'elderly']
      },
      existingConditions: {
        type: 'array',
        items: { type: 'string' },
        description: 'Pre-existing medical conditions (optional)'
      },
      medications: {
        type: 'array',
        items: { type: 'string' },
        description: 'Current medications (optional)'
      }
    },
    required: ['symptoms']
  }
};

export async function handler(params: TriageAnalysisParams): Promise<MCPToolResult> {
  const startTime = Date.now();

  try {
    logger.info('Performing triage analysis', {
      symptomCount: params.symptoms.length,
      ageGroup: params.ageGroup
    });

    // Validate symptoms
    if (!params.symptoms || params.symptoms.length === 0) {
      throw new Error('At least one symptom is required for triage');
    }

    // Call backend API
    const response = await backendClient.performTriage({
      symptoms: params.symptoms,
      ageGroup: params.ageGroup,
      existingConditions: params.existingConditions,
      medications: params.medications,
      sessionId: `mcp_${Date.now()}`
    });

    if (!response.success) {
      throw new Error(response.error?.message || 'Triage analysis failed');
    }

    const result = response.data;
    const duration = Date.now() - startTime;

    logger.info('Triage analysis completed', {
      urgencyLevel: result.urgencyLevel,
      redFlags: result.redFlagsDetected.length,
      duration
    });

    // Format comprehensive result
    let resultText = '# 🏥 MEDICAL TRIAGE ASSESSMENT\n\n';

    // Urgency Level
    const urgencyEmoji: Record<string, string> = {
      EMERGENCY: '🚨',
      URGENT: '⚠️',
      NON_URGENT: '📋',
      SELF_CARE: '🏠'
    };

    resultText += `## ${urgencyEmoji[result.urgencyLevel] || '📋'} URGENCY LEVEL: ${result.urgencyLevel}\n\n`;

    // Red Flags
    if (result.redFlagsDetected && result.redFlagsDetected.length > 0) {
      resultText += `### ⚠️ CRITICAL WARNING SIGNS DETECTED:\n`;
      result.redFlagsDetected.forEach((flag: string) => {
        resultText += `- **${flag}**\n`;
      });
      resultText += '\n';
    }

    // Recommendation
    resultText += `### 📋 RECOMMENDATION:\n${result.recommendation}\n\n`;

    // Matched Conditions
    if (result.topConditions && result.topConditions.length > 0) {
      resultText += `### 🔍 POSSIBLE CONDITIONS:\n`;
      result.topConditions.slice(0, 3).forEach((match: any, index: number) => {
        const percentage = Math.round(match.matchScore * 100);
        resultText += `${index + 1}. **${match.condition.name}** (${percentage}% match)\n`;
        resultText += `   - ${match.condition.description}\n`;
        resultText += `   - Typical Urgency: ${match.condition.typicalUrgency}\n`;
        resultText += `   - Matching Symptoms: ${match.matchingSymptoms.join(', ')}\n\n`;
      });
    }

    // Reasoning
    resultText += `### 💭 ANALYSIS:\n${result.reasoning}\n\n`;

    // Response Time
    resultText += `### ⏱️ RESPONSE TIME GUIDANCE:\n`;
    resultText += `${result.estimatedResponseTime}\n\n`;

    // Confidence
    resultText += `### 📊 ASSESSMENT CONFIDENCE:\n`;
    resultText += `${Math.round(result.confidence * 100)}%\n\n`;

    // Disclaimer
    resultText += `---\n\n`;
    resultText += `⚠️ **IMPORTANT MEDICAL DISCLAIMER:**\n`;
    resultText += `${result.disclaimer}\n`;

    return {
      content: [{
        type: 'text',
        text: resultText
      }]
    };
  } catch (error: any) {
    logger.error('Triage analysis failed', { error, params });

    return {
      content: [{
        type: 'text',
        text: `Error performing triage analysis: ${error.message}\n\nIf you are experiencing a medical emergency, please call 911 immediately.`
      }],
      isError: true
    };
  }
}