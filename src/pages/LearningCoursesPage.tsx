import { useState } from 'react';
import { Plus, BookOpen } from 'lucide-react';
import { LearningPageShell } from '@/features/learning/LearningPageShell';
import { CourseCard } from '@/features/learning/CourseCard';
import { Arc } from '@/components/Arc';
import { Pill } from '@/components/Pill';
import { Button } from '@/components/ui/button';
import { Field } from '@/components/Field';
import { useLearningCourses, useCreateCourse, useSeedStarterCourses } from '@/hooks/useLearningCourses';
import { useAllSessions } from '@/hooks/useLearningSessions';
import { notify } from '@/lib/notify';
import type { CourseStatus } from '@/types/db';
import { cn } from '@/lib/utils';

export function LearningCoursesPage() {
  const { data: courses = [], isLoading } = useLearningCourses();
  const { data: allSessions = [] } = useAllSessions();
  const seedCourses = useSeedStarterCourses();
  const createCourse = useCreateCourse();

  const [showForm, setShowForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newCode, setNewCode] = useState('');
  const [newPhase, setNewPhase] = useState<string>('1');

  const active = courses.filter((c) => c.status === 'active');
  const paused = courses.filter((c) => c.status === 'paused');
  const done = courses.filter((c) => c.status === 'done');
  const dropped = courses.filter((c) => c.status === 'dropped');

  async function handleSeed() {
    try {
      await seedCourses.mutateAsync();
      notify.success('เพิ่ม starter courses แล้ว');
    } catch {
      notify.error('เพิ่มไม่สำเร็จ');
    }
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!newName.trim() || !newCode.trim()) return;
    try {
      await createCourse.mutateAsync({
        name: newName.trim(),
        code: newCode.trim().toUpperCase(),
        phase: newPhase ? Number(newPhase) : null,
        status: 'active' as CourseStatus,
      });
      notify.success(`เพิ่ม ${newCode.toUpperCase()} แล้ว`);
      setNewName('');
      setNewCode('');
      setNewPhase('1');
      setShowForm(false);
    } catch {
      notify.error('เพิ่มคอร์สไม่สำเร็จ');
    }
  }

  if (isLoading) {
    return (
      <LearningPageShell>
        <div className="grid sm:grid-cols-2 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-40 rounded-card border-1.5 border-ink-900 bg-paper animate-pulse" />
          ))}
        </div>
      </LearningPageShell>
    );
  }

  return (
    <LearningPageShell>
      {/* Header */}
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <div className="relative inline-block">
            <h1 className="font-display font-extrabold text-h2">Courses</h1>
            <Arc width={80} className="absolute -bottom-3 left-0" />
          </div>
          <div className="flex items-center gap-2 mt-4 flex-wrap">
            <Pill className="font-mono text-xs">Active: {active.length}</Pill>
            <Pill className="font-mono text-xs">Paused: {paused.length}</Pill>
            {done.length > 0 && <Pill className="font-mono text-xs bg-peri/10">Done: {done.length}</Pill>}
          </div>
        </div>
        <button
          type="button"
          onClick={() => setShowForm((v) => !v)}
          className="shrink-0 flex items-center gap-1.5 px-3 py-2 border-1.5 border-ink-900 rounded-button bg-paper shadow-stamp font-display font-bold text-sm active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-transform"
        >
          <Plus size={14} />
          New course
        </button>
      </div>

      {/* Empty state — seed */}
      {courses.length === 0 && (
        <div className="text-center py-12 space-y-4">
          <BookOpen size={40} className="mx-auto text-peri" />
          <p className="font-body text-ink-500">ยังไม่มีคอร์ส</p>
          <Button
            onClick={handleSeed}
            disabled={seedCourses.isPending}
            className="bg-lemon border-1.5 border-ink-900 font-display font-bold shadow-stamp active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
          >
            {seedCourses.isPending ? 'กำลังเพิ่ม…' : 'เพิ่ม starter courses จาก learning plan'}
          </Button>
        </div>
      )}

      {/* New course form */}
      {showForm && (
        <form
          onSubmit={handleCreate}
          className="mb-6 p-4 bg-paper border-1.5 border-ink-900 rounded-card shadow-stamp space-y-3"
        >
          <div className="font-display font-bold text-sm">เพิ่มคอร์สใหม่</div>
          <div className="grid sm:grid-cols-3 gap-3">
            <Field
              label="ชื่อคอร์ส"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="FastAPI Complete Course"
              containerClassName="sm:col-span-2"
            />
            <Field
              label="Code (2-4 ตัว)"
              value={newCode}
              onChange={(e) => setNewCode(e.target.value.toUpperCase())}
              placeholder="FA"
              maxLength={8}
            />
          </div>
          <div>
            <label className="font-display font-bold text-label text-ink-500 uppercase">Phase</label>
            <select
              value={newPhase}
              onChange={(e) => setNewPhase(e.target.value)}
              className="mt-1.5 h-10 px-3.5 bg-cream-50 border-1.5 border-ink-900 rounded-field shadow-stamp-sm font-body text-sm font-semibold outline-none"
            >
              <option value="1">Phase 1</option>
              <option value="2">Phase 2</option>
              <option value="3">Phase 3</option>
              <option value="4">Phase 4</option>
            </select>
          </div>
          <div className="flex gap-2 pt-1">
            <Button
              type="submit"
              disabled={createCourse.isPending || !newName.trim() || !newCode.trim()}
              className={cn(
                'bg-lemon border-1.5 border-ink-900 font-display font-bold shadow-stamp',
                'active:translate-x-[1px] active:translate-y-[1px] active:shadow-none',
              )}
            >
              เพิ่ม
            </Button>
            <Button type="button" variant="paper" onClick={() => setShowForm(false)}>
              ยกเลิก
            </Button>
          </div>
        </form>
      )}

      {/* Course list */}
      {courses.length > 0 && (
        <div className="space-y-6">
          {active.length > 0 && (
            <section>
              <div className="font-display font-bold text-label text-ink-500 uppercase mb-3">Active</div>
              <div className="grid sm:grid-cols-2 gap-3">
                {active.map((c) => <CourseCard key={c.id} course={c} allSessions={allSessions} />)}
              </div>
            </section>
          )}
          {paused.length > 0 && (
            <section>
              <div className="font-display font-bold text-label text-ink-500 uppercase mb-3">Paused</div>
              <div className="grid sm:grid-cols-2 gap-3">
                {paused.map((c) => <CourseCard key={c.id} course={c} allSessions={allSessions} />)}
              </div>
            </section>
          )}
          {done.length > 0 && (
            <section>
              <div className="font-display font-bold text-label text-ink-500 uppercase mb-3">Done ✓</div>
              <div className="grid sm:grid-cols-2 gap-3">
                {done.map((c) => <CourseCard key={c.id} course={c} allSessions={allSessions} />)}
              </div>
            </section>
          )}
          {dropped.length > 0 && (
            <section>
              <div className="font-display font-bold text-label text-ink-500 uppercase mb-3">Dropped</div>
              <div className="grid sm:grid-cols-2 gap-3">
                {dropped.map((c) => <CourseCard key={c.id} course={c} allSessions={allSessions} />)}
              </div>
            </section>
          )}
        </div>
      )}
    </LearningPageShell>
  );
}
