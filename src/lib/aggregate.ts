// Aggregate helpers — pure, no DOM/network
import type { DayWithEntries, UserSettings } from '@/types/db';
import { calculateOT, parseHHMM } from './ot';

export interface PeriodSummary {
  daysLogged: number;
  wfh: number;
  onsite: number;
  leave: number;
  training: number;
  holiday: number;
  workHours: number;       // ชั่วโมงรวม (start-end) ไม่หักพัก
  otHours15: number;
  otHours3: number;
  otAmount: number;
  /** project_id → hours */
  projectHours: Record<string, number>;
}

export function summarizePeriod(
  days: DayWithEntries[],
  settings: UserSettings | null | undefined,
): PeriodSummary {
  const sum: PeriodSummary = {
    daysLogged: 0, wfh: 0, onsite: 0, leave: 0, training: 0, holiday: 0,
    workHours: 0, otHours15: 0, otHours3: 0, otAmount: 0,
    projectHours: {},
  };

  for (const d of days) {
    sum.daysLogged++;
    if (d.location in sum) (sum as unknown as Record<string, number>)[d.location]++;

    for (const e of d.entries) {
      const hours = Math.max(0, (parseHHMM(e.end_time) - parseHHMM(e.start_time)) / 60);
      sum.workHours += hours;
      sum.projectHours[e.project_id] = (sum.projectHours[e.project_id] ?? 0) + hours;
    }

    if (settings) {
      const ot = calculateOT(
        { is_holiday: d.is_holiday, location: d.location },
        d.entries,
        settings,
      );
      sum.otHours15 += ot.hours15x;
      sum.otHours3 += ot.hours3x;
      sum.otAmount += ot.total;
    }
  }

  return sum;
}

/** delta คำนวณแบบ a - b (a = ปัจจุบัน, b = อ้างอิง) */
export function delta(a: number, b: number): { abs: number; pct: number | null } {
  const absV = a - b;
  if (b === 0) return { abs: absV, pct: a === 0 ? 0 : null };
  return { abs: absV, pct: (absV / b) * 100 };
}
