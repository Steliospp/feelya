import { Search } from 'lucide-react';

export default function SearchInput({ placeholder = 'Search...', value, onChange, className = '' }) {
  return (
    <div className={`relative ${className}`}>
      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[16px] h-[16px] text-neutral-400 pointer-events-none" />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full h-10 pl-10 pr-4 bg-white border border-neutral-200 rounded-xl text-[14px] text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-300 transition-all"
      />
    </div>
  );
}
