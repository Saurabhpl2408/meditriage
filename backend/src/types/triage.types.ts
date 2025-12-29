// Type definitions for MediTriage system

export enum UrgencyLevel {
  EMERGENCY = 'EMERGENCY',
  URGENT = 'URGENT',
  NON_URGENT = 'NON_URGENT',
  SELF_CARE = 'SELF_CARE'
}

export enum SymptomSeverity {
  MILD = 'MILD',
  MODERATE = 'MODERATE',
  SEVERE = 'SEVERE',
  CRITICAL = 'CRITICAL'
}

export interface Symptom {
  id: string;
  name: string;
  description: string;
  commonNames: string[];
  bodySystem: string;
  defaultSeverity: SymptomSeverity;
  isRedFlag: boolean;
  keywords: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Condition {
  id: string;
  name: string;
  description: string;
  category: string;
  typicalUrgency: UrgencyLevel;
  icd10Code?: string;
  prevalence: string;
  ageGroups: string[];
  riskFactors: string[];
  complications: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface SymptomConditionMapping {
  id: string;
  symptomId: string;
  conditionId: string;
  relevanceScore: number;
  typicalOnset: string;
  severityModifier: number;
  notes?: string;
  createdAt: Date;
}

export interface PatientSymptom {
  symptomName: string;
  severity: SymptomSeverity;
  duration?: string;
  notes?: string;
}

export interface TriageResult {
  urgencyLevel: UrgencyLevel;
  confidence: number;
  topConditions: ConditionMatch[];
  redFlagsDetected: string[];
  recommendation: string;
  disclaimer: string;
  reasoning: string;
  estimatedResponseTime?: string;
}

export interface ConditionMatch {
  condition: Condition;
  matchScore: number;
  matchingSymptoms: string[];
  relevance: number;
}

export interface TriageRequest {
  symptoms: PatientSymptom[];
  ageGroup?: string;
  existingConditions?: string[];
  medications?: string[];
  sessionId?: string;
}

export interface TriageLog {
  id: string;
  sessionId?: string;
  symptomsReported: string[];
  severityScores: Record<string, SymptomSeverity>;
  calculatedUrgency: UrgencyLevel;
  topConditions: ConditionMatch[];
  redFlagsDetected: string[];
  recommendation: string;
  disclaimerShown: boolean;
  timestamp: Date;
  responseTimeMs: number;
  userAgeGroup?: string;
  userMetadata?: Record<string, any>;
}

export interface RedFlagPattern {
  id: string;
  patternName: string;
  symptomCombinations: string[];
  description: string;
  emergencyMessage: string;
  priority: number;
  createdAt: Date;
}

export interface SelfCareRecommendation {
  id: string;
  conditionId?: string;
  symptomId?: string;
  recommendationType: string;
  title: string;
  description: string;
  instructions: string[];
  duration: string;
  warningSigns: string[];
  contraindications: string[];
  evidenceLevel: string;
  createdAt: Date;
}

export interface TriageScore {
  totalScore: number;
  urgencyLevel: UrgencyLevel;
  breakdown: {
    symptomSeverity: number;
    redFlagBonus: number;
    conditionUrgency: number;
    durationFactor: number;
  };
}

export interface SearchResult {
  symptoms: Symptom[];
  totalCount: number;
  query: string;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
  meta?: {
    timestamp: string;
    requestId?: string;
  };
}

export interface ApiError {
  code: string;
  message: string;
  details?: any;
}

// Validation types
export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

// Database query types
export interface QueryOptions {
  limit?: number;
  offset?: number;
  orderBy?: string;
  orderDirection?: 'ASC' | 'DESC';
}

export interface SymptomSearchOptions extends QueryOptions {
  query: string;
  bodySystem?: string;
  redFlagOnly?: boolean;
}

export interface ConditionSearchOptions extends QueryOptions {
  category?: string;
  urgencyLevel?: UrgencyLevel;
  ageGroup?: string;
}