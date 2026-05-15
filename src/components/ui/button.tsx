import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap font-display font-bold transition-all btn-press disabled:opacity-50 disabled:pointer-events-none',
  {
    variants: {
      variant: {
        primary: 'bg-ink-900 text-paper border-1.5 border-ink-900 shadow-stamp-lemon hover:bg-ink-700',
        tangerine: 'bg-tangerine text-paper border-1.5 border-ink-900 shadow-stamp hover:brightness-110',
        lemon: 'bg-lemon text-ink-900 border-1.5 border-ink-900 shadow-stamp-sm hover:brightness-95',
        paper: 'bg-paper text-ink-900 border-1.5 border-ink-900 shadow-stamp-sm hover:bg-cream-50',
        ghost: 'text-ink-700 hover:bg-cream-100',
        danger: 'bg-rose text-ink-900 border-1.5 border-ink-900 shadow-stamp-sm hover:brightness-95',
      },
      size: {
        sm: 'h-8 px-3 text-[13px] rounded-button',
        md: 'h-10 px-4 text-sm rounded-button',
        lg: 'px-5 py-3.5 text-[15px] rounded-button',
        icon: 'h-9 w-9 rounded-field',
      },
    },
    defaultVariants: { variant: 'paper', size: 'md' },
  },
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant, size, ...props },
  ref,
) {
  return <button ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />;
});

export { buttonVariants };
