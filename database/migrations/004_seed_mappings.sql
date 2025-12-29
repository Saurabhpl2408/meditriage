-- Migration 004: Seed Symptom-Condition Mappings (Fixed)
-- Date: 2025-01-01
-- Description: Maps symptoms to conditions with relevance scores
-- Only includes symptoms that exist in the database

-- Insert mappings directly using symptom and condition names
-- This approach is safer and more readable

-- First, let's see what symptoms we actually have
DO $$
DECLARE
    symptom_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO symptom_count FROM symptoms;
    RAISE NOTICE 'Found % symptoms in database', symptom_count;
END $$;

-- MYOCARDIAL INFARCTION (Heart Attack) mappings
INSERT INTO symptom_conditions (symptom_id, condition_id, relevance_score, typical_onset, severity_modifier, notes)
SELECT s.id, c.id, 0.95, 'sudden', 2.0, 'Classic crushing chest pain'
FROM symptoms s, conditions c
WHERE s.name = 'Chest pain' AND c.name = 'Myocardial Infarction';

INSERT INTO symptom_conditions (symptom_id, condition_id, relevance_score, typical_onset, severity_modifier, notes)
SELECT s.id, c.id, 0.85, 'sudden', 1.8, 'Shortness of breath common'
FROM symptoms s, conditions c
WHERE s.name = 'Difficulty breathing' AND c.name = 'Myocardial Infarction';

INSERT INTO symptom_conditions (symptom_id, condition_id, relevance_score, typical_onset, severity_modifier, notes)
SELECT s.id, c.id, 0.65, 'sudden', 1.3, 'Often accompanies MI'
FROM symptoms s, conditions c
WHERE s.name = 'Nausea' AND c.name = 'Myocardial Infarction';

-- STROKE mappings
INSERT INTO symptom_conditions (symptom_id, condition_id, relevance_score, typical_onset, severity_modifier, notes)
SELECT s.id, c.id, 0.90, 'sudden', 2.0, 'Key FAST sign'
FROM symptoms s, conditions c
WHERE s.name = 'Slurred speech' AND c.name = 'Stroke';

INSERT INTO symptom_conditions (symptom_id, condition_id, relevance_score, typical_onset, severity_modifier, notes)
SELECT s.id, c.id, 0.92, 'sudden', 2.0, 'Key FAST sign'
FROM symptoms s, conditions c
WHERE s.name = 'Facial drooping' AND c.name = 'Stroke';

INSERT INTO symptom_conditions (symptom_id, condition_id, relevance_score, typical_onset, severity_modifier, notes)
SELECT s.id, c.id, 0.90, 'sudden', 2.0, 'Key FAST sign'
FROM symptoms s, conditions c
WHERE s.name = 'Arm weakness' AND c.name = 'Stroke';

INSERT INTO symptom_conditions (symptom_id, condition_id, relevance_score, typical_onset, severity_modifier, notes)
SELECT s.id, c.id, 0.85, 'sudden', 2.0, 'Hemorrhagic stroke'
FROM symptoms s, conditions c
WHERE s.name = 'Sudden severe headache' AND c.name = 'Stroke';

INSERT INTO symptom_conditions (symptom_id, condition_id, relevance_score, typical_onset, severity_modifier, notes)
SELECT s.id, c.id, 0.80, 'sudden', 1.8, 'Altered mental status'
FROM symptoms s, conditions c
WHERE s.name = 'Confusion' AND c.name = 'Stroke';

INSERT INTO symptom_conditions (symptom_id, condition_id, relevance_score, typical_onset, severity_modifier, notes)
SELECT s.id, c.id, 0.70, 'sudden', 1.5, 'Loss of balance'
FROM symptoms s, conditions c
WHERE s.name = 'Dizziness' AND c.name = 'Stroke';

INSERT INTO symptom_conditions (symptom_id, condition_id, relevance_score, typical_onset, severity_modifier, notes)
SELECT s.id, c.id, 0.75, 'sudden', 1.6, 'Vision changes'
FROM symptoms s, conditions c
WHERE s.name = 'Double vision' AND c.name = 'Stroke';

