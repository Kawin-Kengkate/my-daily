import { forwardRef, type InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  function Input({ className, ...props }, ref) {
    return (
      <input
        ref={ref}
        className={cn(
          'h-10 px-3 bg-cream-50 border-1.5 border-ink-900 rounded-field shadow-stamp-sm',
          'font-mono text-sm font-bold outline-none placeholder:text-ink-300',
          'focus-visible:ring-2 focus-visible:ring-tangerine focus-visible:ring-offset-1',
          className,
        )}
        {...props}
      />
    );
  },
);
