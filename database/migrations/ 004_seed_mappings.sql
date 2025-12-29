-- Migration 004: Seed Symptom-Condition Mappings
-- Date: 2025-01-01
-- Description: Maps symptoms to conditions with relevance scores

-- Helper function to get symptom ID by name
CREATE OR REPLACE FUNCTION get_symptom_id(symptom_name TEXT) RETURNS UUID AS $$
    SELECT id FROM symptoms WHERE name = symptom_name LIMIT 1;
$$ LANGUAGE SQL;

-- Helper function to get condition ID by name
CREATE OR REPLACE FUNCTION get_condition_id(condition_name TEXT) RETURNS UUID AS $$
    SELECT id FROM conditions WHERE name = condition_name LIMIT 1;
$$ LANGUAGE SQL;

-- MYOCARDIAL INFARCTION (Heart Attack) mappings
INSERT INTO symptom_conditions (symptom_id, condition_id, relevance_score, typical_onset, severity_modifier, notes) VALUES
(get_symptom_id('Chest pain'), get_condition_id('Myocardial Infarction'), 0.95, 'sudden', 2.0, 'Classic crushing chest pain'),
(get_symptom_id('Difficulty breathing'), get_condition_id('Myocardial Infarction'), 0.85, 'sudden', 1.8, 'Shortness of breath common'),
(get_symptom_id('Sweating'), get_condition_id('Myocardial Infarction'), 0.75, 'sudden', 1.5, 'Cold sweats typical'),
(get_symptom_id('Nausea'), get_condition_id('Myocardial Infarction'), 0.65, 'sudden', 1.3, 'Often accompanies MI'),
(get_symptom_id('Lightheadedness'), get_condition_id('Myocardial Infarction'), 0.60, 'sudden', 1.4, 'Due to reduced cardiac output');

-- STROKE mappings
INSERT INTO symptom_conditions (symptom_id, condition_id, relevance_score, typical_onset, severity_modifier, notes) VALUES
(get_symptom_id('Slurred speech'), get_condition_id('Stroke'), 0.90, 'sudden', 2.0, 'Key FAST sign'),
(get_symptom_id('Facial drooping'), get_condition_id('Stroke'), 0.92, 'sudden', 2.0, 'Key FAST sign'),
(get_symptom_id('Arm weakness'), get_condition_id('Stroke'), 0.90, 'sudden', 2.0, 'Key FAST sign'),
(get_symptom_id('Sudden severe headache'), get_condition_id('Stroke'), 0.85, 'sudden', 2.0, 'Hemorrhagic stroke'),
(get_symptom_id('Confusion'), get_condition_id('Stroke'), 0.80, 'sudden', 1.8, 'Altered mental status'),
(get_symptom_id('Dizziness'), get_condition_id('Stroke'), 0.70, 'sudden', 1.5, 'Loss of balance'),
(get_symptom_id('Double vision'), get_condition_id('Stroke'), 0.75, 'sudden', 1.6, 'Vision changes');

-- PULMONARY EMBOLISM mappings
INSERT INTO symptom_conditions (symptom_id, condition_id, relevance_score, typical_onset, severity_modifier, notes) VALUES
(get_symptom_id('Difficulty breathing'), get_condition_id('Pulmonary Embolism'), 0.90, 'sudden', 2.0, 'Sudden onset dyspnea'),
(get_symptom_id('Chest pain'), get_condition_id('Pulmonary Embolism'), 0.85, 'sudden', 1.8, 'Sharp, pleuritic pain'),
(get_symptom_id('Rapid heartbeat'), get_condition_id('Pulmonary Embolism'), 0.80, 'sudden', 1.6, 'Tachycardia'),
(get_symptom_id('Coughing up blood'), get_condition_id('Pulmonary Embolism'), 0.75, 'sudden', 1.9, 'Hemoptysis');

-- ANAPHYLAXIS mappings
INSERT INTO symptom_conditions (symptom_id, condition_id, relevance_score, typical_onset, severity_modifier, notes) VALUES
(get_symptom_id('Severe allergic reaction'), get_condition_id('Anaphylaxis'), 1.00, 'sudden', 2.0, 'Definition of anaphylaxis'),
(get_symptom_id('Difficulty breathing'), get_condition_id('Anaphylaxis'), 0.95, 'sudden', 2.0, 'Airway swelling'),
(get_symptom_id('Hives'), get_condition_id('Anaphylaxis'), 0.85, 'sudden', 1.5, 'Urticaria'),
(get_symptom_id('Swelling in legs'), get_condition_id('Anaphylaxis'), 0.80, 'sudden', 1.6, 'Angioedema'),
(get_symptom_id('Nausea'), get_condition_id('Anaphylaxis'), 0.70, 'sudden', 1.3, 'GI symptoms common'),
(get_symptom_id('Vomiting'), get_condition_id('Anaphylaxis'), 0.70, 'sudden', 1.3, 'GI symptoms common');

