export default function TopBar({ title, left, right, className = '' }) {
  return (
    <header className={`flex items-center justify-between h-14 px-4 ${className}`}>
      <div className="w-10 flex items-center justify-start">{left}</div>
      <h1 className="text-[17px] font-semibold text-neutral-900">{title}</h1>
      <div className="w-10 flex items-center justify-end">{right}</div>
    </header>
  );
}
