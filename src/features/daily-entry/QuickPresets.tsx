import { Button } from '@/components/ui/button';

export interface PresetBlock {
  label: string;
  start_time: string;
  end_time: string;
}

const PRESETS: PresetBlock[] = [
  { label: 'Day 08:00-16:40', start_time: '08:00', end_time: '16:40' },
  { label: 'OT 17:00-20:00', start_time: '17:00', end_time: '20:00' },
  { label: 'OT 17:00-22:00', start_time: '17:00', end_time: '22:00' },
  { label: 'Holiday 08:00-17:00', start_time: '08:00', end_time: '17:00' },
];

export function QuickPresets({ onPick }: { onPick: (p: PresetBlock) => void }) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="font-display font-bold text-label text-ink-500 uppercase">Quick:</span>
      {PRESETS.map((p) => (
        <Button key={p.label} variant="paper" size="sm" onClick={() => onPick(p)}>
          {p.label}
        </Button>
      ))}
    </div>
  );
}