-- APPENDICITIS mappings
INSERT INTO symptom_conditions (symptom_id, condition_id, relevance_score, typical_onset, severity_modifier, notes) VALUES
(get_symptom_id('Severe abdominal pain'), get_condition_id('Appendicitis'), 0.95, 'gradual', 1.9, 'RLQ pain classic'),
(get_symptom_id('Nausea'), get_condition_id('Appendicitis'), 0.80, 'gradual', 1.4, 'Very common'),
(get_symptom_id('Vomiting'), get_condition_id('Appendicitis'), 0.75, 'gradual', 1.4, 'Common'),
(get_symptom_id('Fever'), get_condition_id('Appendicitis'), 0.70, 'gradual', 1.5, 'Low-grade initially'),
(get_symptom_id('Loss of appetite'), get_condition_id('Appendicitis'), 0.85, 'gradual', 1.3, 'Early sign');

-- MENINGITIS mappings
INSERT INTO symptom_conditions (symptom_id, condition_id, relevance_score, typical_onset, severity_modifier, notes) VALUES
(get_symptom_id('Sudden severe headache'), get_condition_id('Meningitis'), 0.90, 'sudden', 2.0, 'Severe headache'),
(get_symptom_id('Fever'), get_condition_id('Meningitis'), 0.95, 'sudden', 1.8, 'High fever'),
(get_symptom_id('Neck pain'), get_condition_id('Meningitis'), 0.90, 'sudden', 1.9, 'Neck stiffness'),
(get_symptom_id('Confusion'), get_condition_id('Meningitis'), 0.85, 'sudden', 1.8, 'Altered consciousness'),
(get_symptom_id('Sensitivity to light'), get_condition_id('Meningitis'), 0.80, 'sudden', 1.5, 'Photophobia'),
(get_symptom_id('Nausea'), get_condition_id('Meningitis'), 0.70, 'sudden', 1.3, 'Common symptom');

-- PNEUMONIA mappings
INSERT INTO symptom_conditions (symptom_id, condition_id, relevance_score, typical_onset, severity_modifier, notes) VALUES
(get_symptom_id('Cough'), get_condition_id('Pneumonia'), 0.95, 'gradual', 1.6, 'Productive cough'),
(get_symptom_id('Fever'), get_condition_id('Pneumonia'), 0.90, 'gradual', 1.7, 'High fever'),
(get_symptom_id('Difficulty breathing'), get_condition_id('Pneumonia'), 0.85, 'gradual', 1.8, 'Dyspnea'),
(get_symptom_id('Chest pain'), get_condition_id('Pneumonia'), 0.75, 'gradual', 1.5, 'Pleuritic pain'),
(get_symptom_id('Fatigue'), get_condition_id('Pneumonia'), 0.80, 'gradual', 1.4, 'Weakness common'),
(get_symptom_id('Chills'), get_condition_id('Pneumonia'), 0.75, 'gradual', 1.4, 'With fever');

-- UTI mappings
INSERT INTO symptom_conditions (symptom_id, condition_id, relevance_score, typical_onset, severity_modifier, notes) VALUES
(get_symptom_id('Painful urination'), get_condition_id('Urinary Tract Infection'), 0.95, 'gradual', 1.6, 'Dysuria classic'),
(get_symptom_id('Frequent urination'), get_condition_id('Urinary Tract Infection'), 0.90, 'gradual', 1.4, 'Urgency and frequency'),
(get_symptom_id('Abdominal pain'), get_condition_id('Urinary Tract Infection'), 0.70, 'gradual', 1.3, 'Lower abdomen'),
(get_symptom_id('Blood in urine'), get_condition_id('Urinary Tract Infection'), 0.65, 'gradual', 1.5, 'Hematuria possible'),
(get_symptom_id('Fever'), get_condition_id('Urinary Tract Infection'), 0.60, 'gradual', 1.6, 'If upper UTI');

