-- Migration 001: Initial Schema
-- Date: 2025-01-01
-- Description: Creates all base tables for MediTriage system

\i ../init.sql

-- Verification queries
SELECT 'Symptoms table created' as status, COUNT(*) as row_count FROM symptoms;
SELECT 'Conditions table created' as status, COUNT(*) as row_count FROM conditions;
SELECT 'Symptom-conditions mapping created' as status, COUNT(*) as row_count FROM symptom_conditions;
SELECT 'Triage logs table created' as status, COUNT(*) as row_count FROM triage_logs;

-- Print schema version
INSERT INTO schema_version (version, description, applied_at) 
VALUES (1, 'Initial schema with symptoms, conditions, and triage logging', CURRENT_TIMESTAMP);