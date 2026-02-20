export default function Card({ className = '', children, ...props }) {
  return (
    <div className={`bg-white rounded-2xl shadow-sm p-4 ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardHeader({ className = '', children }) {
  return <div className={`mb-3 ${className}`}>{children}</div>;
}

export function CardTitle({ className = '', children }) {
  return <h3 className={`text-[16px] font-semibold text-neutral-900 ${className}`}>{children}</h3>;
}

export function CardDescription({ className = '', children }) {
  return <p className={`text-[13px] text-neutral-500 mt-0.5 ${className}`}>{children}</p>;
}
