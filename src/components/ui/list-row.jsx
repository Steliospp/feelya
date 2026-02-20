import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ListRow({ icon, label, desc, onClick, right, className }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex items-center gap-3 w-full px-4 py-3 text-left bg-transparent hover:bg-surface-dim transition-colors rounded-[12px] cursor-pointer no-underline hover:no-underline',
        className
      )}
    >
      {icon && <div className="w-10 h-10 rounded-[12px] bg-primary-50 flex items-center justify-center text-primary shrink-0">{icon}</div>}
      <div className="flex-1 min-w-0">
        <div className="text-[15px] font-medium text-text-primary truncate">{label}</div>
        {desc && <div className="text-[13px] text-text-secondary truncate">{desc}</div>}
      </div>
      {right || <ChevronRight className="w-[18px] h-[18px] text-text-muted shrink-0" />}
    </button>
  );
}
