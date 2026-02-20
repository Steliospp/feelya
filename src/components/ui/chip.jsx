export function Chip({ active, children, onClick, className = '' }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center h-8 px-4 rounded-full text-[13px] font-medium transition-all duration-150 whitespace-nowrap cursor-pointer border-none no-underline hover:no-underline ${
        active
          ? 'bg-neutral-900 text-white'
          : 'bg-neutral-100 text-neutral-500 hover:text-neutral-700 hover:bg-neutral-200'
      } ${className}`}
    >
      {children}
    </button>
  );
}

export function ChipRow({ className = '', children }) {
  return (
    <div className={`flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 ${className}`}>
      {children}
    </div>
  );
}
