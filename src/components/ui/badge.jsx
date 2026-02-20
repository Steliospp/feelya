import { cn } from '@/lib/utils';

const variants = {
  default: 'bg-primary-50 text-primary',
  success: 'bg-success-bg text-success',
  warning: 'bg-warning-bg text-warning',
  danger: 'bg-danger-bg text-danger',
  muted: 'bg-surface-dim text-text-secondary',
};

export default function Badge({ variant = 'default', className, children }) {
  return (
    <span className={cn(
      'inline-flex items-center h-6 px-2.5 rounded-full text-[12px] font-medium',
      variants[variant],
      className
    )}>
      {children}
    </span>
  );
}
