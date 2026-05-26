import { cn } from '@/lib/utils';

interface DotGridProps {
  rows?: number;
  cols?: number;
  gap?: number;
  dotSize?: number;
  className?: string;
}

// Corner decoration สำหรับ Learning module cards
export function DotGrid({ rows = 3, cols = 3, gap = 5, dotSize = 2, className }: DotGridProps) {
  const dots: { x: number; y: number }[] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      dots.push({ x: c * gap, y: r * gap });
    }
  }
  const w = (cols - 1) * gap + dotSize;
  const h = (rows - 1) * gap + dotSize;

  return (
    <svg
      width={w}
      height={h}
      viewBox={`0 0 ${w} ${h}`}
      aria-hidden="true"
      className={cn('text-peri', className)}
    >
      {dots.map(({ x, y }, i) => (
        <circle key={i} cx={x + dotSize / 2} cy={y + dotSize / 2} r={dotSize / 2} fill="currentColor" opacity={0.35} />
      ))}
    </svg>
  );
}
