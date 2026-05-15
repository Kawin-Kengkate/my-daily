import { useCallback } from 'react';
import { toast } from 'sonner';

export interface OTRow {
  date: string;
  span: string;
  hours15x: number;
  hours3x: number;
  amount: number;
  note: string;
}

/** copy เป็น TSV → paste ลง Excel/Google Sheets ได้ตรงๆ */
export function useCopyTable() {
  return useCallback(async (rows: OTRow[]) => {
    const header = ['วันที่', 'ช่วงเวลา', '1.5x', '3x', 'เงิน', 'หมายเหตุ'].join('\t');
    const body = rows
      .map((r) => [r.date, r.span, r.hours15x.toFixed(2), r.hours3x.toFixed(2), r.amount.toFixed(2), r.note].join('\t'))
      .join('\n');
    try {
      await navigator.clipboard.writeText(header + '\n' + body);
      toast.success(`คัดลอก ${rows.length} rows แล้ว — paste ใน Excel ได้เลย`);
    } catch {
      toast.error('clipboard ไม่ทำงาน — ลองอีกครั้ง');
    }
  }, []);
}
