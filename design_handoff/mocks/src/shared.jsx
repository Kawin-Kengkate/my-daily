/* Shared bits — fragments, stickers, squiggles, mobile frame */

const Sticker = ({ children, color = 'var(--lemon)', rotate = -3, style, className = '' }) => (
  <span
    className={className}
    style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: '4px 10px', borderRadius: 999,
      background: color, color: 'var(--ink-900)',
      border: '1.5px solid var(--ink-900)',
      boxShadow: '2px 2px 0 0 var(--ink-900)',
      fontFamily: 'var(--display)', fontWeight: 600, fontSize: 13,
      letterSpacing: '-0.01em',
      transform: `rotate(${rotate}deg)`,
      whiteSpace: 'nowrap',
      ...style,
    }}
  >{children}</span>
);

const Pill = ({ children, color = 'var(--peri-soft)', dot, style }) => (
  <span style={{
    display: 'inline-flex', alignItems: 'center', gap: 6,
    padding: '3px 9px', borderRadius: 999,
    background: color, color: 'var(--ink-900)',
    fontFamily: 'var(--body)', fontWeight: 600, fontSize: 12,
    ...style,
  }}>
    {dot && <span style={{ width: 6, height: 6, borderRadius: 6, background: dot }} />}
    {children}
  </span>
);

const Card = ({ children, style, stamp = true, bg = 'var(--paper)' }) => (
  <div style={{
    background: bg,
    border: '1.5px solid var(--ink-900)',
    borderRadius: 14,
    boxShadow: stamp ? 'var(--shadow-stamp)' : 'var(--shadow-card)',
    ...style,
  }}>{children}</div>
);

const Squiggle = ({ width = 100, color = 'var(--ink-900)', strokeWidth = 2, style }) => (
  <svg viewBox="0 0 100 10" width={width} height={width * 0.1} preserveAspectRatio="none" style={style}>
    <path d="M 2 5 Q 12 0, 22 5 T 42 5 T 62 5 T 82 5 T 98 5"
      stroke={color} strokeWidth={strokeWidth} fill="none" strokeLinecap="round" />
  </svg>
);

const Star4 = ({ size = 18, color = 'var(--tangerine)', style }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} style={style}>
    <path d="M12 1 L13.5 10.5 L23 12 L13.5 13.5 L12 23 L10.5 13.5 L1 12 L10.5 10.5 Z" fill={color} />
  </svg>
);

const Burst = ({ size = 24, color = 'var(--lemon)', style }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} style={style}>
    <path d="M12 0 L14 8 L22 5 L17 12 L24 14 L15 16 L18 24 L12 18 L6 24 L9 16 L0 14 L7 12 L2 5 L10 8 Z"
      fill={color} stroke="var(--ink-900)" strokeWidth="1" strokeLinejoin="round" />
  </svg>
);

const Tape = ({ width = 60, rotate = -8, color = 'rgba(255,219,154,0.85)', style }) => (
  <div style={{
    position: 'absolute', width, height: 22,
    background: color, transform: `rotate(${rotate}deg)`,
    boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
    backgroundImage: 'repeating-linear-gradient(90deg, rgba(0,0,0,0.04) 0 8px, transparent 8px 16px)',
    ...style,
  }} />
);

/* Mobile frame — minimal phone bezel */
const Phone = ({ children, label, width = 390, height = 844 }) => (
  <div style={{
    width, height,
    background: 'var(--ink-900)',
    borderRadius: 48,
    padding: 10,
    boxShadow: '0 30px 60px -20px rgba(15,27,45,0.4), inset 0 0 0 1px rgba(255,255,255,0.05)',
    position: 'relative',
  }}>
    <div style={{
      width: '100%', height: '100%',
      borderRadius: 38,
      overflow: 'hidden',
      background: 'var(--cream-100)',
      position: 'relative',
      fontFamily: 'var(--body)',
      color: 'var(--ink-900)',
    }}>
      {/* status bar */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 44,
        display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
        padding: '0 28px 8px', fontSize: 14, fontWeight: 600,
        fontFamily: 'var(--display)', zIndex: 50,
      }}>
        <span>9:41</span>
        <div style={{ width: 110, height: 28, background: 'var(--ink-900)', borderRadius: 999, position: 'absolute', left: '50%', top: 8, transform: 'translateX(-50%)' }} />
        <span style={{ display: 'inline-flex', gap: 5, alignItems: 'center' }}>
          <svg width="16" height="10" viewBox="0 0 16 10"><path d="M1 8 L3 6 M5 8 L7 4 M9 8 L11 2 M13 8 L15 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none"/></svg>
          <svg width="14" height="10" viewBox="0 0 14 10"><path d="M0 8 Q7 0 14 8" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round"/><circle cx="7" cy="8" r="1.2" fill="currentColor"/></svg>
          <span style={{ width: 22, height: 10, border: '1.2px solid currentColor', borderRadius: 3, position: 'relative' }}>
            <span style={{ position: 'absolute', inset: 1.5, width: '78%', background: 'currentColor', borderRadius: 1 }} />
          </span>
        </span>
      </div>
      {children}
    </div>
  </div>
);

Object.assign(window, { Sticker, Pill, Card, Squiggle, Star4, Burst, Tape, Phone });
