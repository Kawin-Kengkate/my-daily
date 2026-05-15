import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';
import { Skeleton } from '@/components/Skeleton';

export function StatBlock({
  label,
  value,
  hint,
  className,
  loading,
}: {
  label: string;
  value: ReactNode;
  hint?: string;
  className?: string;
  loading?: boolean;
}) {
  return (
    <div className={cn('p-[18px] bg-paper border-1.5 border-ink-900 rounded-card-lg shadow-stamp-lg', className)}>
      <div className="font-display font-bold text-label text-ink-500 uppercase">{label}</div>
      {loading ? (
        <>
          <Skeleton className="mt-2 h-7 w-20" />
          {hint && <Skeleton className="mt-1 h-3 w-16" />}
        </>
      ) : (
        <>
          <div className="font-display font-extrabold text-stat mt-1">{value}</div>
          {hint && <div className="font-mono text-hint text-ink-500 mt-1">{hint}</div>}
        </>
      )}
    </div>
  );
}