-- PULMONARY EMBOLISM mappings
INSERT INTO symptom_conditions (symptom_id, condition_id, relevance_score, typical_onset, severity_modifier, notes)
SELECT s.id, c.id, 0.90, 'sudden', 2.0, 'Sudden onset dyspnea'
FROM symptoms s, conditions c
WHERE s.name = 'Difficulty breathing' AND c.name = 'Pulmonary Embolism';

INSERT INTO symptom_conditions (symptom_id, condition_id, relevance_score, typical_onset, severity_modifier, notes)
SELECT s.id, c.id, 0.85, 'sudden', 1.8, 'Sharp, pleuritic pain'
FROM symptoms s, conditions c
WHERE s.name = 'Chest pain' AND c.name = 'Pulmonary Embolism';

INSERT INTO symptom_conditions (symptom_id, condition_id, relevance_score, typical_onset, severity_modifier, notes)
SELECT s.id, c.id, 0.80, 'sudden', 1.6, 'Tachycardia'
FROM symptoms s, conditions c
WHERE s.name = 'Rapid heartbeat' AND c.name = 'Pulmonary Embolism';

INSERT INTO symptom_conditions (symptom_id, condition_id, relevance_score, typical_onset, severity_modifier, notes)
SELECT s.id, c.id, 0.75, 'sudden', 1.9, 'Hemoptysis'
FROM symptoms s, conditions c
WHERE s.name = 'Coughing up blood' AND c.name = 'Pulmonary Embolism';

-- ANAPHYLAXIS mappings
INSERT INTO symptom_conditions (symptom_id, condition_id, relevance_score, typical_onset, severity_modifier, notes)
SELECT s.id, c.id, 1.00, 'sudden', 2.0, 'Definition of anaphylaxis'
FROM symptoms s, conditions c
WHERE s.name = 'Severe allergic reaction' AND c.name = 'Anaphylaxis';

INSERT INTO symptom_conditions (symptom_id, condition_id, relevance_score, typical_onset, severity_modifier, notes)
SELECT s.id, c.id, 0.95, 'sudden', 2.0, 'Airway swelling'
FROM symptoms s, conditions c
WHERE s.name = 'Difficulty breathing' AND c.name = 'Anaphylaxis';

INSERT INTO symptom_conditions (symptom_id, condition_id, relevance_score, typical_onset, severity_modifier, notes)
SELECT s.id, c.id, 0.85, 'sudden', 1.5, 'Urticaria'
FROM symptoms s, conditions c
WHERE s.name = 'Hives' AND c.name = 'Anaphylaxis';

INSERT INTO symptom_conditions (symptom_id, condition_id, relevance_score, typical_onset, severity_modifier, notes)
SELECT s.id, c.id, 0.70, 'sudden', 1.3, 'GI symptoms common'
FROM symptoms s, conditions c
WHERE s.name = 'Nausea' AND c.name = 'Anaphylaxis';

INSERT INTO symptom_conditions (symptom_id, condition_id, relevance_score, typical_onset, severity_modifier, notes)
SELECT s.id, c.id, 0.70, 'sudden', 1.3, 'GI symptoms common'
FROM symptoms s, conditions c
WHERE s.name = 'Vomiting' AND c.name = 'Anaphylaxis';

-- APPENDICITIS mappings
INSERT INTO symptom_conditions (symptom_id, condition_id, relevance_score, typical_onset, severity_modifier, notes)
SELECT s.id, c.id, 0.95, 'gradual', 1.9, 'RLQ pain classic'
FROM symptoms s, conditions c
WHERE s.name = 'Severe abdominal pain' AND c.name = 'Appendicitis';

INSERT INTO symptom_conditions (symptom_id, condition_id, relevance_score, typical_onset, severity_modifier, notes)
SELECT s.id, c.id, 0.80, 'gradual', 1.4, 'Very common'
FROM symptoms s, conditions c
WHERE s.name = 'Nausea' AND c.name = 'Appendicitis';

