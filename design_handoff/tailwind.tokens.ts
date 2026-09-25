/**
 * Drop-in design tokens for tailwind.config.ts
 *
 * Usage — merge into your existing config:
 *
 *   import { myDailyTokens } from './design_handoff/tailwind.tokens'
 *
 *   export default {
 *     // ...
 *     theme: {
 *       extend: {
 *         ...myDailyTokens,
 *         // your other extends...
 *       },
 *     },
 *   } satisfies Config;
 *
 * Then add the Google Fonts <link> and the theme CSS variables from `src/styles/globals.css`
 * (ทุก color ชี้ไปที่ var(--c-*) — ไม่มี hex ในไฟล์นี้แล้ว).
 */

// สีทั้งหมดอ่านจาก CSS variables (channel "R G B") ที่ src/styles/globals.css — เปลี่ยน theme = สลับชุด var
// <alpha-value> ทำให้ opacity modifier ใช้ได้ เช่น bg-peri/20
const c = (token: string) => `rgb(var(--c-${token}) / <alpha-value>)`;

export const myDailyTokens = {
  colors: {
    cream: {
      50:  c('cream-50'),
      100: c('cream-100'),   // page canvas
      200: c('cream-200'),
      300: c('cream-300'),
    },
    paper: c('paper'),       // card surface
    ink: {
      200: c('ink-200'),
      300: c('ink-300'),
      400: c('ink-400'),
      500: c('ink-500'),
      600: c('ink-600'),
      700: c('ink-700'),
      900: c('ink-900'),     // primary text + ทุก border
    },
    // Semantic accents — every accent has a job
    tangerine: {
      DEFAULT: c('tangerine'),  // OT / money / urgent (3x rate, salary CTAs)
      soft:    c('tangerine-soft'),
    },
    lemon: {
      DEFAULT: c('lemon'),      // holiday / highlight / next
      soft:    c('lemon-soft'),
    },
    mint: {
      DEFAULT: c('mint'),       // complete / positive / synced
      soft:    c('mint-soft'),
    },
    peri: {
      DEFAULT: c('peri'),       // projects / info / user avatar
      soft:    c('peri-soft'),
    },
    rose: {
      DEFAULT: c('rose'),       // leave / soft sensitive
      soft:    c('rose-soft'),
    },
    // ตัวหนังสือบนพื้น accent ทึบ — ห้ามใช้ text-paper / text-ink-900 บน bg-{accent}
    on: {
      tangerine: c('on-tangerine'),
      lemon:     c('on-lemon'),
      mint:      c('on-mint'),
      peri:      c('on-peri'),
      rose:      c('on-rose'),
    },
  },

  fontFamily: {
    display: ['"Bricolage Grotesque"', '"IBM Plex Sans Thai"', 'system-ui', 'sans-serif'],
    body:    ['"IBM Plex Sans Thai"', '"IBM Plex Sans"', 'system-ui', 'sans-serif'],
    mono:    ['"JetBrains Mono"', '"IBM Plex Mono"', 'ui-monospace', 'monospace'],
    // shadcn defaults — point sans → body for Thai support
    sans:    ['"IBM Plex Sans Thai"', '"IBM Plex Sans"', 'system-ui', 'sans-serif'],
  },

  fontSize: {
    // Intent-named scale — feel free to keep these alongside default 'xs','sm',...
    tiny:     ['10px', { lineHeight: '1.2', letterSpacing: '0.08em' }],
    hint:     ['11px', { lineHeight: '1.3' }],
    label:    ['12px', { lineHeight: '1.2', letterSpacing: '0.08em' }],
    body:     ['14px', { lineHeight: '1.45' }],
    h5:       ['16px', { lineHeight: '1.2', letterSpacing: '-0.02em' }],
    h4:       ['17px', { lineHeight: '1.15', letterSpacing: '-0.02em' }],
    h3:       ['18px', { lineHeight: '1.15', letterSpacing: '-0.02em' }],
    stat:     ['28px', { lineHeight: '0.95', letterSpacing: '-0.03em' }],
    'stat-lg':['36px', { lineHeight: '0.95', letterSpacing: '-0.04em' }],
    display:  ['44px', { lineHeight: '1',    letterSpacing: '-0.04em' }],
    hero:     ['56px', { lineHeight: '0.95', letterSpacing: '-0.04em' }],
  },

  borderRadius: {
    chip:   '6px',
    field:  '10px',
    button: '12px',
    card:   '14px',
    'card-lg': '16px',
  },

  // ring-offset-* default เป็น #fff — ให้ตาม surface ของ theme (สำคัญกับ dark theme)
  ringOffsetColor: {
    DEFAULT: 'rgb(var(--c-paper))',
  },

  borderWidth: {
    1.5: '1.5px',  // signature border on every card/button
  },

  boxShadow: {
    // Chunky offset stamp shadows — the signature look
    'stamp-sm':       '2px 2px 0 0 rgb(var(--c-stamp))',
    'stamp':          '3px 3px 0 0 rgb(var(--c-stamp))',
    'stamp-lg':       '4px 4px 0 0 rgb(var(--c-stamp))',
    'stamp-lemon':    '4px 4px 0 0 rgb(var(--c-lemon))',
    'stamp-tangerine':'3px 3px 0 0 rgb(var(--c-tangerine))',
    'stamp-mint':     '3px 3px 0 0 rgb(var(--c-mint))',
    'stamp-tangerine-lg':'4px 4px 0 0 rgb(var(--c-tangerine))',
    // Soft fallback — use sparingly
    soft:             '0 8px 24px -8px rgb(var(--c-ink-900) / 0.18)',
  },

  rotate: {
    // Sticker rotation presets
    'sticker-l':  '-4deg',
    'sticker-l2': '-2deg',
    'sticker-r':  '4deg',
    'sticker-r2': '2deg',
  },
};

export default myDailyTokens;
