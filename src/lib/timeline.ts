import {
  differenceInCalendarDays,
  parseISO,
  isBefore,
  isAfter,
  startOfMonth,
  startOfWeek,
  addMonths,
  addWeeks,
  format,
} from 'date-fns';

// ────────────────────────────────────────────────────────────────────────────
// Types
// ────────────────────────────────────────────────────────────────────────────

export type PhaseKey = 'kickoff_at' | 'dev_at' | 'uat_at' | 'golive_at';
export type PhaseLabel = 'Kickoff' | 'Dev' | 'UAT' | 'Go-live';
export type GanttScale = 'month' | 'quarter' | 'year';

// Canonical order — bars derive from consecutive present pairs (label = end milestone)
const PHASES: { key: PhaseKey; label: PhaseLabel }[] = [
  { key: 'kickoff_at', label: 'Kickoff' },
  { key: 'dev_at',     label: 'Dev' },
  { key: 'uat_at',     label: 'UAT' },
  { key: 'golive_at',  label: 'Go-live' },
];

export interface MilestoneInput {
  kickoff_at: string | null;
  dev_at:     string | null;
  uat_at:     string | null;
  golive_at:  string | null;
}

export interface TimelineBar {
  /** name of the end milestone (shown as label on bar) */
  label: PhaseLabel;
  start: string; // ISO date
  end:   string; // ISO date
  /** 1=Dev 2=UAT 3=Go-live — drives bar opacity */
  endPhaseIndex: number;
}

export interface TimelineMilestone {
  label: PhaseLabel;
  date: string;
  phaseIndex: number;
  isPast: boolean;
  isGolive: boolean;
}

export interface Countdown {
  label: PhaseLabel;
  date: string;
  daysLeft: number; // 0 = today, positive = future
}

export interface ProjectTimelineData {
  bars: TimelineBar[];
  milestones: TimelineMilestone[];
  /** future milestones only, nearest first */
  upcomingCountdowns: Countdown[];
  /** nearest upcoming milestone — null if all are past */
  nextMilestone: Countdown | null;
  hasDates: boolean;
}

// ────────────────────────────────────────────────────────────────────────────
// Core: derive bars + milestones + countdowns from phase dates
// ────────────────────────────────────────────────────────────────────────────

export function deriveProjectTimeline(
  input: MilestoneInput,
  today: string,
): ProjectTimelineData {
  const todayDate = parseISO(today);

  // Filter to phases that have a date, keep canonical order
  const present = PHASES
    .map((p, idx) => {
      const date = input[p.key];
      if (!date) return null;
      return { label: p.label, date, phaseIndex: idx };
    })
    .filter((x): x is NonNullable<typeof x> => x !== null);

  const hasDates = present.length > 0;

  // Bars = consecutive pairs; label = end milestone
  const bars: TimelineBar[] = [];
  for (let i = 0; i < present.length - 1; i++) {
    bars.push({
      label:         present[i + 1].label,
      start:         present[i].date,
      end:           present[i + 1].date,
      endPhaseIndex: present[i + 1].phaseIndex,
    });
  }

  const milestones: TimelineMilestone[] = present.map((m) => ({
    ...m,
    isPast:   isBefore(parseISO(m.date), todayDate),
    isGolive: m.label === 'Go-live',
  }));

  const upcomingCountdowns: Countdown[] = present
    .filter((m) => !isBefore(parseISO(m.date), todayDate))
    .map((m) => ({
      label:    m.label,
      date:     m.date,
      daysLeft: differenceInCalendarDays(parseISO(m.date), todayDate),
    }))
    .sort((a, b) => a.daysLeft - b.daysLeft);

  const nextMilestone = upcomingCountdowns[0] ?? null;

  return { bars, milestones, upcomingCountdowns, nextMilestone, hasDates };
}

// ────────────────────────────────────────────────────────────────────────────
// Gantt window + positioning
// ────────────────────────────────────────────────────────────────────────────

export interface GanttWindow {
  start:     string; // ISO date
  end:       string; // ISO date
  totalDays: number;
}

function isoFrom(d: Date): string {
  return format(d, 'yyyy-MM-dd');
}

function shiftDays(iso: string, days: number): string {
  const d = parseISO(iso);
  d.setDate(d.getDate() + days);
  return isoFrom(d);
}

export function getGanttWindow(today: string, scale: GanttScale): GanttWindow {
  const start = shiftDays(today, -30);
  const end =
    scale === 'month'   ? shiftDays(today, 60)  // ~3 months total
    : scale === 'quarter' ? shiftDays(today, 90) // ~4 months total
    :                       shiftDays(today, 335); // ~12 months total

  const totalDays = differenceInCalendarDays(parseISO(end), parseISO(start));
  return { start, end, totalDays };
}

/** position of a date as 0–100% within the window (may exceed range for clipping) */
export function dateToPercent(date: string, win: GanttWindow): number {
  const days = differenceInCalendarDays(parseISO(date), parseISO(win.start));
  return (days / win.totalDays) * 100;
}

export function clampPct(pct: number): number {
  return Math.max(0, Math.min(100, pct));
}

// ────────────────────────────────────────────────────────────────────────────
// Axis columns (header labels above the chart)
// ────────────────────────────────────────────────────────────────────────────

export interface AxisColumn {
  key:      string;
  label:    string;
  leftPct:  number;
  widthPct: number;
}

export function buildAxisColumns(win: GanttWindow, scale: GanttScale): AxisColumn[] {
  const winStart = parseISO(win.start);
  const winEnd   = parseISO(win.end);

  if (scale === 'month') {
    // Week columns (Mon-start)
    const cols: AxisColumn[] = [];
    let cur = startOfWeek(winStart, { weekStartsOn: 1 });
    while (!isAfter(cur, winEnd)) {
      const colStart = isBefore(cur, winStart) ? winStart : cur;
      const nextWeek = addWeeks(cur, 1);
      const colEnd   = isAfter(nextWeek, winEnd) ? winEnd : nextWeek;
      const leftPct  = clampPct(dateToPercent(isoFrom(colStart), win));
      const rightPct = clampPct(dateToPercent(isoFrom(colEnd),   win));
      const widthPct = rightPct - leftPct;
      if (widthPct > 0) {
        cols.push({ key: isoFrom(cur), label: format(cur, 'd MMM'), leftPct, widthPct });
      }
      cur = nextWeek;
    }
    return cols;
  }

  // Month columns (quarter + year)
  const cols: AxisColumn[] = [];
  let cur = startOfMonth(winStart);
  while (!isAfter(cur, winEnd)) {
    const colStart = isBefore(cur, winStart) ? winStart : cur;
    const nextMonth = addMonths(cur, 1);
    const colEnd    = isAfter(nextMonth, winEnd) ? winEnd : nextMonth;
    const leftPct   = clampPct(dateToPercent(isoFrom(colStart), win));
    const rightPct  = clampPct(dateToPercent(isoFrom(colEnd),   win));
    const widthPct  = rightPct - leftPct;
    if (widthPct > 0) {
      cols.push({
        key:      format(cur, 'yyyy-MM'),
        label:    format(cur, scale === 'year' ? 'MMM yy' : 'MMM'),
        leftPct,
        widthPct,
      });
    }
    cur = nextMonth;
  }
  return cols;
}
