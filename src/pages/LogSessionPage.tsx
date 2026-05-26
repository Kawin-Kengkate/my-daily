import { LearningPageShell } from '@/features/learning/LearningPageShell';
import { LogSessionForm } from '@/features/learning/LogSessionForm';
import { Arc } from '@/components/Arc';

export function LogSessionPage() {
  return (
    <LearningPageShell>
      <div className="mb-6">
        <div className="relative inline-block">
          <h1 className="font-display font-extrabold text-h2">Log Session</h1>
          <Arc width={100} className="absolute -bottom-3 left-0" />
        </div>
        <p className="font-body text-sm text-ink-500 mt-4">บันทึก session การเรียนครั้งนี้</p>
      </div>
      <LogSessionForm />
    </LearningPageShell>
  );
}
