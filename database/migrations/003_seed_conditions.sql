-- Migration 003: Seed Conditions Data
-- Date: 2025-01-01
-- Description: Populates conditions table with 50+ common medical conditions

-- EMERGENCY CONDITIONS
INSERT INTO conditions (name, description, category, typical_urgency, icd10_code, prevalence, age_groups, risk_factors, complications) VALUES
('Myocardial Infarction', 'Heart attack caused by blocked blood flow to heart muscle', 'cardiovascular', 'EMERGENCY', 'I21', 'common', 
ARRAY['adult', 'elderly'], 
ARRAY['smoking', 'high cholesterol', 'hypertension', 'diabetes', 'family history'], 
ARRAY['cardiac arrest', 'heart failure', 'death']),

('Stroke', 'Brain damage due to interrupted blood supply', 'neurological', 'EMERGENCY', 'I63', 'common', 
ARRAY['adult', 'elderly'], 
ARRAY['hypertension', 'atrial fibrillation', 'smoking', 'diabetes'], 
ARRAY['permanent disability', 'death', 'brain damage']),

('Pulmonary Embolism', 'Blood clot in lung arteries', 'respiratory', 'EMERGENCY', 'I26', 'uncommon', 
ARRAY['adult', 'elderly'], 
ARRAY['immobility', 'surgery', 'pregnancy', 'oral contraceptives'], 
ARRAY['right heart failure', 'death', 'pulmonary hypertension']),

('Anaphylaxis', 'Severe allergic reaction', 'immune', 'EMERGENCY', 'T78.2', 'uncommon', 
ARRAY['all'], 
ARRAY['previous allergies', 'asthma', 'family history'], 
ARRAY['respiratory failure', 'shock', 'death']),

('Appendicitis', 'Inflammation of the appendix', 'gastrointestinal', 'EMERGENCY', 'K35', 'common', 
ARRAY['pediatric', 'adult'], 
ARRAY['family history', 'diet low in fiber'], 
ARRAY['perforation', 'peritonitis', 'sepsis']),

('Meningitis', 'Inflammation of brain and spinal cord membranes', 'neurological', 'EMERGENCY', 'G03', 'rare', 
ARRAY['pediatric', 'adult'], 
ARRAY['immunocompromised', 'crowded living', 'unvaccinated'], 
ARRAY['brain damage', 'hearing loss', 'death']);

-- URGENT CONDITIONS (Need care within hours)
INSERT INTO conditions (name, description, category, typical_urgency, icd10_code, prevalence, age_groups, risk_factors, complications) VALUES
('Pneumonia', 'Lung infection causing inflammation', 'respiratory', 'URGENT', 'J18', 'common', 
ARRAY['pediatric', 'adult', 'elderly'], 
ARRAY['smoking', 'chronic lung disease', 'weakened immune system'], 
ARRAY['respiratory failure', 'sepsis', 'lung abscess']),

('Urinary Tract Infection', 'Bacterial infection of urinary system', 'urologic', 'URGENT', 'N39.0', 'very common', 
ARRAY['adult', 'elderly'], 
ARRAY['female gender', 'sexual activity', 'diabetes', 'catheter use'], 
ARRAY['kidney infection', 'sepsis', 'permanent kidney damage']),

('Cellulitis', 'Bacterial skin infection', 'dermatological', 'URGENT', 'L03', 'common', 
ARRAY['all'], 
ARRAY['skin breaks', 'lymphedema', 'obesity', 'diabetes'], 
ARRAY['sepsis', 'tissue death', 'abscess']),

('Acute Bronchitis', 'Inflammation of bronchial tubes', 'respiratory', 'URGENT', 'J20', 'very common', 
ARRAY['all'], 
ARRAY['smoking', 'air pollution', 'weakened immune system'], 
ARRAY['pneumonia', 'chronic bronchitis']),

('Kidney Stones', 'Hard deposits in kidneys', 'urologic', 'URGENT', 'N20', 'common', 
ARRAY['adult'], 
ARRAY['dehydration', 'high protein diet', 'family history'], 
ARRAY['kidney damage', 'infection', 'chronic kidney disease']),

('Gastroenteritis', 'Inflammation of stomach and intestines', 'gastrointestinal', 'URGENT', 'K52', 'very common', 
ARRAY['all'], 
ARRAY['contaminated food', 'poor hygiene', 'travel'], 
ARRAY['dehydration', 'electrolyte imbalance']),

