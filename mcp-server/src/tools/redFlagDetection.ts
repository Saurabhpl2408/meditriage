// Red Flag Detection Tool

import backendClient from '../clients/backendClient';
import { MCPToolResult, RedFlagCheckParams } from '../types/mcp.types';
import logger from '../utils/logger';

export const TOOL_DEFINITION = {
  name: 'check_red_flags',
  description: 'Check if any symptoms are red flags (emergency warning signs) that require immediate medical attention. Use this tool when you need to quickly assess if symptoms are life-threatening.',
  inputSchema: {
    type: 'object',
    properties: {
      symptoms: {
        type: 'array',
        items: { type: 'string' },
        description: 'List of symptom names to check for red flags. Examples: ["chest pain", "difficulty breathing", "severe headache"]'
      }
    },
    required: ['symptoms']
  }
};

export async function handler(params: RedFlagCheckParams): Promise<MCPToolResult> {
  const startTime = Date.now();

  try {
    logger.info('Checking for red flags', {
      symptomCount: params.symptoms.length
    });

    // Get all red flag symptoms from backend
    const response = await backendClient.getRedFlags();

    if (!response.success) {
      throw new Error(response.error?.message || 'Failed to fetch red flags');
    }

    const redFlags = response.data;
    const redFlagNames = redFlags.map((rf: any) => rf.name.toLowerCase());

    // Check which symptoms are red flags
    const detectedRedFlags: string[] = [];
    const normalSymptoms: string[] = [];

    params.symptoms.forEach(symptom => {
      const normalized = symptom.toLowerCase().trim();
      const isRedFlag = redFlagNames.some((rf: string) =>
        rf === normalized ||
        rf.includes(normalized) ||
        normalized.includes(rf)
      );

      if (isRedFlag) {
        detectedRedFlags.push(symptom);
      } else {
        normalSymptoms.push(symptom);
      }
    });

    const duration = Date.now() - startTime;

    logger.info('Red flag check completed', {
      detectedCount: detectedRedFlags.length,
      duration
    });

    // Format result
    let resultText = '# 🚨 RED FLAG CHECK RESULTS\n\n';

    if (detectedRedFlags.length > 0) {
      resultText += `## ⚠️ EMERGENCY SYMPTOMS DETECTED (${detectedRedFlags.length})\n\n`;
      resultText += `**IMMEDIATE ACTION REQUIRED:**\n\n`;

      detectedRedFlags.forEach(symptom => {
        resultText += `- 🚨 **${symptom.toUpperCase()}** - This is a red flag symptom\n`;
      });

      resultText += `\n**🚨 CALL 911 OR GO TO EMERGENCY ROOM IMMEDIATELY**\n\n`;
      resultText += `These symptoms may indicate a life-threatening condition:\n`;
      resultText += `- Stroke\n`;
      resultText += `- Heart attack\n`;
      resultText += `- Severe bleeding\n`;
      resultText += `- Anaphylaxis\n`;
      resultText += `- Other medical emergencies\n\n`;
      resultText += `⏱️ **TIME IS CRITICAL** - Do not delay seeking emergency care.\n\n`;
    } else {
      resultText += `## ✅ NO RED FLAGS DETECTED\n\n`;
      resultText += `None of the symptoms checked are classified as immediate red flags.\n\n`;
      resultText += `**However:**\n`;
      resultText += `- This does not mean the symptoms are not serious\n`;
      resultText += `- Use the \`perform_triage\` tool for complete assessment\n`;
      resultText += `- If symptoms worsen, seek medical attention\n\n`;
    }

    if (normalSymptoms.length > 0) {
      resultText += `### Non-Emergency Symptoms Checked:\n`;
      normalSymptoms.forEach(symptom => {
        resultText += `- ${symptom}\n`;
      });
      resultText += '\n';
    }

    resultText += `---\n\n`;
    resultText += `**All Red Flag Symptoms (${redFlags.length} total):**\n`;
    redFlags.forEach((rf: any) => {
      resultText += `- ${rf.name}: ${rf.description}\n`;
    });

    return {
      content: [{
        type: 'text',
        text: resultText
      }]
    };
  } catch (error: any) {
    logger.error('Red flag check failed', { error, params });

    return {
      content: [{
        type: 'text',
        text: `Error checking red flags: ${error.message}\n\n⚠️ If you suspect a medical emergency, call 911 immediately regardless of tool errors.`
      }],
      isError: true
    };
  }
}