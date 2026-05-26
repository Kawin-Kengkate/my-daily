import { describe, it, expect } from 'vitest';
import { isoWeekKey, aggregateWeek, computeNudge, buildWeeklyTrend, buildHeatmap } from './learning';

describe('isoWeekKey', () => {
  it('returns correct ISO week key', () => {
    expect(isoWeekKey(new Date('2026-01-05'))).toBe('2026-W02');
  });

  it('handles year boundary — 2025-12-29 is ISO week 2026-W01', () => {
    expect(isoWeekKey(new Date('2025-12-29'))).toBe('2026-W01');
  });

  it('handles year boundary — 2026-01-04 is ISO week 2026-W01', () => {
    expect(isoWeekKey(new Date('2026-01-04'))).toBe('2026-W01');
  });
});

describe('aggregateWeek', () => {
  const sessions = [
    { date: '2026-05-26', duration_min: 60 },
    { date: '2026-05-27', duration_min: 90 },
    { date: '2026-05-20', duration_min: 45 }, // different week
  ];

  it('sums duration of sessions in the given week', () => {
    const weekKey = isoWeekKey(new Date('2026-05-26'));
    const result = aggregateWeek(sessions, weekKey);
    expect(result.hours).toBeCloseTo(2.5);
  });

  it('counts unique active days', () => {
    const weekKey = isoWeekKey(new Date('2026-05-26'));
    const result = aggregateWeek(sessions, weekKey);
    expect(result.activeDays).toBe(2);
  });

  it('returns 0 when no sessions in week', () => {
    const result = aggregateWeek(sessions, '2026-W01');
    expect(result.hours).toBe(0);
    expect(result.activeDays).toBe(0);
  });

  it('handles duplicate date (same day, multiple sessions)', () => {
    const s2 = [
      { date: '2026-05-26', duration_min: 60 },
      { date: '2026-05-26', duration_min: 30 },
    ];
    const weekKey = isoWeekKey(new Date('2026-05-26'));
    const result = aggregateWeek(s2, weekKey);
    expect(result.hours).toBeCloseTo(1.5);
    expect(result.activeDays).toBe(1); // same day → 1 active day
  });
});

describe('computeNudge', () => {
  const base = {
    hasActiveCourse: true,
    dismissed: false,
    onLogPage: false,
    hoursLogged: 0,
    weeklyTarget: 10,
    todayDow: 3,
  };

  it('returns hidden when no active course', () => {
    expect(computeNudge({ ...base, hasActiveCourse: false })).toBe('hidden');
  });

  it('returns hidden when dismissed', () => {
    expect(computeNudge({ ...base, dismissed: true })).toBe('hidden');
  });

  it('returns hidden when on log page', () => {
    expect(computeNudge({ ...base, onLogPage: true })).toBe('hidden');
  });

  it('returns celebrate when hours >= target', () => {
    expect(computeNudge({ ...base, hoursLogged: 10, todayDow: 5 })).toBe('celebrate');
    expect(computeNudge({ ...base, hoursLogged: 12, todayDow: 5 })).toBe('celebrate');
  });

  it('returns hidden for Mon-Tue regardless of hours', () => {
    expect(computeNudge({ ...base, todayDow: 1 })).toBe('hidden');
    expect(computeNudge({ ...base, todayDow: 2 })).toBe('hidden');
  });

  it('Wed: shows info only when hours === 0', () => {
    expect(computeNudge({ ...base, todayDow: 3, hoursLogged: 0 })).toBe('info');
    expect(computeNudge({ ...base, todayDow: 3, hoursLogged: 1 })).toBe('hidden');
  });

  it('Thu: shows info when < 30%', () => {
    expect(computeNudge({ ...base, todayDow: 4, hoursLogged: 2.9 })).toBe('info');
    expect(computeNudge({ ...base, todayDow: 4, hoursLogged: 3 })).toBe('hidden');
  });

  it('Fri: shows warning when < 50%', () => {
    expect(computeNudge({ ...base, todayDow: 5, hoursLogged: 4.9 })).toBe('warning');
    expect(computeNudge({ ...base, todayDow: 5, hoursLogged: 5 })).toBe('hidden');
  });

  it('Sat: shows warning when < 70%', () => {
    expect(computeNudge({ ...base, todayDow: 6, hoursLogged: 6.9 })).toBe('warning');
    expect(computeNudge({ ...base, todayDow: 6, hoursLogged: 7 })).toBe('hidden');
  });

  it('Sun: shows urgent when < 100%', () => {
    expect(computeNudge({ ...base, todayDow: 7, hoursLogged: 9.9 })).toBe('urgent');
    expect(computeNudge({ ...base, todayDow: 7, hoursLogged: 10 })).toBe('celebrate');
  });
});

describe('buildWeeklyTrend', () => {
  it('returns correct number of weeks', () => {
    const result = buildWeeklyTrend([], 8);
    expect(result).toHaveLength(8);
  });

  it('returns correct number of weeks for custom numWeeks', () => {
    expect(buildWeeklyTrend([], 4)).toHaveLength(4);
  });

  it('aggregates sessions into correct weeks', () => {
    const sessions = [{ date: '2026-05-26', duration_min: 120 }];
    const result = buildWeeklyTrend(sessions, 8);
    const totalHours = result.reduce((sum, w) => sum + w.hours, 0);
    expect(totalHours).toBeCloseTo(2);
  });
});

describe('buildHeatmap', () => {
  it('returns correct number of cells', () => {
    expect(buildHeatmap([], 91)).toHaveLength(91);
    expect(buildHeatmap([], 30)).toHaveLength(30);
  });

  it('assigns correct intensity levels', () => {
    const today = new Date();
    const iso = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    const cells = buildHeatmap([
      { date: iso, duration_min: 30 },  // < 60 → intensity 1
    ], 1);
    expect(cells[0].intensity).toBe(1);
  });

  it('assigns intensity 2 for 60-119 min', () => {
    const today = new Date();
    const iso = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    const cells = buildHeatmap([{ date: iso, duration_min: 90 }], 1);
    expect(cells[0].intensity).toBe(2);
  });

  it('assigns intensity 3 for 120+ min', () => {
    const today = new Date();
    const iso = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    const cells = buildHeatmap([{ date: iso, duration_min: 120 }], 1);
    expect(cells[0].intensity).toBe(3);
  });
});
