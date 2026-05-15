import { supabase } from './supabase';
import type { UserSettings } from '@/types/db';

export async function getSettings(): Promise<UserSettings | null> {
  const { data, error } = await supabase.from('user_settings').select('*').maybeSingle();
  if (error) throw error;
  return data as UserSettings | null;
}

export async function upsertSettings(patch: Partial<UserSettings>): Promise<UserSettings> {
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) throw new Error('not authenticated');
  const { data, error } = await supabase
    .from('user_settings')
    .upsert({ ...patch, user_id: user.id, updated_at: new Date().toISOString() })
    .select()
    .single();
  if (error) throw error;
  return data as UserSettings;
}
