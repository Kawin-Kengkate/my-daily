import { describe, it, expect } from 'vitest';
import { cn } from './utils';

describe('cn', () => {
  it('keeps custom font-size tokens alongside text colors', () => {
    expect(cn('text-label text-ink-500')).toBe('text-label text-ink-500');
    expect(cn('text-h3', 'text-ink-900')).toBe('text-h3 text-ink-900');
    expect(cn('font-display text-h2 leading-none', 'text-tangerine')).toBe('font-display text-h2 leading-none text-tangerine');
  });

  it('still dedupes real conflicts', () => {
    expect(cn('text-sm', 'text-label')).toBe('text-label');
    expect(cn('text-ink-900', 'text-on-lemon')).toBe('text-on-lemon');
    expect(cn('bg-paper text-ink-900 shadow-stamp-sm', 'bg-lemon text-on-lemon shadow-stamp')).toBe(
      'bg-lemon text-on-lemon shadow-stamp',
    );
  });
});
