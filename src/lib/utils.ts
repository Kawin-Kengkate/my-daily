import { clsx, type ClassValue } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

// ต้องบอก tailwind-merge ว่า text-label / text-h4 ฯลฯ เป็น font-size
// ไม่งั้นมันเดาว่าเป็นสี แล้ว cn('text-label', 'text-ink-500') จะทิ้งตัวแรกไป
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': [
        { text: ['tiny', 'hint', 'label', 'body', 'h5', 'h4', 'h3', 'h2', 'stat', 'stat-lg', 'display', 'hero'] },
      ],
    },
  },
});

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
