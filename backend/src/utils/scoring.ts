// Triage scoring utilities

import { 
  UrgencyLevel, 
  SymptomSeverity, 
  PatientSymptom, 
  TriageScore,
  Condition 
} from '../types/triage.types';
import { 
  URGENCY_THRESHOLDS, 
  SEVERITY_SCORES, 
  SCORING_WEIGHTS 
} from '../config/constants';

/**
 * Calculate symptom severity score
 */
export function calculateSymptomScore(symptoms: PatientSymptom[]): number {
  if (symptoms.length === 0) return 0;

  const totalScore = symptoms.reduce((sum, symptom) => {
    const severityValue = SEVERITY_SCORES[symptom.severity] || 0;
    return sum + severityValue;
  }, 0);

  // Average score, capped at 100
  return Math.min((totalScore / symptoms.length), 100);
}

/**
 * Calculate red flag bonus
 */
export function calculateRedFlagBonus(redFlagsCount: number): number {
  return redFlagsCount * SCORING_WEIGHTS.RED_FLAG_BONUS;
}

/**
 * Calculate condition urgency score based on matched conditions
 */
export function calculateConditionUrgencyScore(
  conditions: Array<{ condition: Condition; matchScore: number }>
): number {
  if (conditions.length === 0) return 0;

  const urgencyValues: Record<UrgencyLevel, number> = {
    EMERGENCY: 100,
    URGENT: 70,
    NON_URGENT: 40,
    SELF_CARE: 20
  };

  // Weighted average of condition urgencies based on match scores
  const totalWeight = conditions.reduce((sum, c) => sum + c.matchScore, 0);
  if (totalWeight === 0) return 0;

  const weightedScore = conditions.reduce((sum, c) => {
    const urgencyValue = urgencyValues[c.condition.typicalUrgency];
    return sum + (urgencyValue * c.matchScore);
  }, 0);

  return weightedScore / totalWeight;
}

/**
 * Calculate final triage score
 */
export function calculateTriageScore(
  symptomScore: number,
  redFlagsCount: number,
  conditionUrgencyScore: number,
  avgRelevanceScore: number
): TriageScore {
  // Component scores
  const symptomComponent = symptomScore * SCORING_WEIGHTS.SYMPTOM_SEVERITY;
  const redFlagBonus = calculateRedFlagBonus(redFlagsCount);
  const conditionComponent = conditionUrgencyScore * SCORING_WEIGHTS.CONDITION_URGENCY;
  const relevanceComponent = avgRelevanceScore * 100 * SCORING_WEIGHTS.RELEVANCE_SCORE;

  // Total score (capped at 100 before red flag bonus)
  let totalScore = Math.min(
    symptomComponent + conditionComponent + relevanceComponent,
    100
  );

  // Add red flag bonus (can exceed 100)
  totalScore += redFlagBonus;

  // Determine urgency level
  const urgencyLevel = determineUrgencyLevel(totalScore, redFlagsCount > 0);

  return {
    totalScore: Math.round(totalScore),
    urgencyLevel,
    breakdown: {
      symptomSeverity: Math.round(symptomComponent),
      redFlagBonus: Math.round(redFlagBonus),
      conditionUrgency: Math.round(conditionComponent),
      durationFactor: Math.round(relevanceComponent)
    }
  };
}

/**
 * Determine urgency level from score
 */
export function determineUrgencyLevel(
  score: number,
  hasRedFlags: boolean
): UrgencyLevel {
  // Red flags always result in emergency
  if (hasRedFlags) {
    return UrgencyLevel.EMERGENCY;
  }

  if (score >= URGENCY_THRESHOLDS.EMERGENCY) {
    return UrgencyLevel.EMERGENCY;
  } else if (score >= URGENCY_THRESHOLDS.URGENT) {
    return UrgencyLevel.URGENT;
  } else if (score >= URGENCY_THRESHOLDS.NON_URGENT) {
    return UrgencyLevel.NON_URGENT;
  } else {
    return UrgencyLevel.SELF_CARE;
  }
}

