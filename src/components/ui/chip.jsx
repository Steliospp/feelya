import { cn } from '@/lib/utils';

export function Chip({ active, children, onClick, className }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'inline-flex items-center h-8 px-4 rounded-full text-[13px] font-medium transition-all duration-150 whitespace-nowrap cursor-pointer no-underline hover:no-underline',
        active
          ? 'bg-primary text-white shadow-card'
          : 'bg-surface-dim text-text-secondary border border-border-light hover:border-primary/30 hover:text-primary',
        className
      )}
    >
      {children}
    </button>
  );
}

export function ChipRow({ className, children }) {
  return (
    <div className={cn('flex gap-2 overflow-x-auto scrollbar-none pb-1 -mx-4 px-4', className)}>
      {children}
    </div>
  );
}
