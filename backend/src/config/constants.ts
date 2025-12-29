// Constants and configuration values for MediTriage

export const URGENCY_THRESHOLDS = {
  EMERGENCY: 80,      // Score >= 80: Call 911 immediately
  URGENT: 60,         // Score >= 60: Seek care within 4-6 hours
  NON_URGENT: 40,     // Score >= 40: Schedule doctor appointment
  SELF_CARE: 0        // Score < 40: Monitor at home with self-care
};

export const SEVERITY_SCORES = {
  CRITICAL: 100,
  SEVERE: 75,
  MODERATE: 50,
  MILD: 25
};

export const SCORING_WEIGHTS = {
  SYMPTOM_SEVERITY: 0.4,      // 40% weight
  RED_FLAG_BONUS: 50,          // +50 points per red flag
  CONDITION_URGENCY: 0.3,      // 30% weight
  RELEVANCE_SCORE: 0.3,        // 30% weight
  DURATION_MULTIPLIER: {
    SUDDEN: 1.3,
    ACUTE: 1.2,
    GRADUAL: 1.0,
    CHRONIC: 0.8
  }
};

export const RED_FLAG_SYMPTOMS = [
  'Chest pain',
  'Severe bleeding',
  'Difficulty breathing',
  'Sudden severe headache',
  'Slurred speech',
  'Facial drooping',
  'Arm weakness',
  'Loss of consciousness',
  'Severe abdominal pain',
  'Confusion',
  'Seizures',
  'Coughing up blood',
  'Vomiting blood',
  'Severe allergic reaction',
  'Blue lips or face'
];

export const EMERGENCY_PATTERNS = [
  {
    name: 'Stroke (FAST)',
    symptoms: ['Facial drooping', 'Arm weakness', 'Slurred speech'],
    message: '🚨 POSSIBLE STROKE - Call 911 IMMEDIATELY. Note the time symptoms started.'
  },
  {
    name: 'Heart Attack',
    symptoms: ['Chest pain', 'Difficulty breathing'],
    message: '🚨 POSSIBLE HEART ATTACK - Call 911 IMMEDIATELY. Chew aspirin if not allergic.'
  },
  {
    name: 'Severe Allergic Reaction',
    symptoms: ['Difficulty breathing', 'Severe allergic reaction'],
    message: '🚨 ANAPHYLAXIS - Call 911 IMMEDIATELY. Use EpiPen if available.'
  },
  {
    name: 'Severe Bleeding',
    symptoms: ['Severe bleeding'],
    message: '🚨 SEVERE BLEEDING - Call 911 IMMEDIATELY. Apply direct pressure.'
  }
];

export const DISCLAIMERS = {
  EMERGENCY: 'This is a medical emergency. Call 911 or your local emergency number immediately. Do not wait for an appointment.',
  URGENT: 'You should seek medical care within the next 4-6 hours. Contact your doctor or visit an urgent care facility.',
  NON_URGENT: 'Schedule an appointment with your healthcare provider within the next few days. Monitor symptoms.',
  SELF_CARE: 'Your symptoms may be manageable with self-care. However, if symptoms worsen or new symptoms develop, seek medical attention.',
  GENERAL: '⚠️ IMPORTANT: This tool is for informational purposes only and is NOT a substitute for professional medical advice, diagnosis, or treatment. Always consult qualified healthcare providers for medical concerns.'
};

export const API_CONFIG = {
  VERSION: 'v1',
  BASE_PATH: '/api',
  RATE_LIMIT: {
    WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
    MAX_REQUESTS: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100')
  },
  CORS: {
    ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:5173',
    METHODS: ['GET', 'POST', 'PUT', 'DELETE'],
    ALLOWED_HEADERS: ['Content-Type', 'Authorization']
  }
};

export const QUERY_LIMITS = {
  MAX_SYMPTOMS_SEARCH: 50,
  MAX_CONDITIONS_SEARCH: 20,
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100
};

export const AGE_GROUPS = [
  'infant',      // 0-1 year
  'toddler',     // 1-3 years
  'child',       // 3-12 years
  'adolescent',  // 12-18 years
  'adult',       // 18-65 years
  'elderly'      // 65+ years
];

export const BODY_SYSTEMS = [
  'cardiovascular',
  'respiratory',
  'gastrointestinal',
  'neurological',
  'musculoskeletal',
  'dermatological',
  'urologic',
  'ophthalmologic',
  'otologic',
  'endocrine',
  'immune',
  'psychological',
  'general'
];

export const RESPONSE_TIMES = {
  EMERGENCY: 'Immediate - Call 911 now',
  URGENT: 'Within 4-6 hours',
  NON_URGENT: 'Within 1-3 days',
  SELF_CARE: 'Monitor for 24-48 hours'
};

export const MIN_CONFIDENCE_THRESHOLD = 0.3; // Minimum confidence to show a condition match

export const LOG_RETENTION_DAYS = 90; // How long to keep triage logs

export const FEATURE_FLAGS = {
  RED_FLAG_DETECTION: process.env.ENABLE_RED_FLAG_DETECTION !== 'false',
  RAG_RETRIEVAL: process.env.ENABLE_RAG_RETRIEVAL === 'true',
  TRIAGE_LOGGING: process.env.ENABLE_TRIAGE_LOGGING !== 'false',
  ANALYTICS: process.env.ENABLE_ANALYTICS === 'true'
};