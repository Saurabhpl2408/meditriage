// Self-Care Recommendations Tool

import backendClient from '../clients/backendClient';
import { MCPToolResult, SelfCareParams } from '../types/mcp.types';
import logger from '../utils/logger';

export const TOOL_DEFINITION = {
  name: 'get_self_care_advice',
  description: 'Get evidence-based self-care recommendations for mild symptoms that can be managed at home. Only use this for NON-URGENT or SELF-CARE level symptoms, never for emergencies.',
  inputSchema: {
    type: 'object',
    properties: {
      symptomName: {
        type: 'string',
        description: 'Name of the symptom to get self-care advice for. Examples: "headache", "common cold", "mild fever"'
      },
      severity: {
        type: 'string',
        enum: ['MILD', 'MODERATE'],
        description: 'Severity of the symptom (only MILD or MODERATE - do not use for SEVERE or CRITICAL)'
      }
    },
    required: ['symptomName', 'severity']
  }
};

// Self-care recommendations database (in production, this would come from backend)
const SELF_CARE_RECOMMENDATIONS: Record<string, any> = {
  'headache': {
    title: 'Headache Self-Care',
    recommendations: [
      'Rest in a quiet, dark room',
      'Apply cold or warm compress to head or neck',
      'Stay hydrated - drink plenty of water',
      'Take over-the-counter pain reliever (acetaminophen or ibuprofen)',
      'Practice relaxation techniques or gentle neck stretches',
      'Avoid bright lights and loud noises',
      'Get adequate sleep (7-9 hours)'
    ],
    duration: 'Try these measures for 24-48 hours',
    warningSigns: [
      'Sudden severe headache ("worst headache of life")',
      'Headache with fever, stiff neck, confusion',
      'Headache after head injury',
      'Progressively worsening headache',
      'New headache in people over 50'
    ],
    whenToSeekCare: 'If headache persists beyond 48 hours or warning signs appear'
  },
  'fever': {
    title: 'Fever Self-Care',
    recommendations: [
      'Rest and stay home',
      'Drink plenty of fluids (water, broth, electrolyte drinks)',
      'Take acetaminophen or ibuprofen as directed',
      'Dress in light clothing',
      'Use lukewarm bath or sponge bath (not cold)',
      'Monitor temperature every few hours',
      'Eat light, nutritious foods when hungry'
    ],
    duration: 'Monitor for 24-48 hours',
    warningSigns: [
      'Fever above 103°F (39.4°C)',
      'Fever lasting more than 3 days',
      'Difficulty breathing',
      'Severe headache or stiff neck',
      'Confusion or difficulty waking',
      'Persistent vomiting'
    ],
    whenToSeekCare: 'If fever is very high, lasts >3 days, or warning signs appear'
  },
  'common cold': {
    title: 'Common Cold Self-Care',
    recommendations: [
      'Get plenty of rest',
      'Stay hydrated - drink warm liquids like tea or soup',
      'Gargle with salt water for sore throat',
      'Use saline nasal drops or spray',
      'Run a humidifier to add moisture to air',
      'Take over-the-counter cold medications as needed',
      'Wash hands frequently to prevent spread'
    ],
    duration: 'Symptoms typically improve in 7-10 days',
    warningSigns: [
      'Symptoms lasting more than 10 days',
      'High fever (>101.5°F)',
      'Severe sore throat',
      'Difficulty breathing',
      'Persistent cough with colored mucus'
    ],
    whenToSeekCare: 'If symptoms worsen or don\'t improve after 10 days'
  },
  'sore throat': {
    title: 'Sore Throat Self-Care',
    recommendations: [
      'Gargle with warm salt water (1/2 tsp salt in 8 oz water)',
      'Drink warm liquids (tea with honey, warm water with lemon)',
      'Use throat lozenges or hard candy',
      'Take over-the-counter pain reliever',
      'Use a humidifier',
      'Rest your voice',
      'Avoid irritants (smoke, strong odors)'
    ],
    duration: 'Usually improves in 3-7 days',
    warningSigns: [
      'Difficulty swallowing or breathing',
      'Severe pain on one side',
      'Fever above 101°F',
      'Rash',
      'Blood in saliva or phlegm',
      'Symptoms lasting more than a week'
    ],
    whenToSeekCare: 'If symptoms are severe or persist beyond 7 days'
  },
  'runny nose': {
    title: 'Runny Nose Self-Care',
    recommendations: [
      'Stay hydrated',
      'Use saline nasal spray',
      'Apply warm compress to sinuses',
      'Use steam inhalation',
      'Keep head elevated when sleeping',
      'Blow nose gently, one nostril at a time',
      'Wash hands frequently'
    ],
    duration: 'Usually resolves in 7-10 days',
    warningSigns: [
      'Thick, colored nasal discharge persisting >10 days',
      'Facial pain or pressure',
      'High fever',
      'Symptoms worsening after initial improvement'
    ],
    whenToSeekCare: 'If symptoms persist >10 days or worsen'
  }
};

