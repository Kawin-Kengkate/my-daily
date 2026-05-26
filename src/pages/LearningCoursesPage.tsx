import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, BookOpen, Sparkles } from 'lucide-react';
import { LearningPageShell } from '@/features/learning/LearningPageShell';
import { CourseCard } from '@/features/learning/CourseCard';
import { Arc } from '@/components/Arc';
import { Squiggle } from '@/components/Squiggle';
import { DotGrid } from '@/components/DotGrid';
import { Button } from '@/components/ui/button';
import { Field } from '@/components/Field';
import { useLearningCourses, useCreateCourse, useSeedStarterCourses } from '@/hooks/useLearningCourses';
import { useAllSessions } from '@/hooks/useLearningSessions';
import { notify } from '@/lib/notify';
import type { CourseStatus } from '@/types/db';
import { cn } from '@/lib/utils';

type FilterKey = 'all' | 'active' | 'paused' | 'done' | 'dropped';

export function LearningCoursesPage() {
  const { data: courses = [], isLoading } = useLearningCourses();
  const { data: allSessions = [] } = useAllSessions();
  const seedCourses = useSeedStarterCourses();
  const createCourse = useCreateCourse();

  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState<FilterKey>('active');
  const [newName, setNewName] = useState('');
  const [newCode, setNewCode] = useState('');
  const [newPhase, setNewPhase] = useState<string>('1');

  const counts = useMemo(() => ({
    all: courses.length,
    active: courses.filter((c) => c.status === 'active').length,
    paused: courses.filter((c) => c.status === 'paused').length,
    done: courses.filter((c) => c.status === 'done').length,
    dropped: courses.filter((c) => c.status === 'dropped').length,
  }), [courses]);

  const filtered = useMemo(
    () => (filter === 'all' ? courses : courses.filter((c) => c.status === filter)),
    [courses, filter],
  );

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

  const filterTabs: { key: FilterKey; label: string }[] = [
    { key: 'active', label: 'Active' },
    { key: 'paused', label: 'Paused' },
    { key: 'done', label: 'Done' },
    { key: 'dropped', label: 'Dropped' },
    { key: 'all', label: 'All' },
  ];

  return (
    <LearningPageShell>
      {/* Header */}
      <div className="mb-5 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="relative inline-block">
            <h1 className="font-display font-extrabold text-h2">Courses</h1>
            <Arc width={80} className="absolute -bottom-3 left-0" />
          </div>
          <p className="font-body text-sm text-ink-500 mt-4">
            {counts.all} คอร์ส · active {counts.active} · paused {counts.paused}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowForm((v) => !v)}
          className="shrink-0 flex items-center gap-1.5 px-3 py-2 border-1.5 border-ink-900 rounded-button bg-paper shadow-stamp font-display font-bold text-sm active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-transform"
        >
          <Plus size={14} />
          <span className="hidden sm:inline">New course</span>
          <span className="sm:hidden">New</span>
        </button>
      </div>

      {/* Empty state — seed */}
      {courses.length === 0 ? (
        <div className="relative text-center py-14 px-6 bg-paper border-1.5 border-ink-900 rounded-card-lg shadow-stamp overflow-hidden">
          <DotGrid rows={5} cols={5} gap={9} dotSize={3} className="absolute -top-1 -left-1 opacity-40" />
          <Squiggle width={120} className="mx-auto text-peri mb-3" />
          <BookOpen size={36} className="mx-auto text-peri" />
          <p className="font-display font-bold text-base mt-3">ยังไม่มีคอร์ส</p>
          <p className="font-body text-sm text-ink-500 mt-1">เริ่มจาก starter set จาก learning plan ก็ได้</p>
          <Button
            onClick={handleSeed}
            disabled={seedCourses.isPending}
            className="mt-5 bg-lemon border-1.5 border-ink-900 font-display font-bold shadow-stamp active:translate-x-[1px] active:translate-y-[1px] active:shadow-none gap-1.5"
          >
            <Sparkles size={14} />
            {seedCourses.isPending ? 'กำลังเพิ่ม…' : 'เพิ่ม starter courses'}
          </Button>
        </div>
      ) : (
        <>
          {/* Filter tabs */}
          <div
            role="tablist"
            aria-label="Course filter"
            className="mb-4 flex gap-1.5 overflow-x-auto -mx-1 px-1 pb-1"
          >
            {filterTabs.map((t) => {
              const active = filter === t.key;
              const count = counts[t.key];
              if (t.key !== 'all' && count === 0) return null;
              return (
                <button
                  key={t.key}
                  role="tab"
                  aria-selected={active}
                  type="button"
                  onClick={() => setFilter(t.key)}
                  className={cn(
                    'relative shrink-0 px-3 py-1.5 rounded-full border-1.5 border-ink-900 font-display font-bold text-xs transition-transform',
                    'active:translate-x-[1px] active:translate-y-[1px] active:shadow-none',
                    active
                      ? 'bg-ink-900 text-paper shadow-none'
                      : 'bg-paper text-ink-700 shadow-stamp-sm hover:bg-cream-100',
                  )}
                >
                  {t.label}
                  <span
                    className={cn(
                      'ml-1.5 font-mono text-[10px]',
                      active ? 'text-paper/70' : 'text-ink-400',
                    )}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* New course form */}
          <AnimatePresence>
            {showForm && (
              <motion.form
                initial={{ opacity: 0, y: -8, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                exit={{ opacity: 0, y: -8, height: 0 }}
                transition={{ duration: 0.2 }}
                onSubmit={handleCreate}
                className="mb-5 overflow-hidden"
              >
                <div className="p-4 bg-paper border-1.5 border-ink-900 rounded-card shadow-stamp space-y-3">
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
                </div>
              </motion.form>
            )}
          </AnimatePresence>

          {/* Course list (filtered) */}
          {filtered.length === 0 ? (
            <div className="text-center py-10 font-body text-ink-400 text-sm">
              ไม่มีคอร์สในกลุ่มนี้
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-4 pt-2">
              {filtered.map((c) => (
                <CourseCard key={c.id} course={c} allSessions={allSessions} />
              ))}
            </div>
          )}
        </>
      )}
    </LearningPageShell>
  );
}