-- COMMON COLD mappings
INSERT INTO symptom_conditions (symptom_id, condition_id, relevance_score, typical_onset, severity_modifier, notes) VALUES
(get_symptom_id('Runny nose'), get_condition_id('Common Cold'), 0.95, 'gradual', 1.0, 'Rhinorrhea'),
(get_symptom_id('Stuffy nose'), get_condition_id('Common Cold'), 0.90, 'gradual', 1.0, 'Congestion'),
(get_symptom_id('Sneezing'), get_condition_id('Common Cold'), 0.85, 'gradual', 1.0, 'Common'),
(get_symptom_id('Sore throat'), get_condition_id('Common Cold'), 0.80, 'gradual', 1.1, 'Mild pharyngitis'),
(get_symptom_id('Cough'), get_condition_id('Common Cold'), 0.75, 'gradual', 1.0, 'Dry or productive'),
(get_symptom_id('Fatigue'), get_condition_id('Common Cold'), 0.60, 'gradual', 1.0, 'Mild'),
(get_symptom_id('Headache'), get_condition_id('Common Cold'), 0.55, 'gradual', 1.0, 'Mild');

-- INFLUENZA mappings
INSERT INTO symptom_conditions (symptom_id, condition_id, relevance_score, typical_onset, severity_modifier, notes) VALUES
(get_symptom_id('Fever'), get_condition_id('Influenza'), 0.95, 'sudden', 1.5, 'High fever'),
(get_symptom_id('Chills'), get_condition_id('Influenza'), 0.90, 'sudden', 1.4, 'Rigors'),
(get_symptom_id('Muscle pain'), get_condition_id('Influenza'), 0.90, 'sudden', 1.5, 'Myalgia severe'),
(get_symptom_id('Fatigue'), get_condition_id('Influenza'), 0.85, 'sudden', 1.5, 'Severe fatigue'),
(get_symptom_id('Headache'), get_condition_id('Influenza'), 0.85, 'sudden', 1.4, 'Moderate to severe'),
(get_symptom_id('Cough'), get_condition_id('Influenza'), 0.80, 'sudden', 1.3, 'Dry cough'),
(get_symptom_id('Sore throat'), get_condition_id('Influenza'), 0.70, 'sudden', 1.2, 'Common');

-- ALLERGIC RHINITIS mappings
INSERT INTO symptom_conditions (symptom_id, condition_id, relevance_score, typical_onset, severity_modifier, notes) VALUES
(get_symptom_id('Runny nose'), get_condition_id('Allergic Rhinitis'), 0.95, 'sudden', 1.0, 'Clear discharge'),
(get_symptom_id('Sneezing'), get_condition_id('Allergic Rhinitis'), 0.90, 'sudden', 1.0, 'Frequent'),
(get_symptom_id('Stuffy nose'), get_condition_id('Allergic Rhinitis'), 0.85, 'sudden', 1.0, 'Congestion'),
(get_symptom_id('Itching'), get_condition_id('Allergic Rhinitis'), 0.80, 'sudden', 1.0, 'Nose, eyes, throat'),
(get_symptom_id('Red eyes'), get_condition_id('Allergic Rhinitis'), 0.75, 'sudden', 1.0, 'Conjunctivitis');

-- GERD mappings
INSERT INTO symptom_conditions (symptom_id, condition_id, relevance_score, typical_onset, severity_modifier, notes) VALUES
(get_symptom_id('Heartburn'), get_condition_id('Gastroesophageal Reflux Disease'), 0.95, 'gradual', 1.2, 'Classic symptom'),
(get_symptom_id('Chest pain'), get_condition_id('Gastroesophageal Reflux Disease'), 0.70, 'gradual', 1.1, 'Mimics cardiac pain'),
(get_symptom_id('Difficulty swallowing'), get_condition_id('Gastroesophageal Reflux Disease'), 0.65, 'gradual', 1.3, 'Dysphagia'),
(get_symptom_id('Sore throat'), get_condition_id('Gastroesophageal Reflux Disease'), 0.60, 'gradual', 1.0, 'Chronic'),
(get_symptom_id('Cough'), get_condition_id('Gastroesophageal Reflux Disease'), 0.55, 'gradual', 1.0, 'Chronic dry cough');

