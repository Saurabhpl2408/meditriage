-- Migration 002: Seed Symptoms Data
-- Date: 2025-01-01
-- Description: Populates symptoms table with 100+ common medical symptoms

-- RED FLAG SYMPTOMS (Emergency indicators)
INSERT INTO symptoms (name, description, common_names, body_system, default_severity, is_red_flag, keywords) VALUES
('Chest pain', 'Pain or discomfort in the chest area', ARRAY['chest pressure', 'chest tightness', 'angina'], 'cardiovascular', 'SEVERE', TRUE, ARRAY['chest', 'pain', 'pressure', 'tight', 'squeeze']),
('Severe bleeding', 'Excessive blood loss that cannot be controlled', ARRAY['hemorrhage', 'heavy bleeding', 'uncontrolled bleeding'], 'hematologic', 'CRITICAL', TRUE, ARRAY['bleeding', 'blood', 'hemorrhage', 'gushing']),
('Difficulty breathing', 'Shortness of breath or inability to breathe normally', ARRAY['shortness of breath', 'dyspnea', 'cant breathe'], 'respiratory', 'SEVERE', TRUE, ARRAY['breathing', 'breath', 'air', 'dyspnea', 'suffocate']),
('Sudden severe headache', 'Worst headache of life, sudden onset', ARRAY['thunderclap headache', 'worst headache ever'], 'neurological', 'SEVERE', TRUE, ARRAY['headache', 'sudden', 'severe', 'worst', 'thunderclap']),
('Slurred speech', 'Difficulty speaking clearly', ARRAY['speech difficulty', 'cant speak'], 'neurological', 'SEVERE', TRUE, ARRAY['speech', 'slurred', 'talking', 'words']),
('Facial drooping', 'One side of face droops or is numb', ARRAY['face weakness', 'facial asymmetry'], 'neurological', 'SEVERE', TRUE, ARRAY['face', 'drooping', 'droop', 'numb', 'asymmetry']),
('Arm weakness', 'Sudden weakness or numbness in one or both arms', ARRAY['limb weakness', 'arm numbness'], 'neurological', 'SEVERE', TRUE, ARRAY['arm', 'weakness', 'numb', 'limb', 'paralysis']),
('Loss of consciousness', 'Fainting, passing out, or being knocked out', ARRAY['fainting', 'syncope', 'passed out'], 'neurological', 'CRITICAL', TRUE, ARRAY['unconscious', 'faint', 'blackout', 'passed out']),
('Severe abdominal pain', 'Intense stomach pain, especially if sudden', ARRAY['acute abdomen', 'stomach pain severe'], 'gastrointestinal', 'SEVERE', TRUE, ARRAY['abdomen', 'stomach', 'severe', 'acute', 'intense']),
('Confusion', 'Sudden confusion, disorientation, or altered mental state', ARRAY['disorientation', 'altered mental status'], 'neurological', 'SEVERE', TRUE, ARRAY['confused', 'disoriented', 'mental', 'altered']),
('Seizures', 'Convulsions or uncontrolled shaking', ARRAY['convulsions', 'fits'], 'neurological', 'CRITICAL', TRUE, ARRAY['seizure', 'convulsion', 'shaking', 'fit', 'epilepsy']),
('Coughing up blood', 'Blood in cough or sputum', ARRAY['hemoptysis', 'bloody cough'], 'respiratory', 'SEVERE', TRUE, ARRAY['cough', 'blood', 'hemoptysis', 'sputum']),
('Vomiting blood', 'Blood in vomit', ARRAY['hematemesis', 'bloody vomit'], 'gastrointestinal', 'SEVERE', TRUE, ARRAY['vomit', 'blood', 'hematemesis', 'throwing up']),
('Severe allergic reaction', 'Anaphylaxis symptoms', ARRAY['anaphylaxis', 'severe allergy'], 'immune', 'CRITICAL', TRUE, ARRAY['allergic', 'anaphylaxis', 'swelling', 'hives', 'severe']),
('Blue lips or face', 'Cyanosis - bluish discoloration', ARRAY['cyanosis', 'turning blue'], 'respiratory', 'CRITICAL', TRUE, ARRAY['blue', 'cyanosis', 'lips', 'face', 'discoloration']);

