import { useMemo } from 'react';
import { cn } from '@/lib/utils';
import { buildHeatmap, type HeatmapCell } from '@/lib/learning';
import type { LearningSession } from '@/types/db';
import { formatThaiDate } from '@/lib/date';

const intensityClass: Record<HeatmapCell['intensity'], string> = {
  0: 'bg-cream-100',
  1: 'bg-peri/25',
  2: 'bg-peri/60',
  3: 'bg-peri',
};

// แสดงทุกแถว: Mon Tue Wed Thu Fri Sat Sun แต่ label เฉพาะ Mon/Wed/Fri (GitHub-style)
const DOW = ['', 'อ', '', 'พฤ', '', 'ส', ''];

export function LearningHeatmap({ sessions }: { sessions: LearningSession[] }) {
  const cells = useMemo(() => buildHeatmap(sessions, 91), [sessions]);

  // first cell ISO weekday — pad ก่อนถ้าไม่เริ่มที่จันทร์
  const firstDate = new Date(cells[0].date + 'T00:00:00');
  const firstDow = firstDate.getDay() === 0 ? 7 : firstDate.getDay();
  const padBefore = firstDow - 1;

  // month labels: เก็บ index ของ cell แรกของแต่ละเดือน
  const monthLabels = useMemo(() => {
    const map = new Map<number, string>(); // weekIndex → label
    let lastMonth = -1;
    cells.forEach((cell, i) => {
      const d = new Date(cell.date + 'T00:00:00');
      const m = d.getMonth();
      if (m !== lastMonth) {
        const weekIdx = Math.floor((i + padBefore) / 7);
        if (!map.has(weekIdx)) {
          map.set(weekIdx, d.toLocaleDateString('th-TH', { month: 'short' }));
        }
        lastMonth = m;
      }
    });
    return map;
  }, [cells, padBefore]);

  const totalCells = padBefore + cells.length;
  const weeks = Math.ceil(totalCells / 7);

  const cellSize = 12; // px
  const cellGap = 3;

  return (
    <div className="overflow-x-auto -mx-1 px-1">
      <div className="inline-flex flex-col gap-1">
        {/* Month label row */}
        <div
          className="grid pl-6"
          style={{
            gridTemplateColumns: `repeat(${weeks}, ${cellSize}px)`,
            columnGap: cellGap,
          }}
        >
          {Array.from({ length: weeks }).map((_, w) => (
            <div key={w} className="font-mono text-[9px] text-ink-500 uppercase h-3 leading-3 whitespace-nowrap">
              {monthLabels.get(w) ?? ''}
            </div>
          ))}
        </div>

        <div className="flex gap-1">
          {/* DOW labels (left column) */}
          <div
            className="grid grid-rows-7 w-5"
            style={{ rowGap: cellGap }}
          >
            {DOW.map((d, i) => (
              <div
                key={i}
                className="font-mono text-[9px] text-ink-500 flex items-center justify-end pr-0.5 leading-none"
                style={{ height: cellSize }}
              >
                {d}
              </div>
            ))}
          </div>

          {/* Heatmap cells — flow column-by-column (7 rows × N weeks) */}
          <div
            className="grid grid-rows-7 grid-flow-col"
            style={{
              gridTemplateColumns: `repeat(${weeks}, ${cellSize}px)`,
              gap: cellGap,
            }}
          >
            {Array.from({ length: padBefore }).map((_, i) => (
              <div key={`pad-${i}`} style={{ width: cellSize, height: cellSize }} />
            ))}
            {cells.map((cell) => (
              <div
                key={cell.date}
                title={`${formatThaiDate(cell.date, 'd MMM')}${cell.durationMin > 0 ? ` — ${cell.durationMin} นาที` : ''}`}
                style={{ width: cellSize, height: cellSize }}
                className={cn(
                  'rounded-[2px] border border-ink-900/15 transition-colors hover:border-ink-900',
                  intensityClass[cell.intensity],
                  cell.intensity > 0 && 'border-ink-900/40',
                )}
              />
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="mt-1 flex items-center gap-1.5 justify-end pl-6">
          <span className="font-mono text-[9px] text-ink-500">น้อย</span>
          {([0, 1, 2, 3] as const).map((lvl) => (
            <div
              key={lvl}
              className={cn(
                'h-2.5 w-2.5 rounded-[2px] border border-ink-900/25',
                intensityClass[lvl],
              )}
            />
          ))}
          <span className="font-mono text-[9px] text-ink-500">มาก</span>
        </div>
      </div>
    </div>
  );
}