-- ASTHMA mappings
INSERT INTO symptom_conditions (symptom_id, condition_id, relevance_score, typical_onset, severity_modifier, notes) VALUES
(get_symptom_id('Wheezing'), get_condition_id('Asthma'), 0.95, 'intermittent', 1.6, 'Classic sign'),
(get_symptom_id('Difficulty breathing'), get_condition_id('Asthma'), 0.90, 'intermittent', 1.7, 'Dyspnea'),
(get_symptom_id('Chest tightness'), get_condition_id('Asthma'), 0.85, 'intermittent', 1.5, 'Chest constriction'),
(get_symptom_id('Cough'), get_condition_id('Asthma'), 0.80, 'intermittent', 1.3, 'Often nocturnal');

-- MIGRAINE mappings
INSERT INTO symptom_conditions (symptom_id, condition_id, relevance_score, typical_onset, severity_modifier, notes) VALUES
(get_symptom_id('Headache'), get_condition_id('Migraine'), 0.95, 'gradual', 1.8, 'Severe throbbing'),
(get_symptom_id('Nausea'), get_condition_id('Migraine'), 0.85, 'gradual', 1.4, 'Very common'),
(get_symptom_id('Vomiting'), get_condition_id('Migraine'), 0.70, 'gradual', 1.3, 'Common'),
(get_symptom_id('Sensitivity to light'), get_condition_id('Migraine'), 0.90, 'gradual', 1.5, 'Photophobia'),
(get_symptom_id('Blurred vision'), get_condition_id('Migraine'), 0.75, 'gradual', 1.4, 'Aura');

-- GASTROENTERITIS mappings
INSERT INTO symptom_conditions (symptom_id, condition_id, relevance_score, typical_onset, severity_modifier, notes) VALUES
(get_symptom_id('Diarrhea'), get_condition_id('Gastroenteritis'), 0.95, 'sudden', 1.5, 'Watery stools'),
(get_symptom_id('Nausea'), get_condition_id('Gastroenteritis'), 0.90, 'sudden', 1.4, 'Very common'),
(get_symptom_id('Vomiting'), get_condition_id('Gastroenteritis'), 0.90, 'sudden', 1.5, 'Very common'),
(get_symptom_id('Abdominal pain'), get_condition_id('Gastroenteritis'), 0.85, 'sudden', 1.4, 'Cramping'),
(get_symptom_id('Fever'), get_condition_id('Gastroenteritis'), 0.70, 'sudden', 1.3, 'Low-grade');

-- HYPERTENSION mappings (often asymptomatic)
INSERT INTO symptom_conditions (symptom_id, condition_id, relevance_score, typical_onset, severity_modifier, notes) VALUES
(get_symptom_id('Headache'), get_condition_id('Hypertension'), 0.45, 'gradual', 1.1, 'If severe HTN'),
(get_symptom_id('Dizziness'), get_condition_id('Hypertension'), 0.40, 'gradual', 1.1, 'Possible'),
(get_symptom_id('Blurred vision'), get_condition_id('Hypertension'), 0.35, 'gradual', 1.2, 'Hypertensive retinopathy');

-- TYPE 2 DIABETES mappings
INSERT INTO symptom_conditions (symptom_id, condition_id, relevance_score, typical_onset, severity_modifier, notes) VALUES
(get_symptom_id('Excessive thirst'), get_condition_id('Type 2 Diabetes'), 0.85, 'gradual', 1.4, 'Polydipsia'),
(get_symptom_id('Frequent urination'), get_condition_id('Type 2 Diabetes'), 0.85, 'gradual', 1.4, 'Polyuria'),
(get_symptom_id('Fatigue'), get_condition_id('Type 2 Diabetes'), 0.70, 'gradual', 1.3, 'Chronic'),
(get_symptom_id('Blurred vision'), get_condition_id('Type 2 Diabetes'), 0.65, 'gradual', 1.3, 'Due to glucose'),
(get_symptom_id('Weight loss'), get_condition_id('Type 2 Diabetes'), 0.60, 'gradual', 1.4, 'Unintentional');

-- OSTEOARTHRITIS mappings
INSERT INTO symptom_conditions (symptom_id, condition_id, relevance_score, typical_onset, severity_modifier, notes) VALUES
(get_symptom_id('Joint pain'), get_condition_id('Osteoarthritis'), 0.95, 'gradual', 1.5, 'Worse with activity'),
(get_symptom_id('Stiffness'), get_condition_id('Osteoarthritis'), 0.90, 'gradual', 1.4, 'Morning stiffness'),
(get_symptom_id('Swelling in legs'), get_condition_id('Osteoarthritis'), 0.65, 'gradual', 1.2, 'Joint swelling');