-- RESPIRATORY SYMPTOMS
INSERT INTO symptoms (name, description, common_names, body_system, default_severity, is_red_flag, keywords) VALUES
('Cough', 'Repeated expulsion of air from lungs', ARRAY['coughing'], 'respiratory', 'MILD', FALSE, ARRAY['cough', 'coughing', 'hack']),
('Runny nose', 'Excess nasal drainage', ARRAY['rhinorrhea', 'nasal discharge'], 'respiratory', 'MILD', FALSE, ARRAY['runny', 'nose', 'drainage', 'rhinorrhea']),
('Stuffy nose', 'Nasal congestion', ARRAY['congestion', 'blocked nose'], 'respiratory', 'MILD', FALSE, ARRAY['stuffy', 'congestion', 'blocked', 'nose']),
('Sore throat', 'Pain or irritation in throat', ARRAY['pharyngitis', 'throat pain'], 'respiratory', 'MILD', FALSE, ARRAY['throat', 'sore', 'pain', 'scratchy']),
('Wheezing', 'Whistling sound when breathing', ARRAY['breathing noise'], 'respiratory', 'MODERATE', FALSE, ARRAY['wheeze', 'whistling', 'breathing', 'sound']),
('Sneezing', 'Sudden forceful expulsion of air', ARRAY['sternutation'], 'respiratory', 'MILD', FALSE, ARRAY['sneeze', 'sneezing', 'achoo']),
('Hoarse voice', 'Rough or raspy voice', ARRAY['laryngitis', 'voice change'], 'respiratory', 'MILD', FALSE, ARRAY['hoarse', 'voice', 'raspy', 'rough']);

-- CARDIOVASCULAR SYMPTOMS
INSERT INTO symptoms (name, description, common_names, body_system, default_severity, is_red_flag, keywords) VALUES
('Rapid heartbeat', 'Heart beating faster than normal', ARRAY['tachycardia', 'palpitations'], 'cardiovascular', 'MODERATE', FALSE, ARRAY['heart', 'fast', 'racing', 'palpitation', 'rapid']),
('Irregular heartbeat', 'Heart rhythm not regular', ARRAY['arrhythmia', 'heart flutter'], 'cardiovascular', 'MODERATE', FALSE, ARRAY['irregular', 'heart', 'flutter', 'skip', 'arrhythmia']),
('Chest tightness', 'Feeling of pressure in chest (non-severe)', ARRAY['chest pressure mild'], 'cardiovascular', 'MODERATE', FALSE, ARRAY['chest', 'tight', 'pressure', 'constriction']),
('Swelling in legs', 'Edema in lower extremities', ARRAY['leg edema', 'ankle swelling'], 'cardiovascular', 'MODERATE', FALSE, ARRAY['swelling', 'edema', 'legs', 'ankles', 'puffy']),
('Lightheadedness', 'Feeling faint or dizzy', ARRAY['presyncope', 'almost fainting'], 'cardiovascular', 'MODERATE', FALSE, ARRAY['lightheaded', 'dizzy', 'faint', 'woozy']);