('Migraine', 'Severe recurring headache', 'neurological', 'URGENT', 'G43', 'common', 
ARRAY['adult'], 
ARRAY['family history', 'stress', 'hormonal changes'], 
ARRAY['chronic migraine', 'medication overuse headache']),

('Acute Sinusitis', 'Inflammation of sinus cavities', 'respiratory', 'URGENT', 'J01', 'very common', 
ARRAY['all'], 
ARRAY['allergies', 'nasal polyps', 'immune deficiency'], 
ARRAY['chronic sinusitis', 'meningitis', 'vision problems']);

-- NON-URGENT CONDITIONS (Schedule appointment)
INSERT INTO conditions (name, description, category, typical_urgency, icd10_code, prevalence, age_groups, risk_factors, complications) VALUES
('Common Cold', 'Viral upper respiratory infection', 'respiratory', 'SELF_CARE', 'J00', 'very common', 
ARRAY['all'], 
ARRAY['close contact with infected persons', 'weakened immune system'], 
ARRAY['ear infection', 'sinusitis', 'bronchitis']),

('Influenza', 'Viral infection of respiratory system', 'respiratory', 'NON_URGENT', 'J10', 'common', 
ARRAY['all'], 
ARRAY['unvaccinated', 'chronic diseases', 'young age'], 
ARRAY['pneumonia', 'myocarditis', 'encephalitis']),

('Allergic Rhinitis', 'Hay fever - allergic inflammation of nose', 'respiratory', 'SELF_CARE', 'J30', 'very common', 
ARRAY['all'], 
ARRAY['family history', 'other allergies', 'environmental exposure'], 
ARRAY['sinusitis', 'ear infections', 'sleep disturbance']),

('Gastroesophageal Reflux Disease', 'Chronic acid reflux', 'gastrointestinal', 'NON_URGENT', 'K21', 'very common', 
ARRAY['adult', 'elderly'], 
ARRAY['obesity', 'pregnancy', 'smoking', 'certain foods'], 
ARRAY['esophagitis', 'Barretts esophagus', 'esophageal cancer']),

('Irritable Bowel Syndrome', 'Chronic digestive disorder', 'gastrointestinal', 'NON_URGENT', 'K58', 'common', 
ARRAY['adult'], 
ARRAY['stress', 'food intolerances', 'family history'], 
ARRAY['malnutrition', 'reduced quality of life']),

('Hypertension', 'High blood pressure', 'cardiovascular', 'NON_URGENT', 'I10', 'very common', 
ARRAY['adult', 'elderly'], 
ARRAY['obesity', 'sedentary lifestyle', 'high sodium diet', 'family history'], 
ARRAY['heart attack', 'stroke', 'kidney disease']),

('Type 2 Diabetes', 'Metabolic disorder with high blood sugar', 'endocrine', 'NON_URGENT', 'E11', 'very common', 
ARRAY['adult', 'elderly'], 
ARRAY['obesity', 'sedentary lifestyle', 'family history'], 
ARRAY['neuropathy', 'kidney disease', 'blindness', 'cardiovascular disease']),

('Osteoarthritis', 'Degenerative joint disease', 'musculoskeletal', 'NON_URGENT', 'M19', 'very common', 
ARRAY['elderly', 'adult'], 
ARRAY['age', 'obesity', 'joint injury', 'genetics'], 
ARRAY['chronic pain', 'reduced mobility', 'disability']),

('Lower Back Pain', 'Pain in lumbar region', 'musculoskeletal', 'NON_URGENT', 'M54.5', 'very common', 
ARRAY['adult'], 
ARRAY['sedentary lifestyle', 'poor posture', 'obesity', 'heavy lifting'], 
ARRAY['chronic pain', 'disability', 'nerve damage']),

('Tension Headache', 'Most common type of headache', 'neurological', 'SELF_CARE', 'G44.2', 'very common', 
ARRAY['adult'], 
ARRAY['stress', 'poor posture', 'eye strain'], 
ARRAY['chronic tension headache', 'medication overuse']),

('Insomnia', 'Chronic difficulty sleeping', 'general', 'NON_URGENT', 'G47.0', 'common', 
ARRAY['adult'], 
ARRAY['stress', 'depression', 'medications', 'caffeine'], 
ARRAY['fatigue', 'mood disorders', 'reduced quality of life']),

