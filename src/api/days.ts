import { supabase } from './supabase';
import type { Day, DayWithEntries, Entry, LocationKind } from '@/types/db';
import { isAutoHoliday } from '@/lib/thai-holidays';

export async function getDay(dateISO: string): Promise<DayWithEntries | null> {
  const { data, error } = await supabase
    .from('days')
    .select('*, entries(*)')
    .eq('date', dateISO)
    .maybeSingle();
  if (error) throw error;
  return (data as DayWithEntries | null) ?? null;
}

export async function listDaysInRange(from: string, to: string): Promise<DayWithEntries[]> {
  const { data, error } = await supabase
    .from('days')
    .select('*, entries(*)')
    .gte('date', from)
    .lte('date', to)
    .order('date', { ascending: true });
  if (error) throw error;
  return (data ?? []) as DayWithEntries[];
}

export async function upsertDay(patch: {
  date: string;
  location: LocationKind;
  is_holiday?: boolean;
  note?: string | null;
}): Promise<Day> {
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) throw new Error('not authenticated');
  const is_holiday = patch.is_holiday ?? isAutoHoliday(patch.date);
  const { data, error } = await supabase
    .from('days')
    .upsert(
      {
        user_id: user.id,
        date: patch.date,
        location: patch.location,
        is_holiday,
        note: patch.note ?? null,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id,date' },
    )
    .select()
    .single();
  if (error) throw error;
  return data as Day;
}

export async function saveEntries(day_id: string, entries: Array<Omit<Entry, 'id' | 'user_id' | 'day_id' | 'created_at'>>): Promise<void> {
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) throw new Error('not authenticated');

  // ลบของเก่าทั้งหมดของ day แล้ว insert ใหม่ (เรียบง่าย, single-user, ปริมาณน้อย)
  const { error: delErr } = await supabase.from('entries').delete().eq('day_id', day_id);
  if (delErr) throw delErr;

  if (entries.length === 0) return;
  const rows = entries.map((e) => ({ ...e, user_id: user.id, day_id }));
  const { error: insErr } = await supabase.from('entries').insert(rows);
  if (insErr) throw insErr;
}

export async function deleteDay(id: string): Promise<void> {
  const { error } = await supabase.from('days').delete().eq('id', id);
  if (error) throw error;
}
