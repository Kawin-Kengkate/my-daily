import type { Config } from 'tailwindcss';
import { myDailyTokens } from './design_handoff/tailwind.tokens';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      ...myDailyTokens,
    },
  },
  plugins: [],
} satisfies Config;
