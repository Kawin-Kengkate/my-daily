import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getDay, upsertDay, saveEntries, listDaysInRange } from '@/api/days';
import type { LocationKind } from '@/types/db';

export function useDay(dateISO: string) {
  return useQuery({
    queryKey: ['day', dateISO],
    queryFn: () => getDay(dateISO),
  });
}

export function useDaysInRange(from: string, to: string) {
  return useQuery({
    queryKey: ['days', from, to],
    queryFn: () => listDaysInRange(from, to),
  });
}

export function useSaveDay() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: {
      date: string;
      location: LocationKind;
      is_holiday: boolean;
      note?: string | null;
      entries: Array<{
        project_id: string;
        start_time: string;
        end_time: string;
        progress: string;
        done_note?: string | null;
        next_note?: string | null;
      }>;
    }) => {
      const day = await upsertDay(input);
      await saveEntries(
        day.id,
        input.entries.map((e) => ({
          project_id: e.project_id,
          start_time: e.start_time,
          end_time: e.end_time,
          progress: e.progress,
          done_note: e.done_note ?? null,
          next_note: e.next_note ?? null,
        })),
      );
      return day;
    },
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: ['day', vars.date] });
      qc.invalidateQueries({ queryKey: ['days'] });
    },
  });
}
