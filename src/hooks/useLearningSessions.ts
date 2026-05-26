import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { listSessions, createSession, deleteSession } from '@/api/learningSessions';
import { toISO } from '@/lib/date';
import { subDays } from 'date-fns';

// สำหรับ dashboard: โหลด sessions ย้อนหลัง 91 วัน (heatmap 13 สัปดาห์ + trend 8 สัปดาห์)
export function useDashboardSessions() {
  const from = toISO(subDays(new Date(), 90));
  return useQuery({
    queryKey: ['learning-sessions-dashboard', from],
    queryFn: () => listSessions({ from }),
    staleTime: 60_000,
  });
}

// สำหรับ courses page: โหลดทั้งหมดเพื่อ aggregate hours ต่อ course
export function useAllSessions() {
  return useQuery({
    queryKey: ['learning-sessions-all'],
    queryFn: () => listSessions({}),
    staleTime: 60_000,
  });
}

export function useCreateSession() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createSession,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['learning-sessions-dashboard'] });
      qc.invalidateQueries({ queryKey: ['learning-sessions-all'] });
    },
  });
}

export function useDeleteSession() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteSession,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['learning-sessions-dashboard'] });
      qc.invalidateQueries({ queryKey: ['learning-sessions-all'] });
    },
  });
}