/**
 * Calculate match score between patient symptoms and a condition
 */
export function calculateConditionMatchScore(
  patientSymptoms: PatientSymptom[],
  conditionSymptoms: Array<{
    symptomName: string;
    relevanceScore: number;
    severityModifier: number;
  }>
): number {
  if (patientSymptoms.length === 0 || conditionSymptoms.length === 0) {
    return 0;
  }

  const patientSymptomNames = patientSymptoms.map(s => 
    s.symptomName.toLowerCase()
  );

  let matchScore = 0;
  let maxPossibleScore = 0;

  for (const condSymp of conditionSymptoms) {
    maxPossibleScore += condSymp.relevanceScore;

    const isMatched = patientSymptomNames.some(pName => 
      pName === condSymp.symptomName.toLowerCase() ||
      pName.includes(condSymp.symptomName.toLowerCase()) ||
      condSymp.symptomName.toLowerCase().includes(pName)
    );

    if (isMatched) {
      // Find the patient symptom to get severity
      const patientSymp = patientSymptoms.find(ps => 
        ps.symptomName.toLowerCase() === condSymp.symptomName.toLowerCase() ||
        ps.symptomName.toLowerCase().includes(condSymp.symptomName.toLowerCase())
      );

      if (patientSymp) {
        // Weight by severity
        const severityWeight = SEVERITY_SCORES[patientSymp.severity] / 100;
        matchScore += condSymp.relevanceScore * severityWeight * condSymp.severityModifier;
      } else {
        matchScore += condSymp.relevanceScore;
      }
    }
  }

  // Normalize to 0-1 range
  return maxPossibleScore > 0 ? matchScore / maxPossibleScore : 0;
}

/**
 * Calculate confidence level for the triage result
 */
export function calculateConfidence(
  symptomCount: number,
  matchedConditionCount: number,
  avgMatchScore: number
): number {
  // Confidence factors:
  // 1. More symptoms = higher confidence (up to 5 symptoms)
  const symptomFactor = Math.min(symptomCount / 5, 1) * 0.3;
  
  // 2. More matched conditions = higher confidence (up to 3 conditions)
  const conditionFactor = Math.min(matchedConditionCount / 3, 1) * 0.3;
  
  // 3. Higher average match scores = higher confidence
  const matchScoreFactor = avgMatchScore * 0.4;

  const confidence = symptomFactor + conditionFactor + matchScoreFactor;

  return Math.round(confidence * 100) / 100; // Round to 2 decimal places
}

/**
 * Normalize symptom name for comparison
 */
export function normalizeSymptomName(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s]/g, '') // Remove special characters
    .replace(/\s+/g, ' ');   // Normalize whitespace
}

/**
 * Calculate average relevance score from matched conditions
 */
export function calculateAverageRelevance(
  conditions: Array<{ matchScore: number }>
): number {
  if (conditions.length === 0) return 0;

  const totalRelevance = conditions.reduce(
    (sum, c) => sum + c.matchScore, 
    0
  );

  return totalRelevance / conditions.length;
}

/**
 * Apply duration modifier to score
 */
export function applyDurationModifier(
  score: number,
  duration?: string
): number {
  if (!duration) return score;

  const durationLower = duration.toLowerCase();

  if (durationLower.includes('sudden') || durationLower.includes('acute')) {
    return score * SCORING_WEIGHTS.DURATION_MULTIPLIER.SUDDEN;
  } else if (durationLower.includes('chronic') || durationLower.includes('long')) {
    return score * SCORING_WEIGHTS.DURATION_MULTIPLIER.CHRONIC;
  } else if (durationLower.includes('gradual')) {
    return score * SCORING_WEIGHTS.DURATION_MULTIPLIER.GRADUAL;
  }

  return score;
}