export type Severity = 'MILD' | 'MODERATE' | 'SEVERE' | 'CRITICAL';
export type UrgencyLevel = 'EMERGENCY' | 'URGENT' | 'NON_URGENT' | 'SELF_CARE';
export type AgeGroup = 'infant' | 'child' | 'adult' | 'elderly';

export interface Symptom {
  id: string;
  symptomName: string;
  severity: Severity;
  duration?: string;
  notes?: string;
}

export interface Condition {
  id: string;
  name: string;
  description: string;
  category: string;
  typicalUrgency: UrgencyLevel;
  icd10Code?: string;
}

export interface ConditionMatch {
  condition: Condition;
  matchScore: number;
  matchingSymptoms: string[];
  relevance: number;
}

export interface TriageResult {
  urgencyLevel: UrgencyLevel;
  confidence: number;
  topConditions: ConditionMatch[];
  redFlagsDetected: string[];
  recommendation: string;
  disclaimer: string;
  reasoning: string;
  estimatedResponseTime: string;
}