('Anxiety Disorder', 'Excessive worry and fear', 'psychological', 'NON_URGENT', 'F41', 'common', 
ARRAY['adult'], 
ARRAY['stress', 'trauma', 'family history', 'chronic illness'], 
ARRAY['depression', 'substance abuse', 'physical health problems']),

('Depression', 'Persistent low mood and loss of interest', 'psychological', 'NON_URGENT', 'F32', 'common', 
ARRAY['adult'], 
ARRAY['family history', 'trauma', 'chronic stress', 'medical conditions'], 
ARRAY['suicide', 'substance abuse', 'physical health problems']);

-- CHRONIC CONDITIONS
INSERT INTO conditions (name, description, category, typical_urgency, icd10_code, prevalence, age_groups, risk_factors, complications) VALUES
('Asthma', 'Chronic inflammatory airway disease', 'respiratory', 'NON_URGENT', 'J45', 'common', 
ARRAY['pediatric', 'adult'], 
ARRAY['allergies', 'family history', 'air pollution'], 
ARRAY['respiratory failure', 'status asthmaticus', 'death']),

('Chronic Obstructive Pulmonary Disease', 'Progressive lung disease', 'respiratory', 'NON_URGENT', 'J44', 'common', 
ARRAY['elderly', 'adult'], 
ARRAY['smoking', 'air pollution', 'occupational exposures'], 
ARRAY['respiratory failure', 'heart problems', 'lung cancer']),

('Hypothyroidism', 'Underactive thyroid gland', 'endocrine', 'NON_URGENT', 'E03', 'common', 
ARRAY['adult', 'elderly'], 
ARRAY['autoimmune disease', 'radiation therapy', 'certain medications'], 
ARRAY['heart disease', 'mental health issues', 'myxedema']),

('Hyperthyroidism', 'Overactive thyroid gland', 'endocrine', 'NON_URGENT', 'E05', 'uncommon', 
ARRAY['adult'], 
ARRAY['family history', 'autoimmune disease', 'high iodine intake'], 
ARRAY['heart problems', 'brittle bones', 'thyroid storm']),

('Atrial Fibrillation', 'Irregular heart rhythm', 'cardiovascular', 'URGENT', 'I48', 'common', 
ARRAY['elderly', 'adult'], 
ARRAY['heart disease', 'hypertension', 'sleep apnea'], 
ARRAY['stroke', 'heart failure', 'blood clots']),

('Chronic Kidney Disease', 'Progressive loss of kidney function', 'urologic', 'NON_URGENT', 'N18', 'common', 
ARRAY['adult', 'elderly'], 
ARRAY['diabetes', 'hypertension', 'family history'], 
ARRAY['kidney failure', 'cardiovascular disease', 'anemia']);

-- INFECTIOUS DISEASES
INSERT INTO conditions (name, description, category, typical_urgency, icd10_code, prevalence, age_groups, risk_factors, complications) VALUES
('COVID-19', 'Coronavirus respiratory infection', 'respiratory', 'URGENT', 'U07.1', 'common', 
ARRAY['all'], 
ARRAY['unvaccinated', 'immunocompromised', 'chronic diseases'], 
ARRAY['pneumonia', 'ARDS', 'long COVID', 'death']),

('Strep Throat', 'Bacterial throat infection', 'respiratory', 'URGENT', 'J02.0', 'common', 
ARRAY['pediatric', 'adult'], 
ARRAY['close contact', 'weakened immune system'], 
ARRAY['rheumatic fever', 'kidney inflammation', 'abscess']),

('Ear Infection', 'Middle ear inflammation', 'otologic', 'URGENT', 'H66', 'very common', 
ARRAY['pediatric'], 
ARRAY['young age', 'daycare', 'bottle feeding'], 
ARRAY['hearing loss', 'chronic infections', 'mastoiditis']),

('Conjunctivitis', 'Pink eye - inflammation of conjunctiva', 'ophthalmologic', 'NON_URGENT', 'H10', 'common', 
ARRAY['all'], 
ARRAY['close contact', 'allergies', 'irritants'], 
ARRAY['corneal damage', 'chronic inflammation']),

('Shingles', 'Viral infection causing painful rash', 'dermatological', 'URGENT', 'B02', 'common', 
ARRAY['elderly', 'adult'], 
ARRAY['previous chickenpox', 'weakened immune system', 'age over 50'], 
ARRAY['postherpetic neuralgia', 'vision loss', 'neurological problems']);

