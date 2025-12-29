// Red Flag Detection Service - Critical for patient safety

import { query } from '../config/database';
import { PatientSymptom } from '../types/triage.types';
import { RED_FLAG_SYMPTOMS, EMERGENCY_PATTERNS } from '../config/constants';
import logger from '../utils/logger';
import { normalizeSymptomName } from './../utils/scoring';

export interface RedFlagResult {
  hasRedFlags: boolean;
  detectedRedFlags: string[];
  emergencyPatterns: Array<{
    name: string;
    message: string;
    matchedSymptoms: string[];
  }>;
  criticalityLevel: 'CRITICAL' | 'SEVERE' | 'MODERATE' | 'LOW';
}

/**
 * Detect red flag symptoms from patient input
 */
export async function detectRedFlags(
  symptoms: PatientSymptom[]
): Promise<RedFlagResult> {
  try {
    const symptomNames = symptoms.map(s => normalizeSymptomName(s.symptomName));
    
    // Query database for red flag symptoms
    const dbRedFlags = await getRedFlagsFromDatabase(symptomNames);
    
    // Check predefined red flag list
    const configRedFlags = checkConfigRedFlags(symptomNames);
    
    // Combine results
    const allRedFlags = Array.from(
      new Set([...dbRedFlags, ...configRedFlags])
    );
    
    // Check for emergency patterns
    const patterns = detectEmergencyPatterns(symptomNames);
    
    // Determine criticality
    const criticalityLevel = determineCriticalityLevel(
      allRedFlags.length,
      patterns.length
    );

    const result: RedFlagResult = {
      hasRedFlags: allRedFlags.length > 0,
      detectedRedFlags: allRedFlags,
      emergencyPatterns: patterns,
      criticalityLevel
    };

    if (result.hasRedFlags) {
      logger.warn('Red flags detected', {
        redFlags: allRedFlags,
        patterns: patterns.map(p => p.name),
        event: 'red_flag_detection'
      });
    }

    return result;
  } catch (error) {
    logger.error('Error in red flag detection', { error });
    // Fail safe: return empty result rather than blocking triage
    return {
      hasRedFlags: false,
      detectedRedFlags: [],
      emergencyPatterns: [],
      criticalityLevel: 'LOW'
    };
  }
}

/**
 * Get red flags from database
 */
async function getRedFlagsFromDatabase(
  symptomNames: string[]
): Promise<string[]> {
  try {
    // Use case-insensitive search with keyword matching
    const result = await query(`
      SELECT DISTINCT name
      FROM symptoms
      WHERE is_red_flag = TRUE
      AND (
        LOWER(name) = ANY($1::text[])
        OR keywords && $1::text[]
      )
    `, [symptomNames]);

    return result.rows.map((row: any) => row.name);
  } catch (error) {
    logger.error('Database query failed in red flag detection', { error });
    return [];
  }
}

/**
 * Check config-based red flags
 */
function checkConfigRedFlags(symptomNames: string[]): string[] {
  const normalizedRedFlags = RED_FLAG_SYMPTOMS.map(rf => 
    normalizeSymptomName(rf)
  );

  const detected: string[] = [];

  for (const symptomName of symptomNames) {
    const normalized = normalizeSymptomName(symptomName);
    
    // Check exact match or substring match
    const matchedRedFlag = normalizedRedFlags.find(rf => 
      rf === normalized || 
      rf.includes(normalized) || 
      normalized.includes(rf)
    );

    if (matchedRedFlag) {
      // Get original red flag name (capitalized)
      const originalIndex = normalizedRedFlags.indexOf(matchedRedFlag);
      detected.push(RED_FLAG_SYMPTOMS[originalIndex]);
    }
  }

  return detected;
}

/**
 * Detect emergency patterns (combinations of symptoms)
 */
function detectEmergencyPatterns(
  symptomNames: string[]
): Array<{
  name: string;
  message: string;
  matchedSymptoms: string[];
}> {
  const detected: Array<{
    name: string;
    message: string;
    matchedSymptoms: string[];
  }> = [];

  for (const pattern of EMERGENCY_PATTERNS) {
    const normalizedPatternSymptoms = pattern.symptoms.map(s => 
      normalizeSymptomName(s)
    );

    const matchedSymptoms: string[] = [];

    for (const patternSymptom of normalizedPatternSymptoms) {
      const isMatched = symptomNames.some(sn => 
        sn === patternSymptom || 
        sn.includes(patternSymptom) ||
        patternSymptom.includes(sn)
      );

      if (isMatched) {
        matchedSymptoms.push(patternSymptom);
      }
    }

    // If 2 or more symptoms in pattern match, it's a match
    if (matchedSymptoms.length >= 2) {
      detected.push({
        name: pattern.name,
        message: pattern.message,
        matchedSymptoms
      });
    }
  }

  return detected;
}

/**
 * Determine criticality level based on red flags
 */
function determineCriticalityLevel(
  redFlagCount: number,
  patternCount: number
): 'CRITICAL' | 'SEVERE' | 'MODERATE' | 'LOW' {
  if (patternCount > 0 || redFlagCount >= 3) {
    return 'CRITICAL';
  } else if (redFlagCount >= 2) {
    return 'SEVERE';
  } else if (redFlagCount === 1) {
    return 'MODERATE';
  } else {
    return 'LOW';
  }
}

/**
 * Check if any symptom is a red flag by name
 */
export function isRedFlagSymptom(symptomName: string): boolean {
  const normalized = normalizeSymptomName(symptomName);
  
  return RED_FLAG_SYMPTOMS.some(rf => {
    const normalizedRf = normalizeSymptomName(rf);
    return normalizedRf === normalized || 
           normalizedRf.includes(normalized) ||
           normalized.includes(normalizedRf);
  });
}

/**
 * Get emergency message based on detected patterns
 */
export function getEmergencyMessage(patterns: Array<{ name: string; message: string }>): string {
  if (patterns.length === 0) {
    return '🚨 MEDICAL EMERGENCY DETECTED - Call 911 or your local emergency number IMMEDIATELY.';
  }

  // Return the message from the most critical pattern
  return patterns[0].message;
}

/**
 * Validate red flag data integrity (for system health checks)
 */
export async function validateRedFlagConfiguration(): Promise<{
  valid: boolean;
  issues: string[];
}> {
  const issues: string[] = [];

  try {
    // Check if red flag symptoms exist in database
    const result = await query(`
      SELECT COUNT(*) as count
      FROM symptoms
      WHERE is_red_flag = TRUE
    `);

    const dbRedFlagCount = parseInt(result.rows[0].count);

    if (dbRedFlagCount === 0) {
      issues.push('No red flag symptoms found in database');
    }

    if (RED_FLAG_SYMPTOMS.length === 0) {
      issues.push('No red flag symptoms in configuration');
    }

    if (EMERGENCY_PATTERNS.length === 0) {
      issues.push('No emergency patterns configured');
    }

    return {
      valid: issues.length === 0,
      issues
    };
  } catch (error) {
    logger.error('Red flag validation failed', { error });
    return {
      valid: false,
      issues: ['Failed to validate red flag configuration']
    };
  }
}