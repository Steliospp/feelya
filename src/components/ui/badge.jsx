const variantClasses = {
  default: 'bg-neutral-100 text-neutral-700',
  success: 'bg-emerald-50 text-emerald-600',
  warning: 'bg-amber-50 text-amber-600',
  danger: 'bg-red-50 text-red-600',
  muted: 'bg-neutral-100 text-neutral-500',
};

export default function Badge({ variant = 'default', className = '', children }) {
  return (
    <span className={`inline-flex items-center h-6 px-2.5 rounded-full text-[12px] font-medium ${variantClasses[variant] || ''} ${className}`}>
      {children}
    </span>
  );
}