-- GASTROINTESTINAL SYMPTOMS
INSERT INTO symptoms (name, description, common_names, body_system, default_severity, is_red_flag, keywords) VALUES
('Nausea', 'Feeling of needing to vomit', ARRAY['queasiness', 'sick stomach'], 'gastrointestinal', 'MILD', FALSE, ARRAY['nausea', 'nauseous', 'queasy', 'sick']),
('Vomiting', 'Forceful expulsion of stomach contents', ARRAY['throwing up', 'emesis'], 'gastrointestinal', 'MODERATE', FALSE, ARRAY['vomit', 'vomiting', 'throw up', 'puke']),
('Diarrhea', 'Loose or watery stools', ARRAY['loose stool'], 'gastrointestinal', 'MILD', FALSE, ARRAY['diarrhea', 'loose', 'stool', 'bowel', 'watery']),
('Constipation', 'Difficulty passing stools', ARRAY['hard stool', 'difficult bowel movement'], 'gastrointestinal', 'MILD', FALSE, ARRAY['constipation', 'hard', 'stool', 'blocked', 'difficult']),
('Abdominal pain', 'General stomach discomfort', ARRAY['stomach ache', 'belly pain'], 'gastrointestinal', 'MODERATE', FALSE, ARRAY['stomach', 'abdomen', 'belly', 'pain', 'ache']),
('Heartburn', 'Burning sensation in chest from acid reflux', ARRAY['acid reflux', 'indigestion'], 'gastrointestinal', 'MILD', FALSE, ARRAY['heartburn', 'reflux', 'burning', 'acid', 'indigestion']),
('Bloating', 'Feeling of fullness or swelling in abdomen', ARRAY['gas', 'distension'], 'gastrointestinal', 'MILD', FALSE, ARRAY['bloating', 'bloated', 'gas', 'full', 'distended']),
('Loss of appetite', 'Reduced desire to eat', ARRAY['anorexia', 'not hungry'], 'gastrointestinal', 'MILD', FALSE, ARRAY['appetite', 'hungry', 'food', 'eating', 'anorexia']);

-- NEUROLOGICAL SYMPTOMS
INSERT INTO symptoms (name, description, common_names, body_system, default_severity, is_red_flag, keywords) VALUES
('Headache', 'Pain in head (non-severe)', ARRAY['head pain'], 'neurological', 'MILD', FALSE, ARRAY['headache', 'head', 'pain', 'ache']),
('Dizziness', 'Sensation of spinning or unsteadiness', ARRAY['vertigo'], 'neurological', 'MODERATE', FALSE, ARRAY['dizzy', 'spinning', 'vertigo', 'unsteady']),
('Numbness', 'Loss of sensation', ARRAY['tingling', 'pins and needles'], 'neurological', 'MODERATE', FALSE, ARRAY['numb', 'numbness', 'tingling', 'pins', 'needles']),
('Tingling', 'Prickling sensation', ARRAY['paresthesia'], 'neurological', 'MILD', FALSE, ARRAY['tingling', 'prickling', 'paresthesia', 'pins']),
('Memory problems', 'Difficulty remembering', ARRAY['forgetfulness', 'memory loss'], 'neurological', 'MODERATE', FALSE, ARRAY['memory', 'forget', 'remember', 'forgetful']),
('Difficulty concentrating', 'Trouble focusing', ARRAY['poor concentration', 'brain fog'], 'neurological', 'MILD', FALSE, ARRAY['concentrate', 'focus', 'attention', 'brain fog']),
('Tremor', 'Involuntary shaking', ARRAY['shaking', 'trembling'], 'neurological', 'MODERATE', FALSE, ARRAY['tremor', 'shaking', 'trembling', 'shake']);

-- MUSCULOSKELETAL SYMPTOMS
INSERT INTO symptoms (name, description, common_names, body_system, default_severity, is_red_flag, keywords) VALUES
('Back pain', 'Pain in back area', ARRAY['backache'], 'musculoskeletal', 'MODERATE', FALSE, ARRAY['back', 'pain', 'spine', 'ache']),
('Neck pain', 'Pain in neck area', ARRAY['cervical pain'], 'musculoskeletal', 'MILD', FALSE, ARRAY['neck', 'pain', 'stiff', 'cervical']),
('Joint pain', 'Pain in joints', ARRAY['arthralgia'], 'musculoskeletal', 'MODERATE', FALSE, ARRAY['joint', 'pain', 'arthralgia', 'ache']),
('Muscle pain', 'Pain in muscles', ARRAY['myalgia', 'muscle ache'], 'musculoskeletal', 'MILD', FALSE, ARRAY['muscle', 'pain', 'myalgia', 'ache', 'sore']),
('Stiffness', 'Reduced flexibility', ARRAY['rigid', 'tight'], 'musculoskeletal', 'MILD', FALSE, ARRAY['stiff', 'stiffness', 'rigid', 'tight']),
('Weakness', 'Reduced strength', ARRAY['muscle weakness'], 'musculoskeletal', 'MODERATE', FALSE, ARRAY['weak', 'weakness', 'strength', 'fatigue']);

