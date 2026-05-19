import { useState, useEffect, useMemo, useRef } from 'react';
import * as Popover from '@radix-ui/react-popover';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Project } from '@/types/db';

interface ProjectPickerProps {
  value: string;
  onChange: (projectId: string) => void;
  projects: Project[];
  error?: boolean;
  className?: string;
  placeholder?: string;
}

export function ProjectPicker({
  value,
  onChange,
  projects,
  error,
  className,
  placeholder = '-- เลือกโปรเจค --',
}: ProjectPickerProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const selected = useMemo(() => projects.find((p) => p.id === value), [projects, value]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return projects;
    return projects.filter(
      (p) => p.code.toLowerCase().includes(q) || p.name.toLowerCase().includes(q),
    );
  }, [projects, query]);

  useEffect(() => {
    if (open) {
      setQuery('');
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  const handleSelect = (id: string) => {
    onChange(id);
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
          {selected ? (
            <span className="flex items-center gap-1.5 min-w-0 overflow-hidden">
              <code
                className="shrink-0 px-1.5 py-0.5 rounded border border-ink-900 font-mono font-bold text-[11px] text-ink-900 leading-none"
                style={{ backgroundColor: selected.color + '30' }}
              >
                {selected.code}
              </code>
              <span className="truncate font-body text-ink-900 text-sm">{selected.name}</span>
            </span>
          ) : (
            <span className="font-body font-normal text-sm text-ink-300">{placeholder}</span>
          )}
          <ChevronDown size={14} className="text-ink-500 shrink-0 ml-1" />
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          side="bottom"
          align="start"
          sideOffset={6}
          avoidCollisions={false}
          className="z-50 bg-paper border-1.5 border-ink-900 rounded-card shadow-stamp-lg p-2 w-[280px] flex flex-col"
          style={{
            // จำกัด max-height ตามพื้นที่ที่เหลือใน viewport (ไม่ flip ขึ้นบน)
            maxHeight: 'min(320px, var(--radix-popover-content-available-height, 320px))',
          }}
        >
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="ค้นหา code หรือชื่อ…"
            className={cn(
              'w-full h-8 px-2 mb-2 bg-cream-50 border-1.5 border-ink-900 rounded-field shrink-0',
              'font-body text-sm outline-none placeholder:text-ink-300',
              'focus-visible:ring-2 focus-visible:ring-tangerine focus-visible:ring-offset-1',
            )}
          />

          <div className="flex-1 min-h-0 overflow-y-auto flex flex-col gap-0.5">
            {!query && (
              <button
                type="button"
                onClick={() => handleSelect('')}
                className={cn(
                  'h-8 w-full px-2 text-left rounded-field border-1.5 font-body text-sm transition-all',
                  !value
                    ? 'bg-cream-200 border-ink-900 font-bold text-ink-700'
                    : 'border-transparent hover:border-ink-900 hover:bg-cream-100 text-ink-400',
                )}
              >
                — ไม่มีโปรเจค —
              </button>
            )}

            {filtered.length === 0 && (
              <p className="px-2 py-4 text-center font-body text-sm text-ink-500">ไม่พบโปรเจค</p>
            )}

            {filtered.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => handleSelect(p.id)}
                className={cn(
                  'h-9 w-full px-2 flex items-center gap-2 rounded-field border-1.5 transition-all text-left',
                  'active:translate-x-[1px] active:translate-y-[1px] active:shadow-none',
                  value === p.id
                    ? 'bg-tangerine border-ink-900 shadow-stamp-sm'
                    : 'border-transparent hover:border-ink-900 hover:bg-cream-100',
                )}
              >
                <code
                  className="shrink-0 px-1.5 py-0.5 rounded border border-ink-900 font-mono font-bold text-[11px] text-ink-900 leading-none"
                  style={{ backgroundColor: p.color + '30' }}
                >
                  {p.code}
                </code>
                <span className="truncate font-body text-sm text-ink-900">{p.name}</span>
              </button>
            ))}
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
