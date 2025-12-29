// Core Triage Service - The heart of MediTriage

import { query } from '../config/database';
import {
  TriageRequest,
  TriageResult,
  PatientSymptom,
  Condition,
  ConditionMatch,
  UrgencyLevel
} from '../types/triage.types';
import { detectRedFlags, getEmergencyMessage } from './redFlagService';
import {
  calculateSymptomScore,
  calculateConditionUrgencyScore,
  calculateTriageScore,
  calculateConditionMatchScore,
  calculateConfidence,
  calculateAverageRelevance,
  normalizeSymptomName
} from '../utils/scoring';
import { DISCLAIMERS, RESPONSE_TIMES, MIN_CONFIDENCE_THRESHOLD } from '../config/constants';
import logger from '../utils/logger';

/**
 * Main triage analysis function
 */
export async function performTriage(
  request: TriageRequest
): Promise<TriageResult> {
  const startTime = Date.now();

  try {
    logger.info('Starting triage analysis', {
      symptomCount: request.symptoms.length,
      sessionId: request.sessionId
    });

    // Step 1: Detect red flags (CRITICAL for safety)
    const redFlagResult = await detectRedFlags(request.symptoms);

    // Step 2: Find matching conditions
    const matchedConditions = await findMatchingConditions(request.symptoms);

    // Step 3: Calculate scores
    const symptomScore = calculateSymptomScore(request.symptoms);
    const avgRelevance = calculateAverageRelevance(matchedConditions);
    const conditionUrgencyScore = calculateConditionUrgencyScore(
      matchedConditions.map(c => ({
        condition: c.condition,
        matchScore: c.matchScore
      }))
    );

    // Step 4: Calculate final triage score
    const triageScore = calculateTriageScore(
      symptomScore,
      redFlagResult.detectedRedFlags.length,
      conditionUrgencyScore,
      avgRelevance
    );

    // Step 5: Calculate confidence
    const confidence = calculateConfidence(
      request.symptoms.length,
      matchedConditions.length,
      avgRelevance
    );

    // Step 6: Generate recommendation
    const recommendation = generateRecommendation(
      triageScore.urgencyLevel,
      redFlagResult,
      matchedConditions
    );

    // Step 7: Generate reasoning
    const reasoning = generateReasoning(
      request.symptoms,
      matchedConditions,
      triageScore,
      redFlagResult
    );

    // Construct result
    const result: TriageResult = {
      urgencyLevel: triageScore.urgencyLevel,
      confidence,
      topConditions: matchedConditions.slice(0, 5), // Top 5 conditions
      redFlagsDetected: redFlagResult.detectedRedFlags,
      recommendation,
      disclaimer: DISCLAIMERS.GENERAL,
      reasoning,
      estimatedResponseTime: RESPONSE_TIMES[triageScore.urgencyLevel]
    };

    const responseTime = Date.now() - startTime;

    logger.info('Triage analysis completed', {
      urgencyLevel: result.urgencyLevel,
      confidence: result.confidence,
      responseTime,
      sessionId: request.sessionId
    });

    // Log red flags if detected
    if (redFlagResult.hasRedFlags) {
      logger.warn('Red flags detected in triage', {
        redFlags: redFlagResult.detectedRedFlags,
        urgencyLevel: result.urgencyLevel,
        sessionId: request.sessionId
      });
    }

    return result;
  } catch (error) {
    logger.error('Triage analysis failed', {
      error,
      sessionId: request.sessionId
    });
    throw new Error('Failed to perform triage analysis');
  }
}

/**
 * Find conditions that match patient symptoms
 */
