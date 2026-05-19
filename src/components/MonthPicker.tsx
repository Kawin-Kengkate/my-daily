import { useState } from 'react';
import * as Popover from '@radix-ui/react-popover';
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
  value: string;
  onChange: (yyyymm: string) => void;
  className?: string;
}

const MONTHS_TH = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];

export function MonthPicker({ value, onChange, className }: Props) {
  const [open, setOpen] = useState(false);
  const [y, m] = value.split('-').map(Number);
  const [viewYear, setViewYear] = useState(y);

  return (
    <Popover.Root open={open} onOpenChange={(o) => { setOpen(o); if (o) setViewYear(y); }}>
      <Popover.Trigger asChild>
        <button
          type="button"
          className={cn(
            'h-10 px-3 flex items-center gap-2 bg-paper border-1.5 border-ink-900 rounded-field shadow-stamp-sm font-body font-semibold hover:bg-cream-100',
            className,
          )}
        >
          <span>{MONTHS_TH[m - 1]} {y}</span>
          <ChevronDown size={14} className="text-ink-500" />
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          align="start"
          sideOffset={6}
          className="z-50 bg-paper border-1.5 border-ink-900 rounded-card shadow-stamp-lg p-3 w-[260px]"
        >
          <div className="flex items-center justify-between mb-3">
            <button
              type="button"
              onClick={() => setViewYear(viewYear - 1)}
              className="h-7 w-7 flex items-center justify-center border-1.5 border-ink-900 rounded-field bg-cream-50 hover:bg-cream-200"
            >
              <ChevronLeft size={14} />
            </button>
            <div className="font-display font-bold text-sm">{viewYear}</div>
            <button
              type="button"
              onClick={() => setViewYear(viewYear + 1)}
              className="h-7 w-7 flex items-center justify-center border-1.5 border-ink-900 rounded-field bg-cream-50 hover:bg-cream-200"
            >
              <ChevronRight size={14} />
            </button>
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            {MONTHS_TH.map((label, i) => {
              const isSel = viewYear === y && i + 1 === m;
              return (
                <button
                  key={label}
                  type="button"
                  onClick={() => {
                    const mm = String(i + 1).padStart(2, '0');
                    onChange(`${viewYear}-${mm}`);
                    setOpen(false);
                  }}
                  className={cn(
                    'h-9 rounded-field font-body text-sm border-1.5 transition-all',
                    isSel
                      ? 'bg-tangerine border-ink-900 font-bold shadow-stamp-sm'
                      : 'border-transparent hover:border-ink-900 hover:bg-cream-100',
                  )}
                >
                  {label}
                </button>
              );
            })}
          </div>
          <div className="mt-3 pt-2 border-t border-cream-300 flex justify-between">
            <button
              type="button"
              onClick={() => {
                const now = new Date();
                const mm = String(now.getMonth() + 1).padStart(2, '0');
                onChange(`${now.getFullYear()}-${mm}`);
                setOpen(false);
              }}
              className="font-body text-sm text-ink-700 hover:text-ink-900 underline"
            >
              เดือนนี้
            </button>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="font-body text-sm text-ink-500 hover:text-ink-900"
            >
              ปิด
            </button>
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
