import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  listCourses,
  createCourse,
  updateCourse,
  deleteCourse,
  seedStarterCourses,
} from '@/api/learningCourses';
import type { LearningCourse, CourseStatus } from '@/types/db';

export function useLearningCourses() {
  return useQuery({ queryKey: ['learning-courses'], queryFn: listCourses });
}

export function useActiveCourses() {
  const q = useLearningCourses();
  return {
    ...q,
    data: q.data?.filter((c) => c.status === 'active') ?? [],
  };
}

export function useCreateCourse() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createCourse,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['learning-courses'] }),
  });
}

export function useUpdateCourse() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: Partial<LearningCourse> }) => updateCourse(id, patch),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['learning-courses'] }),
  });
}

export function useSetCourseStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: CourseStatus }) =>
      updateCourse(id, { status }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['learning-courses'] }),
  });
}

export function useDeleteCourse() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteCourse,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['learning-courses'] }),
  });
}

export function useSeedStarterCourses() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: seedStarterCourses,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['learning-courses'] }),
  });
}