INSERT INTO symptom_conditions (symptom_id, condition_id, relevance_score, typical_onset, severity_modifier, notes)
SELECT s.id, c.id, 0.75, 'gradual', 1.4, 'Common'
FROM symptoms s, conditions c
WHERE s.name = 'Vomiting' AND c.name = 'Appendicitis';

INSERT INTO symptom_conditions (symptom_id, condition_id, relevance_score, typical_onset, severity_modifier, notes)
SELECT s.id, c.id, 0.85, 'gradual', 1.3, 'Early sign'
FROM symptoms s, conditions c
WHERE s.name = 'Loss of appetite' AND c.name = 'Appendicitis';

-- MENINGITIS mappings
INSERT INTO symptom_conditions (symptom_id, condition_id, relevance_score, typical_onset, severity_modifier, notes)
SELECT s.id, c.id, 0.90, 'sudden', 2.0, 'Severe headache'
FROM symptoms s, conditions c
WHERE s.name = 'Sudden severe headache' AND c.name = 'Meningitis';

INSERT INTO symptom_conditions (symptom_id, condition_id, relevance_score, typical_onset, severity_modifier, notes)
SELECT s.id, c.id, 0.90, 'sudden', 1.9, 'Neck stiffness'
FROM symptoms s, conditions c
WHERE s.name = 'Neck pain' AND c.name = 'Meningitis';

INSERT INTO symptom_conditions (symptom_id, condition_id, relevance_score, typical_onset, severity_modifier, notes)
SELECT s.id, c.id, 0.85, 'sudden', 1.8, 'Altered consciousness'
FROM symptoms s, conditions c
WHERE s.name = 'Confusion' AND c.name = 'Meningitis';

INSERT INTO symptom_conditions (symptom_id, condition_id, relevance_score, typical_onset, severity_modifier, notes)
SELECT s.id, c.id, 0.80, 'sudden', 1.5, 'Photophobia'
FROM symptoms s, conditions c
WHERE s.name = 'Sensitivity to light' AND c.name = 'Meningitis';

INSERT INTO symptom_conditions (symptom_id, condition_id, relevance_score, typical_onset, severity_modifier, notes)
SELECT s.id, c.id, 0.70, 'sudden', 1.3, 'Common symptom'
FROM symptoms s, conditions c
WHERE s.name = 'Nausea' AND c.name = 'Meningitis';

-- PNEUMONIA mappings
INSERT INTO symptom_conditions (symptom_id, condition_id, relevance_score, typical_onset, severity_modifier, notes)
SELECT s.id, c.id, 0.95, 'gradual', 1.6, 'Productive cough'
FROM symptoms s, conditions c
WHERE s.name = 'Cough' AND c.name = 'Pneumonia';

INSERT INTO symptom_conditions (symptom_id, condition_id, relevance_score, typical_onset, severity_modifier, notes)
SELECT s.id, c.id, 0.85, 'gradual', 1.8, 'Dyspnea'
FROM symptoms s, conditions c
WHERE s.name = 'Difficulty breathing' AND c.name = 'Pneumonia';

INSERT INTO symptom_conditions (symptom_id, condition_id, relevance_score, typical_onset, severity_modifier, notes)
SELECT s.id, c.id, 0.75, 'gradual', 1.5, 'Pleuritic pain'
FROM symptoms s, conditions c
WHERE s.name = 'Chest pain' AND c.name = 'Pneumonia';

INSERT INTO symptom_conditions (symptom_id, condition_id, relevance_score, typical_onset, severity_modifier, notes)
SELECT s.id, c.id, 0.80, 'gradual', 1.4, 'Weakness common'
FROM symptoms s, conditions c
WHERE s.name = 'Fatigue' AND c.name = 'Pneumonia';

-- UTI mappings
INSERT INTO symptom_conditions (symptom_id, condition_id, relevance_score, typical_onset, severity_modifier, notes)
SELECT s.id, c.id, 0.95, 'gradual', 1.6, 'Dysuria classic'
FROM symptoms s, conditions c
WHERE s.name = 'Painful urination' AND c.name = 'Urinary Tract Infection';

