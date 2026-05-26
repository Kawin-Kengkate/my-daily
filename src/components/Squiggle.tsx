import { cn } from '@/lib/utils';

interface SquiggleProps {
  width?: number;
  className?: string;
}

export function Squiggle({ width = 48, className }: SquiggleProps) {
  const h = 8;
  const period = 16;
  const amp = 3;
  const steps = Math.ceil(width / period) * 2 + 2;
  let d = `M 0 ${h / 2}`;
  for (let i = 0; i < steps; i++) {
    const x1 = i * (period / 2) + period / 4;
    const y1 = i % 2 === 0 ? amp : h - amp;
    const x2 = (i + 1) * (period / 2);
    const y2 = h / 2;
    d += ` Q ${x1} ${y1} ${x2} ${y2}`;
  }
  return (
    <svg
      width={width}
      height={h}
      viewBox={`0 0 ${width} ${h}`}
      aria-hidden="true"
      className={cn('overflow-visible', className)}
    >
      <path d={d} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
    </svg>
  );
}
