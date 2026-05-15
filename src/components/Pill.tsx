import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

export function Pill({
  children,
  className,
  dotClassName,
}: {
  children: ReactNode;
  className?: string;
  dotClassName?: string;
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full',
        'font-body font-semibold text-xs',
        className,
      )}
    >
      {dotClassName && <span className={cn('h-1.5 w-1.5 rounded-full', dotClassName)} />}
      {children}
    </span>
  );
}