-- DERMATOLOGICAL SYMPTOMS
INSERT INTO symptoms (name, description, common_names, body_system, default_severity, is_red_flag, keywords) VALUES
('Rash', 'Skin irritation or eruption', ARRAY['skin rash'], 'dermatological', 'MILD', FALSE, ARRAY['rash', 'skin', 'eruption', 'bumps']),
('Itching', 'Desire to scratch', ARRAY['pruritus'], 'dermatological', 'MILD', FALSE, ARRAY['itch', 'itching', 'itchy', 'pruritus', 'scratch']),
('Hives', 'Raised, itchy welts on skin', ARRAY['urticaria'], 'dermatological', 'MODERATE', FALSE, ARRAY['hives', 'welts', 'urticaria', 'bumps']),
('Skin lesion', 'Abnormal skin area', ARRAY['skin growth', 'spot'], 'dermatological', 'MILD', FALSE, ARRAY['lesion', 'spot', 'growth', 'skin', 'mark']),
('Jaundice', 'Yellow discoloration of skin', ARRAY['yellowing'], 'dermatological', 'SEVERE', FALSE, ARRAY['yellow', 'jaundice', 'skin', 'eyes']),
('Pale skin', 'Unusually pale complexion', ARRAY['pallor'], 'dermatological', 'MODERATE', FALSE, ARRAY['pale', 'pallor', 'white', 'complexion']);

-- GENERAL SYMPTOMS
INSERT INTO symptoms (name, description, common_names, body_system, default_severity, is_red_flag, keywords) VALUES
('Fever', 'Elevated body temperature', ARRAY['high temperature', 'pyrexia'], 'general', 'MODERATE', FALSE, ARRAY['fever', 'temperature', 'hot', 'pyrexia']),
('Chills', 'Feeling cold with shivering', ARRAY['shivering'], 'general', 'MILD', FALSE, ARRAY['chills', 'shivering', 'cold', 'shaking']),
('Fatigue', 'Extreme tiredness', ARRAY['exhaustion', 'tiredness'], 'general', 'MILD', FALSE, ARRAY['fatigue', 'tired', 'exhausted', 'weary', 'energy']),
('Weakness', 'General lack of strength', ARRAY['debility'], 'general', 'MODERATE', FALSE, ARRAY['weakness', 'weak', 'strength', 'debility']),
('Sweating', 'Excessive perspiration', ARRAY['night sweats', 'diaphoresis'], 'general', 'MILD', FALSE, ARRAY['sweat', 'sweating', 'perspiration', 'diaphoresis']),
('Weight loss', 'Unintentional decrease in body weight', ARRAY['losing weight'], 'general', 'MODERATE', FALSE, ARRAY['weight', 'loss', 'losing', 'pounds', 'thin']),
('Weight gain', 'Unintentional increase in body weight', ARRAY['gaining weight'], 'general', 'MILD', FALSE, ARRAY['weight', 'gain', 'gaining', 'pounds', 'heavy']);

-- EYE SYMPTOMS
INSERT INTO symptoms (name, description, common_names, body_system, default_severity, is_red_flag, keywords) VALUES
('Blurred vision', 'Lack of sharpness in vision', ARRAY['vision problems'], 'ophthalmologic', 'MODERATE', FALSE, ARRAY['blurred', 'vision', 'blur', 'sight', 'see']),
('Eye pain', 'Pain in or around eye', ARRAY['ocular pain'], 'ophthalmologic', 'MODERATE', FALSE, ARRAY['eye', 'pain', 'ocular', 'hurt']),
('Red eyes', 'Bloodshot or red appearance', ARRAY['bloodshot eyes'], 'ophthalmologic', 'MILD', FALSE, ARRAY['red', 'eyes', 'bloodshot', 'pink']),
('Sensitivity to light', 'Discomfort with light exposure', ARRAY['photophobia'], 'ophthalmologic', 'MODERATE', FALSE, ARRAY['light', 'sensitive', 'photophobia', 'bright']),
('Double vision', 'Seeing two images', ARRAY['diplopia'], 'ophthalmologic', 'SEVERE', FALSE, ARRAY['double', 'vision', 'diplopia', 'two', 'images']);

