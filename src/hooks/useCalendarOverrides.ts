import { useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  listCalendarOverrides,
  upsertCalendarOverride,
  deleteCalendarOverride,
  bulkUpsertCalendarOverrides,
} from '@/api/calendarOverrides';
import { toOverrideMap, type OverrideMap } from '@/lib/calendar';

const FAR_PAST = '2024-01-01';
const FAR_FUTURE = '2099-12-31';

/** Load ทั้งหมด — single user, แถวน้อย (< few hundred/ปี), เก็บใน memory query cache ทั้งก้อน */
export function useCalendarOverrides() {
  const q = useQuery({
    queryKey: ['calendar_overrides'],
    queryFn: () => listCalendarOverrides(FAR_PAST, FAR_FUTURE),
    staleTime: 1000 * 60 * 5,
  });
  const map: OverrideMap = useMemo(() => toOverrideMap(q.data ?? []), [q.data]);
  return { ...q, map };
}

export function useSetCalendarOverride() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: upsertCalendarOverride,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['calendar_overrides'] }),
  });
}

export function useDeleteCalendarOverride() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteCalendarOverride,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['calendar_overrides'] }),
  });
}

export function useBulkSetCalendarOverrides() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: bulkUpsertCalendarOverrides,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['calendar_overrides'] }),
  });
}
