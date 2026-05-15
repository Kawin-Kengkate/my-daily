import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface Props {
  className?: string;
  rounded?: 'field' | 'card' | 'card-lg';
  bordered?: boolean;
}

export function Skeleton({ className, rounded = 'field', bordered = false }: Props) {
  return (
    <div
      className={cn(
        'relative overflow-hidden bg-cream-200',
        rounded === 'field' && 'rounded-field',
        rounded === 'card' && 'rounded-card',
        rounded === 'card-lg' && 'rounded-card-lg',
        bordered && 'border-1.5 border-ink-900',
        className,
      )}
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-paper/60 to-transparent"
        initial={{ x: '-100%' }}
        animate={{ x: '100%' }}
        transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  );
}

export function PageSkeleton() {
  return (
    <div className="space-y-5 max-w-6xl mx-auto px-5 md:px-8 py-6">
      <Skeleton className="h-9 w-48" />
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-24" rounded="card-lg" bordered />
        ))}
      </div>
      <Skeleton className="h-64" rounded="card" bordered />
    </div>
  );
}
