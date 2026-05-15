export function formatMoney(n: number): string {
  return n.toLocaleString('th-TH', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
}

export function formatHours(n: number): string {
  if (n === 0) return '—';
  return `${n.toFixed(n % 1 === 0 ? 0 : 2)}h`;
}

export function parseProgress(s: string): number {
  if (!s) return 0;
  if (s.toLowerCase() === 'complete' || s === 'done' || s === '100%') return 100;
  const m = s.match(/(\d+)/);
  return m ? Math.min(100, Number(m[1])) : 0;
}

export function cn(...parts: Array<string | undefined | false | null>): string {
  return parts.filter(Boolean).join(' ');
}

// Postgres unique_violation = 23505. Supabase wraps as { code, message, details } on PostgrestError.
export function friendlyDbError(err: unknown, fallback = 'เกิดข้อผิดพลาด'): string {
  const e = err as { code?: string; message?: string; details?: string } | undefined;
  if (!e) return fallback;
  if (e.code === '23505') {
    if (e.details?.includes('code')) return 'code นี้มีอยู่แล้ว ใช้ code อื่น';
    if (e.message?.includes('user_id, date')) return 'มี entry ของวันนี้อยู่แล้ว';
    return 'ข้อมูลซ้ำในระบบ';
  }
  if (e.code === '23503') return 'อ้างถึงข้อมูลที่ไม่มี (อาจถูกลบไปแล้ว)';
  if (e.code === '23514') return 'ค่าที่ใส่ไม่ผ่าน constraint';
  return e.message || fallback;
}
