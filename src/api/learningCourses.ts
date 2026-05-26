import { supabase } from './supabase';
import type { LearningCourse, CourseStatus } from '@/types/db';

export async function listCourses(): Promise<LearningCourse[]> {
  const { data, error } = await supabase
    .from('learning_courses')
    .select('*')
    .order('phase', { ascending: true, nullsFirst: false })
    .order('created_at', { ascending: true });
  if (error) throw error;
  return (data ?? []) as LearningCourse[];
}

export async function createCourse(c: {
  name: string;
  code: string;
  phase?: number | null;
  status?: CourseStatus;
  target_hours_per_week?: number | null;
}): Promise<LearningCourse> {
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) throw new Error('not authenticated');
  const { data, error } = await supabase
    .from('learning_courses')
    .insert({ ...c, user_id: user.id })
    .select()
    .single();
  if (error) throw error;
  return data as LearningCourse;
}

export async function updateCourse(id: string, patch: Partial<LearningCourse>): Promise<LearningCourse> {
  const { data, error } = await supabase
    .from('learning_courses')
    .update({ ...patch, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data as LearningCourse;
}

export async function deleteCourse(id: string): Promise<void> {
  const { error } = await supabase.from('learning_courses').delete().eq('id', id);
  if (error) throw error;
}

const STARTER_COURSES: Omit<LearningCourse, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'started_at' | 'finished_at'>[] = [
  { name: 'FastAPI Complete Course', code: 'FA', phase: 1, status: 'active', target_hours_per_week: null },
  { name: 'Advanced React', code: 'RX', phase: 1, status: 'active', target_hours_per_week: null },
  { name: 'Git Advanced', code: 'GIT', phase: 1, status: 'paused', target_hours_per_week: null },
  { name: 'SQL Performance Tuning', code: 'SQL', phase: 1, status: 'paused', target_hours_per_week: null },
  { name: 'Docker Basics', code: 'DOCK', phase: 1, status: 'paused', target_hours_per_week: null },
  { name: 'React Testing Library + Vitest', code: 'RTL', phase: 2, status: 'paused', target_hours_per_week: null },
  { name: 'AI Agent & Modern Workflow', code: 'AI', phase: 2, status: 'paused', target_hours_per_week: null },
  { name: 'Mastering System Design Interview', code: 'SD', phase: 3, status: 'paused', target_hours_per_week: null },
  { name: 'AZ-204 Developer Associate', code: 'AZ', phase: 3, status: 'paused', target_hours_per_week: null },
];

export async function seedStarterCourses(): Promise<void> {
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) throw new Error('not authenticated');
  const rows = STARTER_COURSES.map((c) => ({ ...c, user_id: user.id }));
  const { error } = await supabase.from('learning_courses').insert(rows);
  if (error) throw error;
}
