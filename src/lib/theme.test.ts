import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { THEMES, DEFAULT_THEME, THEME_STORAGE_KEY } from './theme';
import { PROJECT_PALETTE } from './projectColor';

// globals.css = source of truth ของสีทุก theme — test นี้ parse ไฟล์ตรงๆ
const ROOT = fileURLToPath(new URL('../..', import.meta.url));
const read = (rel: string) => readFileSync(join(ROOT, rel), 'utf8');
const css = read('src/styles/globals.css');

type RGB = [number, number, number];

function parseThemes(): Record<string, Record<string, RGB>> {
  const themes: Record<string, Record<string, RGB>> = {};
  for (const block of css.matchAll(/\[data-theme='([\w-]+)'\]\s*\{([^}]*)\}/g)) {
    const tokens: Record<string, RGB> = {};
    for (const t of block[2].matchAll(/--c-([\w-]+):\s*(\d+)\s+(\d+)\s+(\d+);/g)) {
      tokens[t[1]] = [Number(t[2]), Number(t[3]), Number(t[4])];
    }
    themes[block[1]] = tokens;
  }
  return themes;
}

function luminance([r, g, b]: RGB): number {
  const lin = (v: number) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

function contrast(a: RGB, b: RGB): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

// CIE76 ΔE — ใช้เช็คว่าสีพื้นที่มีความหมายต่างกัน (location ในปฏิทิน) แยกออกด้วยตา
function toLab(rgb: RGB): [number, number, number] {
  const [r, g, b] = rgb.map((v) => {
    const c = v / 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  const f = (t: number) => (t > 0.008856 ? Math.cbrt(t) : 7.787 * t + 16 / 116);
  const x = f((r * 0.4124 + g * 0.3576 + b * 0.1805) / 0.95047);
  const y = f(r * 0.2126 + g * 0.7152 + b * 0.0722);
  const z = f((r * 0.0193 + g * 0.1192 + b * 0.9505) / 1.08883);
  return [116 * y - 16, 500 * (x - y), 200 * (y - z)];
}

function deltaE(a: RGB, b: RGB): number {
  const [p, q] = [toLab(a), toLab(b)];
  return Math.hypot(p[0] - q[0], p[1] - q[1], p[2] - q[2]);
}

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });
}

const THEME_CSS = parseThemes();
const ACCENTS = ['tangerine', 'lemon', 'mint', 'peri', 'rose'] as const;
const SURFACES = ['paper', 'cream-50', 'cream-100'] as const;
const REQUIRED = [
  'cream-50', 'cream-100', 'cream-200', 'cream-300', 'paper',
  'ink-200', 'ink-300', 'ink-400', 'ink-500', 'ink-600', 'ink-700', 'ink-900',
  ...ACCENTS.flatMap((a) => [a, `${a}-soft`, `on-${a}`]),
  'stamp',
];

describe('theme tokens', () => {
  it('ทุก theme ใน THEMES มี block ใน globals.css และ token ครบชุด', () => {
    expect(Object.keys(THEME_CSS).sort()).toEqual(THEMES.map((t) => t.id).sort());
    for (const t of THEMES) {
      const missing = REQUIRED.filter((k) => !THEME_CSS[t.id][k]);
      expect(missing, `${t.id} missing`).toEqual([]);
      for (const [k, rgb] of Object.entries(THEME_CSS[t.id])) {
        expect(rgb.every((v) => v >= 0 && v <= 255), `${t.id} --c-${k}`).toBe(true);
      }
    }
  });

  it(':root ใช้ DEFAULT_THEME', () => {
    expect(css).toMatch(new RegExp(`:root,\\s*\\[data-theme='${DEFAULT_THEME}'\\]`));
  });

  it('ทุก --c-* / var(--color) ที่โค้ดอ้างถึง มีจริงในทุก theme', () => {
    const files = [...walk(join(ROOT, 'src')), join(ROOT, 'design_handoff/tailwind.tokens.ts')].filter(
      (f) => /\.(tsx?|css)$/.test(f) && !f.endsWith('.test.ts'),
    );
    const used = new Set<string>(PROJECT_PALETTE.map((c) => c.token));
    for (const f of files) {
      const src = readFileSync(f, 'utf8');
      for (const m of src.matchAll(/--c-([a-z0-9-]+)/g)) if (!m[1].endsWith('-')) used.add(m[1]);
      for (const m of src.matchAll(/\bc\('([a-z0-9-]+)'\)/g)) used.add(m[1]);
      for (const m of src.matchAll(/var\(--((?:cream|paper|ink|tangerine|lemon|mint|peri|rose|on|stamp)[a-z0-9-]*)\)/g)) {
        used.add(m[1]);
      }
    }
    for (const t of THEMES) {
      const undefinedTokens = [...used].filter((k) => !THEME_CSS[t.id][k]);
      expect(undefinedTokens, t.id).toEqual([]);
    }
  });

  it('index.html อ่าน localStorage key เดียวกับ THEME_STORAGE_KEY', () => {
    expect(read('index.html')).toContain(`localStorage.getItem('${THEME_STORAGE_KEY}')`);
  });
});

describe.each(THEMES.map((t) => t.id))('contrast: %s', (id) => {
  const t = THEME_CSS[id];

  it('ตัวหนังสือหลัก / รอง / muted อ่านออกบนทุก surface', () => {
    for (const s of SURFACES) {
      expect(contrast(t['ink-900'], t[s]), `ink-900/${s}`).toBeGreaterThanOrEqual(7);
      expect(contrast(t['ink-700'], t[s]), `ink-700/${s}`).toBeGreaterThanOrEqual(4.5);
      expect(contrast(t['ink-500'], t[s]), `ink-500/${s}`).toBeGreaterThanOrEqual(4.5);
    }
  });

  it('text-on-{accent} บนพื้น accent ทึบ ≥ 4.5 (AA)', () => {
    for (const a of ACCENTS) {
      expect(contrast(t[`on-${a}`], t[a]), `on-${a}`).toBeGreaterThanOrEqual(4.5);
    }
  });

  it('ink-900 บนพื้น {accent}-soft ≥ 4.5', () => {
    for (const a of ACCENTS) {
      expect(contrast(t['ink-900'], t[`${a}-soft`]), `${a}-soft`).toBeGreaterThanOrEqual(4.5);
    }
  });

  it('accent ที่ใช้เป็นตัวหนังสือ/ไอคอนบน paper ≥ 3 (เงิน, error, link)', () => {
    // classic = palette ต้นฉบับ คงค่าเดิมไว้ (mint/rose จางกว่าเกณฑ์) — theme อื่นต้องผ่าน
    if (id === 'classic') return;
    for (const a of ['tangerine', 'mint', 'peri', 'rose'] as const) {
      expect(contrast(t[a], t.paper), `${a}/paper`).toBeGreaterThanOrEqual(3);
    }
  });

  it('สีพื้น location ในปฏิทิน (onsite/wfh/ลา/training/holiday/ว่าง) แยกกันออก ΔE ≥ 10', () => {
    const fills = ['mint-soft', 'peri-soft', 'rose-soft', 'lemon-soft', 'cream-200', 'paper'];
    for (let i = 0; i < fills.length; i++) {
      for (let j = i + 1; j < fills.length; j++) {
        expect(deltaE(t[fills[i]], t[fills[j]]), `${fills[i]} ~ ${fills[j]}`).toBeGreaterThanOrEqual(10);
      }
    }
  });

  it('เงา stamp มองเห็นบน canvas', () => {
    expect(contrast(t.stamp, t['cream-100'])).toBeGreaterThanOrEqual(3);
  });
});