INSERT INTO symptom_conditions (symptom_id, condition_id, relevance_score, typical_onset, severity_modifier, notes)
SELECT s.id, c.id, 0.90, 'gradual', 1.4, 'Urgency and frequency'
FROM symptoms s, conditions c
WHERE s.name = 'Frequent urination' AND c.name = 'Urinary Tract Infection';

INSERT INTO symptom_conditions (symptom_id, condition_id, relevance_score, typical_onset, severity_modifier, notes)
SELECT s.id, c.id, 0.70, 'gradual', 1.3, 'Lower abdomen'
FROM symptoms s, conditions c
WHERE s.name = 'Abdominal pain' AND c.name = 'Urinary Tract Infection';

INSERT INTO symptom_conditions (symptom_id, condition_id, relevance_score, typical_onset, severity_modifier, notes)
SELECT s.id, c.id, 0.65, 'gradual', 1.5, 'Hematuria possible'
FROM symptoms s, conditions c
WHERE s.name = 'Blood in urine' AND c.name = 'Urinary Tract Infection';

-- COMMON COLD mappings
INSERT INTO symptom_conditions (symptom_id, condition_id, relevance_score, typical_onset, severity_modifier, notes)
SELECT s.id, c.id, 0.95, 'gradual', 1.0, 'Rhinorrhea'
FROM symptoms s, conditions c
WHERE s.name = 'Runny nose' AND c.name = 'Common Cold';

INSERT INTO symptom_conditions (symptom_id, condition_id, relevance_score, typical_onset, severity_modifier, notes)
SELECT s.id, c.id, 0.90, 'gradual', 1.0, 'Congestion'
FROM symptoms s, conditions c
WHERE s.name = 'Stuffy nose' AND c.name = 'Common Cold';

INSERT INTO symptom_conditions (symptom_id, condition_id, relevance_score, typical_onset, severity_modifier, notes)
SELECT s.id, c.id, 0.85, 'gradual', 1.0, 'Common'
FROM symptoms s, conditions c
WHERE s.name = 'Sneezing' AND c.name = 'Common Cold';

INSERT INTO symptom_conditions (symptom_id, condition_id, relevance_score, typical_onset, severity_modifier, notes)
SELECT s.id, c.id, 0.80, 'gradual', 1.1, 'Mild pharyngitis'
FROM symptoms s, conditions c
WHERE s.name = 'Sore throat' AND c.name = 'Common Cold';

INSERT INTO symptom_conditions (symptom_id, condition_id, relevance_score, typical_onset, severity_modifier, notes)
SELECT s.id, c.id, 0.75, 'gradual', 1.0, 'Dry or productive'
FROM symptoms s, conditions c
WHERE s.name = 'Cough' AND c.name = 'Common Cold';

INSERT INTO symptom_conditions (symptom_id, condition_id, relevance_score, typical_onset, severity_modifier, notes)
SELECT s.id, c.id, 0.60, 'gradual', 1.0, 'Mild'
FROM symptoms s, conditions c
WHERE s.name = 'Fatigue' AND c.name = 'Common Cold';

INSERT INTO symptom_conditions (symptom_id, condition_id, relevance_score, typical_onset, severity_modifier, notes)
SELECT s.id, c.id, 0.55, 'gradual', 1.0, 'Mild'
FROM symptoms s, conditions c
WHERE s.name = 'Headache' AND c.name = 'Common Cold';

-- INFLUENZA mappings
INSERT INTO symptom_conditions (symptom_id, condition_id, relevance_score, typical_onset, severity_modifier, notes)
SELECT s.id, c.id, 0.90, 'sudden', 1.4, 'Rigors'
FROM symptoms s, conditions c
WHERE s.name = 'Chills' AND c.name = 'Influenza';

