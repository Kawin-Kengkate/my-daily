import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  listProjects,
  createProject,
  updateProject,
  deleteProject,
  listProjectProgress,
  getLatestProgressByProject,
} from '@/api/projects';
import type { Project } from '@/types/db';

export function useProjects() {
  return useQuery({ queryKey: ['projects'], queryFn: listProjects });
}

export function useLatestProgressByProject(beforeISO: string) {
  return useQuery({
    queryKey: ['latest-progress', beforeISO],
    queryFn: () => getLatestProgressByProject(beforeISO),
    staleTime: 60_000,
  });
}

export function useProjectProgress(sinceISO: string) {
  return useQuery({
    queryKey: ['project-progress', sinceISO],
    queryFn: () => listProjectProgress(sinceISO),
    staleTime: 60_000,
  });
}

export function useCreateProject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createProject,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['projects'] }),
  });
}

export function useUpdateProject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: Partial<Project> }) => updateProject(id, patch),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['projects'] }),
  });
}

export function useDeleteProject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteProject,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['projects'] }),
  });
}
