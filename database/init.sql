-- MediTriage Database Schema
-- PostgreSQL 15+

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing tables if they exist (for development)
DROP TABLE IF EXISTS triage_logs CASCADE;
DROP TABLE IF EXISTS symptom_conditions CASCADE;
DROP TABLE IF EXISTS conditions CASCADE;
DROP TABLE IF EXISTS symptoms CASCADE;
DROP TYPE IF EXISTS urgency_level CASCADE;
DROP TYPE IF EXISTS symptom_severity CASCADE;

-- Create custom types
CREATE TYPE urgency_level AS ENUM ('EMERGENCY', 'URGENT', 'NON_URGENT', 'SELF_CARE');
CREATE TYPE symptom_severity AS ENUM ('MILD', 'MODERATE', 'SEVERE', 'CRITICAL');

-- Symptoms table
CREATE TABLE symptoms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    common_names TEXT[], -- Alternative names/terms
    body_system VARCHAR(100), -- cardiovascular, respiratory, neurological, etc.
    default_severity symptom_severity DEFAULT 'MILD',
    is_red_flag BOOLEAN DEFAULT FALSE,
    keywords TEXT[], -- For natural language search
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index for fast searching
CREATE INDEX idx_symptoms_name ON symptoms USING gin(to_tsvector('english', name));
CREATE INDEX idx_symptoms_keywords ON symptoms USING gin(keywords);
CREATE INDEX idx_symptoms_body_system ON symptoms(body_system);
CREATE INDEX idx_symptoms_red_flag ON symptoms(is_red_flag) WHERE is_red_flag = TRUE;

-- Conditions table
CREATE TABLE conditions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT NOT NULL,
    category VARCHAR(100), -- infectious, chronic, acute, etc.
    typical_urgency urgency_level NOT NULL,
    icd10_code VARCHAR(10), -- International Classification of Diseases code
    prevalence VARCHAR(50), -- common, rare, very rare
    age_groups TEXT[], -- pediatric, adult, elderly, all
    risk_factors TEXT[],
    complications TEXT[],
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index for condition lookups
CREATE INDEX idx_conditions_name ON conditions USING gin(to_tsvector('english', name));
CREATE INDEX idx_conditions_category ON conditions(category);
CREATE INDEX idx_conditions_urgency ON conditions(typical_urgency);

-- Symptom-Condition mapping (many-to-many)
CREATE TABLE symptom_conditions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    symptom_id UUID NOT NULL REFERENCES symptoms(id) ON DELETE CASCADE,
    condition_id UUID NOT NULL REFERENCES conditions(id) ON DELETE CASCADE,
    relevance_score DECIMAL(3, 2) CHECK (relevance_score >= 0 AND relevance_score <= 1),
    -- How strongly this symptom indicates this condition (0.0 - 1.0)
    typical_onset VARCHAR(100), -- sudden, gradual, intermittent
    severity_modifier DECIMAL(2, 1) DEFAULT 1.0, -- multiplier for severity calculation
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(symptom_id, condition_id)
);

-- Indexes for fast joins
CREATE INDEX idx_symptom_conditions_symptom ON symptom_conditions(symptom_id);
CREATE INDEX idx_symptom_conditions_condition ON symptom_conditions(condition_id);
CREATE INDEX idx_symptom_conditions_relevance ON symptom_conditions(relevance_score DESC);

-- Triage logs (for analytics and auditing)
CREATE TABLE triage_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id VARCHAR(255), -- For tracking multi-turn conversations
    symptoms_reported TEXT[], -- Array of symptom names reported
    severity_scores JSONB, -- Severity scores for each symptom
    calculated_urgency urgency_level NOT NULL,
    top_conditions JSONB, -- Top 3-5 likely conditions with scores
    red_flags_detected TEXT[], -- Any red flag symptoms found
    recommendation TEXT NOT NULL,
    disclaimer_shown BOOLEAN DEFAULT TRUE,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    response_time_ms INTEGER, -- Performance tracking
    user_age_group VARCHAR(50),
    user_metadata JSONB -- Additional context (anonymized)
);

-- Indexes for analytics
CREATE INDEX idx_triage_logs_urgency ON triage_logs(calculated_urgency);
CREATE INDEX idx_triage_logs_timestamp ON triage_logs(timestamp DESC);
CREATE INDEX idx_triage_logs_session ON triage_logs(session_id);

-- Red flag patterns table
CREATE TABLE red_flag_patterns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pattern_name VARCHAR(255) NOT NULL,
    symptom_combinations TEXT[], -- Array of symptom IDs that together indicate emergency
    description TEXT,
    emergency_message TEXT NOT NULL,
    priority INTEGER DEFAULT 1, -- Higher number = higher priority
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_red_flag_priority ON red_flag_patterns(priority DESC);

-- Self-care recommendations table
CREATE TABLE self_care_recommendations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    condition_id UUID REFERENCES conditions(id) ON DELETE CASCADE,
    symptom_id UUID REFERENCES symptoms(id) ON DELETE CASCADE,
    recommendation_type VARCHAR(50), -- rest, hydration, otc_medication, home_remedy
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    instructions TEXT[],
    duration VARCHAR(100), -- how long to try self-care before seeking help
    warning_signs TEXT[], -- signs that indicate medical attention needed
    contraindications TEXT[], -- when NOT to use this recommendation
    evidence_level VARCHAR(50), -- well-established, moderate, limited
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_self_care_condition ON self_care_recommendations(condition_id);
CREATE INDEX idx_self_care_symptom ON self_care_recommendations(symptom_id);

-- Function to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for auto-updating timestamps
CREATE TRIGGER update_symptoms_updated_at BEFORE UPDATE ON symptoms
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_conditions_updated_at BEFORE UPDATE ON conditions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Views for common queries
CREATE OR REPLACE VIEW v_symptom_condition_summary AS
SELECT 
    s.id as symptom_id,
    s.name as symptom_name,
    s.is_red_flag,
    c.id as condition_id,
    c.name as condition_name,
    c.typical_urgency,
    sc.relevance_score
FROM symptoms s
JOIN symptom_conditions sc ON s.id = sc.symptom_id
JOIN conditions c ON sc.condition_id = c.id
ORDER BY sc.relevance_score DESC;

-- View for triage statistics
CREATE OR REPLACE VIEW v_triage_statistics AS
SELECT 
    calculated_urgency,
    COUNT(*) as total_cases,
    COUNT(DISTINCT session_id) as unique_sessions,
    AVG(response_time_ms) as avg_response_time,
    ARRAY_AGG(DISTINCT unnest(red_flags_detected)) as common_red_flags
FROM triage_logs
GROUP BY calculated_urgency;

COMMENT ON TABLE symptoms IS 'Individual medical symptoms with metadata';
COMMENT ON TABLE conditions IS 'Medical conditions and diagnoses';
COMMENT ON TABLE symptom_conditions IS 'Many-to-many mapping between symptoms and conditions';
COMMENT ON TABLE triage_logs IS 'Audit log of all triage assessments performed';
COMMENT ON TABLE red_flag_patterns IS 'Emergency symptom patterns requiring immediate 911';
COMMENT ON TABLE self_care_recommendations IS 'Evidence-based self-care guidance';