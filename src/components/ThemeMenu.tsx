import * as Popover from '@radix-ui/react-popover';
import { Check, Palette } from 'lucide-react';
import { cn } from '@/lib/utils';
import { THEMES } from '@/lib/theme';
import { useTheme } from '@/hooks/useTheme';
import { ThemeDots } from '@/components/ThemeDots';

/** ปุ่ม palette บน header — สลับ theme ได้ทุกหน้า */
export function ThemeMenu() {
  const { theme, setTheme } = useTheme();

  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button
          type="button"
          aria-label="เปลี่ยนธีมสี"
          title="เปลี่ยนธีมสี"
          className="p-2 rounded-button hover:bg-cream-100 data-[state=open]:bg-cream-200 transition-colors inline-flex"
        >
          <Palette size={16} />
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          align="end"
          sideOffset={8}
          collisionPadding={8}
          className="z-50 w-[248px] bg-paper border-1.5 border-ink-900 rounded-card shadow-stamp-lg p-2"
        >
          <div className="px-1.5 pb-1.5 font-display font-bold text-label text-ink-500 uppercase">Theme</div>
          <div className="flex flex-col gap-1">
            {THEMES.map((t) => {
              const active = t.id === theme;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={(e) => setTheme(t.id, e.currentTarget)}
                  aria-pressed={active}
                  className={cn(
                    'w-full flex items-center gap-2.5 px-2 py-1.5 rounded-field border-1.5 text-left transition-colors',
                    active ? 'bg-cream-100 border-ink-900 shadow-stamp-sm' : 'border-transparent hover:bg-cream-100',
                  )}
                >
                  <ThemeDots theme={t.id} />
                  <span className="flex-1 font-display font-semibold text-sm leading-tight">
                    {t.emoji} {t.label}
                  </span>
                  {active && <Check size={14} className="shrink-0" />}
                </button>
              );
            })}
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
