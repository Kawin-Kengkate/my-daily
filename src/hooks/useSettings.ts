import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getSettings, upsertSettings } from '@/api/settings';

export function useSettings() {
  return useQuery({ queryKey: ['settings'], queryFn: getSettings });
}

export function useSaveSettings() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: upsertSettings,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['settings'] }),
  });
}
