// Condition Lookup Tool

import backendClient from '../clients/backendClient';
import { MCPToolResult, ConditionLookupParams } from '../types/mcp.types';
import logger from '../utils/logger';

export const TOOL_DEFINITION = {
  name: 'lookup_condition',
  description: 'Look up detailed information about a specific medical condition, including symptoms, risk factors, complications, and typical urgency level. Use this when patient asks about a specific disease or condition.',
  inputSchema: {
    type: 'object',
    properties: {
      conditionName: {
        type: 'string',
        description: 'Name of the medical condition to look up. Examples: "pneumonia", "diabetes", "migraine", "heart attack"'
      },
      includeSymptoms: {
        type: 'boolean',
        description: 'Include associated symptoms in the result (default: true)'
      }
    },
    required: ['conditionName']
  }
};

export async function handler(params: ConditionLookupParams): Promise<MCPToolResult> {
  const startTime = Date.now();

  try {
    logger.info('Looking up condition', { condition: params.conditionName });

    // Search for the condition using symptom search endpoint as proxy
    // In a full implementation, you'd have a dedicated condition search endpoint
    const searchResponse = await backendClient.searchSymptoms({
      query: params.conditionName,
      limit: 50
    });

    // For this demo, we'll perform a triage with the condition name
    // to get related information. In production, add a dedicated condition endpoint.
    const triageResponse = await backendClient.performTriage({
      symptoms: [{
        symptomName: params.conditionName,
        severity: 'MODERATE'
      }],
      sessionId: `condition_lookup_${Date.now()}`
    });

    const duration = Date.now() - startTime;

    logger.info('Condition lookup completed', {
      condition: params.conditionName,
      duration
    });

    // Format result
    let resultText = `# 📚 MEDICAL CONDITION INFORMATION\n\n`;
    resultText += `## Condition: ${params.conditionName.toUpperCase()}\n\n`;

    if (triageResponse.success && triageResponse.data.topConditions.length > 0) {
      const conditions = triageResponse.data.topConditions;
      
      // Find best match
      const bestMatch = conditions.find((c: any) => 
        c.condition.name.toLowerCase().includes(params.conditionName.toLowerCase()) ||
        params.conditionName.toLowerCase().includes(c.condition.name.toLowerCase())
      ) || conditions[0];

      const condition = bestMatch.condition;

      resultText += `### 📋 Overview\n`;
      resultText += `**Name:** ${condition.name}\n`;
      resultText += `**Description:** ${condition.description}\n`;
      resultText += `**Category:** ${condition.category}\n`;
      resultText += `**ICD-10 Code:** ${condition.icd10Code || 'N/A'}\n`;
      resultText += `**Prevalence:** ${condition.prevalence}\n\n`;

      resultText += `### ⚠️ Urgency Level\n`;
      resultText += `**Typical Urgency:** ${condition.typicalUrgency}\n\n`;

      const urgencyGuidance: Record<string, string> = {
        EMERGENCY: '🚨 This is a medical emergency. Call 911 immediately.',
        URGENT: '⚠️ Seek medical care within 4-6 hours.',
        NON_URGENT: '📋 Schedule an appointment with your doctor.',
        SELF_CARE: '🏠 May be manageable with self-care and monitoring.'
      };

      resultText += `${urgencyGuidance[condition.typicalUrgency] || 'Consult a healthcare professional.'}\n\n`;

      // Age Groups
      if (condition.ageGroups && condition.ageGroups.length > 0) {
        resultText += `### 👥 Affected Age Groups\n`;
        condition.ageGroups.forEach((age: string) => {
          resultText += `- ${age}\n`;
        });
        resultText += '\n';
      }

      // Risk Factors
      if (condition.riskFactors && condition.riskFactors.length > 0) {
        resultText += `### 🎯 Risk Factors\n`;
        condition.riskFactors.forEach((risk: string) => {
          resultText += `- ${risk}\n`;
        });
        resultText += '\n';
      }

      // Complications
      if (condition.complications && condition.complications.length > 0) {
        resultText += `### ⚡ Potential Complications\n`;
        condition.complications.forEach((comp: string) => {
          resultText += `- ${comp}\n`;
        });
        resultText += '\n';
      }

      // Associated Symptoms
      if (params.includeSymptoms !== false && bestMatch.matchingSymptoms) {
        resultText += `### 🔍 Common Symptoms\n`;
        bestMatch.matchingSymptoms.forEach((symptom: string) => {
          resultText += `- ${symptom}\n`;
        });
        resultText += '\n';
      }

      // Similar conditions
      if (conditions.length > 1) {
        resultText += `### 🔗 Related Conditions\n`;
        conditions.slice(1, 4).forEach((c: any) => {
          resultText += `- ${c.condition.name} (${Math.round(c.matchScore * 100)}% related)\n`;
        });
        resultText += '\n';
      }

    } else {
      resultText += `⚠️ **Condition Not Found**\n\n`;
      resultText += `Could not find detailed information for "${params.conditionName}".\n\n`;
      resultText += `**Suggestions:**\n`;
      resultText += `- Check spelling\n`;
      resultText += `- Try alternative names (e.g., "heart attack" vs "myocardial infarction")\n`;
      resultText += `- Use symptom search tool instead\n`;
    }

    resultText += `---\n\n`;
    resultText += `⚠️ **Disclaimer:** This information is for educational purposes only. `;
    resultText += `Always consult healthcare professionals for medical advice, diagnosis, or treatment.`;

    return {
      content: [{
        type: 'text',
        text: resultText
      }]
    };
  } catch (error: any) {
    logger.error('Condition lookup failed', { error, params });

    return {
      content: [{
        type: 'text',
        text: `Error looking up condition: ${error.message}\n\nPlease try again or use the symptom search tool.`
      }],
      isError: true
    };
  }
}