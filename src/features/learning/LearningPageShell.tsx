import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface Props {
  children: ReactNode;
  className?: string;
}

// Wrapper ที่ apply bg-peri/5 surface tint สำหรับทุกหน้าใน /learning/*
export function LearningPageShell({ children, className }: Props) {
  return (
    <div className={cn('min-h-full -mx-5 md:-mx-8 -my-6 px-5 md:px-8 py-6 pb-14 md:pb-6 bg-peri/5', className)}>
      {children}
    </div>
  );
}
