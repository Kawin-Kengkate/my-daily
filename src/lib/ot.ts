/**
 * OT calculation — pure function, ตามกฎใน CONTEXT.md §OT Rules
 *
 * Inputs:
 *   - day: { is_holiday, location } (location ใช้ check leave ฯลฯ)
 *   - entries: list of {start_time, end_time} — merge overlaps ก่อนคิด
 *   - settings: salary + rates + work hours
 */

export interface OTInput {
  is_holiday: boolean;
  location: string;
}

export interface OTEntryInput {
  start_time: string;
  end_time: string;
}

export interface OTSettings {
  salary: number;
  ot_rate_weekday: number;       // 1.5
  ot_rate_holiday_day: number;   // 1.5
  ot_rate_holiday_night: number; // 3
  work_start?: string;           // '08:00' (ไม่ได้ใช้ใน calc — เก็บไว้ future)
  work_end?: string;             // '16:40'
}

export interface OTResult {
  hours15x: number;
  hours3x: number;
  baseHourly: number;
  amount15x: number;
  amount3x: number;
  total: number;
}

const WEEKDAY_DINNER_START = 16 * 60 + 40; // 16:40
const WEEKDAY_DINNER_END = 17 * 60;        // 17:00
const WEEKDAY_OT_START = 17 * 60;          // 17:00
const WEEKDAY_BONUS_END = 19 * 60;         // 19:00 — ทำเต็ม 17-19 → +30 min bonus
const WEEKDAY_BONUS_MIN = 30;
const HOLIDAY_DAY_END = 17 * 60;           // 17:00 — boundary 1.5x/3x

const FIVE_HOURS = 5 * 60;
const ONE_HOUR = 60;

export function parseHHMM(t: string): number {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + (m || 0);
}

interface Interval { start: number; end: number; }

function mergeIntervals(intervals: Interval[]): Interval[] {
  const sorted = [...intervals]
    .filter((i) => i.end > i.start)
    .sort((a, b) => a.start - b.start);
  const out: Interval[] = [];
  for (const iv of sorted) {
    const last = out[out.length - 1];
    if (last && iv.start <= last.end) {
      last.end = Math.max(last.end, iv.end);
    } else {
      out.push({ ...iv });
    }
  }
  return out;
}

/** ตัดช่วง [cutStart, cutEnd] ออกจาก intervals (เช่น พักเย็น 16:40-17:00) */
function subtractInterval(intervals: Interval[], cutStart: number, cutEnd: number): Interval[] {
  const out: Interval[] = [];
  for (const iv of intervals) {
    if (iv.end <= cutStart || iv.start >= cutEnd) {
      out.push(iv);
      continue;
    }
    if (iv.start < cutStart) out.push({ start: iv.start, end: Math.min(iv.end, cutStart) });
    if (iv.end > cutEnd) out.push({ start: Math.max(iv.start, cutEnd), end: iv.end });
  }
  return out.filter((i) => i.end > i.start);
}

/** สำหรับแต่ละ continuous block — split ตาม band rate */
function splitByBand(iv: Interval, is_holiday: boolean): { min15: number; min3: number } {
  if (!is_holiday) {
    // weekday: OT คือเฉพาะ 17:00+ ทั้งหมด 1.5x
    const otStart = Math.max(iv.start, WEEKDAY_OT_START);
    if (otStart >= iv.end) return { min15: 0, min3: 0 };
    return { min15: iv.end - otStart, min3: 0 };
  }
  // holiday: 8:00-17:00 = 1.5x, 17:00+ = 3x
  const min15 = Math.max(0, Math.min(iv.end, HOLIDAY_DAY_END) - iv.start);
  const min3 = Math.max(0, iv.end - Math.max(iv.start, HOLIDAY_DAY_END));
  return { min15, min3 };
}

export function calculateOT(
  day: OTInput,
  entries: OTEntryInput[],
  settings: OTSettings,
): OTResult {
  const baseHourly = settings.salary / 30 / 8;

  // leave / training → ไม่คิด OT
  if (day.location === 'leave' || day.location === 'training') {
    return { hours15x: 0, hours3x: 0, baseHourly, amount15x: 0, amount3x: 0, total: 0 };
  }

  const merged = mergeIntervals(
    entries.map((e) => ({ start: parseHHMM(e.start_time), end: parseHHMM(e.end_time) })),
  );

  // weekday: ตัด 16:40-17:00 ออก (พักเย็นไม่ได้เงิน + เป็นจุดแยก continuous block)
  const blocks = day.is_holiday
    ? merged
    : subtractInterval(merged, WEEKDAY_DINNER_START, WEEKDAY_DINNER_END);

  let totalMin15 = 0;
  let totalMin3 = 0;

  for (const block of blocks) {
    let { min15, min3 } = splitByBand(block, day.is_holiday);
    const blockTotal = min15 + min3;

    // กฎ: ทำต่อเนื่อง > 5 ชม. → หักพัก 1 ชม. (หักจาก 1.5x ก่อน)
    if (blockTotal > FIVE_HOURS) {
      let deduct = ONE_HOUR;
      const take = Math.min(min15, deduct);
      min15 -= take;
      deduct -= take;
      if (deduct > 0) min3 -= Math.min(min3, deduct);
    }

    // weekday bonus: ทำต่อเนื่องครอบช่วง 17:00-19:00 → +30 นาที @1.5x
    // (ไม่หักจาก 5h rule เพราะเป็นเงินที่บริษัทจ่ายเพิ่ม)
    if (
      !day.is_holiday &&
      block.start <= WEEKDAY_OT_START &&
      block.end >= WEEKDAY_BONUS_END
    ) {
      min15 += WEEKDAY_BONUS_MIN;
    }

    totalMin15 += min15;
    totalMin3 += min3;
  }

  const hours15x = totalMin15 / 60;
  const hours3x = totalMin3 / 60;
  const amount15x = hours15x * settings.ot_rate_weekday * baseHourly;
  const amount3x = hours3x * settings.ot_rate_holiday_night * baseHourly;

  return {
    hours15x,
    hours3x,
    baseHourly,
    amount15x,
    amount3x,
    total: amount15x + amount3x,
  };
}