INSERT INTO symptom_conditions (symptom_id, condition_id, relevance_score, typical_onset, severity_modifier, notes)
SELECT s.id, c.id, 0.90, 'sudden', 1.5, 'Myalgia severe'
FROM symptoms s, conditions c
WHERE s.name = 'Muscle pain' AND c.name = 'Influenza';

INSERT INTO symptom_conditions (symptom_id, condition_id, relevance_score, typical_onset, severity_modifier, notes)
SELECT s.id, c.id, 0.85, 'sudden', 1.5, 'Severe fatigue'
FROM symptoms s, conditions c
WHERE s.name = 'Fatigue' AND c.name = 'Influenza';

INSERT INTO symptom_conditions (symptom_id, condition_id, relevance_score, typical_onset, severity_modifier, notes)
SELECT s.id, c.id, 0.85, 'sudden', 1.4, 'Moderate to severe'
FROM symptoms s, conditions c
WHERE s.name = 'Headache' AND c.name = 'Influenza';

INSERT INTO symptom_conditions (symptom_id, condition_id, relevance_score, typical_onset, severity_modifier, notes)
SELECT s.id, c.id, 0.80, 'sudden', 1.3, 'Dry cough'
FROM symptoms s, conditions c
WHERE s.name = 'Cough' AND c.name = 'Influenza';

INSERT INTO symptom_conditions (symptom_id, condition_id, relevance_score, typical_onset, severity_modifier, notes)
SELECT s.id, c.id, 0.70, 'sudden', 1.2, 'Common'
FROM symptoms s, conditions c
WHERE s.name = 'Sore throat' AND c.name = 'Influenza';

-- ASTHMA mappings
INSERT INTO symptom_conditions (symptom_id, condition_id, relevance_score, typical_onset, severity_modifier, notes)
SELECT s.id, c.id, 0.95, 'intermittent', 1.6, 'Classic sign'
FROM symptoms s, conditions c
WHERE s.name = 'Wheezing' AND c.name = 'Asthma';

INSERT INTO symptom_conditions (symptom_id, condition_id, relevance_score, typical_onset, severity_modifier, notes)
SELECT s.id, c.id, 0.90, 'intermittent', 1.7, 'Dyspnea'
FROM symptoms s, conditions c
WHERE s.name = 'Difficulty breathing' AND c.name = 'Asthma';

INSERT INTO symptom_conditions (symptom_id, condition_id, relevance_score, typical_onset, severity_modifier, notes)
SELECT s.id, c.id, 0.85, 'intermittent', 1.5, 'Chest constriction'
FROM symptoms s, conditions c
WHERE s.name = 'Chest tightness' AND c.name = 'Asthma';

INSERT INTO symptom_conditions (symptom_id, condition_id, relevance_score, typical_onset, severity_modifier, notes)
SELECT s.id, c.id, 0.80, 'intermittent', 1.3, 'Often nocturnal'
FROM symptoms s, conditions c
WHERE s.name = 'Cough' AND c.name = 'Asthma';

-- MIGRAINE mappings
INSERT INTO symptom_conditions (symptom_id, condition_id, relevance_score, typical_onset, severity_modifier, notes)
SELECT s.id, c.id, 0.95, 'gradual', 1.8, 'Severe throbbing'
FROM symptoms s, conditions c
WHERE s.name = 'Headache' AND c.name = 'Migraine';

INSERT INTO symptom_conditions (symptom_id, condition_id, relevance_score, typical_onset, severity_modifier, notes)
SELECT s.id, c.id, 0.85, 'gradual', 1.4, 'Very common'
FROM symptoms s, conditions c
WHERE s.name = 'Nausea' AND c.name = 'Migraine';

INSERT INTO symptom_conditions (symptom_id, condition_id, relevance_score, typical_onset, severity_modifier, notes)
SELECT s.id, c.id, 0.70, 'gradual', 1.3, 'Common'
FROM symptoms s, conditions c
WHERE s.name = 'Vomiting' AND c.name = 'Migraine';

