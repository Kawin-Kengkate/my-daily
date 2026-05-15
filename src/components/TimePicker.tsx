import { useState, useEffect, useRef } from 'react';
import * as Popover from '@radix-ui/react-popover';
import { Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
  value: string;
  onChange: (v: string) => void;
  error?: boolean;
  className?: string;
  minuteStep?: number;
}

const HOURS = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'));

export function TimePicker({ value, onChange, error, className, minuteStep = 5 }: Props) {
  const [open, setOpen] = useState(false);
  const [h, m] = (value || '08:00').split(':');
  const minutes = Array.from({ length: Math.ceil(60 / minuteStep) }, (_, i) =>
    String(i * minuteStep).padStart(2, '0'),
  );

  const hourRef = useRef<HTMLDivElement>(null);
  const minRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    requestAnimationFrame(() => {
      hourRef.current?.querySelector<HTMLElement>('[data-active="true"]')?.scrollIntoView({ block: 'center' });
      minRef.current?.querySelector<HTMLElement>('[data-active="true"]')?.scrollIntoView({ block: 'center' });
    });
  }, [open]);

  const setHour = (nh: string) => onChange(`${nh}:${m}`);
  const setMin = (nm: string) => onChange(`${h}:${nm}`);

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <button
          type="button"
          className={cn(
            'h-9 w-full px-2 flex items-center justify-between gap-1 bg-paper border-1.5 border-ink-900 rounded-field font-mono text-sm font-bold hover:bg-cream-100',
            error && 'border-rose ring-1 ring-rose',
            className,
          )}
        >
          <span>{value || '--:--'}</span>
          <Clock size={14} className="text-ink-500 shrink-0" />
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          align="start"
          sideOffset={6}
          className="z-50 bg-paper border-1.5 border-ink-900 rounded-card shadow-stamp-lg p-2 w-[180px]"
        >
          <div className="grid grid-cols-2 gap-2">
            <div>
              <div className="font-display font-bold text-label text-ink-500 uppercase text-center mb-1">ชม.</div>
              <div ref={hourRef} className="h-44 overflow-y-auto pr-0.5 flex flex-col gap-0.5 scroll-smooth">
                {HOURS.map((hh) => {
                  const active = hh === h;
                  return (
                    <button
                      key={hh}
                      type="button"
                      data-active={active}
                      onClick={() => setHour(hh)}
                      className={cn(
                        'h-7 rounded-field font-mono text-sm border-1.5 shrink-0',
                        active
                          ? 'bg-tangerine border-ink-900 font-bold'
                          : 'border-transparent hover:border-ink-900 hover:bg-cream-100',
                      )}
                    >
                      {hh}
                    </button>
                  );
                })}
              </div>
            </div>
            <div>
              <div className="font-display font-bold text-label text-ink-500 uppercase text-center mb-1">นาที</div>
              <div ref={minRef} className="h-44 overflow-y-auto pr-0.5 flex flex-col gap-0.5 scroll-smooth">
                {minutes.map((mm) => {
                  const active = mm === m;
                  return (
                    <button
                      key={mm}
                      type="button"
                      data-active={active}
                      onClick={() => setMin(mm)}
                      className={cn(
                        'h-7 rounded-field font-mono text-sm border-1.5 shrink-0',
                        active
                          ? 'bg-tangerine border-ink-900 font-bold'
                          : 'border-transparent hover:border-ink-900 hover:bg-cream-100',
                      )}
                    >
                      {mm}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="mt-2 pt-2 border-t border-cream-300 flex justify-end">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="font-mono text-xs text-ink-700 hover:text-ink-900 underline"
            >
              ตกลง
            </button>
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
