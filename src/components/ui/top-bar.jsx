import { cn } from '../../lib/utils';

export default function TopBar({ title, left, right, className }) {
  return (
    <header className={cn('flex items-center justify-between h-14 px-4', className)}>
      <div className="w-10 flex items-center justify-start">{left}</div>
      <h1 className="text-[17px] font-semibold text-text-primary">{title}</h1>
      <div className="w-10 flex items-center justify-end">{right}</div>
    </header>
  );
}
