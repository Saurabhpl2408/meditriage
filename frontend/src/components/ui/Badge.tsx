import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'emergency' | 'urgent' | 'safe';
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold',
          {
            'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100': variant === 'default',
            'bg-emergency text-white': variant === 'emergency',
            'bg-urgent text-white': variant === 'urgent',
            'bg-safe text-white': variant === 'safe',
          },
          className
        )}
        {...props}
      />
    );
  }
);

Badge.displayName = 'Badge';