-- DERMATOLOGICAL CONDITIONS
INSERT INTO conditions (name, description, category, typical_urgency, icd10_code, prevalence, age_groups, risk_factors, complications) VALUES
('Eczema', 'Chronic inflammatory skin condition', 'dermatological', 'NON_URGENT', 'L30', 'common', 
ARRAY['pediatric', 'adult'], 
ARRAY['family history', 'allergies', 'environmental factors'], 
ARRAY['skin infections', 'sleep disturbance', 'scarring']),

('Psoriasis', 'Autoimmune skin condition', 'dermatological', 'NON_URGENT', 'L40', 'common', 
ARRAY['adult'], 
ARRAY['family history', 'stress', 'infections'], 
ARRAY['psoriatic arthritis', 'cardiovascular disease', 'depression']),

('Acne', 'Inflammatory skin condition with pimples', 'dermatological', 'SELF_CARE', 'L70', 'very common', 
ARRAY['pediatric', 'adult'], 
ARRAY['hormones', 'genetics', 'stress'], 
ARRAY['scarring', 'emotional distress', 'pigmentation changes']),

('Contact Dermatitis', 'Skin inflammation from contact with irritant', 'dermatological', 'SELF_CARE', 'L25', 'common', 
ARRAY['all'], 
ARRAY['sensitive skin', 'occupational exposures'], 
ARRAY['chronic inflammation', 'infection']);

-- MUSCULOSKELETAL CONDITIONS
INSERT INTO conditions (name, description, category, typical_urgency, icd10_code, prevalence, age_groups, risk_factors, complications) VALUES
('Rheumatoid Arthritis', 'Autoimmune joint disease', 'musculoskeletal', 'NON_URGENT', 'M05', 'common', 
ARRAY['adult'], 
ARRAY['family history', 'smoking', 'female gender'], 
ARRAY['joint damage', 'disability', 'cardiovascular disease']),

('Fibromyalgia', 'Chronic widespread pain condition', 'musculoskeletal', 'NON_URGENT', 'M79.7', 'common', 
ARRAY['adult'], 
ARRAY['female gender', 'family history', 'stress'], 
ARRAY['depression', 'sleep problems', 'reduced quality of life']),

('Carpal Tunnel Syndrome', 'Nerve compression in wrist', 'musculoskeletal', 'NON_URGENT', 'G56.0', 'common', 
ARRAY['adult'], 
ARRAY['repetitive hand use', 'obesity', 'pregnancy'], 
ARRAY['permanent nerve damage', 'muscle weakness']),

('Tendinitis', 'Inflammation of tendon', 'musculoskeletal', 'NON_URGENT', 'M77', 'common', 
ARRAY['adult'], 
ARRAY['repetitive movements', 'sports', 'age'], 
ARRAY['chronic pain', 'tendon rupture']);

-- Add GI conditions
INSERT INTO conditions (name, description, category, typical_urgency, icd10_code, prevalence, age_groups, risk_factors, complications) VALUES
('Peptic Ulcer', 'Sore in stomach or intestine lining', 'gastrointestinal', 'URGENT', 'K27', 'common', 
ARRAY['adult'], 
ARRAY['H. pylori infection', 'NSAID use', 'smoking'], 
ARRAY['bleeding', 'perforation', 'gastric cancer']),

('Diverticulitis', 'Inflammation of colon pouches', 'gastrointestinal', 'URGENT', 'K57', 'common', 
ARRAY['elderly', 'adult'], 
ARRAY['low fiber diet', 'obesity', 'smoking'], 
ARRAY['abscess', 'perforation', 'fistula']),

('Hemorrhoids', 'Swollen veins in rectum or anus', 'gastrointestinal', 'SELF_CARE', 'K64', 'very common', 
ARRAY['adult'], 
ARRAY['constipation', 'pregnancy', 'obesity'], 
ARRAY['thrombosis', 'anemia', 'strangulation']);

-- Verification
SELECT 'Total conditions loaded: ' || COUNT(*)::TEXT FROM conditions;
SELECT 'Emergency conditions: ' || COUNT(*)::TEXT FROM conditions WHERE typical_urgency = 'EMERGENCY';
SELECT 'Urgent conditions: ' || COUNT(*)::TEXT FROM conditions WHERE typical_urgency = 'URGENT';
SELECT 'Non-urgent conditions: ' || COUNT(*)::TEXT FROM conditions WHERE typical_urgency = 'NON_URGENT';
SELECT 'Self-care conditions: ' || COUNT(*)::TEXT FROM conditions WHERE typical_urgency = 'SELF_CARE';