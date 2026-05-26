import { useMemo } from 'react';
import { cn } from '@/lib/utils';
import { buildHeatmap, type HeatmapCell } from '@/lib/learning';
import type { LearningSession } from '@/types/db';
import { formatThaiDate } from '@/lib/date';

const intensityClass: Record<HeatmapCell['intensity'], string> = {
  0: 'bg-paper',
  1: 'bg-peri/20',
  2: 'bg-peri/50',
  3: 'bg-peri',
};

const DOW = ['จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส', 'อา'];

export function LearningHeatmap({ sessions }: { sessions: LearningSession[] }) {
  const cells = useMemo(() => buildHeatmap(sessions, 91), [sessions]);

  // Pad cells เพื่อให้เริ่มที่จันทร์พอดี (ISO DOW)
  const firstDate = new Date(cells[0].date + 'T00:00:00');
  // ISO day 1=Mon, getDay() 0=Sun → แปลง
  const firstDow = firstDate.getDay() === 0 ? 7 : firstDate.getDay(); // 1=Mon, 7=Sun
  const padBefore = firstDow - 1; // จำนวน cell ว่างก่อน cell แรก (ISO เริ่ม Mon)

  return (
    <div>
      {/* Header DOW */}
      <div className="grid grid-cols-7 gap-1 mb-1">
        {DOW.map((d) => (
          <div key={d} className="text-center font-mono text-[10px] text-ink-500 uppercase">{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {/* Padding cells */}
        {Array.from({ length: padBefore }).map((_, i) => (
          <div key={`pad-${i}`} />
        ))}
        {cells.map((cell) => (
          <div
            key={cell.date}
            title={`${formatThaiDate(cell.date, 'd MMM')}${cell.durationMin > 0 ? ` — ${cell.durationMin} นาที` : ''}`}
            className={cn(
              'aspect-square rounded-[3px] border-1.5 border-ink-900/30 transition-colors',
              intensityClass[cell.intensity],
              cell.intensity > 0 && 'border-ink-900/60',
            )}
          />
        ))}
      </div>
      <div className="mt-2 flex items-center gap-2 justify-end">
        <span className="font-mono text-[10px] text-ink-500">น้อย</span>
        {([0, 1, 2, 3] as const).map((lvl) => (
          <div key={lvl} className={cn('h-3 w-3 rounded-[2px] border-1.5 border-ink-900/40', intensityClass[lvl])} />
        ))}
        <span className="font-mono text-[10px] text-ink-500">มาก</span>
      </div>
    </div>
  );
}
