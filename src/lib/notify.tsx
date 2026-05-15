import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

type Kind = 'success' | 'error' | 'info';

const styles: Record<Kind, { bg: string; Icon: typeof CheckCircle2; emoji: string }> = {
  success: { bg: 'bg-mint-soft', Icon: CheckCircle2, emoji: '✓' },
  error: { bg: 'bg-rose-soft', Icon: AlertCircle, emoji: '!' },
  info: { bg: 'bg-peri-soft', Icon: Info, emoji: 'i' },
};

function ToastCard({
  kind,
  message,
  onDismiss,
}: {
  kind: Kind;
  message: ReactNode;
  onDismiss: () => void;
}) {
  const { bg, Icon } = styles[kind];
  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.9, rotate: -2 }}
      animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 500, damping: 22 }}
      className={cn(
        'min-w-[260px] max-w-[360px] flex items-center gap-3 pl-3 pr-2 py-2.5',
        'border-1.5 border-ink-900 rounded-card shadow-stamp font-body',
        bg,
      )}
    >
      <motion.div
        initial={{ scale: 0, rotate: -90 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 600, damping: 18, delay: 0.05 }}
        className="shrink-0 h-7 w-7 flex items-center justify-center bg-paper border-1.5 border-ink-900 rounded-full"
      >
        <Icon size={15} className="text-ink-900" />
      </motion.div>
      <div className="flex-1 font-display font-bold text-sm text-ink-900">{message}</div>
      <button
        type="button"
        onClick={onDismiss}
        className="shrink-0 h-6 w-6 flex items-center justify-center rounded-full hover:bg-paper/60 text-ink-700"
        aria-label="Dismiss"
      >
        <X size={14} />
      </button>
    </motion.div>
  );
}

function show(kind: Kind, message: ReactNode, duration = 3000) {
  return toast.custom(
    (id) => <ToastCard kind={kind} message={message} onDismiss={() => toast.dismiss(id)} />,
    { duration },
  );
}

export const notify = {
  success: (msg: ReactNode, duration?: number) => show('success', msg, duration),
  error: (msg: ReactNode, duration?: number) => show('error', msg, duration ?? 4500),
  info: (msg: ReactNode, duration?: number) => show('info', msg, duration),
};
