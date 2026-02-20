export default function EmptyState({ icon, title, desc, action, className = '' }) {
  return (
    <div className={`flex flex-col items-center justify-center py-12 px-4 text-center ${className}`}>
      {icon && <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400 mb-3">{icon}</div>}
      <h3 className="text-[16px] font-semibold text-neutral-900 mb-1">{title}</h3>
      {desc && <p className="text-[14px] text-neutral-500 max-w-[280px]">{desc}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