export async function handler(params: SelfCareParams): Promise<MCPToolResult> {
  const startTime = Date.now();

  try {
    logger.info('Getting self-care recommendations', {
      symptom: params.symptomName,
      severity: params.severity
    });

    // Safety check - never provide self-care for severe symptoms
    if (params.severity === 'SEVERE' || params.severity === 'CRITICAL') {
      return {
        content: [{
          type: 'text',
          text: `⚠️ **ERROR: SEVERITY TOO HIGH FOR SELF-CARE**\n\n` +
                `Self-care advice is NOT appropriate for ${params.severity} symptoms.\n\n` +
                `**URGENT ACTION REQUIRED:**\n` +
                `- Use the \`perform_triage\` tool instead\n` +
                `- Patient should seek immediate medical attention\n` +
                `- Do not delay professional medical care`
        }],
        isError: true
      };
    }

    // Normalize symptom name
    const normalizedSymptom = params.symptomName.toLowerCase().trim();
    
    // Find matching recommendation
    let advice = SELF_CARE_RECOMMENDATIONS[normalizedSymptom];
    
    // Try fuzzy matching
    if (!advice) {
      const matchedKey = Object.keys(SELF_CARE_RECOMMENDATIONS).find(key =>
        normalizedSymptom.includes(key) || key.includes(normalizedSymptom)
      );
      if (matchedKey) {
        advice = SELF_CARE_RECOMMENDATIONS[matchedKey];
      }
    }

    const duration = Date.now() - startTime;

    logger.info('Self-care recommendations retrieved', {
      symptom: params.symptomName,
      found: !!advice,
      duration
    });

    let resultText = '# 🏠 SELF-CARE RECOMMENDATIONS\n\n';

    if (advice) {
      resultText += `## ${advice.title}\n\n`;
      resultText += `**Symptom:** ${params.symptomName}\n`;
      resultText += `**Severity:** ${params.severity}\n\n`;

      resultText += `### ✅ Recommended Actions\n`;
      advice.recommendations.forEach((rec: string, index: number) => {
        resultText += `${index + 1}. ${rec}\n`;
      });
      resultText += '\n';

      resultText += `### ⏱️ Duration\n`;
      resultText += `${advice.duration}\n\n`;

      resultText += `### 🚨 WARNING SIGNS - Seek Medical Care If:\n`;
      advice.warningSigns.forEach((sign: string) => {
        resultText += `- ${sign}\n`;
      });
      resultText += '\n';

      resultText += `### 📞 When to Seek Professional Care\n`;
      resultText += `${advice.whenToSeekCare}\n\n`;
    } else {
      resultText += `⚠️ **No Specific Self-Care Advice Available**\n\n`;
      resultText += `No specific recommendations found for "${params.symptomName}".\n\n`;
      resultText += `**General Self-Care Guidelines:**\n`;
      resultText += `- Rest and stay hydrated\n`;
      resultText += `- Monitor symptoms closely\n`;
      resultText += `- Use over-the-counter medications as directed\n`;
      resultText += `- Seek medical attention if symptoms worsen\n\n`;
      resultText += `**Recommendation:** Use the \`perform_triage\` tool for a comprehensive assessment.\n\n`;
    }

    resultText += `---\n\n`;
    resultText += `⚠️ **IMPORTANT REMINDERS:**\n`;
    resultText += `- Self-care is appropriate only for MILD to MODERATE symptoms\n`;
    resultText += `- Always seek professional medical advice for:\n`;
    resultText += `  - Symptoms that worsen or don't improve\n`;
    resultText += `  - New or concerning symptoms\n`;
    resultText += `  - Any emergency warning signs\n`;
    resultText += `- This advice does not replace professional medical consultation\n`;
    resultText += `- When in doubt, contact your healthcare provider`;

    return {
      content: [{
        type: 'text',
        text: resultText
      }]
    };
  } catch (error: any) {
    logger.error('Self-care recommendations failed', { error, params });

    return {
      content: [{
        type: 'text',
        text: `Error retrieving self-care recommendations: ${error.message}\n\nPlease consult a healthcare professional for personalized advice.`
      }],
      isError: true
    };
  }
}