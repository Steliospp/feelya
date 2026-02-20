const variantClasses = {
  primary: 'bg-neutral-900 text-white hover:bg-neutral-800 active:scale-[0.98]',
  secondary: 'bg-neutral-100 text-neutral-900 hover:bg-neutral-200 active:scale-[0.98]',
  outline: 'bg-transparent text-neutral-600 border border-neutral-200 hover:border-neutral-300 hover:text-neutral-900 active:scale-[0.98]',
  ghost: 'bg-transparent text-neutral-500 hover:bg-neutral-100 hover:text-neutral-700 active:scale-[0.98]',
  danger: 'bg-red-500 text-white hover:bg-red-600 active:scale-[0.98]',
  white: 'bg-white text-neutral-900 shadow-sm hover:shadow active:scale-[0.98]',
};

const sizeClasses = {
  sm: 'h-8 px-3 text-[13px] gap-1.5',
  md: 'h-10 px-4 text-[14px] gap-2',
  lg: 'h-12 px-6 text-[15px] gap-2',
};

export default function Button({ variant = 'primary', size = 'md', full, className = '', children, ...props }) {
  return (
    <button
      className={`inline-flex items-center justify-center font-medium rounded-xl transition-all duration-150 cursor-pointer border-none no-underline hover:no-underline disabled:opacity-50 disabled:pointer-events-none ${variantClasses[variant] || ''} ${sizeClasses[size] || ''} ${full ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
