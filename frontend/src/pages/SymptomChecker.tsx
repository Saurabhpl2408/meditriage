import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, ArrowRight, Keyboard, Mic, AlertTriangle, User } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { VoiceRecorder } from '@/components/symptom/VoiceRecorder';
import { SymptomCard } from '@/components/symptom/SymptomCard';
import { useApp } from '@/context/AppContext';
import { Symptom, AgeGroup } from '@/types';
import { triageService } from '@/services/triageService';
import { cn } from '@/lib/utils';

const ageGroups: { value: AgeGroup; label: string }[] = [
  { value: 'infant', label: '0-2 years' },
  { value: 'child', label: '3-17 years' },
  { value: 'adult', label: '18-64 years' },
  { value: 'elderly', label: '65+ years' },
];

export default function SymptomChecker() {
  const navigate = useNavigate();
  const { 
    symptoms, 
    addSymptom, 
    updateSymptom, 
    removeSymptom,
    ageGroup,
    setAgeGroup,
    setTriageResult,
    isAnalyzing,
    setIsAnalyzing
  } = useApp();

  const [inputMode, setInputMode] = useState<'voice' | 'text'>('text');
  const [newSymptom, setNewSymptom] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleAddSymptom = useCallback(() => {
    if (!newSymptom.trim()) return;

    const symptom: Symptom = {
      id: crypto.randomUUID(),
      symptomName: newSymptom.trim(),
      severity: 'MODERATE',
    };

    addSymptom(symptom);
    setNewSymptom('');
  }, [newSymptom, addSymptom]);

  const handleVoiceTranscript = useCallback((text: string) => {
    const symptomPhrases = text.split(/,|and|also/i).map(s => s.trim()).filter(Boolean);
    
    symptomPhrases.forEach((phrase) => {
      if (phrase.length > 2) {
        addSymptom({
          id: crypto.randomUUID(),
          symptomName: phrase,
          severity: 'MODERATE',
        });
      }
    });
  }, [addSymptom]);

  const handleAnalyze = useCallback(async () => {
    if (symptoms.length === 0) {
      setError('Please add at least one symptom');
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      console.log('[SymptomChecker] Calling backend API...');
      const result = await triageService.analyzeSymptoms(symptoms, ageGroup);
      console.log('[SymptomChecker] Result:', result);

      setTriageResult(result);
      navigate('/triage-results');
    } catch (err: any) {
      console.error('[SymptomChecker] Error:', err);
      setError(err.message || 'Failed to analyze symptoms. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  }, [symptoms, ageGroup, setIsAnalyzing, setTriageResult, navigate]);

  const hasRedFlags = symptoms.some(s => s.severity === 'CRITICAL');

  return (
    <div className="min-h-screen py-8 md:py-12 bg-gray-50 dark:bg-gray-950">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Symptom Checker</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Describe your symptoms and receive AI-powered guidance
          </p>
        </motion.div>

        {/* Red Flag Warning */}
        {hasRedFlags && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-8 p-4 rounded-xl bg-emergency/10 border border-emergency/30 flex items-start gap-3"
          >
            <AlertTriangle className="h-6 w-6 text-emergency flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-emergency mb-1">Critical Symptoms Detected</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                You've indicated critical symptoms. If this is a medical emergency, call 911 immediately.
              </p>
            </div>
          </motion.div>
        )}

        {/* Error Display */}
        {error && (
          <div className="mb-8 p-4 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 text-red-800 dark:text-red-200">
            {error}
          </div>
        )}

        {/* Age Group */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <label className="flex items-center gap-2 text-sm font-medium mb-3">
            <User className="h-4 w-4 text-gray-500" />
            Age Group
          </label>
          <div className="flex flex-wrap gap-2">
            {ageGroups.map((group) => (
              <button
                key={group.value}
                type="button"
                onClick={() => setAgeGroup(group.value)}
                className={cn(
                  'px-4 py-2 rounded-lg text-sm font-medium transition-all',
                  ageGroup === group.value
                    ? 'bg-primary text-white shadow-md'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                )}
              >
                {group.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Input Mode Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex items-center justify-center gap-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg w-fit mx-auto">
            <button
              type="button"
              onClick={() => setInputMode('text')}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all',
                inputMode === 'text'
                  ? 'bg-white dark:bg-gray-900 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400'
              )}
            >
              <Keyboard className="h-4 w-4" />
              Type
            </button>
            <button
              type="button"
              onClick={() => setInputMode('voice')}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all',
                inputMode === 'voice'
                  ? 'bg-white dark:bg-gray-900 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400'
              )}
            >
              <Mic className="h-4 w-4" />
              Speak
            </button>
          </div>
        </motion.div>

        {/* Input Area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          {inputMode === 'voice' ? (
            <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-800 flex flex-col items-center py-10">
              <VoiceRecorder onTranscript={handleVoiceTranscript} />
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-800">
              <label className="block text-sm font-medium mb-2">Add a symptom</label>
              <div className="flex gap-2">
                <Input
                  value={newSymptom}
                  onChange={(e) => setNewSymptom(e.target.value)}
                  placeholder="e.g., headache, fever, cough..."
                  className="flex-1"
                  onKeyDown={(e) => e.key === 'Enter' && handleAddSymptom()}
                />
                <Button onClick={handleAddSymptom} disabled={!newSymptom.trim()}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add
                </Button>
              </div>
            </div>
          )}
        </motion.div>

        {/* Symptoms List */}
        {symptoms.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-8 space-y-4"
          >
            <h2 className="text-lg font-semibold flex items-center gap-2">
              Your Symptoms
              <span className="px-2 py-0.5 bg-primary/10 text-primary text-sm rounded-full">
                {symptoms.length}
              </span>
            </h2>
            
            {symptoms.map((symptom, index) => (
              <SymptomCard
                key={symptom.id}
                symptom={symptom}
                index={index}
                onUpdate={(updates) => updateSymptom(symptom.id, updates)}
                onRemove={() => removeSymptom(symptom.id)}
              />
            ))}
          </motion.div>
        )}

        {/* Analyze Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-center"
        >
          <Button
            variant="hero"
            size="xl"
            onClick={handleAnalyze}
            disabled={symptoms.length === 0 || isAnalyzing}
            className="gap-2 min-w-[200px]"
          >
            {isAnalyzing ? (
              <>
                <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                Analyze Symptoms
                <ArrowRight className="h-5 w-5" />
              </>
            )}
          </Button>
          
          {symptoms.length === 0 && (
            <p className="text-sm text-gray-500 mt-3">
              Add at least one symptom to continue
            </p>
          )}
        </motion.div>
      </div>
    </div>
  );
}