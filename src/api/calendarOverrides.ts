import { supabase } from './supabase';
import type { CalendarOverride, CalendarOverrideKind } from '@/types/db';

export async function listCalendarOverrides(
  from: string,
  to: string,
): Promise<CalendarOverride[]> {
  const { data, error } = await supabase
    .from('calendar_overrides')
    .select('*')
    .gte('date', from)
    .lte('date', to)
    .order('date', { ascending: true });
  if (error) throw error;
  return (data ?? []) as CalendarOverride[];
}

export async function upsertCalendarOverride(patch: {
  date: string;
  kind: CalendarOverrideKind;
  label?: string | null;
}): Promise<CalendarOverride> {
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) throw new Error('not authenticated');
  const { data, error } = await supabase
    .from('calendar_overrides')
    .upsert(
      {
        user_id: user.id,
        date: patch.date,
        kind: patch.kind,
        label: patch.label ?? null,
      },
      { onConflict: 'user_id,date' },
    )
    .select()
    .single();
  if (error) throw error;
  return data as CalendarOverride;
}

export async function deleteCalendarOverride(date: string): Promise<void> {
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) throw new Error('not authenticated');
  const { error } = await supabase
    .from('calendar_overrides')
    .delete()
    .eq('user_id', user.id)
    .eq('date', date);
  if (error) throw error;
}

export async function bulkUpsertCalendarOverrides(
  rows: Array<{ date: string; kind: CalendarOverrideKind; label?: string | null }>,
): Promise<void> {
  if (rows.length === 0) return;
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) throw new Error('not authenticated');
  const payload = rows.map((r) => ({
    user_id: user.id,
    date: r.date,
    kind: r.kind,
    label: r.label ?? null,
  }));
  const { error } = await supabase
    .from('calendar_overrides')
    .upsert(payload, { onConflict: 'user_id,date' });
  if (error) throw error;
}
