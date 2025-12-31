import { Symptom } from '@/types';
import { X, Thermometer, Clock, FileText } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Textarea } from './../ui/TextArea';
import { SeveritySlider } from './SeveritySlider';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface SymptomCardProps {
  symptom: Symptom;
  index: number;
  onUpdate: (updates: Partial<Symptom>) => void;
  onRemove: () => void;
}

export function SymptomCard({ symptom, index, onUpdate, onRemove }: SymptomCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div 
      className={cn(
        'bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-800 relative group transition-all hover:shadow-xl',
        'animate-scale-in',
        symptom.severity === 'CRITICAL' && 'ring-2 ring-emergency/50'
      )}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Remove button */}
      <button
        className="absolute top-2 right-2 p-2 opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-emergency rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
        onClick={onRemove}
        aria-label="Remove symptom"
      >
        <X className="h-4 w-4" />
      </button>

      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className={cn(
          'flex h-10 w-10 items-center justify-center rounded-lg',
          symptom.severity === 'MILD' && 'bg-safe/10 text-safe',
          symptom.severity === 'MODERATE' && 'bg-urgent/10 text-urgent',
          symptom.severity === 'SEVERE' && 'bg-orange-500/10 text-orange-500',
          symptom.severity === 'CRITICAL' && 'bg-emergency/10 text-emergency'
        )}>
          <Thermometer className="h-5 w-5" />
        </div>
        <div className="flex-1 pr-8">
          <Input
            value={symptom.symptomName}
            onChange={(e) => onUpdate({ symptomName: e.target.value })}
            className="font-semibold text-lg border-0 p-0 h-auto focus:ring-0 bg-transparent"
            placeholder="Symptom name"
          />
          <span className="text-xs text-gray-500">Symptom #{index + 1}</span>
        </div>
      </div>

      {/* Severity Slider */}
      <div className="mb-4">
        <SeveritySlider
          value={symptom.severity}
          onChange={(severity) => onUpdate({ severity })}
        />
      </div>

      {/* Expandable Details */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="text-sm text-primary hover:underline flex items-center gap-1"
      >
        {isExpanded ? 'Hide details' : 'Add more details'}
        <span className={cn('transition-transform', isExpanded && 'rotate-180')}>
          ↓
        </span>
      </button>

      {isExpanded && (
        <div className="mt-4 space-y-4 animate-fade-in">
          {/* Duration */}
          <div className="flex items-center gap-3">
            <Clock className="h-4 w-4 text-gray-400" />
            <Input
              value={symptom.duration || ''}
              onChange={(e) => onUpdate({ duration: e.target.value })}
              placeholder="e.g., 2 days, since yesterday"
              className="flex-1"
            />
          </div>

          {/* Notes */}
          <div className="flex items-start gap-3">
            <FileText className="h-4 w-4 text-gray-400 mt-2.5" />
            <Textarea
              value={symptom.notes || ''}
              onChange={(e) => onUpdate({ notes: e.target.value })}
              placeholder="Additional notes about this symptom..."
              className="flex-1"
            />
          </div>
        </div>
      )}
    </div>
  );
}