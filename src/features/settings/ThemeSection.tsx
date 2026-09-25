import { Card } from '@/components/ui/card';
import { Sticker } from '@/components/Sticker';
import { cn } from '@/lib/utils';
import { THEMES, type ThemeId } from '@/lib/theme';
import { useTheme } from '@/hooks/useTheme';

/** หน้าต่างจิ๋วที่ render ด้วยสีของ theme นั้นจริงๆ (data-theme ซ้อน) */
function MiniPreview({ id }: { id: ThemeId }) {
  return (
    <div data-theme={id} className="rounded-[11px] bg-cream-100 text-ink-900 p-2.5 space-y-2">
      <div className="flex items-center gap-1.5 px-2 py-1.5 bg-paper border-1.5 border-ink-900 rounded-field shadow-stamp-sm">
        <span className="h-4 w-4 rounded-[5px] bg-tangerine text-on-tangerine border-1.5 border-ink-900 grid place-items-center font-display font-extrabold text-[9px] leading-none">
          M
        </span>
        <span className="h-1.5 w-10 rounded-full bg-ink-900" />
        <span className="h-1.5 w-6 rounded-full bg-ink-300" />
      </div>
      <div className="flex items-center gap-1">
        {(['bg-tangerine', 'bg-lemon', 'bg-mint', 'bg-peri', 'bg-rose'] as const).map((bg) => (
          <span key={bg} className={cn('h-4 flex-1 rounded-chip border-1.5 border-ink-900', bg)} />
        ))}
      </div>
      <div className="flex items-center gap-1.5">
        <span className="px-2 py-0.5 rounded-button border-1.5 border-ink-900 bg-ink-900 text-paper shadow-stamp-lemon font-display font-bold text-[10px]">
          Save
        </span>
        <span className="px-2 py-0.5 rounded-full border-1.5 border-ink-900 bg-peri text-on-peri shadow-stamp-sm font-display font-bold text-[10px]">
          WFH
        </span>
        <span className="ml-auto font-display font-extrabold text-sm text-tangerine">฿1,250</span>
      </div>
    </div>
  );
}

export function ThemeSection() {
  const { theme, setTheme } = useTheme();

  return (
    <Card className="p-5 space-y-4">
      <div>
        <h3 className="font-display font-bold text-h4">🎨 Theme</h3>
        <p className="font-body text-sm text-ink-500 mt-0.5">เปลี่ยนได้ทันที · จำไว้ในเครื่องนี้ · กดปุ่ม palette บน header ก็ได้</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {THEMES.map((t) => {
          const active = t.id === theme;
          return (
            <button
              key={t.id}
              type="button"
              onClick={(e) => setTheme(t.id, e.currentTarget)}
              aria-pressed={active}
              className={cn(
                'relative text-left p-1.5 rounded-card-lg border-1.5 border-ink-900 btn-press',
                active ? 'bg-lemon text-on-lemon shadow-stamp' : 'bg-paper shadow-stamp-sm hover:-translate-y-0.5 hover:shadow-stamp',
              )}
            >
              <MiniPreview id={t.id} />
              <div className="px-1.5 pt-2 pb-1">
                <div className="font-display font-bold text-sm">
                  {t.emoji} {t.label}
                </div>
                <div className={cn('font-body text-xs mt-0.5', active ? 'text-on-lemon' : 'text-ink-500')}>{t.blurb}</div>
              </div>
              {active && (
                <Sticker color="tangerine" rotate={6} className="absolute -top-2.5 -right-2 text-[11px] px-2 py-0.5">
                  ใช้อยู่ ✓
                </Sticker>
              )}
            </button>
          );
        })}
      </div>
    </Card>
  );
}
