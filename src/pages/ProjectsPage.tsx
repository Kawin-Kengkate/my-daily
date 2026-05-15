import { useState } from 'react';
import { Trash2, Pencil, X, Check } from 'lucide-react';
import { notify } from '@/lib/notify';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { useProjects, useCreateProject, useDeleteProject, useUpdateProject, useProjectProgress } from '@/hooks/useProjects';
import { ProjectCode } from '@/components/ProjectCode';
import { DatePopover } from '@/components/DatePopover';
import { ProjectSparkline } from '@/features/projects/ProjectSparkline';
import { todayISO, addDays, toISO } from '@/lib/date';
import type { ProgressPoint } from '@/api/projects';
import { ProjectDraftSchema } from '@/lib/schemas';
import { friendlyDbError } from '@/lib/format';
import { cn } from '@/lib/utils';
import type { Project, ProjectStatus } from '@/types/db';

const STATUSES: ProjectStatus[] = ['active', 'on_hold', 'done', 'archived'];

const PALETTE: { name: string; hex: string }[] = [
  { name: 'peri', hex: '#6B7FE8' },
  { name: 'mint', hex: '#4FB389' },
  { name: 'tangerine', hex: '#FF6B35' },
  { name: 'lemon', hex: '#F7C548' },
  { name: 'rose', hex: '#F291A6' },
  { name: 'ink', hex: '#1E1E1E' },
];

interface DraftInput {
  code: string;
  name: string;
  description: string;
  color: string;
}

const blankDraft: DraftInput = { code: '', name: '', description: '', color: PALETTE[0].hex };

