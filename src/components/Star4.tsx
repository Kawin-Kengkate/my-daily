export function Star4({ size = 18, color = 'var(--tangerine)', className }: { size?: number; color?: string; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className}>
      <path d="M12 1 L13.5 10.5 L23 12 L13.5 13.5 L12 23 L10.5 13.5 L1 12 L10.5 10.5 Z" fill={color} />
    </svg>
  );
}

export function Burst({ size = 24, color = 'var(--lemon)', className }: { size?: number; color?: string; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className}>
      <path d="M12 0 L14 8 L22 5 L17 12 L24 14 L15 16 L18 24 L12 18 L6 24 L9 16 L0 14 L7 12 L2 5 L10 8 Z"
        fill={color} stroke="var(--ink-900)" strokeWidth="1" strokeLinejoin="round" />
    </svg>
  );
}

export function Squiggle({ width = 100, color = 'var(--ink-900)', strokeWidth = 2, className }: { width?: number; color?: string; strokeWidth?: number; className?: string }) {
  return (
    <svg viewBox="0 0 100 10" width={width} height={width * 0.1} preserveAspectRatio="none" className={className}>
      <path d="M 2 5 Q 12 0, 22 5 T 42 5 T 62 5 T 82 5 T 98 5"
        stroke={color} strokeWidth={strokeWidth} fill="none" strokeLinecap="round" />
    </svg>
  );
}
