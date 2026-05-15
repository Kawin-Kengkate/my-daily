import { useMemo } from 'react';
import { Copy } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useDaysInRange } from '@/hooks/useDay';
import { useSettings } from '@/hooks/useSettings';
import { useProjects } from '@/hooks/useProjects';
import { calculateOT } from '@/lib/ot';
import { formatMoney, formatHours } from '@/lib/format';
import { formatThaiDate, formatTime } from '@/lib/date';
import { useCopyTable } from './useCopyTable';

export function OTTable({ from, to }: { from: string; to: string }) {
  const { data: days = [] } = useDaysInRange(from, to);
  const { data: settings } = useSettings();
  const { data: projects = [] } = useProjects();
  const copy = useCopyTable();

  const projectName = (id: string) => projects.find((p) => p.id === id)?.code ?? '—';

  const rows = useMemo(() => {
    if (!settings) return [];
    return days
      .map((d) => {
        const ot = calculateOT({ is_holiday: d.is_holiday, location: d.location }, d.entries, settings);
        const span = d.entries.length
          ? `${formatTime(d.entries[0].start_time)}–${formatTime(d.entries[d.entries.length - 1].end_time)}`
          : '—';
        const done = d.entries.map((e) => `${projectName(e.project_id)}: ${e.done_note ?? ''}`).filter(Boolean).join(' / ');
        return { date: d.date, is_holiday: d.is_holiday, span, ot, done };
      })
      .filter((r) => r.ot.total > 0);
  }, [days, settings, projects]);

  const total = rows.reduce(
    (acc, r) => ({
      h15: acc.h15 + r.ot.hours15x,
      h3: acc.h3 + r.ot.hours3x,
      amt: acc.amt + r.ot.total,
    }),
    { h15: 0, h3: 0, amt: 0 },
  );

  return (
    <Card className="overflow-hidden p-0">
      <div className="bg-ink-900 text-paper px-5 py-3 flex items-center justify-between gap-3">
        <h3 className="font-display font-bold text-h4">OT Report — {from} → {to}</h3>
        <div className="flex items-center gap-3">
          <span className="font-mono text-hint">{rows.length} rows</span>
          <Button
            variant="lemon"
            size="sm"
            disabled={rows.length === 0}
            onClick={() =>
              copy(
                rows.map((r) => ({
                  date: r.date,
                  span: r.span,
                  hours15x: r.ot.hours15x,
                  hours3x: r.ot.hours3x,
                  amount: r.ot.total,
                  note: r.done,
                })),
              )
            }
          >
            <Copy size={14} /> Copy
          </Button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-ink-900 text-paper font-display uppercase tracking-wider text-label">
            <tr>
              <th className="text-left px-4 py-2">วันที่</th>
              <th className="text-left px-4 py-2">เวลา</th>
              <th className="text-right px-4 py-2">1.5x</th>
              <th className="text-right px-4 py-2">3x</th>
              <th className="text-right px-4 py-2">เงิน</th>
              <th className="text-left px-4 py-2">สิ่งที่ทำ</th>
            </tr>
          </thead>
          <tbody className="font-mono">
            {rows.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-8 text-ink-500 font-body">
                  {settings ? 'ไม่มี OT ในช่วงนี้' : 'ตั้ง salary ที่ /settings ก่อน'}
                </td>
              </tr>
            )}
            {rows.map((r) => (
              <tr key={r.date} className={r.is_holiday ? 'bg-lemon-soft border-t border-cream-300' : 'border-t border-cream-300'}>
                <td className="px-4 py-2 font-bold">{formatThaiDate(r.date, 'EEE d MMM')}</td>
                <td className="px-4 py-2">{r.span}</td>
                <td className="px-4 py-2 text-right">{formatHours(r.ot.hours15x)}</td>
                <td className="px-4 py-2 text-right">{formatHours(r.ot.hours3x)}</td>
                <td className="px-4 py-2 text-right font-display font-bold text-tangerine">฿{formatMoney(r.ot.total)}</td>
                <td className="px-4 py-2 font-body text-xs text-ink-700 max-w-md truncate">{r.done || '—'}</td>
              </tr>
            ))}
            {rows.length > 0 && (
              <tr className="border-t-2 border-ink-900 bg-cream-50">
                <td className="px-4 py-3 font-display font-bold">รวม</td>
                <td></td>
                <td className="px-4 py-3 text-right font-display font-bold">{formatHours(total.h15)}</td>
                <td className="px-4 py-3 text-right font-display font-bold">{formatHours(total.h3)}</td>
                <td className="px-4 py-3 text-right font-display font-extrabold text-tangerine text-stat">
                  ฿{formatMoney(total.amt)}
                </td>
                <td></td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
