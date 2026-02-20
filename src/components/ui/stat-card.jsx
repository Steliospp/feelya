import Card from './card';
import { cn } from '../../lib/utils';

export default function StatCard({ icon, label, value, change, iconClassName }) {
  return (
    <Card elevation={1} className="!p-5">
      <div className="flex items-center justify-between mb-3">
        <div className={cn('w-10 h-10 rounded-[12px] flex items-center justify-center', iconClassName)}>
          {icon}
        </div>
        {change && (
          <span className="text-[13px] font-medium text-success bg-success-bg px-2 py-0.5 rounded-full">
            {change}
          </span>
        )}
      </div>
      <div className="text-[26px] font-semibold text-text-primary tracking-tight">{value}</div>
      <div className="text-[13px] text-text-secondary mt-1">{label}</div>
    </Card>
  );
}
