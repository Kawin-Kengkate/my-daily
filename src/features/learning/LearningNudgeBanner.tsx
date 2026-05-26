import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, BookOpen } from 'lucide-react';
import { useLearningNudge, dismissLearningNudge } from '@/hooks/useLearningNudge';
import { cn } from '@/lib/utils';

const levelConfig = {
  celebrate: {
    bg: 'bg-mint/20',
    text: (hrs: number) => `เป้าสัปดาห์นี้ครบแล้ว ${hrs.toFixed(1)} ชม. ✓`,
    showCTA: false,
  },
  info: {
    bg: 'bg-peri/10',
    text: (hrs: number, target: number) =>
      hrs === 0 ? 'สัปดาห์นี้ยังไม่ได้ log learning เลย' : `เรียนไป ${hrs.toFixed(1)} / ${target} ชม.`,
    showCTA: true,
  },
  warning: {
    bg: 'bg-lemon/20',
    text: (_hrs: number, target: number, remaining: number) =>
      `ขาดอีก ${remaining.toFixed(1)} ชม. จะครบ ${target} ชม./สัปดาห์`,
    showCTA: true,
  },
  urgent: {
    bg: 'bg-tangerine/15',
    text: (_hrs: number, target: number, remaining: number) =>
      `วันสุดท้ายของสัปดาห์ — ขาดอีก ${remaining.toFixed(1)} ชม. (เป้า ${target} ชม.)`,
    showCTA: true,
  },
};

export function LearningNudgeBanner() {
  const { level, hoursLogged, weeklyTarget, hoursRemaining } = useLearningNudge();
  const navigate = useNavigate();
  const [dismissed, setDismissed] = useState(false);

  if (level === 'hidden' || dismissed) return null;

  const config = levelConfig[level];
  const message = config.text(hoursLogged, weeklyTarget, hoursRemaining);

  function handleDismiss() {
    dismissLearningNudge();
    setDismissed(true);
  }

  return (
    <div
      className={cn(
        'flex items-center gap-3 px-4 py-2.5 mb-4',
        'border-1.5 border-ink-900 rounded-card shadow-stamp-sm',
        config.bg,
      )}
    >
      <BookOpen size={16} className="shrink-0 text-ink-700" />
      <span className="flex-1 font-display font-semibold text-sm text-ink-900">{message}</span>
      {config.showCTA && (
        <button
          type="button"
          onClick={() => navigate('/learning/new')}
          className="shrink-0 px-3 py-1 border-1.5 border-ink-900 rounded-field bg-paper font-display font-bold text-xs shadow-stamp-sm active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-transform"
        >
          Log session
        </button>
      )}
      <button
        type="button"
        onClick={handleDismiss}
        aria-label="Dismiss"
        className="shrink-0 h-6 w-6 flex items-center justify-center rounded-full hover:bg-paper/60 text-ink-700"
      >
        <X size={13} />
      </button>
    </div>
  );
}
