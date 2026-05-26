import type { ReactNode } from 'react';
import { DotGrid } from '@/components/DotGrid';
import { cn } from '@/lib/utils';

interface Props {
  children: ReactNode;
  className?: string;
}

// Surface tint + watermark dot grid — Learning module signature
export function LearningPageShell({ children, className }: Props) {
  return (
    <div
      className={cn(
        'relative min-h-full -mx-5 md:-mx-8 -mt-6 -mb-16 md:-mb-6 px-5 md:px-8 py-6 pb-16 md:pb-6 bg-peri/5 overflow-hidden',
        className,
      )}
    >
      {/* Watermark decoration — bigger, fainter */}
      <DotGrid
        rows={6}
        cols={6}
        gap={10}
        dotSize={3}
        className="absolute -top-2 -right-2 opacity-50 pointer-events-none hidden sm:block"
      />
      <DotGrid
        rows={4}
        cols={4}
        gap={9}
        dotSize={2}
        className="absolute bottom-12 left-2 opacity-30 pointer-events-none hidden md:block"
      />
      <div className="relative">{children}</div>
    </div>
  );
}
