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
 * Then add the Google Fonts <link> and CSS variables from `globals.css`.
 */

export const myDailyTokens = {
  colors: {
    cream: {
      50:  '#FBF6EC',
      100: '#F5EFE4',
      200: '#ECE3D2',
      300: '#DCCFB6',
    },
    paper: '#FFFCF5',
    ink: {
      200: '#C6CDDB',
      300: '#9AA6B8',
      500: '#5C6A80',
      700: '#2A3A52',
      900: '#0F1B2D',
    },
    // Semantic accents — every accent has a job
    tangerine: {
      DEFAULT: '#FF6B35',   // OT / money / urgent (3x rate, salary CTAs)
      soft:    '#FFD8C7',
    },
    lemon: {
      DEFAULT: '#F7C548',   // holiday / highlight / next
      soft:    '#FCEDBD',
    },
    mint: {
      DEFAULT: '#4FB389',   // complete / positive / synced
      soft:    '#C8E8D7',
    },
    peri: {
      DEFAULT: '#6B7FE8',   // projects / info / user avatar
      soft:    '#D7DCFA',
    },
    rose: {
      DEFAULT: '#F291A6',   // leave / soft sensitive
      soft:    '#FBD7DE',
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

  borderWidth: {
    1.5: '1.5px',  // signature border on every card/button
  },

  boxShadow: {
    // Chunky offset stamp shadows — the signature look
    'stamp-sm':       '2px 2px 0 0 var(--ink-900)',
    'stamp':          '3px 3px 0 0 var(--ink-900)',
    'stamp-lg':       '4px 4px 0 0 var(--ink-900)',
    'stamp-lemon':    '4px 4px 0 0 var(--lemon)',
    'stamp-tangerine':'3px 3px 0 0 var(--tangerine)',
    'stamp-mint':     '3px 3px 0 0 var(--mint)',
    'stamp-tangerine-lg':'4px 4px 0 0 var(--tangerine)',
    // Soft fallback — use sparingly
    soft:             '0 8px 24px -8px rgba(15,27,45,0.18)',
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
