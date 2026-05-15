import { useState } from 'react';
import * as Popover from '@radix-ui/react-popover';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProgressPickerProps {
  value: string;
  onChange: (v: string) => void;
  error?: boolean;
  className?: string;
}

const PERCENTS = ['0%', '10%', '20%', '30%', '40%', '50%', '60%', '70%', '80%', '90%', '100%'];

export function ProgressPicker({ value, onChange, error, className }: ProgressPickerProps) {
  const [open, setOpen] = useState(false);

  const handleSelect = (v: string) => {
    onChange(v);
    setOpen(false);
  };

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <button
          type="button"
          className={cn(
            'h-9 w-full px-2 flex items-center justify-between gap-1',
            'bg-paper border-1.5 border-ink-900 rounded-field font-mono text-sm font-bold',
            'hover:bg-cream-100 transition-colors',
            error && 'border-rose ring-1 ring-rose',
            className,
          )}
        >
          <span className={value === 'complete' ? 'text-mint' : 'text-ink-900'}>{value}</span>
          <ChevronDown size={14} className="text-ink-500 shrink-0" />
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          align="start"
          sideOffset={6}
          collisionPadding={8}
          className="z-50 bg-paper border-1.5 border-ink-900 rounded-card shadow-stamp-lg p-2 w-[220px]"
        >
          <div className="grid grid-cols-3 gap-1.5 mb-1.5">
            {PERCENTS.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => handleSelect(p)}
                className={cn(
                  'h-8 rounded-field font-mono text-sm border-1.5 transition-all',
                  'active:translate-x-[1px] active:translate-y-[1px] active:shadow-none',
                  value === p
                    ? 'bg-tangerine border-ink-900 font-bold shadow-stamp-sm'
                    : 'border-transparent hover:border-ink-900 hover:bg-cream-100',
                )}
              >
                {p}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => handleSelect('complete')}
            className={cn(
              'w-full h-8 rounded-field font-mono text-sm border-1.5 transition-all',
              'active:translate-x-[1px] active:translate-y-[1px] active:shadow-none',
              value === 'complete'
                ? 'bg-mint border-ink-900 font-bold text-ink-900 shadow-stamp-sm'
                : 'border-transparent hover:border-ink-900 hover:bg-cream-100',
            )}
          >
            complete ✓
          </button>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
