import { cn } from '@/lib/utils';

interface ArcProps {
  width?: number;
  height?: number;
  className?: string;
  color?: string;
}

// SVG arc decoration สำหรับ Learning module headings
export function Arc({ width = 80, height = 12, className, color = 'var(--lemon)' }: ArcProps) {
  const cx = width / 2;
  const r = (width * width / (8 * height) + height / 2);
  const startX = cx - width / 2;
  const endX = cx + width / 2;
  const topY = height;
  const centerY = topY + (r - height);

  return (
    <svg
      width={width}
      height={height + 2}
      viewBox={`0 0 ${width} ${height + 2}`}
      className={cn('overflow-visible', className)}
      aria-hidden="true"
    >
      <path
        d={`M ${startX} ${topY} A ${r} ${r} 0 0 1 ${endX} ${topY}`}
        fill="none"
        stroke={color}
        strokeWidth={2.5}
        strokeLinecap="round"
        transform={`translate(0, ${-centerY + topY})`}
      />
    </svg>
  );
}
