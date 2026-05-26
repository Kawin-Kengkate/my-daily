import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, BookOpen, PartyPopper, Sparkles, Zap, Flame } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useLearningNudge, dismissLearningNudge } from '@/hooks/useLearningNudge';
import { cn } from '@/lib/utils';

interface LevelStyle {
  bg: string;
  accent: string;
  Icon: LucideIcon;
  text: (hrs: number, target: number, remaining: number) => string;
  showCTA: boolean;
}

const levelConfig: Record<'celebrate' | 'info' | 'warning' | 'urgent', LevelStyle> = {
  celebrate: {
    bg: 'bg-mint/25',
    accent: 'bg-mint text-paper',
    Icon: PartyPopper,
    text: (hrs) => `เป้าสัปดาห์นี้ครบแล้ว ${hrs.toFixed(1)} ชม. ✓`,
    showCTA: false,
  },
  info: {
    bg: 'bg-peri/15',
    accent: 'bg-peri text-paper',
    Icon: Sparkles,
    text: (hrs, target) =>
      hrs === 0 ? 'สัปดาห์นี้ยังไม่ได้ log learning เลย' : `เรียนไป ${hrs.toFixed(1)} / ${target} ชม.`,
    showCTA: true,
  },
  warning: {
    bg: 'bg-lemon/30',
    accent: 'bg-lemon text-ink-900',
    Icon: Zap,
    text: (_h, target, remaining) =>
      `ขาดอีก ${remaining.toFixed(1)} ชม. จะครบ ${target} ชม./สัปดาห์`,
    showCTA: true,
  },
  urgent: {
    bg: 'bg-tangerine/20',
    accent: 'bg-tangerine text-paper',
    Icon: Flame,
    text: (_h, target, remaining) =>
      `วันสุดท้าย — ขาดอีก ${remaining.toFixed(1)} ชม. (เป้า ${target} ชม.)`,
    showCTA: true,
  },
};

export function LearningNudgeBanner() {
  const { level, hoursLogged, weeklyTarget, hoursRemaining } = useLearningNudge();
  const navigate = useNavigate();
  const [dismissed, setDismissed] = useState(false);

  const visible = level !== 'hidden' && !dismissed;
  const config = visible ? levelConfig[level] : null;
  const Icon = config?.Icon ?? BookOpen;
  const message = config?.text(hoursLogged, weeklyTarget, hoursRemaining) ?? '';

  function handleDismiss() {
    dismissLearningNudge();
    setDismissed(true);
  }

  return (
    <AnimatePresence>
      {visible && config && (
        <motion.div
          initial={{ opacity: 0, y: -10, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 0.98 }}
          transition={{ type: 'spring', stiffness: 360, damping: 26 }}
          className={cn(
            'flex items-center gap-3 px-3 py-2.5 mb-4',
            'border-1.5 border-ink-900 rounded-card shadow-stamp',
            config.bg,
          )}
        >
          <div
            className={cn(
              'shrink-0 h-8 w-8 rounded-full border-1.5 border-ink-900 flex items-center justify-center shadow-stamp-sm',
              config.accent,
            )}
          >
            <Icon size={16} />
          </div>
          <span className="flex-1 font-display font-semibold text-sm text-ink-900">{message}</span>
          {config.showCTA && (
            <button
              type="button"
              onClick={() => navigate('/learning/new')}
              className="shrink-0 px-3 py-1.5 border-1.5 border-ink-900 rounded-field bg-paper font-display font-bold text-xs shadow-stamp-sm active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-transform"
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
        </motion.div>
      )}
    </AnimatePresence>
  );
}
