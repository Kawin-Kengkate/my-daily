import { getISOWeek, getISOWeekYear, getISODay, parseISO, subWeeks } from 'date-fns';

export function isoWeekKey(d: Date): string {
  const year = getISOWeekYear(d);
  const week = getISOWeek(d);
  return `${year}-W${String(week).padStart(2, '0')}`;
}

export function currentWeekKey(): string {
  return isoWeekKey(new Date());
}

// todayDow: 1=Mon … 7=Sun (ISO)
export function todayISODow(): number {
  return getISODay(new Date());
}

export interface WeeklyAggregate {
  hours: number;
  activeDays: number;
  activeDatesSet: Set<string>;
}

export function aggregateWeek(
  sessions: Array<{ date: string; duration_min: number }>,
  weekKey: string,
): WeeklyAggregate {
  const activeDatesSet = new Set<string>();
  let totalMin = 0;
  for (const s of sessions) {
    if (isoWeekKey(parseISO(s.date)) === weekKey) {
      totalMin += s.duration_min;
      activeDatesSet.add(s.date);
    }
  }
  return { hours: totalMin / 60, activeDays: activeDatesSet.size, activeDatesSet };
}

export type NudgeLevel = 'hidden' | 'celebrate' | 'info' | 'warning' | 'urgent';

export function computeNudge({
  hasActiveCourse,
  dismissed,
  onLogPage,
  hoursLogged,
  weeklyTarget,
  todayDow,
}: {
  hasActiveCourse: boolean;
  dismissed: boolean;
  onLogPage: boolean;
  hoursLogged: number;
  weeklyTarget: number;
  todayDow: number; // 1=Mon, 7=Sun
}): NudgeLevel {
  if (!hasActiveCourse) return 'hidden';
  if (dismissed) return 'hidden';
  if (onLogPage) return 'hidden';
  if (hoursLogged >= weeklyTarget) return 'celebrate';
  if (todayDow <= 2) return 'hidden';
  const pct = weeklyTarget > 0 ? hoursLogged / weeklyTarget : 0;
  if (todayDow === 3 && hoursLogged === 0) return 'info';
  if (todayDow === 4 && pct < 0.3) return 'info';
  if (todayDow === 5 && pct < 0.5) return 'warning';
  if (todayDow === 6 && pct < 0.7) return 'warning';
  if (todayDow === 7 && pct < 1) return 'urgent';
  return 'hidden';
}

export interface WeeklyTrendPoint {
  week: string;
  hours: number;
}

export function buildWeeklyTrend(
  sessions: Array<{ date: string; duration_min: number }>,
  numWeeks = 8,
): WeeklyTrendPoint[] {
  const today = new Date();
  const result: WeeklyTrendPoint[] = [];
  for (let i = numWeeks - 1; i >= 0; i--) {
    const d = subWeeks(today, i);
    const key = isoWeekKey(d);
    const totalMin = sessions
      .filter((s) => isoWeekKey(parseISO(s.date)) === key)
      .reduce((sum, s) => sum + s.duration_min, 0);
    result.push({ week: `W${getISOWeek(d)}`, hours: Math.round((totalMin / 60) * 10) / 10 });
  }
  return result;
}

export interface HeatmapCell {
  date: string;
  durationMin: number;
  intensity: 0 | 1 | 2 | 3; // 0=none, 1=low(<60), 2=mid(60-119), 3=high(120+)
}

export function buildHeatmap(
  sessions: Array<{ date: string; duration_min: number }>,
  days = 91,
): HeatmapCell[] {
  const today = new Date();
  const byDate = new Map<string, number>();
  for (const s of sessions) {
    byDate.set(s.date, (byDate.get(s.date) ?? 0) + s.duration_min);
  }

  const cells: HeatmapCell[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const iso = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    const min = byDate.get(iso) ?? 0;
    const intensity: HeatmapCell['intensity'] = min === 0 ? 0 : min < 60 ? 1 : min < 120 ? 2 : 3;
    cells.push({ date: iso, durationMin: min, intensity });
  }
  return cells;
}