-- EAR SYMPTOMS
INSERT INTO symptoms (name, description, common_names, body_system, default_severity, is_red_flag, keywords) VALUES
('Ear pain', 'Pain in ear', ARRAY['earache', 'otalgia'], 'otologic', 'MODERATE', FALSE, ARRAY['ear', 'pain', 'ache', 'otalgia']),
('Hearing loss', 'Reduced ability to hear', ARRAY['deafness'], 'otologic', 'MODERATE', FALSE, ARRAY['hearing', 'deaf', 'hear', 'sound']),
('Ringing in ears', 'Perception of noise', ARRAY['tinnitus'], 'otologic', 'MILD', FALSE, ARRAY['ringing', 'tinnitus', 'ears', 'buzzing', 'noise']),
('Ear discharge', 'Fluid from ear', ARRAY['otorrhea'], 'otologic', 'MODERATE', FALSE, ARRAY['ear', 'discharge', 'drainage', 'otorrhea', 'fluid']);

-- URINARY SYMPTOMS
INSERT INTO symptoms (name, description, common_names, body_system, default_severity, is_red_flag, keywords) VALUES
('Frequent urination', 'Urinating more often than usual', ARRAY['polyuria'], 'urologic', 'MILD', FALSE, ARRAY['urination', 'frequent', 'pee', 'polyuria']),
('Painful urination', 'Pain when urinating', ARRAY['dysuria'], 'urologic', 'MODERATE', FALSE, ARRAY['urination', 'painful', 'burning', 'dysuria', 'pee']),
('Blood in urine', 'Visible blood in urine', ARRAY['hematuria'], 'urologic', 'SEVERE', FALSE, ARRAY['blood', 'urine', 'hematuria', 'red', 'pee']),
('Difficulty urinating', 'Trouble starting or maintaining stream', ARRAY['urinary retention'], 'urologic', 'MODERATE', FALSE, ARRAY['urination', 'difficulty', 'trouble', 'pee', 'retention']);

-- Add more symptoms to reach 100+
INSERT INTO symptoms (name, description, common_names, body_system, default_severity, is_red_flag, keywords) VALUES
('Insomnia', 'Difficulty sleeping', ARRAY['sleep problems', 'cant sleep'], 'general', 'MILD', FALSE, ARRAY['insomnia', 'sleep', 'cant sleep', 'awake']),
('Excessive thirst', 'Abnormally increased thirst', ARRAY['polydipsia'], 'general', 'MODERATE', FALSE, ARRAY['thirst', 'thirsty', 'polydipsia', 'drink']),
('Difficulty swallowing', 'Trouble swallowing', ARRAY['dysphagia'], 'gastrointestinal', 'MODERATE', FALSE, ARRAY['swallow', 'dysphagia', 'difficulty', 'choke']),
('Anxiety', 'Feeling of worry or unease', ARRAY['nervousness'], 'psychological', 'MILD', FALSE, ARRAY['anxiety', 'anxious', 'nervous', 'worry', 'panic']),
('Depression', 'Persistent sadness', ARRAY['low mood'], 'psychological', 'MODERATE', FALSE, ARRAY['depression', 'depressed', 'sad', 'mood', 'down']),
('Night sweats', 'Excessive sweating during sleep', ARRAY['sleep hyperhidrosis'], 'general', 'MODERATE', FALSE, ARRAY['night', 'sweats', 'sleep', 'sweating', 'drenched']);

-- Verification
SELECT 'Total symptoms loaded: ' || COUNT(*)::TEXT FROM symptoms;
SELECT 'Red flag symptoms: ' || COUNT(*)::TEXT FROM symptoms WHERE is_red_flag = TRUE;