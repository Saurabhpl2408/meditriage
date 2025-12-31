import { UrgencyLevel } from '@/types';
import { AlertTriangle, Clock, Calendar, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

interface UrgencyBadgeProps {
  level: UrgencyLevel;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  className?: string;
}

const urgencyConfig: Record<UrgencyLevel, {
  label: string;
  icon: typeof AlertTriangle;
  bgClass: string;
  textClass: string;
}> = {
  EMERGENCY: {
    label: 'Emergency',
    icon: AlertTriangle,
    bgClass: 'bg-emergency',
    textClass: 'text-white',
  },
  URGENT: {
    label: 'Urgent',
    icon: Clock,
    bgClass: 'bg-urgent',
    textClass: 'text-white',
  },
  NON_URGENT: {
    label: 'Non-Urgent',
    icon: Calendar,
    bgClass: 'bg-non-urgent',
    textClass: 'text-white',
  },
  SELF_CARE: {
    label: 'Self-Care',
    icon: Home,
    bgClass: 'bg-safe',
    textClass: 'text-white',
  },
};

export function UrgencyBadge({ level, size = 'md', showIcon = true, className }: UrgencyBadgeProps) {
  const config = urgencyConfig[level];
  const Icon = config.icon;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 font-semibold rounded-full',
        config.bgClass,
        config.textClass,
        size === 'sm' && 'px-2 py-0.5 text-xs',
        size === 'md' && 'px-3 py-1 text-sm',
        size === 'lg' && 'px-4 py-1.5 text-base',
        level === 'EMERGENCY' && 'animate-pulse-emergency',
        className
      )}
    >
      {showIcon && <Icon className={cn(
        size === 'sm' && 'h-3 w-3',
        size === 'md' && 'h-4 w-4',
        size === 'lg' && 'h-5 w-5'
      )} />}
      {config.label}
    </span>
  );
}