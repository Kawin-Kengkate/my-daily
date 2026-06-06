import { cn } from '@/lib/utils';
import { todayISO } from '@/lib/date';
import { ProjectCode } from '@/components/ProjectCode';
import { Pill } from '@/components/Pill';
import type { Project } from '@/types/db';
import {
  type GanttScale,
  type GanttWindow,
  type ProjectTimelineData,
  deriveProjectTimeline,
  getGanttWindow,
  dateToPercent,
  clampPct,
  buildAxisColumns,
} from '@/lib/timeline';

// hex → rgba ให้ background มี alpha แต่ border ยังทึบ
function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// opacity ตาม endPhaseIndex: 1=Dev 2=UAT 3=Go-live
const BAR_ALPHA: Record<number, number> = { 1: 0.45, 2: 0.68, 3: 1 };

const SCALE_LABEL: Record<GanttScale, string> = { month: '1M', quarter: '4M', year: '1Y' };

interface GanttChartProps {
  projects: Project[];
  scale: GanttScale;
  onScaleChange: (s: GanttScale) => void;
}

export function GanttChart({ projects, scale, onScaleChange }: GanttChartProps) {
  const today = todayISO();
  const win   = getGanttWindow(today, scale);
  const cols  = buildAxisColumns(win, scale);
  const todayPct = clampPct(dateToPercent(today, win));

  const rows = [...projects]
    .map((p) => ({ project: p, data: deriveProjectTimeline(p, today) }))
    .sort((a, b) => {
      const da = a.data.nextMilestone?.daysLeft ?? Infinity;
      const db = b.data.nextMilestone?.daysLeft ?? Infinity;
      return da - db;
    });

  return (
    <div className="border-1.5 border-ink-900 rounded-card shadow-stamp overflow-hidden">
      {/* Scale controls */}
      <div className="flex items-center justify-between gap-3 px-4 py-2 bg-cream-50 border-b border-cream-200">
        <span className="font-mono text-xs text-ink-500 uppercase tracking-wider">Timeline</span>
        <div className="flex items-center gap-1">
          {(['month', 'quarter', 'year'] as GanttScale[]).map((s) => (
            <button
              key={s}
              onClick={() => onScaleChange(s)}
              className={cn(
                'px-2.5 py-1 rounded-button font-mono text-xs border-1.5 border-ink-900 transition-colors',
                s === scale
                  ? 'bg-ink-900 text-paper'
                  : 'bg-paper text-ink-700 hover:bg-cream-100 shadow-stamp-sm active:translate-x-px active:translate-y-px active:shadow-none',
              )}
            >
              {SCALE_LABEL[s]}
            </button>
          ))}
        </div>
      </div>

      {/* Scrollable chart */}
      <div className="overflow-x-auto">
        <div style={{ minWidth: '680px' }}>

          {/* Axis header */}
          <div className="flex bg-ink-900">
            <div className="w-44 shrink-0 sticky left-0 bg-ink-900 z-30 flex items-center px-3 py-2 border-r border-ink-700">
              <span className="font-display font-bold text-[11px] text-paper/60 uppercase tracking-wider">
                Project
              </span>
            </div>
            <div className="flex-1 relative h-9">
              {cols.map((col) => (
                <div
                  key={col.key}
                  className="absolute top-0 bottom-0 flex items-center border-l border-ink-700 pl-1.5 overflow-hidden"
                  style={{ left: `${col.leftPct}%`, width: `${col.widthPct}%` }}
                >
                  <span className="font-mono text-[11px] text-paper/70 whitespace-nowrap">{col.label}</span>
                </div>
              ))}
              {/* Today marker in header */}
              <div
                className="absolute top-0 bottom-0 w-0.5 bg-tangerine z-10"
                style={{ left: `${todayPct}%` }}
              >
                <span className="absolute -top-0 left-1 font-mono text-[9px] text-tangerine whitespace-nowrap leading-none">
                  วันนี้
                </span>
              </div>
            </div>
          </div>

          {/* Rows */}
          {rows.length === 0 && (
            <div className="py-10 text-center font-body text-sm text-ink-500">
              ยังไม่มีโปรเจค
            </div>
          )}
          {rows.map(({ project: p, data }) => (
            <GanttRow key={p.id} project={p} data={data} win={win} todayPct={todayPct} />
          ))}

        </div>
      </div>
    </div>
  );
}

