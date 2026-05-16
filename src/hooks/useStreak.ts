import { useMemo } from 'react';
import { useDaysInRange } from './useDay';
import { useCalendarOverrides } from './useCalendarOverrides';
import { calculateStreak } from '@/lib/streak';
import { addDays, fromISO, toISO, todayISO } from '@/lib/date';

const LOOKBACK = 365;

export function useStreak() {
  const today = todayISO();
  const from = useMemo(() => toISO(addDays(fromISO(today), -LOOKBACK)), [today]);
  const { data: days = [], isLoading } = useDaysInRange(from, today);
  const { map: overrides } = useCalendarOverrides();

  const streak = useMemo(() => {
    const saved = new Set(days.map((d) => d.date));
    return calculateStreak(saved, today, overrides, LOOKBACK);
  }, [days, today, overrides]);

  return { ...streak, isLoading };
}
