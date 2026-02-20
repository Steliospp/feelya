import { cn } from '@/lib/utils';

export default function EmptyState({ icon, title, desc, action, className }) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-12 px-4 text-center', className)}>
      {icon && <div className="w-12 h-12 rounded-full bg-surface-dim flex items-center justify-center text-text-muted mb-3">{icon}</div>}
      <h3 className="text-[16px] font-semibold text-text-primary mb-1">{title}</h3>
      {desc && <p className="text-[14px] text-text-secondary max-w-[280px]">{desc}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
