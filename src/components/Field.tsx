import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface FieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  suffix?: ReactNode;
  containerClassName?: string;
}

export const Field = forwardRef<HTMLInputElement, FieldProps>(function Field(
  { label, hint, suffix, className, containerClassName, ...props },
  ref,
) {
  return (
    <div className={containerClassName}>
      {label && (
        <label className="font-display font-bold text-label text-ink-500 uppercase">
          {label}
        </label>
      )}
      <div
        className={cn(
          'mt-1.5 flex items-center gap-2 px-3.5 py-2.5',
          'bg-cream-50 border-1.5 border-ink-900 rounded-field shadow-stamp-sm',
          className,
        )}
      >
        <input
          ref={ref}
          {...props}
          className="flex-1 bg-transparent font-mono text-sm font-bold outline-none placeholder:text-ink-300"
        />
        {suffix && <span className="font-mono text-hint text-ink-500">{suffix}</span>}
      </div>
      {hint && <p className="mt-1 font-mono text-[10px] text-ink-500">{hint}</p>}
    </div>
  );
});
