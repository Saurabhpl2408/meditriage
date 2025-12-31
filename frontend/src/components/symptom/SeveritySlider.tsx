import { Severity } from '@/types';
import { cn } from '@/lib/utils';

interface SeveritySliderProps {
  value: Severity;
  onChange: (severity: Severity) => void;
}

const severityLevels: { value: Severity; label: string; emoji: string; color: string }[] = [
  { value: 'MILD', label: 'Mild', emoji: '😊', color: 'bg-safe' },
  { value: 'MODERATE', label: 'Moderate', emoji: '😐', color: 'bg-urgent' },
  { value: 'SEVERE', label: 'Severe', emoji: '😣', color: 'bg-orange-500' },
  { value: 'CRITICAL', label: 'Critical', emoji: '🚨', color: 'bg-emergency' },
];

export function SeveritySlider({ value, onChange }: SeveritySliderProps) {
  const currentIndex = severityLevels.findIndex(s => s.value === value);
  const currentLevel = severityLevels[currentIndex];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Severity</span>
        <span className={cn(
          'text-sm font-semibold px-2 py-0.5 rounded',
          value === 'MILD' && 'bg-safe/10 text-safe',
          value === 'MODERATE' && 'bg-urgent/10 text-urgent',
          value === 'SEVERE' && 'bg-orange-500/10 text-orange-500',
          value === 'CRITICAL' && 'bg-emergency/10 text-emergency'
        )}>
          {currentLevel.emoji} {currentLevel.label}
        </span>
      </div>
      
      <div className="relative">
        {/* Track */}
        <div className="h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
          <div 
            className={cn('h-full transition-all duration-300', currentLevel.color)}
            style={{ width: `${((currentIndex + 1) / severityLevels.length) * 100}%` }}
          />
        </div>
        
        {/* Markers */}
        <div className="flex justify-between mt-1">
          {severityLevels.map((level, index) => (
            <button
              key={level.value}
              type="button"
              onClick={() => onChange(level.value)}
              className={cn(
                'w-6 h-6 rounded-full border-2 transition-all duration-200 flex items-center justify-center text-xs font-bold',
                index <= currentIndex
                  ? cn(level.color, 'border-transparent text-white')
                  : 'bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 text-gray-500'
              )}
              title={level.label}
            >
              {index + 1}
            </button>
          ))}
        </div>
        
        {/* Labels */}
        <div className="flex justify-between mt-2">
          {severityLevels.map((level) => (
            <span 
              key={level.value}
              className={cn(
                'text-xs transition-colors',
                value === level.value ? 'text-gray-900 dark:text-gray-100 font-medium' : 'text-gray-500'
              )}
            >
              {level.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}