-- COVID-19 mappings
INSERT INTO symptom_conditions (symptom_id, condition_id, relevance_score, typical_onset, severity_modifier, notes) VALUES
(get_symptom_id('Fever'), get_condition_id('COVID-19'), 0.85, 'gradual', 1.5, 'Common'),
(get_symptom_id('Cough'), get_condition_id('COVID-19'), 0.85, 'gradual', 1.4, 'Dry cough'),
(get_symptom_id('Fatigue'), get_condition_id('COVID-19'), 0.80, 'gradual', 1.5, 'Severe'),
(get_symptom_id('Difficulty breathing'), get_condition_id('COVID-19'), 0.70, 'gradual', 1.8, 'If severe'),
(get_symptom_id('Muscle pain'), get_condition_id('COVID-19'), 0.75, 'gradual', 1.3, 'Myalgia'),
(get_symptom_id('Loss of appetite'), get_condition_id('COVID-19'), 0.65, 'gradual', 1.2, 'Common');

-- DEPRESSION mappings
INSERT INTO symptom_conditions (symptom_id, condition_id, relevance_score, typical_onset, severity_modifier, notes) VALUES
(get_symptom_id('Depression'), get_condition_id('Depression'), 1.00, 'gradual', 1.8, 'Core symptom'),
(get_symptom_id('Fatigue'), get_condition_id('Depression'), 0.85, 'gradual', 1.4, 'Chronic tiredness'),
(get_symptom_id('Insomnia'), get_condition_id('Depression'), 0.80, 'gradual', 1.4, 'Sleep problems'),
(get_symptom_id('Loss of appetite'), get_condition_id('Depression'), 0.75, 'gradual', 1.3, 'Or increased'),
(get_symptom_id('Difficulty concentrating'), get_condition_id('Depression'), 0.80, 'gradual', 1.4, 'Brain fog');

-- ANXIETY DISORDER mappings
INSERT INTO symptom_conditions (symptom_id, condition_id, relevance_score, typical_onset, severity_modifier, notes) VALUES
(get_symptom_id('Anxiety'), get_condition_id('Anxiety Disorder'), 1.00, 'intermittent', 1.7, 'Core symptom'),
(get_symptom_id('Rapid heartbeat'), get_condition_id('Anxiety Disorder'), 0.80, 'intermittent', 1.4, 'Palpitations'),
(get_symptom_id('Sweating'), get_condition_id('Anxiety Disorder'), 0.70, 'intermittent', 1.2, 'Diaphoresis'),
(get_symptom_id('Difficulty concentrating'), get_condition_id('Anxiety Disorder'), 0.75, 'intermittent', 1.3, 'Racing thoughts'),
(get_symptom_id('Insomnia'), get_condition_id('Anxiety Disorder'), 0.70, 'intermittent', 1.3, 'Sleep problems');

-- Add more mappings for remaining conditions...
-- CELLULITIS
INSERT INTO symptom_conditions (symptom_id, condition_id, relevance_score, typical_onset, severity_modifier, notes) VALUES
(get_symptom_id('Rash'), get_condition_id('Cellulitis'), 0.95, 'gradual', 1.6, 'Red, swollen, tender'),
(get_symptom_id('Fever'), get_condition_id('Cellulitis'), 0.75, 'gradual', 1.5, 'Often present'),
(get_symptom_id('Chills'), get_condition_id('Cellulitis'), 0.65, 'gradual', 1.4, 'With fever');

-- STREP THROAT
INSERT INTO symptom_conditions (symptom_id, condition_id, relevance_score, typical_onset, severity_modifier, notes) VALUES
(get_symptom_id('Sore throat'), get_condition_id('Strep Throat'), 0.95, 'sudden', 1.7, 'Severe pain'),
(get_symptom_id('Fever'), get_condition_id('Strep Throat'), 0.85, 'sudden', 1.5, 'High fever'),
(get_symptom_id('Headache'), get_condition_id('Strep Throat'), 0.70, 'sudden', 1.3, 'Common'),
(get_symptom_id('Abdominal pain'), get_condition_id('Strep Throat'), 0.60, 'sudden', 1.2, 'In children');

-- Drop helper functions
DROP FUNCTION get_symptom_id(TEXT);
DROP FUNCTION get_condition_id(TEXT);

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