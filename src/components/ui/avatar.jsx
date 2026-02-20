const sizeClasses = {
  sm: 'w-8 h-8 text-[12px]',
  md: 'w-10 h-10 text-[14px]',
  lg: 'w-12 h-12 text-[16px]',
  xl: 'w-16 h-16 text-[20px]',
};

export default function Avatar({ src, name, size = 'md', color, className = '' }) {
  const initials = name ? name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : '?';
  const sizeClass = sizeClasses[size] || sizeClasses.md;

  if (src) {
    return (
      <img
        src={src}
        alt={name || ''}
        className={`rounded-full object-cover ${sizeClass} ${className}`}
      />
    );
  }

  return (
    <div
      className={`rounded-full flex items-center justify-center font-semibold text-white ${sizeClass} ${className}`}
      style={{ backgroundColor: color || '#18181b' }}
    >
      {initials}
    </div>
  );
}
