import { supabase } from './supabase';
import type { Project, ProjectStatus } from '@/types/db';

export async function listProjects(): Promise<Project[]> {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []) as Project[];
}

export async function createProject(p: {
  code: string;
  name: string;
  description?: string;
  color?: string;
  status?: ProjectStatus;
  tags?: string[];
}): Promise<Project> {
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) throw new Error('not authenticated');
  const { data, error } = await supabase
    .from('projects')
    .insert({ ...p, user_id: user.id })
    .select()
    .single();
  if (error) throw error;
  return data as Project;
}

export async function updateProject(id: string, patch: Partial<Project>): Promise<Project> {
  const { data, error } = await supabase
    .from('projects')
    .update(patch)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data as Project;
}

export async function deleteProject(id: string): Promise<void> {
  const { error } = await supabase.from('projects').delete().eq('id', id);
  if (error) throw error;
}

/** ค่า progress ล่าสุดของแต่ละ project ก่อนวันที่ระบุ — ใช้ pre-fill ตอนเลือก project ใน DailyForm */
export async function getLatestProgressByProject(beforeISO: string): Promise<Record<string, string>> {
  const { data, error } = await supabase
    .from('entries')
    .select('project_id, progress, days!inner(date)')
    .lt('days.date', beforeISO);
  if (error) throw error;
  const latestDate: Record<string, string> = {};
  const result: Record<string, string> = {};
  for (const row of (data ?? []) as unknown as Array<{
    project_id: string;
    progress: string;
    days: { date: string } | { date: string }[];
  }>) {
    const date = Array.isArray(row.days) ? row.days[0]?.date : row.days?.date;
    if (!date) continue;
    if (!latestDate[row.project_id] || date > latestDate[row.project_id]) {
      latestDate[row.project_id] = date;
      result[row.project_id] = row.progress;
    }
  }
  return result;
}

export interface ProgressPoint {
  date: string;
  value: number; // 0..100
}

export async function listProjectProgress(sinceISO: string): Promise<Map<string, ProgressPoint[]>> {
  const { data, error } = await supabase
    .from('entries')
    .select('project_id, progress, days!inner(date)')
    .gte('days.date', sinceISO)
    .order('created_at', { ascending: true });
  if (error) throw error;
  const map = new Map<string, ProgressPoint[]>();
  for (const row of (data ?? []) as unknown as Array<{ project_id: string; progress: string; days: { date: string } | { date: string }[] }>) {
    const v = parseProgress(row.progress);
    if (v == null) continue;
    const date = Array.isArray(row.days) ? row.days[0]?.date : row.days?.date;
    if (!date) continue;
    const arr = map.get(row.project_id) ?? [];
    arr.push({ date, value: v });
    map.set(row.project_id, arr);
  }
  for (const arr of map.values()) arr.sort((a, b) => a.date.localeCompare(b.date));
  return map;
}

function parseProgress(p: string): number | null {
  const s = p.trim().toLowerCase();
  if (s === 'complete') return 100;
  const m = s.match(/^(\d{1,3})%$/);
  if (!m) return null;
  return Math.min(100, Math.max(0, Number(m[1])));
}
