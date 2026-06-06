import { describe, it, expect } from 'vitest';
import {
  deriveProjectTimeline,
  getGanttWindow,
  dateToPercent,
  buildAxisColumns,
} from './timeline';

const TODAY = '2026-06-06';

// ────────────────────────────────────────────────────────────────────────────
// deriveProjectTimeline
// ────────────────────────────────────────────────────────────────────────────

describe('deriveProjectTimeline', () => {
  it('all 4 milestones → 3 bars with correct end-labels', () => {
    const input = {
      kickoff_at: '2026-05-01',
      dev_at:     '2026-05-15',
      uat_at:     '2026-06-01',
      golive_at:  '2026-06-20',
    };
    const { bars, milestones, hasDates } = deriveProjectTimeline(input, TODAY);
    expect(hasDates).toBe(true);
    expect(bars).toHaveLength(3);
    expect(bars[0].label).toBe('Dev');
    expect(bars[1].label).toBe('UAT');
    expect(bars[2].label).toBe('Go-live');
    expect(milestones).toHaveLength(4);
  });

  it('dev + golive only → 1 bar "Go-live"', () => {
    const input = { kickoff_at: null, dev_at: '2026-05-01', uat_at: null, golive_at: '2026-07-01' };
    const { bars } = deriveProjectTimeline(input, TODAY);
    expect(bars).toHaveLength(1);
    expect(bars[0].label).toBe('Go-live');
    expect(bars[0].start).toBe('2026-05-01');
    expect(bars[0].end).toBe('2026-07-01');
  });

  it('only kickoff → no bars, 1 milestone marker', () => {
    const input = { kickoff_at: '2026-06-10', dev_at: null, uat_at: null, golive_at: null };
    const { bars, milestones } = deriveProjectTimeline(input, TODAY);
    expect(bars).toHaveLength(0);
    expect(milestones).toHaveLength(1);
    expect(milestones[0].label).toBe('Kickoff');
  });

  it('only golive → no bars, isGolive = true on the milestone', () => {
    const input = { kickoff_at: null, dev_at: null, uat_at: null, golive_at: '2026-07-01' };
    const { bars, milestones } = deriveProjectTimeline(input, TODAY);
    expect(bars).toHaveLength(0);
    expect(milestones[0].isGolive).toBe(true);
  });

  it('no milestones → hasDates false, empty arrays', () => {
    const input = { kickoff_at: null, dev_at: null, uat_at: null, golive_at: null };
    const { hasDates, bars, milestones } = deriveProjectTimeline(input, TODAY);
    expect(hasDates).toBe(false);
    expect(bars).toHaveLength(0);
    expect(milestones).toHaveLength(0);
  });

  it('all past → upcomingCountdowns empty, nextMilestone null', () => {
    const input = {
      kickoff_at: '2026-01-01',
      dev_at:     '2026-02-01',
      uat_at:     '2026-03-01',
      golive_at:  '2026-04-01',
    };
    const { upcomingCountdowns, nextMilestone } = deriveProjectTimeline(input, TODAY);
    expect(upcomingCountdowns).toHaveLength(0);
    expect(nextMilestone).toBeNull();
  });

  it('mixed past/future → only future in upcomingCountdowns', () => {
    const input = {
      kickoff_at: '2026-05-01', // past
      dev_at:     '2026-05-20', // past
      uat_at:     '2026-06-15', // future (9 days)
      golive_at:  '2026-07-01', // future
    };
    const { upcomingCountdowns } = deriveProjectTimeline(input, TODAY);
    expect(upcomingCountdowns).toHaveLength(2);
    expect(upcomingCountdowns[0].label).toBe('UAT');
    expect(upcomingCountdowns[0].daysLeft).toBe(9);
  });

  it('today milestone → daysLeft = 0, included in upcoming', () => {
    const input = { kickoff_at: null, dev_at: null, uat_at: null, golive_at: TODAY };
    const { upcomingCountdowns } = deriveProjectTimeline(input, TODAY);
    expect(upcomingCountdowns).toHaveLength(1);
    expect(upcomingCountdowns[0].daysLeft).toBe(0);
  });

  it('out-of-date-order (uat before dev in calendar) → no crash, derived by canonical order', () => {
    const input = {
      kickoff_at: null,
      dev_at:     '2026-07-01',
      uat_at:     '2026-06-01', // earlier in calendar but later in canonical order
      golive_at:  '2026-08-01',
    };
    expect(() => deriveProjectTimeline(input, TODAY)).not.toThrow();
    const { bars } = deriveProjectTimeline(input, TODAY);
    // canonical: dev→uat→golive, so 2 bars
    expect(bars).toHaveLength(2);
    expect(bars[0].label).toBe('UAT');
    expect(bars[1].label).toBe('Go-live');
  });

  it('countdowns sorted nearest first', () => {
    const input = {
      kickoff_at: null,
      dev_at:     null,
      uat_at:     '2026-07-01',
      golive_at:  '2026-06-20', // closer
    };
    const { upcomingCountdowns } = deriveProjectTimeline(input, TODAY);
    expect(upcomingCountdowns[0].label).toBe('Go-live');
    expect(upcomingCountdowns[1].label).toBe('UAT');
  });

  it('endPhaseIndex on bars is correct', () => {
    const input = {
      kickoff_at: '2026-05-01',
      dev_at:     '2026-05-15',
      uat_at:     '2026-06-01',
      golive_at:  '2026-06-20',
    };
    const { bars } = deriveProjectTimeline(input, TODAY);
    expect(bars[0].endPhaseIndex).toBe(1); // Dev
    expect(bars[1].endPhaseIndex).toBe(2); // UAT
    expect(bars[2].endPhaseIndex).toBe(3); // Go-live
  });
});

