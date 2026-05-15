import { useState } from 'react';
import { Settings2, X, Plus, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSettings, useSaveSettings } from '@/hooks/useSettings';
import type { QuickPreset } from '@/types/db';

export type PresetBlock = QuickPreset;

const DEFAULT_PRESETS: QuickPreset[] = [
  { label: '08:00-16:40', start_time: '08:00', end_time: '16:40' },
  { label: '17:00-20:00', start_time: '17:00', end_time: '20:00' },
  { label: '17:00-22:00', start_time: '17:00', end_time: '22:00' },
  { label: '08:00-17:00', start_time: '08:00', end_time: '17:00' },
];

export function QuickPresets({ onPick }: { onPick: (p: PresetBlock) => void }) {
  const { data: settings } = useSettings();
  const save = useSaveSettings();
  const [editing, setEditing] = useState(false);
  const [adding, setAdding] = useState(false);
  const [newStart, setNewStart] = useState('08:00');
  const [newEnd, setNewEnd] = useState('17:00');

  const presets: QuickPreset[] = settings?.quick_presets ?? DEFAULT_PRESETS;

  const updatePresets = (next: QuickPreset[]) => save.mutate({ quick_presets: next });

  const handleRemove = (idx: number) => updatePresets(presets.filter((_, i) => i !== idx));

  const handleAdd = () => {
    if (!newStart || !newEnd) return;
    updatePresets([...presets, { label: `${newStart}-${newEnd}`, start_time: newStart, end_time: newEnd }]);
    setAdding(false);
    setNewStart('08:00');
    setNewEnd('17:00');
  };

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="font-display font-bold text-label text-ink-500 uppercase">Quick:</span>

      {presets.map((p, idx) => (
        <div key={idx} className="flex items-center gap-0.5">
          <button
            className="px-2.5 py-1 bg-paper border-1.5 border-ink-900 rounded-button font-mono text-xs font-bold shadow-stamp-sm btn-press hover:bg-cream-50 transition-all"
            onClick={() => { onPick(p); if (editing) setEditing(false); }}
          >
            {p.label}
          </button>
          {editing && (
            <button
              onClick={() => handleRemove(idx)}
              className="h-5 w-5 flex items-center justify-center text-ink-500 hover:text-rose transition-colors"
              title="ลบ preset นี้"
            >
              <X size={12} />
            </button>
          )}
        </div>
      ))}

      {editing && !adding && (
        <button
          onClick={() => setAdding(true)}
          className="h-7 w-7 flex items-center justify-center bg-lemon border-1.5 border-ink-900 rounded-button shadow-stamp-sm btn-press hover:brightness-95 transition-all"
          title="เพิ่ม preset"
        >
          <Plus size={13} />
        </button>
      )}

      {adding && (
        <div className="flex items-center gap-1">
          <input
            type="time"
            value={newStart}
            onChange={(e) => setNewStart(e.target.value)}
            className="h-7 px-1.5 border-1.5 border-ink-900 rounded-field font-mono text-xs bg-cream-50 outline-none focus:ring-1 focus:ring-tangerine"
          />
          <span className="font-mono text-xs text-ink-500">–</span>
          <input
            type="time"
            value={newEnd}
            onChange={(e) => setNewEnd(e.target.value)}
            className="h-7 px-1.5 border-1.5 border-ink-900 rounded-field font-mono text-xs bg-cream-50 outline-none focus:ring-1 focus:ring-tangerine"
          />
          <button
            onClick={handleAdd}
            className="h-7 px-2 bg-mint border-1.5 border-ink-900 rounded-button font-mono text-xs font-bold shadow-stamp-sm btn-press transition-all"
          >
            <Check size={12} />
          </button>
          <button
            onClick={() => setAdding(false)}
            className="h-7 px-2 bg-paper border-1.5 border-ink-900 rounded-button font-mono text-xs shadow-stamp-sm btn-press hover:bg-cream-50 transition-all"
          >
            <X size={12} />
          </button>
        </div>
      )}

      <button
        onClick={() => { setEditing(!editing); setAdding(false); }}
        className={cn(
          'h-6 w-6 flex items-center justify-center rounded-field border-1.5 border-ink-900 transition-all btn-press',
          editing ? 'bg-ink-900 text-paper' : 'bg-paper text-ink-500 hover:bg-cream-50',
        )}
        title={editing ? 'เสร็จแล้ว' : 'จัดการ presets'}
      >
        <Settings2 size={11} />
      </button>
    </div>
  );
}
