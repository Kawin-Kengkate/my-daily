import { cn } from '@/lib/utils';
import type { LocationKind } from '@/types/db';

interface LocationToggleProps {
  value: LocationKind;
  onChange: (v: LocationKind) => void;
  className?: string;
}

const LOCATION_CONFIG: Record<LocationKind, { label: string; activeClass: string }> = {
  onsite:   { label: 'Onsite',   activeClass: 'bg-mint border-ink-900 text-ink-900 shadow-stamp-sm' },
  wfh:      { label: 'WFH',      activeClass: 'bg-peri border-ink-900 text-paper shadow-stamp-sm' },
  leave:    { label: 'ลา',       activeClass: 'bg-rose border-ink-900 text-ink-900 shadow-stamp-sm' },
  training: { label: 'Training', activeClass: 'bg-tangerine border-ink-900 text-ink-900 shadow-stamp-sm' },
  holiday:  { label: 'Holiday',  activeClass: 'bg-lemon border-ink-900 text-ink-900 shadow-stamp-sm' },
};

const INACTIVE = 'bg-cream-50 border-ink-900 text-ink-700 hover:bg-cream-200';

export function LocationToggle({ value, onChange, className }: LocationToggleProps) {
  return (
    <div className={cn('flex flex-wrap gap-1.5', className)}>
      {(Object.entries(LOCATION_CONFIG) as [LocationKind, { label: string; activeClass: string }][]).map(
        ([loc, { label, activeClass }]) => (
          <button
            key={loc}
            type="button"
            onClick={() => onChange(loc)}
            className={cn(
              'h-8 px-3 rounded-field border-1.5 font-display font-bold text-[13px]',
              'transition-colors active:translate-x-[1px] active:translate-y-[1px] active:shadow-none',
              value === loc ? activeClass : INACTIVE,
            )}
          >
            {label}
          </button>
        ),
      )}
    </div>
  );
}
