import { ChevronRight } from 'lucide-react';

export default function ListRow({ icon, label, desc, onClick, right, className = '' }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-3 w-full px-4 py-3 text-left bg-transparent hover:bg-neutral-50 transition-colors rounded-xl cursor-pointer border-none no-underline hover:no-underline ${className}`}
    >
      {icon && <div className="w-10 h-10 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-600 shrink-0">{icon}</div>}
      <div className="flex-1 min-w-0">
        <div className="text-[15px] font-medium text-neutral-900 truncate">{label}</div>
        {desc && <div className="text-[13px] text-neutral-500 truncate">{desc}</div>}
      </div>
      {right || <ChevronRight className="w-[18px] h-[18px] text-neutral-400 shrink-0" />}
    </button>
  );
}
