import type { ProgressPoint } from '@/api/projects';

interface Props {
  data: ProgressPoint[];
  color?: string;
  width?: number;
  height?: number;
}

export function ProjectSparkline({ data, color = '#6B7FE8', width = 120, height = 28 }: Props) {
  if (data.length < 2) {
    return <span className="font-mono text-[10px] text-ink-300">no trend</span>;
  }
  const pad = 2;
  const w = width - pad * 2;
  const h = height - pad * 2;
  const xs = data.length > 1 ? w / (data.length - 1) : 0;
  const points = data.map((p, i) => [pad + i * xs, pad + h - (p.value / 100) * h] as const);
  const path = points.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)}`).join(' ');
  const last = points[points.length - 1];
  const lastValue = data[data.length - 1].value;
  return (
    <div className="inline-flex items-center gap-1.5">
      <svg width={width} height={height} className="overflow-visible">
        <path d={path} fill="none" stroke={color} strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" />
        <circle cx={last[0]} cy={last[1]} r={2.5} fill={color} stroke="#0F1B2D" strokeWidth={1} />
      </svg>
      <span className="font-mono text-[10px] font-bold text-ink-700">{lastValue}%</span>
    </div>
  );
}
