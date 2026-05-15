import { forwardRef, type SelectHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(
  function Select({ className, children, ...props }, ref) {
    return (
      <select
        ref={ref}
        className={cn(
          'h-10 px-3 bg-cream-50 border-1.5 border-ink-900 rounded-field shadow-stamp-sm',
          'font-mono text-sm font-bold outline-none cursor-pointer',
          className,
        )}
        {...props}
      >
        {children}
      </select>
    );
  },
);
