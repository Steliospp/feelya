import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function SearchInput({ placeholder = 'Search...', value, onChange, className }) {
  return (
    <div className={cn('relative', className)}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-text-muted pointer-events-none" />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full h-10 pl-10 pr-4 bg-surface-dim border border-border-light rounded-full text-[14px] text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-colors"
      />
    </div>
  );
}
