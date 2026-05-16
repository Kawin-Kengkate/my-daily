// Streak calculation — pure function
// กฎ:
//  - "วันที่บันทึก" = มี Day row (ไม่สนใจ entries — leave/holiday/training ก็นับว่าบันทึก)
//  - holiday (ส-อา, วันหยุดราชการ, override holiday) → SKIP ไม่นับ ไม่ break
//  - workday ที่ไม่มี Day row → break streak
//  - ถ้าวันนี้ยังไม่บันทึก แต่เมื่อวานบันทึก → ไม่ break (เริ่มนับจากเมื่อวาน)

import type { OverrideMap } from './calendar';
import { resolveDay } from './calendar';
import { addDays, fromISO, toISO } from './date';

export interface StreakResult {
  current: number;
  longest: number;
}

export function calculateStreak(
  savedDates: Set<string>,
  today: string,
  overrides: OverrideMap,
  lookbackDays = 365,
): StreakResult {
  const startOffset = savedDates.has(today) ? 0 : 1;

  let current = 0;
  for (let i = startOffset; i <= lookbackDays; i++) {
    const iso = toISO(addDays(fromISO(today), -i));
    const info = resolveDay(iso, overrides);
    if (info.type === 'holiday') continue;
    if (savedDates.has(iso)) {
      current++;
    } else {
      break;
    }
  }

  // longest: scan ตั้งแต่ lookback ย้อนหลังสุด → today
  let longest = 0;
  let run = 0;
  for (let i = lookbackDays; i >= 0; i--) {
    const iso = toISO(addDays(fromISO(today), -i));
    const info = resolveDay(iso, overrides);
    if (info.type === 'holiday') continue;
    if (savedDates.has(iso)) {
      run++;
      if (run > longest) longest = run;
    } else {
      // ยกเว้น today ที่ยังไม่บันทึก — ไม่ break (อนาคต)
      if (iso === today && startOffset === 1) continue;
      run = 0;
    }
  }

  return { current, longest: Math.max(longest, current) };
}
