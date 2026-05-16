// Calendar resolver — รวม weekend default + Thai public holidays + user overrides
// override trump ทุกอย่าง: kind='working' → ทำงาน, kind='holiday' → หยุด

import type { CalendarOverride } from '@/types/db';
import { THAI_HOLIDAYS, isWeekend } from './thai-holidays';

export type DayType = 'workday' | 'holiday';

export interface DayInfo {
  date: string;
  type: DayType;
  /** กี่ source — ใช้สำหรับ label ใน UI */
  source: 'weekend' | 'public_holiday' | 'override_working' | 'override_holiday' | 'weekday';
  label?: string;
}

export type OverrideMap = Record<string, CalendarOverride>;

export function toOverrideMap(overrides: CalendarOverride[]): OverrideMap {
  const map: OverrideMap = {};
  for (const o of overrides) map[o.date] = o;
  return map;
}

export function resolveDay(dateISO: string, overrides: OverrideMap): DayInfo {
  const ov = overrides[dateISO];
  if (ov?.kind === 'working') {
    return {
      date: dateISO,
      type: 'workday',
      source: 'override_working',
      label: ov.label ?? 'เสาร์ทำงาน',
    };
  }
  if (ov?.kind === 'holiday') {
    return {
      date: dateISO,
      type: 'holiday',
      source: 'override_holiday',
      label: ov.label ?? 'หยุดพิเศษ',
    };
  }
  const publicLabel = THAI_HOLIDAYS[dateISO];
  if (publicLabel) {
    return { date: dateISO, type: 'holiday', source: 'public_holiday', label: publicLabel };
  }
  if (isWeekend(dateISO)) {
    return { date: dateISO, type: 'holiday', source: 'weekend' };
  }
  return { date: dateISO, type: 'workday', source: 'weekday' };
}

export function resolveIsHoliday(dateISO: string, overrides: OverrideMap): boolean {
  return resolveDay(dateISO, overrides).type === 'holiday';
}

/** หา block ของวันหยุดติดกันที่คลุม dateISO (ใช้สำหรับ pre-fill ยาวๆ เช่นสงกรานต์ 4 วัน) */
export function findHolidayRun(
  dateISO: string,
  overrides: OverrideMap,
  maxScan = 14,
): { from: string; to: string; dates: string[] } | null {
  if (!resolveIsHoliday(dateISO, overrides)) return null;

  const toDate = (s: string) => new Date(s + 'T00:00:00');
  const toISO = (d: Date) => d.toISOString().slice(0, 10);

  const cur = toDate(dateISO);
  const dates: string[] = [dateISO];

  // ขยายไปทางซ้าย
  for (let i = 1; i <= maxScan; i++) {
    const d = new Date(cur);
    d.setDate(d.getDate() - i);
    const iso = toISO(d);
    if (!resolveIsHoliday(iso, overrides)) break;
    dates.unshift(iso);
  }
  // ขยายไปทางขวา
  for (let i = 1; i <= maxScan; i++) {
    const d = new Date(cur);
    d.setDate(d.getDate() + i);
    const iso = toISO(d);
    if (!resolveIsHoliday(iso, overrides)) break;
    dates.push(iso);
  }

  return { from: dates[0], to: dates[dates.length - 1], dates };
}

/** list dates ระหว่าง from..to (inclusive) — สำหรับ render calendar grid */
export function enumerateDates(from: string, to: string): string[] {
  const out: string[] = [];
  const start = new Date(from + 'T00:00:00');
  const end = new Date(to + 'T00:00:00');
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    out.push(d.toISOString().slice(0, 10));
  }
  return out;
}