export function ProjectsPage() {
  const { data: projects = [] } = useProjects();
  const since = toISO(addDays(new Date(), -90));
  const { data: progressMap } = useProjectProgress(since);
  const create = useCreateProject();
  const del = useDeleteProject();
  const upd = useUpdateProject();
  const [draft, setDraft] = useState<DraftInput>(blankDraft);
  const [editId, setEditId] = useState<string | null>(null);

  const codeTaken = (code: string, exceptId?: string) =>
    projects.some((p) => p.code.toUpperCase() === code.toUpperCase() && p.id !== exceptId);

  const onAdd = async () => {
    const parsed = ProjectDraftSchema.safeParse(draft);
    if (!parsed.success) {
      notify.error(parsed.error.issues[0].message);
      return;
    }
    if (codeTaken(parsed.data.code)) {
      notify.error(`code "${parsed.data.code}" ซ้ำ`);
      return;
    }
    try {
      await create.mutateAsync({
        code: parsed.data.code,
        name: parsed.data.name,
        description: parsed.data.description || undefined,
        color: parsed.data.color,
      });
      setDraft(blankDraft);
      notify.success('สร้างแล้ว ✓');
    } catch (err) {
      notify.error(friendlyDbError(err));
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="font-display font-extrabold text-display">Projects</h2>

      <Card className="p-5 grid grid-cols-1 md:grid-cols-5 gap-3 items-end">
        <Input
          placeholder="Code (เช่น TAI)"
          value={draft.code}
          onChange={(e) => setDraft({ ...draft, code: e.target.value.toUpperCase().replace(/\s/g, '') })}
          className="font-mono uppercase"
        />
        <Input placeholder="Name" value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} />
        <Input placeholder="Description" value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} />
        <ColorPicker value={draft.color} onChange={(c) => setDraft({ ...draft, color: c })} />
        <Button variant="primary" onClick={onAdd} disabled={create.isPending}>+ Add project</Button>
      </Card>

      <Card className="overflow-hidden p-0">
        <table className="w-full text-sm">
          <thead className="bg-ink-900 text-paper font-display uppercase tracking-wider text-label">
            <tr>
              <th className="text-left px-4 py-2">Code</th>
              <th className="text-left px-4 py-2">Name</th>
              <th className="text-left px-4 py-2">Status</th>
              <th className="text-left px-4 py-2">Trend (90d)</th>
              <th className="text-left px-4 py-2">Description</th>
              <th className="text-right px-4 py-2 w-24">Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.length === 0 && (
              <tr><td colSpan={6} className="text-center py-8 text-ink-500 font-body">ยังไม่มีโปรเจค</td></tr>
            )}
            {projects.map((p) => (
              <ProjectRow
                key={p.id}
                project={p}
                progress={progressMap?.get(p.id) ?? []}
                isEditing={editId === p.id}
                onToggleEdit={() => setEditId(editId === p.id ? null : p.id)}
                onSave={async (patch) => {
                  if (patch.code && codeTaken(patch.code, p.id)) {
                    notify.error(`code "${patch.code}" ซ้ำ`);
                    return;
                  }
                  try {
                    await upd.mutateAsync({ id: p.id, patch });
                    setEditId(null);
                    notify.success('บันทึกแล้ว ✓');
                  } catch (err) {
                    notify.error(friendlyDbError(err));
                  }
                }}
                onDelete={() => { if (confirm(`ลบ ${p.code}?`)) del.mutate(p.id); }}
                onStatusChange={(status) => upd.mutate({ id: p.id, patch: { status } })}
              />
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

interface ProjectRowProps {
  project: Project;
  progress: ProgressPoint[];
  isEditing: boolean;
  onToggleEdit: () => void;
  onSave: (patch: Partial<Project>) => void;
  onDelete: () => void;
  onStatusChange: (s: ProjectStatus) => void;
}

function ProjectRow({ project: p, progress, isEditing, onToggleEdit, onSave, onDelete, onStatusChange }: ProjectRowProps) {
  const [form, setForm] = useState({
    code: p.code,
    name: p.name,
    description: p.description ?? '',
    color: p.color || PALETTE[0].hex,
    tags: (p.tags ?? []).join(', '),
    started_at: p.started_at ?? '',
    ended_at: p.ended_at ?? '',
  });

  if (!isEditing) {
    return (
      <tr className="border-t border-cream-300">
        <td className="px-4 py-2"><ProjectCode code={p.code} /></td>
        <td className="px-4 py-2 font-body">
          <div className="flex items-center gap-2">
            <span className="inline-block h-3 w-3 rounded-full border-1.5 border-ink-900" style={{ background: p.color }} />
            <span>{p.name}</span>
          </div>
        </td>
        <td className="px-4 py-2">
          <Select value={p.status} onChange={(e) => onStatusChange(e.target.value as ProjectStatus)} className="h-8">
            {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </Select>
        </td>
        <td className="px-4 py-2"><ProjectSparkline data={progress} color={p.color || '#6B7FE8'} /></td>
        <td className="px-4 py-2 font-body text-ink-700 text-xs">{p.description ?? '—'}</td>
        <td className="px-4 py-2 text-right">
          <div className="flex items-center justify-end gap-3">
            <button onClick={onToggleEdit} className="text-ink-700 hover:text-peri" title="Edit"><Pencil size={16} /></button>
            <button onClick={onDelete} className="text-ink-700 hover:text-rose" title="Delete"><Trash2 size={16} /></button>
          </div>
        </td>
      </tr>
    );
  }

  const parsed = ProjectDraftSchema.safeParse({
    code: form.code,
    name: form.name,
    description: form.description,
    color: form.color,
    tags: form.tags.split(',').map((s) => s.trim()).filter(Boolean),
    started_at: form.started_at || null,
    ended_at: form.ended_at || null,
  });

  const fieldErr = (k: string): string | undefined => {
    if (parsed.success) return undefined;
    return parsed.error.issues.find((i) => i.path[0] === k)?.message;
  };

  const handleSave = () => {
    if (!parsed.success) {
      notify.error(parsed.error.issues[0].message);
      return;
    }
    onSave({
      code: parsed.data.code,
      name: parsed.data.name,
      description: parsed.data.description || null,
      color: parsed.data.color,
      tags: parsed.data.tags ?? [],
      started_at: parsed.data.started_at ?? null,
      ended_at: parsed.data.ended_at ?? null,
    });
  };

  return (
    <tr className="border-t border-cream-300 bg-cream-50">
      <td colSpan={6} className="px-4 py-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <FieldEdit label="Code" error={fieldErr('code')}>
            <Input
              value={form.code}
              onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase().replace(/\s/g, '') })}
              className={cn('font-mono uppercase', fieldErr('code') && 'border-rose')}
            />
          </FieldEdit>
          <FieldEdit label="Name" error={fieldErr('name')}>
            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={cn(fieldErr('name') && 'border-rose')} />
          </FieldEdit>
          <FieldEdit label="Color">
            <ColorPicker value={form.color} onChange={(c) => setForm({ ...form, color: c })} />
          </FieldEdit>
          <FieldEdit label="Description" error={fieldErr('description')}>
            <Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </FieldEdit>
          <FieldEdit label="Tags (comma-separated)" error={fieldErr('tags')}>
            <Input value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} placeholder="frontend, urgent" />
          </FieldEdit>
          <div className="grid grid-cols-2 gap-2">
            <FieldEdit label="Started" error={fieldErr('started_at')}>
              <div className="flex items-center gap-1">
                <DatePopover value={form.started_at || todayISO()} onChange={(iso) => setForm({ ...form, started_at: iso })} />
                {form.started_at && (
                  <button type="button" onClick={() => setForm({ ...form, started_at: '' })} className="text-ink-500 hover:text-rose text-xs font-mono">clear</button>
                )}
              </div>
            </FieldEdit>
            <FieldEdit label="Ended" error={fieldErr('ended_at')}>
              <div className="flex items-center gap-1">
                <DatePopover value={form.ended_at || todayISO()} onChange={(iso) => setForm({ ...form, ended_at: iso })} />
                {form.ended_at && (
                  <button type="button" onClick={() => setForm({ ...form, ended_at: '' })} className="text-ink-500 hover:text-rose text-xs font-mono">clear</button>
                )}
              </div>
            </FieldEdit>
          </div>
        </div>
        <div className="flex gap-2 mt-4 justify-end">
          <Button variant="paper" size="sm" onClick={onToggleEdit}><X size={14} /> Cancel</Button>
          <Button variant="primary" size="sm" onClick={handleSave} disabled={!parsed.success}><Check size={14} /> Save</Button>
        </div>
      </td>
    </tr>
  );
}

function FieldEdit({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="block">
      <span className="font-display font-bold text-label text-ink-500 uppercase">{label}</span>
      <div className="mt-1.5">{children}</div>
      {error && <span className="text-rose text-[10px] font-mono">{error}</span>}
    </div>
  );
}

function ColorPicker({ value, onChange }: { value: string; onChange: (hex: string) => void }) {
  return (
    <div className="flex gap-1.5 flex-wrap items-center">
      {PALETTE.map((c) => (
        <button
          key={c.hex}
          type="button"
          onClick={() => onChange(c.hex)}
          className={cn(
            'h-7 w-7 rounded-full border-1.5 border-ink-900 transition-all',
            value.toLowerCase() === c.hex.toLowerCase() && 'ring-2 ring-ink-900 ring-offset-2 ring-offset-paper scale-110',
          )}
          style={{ background: c.hex }}
          title={c.name}
        />
      ))}
    </div>
  );
}
