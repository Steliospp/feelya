import { cn } from '@/lib/utils';

const variants = {
  primary: 'bg-gradient-to-br from-primary to-violet text-white shadow-card hover:shadow-elevated active:scale-[0.98]',
  secondary: 'bg-primary-50 text-primary border border-primary/20 hover:bg-primary-100 active:scale-[0.98]',
  outline: 'bg-transparent text-text-secondary border border-border hover:border-primary hover:text-primary active:scale-[0.98]',
  ghost: 'bg-transparent text-text-secondary hover:bg-surface-dim active:scale-[0.98]',
  danger: 'bg-danger text-white hover:bg-danger/90 active:scale-[0.98]',
  white: 'bg-white text-primary shadow-card hover:shadow-elevated active:scale-[0.98]',
};

const sizes = {
  sm: 'h-8 px-3 text-[13px] gap-1.5',
  md: 'h-10 px-4 text-[14px] gap-2',
  lg: 'h-12 px-6 text-[15px] gap-2',
};

export default function Button({ variant = 'primary', size = 'md', full, className, children, ...props }) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center font-semibold rounded-[12px] transition-all duration-150 cursor-pointer no-underline',
        'hover:no-underline focus:no-underline active:no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
        'disabled:opacity-50 disabled:pointer-events-none',
        variants[variant],
        sizes[size],
        full && 'w-full',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