async function findMatchingConditions(
  symptoms: PatientSymptom[]
): Promise<ConditionMatch[]> {
  try {
    const symptomNames = symptoms.map(s => normalizeSymptomName(s.symptomName));

    // Query to find conditions with matching symptoms
    const result = await query(`
      SELECT DISTINCT
        c.id,
        c.name,
        c.description,
        c.category,
        c.typical_urgency,
        c.icd10_code,
        c.prevalence,
        c.age_groups,
        c.risk_factors,
        c.complications,
        json_agg(
          json_build_object(
            'symptomName', s.name,
            'relevanceScore', sc.relevance_score,
            'severityModifier', sc.severity_modifier
          )
        ) as matched_symptoms
      FROM conditions c
      JOIN symptom_conditions sc ON c.id = sc.condition_id
      JOIN symptoms s ON sc.symptom_id = s.id
      WHERE LOWER(s.name) = ANY($1::text[])
         OR s.keywords && $1::text[]
      GROUP BY c.id
      ORDER BY COUNT(sc.id) DESC
      LIMIT 10
    `, [symptomNames]);

    // Calculate match scores for each condition
    const matches: ConditionMatch[] = result.rows.map((row: any) => {
      const condition: Condition = {
        id: row.id,
        name: row.name,
        description: row.description,
        category: row.category,
        typicalUrgency: row.typical_urgency as UrgencyLevel,
        icd10Code: row.icd10_code,
        prevalence: row.prevalence,
        ageGroups: row.age_groups,
        riskFactors: row.risk_factors,
        complications: row.complications,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const matchScore = calculateConditionMatchScore(
        symptoms,
        row.matched_symptoms
      );

      const matchingSymptomNames = row.matched_symptoms
        .map((ms: any) => ms.symptomName);

      const relevance = row.matched_symptoms.reduce(
        (sum: number, ms: any) => sum + parseFloat(ms.relevanceScore),
        0
      ) / row.matched_symptoms.length;

      return {
        condition,
        matchScore,
        matchingSymptoms: matchingSymptomNames,
        relevance
      };
    });

    // Filter by minimum confidence threshold and sort by match score
    return matches
      .filter(m => m.matchScore >= MIN_CONFIDENCE_THRESHOLD)
      .sort((a, b) => b.matchScore - a.matchScore);
  } catch (error) {
    logger.error('Failed to find matching conditions', { error });
    return [];
  }
}

/**
 * Generate recommendation based on urgency level
 */
function generateRecommendation(
  urgencyLevel: UrgencyLevel,
  redFlagResult: {
    hasRedFlags: boolean;
    detectedRedFlags: string[];
    emergencyPatterns: Array<{ name: string; message: string; matchedSymptoms: string[] }>;
    criticalityLevel: string;
  },
  matchedConditions: ConditionMatch[]
): string {
  let recommendation = '';

  // Emergency patterns take priority
  if (redFlagResult.emergencyPatterns.length > 0) {
    recommendation = getEmergencyMessage(redFlagResult.emergencyPatterns);
    recommendation += '\n\n' + DISCLAIMERS.EMERGENCY;
    return recommendation;
  }

  // Standard recommendations by urgency
  switch (urgencyLevel) {
    case UrgencyLevel.EMERGENCY:
      recommendation = '🚨 EMERGENCY: Call 911 or your local emergency number immediately.';
      if (redFlagResult.detectedRedFlags.length > 0) {
        recommendation += `\n\nCritical symptoms detected: ${redFlagResult.detectedRedFlags.join(', ')}`;
      }
      recommendation += '\n\n' + DISCLAIMERS.EMERGENCY;
      break;

    case UrgencyLevel.URGENT:
      recommendation = '⚠️ URGENT: Seek medical care within the next 4-6 hours.';
      recommendation += '\n\nContact your healthcare provider or visit an urgent care facility.';
      if (matchedConditions.length > 0) {
        recommendation += `\n\nPossible conditions to discuss: ${matchedConditions.slice(0, 3).map(c => c.condition.name).join(', ')}`;
      }
      recommendation += '\n\n' + DISCLAIMERS.URGENT;
      break;

    case UrgencyLevel.NON_URGENT:
      recommendation = '📋 NON-URGENT: Schedule an appointment with your healthcare provider.';
      recommendation += '\n\nYou should see a doctor within the next 1-3 days.';
      if (matchedConditions.length > 0) {
        recommendation += `\n\nPossible conditions: ${matchedConditions.slice(0, 3).map(c => c.condition.name).join(', ')}`;
      }
      recommendation += '\n\n' + DISCLAIMERS.NON_URGENT;
      break;

    case UrgencyLevel.SELF_CARE:
      recommendation = '🏠 SELF-CARE: Your symptoms may be manageable at home.';
      recommendation += '\n\nMonitor your symptoms for the next 24-48 hours.';
      recommendation += '\n\nSeek medical attention if symptoms worsen or new symptoms develop.';
      if (matchedConditions.length > 0) {
        recommendation += `\n\nPossible conditions: ${matchedConditions.slice(0, 2).map(c => c.condition.name).join(', ')}`;
      }
      recommendation += '\n\n' + DISCLAIMERS.SELF_CARE;
      break;
  }

  return recommendation;
}

/**
 * Generate reasoning explanation for the triage decision
 */
function generateReasoning(
  symptoms: PatientSymptom[],
  matchedConditions: ConditionMatch[],
  triageScore: {
    totalScore: number;
    urgencyLevel: UrgencyLevel;
    breakdown: {
      symptomSeverity: number;
      redFlagBonus: number;
      conditionUrgency: number;
      durationFactor: number;
    };
  },
  redFlagResult: {
    hasRedFlags: boolean;
    detectedRedFlags: string[];
  }
): string {
  const parts: string[] = [];

  // Symptom analysis
  parts.push(`Analyzed ${symptoms.length} symptom(s).`);

  // Red flags
  if (redFlagResult.hasRedFlags) {
    parts.push(
      `⚠️ ${redFlagResult.detectedRedFlags.length} critical warning sign(s) detected: ${redFlagResult.detectedRedFlags.join(', ')}.`
    );
  }

  // Matched conditions
  if (matchedConditions.length > 0) {
    const topCondition = matchedConditions[0];
    parts.push(
      `Most likely condition: ${topCondition.condition.name} (${Math.round(topCondition.matchScore * 100)}% match).`
    );
    
    if (matchedConditions.length > 1) {
      parts.push(
        `Other possible conditions: ${matchedConditions.slice(1, 3).map(c => c.condition.name).join(', ')}.`
      );
    }
  }

  // Scoring breakdown
  parts.push(
    `Triage score: ${triageScore.totalScore}/100 (Symptoms: ${triageScore.breakdown.symptomSeverity}, Urgency: ${triageScore.breakdown.conditionUrgency}, Relevance: ${triageScore.breakdown.durationFactor}).`
  );

  return parts.join(' ');
}

/**
 * Log triage assessment for analytics
 */
export async function logTriageAssessment(
  request: TriageRequest,
  result: TriageResult,
  responseTimeMs: number
): Promise<void> {
  try {
    await query(`
      INSERT INTO triage_logs (
        session_id,
        symptoms_reported,
        severity_scores,
        calculated_urgency,
        top_conditions,
        red_flags_detected,
        recommendation,
        disclaimer_shown,
        response_time_ms,
        user_age_group,
        user_metadata
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
    `, [
      request.sessionId,
      request.symptoms.map(s => s.symptomName),
      JSON.stringify(
        request.symptoms.reduce((acc, s) => {
          acc[s.symptomName] = s.severity;
          return acc;
        }, {} as Record<string, string>)
      ),
      result.urgencyLevel,
      JSON.stringify(result.topConditions.slice(0, 5)),
      result.redFlagsDetected,
      result.recommendation,
      true,
      responseTimeMs,
      request.ageGroup,
      JSON.stringify({
        existingConditions: request.existingConditions,
        medications: request.medications
      })
    ]);
  } catch (error) {
    logger.error('Failed to log triage assessment', { error });
    // Don't throw - logging failure shouldn't break the triage
  }
}