// ─── Row ────────────────────────────────────────────────────────────────────

interface GanttRowProps {
  project: Project;
  data: ProjectTimelineData;
  win: GanttWindow;
  todayPct: number;
}

function GanttRow({ project: p, data, win, todayPct }: GanttRowProps) {
  return (
    <div className="flex border-b border-cream-300 group">

      {/* Sticky label column */}
      <div className="w-44 shrink-0 sticky left-0 bg-paper group-hover:bg-cream-50 z-10 px-3 py-2.5 flex flex-col gap-1 border-r border-cream-200 transition-colors">
        <div className="flex items-center gap-1.5 min-w-0">
          <span
            className="h-2 w-2 rounded-full border-1.5 border-ink-900 shrink-0"
            style={{ background: p.color }}
          />
          <ProjectCode code={p.code} />
        </div>
        <span className="font-body text-xs text-ink-700 truncate leading-tight">{p.name}</span>

        {data.upcomingCountdowns.length > 0 ? (
          <div className="flex flex-wrap gap-1">
            {data.upcomingCountdowns.map((c) => (
              <Pill
                key={c.label}
                className={cn(
                  'text-[10px] py-0 px-1.5 border-1.5 border-ink-900 leading-5 font-mono',
                  c.label === 'Go-live'
                    ? 'bg-tangerine/20 text-ink-900 font-bold'
                    : 'bg-cream-200 text-ink-700',
                )}
              >
                {c.label} {c.daysLeft}d
              </Pill>
            ))}
          </div>
        ) : data.hasDates ? (
          <span className="text-[10px] font-mono text-ink-400">ผ่านมาหมดแล้ว</span>
        ) : null}
      </div>

      {/* Track area */}
      <div className="flex-1 relative h-16">

        {/* Grid lines (column boundaries) — subtle */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="w-full h-full border-b border-cream-200" />
        </div>

        {/* Today line */}
        <div
          className="absolute top-0 bottom-0 w-px bg-ink-900/20 pointer-events-none z-10"
          style={{ left: `${todayPct}%` }}
        />

        {/* Bars */}
        {data.bars.map((bar, i) => {
          const l = clampPct(dateToPercent(bar.start, win));
          const r = clampPct(dateToPercent(bar.end, win));
          const w = r - l;
          if (w <= 0) return null;
          const alpha = BAR_ALPHA[bar.endPhaseIndex] ?? 1;
          return (
            <div
              key={i}
              title={`${bar.label}: ${bar.start} → ${bar.end}`}
              className="absolute top-1/2 -translate-y-1/2 h-5 rounded-sm border-1.5 border-ink-900 flex items-center px-1.5 overflow-hidden"
              style={{
                left:       `${l}%`,
                width:      `${w}%`,
                background: hexToRgba(p.color, alpha),
              }}
            >
              {w > 7 && (
                <span className="font-display font-bold text-[10px] text-ink-900 truncate">
                  {bar.label}
                </span>
              )}
            </div>
          );
        })}

        {/* Milestone markers */}
        {data.milestones.map((m) => {
          const pct = dateToPercent(m.date, win);
          if (pct < -3 || pct > 103) return null;
          return (
            <div
              key={m.label}
              title={`${m.label}: ${m.date}`}
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-20 pointer-events-none"
              style={{ left: `${pct}%` }}
            >
              {m.isGolive ? (
                <div className="h-3.5 w-3.5 rotate-45 bg-tangerine border-1.5 border-ink-900" />
              ) : (
                <div
                  className={cn(
                    'h-3 w-3 rotate-45 border-1.5 border-ink-900',
                    m.isPast && 'opacity-40',
                  )}
                  style={{ background: m.isPast ? '#999' : p.color }}
                />
              )}
            </div>
          );
        })}

      </div>
    </div>
  );
}
