import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Symptom, TriageResult, AgeGroup } from './../types/index';

interface AppState {
  symptoms: Symptom[];
  triageResult: TriageResult | null;
  isAnalyzing: boolean;
  ageGroup: AgeGroup;
  isDarkMode: boolean;
}

interface AppContextType extends AppState {
  addSymptom: (symptom: Symptom) => void;
  updateSymptom: (id: string, updates: Partial<Symptom>) => void;
  removeSymptom: (id: string) => void;
  clearSymptoms: () => void;
  setTriageResult: (result: TriageResult | null) => void;
  setIsAnalyzing: (value: boolean) => void;
  setAgeGroup: (value: AgeGroup) => void;
  toggleDarkMode: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [symptoms, setSymptoms] = useState<Symptom[]>([]);
  const [triageResult, setTriageResult] = useState<TriageResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [ageGroup, setAgeGroup] = useState<AgeGroup>('adult');
  const [isDarkMode, setIsDarkMode] = useState(false);

  const addSymptom = useCallback((symptom: Symptom) => {
    setSymptoms(prev => [...prev, symptom]);
  }, []);

  const updateSymptom = useCallback((id: string, updates: Partial<Symptom>) => {
    setSymptoms(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  }, []);

  const removeSymptom = useCallback((id: string) => {
    setSymptoms(prev => prev.filter(s => s.id !== id));
  }, []);

  const clearSymptoms = useCallback(() => {
    setSymptoms([]);
    setTriageResult(null);
  }, []);

  const toggleDarkMode = useCallback(() => {
    setIsDarkMode(prev => {
      const newValue = !prev;
      document.documentElement.classList.toggle('dark', newValue);
      return newValue;
    });
  }, []);

  return (
    <AppContext.Provider
      value={{
        symptoms,
        triageResult,
        isAnalyzing,
        ageGroup,
        isDarkMode,
        addSymptom,
        updateSymptom,
        removeSymptom,
        clearSymptoms,
        setTriageResult,
        setIsAnalyzing,
        setAgeGroup,
        toggleDarkMode,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}