// ────────────────────────────────────────────────────────────────────────────
// getGanttWindow
// ────────────────────────────────────────────────────────────────────────────

describe('getGanttWindow', () => {
  it('month: totalDays = 90', () => {
    expect(getGanttWindow(TODAY, 'month').totalDays).toBe(90);
  });
  it('quarter: totalDays = 120', () => {
    expect(getGanttWindow(TODAY, 'quarter').totalDays).toBe(120);
  });
  it('year: totalDays = 365', () => {
    expect(getGanttWindow(TODAY, 'year').totalDays).toBe(365);
  });
  it('start is 30 days before today', () => {
    const win = getGanttWindow(TODAY, 'quarter');
    expect(win.start).toBe('2026-05-07');
  });
});

// ────────────────────────────────────────────────────────────────────────────
// dateToPercent
// ────────────────────────────────────────────────────────────────────────────

describe('dateToPercent', () => {
  const win = getGanttWindow(TODAY, 'quarter'); // start=May 7, totalDays=120

  it('window start → 0%', () => {
    expect(dateToPercent(win.start, win)).toBeCloseTo(0);
  });

  it('window end → 100%', () => {
    expect(dateToPercent(win.end, win)).toBeCloseTo(100);
  });

  it('today is at 25% (30/120)', () => {
    expect(dateToPercent(TODAY, win)).toBeCloseTo(25, 0);
  });

  it('date before window → negative value', () => {
    expect(dateToPercent('2026-01-01', win)).toBeLessThan(0);
  });
});

// ────────────────────────────────────────────────────────────────────────────
// buildAxisColumns
// ────────────────────────────────────────────────────────────────────────────

describe('buildAxisColumns', () => {
  it('quarter → month columns, widths sum ~100', () => {
    const win  = getGanttWindow(TODAY, 'quarter');
    const cols = buildAxisColumns(win, 'quarter');
    expect(cols.length).toBeGreaterThan(0);
    const total = cols.reduce((s, c) => s + c.widthPct, 0);
    expect(total).toBeCloseTo(100, 0);
  });

  it('month → week columns', () => {
    const win  = getGanttWindow(TODAY, 'month');
    const cols = buildAxisColumns(win, 'month');
    expect(cols.length).toBeGreaterThan(0);
    // each column has a valid left/width
    for (const c of cols) {
      expect(c.widthPct).toBeGreaterThan(0);
      expect(c.leftPct).toBeGreaterThanOrEqual(0);
    }
  });

  it('year → month columns with "MMM yy" labels', () => {
    const win  = getGanttWindow(TODAY, 'year');
    const cols = buildAxisColumns(win, 'year');
    // should have ~13 month columns
    expect(cols.length).toBeGreaterThanOrEqual(12);
    // labels contain 2-digit year
    expect(cols[0].label).toMatch(/\d{2}$/);
  });
});
