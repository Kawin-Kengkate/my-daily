import { supabase } from './supabase';
import type { LearningSession } from '@/types/db';

export async function listSessions(params: {
  from?: string;
  to?: string;
  limit?: number;
} = {}): Promise<LearningSession[]> {
  let q = supabase.from('learning_sessions').select('*').order('date', { ascending: false });
  if (params.from) q = q.gte('date', params.from);
  if (params.to) q = q.lte('date', params.to);
  if (params.limit) q = q.limit(params.limit);
  const { data, error } = await q;
  if (error) throw error;
  return (data ?? []) as LearningSession[];
}

export async function createSession(s: {
  course_id: string;
  date: string;
  duration_min: number;
  note?: string;
}): Promise<LearningSession> {
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) throw new Error('not authenticated');
  const { data, error } = await supabase
    .from('learning_sessions')
    .insert({ ...s, user_id: user.id })
    .select()
    .single();
  if (error) throw error;
  return data as LearningSession;
}

export async function deleteSession(id: string): Promise<void> {
  const { error } = await supabase.from('learning_sessions').delete().eq('id', id);
  if (error) throw error;
}
