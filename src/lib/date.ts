import {
  format,
  parseISO,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  isSameMonth,
  isSameDay,
} from 'date-fns';
import { th } from 'date-fns/locale';

export const toISO = (d: Date): string => format(d, 'yyyy-MM-dd');
export const fromISO = (iso: string): Date => parseISO(iso);

export const todayISO = (): string => toISO(new Date());

export function formatThaiDate(iso: string, pattern = 'd MMM yyyy'): string {
  return format(parseISO(iso), pattern, { locale: th });
}

export function formatTime(t: string): string {
  // 'HH:MM' or 'HH:MM:SS' → 'HH:MM'
  return t.slice(0, 5);
}

export function diffHours(start: string, end: string): number {
  const [sh, sm] = start.split(':').map(Number);
  const [eh, em] = end.split(':').map(Number);
  return (eh * 60 + (em || 0) - sh * 60 - (sm || 0)) / 60;
}

export function monthRange(yyyymm: string): { from: string; to: string } {
  const [y, m] = yyyymm.split('-').map(Number);
  const start = new Date(y, m - 1, 1);
  return { from: toISO(startOfMonth(start)), to: toISO(endOfMonth(start)) };
}

export function quarterRange(year: number, q: 1 | 2 | 3 | 4): { from: string; to: string } {
  const startMonth = (q - 1) * 3;
  const from = new Date(year, startMonth, 1);
  const to = endOfMonth(new Date(year, startMonth + 2, 1));
  return { from: toISO(from), to: toISO(to) };
}

export function getMonthGrid(yyyymm: string): Date[] {
  const [y, m] = yyyymm.split('-').map(Number);
  const first = startOfMonth(new Date(y, m - 1, 1));
  const last = endOfMonth(first);
  const gridStart = startOfWeek(first, { weekStartsOn: 0 });
  const gridEnd = endOfWeek(last, { weekStartsOn: 0 });
  const days: Date[] = [];
  let cur = gridStart;
  while (cur <= gridEnd) {
    days.push(cur);
    cur = addDays(cur, 1);
  }
  return days;
}

export { addDays, addMonths, isSameMonth, isSameDay, startOfMonth, endOfMonth };
