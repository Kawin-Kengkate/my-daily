import { Pencil } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sticker } from '@/components/Sticker';
import { Pill } from '@/components/Pill';
import { ProjectCode } from '@/components/ProjectCode';
import { formatMoney, formatHours } from '@/lib/format';
import { calcWorkHours, parseHHMM } from '@/lib/ot';
import { useProjects } from '@/hooks/useProjects';
import type { DayWithEntries, LocationKind, Project } from '@/types/db';
import type { DayInfo } from '@/lib/calendar';

const LOCATION_LABEL: Record<LocationKind, { label: string; color: 'mint' | 'peri' | 'rose' | 'tangerine' | 'lemon' }> = {
  onsite:   { label: 'Onsite',   color: 'mint' },
  wfh:      { label: 'WFH',      color: 'peri' },
  leave:    { label: 'ลา',       color: 'rose' },
  training: { label: 'Training', color: 'tangerine' },
  holiday:  { label: 'Holiday',  color: 'lemon' },
};

function entryHours(start: string, end: string): number {
  const s = parseHHMM(start);
  const e = parseHHMM(end);
  return Math.max(0, e - s) / 60;
}

interface Props {
  day: DayWithEntries;
  dayInfo: DayInfo;
  otTotal: number | null;
  breakMinutes: number;
  onEdit: () => void;
}

export function EntryReadView({ day, dayInfo, otTotal, breakMinutes, onEdit }: Props) {
  const { data: projects = [] } = useProjects();
  const projectMap = new Map<string, Project>(projects.map((p) => [p.id, p]));

  const locConf = LOCATION_LABEL[day.location];
  const entries = day.entries ?? [];
  const isLeave = day.location === 'leave';
  const isHoliday = day.is_holiday || day.location === 'holiday';

  const totalHours = calcWorkHours(
    entries.map((e) => ({ start_time: e.start_time.slice(0, 5), end_time: e.end_time.slice(0, 5) })),
    breakMinutes,
    isHoliday,
    day.location,
  );
  const holidayLabel = dayInfo.label;

  return (
    <Card className="bg-cream-50 border-1.5 border-ink-900 shadow-stamp">
      {/* Header: location sticker + edit button */}
      <div className="p-4 sm:p-5 flex items-start justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <Sticker color={locConf.color} rotate={-2}>{locConf.label}</Sticker>
          {day.is_holiday && day.location !== 'holiday' && (
            <Sticker color="lemon" rotate={2}>
              {holidayLabel ? `🎉 ${holidayLabel}` : 'is holiday'}
            </Sticker>
          )}
        </div>
        <Button variant="paper" size="sm" onClick={onEdit}>
          <Pencil size={14} /> Edit
        </Button>
      </div>

      {day.note && (
        <div className="px-4 sm:px-5 pb-3">
          <div className="bg-paper border-1.5 border-ink-900 rounded-field px-3 py-2 font-body text-sm text-ink-900">
            <span className="font-display font-bold text-label text-ink-500 uppercase mr-2">Note</span>
            {day.note}
          </div>
        </div>
      )}

      {/* Skip cases: leave / holiday with no entries */}
      {(isLeave || (isHoliday && entries.length === 0)) ? (
        <div className="px-4 sm:px-5 pb-5 pt-1">
          <p className="font-body text-sm text-ink-500">
            {isLeave ? 'วันลา — ไม่มี entry' : 'วันหยุด — ไม่มี entry'}
          </p>
        </div>
      ) : entries.length === 0 ? (
        <div className="px-4 sm:px-5 pb-5 pt-1">
          <p className="font-body text-sm text-ink-500">ไม่มี entry บันทึกไว้</p>
        </div>
      ) : (
        <div className="border-t-1.5 border-ink-900">
          <ul>
            {entries.map((e) => {
              const project = projectMap.get(e.project_id);
              const start = e.start_time.slice(0, 5);
              const end = e.end_time.slice(0, 5);
              const hrs = entryHours(start, end);
              return (
                <li key={e.id} className="p-4 sm:p-5 border-b-1.5 border-dashed border-ink-300 last:border-b-0">
                  <div className="flex items-start gap-3">
                    {/* Time rail */}
                    <div className="shrink-0 flex flex-col items-center pt-0.5">
                      <span className="font-mono font-bold text-sm text-ink-900 leading-tight">{start}</span>
                      <span className="text-ink-300 text-xs leading-tight">│</span>
                      <span className="font-mono font-bold text-sm text-ink-900 leading-tight">{end}</span>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 space-y-1.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        {project ? (
                          <ProjectCode code={project.code} hexColor={project.color} />
                        ) : (
                          <span className="font-mono text-xs text-ink-500">(project ถูกลบ)</span>
                        )}
                        {project?.name && (
                          <span className="font-body text-sm text-ink-700 truncate">{project.name}</span>
                        )}
                        <Pill className="bg-mint-soft text-ink-900 border border-ink-900">
                          {e.progress}
                        </Pill>
                        <span className="ml-auto font-mono text-xs text-ink-500">{formatHours(hrs)}</span>
                      </div>

                      {(e.done_note || e.next_note) && (
                        <div className="space-y-1 pt-1">
                          {e.done_note && (
                            <div className="flex gap-2 font-body text-sm">
                              <span className="text-mint shrink-0">✓ เสร็จ:</span>
                              <span className="text-ink-900">{e.done_note}</span>
                            </div>
                          )}
                          {e.next_note && (
                            <div className="flex gap-2 font-body text-sm">
                              <span className="text-peri shrink-0">→ ต่อ:</span>
                              <span className="text-ink-900">{e.next_note}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>

          {/* Footer: totals */}
          <div className="border-t-1.5 border-ink-900 px-4 sm:px-5 py-3 flex items-center justify-between flex-wrap gap-2 bg-paper rounded-b-card">
            <div className="flex items-center gap-2 font-body text-sm">
              <span className="text-ink-500">รวม</span>
              <span className="font-display font-bold text-h4 text-ink-900">{totalHours.toFixed(totalHours % 1 === 0 ? 0 : 1)} ชม.</span>
            </div>
            {otTotal !== null && otTotal > 0 && (
              <div className="flex items-center gap-2 font-body text-sm">
                <span className="text-ink-500">OT</span>
                <span className="font-display font-bold text-h4 text-tangerine">฿{formatMoney(otTotal)}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </Card>
  );
}
