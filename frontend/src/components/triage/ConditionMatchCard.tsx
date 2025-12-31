import { ConditionMatch } from '@/types';
import { UrgencyBadge } from './UrgencyBadge';
import { ChevronRight, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface ConditionMatchCardProps {
  match: ConditionMatch;
  rank: number;
}

export function ConditionMatchCard({ match, rank }: ConditionMatchCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const percentage = Math.round(match.matchScore * 100);

  return (
    <div 
      className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-800 group hover:shadow-xl transition-shadow animate-slide-up"
      style={{ animationDelay: `${rank * 150}ms` }}
    >
      <div className="flex items-start justify-between gap-4">
        {/* Rank */}
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-sm flex-shrink-0">
          #{rank}
        </div>

        <div className="flex-1 min-w-0">
          {/* Name */}
          <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100 mb-1 truncate">
            {match.condition.name}
          </h3>
          
          {/* Match Score */}
          <div className="flex items-center gap-3 mb-3">
            <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
              <div 
                className={cn(
                  'h-full rounded-full transition-all duration-1000',
                  percentage >= 80 ? 'bg-emergency' :
                  percentage >= 60 ? 'bg-urgent' :
                  percentage >= 40 ? 'bg-non-urgent' :
                  'bg-safe'
                )}
                style={{ width: `${percentage}%` }}
              />
            </div>
            <span className="text-sm font-semibold text-gray-600 dark:text-gray-400 min-w-[3rem]">
              {percentage}%
            </span>
          </div>

          {/* Description */}
          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">
            {match.condition.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <UrgencyBadge level={match.condition.typicalUrgency} size="sm" showIcon={false} />
            {match.condition.icd10Code && (
              <span className="text-xs font-mono bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded text-gray-600 dark:text-gray-400">
                {match.condition.icd10Code}
              </span>
            )}
          </div>

          {/* Matching Symptoms */}
          <div className="space-y-1">
            <p className="text-xs font-medium text-gray-500">Matching Symptoms:</p>
            <div className="flex flex-wrap gap-1">
              {match.matchingSymptoms.map((symptom, i) => (
                <span 
                  key={i}
                  className="inline-flex items-center gap-1 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded"
                >
                  <Check className="h-3 w-3" />
                  {symptom}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Expand Button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex-shrink-0 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
        >
          <ChevronRight className={cn(
            'h-5 w-5 transition-transform',
            isExpanded && 'rotate-90'
          )} />
        </button>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-800 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-semibold mb-2">Category</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">{match.condition.category}</p>
            </div>
            <div>
              <h4 className="text-sm font-semibold mb-2">Relevance</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">{Math.round(match.relevance * 100)}%</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}