INSERT INTO symptom_conditions (symptom_id, condition_id, relevance_score, typical_onset, severity_modifier, notes)
SELECT s.id, c.id, 0.90, 'gradual', 1.5, 'Photophobia'
FROM symptoms s, conditions c
WHERE s.name = 'Sensitivity to light' AND c.name = 'Migraine';

INSERT INTO symptom_conditions (symptom_id, condition_id, relevance_score, typical_onset, severity_modifier, notes)
SELECT s.id, c.id, 0.75, 'gradual', 1.4, 'Aura'
FROM symptoms s, conditions c
WHERE s.name = 'Blurred vision' AND c.name = 'Migraine';

-- GASTROENTERITIS mappings
INSERT INTO symptom_conditions (symptom_id, condition_id, relevance_score, typical_onset, severity_modifier, notes)
SELECT s.id, c.id, 0.95, 'sudden', 1.5, 'Watery stools'
FROM symptoms s, conditions c
WHERE s.name = 'Diarrhea' AND c.name = 'Gastroenteritis';

INSERT INTO symptom_conditions (symptom_id, condition_id, relevance_score, typical_onset, severity_modifier, notes)
SELECT s.id, c.id, 0.90, 'sudden', 1.4, 'Very common'
FROM symptoms s, conditions c
WHERE s.name = 'Nausea' AND c.name = 'Gastroenteritis';

INSERT INTO symptom_conditions (symptom_id, condition_id, relevance_score, typical_onset, severity_modifier, notes)
SELECT s.id, c.id, 0.90, 'sudden', 1.5, 'Very common'
FROM symptoms s, conditions c
WHERE s.name = 'Vomiting' AND c.name = 'Gastroenteritis';

INSERT INTO symptom_conditions (symptom_id, condition_id, relevance_score, typical_onset, severity_modifier, notes)
SELECT s.id, c.id, 0.85, 'sudden', 1.4, 'Cramping'
FROM symptoms s, conditions c
WHERE s.name = 'Abdominal pain' AND c.name = 'Gastroenteritis';

-- Add more conditions with existing symptoms...
-- COVID-19
INSERT INTO symptom_conditions (symptom_id, condition_id, relevance_score, typical_onset, severity_modifier, notes)
SELECT s.id, c.id, 0.85, 'gradual', 1.4, 'Dry cough'
FROM symptoms s, conditions c
WHERE s.name = 'Cough' AND c.name = 'COVID-19';

INSERT INTO symptom_conditions (symptom_id, condition_id, relevance_score, typical_onset, severity_modifier, notes)
SELECT s.id, c.id, 0.80, 'gradual', 1.5, 'Severe'
FROM symptoms s, conditions c
WHERE s.name = 'Fatigue' AND c.name = 'COVID-19';

INSERT INTO symptom_conditions (symptom_id, condition_id, relevance_score, typical_onset, severity_modifier, notes)
SELECT s.id, c.id, 0.70, 'gradual', 1.8, 'If severe'
FROM symptoms s, conditions c
WHERE s.name = 'Difficulty breathing' AND c.name = 'COVID-19';

INSERT INTO symptom_conditions (symptom_id, condition_id, relevance_score, typical_onset, severity_modifier, notes)
SELECT s.id, c.id, 0.75, 'gradual', 1.3, 'Myalgia'
FROM symptoms s, conditions c
WHERE s.name = 'Muscle pain' AND c.name = 'COVID-19';

INSERT INTO symptom_conditions (symptom_id, condition_id, relevance_score, typical_onset, severity_modifier, notes)
SELECT s.id, c.id, 0.65, 'gradual', 1.2, 'Common'
FROM symptoms s, conditions c
WHERE s.name = 'Loss of appetite' AND c.name = 'COVID-19';

-- Verification
SELECT 'Total symptom-condition mappings: ' || COUNT(*)::TEXT FROM symptom_conditions;
SELECT 
    c.name as condition,
    COUNT(sc.id) as symptom_count
FROM conditions c
LEFT JOIN symptom_conditions sc ON c.id = sc.condition_id
GROUP BY c.name
ORDER BY symptom_count DESC
LIMIT 10;